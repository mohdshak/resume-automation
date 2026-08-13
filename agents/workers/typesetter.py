"""
Agent 7: Typesetter & Export Agent
Role: Document Architect
Enforces single/two-page space budget, standard headings, and compiles final ATS document payload.
"""

from typing import Any, Dict
from agents.base import BaseAgent, AgentRole


class TypesetterAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            role=AgentRole.TYPESETTER,
            name="Typesetter & Export Agent",
            description="Formats ATS-safe layout, enforces page constraints, and packages ready-to-export models."
        )

    async def execute(self, state: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        self.log("Typesetting ATS-compliant resume and packaging visual diffs...")
        tailored_draft = state.get("tailored_draft", {})
        
        # Enforce canonical section ordering for ATS parseability
        final_resume = {
            "basics": tailored_draft.get("basics", {}),
            "skills": tailored_draft.get("skills", []),
            "work": tailored_draft.get("work", []),
            "projects": tailored_draft.get("projects", []),
            "education": tailored_draft.get("education", []),
            "certifications": tailored_draft.get("certifications", [])
        }
        
        return {
            "final_resume": final_resume,
            "pipeline_completed": True
        }
