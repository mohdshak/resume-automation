#!/usr/bin/env python3
"""
Auto-Sync Watcher for ResumeTailor AI
Monitors workspace files for edits and automatically stages, commits, and pushes to GitHub.
"""

import os
import sys
import time
import subprocess
from datetime import datetime

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IGNORE_DIRS = {".git", "node_modules", ".next", "__pycache__", ".pytest_cache", "venv", ".venv"}


def get_git_status():
    res = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=ROOT_DIR,
        capture_output=True,
        text=True
    )
    return res.stdout.strip()


def sync_to_github():
    status = get_git_status()
    if not status:
        return

    print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 🔄 Detected file changes. Syncing to GitHub...")
    subprocess.run(["git", "add", "."], cwd=ROOT_DIR)

    commit_msg = f"auto: sync updates at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    subprocess.run(["git", "commit", "-m", commit_msg], cwd=ROOT_DIR)

    push_res = subprocess.run(["git", "push", "origin", "main"], cwd=ROOT_DIR, capture_output=True, text=True)
    if push_res.returncode == 0:
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] ✅ Successfully pushed updates to GitHub.")
    else:
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] ⚠️ Push error: {push_res.stderr.strip()}")


def watch_loop(poll_interval: int = 5):
    print("=" * 65)
    print("🚀 ResumeTailor AI Auto-Sync Watcher Active")
    print(f"📁 Monitoring: {ROOT_DIR}")
    print("📡 Destination: https://github.com/mohdshak/resume-automation.git")
    print(f"⏱️  Poll Interval: {poll_interval}s")
    print("=" * 65)

    while True:
        try:
            sync_to_github()
            time.sleep(poll_interval)
        except KeyboardInterrupt:
            print("\n🛑 Auto-sync stopped by user.")
            sys.exit(0)
        except Exception as e:
            print(f"⚠️ Unexpected error: {e}")
            time.sleep(poll_interval)


if __name__ == "__main__":
    interval = int(sys.argv[1]) if len(sys.argv) > 1 else 5
    watch_loop(interval)
