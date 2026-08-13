"""
ATS Evaluation & Metric Calculation Tool
Computes the 4-part hybrid ATS match score:
- 40% Keyword & Tool overlap
- 35% Semantic alignment
- 15% STAR/XYZ Impact & Metrics
- 10% ATS Format Compliance
"""

import re
from typing import Any, Dict, List, Set, Tuple


def _extract_all_text(resume: Dict[str, Any]) -> str:
    parts = []
    basics = resume.get("basics", {})
    parts.append(basics.get("summary", ""))
    parts.append(basics.get("label", ""))
    
    for skill in resume.get("skills", []):
        parts.append(skill.get("name", ""))
        parts.extend(skill.get("keywords", []))
        
    for work in resume.get("work", []):
        parts.append(work.get("position", ""))
        parts.append(work.get("summary", ""))
        parts.extend(work.get("highlights", []))
        
    for proj in resume.get("projects", []):
        parts.append(proj.get("name", ""))
        parts.append(proj.get("description", ""))
        parts.extend(proj.get("highlights", []))
        
    return " ".join([p for p in parts if p]).lower()


def compute_keyword_overlap(resume: Dict[str, Any], required_keywords: List[str]) -> Tuple[float, List[str], List[str]]:
    """
    Returns (match_ratio, matched_keywords, missing_keywords)
    """
    resume_text = _extract_all_text(resume)
    matched = []
    missing = []
    
    for kw in required_keywords:
        pattern = r'\b' + re.escape(kw.lower()) + r'\b'
        if re.search(pattern, resume_text):
            matched.append(kw)
        else:
            missing.append(kw)
            
    ratio = len(matched) / len(required_keywords) if required_keywords else 1.0
    return round(ratio, 3), matched, missing


def compute_impact_score(resume: Dict[str, Any]) -> float:
    """
    Evaluates STAR/XYZ quantification: presence of numbers, %, $, metrics, and active verbs.
    """
    bullets = []
    for work in resume.get("work", []):
        bullets.extend(work.get("highlights", []))
    for proj in resume.get("projects", []):
        bullets.extend(proj.get("highlights", []))
        
    if not bullets:
        return 0.5
        
    quantified_count = 0
    metric_regex = re.compile(r'(\d+[\%kmb]?|\$\d+|\d+\+|\b\d+\b)', re.IGNORECASE)
    action_verb_regex = re.compile(r'^(architected|engineered|built|scaled|developed|spearheaded|reduced|increased|optimized|launched|designed|implemented)', re.IGNORECASE)
    
    for b in bullets:
        has_metric = bool(metric_regex.search(b))
        has_action = bool(action_verb_regex.search(b.strip()))
        if has_metric and has_action:
            quantified_count += 1
        elif has_metric or has_action:
            quantified_count += 0.5
            
    return round(min(1.0, quantified_count / len(bullets)), 3)


def compute_ats_score(resume: Dict[str, Any], extracted_jd: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes weighted hybrid ATS score (0 - 100).
    """
    req_skills = extracted_jd.get("required_skills", [])
    tools = extracted_jd.get("tools", [])
    all_targets = list(set(req_skills + tools))
    
    keyword_ratio, matched_kws, missing_kws = compute_keyword_overlap(resume, all_targets)
    impact_score = compute_impact_score(resume)
    
    # Semantic approximation
    semantic_score = min(1.0, keyword_ratio * 1.1)
    
    # Format compliance check
    format_score = 1.0 if resume.get("work") and resume.get("skills") and resume.get("education") else 0.7
    
    # Weighted calculation
    # 40% Keyword + 35% Semantic + 15% Impact + 10% Format
    total_score = (keyword_ratio * 40.0) + (semantic_score * 35.0) + (impact_score * 15.0) + (format_score * 10.0)
    total_score = round(min(100.0, max(0.0, total_score)), 1)
    
    return {
        "overall_score": total_score,
        "is_ats_compliant": total_score >= 85.0,
        "breakdown": {
            "keyword_match": round(keyword_ratio * 100, 1),
            "semantic_relevance": round(semantic_score * 100, 1),
            "impact_quantification": round(impact_score * 100, 1),
            "format_compliance": round(format_score * 100, 1)
        },
        "matched_keywords": matched_kws,
        "missing_keywords": missing_kws
    }
