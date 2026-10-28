#!/data/data/com.termux/files/usr/bin/bash
cd "$(dirname "$0")" || exit 1
export PORT="${PORT:-4000}"
node server.js
