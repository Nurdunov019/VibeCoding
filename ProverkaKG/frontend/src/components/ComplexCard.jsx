import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { useFavorites } from '../context/FavoritesContext'
import { useLocale } from '../context/LocaleContext'

const STATUS_KEYS = {
  verified: 'card.verified',
  partial: 'card.partial',
  unverified: 'card.unverified',
  risk: 'card.risk',
}

export default function ComplexCard({ complex }) {
  const { t } = useLocale()
  const { toggle, isSelected, slugs, max } = useCompare()
  const { toggle: toggleFav, isFavorite } = useFavorites()
  const stKey = STATUS_KEYS[complex.verification_status] || STATUS_KEYS.unverified
  const statusLabel = complex.status === 'commissioned' ? t('card.commissioned') : t('card.building')
  const selected = isSelected(complex.slug)
  const full = slugs.length >= max && !selected
  const fav = isFavorite(complex.slug)

  const detailUrl = `/complex/${complex.slug}`

  return (
    <article className="complex-card elitka-card">
      <Link to={detailUrl} className="complex-image complex-image-link">
        {complex.image_url ? (
          <img src={complex.image_url} alt={complex.name} />
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
        <div className="complex-actions">
          <Link to={detailUrl} className="btn-outline btn-sm">{t('card.details')}</Link>
          <button
            type="button"
            className={`btn-compare btn-sm ${selected ? 'active' : ''}`}
            onClick={() => toggle(complex.slug)}
            disabled={full}
          >
            {selected ? t('card.compared') : `+ ${t('card.compare')}`}
          </button>
        </div>
      </div>
    </article>
  )
}
