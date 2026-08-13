"""
ATS Resume Exporter Service (HTML / PDF / DOCX / JSON)
"""

import json
from pathlib import Path
from typing import Any, Dict
from jinja2 import Template


class ResumeExportService:
    @staticmethod
    def render_html(resume_data: Dict[str, Any]) -> str:
        template_path = Path(__file__).parents[3] / "data" / "ats_templates" / "clean_single_column.html"
        if template_path.exists():
            with open(template_path, "r", encoding="utf-8") as f:
                template_str = f.read()
        else:
            template_str = "<html><body><h1>{{ basics.name }}</h1></body></html>"
            
        template = Template(template_str)
        return template.render(
            basics=resume_data.get("basics", {}),
            skills=resume_data.get("skills", []),
            work=resume_data.get("work", []),
            projects=resume_data.get("projects", []),
            education=resume_data.get("education", []),
            certifications=resume_data.get("certifications", [])
        )

    @staticmethod
    def export_json(resume_data: Dict[str, Any]) -> str:
        return json.dumps(resume_data, indent=2)
