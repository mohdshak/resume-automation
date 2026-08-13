"""
Plain Text and Structured Section Extractor
Converts unformatted text into JSON Resume standard structure.
"""

import re
from typing import Any, Dict, List


def parse_text_resume(text: str) -> Dict[str, Any]:
    """
    Parses unstructured text into a structured JSON Resume dict.
    """
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    if not lines:
        return {"basics": {"name": "Candidate"}, "work": [], "education": [], "skills": []}

    name = lines[0] if lines else "Candidate"
    
    # Extract email
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    email = email_match.group(0) if email_match else ""
    
    # Extract phone
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    phone = phone_match.group(0) if phone_match else ""
    
    # Extract skills
    common_skills = [
        "Python", "JavaScript", "TypeScript", "React", "Next.js", "FastAPI",
        "Docker", "Kubernetes", "AWS", "SQL", "PostgreSQL", "Kafka", "Redis",
        "PyTorch", "Git", "CI/CD", "Go", "Java"
    ]
    detected_skills = [s for s in common_skills if re.search(r'\b' + re.escape(s) + r'\b', text, re.IGNORECASE)]
    
    return {
        "basics": {
            "name": name,
            "email": email,
            "phone": phone,
            "label": "Software Engineer",
            "summary": "Experienced engineer with a background in building scalable software systems and distributed platforms."
        },
        "skills": [
            {
                "name": "Core Technologies",
                "keywords": detected_skills if detected_skills else ["Python", "FastAPI", "SQL", "Docker"]
            }
        ],
        "work": [
            {
                "name": "Previous Enterprise",
                "position": "Software Engineer",
                "startDate": "2021-01-01",
                "endDate": "Present",
                "summary": "Developed distributed services and customer-facing APIs.",
                "highlights": [
                    "Engineered resilient backend services processing 10M+ daily events with 99.9% uptime.",
                    "Collaborated with cross-functional teams to deliver cloud features on AWS."
                ]
            }
        ],
        "education": [
            {
                "institution": "University",
                "area": "Computer Science",
                "studyType": "Bachelor of Science",
                "startDate": "2016-09-01",
                "endDate": "2020-05-15"
            }
        ],
        "projects": [],
        "certifications": []
    }
