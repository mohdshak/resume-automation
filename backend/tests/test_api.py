"""
Integration tests for FastAPI endpoints
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from backend.app.main import app
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestAPI(unittest.TestCase):
    def setUp(self):
        if not HAS_FASTAPI:
            self.skipTest("FastAPI not installed in current Python environment")
        self.client = TestClient(app)

    def test_health(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "healthy")

    def test_load_sample_profile(self):
        response = self.client.get("/api/v1/onboarding/sample/tech")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["parsed_profile"]["basics"]["name"], "Alex Mercer")


if __name__ == "__main__":
    unittest.main()
