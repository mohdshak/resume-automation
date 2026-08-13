"""
ATS Audit & Scoring Models
"""

from typing import Dict, List
from pydantic import BaseModel, Field


class ATSBreakdown(BaseModel):
    keyword_match: float
    semantic_relevance: float
    impact_quantification: float
    format_compliance: float


class ATSAuditResponse(BaseModel):
    overall_score: float
    is_ats_compliant: bool
    breakdown: ATSBreakdown
    matched_keywords: List[str] = Field(default_factory=list)
    missing_keywords: List[str] = Field(default_factory=list)
    feedback: List[str] = Field(default_factory=list)
