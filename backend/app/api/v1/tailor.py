"""
Auto-Tailoring & Multi-Agent Orchestration Execution Endpoints
"""

from typing import Any, Dict
from fastapi import APIRouter, HTTPException
from backend.app.models.agent_state import TailorRequest, TailorResponse
from agents.orchestrator import ResumeTailorOrchestrator
from backend.app.api.v1.onboarding import _master_vault

router = APIRouter()
_orchestrator = ResumeTailorOrchestrator()


@router.post("/", response_model=TailorResponse)
async def run_tailoring_pipeline(request: TailorRequest):
    master_profile = request.master_profile or _master_vault.get("default")
    if not master_profile:
        raise HTTPException(status_code=400, detail="Master Profile is missing.")
        
    final_state = await _orchestrator.run_pipeline({
        "master_profile": master_profile,
        "raw_jd_text": request.raw_jd_text,
        "target_role": request.target_role,
        "target_company": request.target_company
    })
    
    return TailorResponse(
        job_id=final_state.job_id,
        target_role=final_state.target_role or "Software Engineer",
        target_company=final_state.target_company or "Target Company",
        ats_score=final_state.ats_score,
        is_score_approved=final_state.is_score_approved,
        fact_check_passed=final_state.fact_check_passed,
        tailored_resume=final_state.final_resume,
        diffs=[d.dict() if hasattr(d, "dict") else d for d in final_state.diffs]
    )
