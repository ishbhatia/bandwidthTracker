#!/bin/zsh
echo ""
echo "  ⚡ Easy Tracker — Stopping Redmine Proxy"
echo "  ──────────────────────────────────────────"
PID=$(lsof -ti:3001)
if [ -z "$PID" ]; then
  echo "  ℹ️  Proxy is not running."
else
  kill -9 $PID
  echo "  ✅ Proxy stopped (PID $PID)"
fi
echo ""
sleep 2
