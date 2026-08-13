#!/bin/bash
# Concurrent local development runner for ResumeTailor AI
# Runs FastAPI backend on :8000 and Next.js frontend on :3000

echo "🚀 Starting ResumeTailor AI Fullstack Dev Environment..."

# Trap SIGINT/SIGTERM to kill child processes cleanly
cleanup() {
    echo ""
    echo "🛑 Shutting down backend and frontend dev servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}
trap cleanup SIGINT SIGTERM EXIT

# Start FastAPI backend
echo "⚡ Starting Python FastAPI Backend on http://localhost:8000..."
python3 -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload &

# Start Next.js frontend
echo "✨ Starting Next.js Frontend on http://localhost:3000..."
npm run dev &

# Wait for both processes
wait
