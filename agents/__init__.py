"""
ResumeTailor AI - Multi-Agent Framework
Dedicated modular package for autonomous JD analysis, candidate archiving,
ATS gap auditing, STAR/XYZ copywriting, anti-hallucination guardrails, and ATS scoring.
"""

from agents.orchestrator import ResumeTailorOrchestrator
from agents.state import TailoringState, AgentStepStatus

__all__ = [
    "ResumeTailorOrchestrator",
    "TailoringState",
    "AgentStepStatus",
]
