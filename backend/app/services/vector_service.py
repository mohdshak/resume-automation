"""
Vector Search & Profile Embeddings Service
"""

from typing import Any, Dict, List


class VectorProfileService:
    def __init__(self):
        self._profiles = {}

    def index_profile(self, user_id: str, profile_data: Dict[str, Any]):
        self._profiles[user_id] = profile_data

    def get_profile(self, user_id: str) -> Dict[str, Any]:
        return self._profiles.get(user_id, {})
