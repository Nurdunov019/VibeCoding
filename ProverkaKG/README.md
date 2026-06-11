# ProverkaKG — Платформа проверки объектов недвижимости

Единый ресурс для покупателей и инвесторов: проверка новостроек, разрешительные документы, юридические заключения.

> Аналог [elitka.kg](https://elitka.kg) по UX, но фокус на **проверке объектов**, а не на рекламе застройщиков.

## Возможности

- **Каталог ЖК** — фильтры, статистика, карточки в стиле elitka.kg
- **Карта** — объекты на OpenStreetMap с попапами
- **Сравнение** — до 4 ЖК в таблице
- **PDF просмотр** — документы и юр. заключения (без скачивания)
- **Авторизация** — регистрация и вход
- **Админ панель** — CRUD для ЖК и документов
- **Deploy** — Render Blueprint (`render.yaml`)

## Запуск локально

```bash
./start.sh
```

Или вручную:

### Backend
```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8002
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Сайт: http://localhost:3002 (API proxy → :8002)

## Демо

- 4 жилых комплекса с разным статусом проверки
- Админ: `admin@proverkakg.kg` / `admin123`

## API

| Метод | URL | Описание |
|-------|-----|----------|
| GET | /api/complexes | Список объектов |
| GET | /api/complexes/map | Маркеры для карты |
| POST | /api/complexes/compare | Сравнение (2–4 slug) |
| GET | /api/complexes/{slug} | Карточка объекта |
| GET | /api/documents/complex/{slug} | Документы |
| GET | /api/documents/verify/{slug} | Проверка |
| POST | /api/legal/request/{slug} | Доступ к юр. заключению |
| POST | /api/auth/login | Вход |
| POST | /api/auth/register | Регистрация |
| GET | /api/admin/complexes | Админ: список ЖК |
| POST | /api/admin/complexes | Админ: создать ЖК |

## Deploy на Render

1. Push репозиторий на GitHub
2. Render Dashboard → **New Blueprint Instance**
3. Выберите репозиторий — `render.yaml` в папке `ProverkaKG`
4. `SECRET_KEY` генерируется автоматически
5. Disk (1 GB) сохраняет SQLite между деплоями

```bash
# Production build локально
./build.sh
cd backend && uvicorn main:app --host 0.0.0.0 --port 8002
```
