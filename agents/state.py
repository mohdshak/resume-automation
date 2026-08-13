"""
State definition and data structures for the Multi-Agent Tailoring Pipeline
"""

from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
import datetime


class AgentStepStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    REVISION_REQUESTED = "revision_requested"


class AgentStepLog(BaseModel):
    agent_role: str
    agent_name: str
    status: AgentStepStatus
    message: str
    details: Dict[str, Any] = Field(default_factory=dict)
    timestamp: str = Field(default_factory=lambda: datetime.datetime.now(datetime.timezone.utc).isoformat())


class DiffChange(BaseModel):
    section: str  # e.g., "work[0].highlights[1]" or "skills"
    change_type: str  # "modified", "added", "removed", "reordered"
    original: Optional[str] = None
    tailored: Optional[str] = None
    rationale: str
    keywords_injected: List[str] = Field(default_factory=list)


class TailoringState(BaseModel):
    """
    Complete state passed between agents in the cyclic reflection graph.
    """
    job_id: str = Field(default_factory=lambda: datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%d%H%M%S"))
    raw_jd_text: str = ""
    target_role: Optional[str] = None
    target_company: Optional[str] = None
    
    # Ingestion & Master Profile
    master_profile: Dict[str, Any] = Field(default_factory=dict)
    
    # Agent 1 Output: JD Intelligence
    extracted_jd: Dict[str, Any] = Field(default_factory=dict)
    
    # Agent 2 Output: Retrieved Experience Ground Truth
    retrieved_experience: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Agent 3 Output: ATS Gap Blueprint
    ats_gap_analysis: Dict[str, Any] = Field(default_factory=dict)
    
    # Agent 4 Output: Tailored Resume Draft
    tailored_draft: Dict[str, Any] = Field(default_factory=dict)
    
    # Agent 5 Output: Fact-Checking Guardrail Verdict
    fact_check_passed: bool = False
    fact_check_violations: List[str] = Field(default_factory=list)
    
    # Agent 6 Output: ATS Score & Critic
    ats_score: float = 0.0
    ats_feedback: List[str] = Field(default_factory=list)
    is_score_approved: bool = False
    
    # Reflection Tracking
    iteration: int = 0
    max_iterations: int = 3
    
    # Visual Diffs & Rationales
    diffs: List[DiffChange] = Field(default_factory=list)
    
    # Agent 7 Output: Final ATS Typeset Render
    final_resume: Dict[str, Any] = Field(default_factory=dict)
    
    # Live execution trace
    logs: List[AgentStepLog] = Field(default_factory=list)
    current_agent: Optional[str] = None
    pipeline_completed: bool = False
