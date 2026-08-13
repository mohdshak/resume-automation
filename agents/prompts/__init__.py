"""
Modular Prompt Templates for ResumeTailor AI Agents
"""

from .jd_intelligence import JD_INTELLIGENCE_PROMPT
from .candidate_archivist import CANDIDATE_ARCHIVIST_PROMPT
from .ats_auditor import ATS_AUDITOR_PROMPT
from .resume_copywriter import RESUME_COPYWRITER_PROMPT
from .fact_checker import FACT_CHECKER_PROMPT
from .ats_critic import ATS_CRITIC_PROMPT
from .typesetter import TYPESETTER_PROMPT

__all__ = [
    "JD_INTELLIGENCE_PROMPT",
    "CANDIDATE_ARCHIVIST_PROMPT",
    "ATS_AUDITOR_PROMPT",
    "RESUME_COPYWRITER_PROMPT",
    "FACT_CHECKER_PROMPT",
    "ATS_CRITIC_PROMPT",
    "TYPESETTER_PROMPT",
]
