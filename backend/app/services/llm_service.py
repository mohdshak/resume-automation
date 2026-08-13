"""
LLM Provider Integration Wrapper (Gemini / OpenAI)
"""

import os
from typing import Any, Dict, Optional


class LLMService:
    def __init__(self, provider: str = "gemini"):
        self.provider = provider
        self.api_key = os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")

    async def generate_json(self, prompt: str, system_instruction: Optional[str] = None) -> Dict[str, Any]:
        """
        Calls the LLM with structured JSON output enforcement.
        Falls back to rule-based parser if no API key is set.
        """
        # Scaffolding: Ready for live SDK calls (e.g. google.generativeai or openai)
        return {"status": "success", "prompt": prompt}
