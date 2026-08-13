"""
Vector similarity retriever tool for Candidate Archivist Agent
"""

import math
import re
from typing import Any, Dict, List


def _tokenize(text: str) -> set:
    words = re.findall(r'\b[a-zA-Z0-9_\+#\.\-]{2,}\b', text.lower())
    return set(words)


def _jaccard_similarity(set1: set, set2: set) -> float:
    if not set1 or not set2:
        return 0.0
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    return intersection / union if union > 0 else 0.0


class SemanticVectorRetriever:
    """
    In-memory semantic and keyword similarity engine for matching
    master profile bullet points against extracted job requirements.
    """

    def __init__(self, master_profile: Dict[str, Any]):
        self.master_profile = master_profile
        self.work_experiences = master_profile.get("work", [])
        self.projects = master_profile.get("projects", [])

    def retrieve_relevant_experience(self, required_skills: List[str], responsibilities: List[str], top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Rank past achievements by relevance to target job criteria.
        """
        query_tokens = set()
        for skill in required_skills:
            query_tokens.update(_tokenize(skill))
        for resp in responsibilities:
            query_tokens.update(_tokenize(resp))

        scored_bullets = []
        for idx, work in enumerate(self.work_experiences):
            company = work.get("name", "Unknown")
            position = work.get("position", "Role")
            for b_idx, bullet in enumerate(work.get("highlights", [])):
                bullet_tokens = _tokenize(bullet)
                score = _jaccard_similarity(query_tokens, bullet_tokens)
                scored_bullets.append({
                    "source": f"work[{idx}].highlights[{b_idx}]",
                    "company": company,
                    "position": position,
                    "bullet": bullet,
                    "relevance_score": round(score, 3)
                })

        scored_bullets.sort(key=lambda x: x["relevance_score"], reverse=True)
        return scored_bullets[:top_k]
