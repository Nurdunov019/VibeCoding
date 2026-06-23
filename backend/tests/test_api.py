import os
import tempfile

import pytest
from fastapi.testclient import TestClient

_test_dir = tempfile.mkdtemp(prefix="proverkakg-test-")
os.environ["DATABASE_URL"] = f"sqlite:///{_test_dir}/test.db"
os.environ["SECRET_KEY"] = "test-secret-key"

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
    slugs = {c["slug"] for c in r.json()}
    assert slugs == {"salkyn", "borsan-brown"}


def test_get_complex(client):
    r = client.get("/api/complexes/salkyn")
    assert r.status_code == 200
    assert r.json()["slug"] == "salkyn"


def test_complex_not_found(client):
    r = client.get("/api/complexes/nonexistent-slug")
    assert r.status_code == 404


def test_reviews_commissioned_only(client):
    r = client.get("/api/reviews/salkyn")
    assert r.status_code == 400


def test_reviews_commissioned_only_brown(client):
    r = client.get("/api/reviews/borsan-brown")
    assert r.status_code == 400


def test_login_invalid(client):
    r = client.post("/api/auth/login", json={"email": "nobody@test.kg", "password": "wrong"})
    assert r.status_code == 401


def test_admin_login(client):
    r = client.post("/api/auth/login", json={"email": "admin@proverkakg.kg", "password": "112233"})
    assert r.status_code == 200
    assert "access_token" in r.json()
