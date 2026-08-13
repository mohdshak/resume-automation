"""
Multi-Agent Orchestration Graph & Pipeline Controller
Coordinates the cyclic reflection loop across all 7 collaborative agents.
"""

from typing import Any, AsyncGenerator, Dict, List
import datetime
from agents.base import AgentRole
from agents.state import TailoringState, AgentStepStatus, AgentStepLog, DiffChange
from agents.workers.jd_intelligence import JDIntelligenceAgent
from agents.workers.candidate_archivist import CandidateArchivistAgent
from agents.workers.ats_auditor import ATSAuditorAgent
from agents.workers.resume_copywriter import ResumeCopywriterAgent
from agents.workers.fact_checker import FactCheckerAgent
from agents.workers.ats_critic import ATSCriticAgent
from agents.workers.typesetter import TypesetterAgent


def _dump(obj: Any) -> Any:
    if hasattr(obj, "model_dump"):
        return obj.model_dump()
    elif hasattr(obj, "dict"):
        return obj.dict()
    return obj


class ResumeTailorOrchestrator:
    """
    Executes the multi-agent tailoring workflow with cyclic reflection guardrails.
    """

    def __init__(self):
        self.agent_jd = JDIntelligenceAgent()
        self.agent_archivist = CandidateArchivistAgent()
        self.agent_auditor = ATSAuditorAgent()
        self.agent_copywriter = ResumeCopywriterAgent()
        self.agent_fact_checker = FactCheckerAgent()
        self.agent_critic = ATSCriticAgent()
        self.agent_typesetter = TypesetterAgent()

    async def run_pipeline(self, initial_state: Dict[str, Any]) -> TailoringState:
        """
        Runs the full 7-agent pipeline to completion and returns the final TailoringState.
        """
        state = TailoringState(**initial_state)

        # 1. JD Intelligence Agent
        state = await self._run_step(self.agent_jd, state)

        # 2. Candidate Archivist Agent
        state = await self._run_step(self.agent_archivist, state)

        # 3. ATS Auditor & Gap Analyst
        state = await self._run_step(self.agent_auditor, state)

        # Optimization & Guardrail Reflection Loop
        while state.iteration < state.max_iterations:
            state.iteration += 1

            # 4. Resume Copywriter Agent
            state = await self._run_step(self.agent_copywriter, state)

            # 5. Fact-Checking Guardrail Agent
            state = await self._run_step(self.agent_fact_checker, state)

            if not state.fact_check_passed:
                # Violation detected -> force revision loop
                continue

            # 6. ATS Critic & Score Evaluator
            state = await self._run_step(self.agent_critic, state)

            if state.is_score_approved:
                break

        # 7. Typesetter & Export Agent
        state = await self._run_step(self.agent_typesetter, state)
        state.pipeline_completed = True
        return state

    async def stream_pipeline(self, initial_state: Dict[str, Any]) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Yields real-time step events for frontend live execution streaming.
        """
        state = TailoringState(**initial_state)

        for agent in [self.agent_jd, self.agent_archivist, self.agent_auditor]:
            state = await self._run_step(agent, state)
            yield {
                "event": "agent_completed",
                "agent": agent.name,
                "role": agent.role.value,
                "logs": [_dump(l) for l in state.logs],
                "state_summary": {
                    "target_role": state.target_role,
                    "target_company": state.target_company,
                    "extracted_skills": state.extracted_jd.get("required_skills", [])
                }
            }

        while state.iteration < state.max_iterations:
            state.iteration += 1

            state = await self._run_step(self.agent_copywriter, state)
            yield {"event": "agent_completed", "agent": self.agent_copywriter.name, "role": "resume_copywriter"}

            state = await self._run_step(self.agent_fact_checker, state)
            yield {
                "event": "guardrail_audit",
                "passed": state.fact_check_passed,
                "violations": state.fact_check_violations
            }

            if not state.fact_check_passed:
                continue

            state = await self._run_step(self.agent_critic, state)
            yield {
                "event": "ats_evaluated",
                "score": state.ats_score,
                "approved": state.is_score_approved
            }

            if state.is_score_approved:
                break

        state = await self._run_step(self.agent_typesetter, state)
        state.pipeline_completed = True

        yield {
            "event": "pipeline_finished",
            "final_resume": state.final_resume,
            "ats_score": state.ats_score,
            "diffs": [_dump(d) for d in state.diffs],
            "logs": [_dump(l) for l in state.logs]
        }

    async def _run_step(self, agent: Any, state: TailoringState) -> TailoringState:
        state.current_agent = agent.name
        log_entry = AgentStepLog(
            agent_role=agent.role.value,
            agent_name=agent.name,
            status=AgentStepStatus.RUNNING,
            message=f"Starting execution of {agent.name}..."
        )
        state.logs.append(log_entry)

        try:
            update = await agent.execute(_dump(state))
            for k, v in update.items():
                if hasattr(state, k):
                    setattr(state, k, v)

            log_entry.status = AgentStepStatus.COMPLETED
            log_entry.message = f"{agent.name} completed successfully."
        except Exception as e:
            log_entry.status = AgentStepStatus.FAILED
            log_entry.message = f"Error in {agent.name}: {str(e)}"

        return state
