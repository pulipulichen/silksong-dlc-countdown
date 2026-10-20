#!/usr/bin/env python3
"""Track running Cursor conversations for the current project.

This hook is deliberately observational: it never limits concurrency or blocks
an agent prompt. Runtime state is stored outside the repository in the
operating system's temporary directory.
"""

from __future__ import annotations

import argparse
import contextlib
import datetime as dt
import hashlib
import json
import os
import sys
import tempfile
import time
from pathlib import Path
from typing import Any, Iterator

if os.name == "nt":
    import msvcrt
else:
    import fcntl


STATE_DIRECTORY = Path(tempfile.gettempdir()) / "cursor-project-thread-status"
# This stale timeout is only for crash recovery; it is not an exact measure
# of Agent runtime.
STALE_TIMEOUT_SECONDS = 4 * 60 * 60
# Cursor reports Ask mode as ``chat`` in ``composer_mode``.  Keep both names
# here so the state remains understandable if Cursor starts reporting the UI
# label directly.
NON_AGENT_COMPOSER_MODES = frozenset({"ask", "chat", "plan"})


def project_root() -> str:
    return os.path.realpath(os.getcwd())


def state_path(root: str) -> Path:
    project_id = hashlib.sha256(root.encode("utf-8")).hexdigest()
    return STATE_DIRECTORY / f"{project_id}.json"


def lock_path(root: str) -> Path:
    project_id = hashlib.sha256(root.encode("utf-8")).hexdigest()
    return STATE_DIRECTORY / f"{project_id}.lock"


def utc_now() -> str:
    return (
        dt.datetime.now(dt.timezone.utc)
        .replace(microsecond=0)
        .isoformat()
        .replace("+00:00", "Z")
    )


def parse_timestamp(value: Any) -> dt.datetime | None:
    if not isinstance(value, str):
        return None
    try:
        parsed = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=dt.timezone.utc)
    return parsed.astimezone(dt.timezone.utc)


def remove_stale_threads(threads: dict[str, dict[str, Any]], now: dt.datetime) -> None:
    stale_ids = []
    for conversation_id, entry in threads.items():
        updated_at = parse_timestamp(entry.get("updated_at"))
        if updated_at is None or (now - updated_at).total_seconds() > STALE_TIMEOUT_SECONDS:
            stale_ids.append(conversation_id)
    for conversation_id in stale_ids:
        del threads[conversation_id]


def normalise_state(raw_state: Any, root: str) -> dict[str, Any]:
    if not isinstance(raw_state, dict):
        raw_state = {}
    raw_threads = raw_state.get("threads")
    threads: dict[str, dict[str, Any]] = {}
    if isinstance(raw_threads, dict):
        for conversation_id, entry in raw_threads.items():
            if isinstance(conversation_id, str) and isinstance(entry, dict):
                threads[conversation_id] = entry
    state = {"project_root": root, "threads": threads}
    remove_stale_threads(threads, dt.datetime.now(dt.timezone.utc))
    return state


def read_state(root: str) -> dict[str, Any]:
    try:
        with state_path(root).open(encoding="utf-8") as handle:
            return normalise_state(json.load(handle), root)
    except (FileNotFoundError, json.JSONDecodeError, OSError):
        return {"project_root": root, "threads": {}}


def write_state(root: str, state: dict[str, Any]) -> None:
    STATE_DIRECTORY.mkdir(mode=0o700, parents=True, exist_ok=True)
    state_file = state_path(root)
    file_descriptor, temporary_name = tempfile.mkstemp(
        prefix=f".{state_file.name}.",
        suffix=".tmp",
        dir=STATE_DIRECTORY,
    )
    try:
        # The lock serializes read-modify-write; replace keeps readers from
        # observing partially written JSON.
        with os.fdopen(file_descriptor, "w", encoding="utf-8") as handle:
            json.dump(state, handle, ensure_ascii=False, indent=2)
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary_name, state_file)
    finally:
        with contextlib.suppress(FileNotFoundError):
            os.unlink(temporary_name)


@contextlib.contextmanager
def locked_state(root: str) -> Iterator[dict[str, Any]]:
    STATE_DIRECTORY.mkdir(mode=0o700, parents=True, exist_ok=True)
    if os.name == "nt":
        lock_file = lock_path(root).open("a+b")
    else:
        lock_file = lock_path(root).open("a+", encoding="utf-8")
    with lock_file:
        if os.name == "nt":
            lock_file.seek(0, os.SEEK_END)
            if lock_file.tell() == 0:
                lock_file.write(b"\0")
                lock_file.flush()
            lock_file.seek(0)
            while True:
                try:
                    msvcrt.locking(lock_file.fileno(), msvcrt.LK_NBLCK, 1)
                    break
                except OSError:
                    time.sleep(0.1)
        else:
            fcntl.flock(lock_file.fileno(), fcntl.LOCK_EX)
        state = read_state(root)
        try:
            yield state
        finally:
            write_state(root, state)
            if os.name == "nt":
                lock_file.seek(0)
                msvcrt.locking(lock_file.fileno(), msvcrt.LK_UNLCK, 1)
            else:
                fcntl.flock(lock_file.fileno(), fcntl.LOCK_UN)


def string_value(input_data: dict[str, Any], key: str) -> str | None:
    value = input_data.get(key)
    return value if isinstance(value, str) and value else None


def composer_mode(input_data: dict[str, Any]) -> str | None:
    value = string_value(input_data, "composer_mode")
    return value.strip().lower() if value else None


def counts_as_running_thread(entry: dict[str, Any]) -> bool:
    mode = entry.get("composer_mode")
    # Entries created before mode tracking was added remain counted.
    return not isinstance(mode, str) or mode not in NON_AGENT_COMPOSER_MODES


def handle_hook(input_data: dict[str, Any]) -> None:
    root = project_root()
    event_name = string_value(input_data, "hook_event_name")
    conversation_id = string_value(input_data, "conversation_id")
    if not conversation_id:
        return

    with locked_state(root) as state:
        threads = state["threads"]
        now = utc_now()
        remove_stale_threads(threads, dt.datetime.now(dt.timezone.utc))
        completion_status = string_value(input_data, "status")
        if event_name in {"stop", "completed", "aborted", "error"} or (
            completion_status in {"completed", "aborted", "error"}
        ):
            threads.pop(conversation_id, None)
        elif event_name == "beforeSubmitPrompt":
            existing = threads.get(conversation_id)
            current_composer_mode = composer_mode(input_data)
            threads[conversation_id] = {
                "conversation_id": conversation_id,
                "generation_id": string_value(input_data, "generation_id")
                or (existing or {}).get("generation_id"),
                "composer_mode": current_composer_mode
                or (existing or {}).get("composer_mode"),
                "started_at": (existing or {}).get("started_at") or now,
                "updated_at": now,
            }


def load_status(root: str, cleanup: bool = False) -> dict[str, Any]:
    with locked_state(root) as state:
        if cleanup:
            remove_stale_threads(
                state["threads"], dt.datetime.now(dt.timezone.utc)
            )
        threads = list(state["threads"].values())
    threads.sort(
        key=lambda entry: (
            entry.get("started_at", ""),
            entry.get("conversation_id", ""),
        )
    )
    running_threads = [
        entry for entry in threads if counts_as_running_thread(entry)
    ]
    ignored_threads = [
        entry for entry in threads if not counts_as_running_thread(entry)
    ]
    return {
        "project_root": root,
        "running_count": len(running_threads),
        "threads": running_threads,
        "ignored_count": len(ignored_threads),
        "ignored_threads": ignored_threads,
    }


def print_status(status: dict[str, Any]) -> None:
    print(f"Project: {status['project_root']}")
    print(f"Running Cursor threads: {status['running_count']}")
    if status["threads"]:
        print()
    for entry in status["threads"]:
        print(entry.get("conversation_id", ""))
        print(f"  composer_mode: {entry.get('composer_mode', '')}")
        print(f"  started_at: {entry.get('started_at', '')}")
        print(f"  updated_at: {entry.get('updated_at', '')}")
    if status["ignored_threads"]:
        print()
        print(
            "Excluded Ask/Plan threads: "
            f"{status['ignored_count']}"
        )
        for entry in status["ignored_threads"]:
            print(entry.get("conversation_id", ""))
            print(f"  composer_mode: {entry.get('composer_mode', '')}")
            print(f"  started_at: {entry.get('started_at', '')}")
            print(f"  updated_at: {entry.get('updated_at', '')}")


def fail_open() -> None:
    print(json.dumps({"continue": True}))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    output_group = parser.add_mutually_exclusive_group()
    output_group.add_argument("--status", action="store_true", help="Show running threads.")
    output_group.add_argument("--json", action="store_true", dest="as_json", help="Output status as JSON.")
    parser.add_argument("--cleanup", action="store_true", help="Remove stale entries.")
    args = parser.parse_args()

    try:
        root = project_root()
        if args.status or args.as_json or args.cleanup:
            status = load_status(root, cleanup=args.cleanup)
            if args.as_json:
                print(json.dumps(status, ensure_ascii=False, indent=2))
            else:
                print_status(status)
            return 0

        try:
            input_data = json.load(sys.stdin)
        except (json.JSONDecodeError, TypeError, ValueError) as exc:
            print(f"thread-status: malformed hook input: {exc}", file=sys.stderr)
            fail_open()
            return 0
        if not isinstance(input_data, dict):
            print("thread-status: hook input must be a JSON object", file=sys.stderr)
            fail_open()
            return 0
        handle_hook(input_data)
    except Exception as exc:  # Hook failures must never block Cursor.
        print(f"thread-status: {type(exc).__name__}: {exc}", file=sys.stderr)
    fail_open()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
