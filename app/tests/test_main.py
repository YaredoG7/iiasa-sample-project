"""
Test are not yet impelented
"""
from fastapi.testclient import TestClient
from app import main

client = TestClient(main)

def test_generic_response():
    """
    @TODO
    """
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"code": 200, "message": "", "data": []}
