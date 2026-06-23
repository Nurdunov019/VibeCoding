import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { complexUrls } from '../utils/complex'
import LegalOpenButton from './LegalOpenButton'

export default function ComplexActionLinks({ slug, status, className = 'complex-actions' }) {
  const { t } = useLocale()
  const urls = complexUrls(slug, status)
  const commissioned = status === 'commissioned'

  return (
    <div className={`${className}${commissioned ? ' complex-actions-3' : ''}`}>
      <Link to={urls.detail} className="btn-outline btn-sm">{t('card.details')}</Link>
      <LegalOpenButton slug={slug} fallbackHref={urls.legal} />
      {commissioned && (
        <Link to={urls.reviews} className="btn-outline btn-sm">{t('card.reviews')}</Link>
      )}
    </div>
  )
}
