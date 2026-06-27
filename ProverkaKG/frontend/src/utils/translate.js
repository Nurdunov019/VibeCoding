const API_ERROR_KEYS = {
  'Объект не найден': 'errors.complexNotFound',
  'Документ не найден': 'errors.documentNotFound',
  'Юридическое заключение пока недоступно': 'errors.legalNotAvailable',
  'Доступ не найден': 'errors.legalAccessNotFound',
  'Отзывы доступны только для сданных объектов': 'errors.reviewsCommissionedOnly',
  'Требуется вход': 'errors.authRequired',
  'Доступ только для администратора': 'errors.adminOnly',
  'Этот email уже зарегистрирован': 'errors.emailTaken',
  'Неверный email или пароль': 'errors.invalidCredentials',
  'Этот slug уже занят': 'errors.slugTaken',
  'Ошибка сервера': 'errors.server',
  'Жүктөө катасы': 'errors.upload',
}

export function translateApiError(message, t) {
  if (!message) return t('errors.server')
  const key = API_ERROR_KEYS[message]
  if (key) return t(key)
  if (message.startsWith('Объект «') && message.endsWith('» не найден')) {
    return t('errors.complexNotFound')
  }
  if (message.startsWith('Тип файла не поддерживается')) return t('errors.fileType')
  if (message.startsWith('Файл больше')) return t('errors.fileTooLarge')
  return message
}

export function statusLabel(t, prefix, value) {
  if (!value) return ''
  const key = `${prefix}.${value}`
  const translated = t(key)
  return translated !== key ? translated : value
}
