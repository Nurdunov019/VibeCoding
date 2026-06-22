import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { mediaUrl } from '../utils/mediaUrl'
import { formatCompletion, formatLocation } from '../utils/formatCompletion'

export default function CatalogCard({ complex }) {
  const { t } = useLocale()
  const completion = formatCompletion(complex, t('catalog.yearShort'))
  const location = formatLocation(complex)

  return (
    <Link to={`/complex/${complex.slug}`} className="catalog-card">
      <div className="catalog-card-media">
        {complex.image_url ? (
          <img src={mediaUrl(complex.image_url)} alt={complex.name} loading="lazy" />
        ) : (
          <div className="catalog-card-ph" />
        )}
        <div className="catalog-card-overlay" />
        <div className="catalog-card-content">
          {completion && <p className="catalog-card-date">{completion}</p>}
          <h3 className="catalog-card-name">{complex.name}</h3>
          {location && <p className="catalog-card-loc">{location}</p>}
          {complex.price_per_sqm_usd != null && (
            <p className="catalog-card-price">${complex.price_per_sqm_usd} / м²</p>
          )}
          <span className="catalog-card-cta">→</span>
        </div>
      </div>
    </Link>
  )
}
