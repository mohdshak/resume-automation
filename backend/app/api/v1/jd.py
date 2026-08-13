"""
Job Description Ingestion & Extraction Endpoints
"""

from typing import Any, Dict
from fastapi import APIRouter
from backend.app.models.jd import JDAnalyzeRequest, ExtractedJD
from agents.workers.jd_intelligence import JDIntelligenceAgent

router = APIRouter()
_jd_agent = JDIntelligenceAgent()


@router.post("/analyze")
async def analyze_job_description(request: JDAnalyzeRequest):
    raw_text = request.raw_text or ""
    result = await _jd_agent.execute({"raw_jd_text": raw_text})
    return {
        "status": "success",
        "extracted_jd": result.get("extracted_jd"),
        "target_role": result.get("target_role"),
        "target_company": result.get("target_company")
    }
