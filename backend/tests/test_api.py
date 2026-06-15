import os
import tempfile

import pytest
from fastapi.testclient import TestClient

_test_dir = tempfile.mkdtemp(prefix="proverkakg-test-")
os.environ["DATABASE_URL"] = f"sqlite:///{_test_dir}/test.db"
os.environ["SECRET_KEY"] = "test-secret-key"
os.environ["ADMIN_EMAIL"] = "admin@test.kg"
os.environ["ADMIN_PASSWORD"] = "test-admin-pass"

from main import app  # noqa: E402


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


def test_health(client):
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_list_complexes(client):
    r = client.get("/api/complexes")
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_get_complex(client):
    r = client.get("/api/complexes/green-side")
    assert r.status_code == 200
    assert r.json()["slug"] == "green-side"


def test_complex_not_found(client):
    r = client.get("/api/complexes/nonexistent-slug")
    assert r.status_code == 404


def test_reviews_commissioned_only(client):
    r = client.get("/api/reviews/han-teniri")
    assert r.status_code == 400


def test_reviews_commissioned(client):
    r = client.get("/api/reviews/green-side")
    assert r.status_code == 200
    data = r.json()
    assert "average_rating" in data
    assert "reviews" in data


def test_login_invalid(client):
    r = client.post("/api/auth/login", json={"email": "nobody@test.kg", "password": "wrong"})
    assert r.status_code == 401


def test_admin_login(client):
    r = client.post("/api/auth/login", json={"email": "admin@test.kg", "password": "test-admin-pass"})
    assert r.status_code == 200
    assert "access_token" in r.json()
