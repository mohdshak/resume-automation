"""
Onboarding & FTUE Endpoints
Step 1: Upload Resume (PDF/DOCX/TXT/JSON)
Step 2: Parse to structured JSON Resume
Step 3: Return editable Master Profile preview
"""

import json
from pathlib import Path
from typing import Any, Dict, Optional
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from backend.app.parsers import parse_pdf_resume, parse_docx_resume, parse_text_resume

router = APIRouter()

# In-memory store for master profile session
_master_vault: Dict[str, Any] = {}


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """
    Parses an uploaded resume file (.pdf, .docx, .txt, .json).
    """
    contents = await file.read()
    filename = file.filename.lower()
    
    try:
        if filename.endswith(".pdf"):
            parsed_data = parse_pdf_resume(contents)
        elif filename.endswith(".docx"):
            parsed_data = parse_docx_resume(contents)
        elif filename.endswith(".json"):
            parsed_data = json.loads(contents.decode("utf-8"))
        else:
            parsed_data = parse_text_resume(contents.decode("utf-8", errors="ignore"))
            
        _master_vault["default"] = parsed_data
        return {
            "status": "success",
            "filename": file.filename,
            "parsed_profile": parsed_data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse resume: {str(e)}")


@router.post("/paste")
async def paste_resume(raw_text: str = Form(...)):
    """
    Parses direct pasted text or markdown resume.
    """
    parsed_data = parse_text_resume(raw_text)
    _master_vault["default"] = parsed_data
    return {
        "status": "success",
        "parsed_profile": parsed_data
    }


@router.get("/sample/{sample_type}")
async def load_sample_profile(sample_type: str = "tech"):
    """
    Loads one of the pre-built sample profiles (tech, product, data).
    """
    mapping = {
        "tech": "tech_software_engineer.json",
        "product": "product_manager.json",
        "data": "data_scientist.json"
    }
    file_name = mapping.get(sample_type, "tech_software_engineer.json")
    
    # Try multiple candidate paths for local dev and Vercel serverless runtime
    candidate_paths = [
        Path(__file__).resolve().parents[4] / "data" / "sample_resumes" / file_name,
        Path.cwd() / "data" / "sample_resumes" / file_name,
        Path("/var/task") / "data" / "sample_resumes" / file_name,
    ]
    
    data = None
    for p in candidate_paths:
        if p.exists():
            try:
                with open(p, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    break
            except Exception:
                pass

    # Self-contained fallback in case filesystem is isolated
    if not data:
        data = {
            "basics": {
                "name": "Alex Mercer",
                "label": "Senior Full Stack & Distributed Systems Engineer",
                "email": "alex.mercer@example.com",
                "phone": "+1 (555) 234-5678",
                "summary": "Full Stack Engineer with 6+ years experience in Python, FastAPI, React, Kafka, and Kubernetes."
            },
            "skills": [{"name": "Languages & Frameworks", "keywords": ["Python", "FastAPI", "React", "PostgreSQL", "Kafka", "Docker", "AWS"]}],
            "work": [
                {
                    "name": "CloudScale Technologies",
                    "position": "Senior Software Engineer",
                    "startDate": "2022-03-01",
                    "endDate": "Present",
                    "highlights": [
                        "Architected asynchronous ingestion pipeline with FastAPI, Kafka, and PostgreSQL, scaling throughput from 10K to 85K events/sec.",
                        "Reduced cloud infrastructure costs by 32% ($140K/yr) by optimizing Kubernetes pod autoscaling."
                    ]
                }
            ],
            "education": [{"institution": "UC Berkeley", "area": "Computer Science", "studyType": "Bachelor of Science"}]
        }
        
    _master_vault["default"] = data
    return {
        "status": "success",
        "sample_type": sample_type,
        "parsed_profile": data
    }

