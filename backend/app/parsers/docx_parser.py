"""
DOCX Resume Document Parser
"""

import io
from typing import Any, Dict
try:
    import docx
except ImportError:
    docx = None


def parse_docx_resume(file_bytes: bytes) -> Dict[str, Any]:
    """
    Extracts text and structured sections from DOCX resumes.
    """
    extracted_text = ""
    if docx is not None:
        doc = docx.Document(io.BytesIO(file_bytes))
        paragraphs = [p.text for p in doc.paragraphs if p.text]
        extracted_text = "\n".join(paragraphs)
    else:
        extracted_text = file_bytes.decode("utf-8", errors="ignore")
        
    from .text_parser import parse_text_resume
    return parse_text_resume(extracted_text)
