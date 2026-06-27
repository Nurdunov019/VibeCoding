import { useLocale } from '../context/LocaleContext'
import { mediaUrl } from '../utils/mediaUrl'
import { formatCompletion, formatLocation } from '../utils/formatCompletion'

export default function CatalogCoverHero({ complex }) {
  const { t } = useLocale()
  const completion = formatCompletion(complex, t('catalog.yearShort'))
  const location = formatLocation(complex)

  return (
    <div className="catalog-cover-hero">
      {complex.image_url ? (
        <img
          src={mediaUrl(complex.image_url)}
          alt={complex.name}
          className="catalog-cover-img"
          decoding="async"
          fetchPriority="high"
        />
      ) : (
        <div className="catalog-cover-ph" />
      )}
      <div className="catalog-cover-overlay" />
      <div className="catalog-cover-text">
        {completion && <p className="catalog-cover-date">{completion}</p>}
        <h1 className="catalog-cover-name">{complex.name}</h1>
        {location && <p className="catalog-cover-loc">{location}</p>}
        {complex.developer && <p className="catalog-cover-dev">{complex.developer}</p>}
      </div>
    </div>
  )
}
