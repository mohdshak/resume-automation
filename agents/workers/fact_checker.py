"""
Agent 5: Fact-Checking Guardrail Agent
Role: Strict Compliance Auditor
Enforces strict anti-hallucination verification against the Master Profile.
"""

from typing import Any, Dict, List
from agents.base import BaseAgent, AgentRole
from agents.tools.guardrail_tools import verify_resume_facts


class FactCheckerAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            role=AgentRole.FACT_CHECKER,
            name="Fact-Checking Guardrail Agent",
            description="Audits tailored draft against Master Profile to prevent synthetic metric or employer hallucinations."
        )

    async def execute(self, state: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        self.log("Auditing tailored draft for factual compliance and hallucination prevention...")
        master_profile = state.get("master_profile", {})
        tailored_draft = state.get("tailored_draft", {})
        
        is_valid, violations = verify_resume_facts(master_profile, tailored_draft)
        
        if is_valid:
            self.log("✅ Fact-Check APPROVED: Zero hallucinations detected.")
        else:
            self.log(f"❌ Fact-Check REJECTED: {len(violations)} violations found.")
            
        return {
            "fact_check_passed": is_valid,
            "fact_check_violations": violations
        }
