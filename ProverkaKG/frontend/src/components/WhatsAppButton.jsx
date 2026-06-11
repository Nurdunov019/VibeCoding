import { WHATSAPP_URL } from '../constants/regions'
import { useLocale } from '../context/LocaleContext'

export default function WhatsAppButton() {
  const { t } = useLocale()

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      title={t('whatsapp.label')}
      aria-label={t('whatsapp.label')}
    >
      <span className="wa-icon">💬</span>
      <span className="wa-text">{t('whatsapp.label')}</span>
    </a>
  )
}
