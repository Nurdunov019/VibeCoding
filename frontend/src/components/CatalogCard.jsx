import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { useLocale } from '../context/LocaleContext'
import { resolveLegalDocUrl } from '../data/legalDocuments'
import { mediaUrl } from '../utils/mediaUrl'
import { formatCompletion, formatLocation } from '../utils/formatCompletion'
import CompareToggle from './CompareToggle'
import LegalOpenButton from './LegalOpenButton'

export default function CatalogCard({ complex }) {
  const { t, lang } = useLocale()
  const { picking, isSelected } = useCompare()
  const completion = formatCompletion(complex, t('catalog.yearShort'), lang)
  const location = formatLocation(complex, lang)
  const legalDocUrl = resolveLegalDocUrl(complex)
  const hasLegal = Boolean(legalDocUrl)
  const complexUrl = `/complex/${complex.slug}`
  const showCompare = picking || isSelected(complex.slug)

  return (
    <article className="catalog-card">
      <div className="catalog-card-media">
        <Link to={complexUrl} className="catalog-card-hit" aria-label={complex.name}>
          {complex.image_url ? (
            <img src={mediaUrl(complex.image_url)} alt="" loading="lazy" />
          ) : (
            <div className="catalog-card-ph" />
          )}
          <div className="catalog-card-overlay" />
        </Link>

        <div className={`catalog-card-footer${showCompare ? '' : ' catalog-card-footer--compact'}`}>
          <Link to={complexUrl} className="catalog-card-text">
            {completion && <p className="catalog-card-date">{completion}</p>}
            <h3 className="catalog-card-name">{complex.name}</h3>
            {location && <p className="catalog-card-loc">{location}</p>}
            {complex.price_per_sqm_usd != null && (
              <p className="catalog-card-price">${complex.price_per_sqm_usd} / м²</p>
            )}
          </Link>

          {hasLegal && (
            <LegalOpenButton slug={complex.slug} docUrl={legalDocUrl} className="catalog-card-legal" />
          )}

          <CompareToggle slug={complex.slug} className="btn-compare btn-sm catalog-card-compare" />

          <Link to={complexUrl} className="catalog-card-cta" aria-label={t('card.details')}>
            →
          </Link>
        </div>
      </div>
    </article>
  )
}
