"""
Resume Data Models conforming to the JSON Resume Schema standard
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class Profile(BaseModel):
    network: str
    username: str
    url: Optional[str] = None


class Location(BaseModel):
    address: Optional[str] = None
    postalCode: Optional[str] = None
    city: Optional[str] = None
    countryCode: Optional[str] = None
    region: Optional[str] = None


class Basics(BaseModel):
    name: str
    label: Optional[str] = None
    image: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    url: Optional[str] = None
    summary: Optional[str] = None
    location: Optional[Location] = None
    profiles: List[Profile] = Field(default_factory=list)


class WorkExperience(BaseModel):
    name: str  # Company Name
    position: str  # Job Title
    url: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    summary: Optional[str] = None
    highlights: List[str] = Field(default_factory=list)
    location: Optional[str] = None


class Education(BaseModel):
    institution: str
    url: Optional[str] = None
    area: Optional[str] = None
    studyType: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    score: Optional[str] = None
    courses: List[str] = Field(default_factory=list)


class SkillCategory(BaseModel):
    name: str  # e.g., "Programming Languages", "Cloud & DevOps"
    level: Optional[str] = None
    keywords: List[str] = Field(default_factory=list)


class Project(BaseModel):
    name: str
    description: Optional[str] = None
    highlights: List[str] = Field(default_factory=list)
    keywords: List[str] = Field(default_factory=list)
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    url: Optional[str] = None


class Certification(BaseModel):
    name: str
    date: Optional[str] = None
    issuer: Optional[str] = None
    url: Optional[str] = None


class ResumeSchema(BaseModel):
    basics: Basics
    work: List[WorkExperience] = Field(default_factory=list)
    education: List[Education] = Field(default_factory=list)
    skills: List[SkillCategory] = Field(default_factory=list)
    projects: List[Project] = Field(default_factory=list)
    certifications: List[Certification] = Field(default_factory=list)
