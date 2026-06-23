import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { api } from '../api'
import { getLegalDocUrl } from '../data/legalDocuments'
import { mediaUrl } from '../utils/mediaUrl'
import { formatCompletion, formatLocation } from '../utils/formatCompletion'
import LegalDocumentModal from './LegalDocumentModal'

export default function CatalogCard({ complex }) {
  const { t } = useLocale()
  const completion = formatCompletion(complex, t('catalog.yearShort'))
  const location = formatLocation(complex)
  const hasLegal = Boolean(getLegalDocUrl(complex.slug))
  const [legalOpen, setLegalOpen] = useState(false)
  const [legalReport, setLegalReport] = useState(null)

  const openLegal = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!legalReport) {
      try {
        const report = await api.getLegalPreview(complex.slug)
        setLegalReport(report)
      } catch {
        return
      }
    }
    setLegalOpen(true)
  }

  return (
    <article className="catalog-card">
      <div className="catalog-card-media">
        <Link to={`/complex/${complex.slug}`} className="catalog-card-hit">
          {complex.image_url ? (
            <img src={mediaUrl(complex.image_url)} alt={complex.name} loading="lazy" />
          ) : (
            <div className="catalog-card-ph" />
          )}
          <div className="catalog-card-overlay" />
          <div className="catalog-card-content">
            <div className="catalog-card-text">
              {completion && <p className="catalog-card-date">{completion}</p>}
              <h3 className="catalog-card-name">{complex.name}</h3>
              {location && <p className="catalog-card-loc">{location}</p>}
              {complex.price_per_sqm_usd != null && (
                <p className="catalog-card-price">${complex.price_per_sqm_usd} / м²</p>
              )}
            </div>
            <span className="catalog-card-cta" aria-hidden>→</span>
          </div>
        </Link>

        {hasLegal && (
          <button type="button" className="catalog-card-legal" onClick={openLegal}>
            {t('card.legal')}
          </button>
        )}
      </div>

      <LegalDocumentModal
        open={legalOpen}
        onClose={() => setLegalOpen(false)}
        slug={complex.slug}
        report={legalReport}
        theme="paper"
      />
    </article>
  )
}
