"""
Unit tests for document parsers
"""

import unittest
from backend.app.parsers.text_parser import parse_text_resume


class TestParsers(unittest.TestCase):
    def test_text_resume_parsing(self):
        sample_text = """
        Alex Mercer
        alex.mercer@example.com
        (555) 234-5678
        
        Summary:
        Software engineer with 6 years experience in Python, FastAPI, and Docker.
        
        Experience:
        CloudScale Technologies - Senior Software Engineer
        2022 to Present
        - Architected ingestion pipeline with FastAPI and Kafka.
        """

        result = parse_text_resume(sample_text)
        self.assertEqual(result["basics"]["name"], "Alex Mercer")
        self.assertEqual(result["basics"]["email"], "alex.mercer@example.com")
        self.assertGreater(len(result["skills"]), 0)
        self.assertGreater(len(result["work"]), 0)


if __name__ == "__main__":
    unittest.main()
