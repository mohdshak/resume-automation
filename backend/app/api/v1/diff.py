"""
Diff Inspector Endpoints
"""

from typing import Any, Dict
from fastapi import APIRouter
from backend.app.models.diff import DiffReport

router = APIRouter()


@router.post("/inspect")
async def inspect_diffs(payload: Dict[str, Any]):
    diffs = payload.get("diffs", [])
    return DiffReport(
        total_modifications=len(diffs),
        diffs=diffs
    )
