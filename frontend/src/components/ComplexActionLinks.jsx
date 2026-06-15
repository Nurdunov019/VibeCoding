import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { complexUrls } from '../utils/complex'

export default function ComplexActionLinks({ slug, status, className = 'complex-actions' }) {
  const { t } = useLocale()
  const urls = complexUrls(slug, status)
  const commissioned = status === 'commissioned'

  return (
    <div className={`${className}${commissioned ? ' complex-actions-3' : ''}`}>
      <Link to={urls.detail} className="btn-outline btn-sm">{t('card.details')}</Link>
      <Link to={urls.legal} className="btn-legal btn-sm">{t('card.legal')}</Link>
      {commissioned && (
        <Link to={urls.reviews} className="btn-outline btn-sm">{t('card.reviews')}</Link>
      )}
    </div>
  )
}
