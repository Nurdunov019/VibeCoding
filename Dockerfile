# ProverkaKG — production image (Render Docker runtime)
FROM node:20-alpine AS frontend
WORKDIR /frontend
COPY ProverkaKG/frontend/package.json ProverkaKG/frontend/package-lock.json ./
RUN npm ci
COPY ProverkaKG/frontend/ ./
RUN npm run build

FROM python:3.11-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY ProverkaKG/backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY ProverkaKG/backend/ ./backend/
COPY --from=frontend /frontend/dist ./frontend/dist

WORKDIR /app/backend
EXPOSE 10000
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000}
