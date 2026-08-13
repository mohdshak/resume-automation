"""
Job Description Data Models
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class JDAnalyzeRequest(BaseModel):
    raw_text: Optional[str] = None
    url: Optional[str] = None


class ExtractedJD(BaseModel):
    target_role: str
    target_company: str
    required_skills: List[str] = Field(default_factory=list)
    nice_to_have_skills: List[str] = Field(default_factory=list)
    tools: List[str] = Field(default_factory=list)
    experience_years_required: int = 3
    responsibilities: List[str] = Field(default_factory=list)
    tone: Optional[str] = None
