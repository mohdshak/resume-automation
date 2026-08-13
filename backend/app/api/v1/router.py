"""
Main API v1 Router Aggregator
"""

from fastapi import APIRouter
from backend.app.api.v1.onboarding import router as onboarding_router
from backend.app.api.v1.profile import router as profile_router
from backend.app.api.v1.jd import router as jd_router
from backend.app.api.v1.tailor import router as tailor_router
from backend.app.api.v1.diff import router as diff_router
from backend.app.api.v1.export import router as export_router
from backend.app.api.v1.applications import router as applications_router

api_v1_router = APIRouter()

api_v1_router.include_router(onboarding_router, prefix="/onboarding", tags=["Onboarding"])
api_v1_router.include_router(profile_router, prefix="/profile", tags=["Master Profile"])
api_v1_router.include_router(jd_router, prefix="/jd", tags=["Job Description"])
api_v1_router.include_router(tailor_router, prefix="/tailor", tags=["Auto Tailor Multi-Agent"])
api_v1_router.include_router(diff_router, prefix="/diff", tags=["Diff Inspector"])
api_v1_router.include_router(export_router, prefix="/export", tags=["Export"])
api_v1_router.include_router(applications_router, prefix="/applications", tags=["Application Tracker"])
