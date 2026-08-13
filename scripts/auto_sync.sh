#!/bin/bash
# Convenience shell script to start auto-sync watcher
cd "$(dirname "$0")/.."
python3 scripts/auto_sync.py "$@"
