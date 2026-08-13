"""
Unit tests for Fact-Checking Anti-Hallucination Guardrails
"""

import unittest
from agents.tools.guardrail_tools import verify_resume_facts


class TestHallucinationGuardrail(unittest.TestCase):
    def test_fact_check_valid(self):
        master = {
            "work": [
                {
                    "name": "CloudScale Technologies",
                    "highlights": ["Scaled Kafka throughput from 10K to 85K events/sec."]
                }
            ],
            "education": [{"institution": "UC Berkeley"}]
        }

        draft = {
            "work": [
                {
                    "name": "CloudScale Technologies",
                    "highlights": ["Engineered Kafka pipeline scaling from 10K to 85K events/sec."]
                }
            ],
            "education": [{"institution": "UC Berkeley"}]
        }

        is_valid, violations = verify_resume_facts(master, draft)
        self.assertTrue(is_valid)
        self.assertEqual(len(violations), 0)

    def test_fact_check_catches_fake_metric(self):
        master = {
            "work": [
                {
                    "name": "CloudScale Technologies",
                    "highlights": ["Scaled Kafka throughput from 10K to 85K events/sec."]
                }
            ],
            "education": [{"institution": "UC Berkeley"}]
        }

        # Injected fake 999K metric
        hallucinated_draft = {
            "work": [
                {
                    "name": "CloudScale Technologies",
                    "highlights": ["Scaled Kafka throughput to 999K events/sec."]
                }
            ],
            "education": [{"institution": "UC Berkeley"}]
        }

        is_valid, violations = verify_resume_facts(master, hallucinated_draft)
        self.assertFalse(is_valid)
        self.assertTrue(any("999k" in v.lower() for v in violations))


if __name__ == "__main__":
    unittest.main()
