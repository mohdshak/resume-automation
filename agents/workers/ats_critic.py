"""
Agent 6: ATS Critic & Score Evaluator
Role: Quality Assurance Benchmark
Evaluates whether tailored draft achieves target ATS score >= 85%.
"""

from typing import Any, Dict, List
from agents.base import BaseAgent, AgentRole
from agents.tools.ats_evaluator import compute_ats_score


class ATSCriticAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            role=AgentRole.ATS_CRITIC,
            name="ATS Critic & Score Evaluator",
            description="Benchmarks ATS score and provides actionable critique if score < 85%."
        )

    async def execute(self, state: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        self.log("Evaluating ATS score compliance against threshold (Target: >= 85%)...")
        tailored_draft = state.get("tailored_draft", {})
        extracted_jd = state.get("extracted_jd", {})
        
        evaluation = compute_ats_score(tailored_draft, extracted_jd)
        score = evaluation["overall_score"]
        is_approved = score >= 85.0
        
        feedback = []
        if not is_approved:
            feedback.append(f"ATS Score is {score}%, below 85% target.")
            if evaluation["missing_keywords"]:
                feedback.append(f"Consider integrating missing keywords: {', '.join(evaluation['missing_keywords'][:3])}")
        else:
            self.log(f"✅ ATS Score Benchmark PASSED: {score}%")
            
        return {
            "ats_score": score,
            "is_score_approved": is_approved,
            "ats_feedback": feedback,
            "ats_score_breakdown": evaluation["breakdown"]
        }
