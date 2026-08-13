"""
The 7 Collaborative AI Agents of ResumeTailor AI
"""

from .jd_intelligence import JDIntelligenceAgent
from .candidate_archivist import CandidateArchivistAgent
from .ats_auditor import ATSAuditorAgent
from .resume_copywriter import ResumeCopywriterAgent
from .fact_checker import FactCheckerAgent
from .ats_critic import ATSCriticAgent
from .typesetter import TypesetterAgent

__all__ = [
    "JDIntelligenceAgent",
    "CandidateArchivistAgent",
    "ATSAuditorAgent",
    "ResumeCopywriterAgent",
    "FactCheckerAgent",
    "ATSCriticAgent",
    "TypesetterAgent",
]
