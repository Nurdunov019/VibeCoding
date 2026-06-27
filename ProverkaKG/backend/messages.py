"""API error messages — single place for consistent responses."""

COMPLEX_NOT_FOUND = "Объект не найден"
COMPLEX_NOT_FOUND_SLUG = "Объект «{slug}» не найден"
DOCUMENT_NOT_FOUND = "Документ не найден"
LEGAL_NOT_AVAILABLE = "Юридическое заключение пока недоступно"
LEGAL_ACCESS_NOT_FOUND = "Доступ не найден"
REVIEWS_COMMISSIONED_ONLY = "Отзывы доступны только для сданных объектов"

AUTH_REQUIRED = "Требуется вход"
ADMIN_ONLY = "Доступ только для администратора"
EMAIL_TAKEN = "Этот email уже зарегистрирован"
INVALID_CREDENTIALS = "Неверный email или пароль"

SLUG_TAKEN = "Этот slug уже занят"
FILE_TYPE_UNSUPPORTED = "Тип файла не поддерживается: {ext}"
FILE_TOO_LARGE = "Файл больше 10 МБ"
