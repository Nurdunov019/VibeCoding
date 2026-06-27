import { useState } from 'react'
import { Link } from 'react-router-dom'
import CatalogBrochureViewer from './CatalogBrochureViewer'
import CatalogCoverHero from './CatalogCoverHero'
import ComplexStatsBand from './ComplexStatsBand'
import DocumentWrittenList from './DocumentWrittenList'
import PaymentTermsBand from './PaymentTermsBand'
import LocationSection from './LocationSection'
import StarPicker from './StarPicker'
import { useAuth } from '../context/AuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import { useLocale } from '../context/LocaleContext'
import { mediaUrl } from '../utils/mediaUrl'
import { statusLabel, translateApiError } from '../utils/translate'
import {
  translateDocNotes,
  translateDocTitle,
  translateFeaturesText,
} from '../utils/translateContent'
import { api } from '../api'

function parseFeatures(text, lang) {
  return translateFeaturesText(text, lang)
}

export default function ShowcaseComplexDetail({
  slug,
  complex,
  documents,
  verification,
  reviewsData,
  isCommissioned,
  onReviewSaved,
}) {
  const { t, lang } = useLocale()
  const { user } = useAuth()
  const { openLogin } = useAuthModal()
  const [viewingPdf, setViewingPdf] = useState(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviewMsg, setReviewMsg] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)

  const features = parseFeatures(complex.features, lang)
  const hasCatalog = Boolean(complex.catalog_pdf_url)
  const [pdfFailed, setPdfFailed] = useState(false)
  const showBrochure = hasCatalog && !pdfFailed

  const scrollToInfo = (e) => {
    e.preventDefault()
    document.getElementById('info')?.scrollIntoView({ behavior: 'smooth' })
  }

  const submitReview = async (e) => {
    e.preventDefault()
    if (!user) {
      openLogin()
      return
    }
    setReviewLoading(true)
    setReviewMsg('')
    try {
      await api.postReview(slug, reviewRating, reviewText)
      setReviewText('')
      setReviewRating(5)
      setReviewMsg(t('reviews.saved'))
      onReviewSaved?.()
    } catch (err) {
      setReviewMsg(translateApiError(err.message, t))
    } finally {
      setReviewLoading(false)
    }
  }

  return (
    <div className="showcase">
      <section id="catalog" className={`showcase-catalog${showBrochure ? ' showcase-catalog--scroll' : ''}`}>
        {showBrochure ? (
          <CatalogBrochureViewer url={complex.catalog_pdf_url} title={complex.name} onError={() => setPdfFailed(true)} />
        ) : (
          <CatalogCoverHero complex={complex} />
        )}
        {!showBrochure && (
          <a href="#info" className="showcase-scroll" onClick={scrollToInfo} aria-label={t('catalog.scrollDown')}>
            <span className="showcase-scroll-ring" />
          </a>
        )}
      </section>

      <section id="info" className="showcase-info">
        <div className="showcase-info-head">
          <Link to="/" className="showcase-back">← {t('section.list')}</Link>
          <div className="showcase-actions">
            <Link to="/map" className="btn-outline btn-sm">{t('map.title')}</Link>
          </div>
        </div>

        <div className="showcase-title-block">
          <p className="showcase-eyebrow">{complex.city}{complex.developer ? ` · ${complex.developer}` : ''}</p>
          <h2>{complex.name}</h2>
          <p className="showcase-address">{complex.address}</p>
          <div className="showcase-badges">
            <span className="badge badge-score">{t('card.check')}: {complex.verification_score}%</span>
            <span className={`badge badge-${complex.verification_status === 'verified' ? 'ok' : complex.verification_status === 'risk' ? 'bad' : 'warn'}`}>
              {statusLabel(t, 'card', complex.verification_status)}
            </span>
            {complex.price_per_sqm_usd != null && (
              <span className="price-tag">${complex.price_per_sqm_usd?.toLocaleString()} / м²</span>
            )}
          </div>
        </div>

        <ComplexStatsBand complex={complex} />
        <PaymentTermsBand complex={complex} />
      </section>

      {complex.description && (
        <section className="showcase-split">
          <div className="showcase-split-media">
            {complex.image_url && (
              <img
                src={mediaUrl(complex.image_url)}
                alt={complex.name}
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
          <div className="showcase-split-text">
            <h3>{t('detail.overview')}</h3>
            <p>{translateDescription(slug, complex.description, lang)}</p>
            <div className="showcase-meta">
              <div><span>{t('detail.class')}</span><strong>{statusLabel(t, 'filter', complex.class_type)}</strong></div>
              <div><span>{t('detail.apartments')}</span><strong>{complex.apartments_count ?? '—'}</strong></div>
              <div><span>{t('detail.status')}</span><strong>{complex.status === 'commissioned' ? t('filter.commissioned') : t('filter.building')}</strong></div>
            </div>
          </div>
        </section>
      )}

      {features.length > 0 && (
        <section className="showcase-features">
          <h3>{t('catalog.infrastructure')}</h3>
          <div className="showcase-features-grid">
            {features.map((f) => (
              <article key={f} className="showcase-feature-card">
                <span className="showcase-feature-dot" />
                <p>{f}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section id="location" className="showcase-location">
        <h3>{t('detail.location')}</h3>
        <LocationSection complex={complex} />
      </section>

      {verification && (
        <section id="verify" className="showcase-panel">
          <h3>{t('detail.verify')}</h3>
          <div className="showcase-verify-score">
            <div className="score-circle">{verification.score}%</div>
            <div>
              <strong>{statusLabel(t, 'card', verification.status)}</strong>
              <p>{t('verify.validCount', { valid: verification.valid_documents, total: verification.total_documents })}</p>
            </div>
          </div>
          <div className="doc-written-list doc-written-list--showcase">
            {verification.checks.map((c) => {
              const doc = documents.find((d) => d.doc_type === c.type)
              const heading = doc?.title
                ? translateDocTitle(doc.title, lang, c.type, t)
                : statusLabel(t, 'docTypes', c.type)
              const body = doc?.notes || c.message || statusLabel(t, 'docMessages', c.status)
              return (
              <article key={c.type} className={`doc-written-card doc-${c.status}`}>
                <div className="doc-written-head">
                  <h4>{heading}</h4>
                  <span className={`doc-written-status doc-written-status--${c.status}`}>
                    {statusLabel(t, 'docStatus', c.status)}
                  </span>
                </div>
                {c.number && <p className="doc-written-meta">№ {c.number}</p>}
                <p className="doc-written-text">
                  {translateDocNotes(slug, c.type, body, lang)}
                </p>
              </article>
              )
            })}
          </div>
        </section>
      )}

      <section id="documents" className={`showcase-panel${!isCommissioned ? ' showcase-panel--last' : ''}`}>
        <h3>{t('detail.documents')}</h3>
        <p className="muted">{t('catalog.documentsWrittenHint')}</p>
        <DocumentWrittenList
          documents={documents}
          viewingPdf={viewingPdf}
          onViewPdf={setViewingPdf}
          onClosePdf={() => setViewingPdf(null)}
          variant="showcase"
          complexSlug={slug}
        />
      </section>

      {isCommissioned && (
        <section id="reviews" className="showcase-panel">
          <h3>{t('detail.reviews')}</h3>
          <p className="muted">{t('reviews.hint')}</p>
          {reviewsData?.count > 0 && (
            <div className="reviews-summary">
              <span className="reviews-avg">★ {reviewsData.average_rating}</span>
              <span className="muted">{reviewsData.count} {t('reviews.countLabel')}</span>
            </div>
          )}
          <form onSubmit={submitReview} className="review-form">
            <label>
              {t('reviews.rating')}
              <StarPicker value={reviewRating} onChange={setReviewRating} />
            </label>
            <label>
              {t('reviews.text')}
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={t('reviews.placeholder')}
                rows={4}
                minLength={10}
                required
              />
            </label>
            {!user && <p className="muted">{t('reviews.loginRequired')}</p>}
            {reviewMsg && <p className={reviewMsg === t('reviews.saved') ? 'review-success' : 'auth-error'}>{reviewMsg}</p>}
            <button type="submit" className="btn-accent" disabled={reviewLoading}>
              {reviewLoading ? '...' : user ? t('reviews.submit') : t('auth.login')}
            </button>
          </form>
          <div className="reviews-list">
            {reviewsData?.reviews?.map((r) => (
              <article key={r.id} className="review-item">
                <div className="review-head">
                  <strong>{r.author_name}</strong>
                  <span className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p>{r.text}</p>
                <time className="muted">{new Date(r.created_at).toLocaleDateString()}</time>
              </article>
            ))}
            {reviewsData?.count === 0 && <p className="empty">{t('reviews.empty')}</p>}
          </div>
        </section>
      )}
    </div>
  )
}
