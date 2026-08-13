"""
Vercel Serverless Function Entrypoint
Routes incoming HTTP requests on /api/* to the FastAPI application and multi-agent engine.
"""

import sys
import os

# Ensure project root is on sys.path so 'backend' and 'agents' modules resolve seamlessly
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from backend.app.main import app

# Export the ASGI application for Vercel's Python runtime
__all__ = ["app"]
