#!/usr/bin/env python3
"""Standard-library tests for the Cursor thread status hook."""

from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
HOOK = PROJECT_ROOT / ".cursor/hooks/thread-status.py"
STATE_DIRECTORY = Path(tempfile.gettempdir()) / "cursor-project-thread-status"


class ThreadStatusTrackerTests(unittest.TestCase):
    def setUp(self) -> None:
        self.project_directory = Path(tempfile.mkdtemp(prefix="thread-status-test-"))
        project_id = hashlib.sha256(
            str(self.project_directory).encode("utf-8")
        ).hexdigest()
        self.state_file = STATE_DIRECTORY / f"{project_id}.json"
        self.lock_file = STATE_DIRECTORY / f"{project_id}.lock"

    def tearDown(self) -> None:
        self.state_file.unlink(missing_ok=True)
        self.lock_file.unlink(missing_ok=True)
        shutil.rmtree(self.project_directory)

    def run_hook(
        self,
        payload: dict[str, object] | None = None,
        *arguments: str,
    ) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, str(HOOK), *arguments],
            cwd=self.project_directory,
            input=json.dumps(payload) if payload is not None else "",
            text=True,
            capture_output=True,
            check=False,
        )

    def status(self) -> dict[str, object]:
        result = self.run_hook(None, "--json")
        self.assertEqual(result.returncode, 0, result.stderr)
        return json.loads(result.stdout)

    def submit(self, conversation_id: str, generation_id: str) -> None:
        result = self.run_hook(
            {
                "hook_event_name": "beforeSubmitPrompt",
                "conversation_id": conversation_id,
                "generation_id": generation_id,
                "workspace_roots": [str(self.project_directory)],
            }
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout), {"continue": True})

    def stop(self, conversation_id: str) -> None:
        result = self.run_hook(
            {
                "hook_event_name": "stop",
                "conversation_id": conversation_id,
                "generation_id": "generation-stop",
                "workspace_roots": [str(self.project_directory)],
            }
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout), {"continue": True})

    def test_lifecycle_deduplication_and_fail_open(self) -> None:
        self.submit("conversation-a", "generation-a-1")
        self.assertEqual(self.status()["running_count"], 1)

        self.submit("conversation-b", "generation-b")
        self.assertEqual(self.status()["running_count"], 2)

        self.submit("conversation-a", "generation-a-2")
        status = self.status()
        self.assertEqual(status["running_count"], 2)
        entries = {
            entry["conversation_id"]: entry
            for entry in status["threads"]
        }
        self.assertEqual(entries["conversation-a"]["generation_id"], "generation-a-2")

        self.stop("conversation-a")
        self.assertEqual(self.status()["running_count"], 1)
        self.stop("conversation-b")
        self.assertEqual(self.status()["running_count"], 0)

        malformed = self.run_hook(None)
        self.assertEqual(malformed.returncode, 0)
        self.assertEqual(json.loads(malformed.stdout), {"continue": True})

        non_object = subprocess.run(
            [sys.executable, str(HOOK)],
            cwd=self.project_directory,
            input="[]",
            text=True,
            capture_output=True,
            check=False,
        )
        self.assertEqual(non_object.returncode, 0)
        self.assertEqual(json.loads(non_object.stdout), {"continue": True})

    def test_processes_do_not_lose_updates(self) -> None:
        payloads = [
            {
                "hook_event_name": "beforeSubmitPrompt",
                "conversation_id": f"conversation-{index}",
                "generation_id": f"generation-{index}",
                "workspace_roots": [str(self.project_directory)],
            }
            for index in range(12)
        ]

        def submit_payload(payload: dict[str, object]) -> None:
            result = self.run_hook(payload)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(json.loads(result.stdout), {"continue": True})

        with ThreadPoolExecutor(max_workers=len(payloads)) as executor:
            list(executor.map(submit_payload, payloads))

        status = self.status()
        self.assertEqual(status["running_count"], len(payloads))

    def test_cleanup_removes_stale_entries(self) -> None:
        self.submit("conversation-stale", "generation-stale")
        state = json.loads(self.state_file.read_text(encoding="utf-8"))
        state["threads"]["conversation-stale"]["updated_at"] = "2000-01-01T00:00:00Z"
        self.state_file.write_text(json.dumps(state), encoding="utf-8")

        result = self.run_hook(None, "--cleanup")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("Running Cursor threads: 0", result.stdout)
        self.assertEqual(self.status()["running_count"], 0)

    def test_human_status_and_json_outputs(self) -> None:
        self.submit("conversation-status", "generation-status")

        human = self.run_hook(None, "--status")
        self.assertEqual(human.returncode, 0, human.stderr)
        self.assertIn(f"Project: {self.project_directory}", human.stdout)
        self.assertIn("Running Cursor threads: 1", human.stdout)
        self.assertIn("conversation-status", human.stdout)

        machine = self.status()
        self.assertEqual(machine["project_root"], str(self.project_directory))
        self.assertEqual(machine["running_count"], 1)
        self.assertEqual(machine["threads"][0]["generation_id"], "generation-status")


if __name__ == "__main__":
    unittest.main()
