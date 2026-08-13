"""
Visual Diff & Rationale Models
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class DiffItem(BaseModel):
    section: str
    change_type: str  # "modified", "added", "removed", "reordered"
    original: Optional[str] = None
    tailored: Optional[str] = None
    rationale: str
    keywords_injected: List[str] = Field(default_factory=list)


class DiffReport(BaseModel):
    total_modifications: int
    diffs: List[DiffItem] = Field(default_factory=list)
