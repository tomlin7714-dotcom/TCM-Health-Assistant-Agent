import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"


@pytest_asyncio.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac


@pytest.mark.anyio
async def test_health(client: AsyncClient):
    resp = await client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


@pytest.mark.anyio
async def test_list_herbs(client: AsyncClient):
    resp = await client.get("/api/herbs")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) >= 6
    assert data[0]["id"] == "h1"


@pytest.mark.anyio
async def test_get_herb_not_found(client: AsyncClient):
    resp = await client.get("/api/herbs/nonexistent")
    assert resp.status_code == 404


@pytest.mark.anyio
async def test_list_recipes(client: AsyncClient):
    resp = await client.get("/api/recipes")
    assert resp.status_code == 200
    assert len(resp.json()) >= 3


@pytest.mark.anyio
async def test_list_workouts(client: AsyncClient):
    resp = await client.get("/api/workouts")
    assert resp.status_code == 200
    assert len(resp.json()) >= 3


@pytest.mark.anyio
async def test_guest_login(client: AsyncClient):
    resp = await client.post("/api/auth/login", json={"guest": True})
    assert resp.status_code == 200
    body = resp.json()
    assert "access_token" in body
    assert body["user"]["is_guest"] is True


@pytest.mark.anyio
async def test_phone_login(client: AsyncClient):
    resp = await client.post("/api/auth/login", json={"phone": "13800138000"})
    assert resp.status_code == 200
    body = resp.json()
    assert "access_token" in body


@pytest.mark.anyio
async def test_protected_history_requires_auth(client: AsyncClient):
    resp = await client.get("/api/history")
    assert resp.status_code == 401


@pytest.mark.anyio
async def test_constitution_questions(client: AsyncClient):
    resp = await client.get("/api/constitution/questions")
    assert resp.status_code == 200
    assert len(resp.json()["questions"]) == 3
