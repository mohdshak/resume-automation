"""
PDF Resume Document Parser
"""

import io
import re
from typing import Any, Dict
try:
    import pdfplumber
except ImportError:
    pdfplumber = None


def parse_pdf_resume(file_bytes: bytes) -> Dict[str, Any]:
    """
    Extracts text and structured sections from PDF resumes.
    """
    extracted_text = ""
    if pdfplumber is not None:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
    else:
        # Fallback basic decode
        extracted_text = file_bytes.decode("utf-8", errors="ignore")
        
    from .text_parser import parse_text_resume
    return parse_text_resume(extracted_text)
