#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")"

podman build --target dev -t silksong-dlc-countdown-dev -f Containerfile .
printf '\n開發伺服器啟動於 http://localhost:8080/silksong-dlc-countdown/\n儲存程式碼後會自動更新；按 Ctrl+C 停止。\n\n'
exec podman run --rm -p 8080:5173 \
  -v "$(pwd)/src:/app/src:ro,Z" \
  -v "$(pwd)/public:/app/public:ro,Z" \
  -v "$(pwd)/index.html:/app/index.html:ro,Z" \
  -v "$(pwd)/vite.config.ts:/app/vite.config.ts:ro,Z" \
  -v "$(pwd)/tsconfig.json:/app/tsconfig.json:ro,Z" \
  silksong-dlc-countdown-dev
