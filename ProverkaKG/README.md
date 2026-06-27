# ProverkaKG — ПроверКа.кг

Платформа проверки новостроек Кыргызстана: документы, разрешения, юридические заключения.

## 🌐 Сайт (живой)

**GitHub ссылкасы — бул код гана, сайт эмес.** Башкаларга жөнөтүү үчүн төмөнкү шилтемени колдонуңуз:

👉 **https://proverkakg.onrender.com**

| Шилтеме | Эмне |
|---------|------|
| https://github.com/Nurdunov019/ProverKa.kg | Код (разработчиктер үчүн) |
| https://proverkakg.onrender.com | Сайт (баардык үчүн) |

## Возможности

- **Каталог ЖК** — фильтры, статистика, карточки
- **Шаар тандагыч** — Бишкек, Ош, Манас, Ысык-Көл, Нарын, Талас, Баткен
- **Юр. заключение** — безлимитный просмотр на платформе
- **Отзывы жителей** — только на сданных ЖК
- **Карта** — объекты на OpenStreetMap
- **Сравнение** — до 4 ЖК
- **PDF просмотр** — документы без скачивания
- **Админ панель** — CRUD для ЖК и документов
- **Адаптив** — телефон, планшет, ноутбук, ТВ

## Запуск локально

```bash
cp .env.example .env   # SECRET_KEY жана ADMIN_PASSWORD өзгөртүңүз
./start.sh
```

Сайт: http://localhost:3002

## Тесты

```bash
cd backend
pip install -r requirements.txt
pytest tests/ -v
```

## Deploy на Render

1. [render.com](https://render.com) → **New** → **Blueprint**
2. Репозиторий: **Nurdunov019/ProverKa.kg**
3. **Apply** — `render.yaml` автоматтык иштейт
4. Dashboard → Environment: `SECRET_KEY`, `ADMIN_PASSWORD` коюңуз

Код өзгөргөндө GitHub push → Render автоматтык жаңырат.

### Production checklist

- [ ] `SECRET_KEY` — уникальный случайный ключ (не dev-default)
- [ ] `ADMIN_PASSWORD` — сильный пароль (не `admin123`)
- [ ] `ADMIN_EMAIL` — рабочий email администратора
- [ ] SQLite на free tier — данные сбрасываются при redeploy; для продакшена рассмотрите Render Postgres
- [ ] Загрузки (`/uploads`) — эфемерны на Render; для постоянного хранения нужен диск или S3
- [ ] `pytest tests/` проходит локально перед push
