import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { complexUrls } from '../utils/complex'
import CompareToggle from './CompareToggle'
import { resolveLegalDocUrl } from '../data/legalDocuments'
import LegalOpenButton from './LegalOpenButton'

export default function ComplexActionLinks({ slug, status, legalDocUrl, className = 'complex-actions' }) {
  const { t } = useLocale()
  const urls = complexUrls(slug, status)
  const commissioned = status === 'commissioned'

  return (
    <div className={`${className}${commissioned ? ' complex-actions-3' : ''}`}>
      <Link to={urls.detail} className="btn-outline btn-sm">{t('card.details')}</Link>
      <LegalOpenButton slug={slug} docUrl={resolveLegalDocUrl({ slug, legal_doc_url: legalDocUrl })} />
      {commissioned && (
        <Link to={urls.reviews} className="btn-outline btn-sm">{t('card.reviews')}</Link>
      )}
      <CompareToggle slug={slug} />
    </div>
  )
}
