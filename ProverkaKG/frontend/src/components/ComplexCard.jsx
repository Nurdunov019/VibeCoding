import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import { useLocale } from '../context/LocaleContext'
import ComplexActionLinks from './ComplexActionLinks'

export default function ComplexCard({ complex }) {
  const { t } = useLocale()
  const { toggle: toggleFav, isFavorite } = useFavorites()
  const statusLabel = complex.status === 'commissioned' ? t('card.commissioned') : t('card.building')
  const fav = isFavorite(complex.slug)
  const detailUrl = `/complex/${complex.slug}`

  return (
    <article className="complex-card elitka-card">
      <Link to={detailUrl} className="complex-image complex-image-link">
        {complex.image_url ? (
          <img src={complex.image_url} alt={complex.name} loading="lazy" decoding="async" />
        ) : (
          <div className="img-ph">ЖК</div>
        )}
        <span className="complex-date">{complex.completion_quarter} {complex.completion_year}</span>
        {complex.verification_status === 'verified' && (
          <span className="verified-badge">✓ {t('card.verified')}</span>
        )}
        <button
          type="button"
          className={`fav-btn ${fav ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFav(complex.slug) }}
          aria-label="Favorite"
        >
          ♥
        </button>
      </Link>
      <div className="complex-body">
        <div className="complex-rating">
          <span className="rating-star">★</span>
          <strong>{(complex.verification_score / 20).toFixed(1)}</strong>
          <span className="muted">{t('card.check')} {complex.verification_score}%</span>
        </div>
        <Link to={detailUrl}>
          <h3>{complex.name}</h3>
        </Link>
        <p className="developer">{complex.developer}</p>
        <p className="address">{complex.address}</p>
        <div className="complex-footer">
          <div className="price-block">
            <strong className="price-usd">${complex.price_per_sqm_usd?.toLocaleString()}</strong>
            <span className="price-label">{t('card.perSqm')}</span>
            <span className="price-kgs muted">({complex.price_per_sqm_kgs?.toLocaleString()} с)</span>
          </div>
          <span className={`status-pill ${complex.status}`}>{statusLabel}</span>
        </div>
        <ComplexActionLinks slug={complex.slug} status={complex.status} legalDocUrl={complex.legal_doc_url} />
      </div>
    </article>
  )
}
