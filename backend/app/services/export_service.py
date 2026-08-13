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
        candidate_paths = [
            Path(__file__).resolve().parents[3] / "data" / "ats_templates" / "clean_single_column.html",
            Path.cwd() / "data" / "ats_templates" / "clean_single_column.html",
            Path("/var/task") / "data" / "ats_templates" / "clean_single_column.html",
        ]
        
        template_str = None
        for p in candidate_paths:
            if p.exists():
                try:
                    with open(p, "r", encoding="utf-8") as f:
                        template_str = f.read()
                        break
                except Exception:
                    pass
                    
        if not template_str:
            template_str = """<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>{{ basics.name }} - ATS Resume</title>
<style>body{font-family:Arial,sans-serif;margin:20px;line-height:1.4;color:#111;}h1{margin:0;font-size:22px;}h2{font-size:14px;border-bottom:1px solid #ccc;text-transform:uppercase;margin-top:14px;}</style>
</head><body>
<h1>{{ basics.name }}</h1><p>{{ basics.label }} | {{ basics.email }} | {{ basics.phone }}</p>
<h2>Summary</h2><p>{{ basics.summary }}</p>
<h2>Skills</h2><p>{% for s in skills %}<strong>{{ s.name }}:</strong> {{ s.keywords | join(', ') }}<br>{% endfor %}</p>
<h2>Experience</h2>{% for w in work %}<h3>{{ w.position }} - {{ w.name }} ({{ w.startDate }} - {{ w.endDate }})</h3><ul>{% for h in w.highlights %}<li>{{ h }}</li>{% endfor %}</ul>{% endfor %}
</body></html>"""
            
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
