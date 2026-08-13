"""
Tailoring Request & Multi-Agent Execution Models
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from .resume import ResumeSchema
from .diff import DiffItem
from .ats import ATSAuditResponse


class TailorRequest(BaseModel):
    master_profile: Dict[str, Any]
    raw_jd_text: str
    target_role: Optional[str] = None
    target_company: Optional[str] = None


class TailorResponse(BaseModel):
    job_id: str
    target_role: str
    target_company: str
    ats_score: float
    is_score_approved: bool
    fact_check_passed: bool
    tailored_resume: Dict[str, Any]
    diffs: List[DiffItem] = Field(default_factory=list)
    ats_audit: Optional[ATSAuditResponse] = None
