"""
Base Agent Abstraction and Interfaces for ResumeTailor AI
"""

from abc import ABC, abstractmethod
from enum import Enum
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field
import datetime


class AgentRole(str, Enum):
    JD_INTELLIGENCE = "jd_intelligence"
    CANDIDATE_ARCHIVIST = "candidate_archivist"
    ATS_AUDITOR = "ats_auditor"
    RESUME_COPYWRITER = "resume_copywriter"
    FACT_CHECKER = "fact_checker"
    ATS_CRITIC = "ats_critic"
    TYPESETTER = "typesetter"


class AgentMessage(BaseModel):
    sender: AgentRole
    recipient: Optional[AgentRole] = None
    action: str
    content: Dict[str, Any] = Field(default_factory=dict)
    rationale: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.datetime.utcnow().isoformat())


class BaseAgent(ABC):
    """
    Abstract Base Class that every ResumeTailor AI agent inherits from.
    """

    def __init__(self, role: AgentRole, name: str, description: str):
        self.role = role
        self.name = name
        self.description = description

    @abstractmethod
    async def execute(self, state: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        """
        Execute the agent's task given current pipeline state.
        Returns the updated state partition.
        """
        pass

    def log(self, message: str):
        print(f"[{self.role.value.upper()}] {message}")
