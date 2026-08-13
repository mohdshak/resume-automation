"""
Job Application Pipeline Tracker Endpoints
"""

from typing import Any, Dict, List
from fastapi import APIRouter
from pydantic import BaseModel, Field
import datetime

router = APIRouter()

_applications: List[Dict[str, Any]] = [
    {
        "id": "app-1",
        "company": "StripeStream Cloud",
        "role": "Senior Backend Engineer",
        "applied_date": "2026-08-10",
        "status": "Applied",
        "ats_score": 92.5,
        "notes": "Tailored for Kafka and distributed stream processing"
    }
]


class ApplicationItem(BaseModel):
    id: str = Field(default_factory=lambda: f"app-{datetime.datetime.utcnow().timestamp()}")
    company: str
    role: str
    applied_date: str = Field(default_factory=lambda: datetime.date.today().isoformat())
    status: str = "Applied"  # Applied, Interviewing, Offer, Rejected
    ats_score: float = 0.0
    notes: str = ""


@router.get("/")
async def get_applications():
    return {"applications": _applications}


@router.post("/")
async def create_application(app: ApplicationItem):
    _applications.append(app.dict())
    return {"status": "success", "application": app}
