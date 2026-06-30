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
    assert len(slugs) == 14
    assert {
        "salkyn", "borsan-brown", "eliseiskie-polya", "one-ordo-resort", "siren", "tokio", "green-line",
        "jannat-tower", "levan-park", "level-lux", "akkula", "vremena-goda", "gorizont", "tokio-city",
    } == slugs


def test_get_complex(client):
    r = client.get("/api/complexes/salkyn")
    assert r.status_code == 200
    assert r.json()["slug"] == "salkyn"


def test_complex_not_found(client):
    r = client.get("/api/complexes/nonexistent-slug")
    assert r.status_code == 404


def test_search_case_insensitive(client):
    r = client.get("/api/complexes", params={"search": "салкын"})
    assert r.status_code == 200
    slugs = {c["slug"] for c in r.json()}
    assert "salkyn" in slugs

    r2 = client.get("/api/complexes", params={"search": "brown"})
    assert r2.status_code == 200
    assert any(c["slug"] == "borsan-brown" for c in r2.json())


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


def test_seed_preserves_custom_image_url(client):
    from database import SessionLocal
    from models import Complex
    from seed import seed_database

    db = SessionLocal()
    try:
        siren = db.query(Complex).filter(Complex.slug == "siren").first()
        assert siren is not None
        custom = "/images/siren-custom-test.jpg"
        siren.image_url = custom
        db.commit()

        seed_database(db)

        db.refresh(siren)
        assert siren.image_url == custom
    finally:
        db.close()
