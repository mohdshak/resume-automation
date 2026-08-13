"""
Document Export Endpoints (HTML / PDF / JSON)
"""

from typing import Any, Dict
from fastapi import APIRouter, Response
from fastapi.responses import HTMLResponse
from backend.app.services.export_service import ResumeExportService

router = APIRouter()


@router.post("/html")
async def export_html(resume_data: Dict[str, Any]):
    html_content = ResumeExportService.render_html(resume_data)
    return HTMLResponse(content=html_content)


@router.post("/json")
async def export_json(resume_data: Dict[str, Any]):
    json_str = ResumeExportService.export_json(resume_data)
    return Response(
        content=json_str,
        media_type="application/json",
        headers={"Content-Disposition": 'attachment; filename="tailored_resume.json"'}
    )
