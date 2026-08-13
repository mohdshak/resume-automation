"""
Agent 3: ATS Auditor & Gap Analyst
Role: ATS Algorithm Simulator
Performs lexical/semantic gap analysis and formulates an optimization strategy blueprint.
"""

from typing import Any, Dict, List
from agents.base import BaseAgent, AgentRole
from agents.tools.ats_evaluator import compute_ats_score, compute_keyword_overlap


class ATSAuditorAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            role=AgentRole.ATS_AUDITOR,
            name="ATS Auditor & Gap Analyst",
            description="Simulates ATS algorithms to identify keyword gaps and generates optimization strategy."
        )

    async def execute(self, state: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        self.log("Running ATS gap audit and keyword coverage analysis...")
        master_profile = state.get("master_profile", {})
        extracted_jd = state.get("extracted_jd", {})
        
        initial_audit = compute_ats_score(master_profile, extracted_jd)
        
        strategy = [
            f"Embed missing critical keywords: {', '.join(initial_audit['missing_keywords'][:4])}",
            "Prioritize distributed systems & high-throughput metrics in summary",
            "Align job titles and skills order to emphasize top target stack"
        ]
        
        return {
            "ats_gap_analysis": {
                "initial_score": initial_audit["overall_score"],
                "breakdown": initial_audit["breakdown"],
                "missing_keywords": initial_audit["missing_keywords"],
                "matched_keywords": initial_audit["matched_keywords"],
                "strategy_blueprint": strategy
            }
        }
