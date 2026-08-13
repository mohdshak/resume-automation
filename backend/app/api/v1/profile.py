"""
Master Profile Vault & Experience Bank Endpoints
"""

from typing import Any, Dict
from fastapi import APIRouter, HTTPException
from backend.app.models.resume import ResumeSchema
from backend.app.api.v1.onboarding import _master_vault

router = APIRouter()


@router.get("/")
async def get_master_profile():
    profile = _master_vault.get("default")
    if not profile:
        raise HTTPException(status_code=404, detail="No master profile found. Please complete onboarding.")
    return {"profile": profile}


@router.put("/")
async def update_master_profile(profile: Dict[str, Any]):
    _master_vault["default"] = profile
    return {"status": "success", "message": "Master profile updated successfully."}
