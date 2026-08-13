"""
Tests for Multi-Agent Orchestrator Graph
"""

import unittest
import asyncio
import json
from pathlib import Path
from agents.orchestrator import ResumeTailorOrchestrator


class TestAgentGraph(unittest.TestCase):
    def test_full_pipeline_execution(self):
        sample_resume_path = Path(__file__).parents[2] / "data" / "sample_resumes" / "tech_software_engineer.json"
        sample_jd_path = Path(__file__).parents[2] / "data" / "sample_jds" / "senior_backend_engineer.txt"

        with open(sample_resume_path) as f:
            master_profile = json.load(f)
        with open(sample_jd_path) as f:
            raw_jd = f.read()

        orchestrator = ResumeTailorOrchestrator()
        final_state = asyncio.run(orchestrator.run_pipeline({
            "master_profile": master_profile,
            "raw_jd_text": raw_jd
        }))

        self.assertTrue(final_state.pipeline_completed)
        self.assertTrue(final_state.fact_check_passed)
        self.assertGreaterEqual(final_state.ats_score, 80.0)
        self.assertGreater(len(final_state.diffs), 0)
        self.assertIn("basics", final_state.final_resume)


if __name__ == "__main__":
    unittest.main()
