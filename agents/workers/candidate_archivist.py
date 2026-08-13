"""
Agent 2: Candidate Archivist Agent
Role: Career Historian & Knowledge Retriever
Manages candidate ground truth and retrieves relevant past achievements.
"""

from typing import Any, Dict, List
from agents.base import BaseAgent, AgentRole
from agents.tools.vector_retriever import SemanticVectorRetriever


class CandidateArchivistAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            role=AgentRole.CANDIDATE_ARCHIVIST,
            name="Candidate Archivist Agent",
            description="Manages Master Career Ground Truth and performs semantic retrieval over past work."
        )

    async def execute(self, state: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        self.log("Retrieving most relevant past accomplishments from Master Profile...")
        master_profile = state.get("master_profile", {})
        extracted_jd = state.get("extracted_jd", {})
        
        required_skills = extracted_jd.get("required_skills", [])
        responsibilities = extracted_jd.get("responsibilities", [])
        
        retriever = SemanticVectorRetriever(master_profile)
        relevant_experience = retriever.retrieve_relevant_experience(
            required_skills=required_skills,
            responsibilities=responsibilities,
            top_k=6
        )
        
        return {
            "retrieved_experience": relevant_experience
        }
