#!/bin/zsh
echo ""
echo "  ⚡ Easy Tracker — Starting Redmine Proxy"
echo "  ──────────────────────────────────────────"
lsof -ti:3001 | xargs kill -9 2>/dev/null
sleep 1
node "$(dirname "$0")/redmine-proxy.js"
