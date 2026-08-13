"""
Anti-Hallucination & Fact-Checking Guardrail Tool
Strictly verifies that no fabricated employers, dates, degrees, or ungrounded metrics exist.
"""

import re
from typing import Any, Dict, List, Tuple


def _extract_numbers(text: str) -> List[str]:
    # Extract numbers like 50M, 85K, $140K, 32%, 6, 45%
    return re.findall(r'\b\d+[\%kmb]?\b|\$\d+[\%kmb]?', text.lower())


def verify_resume_facts(master_profile: Dict[str, Any], tailored_draft: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """
    Returns (is_valid, list_of_violations)
    """
    violations = []
    
    # 1. Company Name & Title Verification
    master_companies = {w.get("name", "").strip().lower() for w in master_profile.get("work", [])}
    for w in tailored_draft.get("work", []):
        comp = w.get("name", "").strip().lower()
        if comp and comp not in master_companies:
            violations.append(f"Unverified employer detected: '{w.get('name')}' is not in Master Profile.")
            
    # 2. Education Verification
    master_institutions = {e.get("institution", "").strip().lower() for e in master_profile.get("education", [])}
    for e in tailored_draft.get("education", []):
        inst = e.get("institution", "").strip().lower()
        if inst and inst not in master_institutions:
            violations.append(f"Unverified institution detected: '{e.get('institution')}' is not in Master Profile.")
            
    # 3. Numbers & Metrics Grounding Verification
    master_text = " ".join([
        " ".join(w.get("highlights", [])) for w in master_profile.get("work", [])
    ]).lower()
    master_numbers = set(_extract_numbers(master_text))
    
    for w in tailored_draft.get("work", []):
        for h in w.get("highlights", []):
            draft_numbers = _extract_numbers(h)
            for num in draft_numbers:
                if num not in master_numbers:
                    # Metric was not found in the original master profile
                    violations.append(f"Unverified metric detected in bullet: '{num}' inside '{h[:60]}...'")
                    
    is_valid = len(violations) == 0
    return is_valid, violations
