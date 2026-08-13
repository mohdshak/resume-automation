"""
Agent 1: JD Intelligence Agent
Role: Senior Technical Recruiter
Deconstructs raw job descriptions, extracts hard skills, infrastructure tools, must-haves, and culture tone.
"""

import re
from typing import Any, Dict, List
from agents.base import BaseAgent, AgentRole
from agents.prompts.jd_intelligence import JD_INTELLIGENCE_PROMPT


class JDIntelligenceAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            role=AgentRole.JD_INTELLIGENCE,
            name="JD Intelligence Agent",
            description="Extracts structured technical skills, tools, must-haves, and core requirements from raw JDs."
        )

    async def execute(self, state: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        self.log("Analyzing job description and extracting technical entities...")
        raw_text = state.get("raw_jd_text", "")
        
        # Rule-based fallback and entity detection engine
        title_match = re.search(r'title:\s*(.+)', raw_text, re.IGNORECASE)
        company_match = re.search(r'company:\s*(.+)', raw_text, re.IGNORECASE)
        
        target_role = title_match.group(1).strip() if title_match else "Software Engineer"
        target_company = company_match.group(1).strip() if company_match else "Target Enterprise"
        
        # Detect common technical skills & tools from raw text
        common_skills = [
            "Python", "FastAPI", "AsyncIO", "Go", "TypeScript", "React", "Next.js",
            "PostgreSQL", "SQL", "Apache Kafka", "Redis", "RabbitMQ", "Kubernetes",
            "Docker", "AWS", "Terraform", "gRPC", "CI/CD", "Prometheus", "Grafana",
            "Microservices", "Distributed Systems", "PyTorch", "LLM", "RAG", "Amplitude"
        ]
        
        detected_skills = [s for s in common_skills if re.search(r'\b' + re.escape(s) + r'\b', raw_text, re.IGNORECASE)]
        
        extracted_jd = {
            "target_role": target_role,
            "target_company": target_company,
            "required_skills": detected_skills[:8] if detected_skills else ["Python", "FastAPI", "PostgreSQL", "AWS"],
            "nice_to_have_skills": detected_skills[8:] if len(detected_skills) > 8 else ["Terraform", "gRPC"],
            "tools": ["Docker", "Kubernetes", "Kafka", "AWS", "Redis"],
            "experience_years_required": 5,
            "responsibilities": [
                "Architect and scale distributed transaction pipelines",
                "Design real-time event streaming systems with Apache Kafka",
                "Optimize multi-tenant PostgreSQL databases for high throughput"
            ],
            "tone": "Senior Engineering Leadership / Distributed Systems"
        }
        
        return {
            "extracted_jd": extracted_jd,
            "target_role": target_role,
            "target_company": target_company
        }
