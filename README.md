# Quran Tracker — Куран сабактарын көзөмөлдөө

Веб-платформа окуучулар менен устаздар үчүн: күндөлүк прогресс, топтук статус, рейтинг, Excel отчёт жана Telegram-бот.

## Мүмкүнчүлүктөр

- Авторизация (окуучу, устаз, админ)
- Окуучу: «Мен» жана «БААРЫ» вкладкалары
- Устаз: топтор, окуучулар, ырастоо
- Главная: рейтинг таблицасы
- Авто жаңылоо (30 сек)
- Excel отчёт (3 ай)
- Графиктер: апталык кайталоолор, бет боюнча прогресс
- Telegram-бот: эскертүүлөр (Asia/Bishkek, 20:00)
- Telegram Mini App колдоосу

## Демо-аккаунттар

| Роль | Логин | Пароль |
|------|-------|--------|
| Окуучу | ahmad | student123 |
| Окуучу | ali | student123 |
| Устаз | ustaz | teacher123 |
| Админ | admin | admin123 |

Топ: **Биринчи топ** (ustaz → ahmad, ali)

## Docker менен иштетүү

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

Telegram-бот:

```bash
cp .env.example .env
# .env файлында TELEGRAM_BOT_TOKEN коюңуз
docker compose --profile bot up --build
```

## Локалдык иштетүү

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173 (API прокси → :8000)

## Telegram-ботту туташтыруу

1. [@BotFather](https://t.me/BotFather) аркылуу бот түзүңүз
2. `TELEGRAM_BOT_TOKEN` орнотуңуз
3. Окуучу ботко жазыңыз: `/link ahmad student123`

## Telegram Mini App

Telegram Mini App'ти орнотуу үчүн:

1. [@BotFather](https://t.me/BotFather) аркылуу Mini App түзүңүз:
   - `/newapp` командасын жибериңиз
   - Аталышын берүңүз (мисалы: "Quran Tracker")
   - Суранган маалыматтарды толтуруңуз
   - Backend URL'ин киргизиңиз (мисалы: `https://your-domain.com`)
   - Bot username'ин киргизиңиз

2. `.env` файлында `TELEGRAM_BOT_USERNAME` орнотуңуз

3. Mini App'ти Telegram'да ачыңыз:
   - Боттонун менюсунан "Open App" басыңыз
   - же төмөнкү сылканы колдонуңуз: `https://t.me/your_bot_username/your_app_name`

## Структура

```
backend/
  main.py          — FastAPI app
  models.py        — SQLAlchemy моделдер
  routers/         — API endpoints
  bot/             — Telegram бот
  seed.py          — демо-маалымат
frontend/
  src/             — React SPA
docker-compose.yml
```

## API негизги endpointтер

| Метод | URL | Сүрөттөмө |
|-------|-----|-----------|
| POST | /api/auth/login | Кирүү |
| GET | /api/ranking | Рейтинг |
| POST | /api/progress | Прогресс сактоо |
| GET | /api/progress/group/{id} | БААРЫ статусу |
| POST | /api/groups | Топ түзүү |
| GET | /api/reports/excel | Excel отчёт |

## Сценарий (тест)

1. `ustaz` / `teacher123` → топ түзүү, окуучу кошуу
2. `ahmad` / `student123` → «Мен» → бет 5, 20 кайталоо → Сактоо
3. «БААРЫ» → Ахмад окуду, Али жок
4. Главная → Ахмад 1-орунда
5. Кечинде бот Алиге эскертүү жөнөтөт (эгер Telegram туташкан болсо)
