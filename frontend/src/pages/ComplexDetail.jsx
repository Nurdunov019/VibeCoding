import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { api } from '../api'
import ShowcaseComplexDetail from '../components/ShowcaseComplexDetail'
import LocationSection from '../components/LocationSection'
import DocumentWrittenList from '../components/DocumentWrittenList'
import { useAuth } from '../context/AuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import { useCompare } from '../context/CompareContext'
import { useLocale } from '../context/LocaleContext'
import { canonicalShowcaseSlug, isShowcaseSlug } from '../utils/showcaseSlug'
import { statusLabel, translateApiError } from '../utils/translate'

const BASE_TABS = ['overview', 'location', 'building', 'documents', 'verify', 'legal']

import StarPicker from '../components/StarPicker'

export default function ComplexDetail() {
  const { slug: rawSlug } = useParams()
  const navigate = useNavigate()
  const slug = isShowcaseSlug(rawSlug) ? canonicalShowcaseSlug(rawSlug) : rawSlug
  const [searchParams] = useSearchParams()
  const { t } = useLocale()
  const { user } = useAuth()
  const { openLogin } = useAuthModal()
  const { toggle, isSelected } = useCompare()
  const [tab, setTab] = useState('overview')
  const [complex, setComplex] = useState(null)
  const [documents, setDocuments] = useState([])
  const [verification, setVerification] = useState(null)
  const [reviewsData, setReviewsData] = useState(null)
  const [email, setEmail] = useState('')
  const [accessInfo, setAccessInfo] = useState(null)
  const [viewingPdf, setViewingPdf] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviewMsg, setReviewMsg] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)

  const isCommissioned = complex?.status === 'commissioned'
  const tabIds = useMemo(
    () => (isCommissioned ? [...BASE_TABS, 'reviews'] : BASE_TABS),
    [isCommissioned],
  )

  const loadReviews = () => {
    if (!isCommissioned) return
    api.getReviews(slug).then(setReviewsData).catch(console.error)
  }

  useEffect(() => {
    if (isShowcaseSlug(rawSlug) && rawSlug !== canonicalShowcaseSlug(rawSlug)) {
      navigate(`/complex/${canonicalShowcaseSlug(rawSlug)}`, { replace: true })
    }
  }, [rawSlug, navigate])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.getComplex(slug),
      api.getDocuments(slug),
      api.verifyComplex(slug),
    ])
      .then(([c, d, v]) => {
        setComplex(c)
        setDocuments(d)
        setVerification(v)
        if (c.status === 'commissioned') {
          api.getReviews(slug).then(setReviewsData).catch(console.error)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    const requested = searchParams.get('tab')
    if (requested && BASE_TABS.includes(requested)) {
      setTab(requested)
    } else if (requested === 'reviews' && isCommissioned) {
      setTab('reviews')
    }
  }, [searchParams, isCommissioned])

  const requestLegal = async (e) => {
    e.preventDefault()
    if (!email) return alert(t('legal.emailRequired'))
    try {
      const data = await api.requestLegalAccess(slug, email)
      setAccessInfo(data)
    } catch (err) {
      alert(translateApiError(err.message, t))
    }
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
      loadReviews()
    } catch (err) {
      setReviewMsg(translateApiError(err.message, t))
    } finally {
      setReviewLoading(false)
    }
  }

  if (loading) return <p className="empty">{t('empty.loading')}</p>
  if (!complex) return <p className="empty">{t('empty.notFound')}</p>

  const isShowcase = isShowcaseSlug(slug) || Boolean(complex.catalog_pdf_url)

  if (isShowcase) {
    return (
      <ShowcaseComplexDetail
        slug={slug}
        complex={complex}
        documents={documents}
        verification={verification}
        reviewsData={reviewsData}
        isCommissioned={isCommissioned}
        onReviewSaved={loadReviews}
      />
    )
  }

  return (
    <div className="detail">
      <Link to="/" className="back">← {t('section.list')}</Link>

      <div className="detail-hero">
        {complex.image_url && (
          <Link to={`/complex/${slug}`} className="detail-img-wrap">
            <img src={complex.image_url} alt={complex.name} className="detail-img" />
          </Link>
        )}
        <div>
          <p className="eyebrow">{complex.city} • {complex.developer}</p>
          <h1>{complex.name}</h1>
          <p>{complex.address}</p>
          <div className="detail-badges">
            <span className="badge badge-score">{t('card.check')}: {complex.verification_score}%</span>
            <span className={`badge badge-${complex.verification_status === 'verified' ? 'ok' : complex.verification_status === 'risk' ? 'bad' : 'warn'}`}>
              {statusLabel(t, 'card', complex.verification_status)}
            </span>
            <span className="price-tag">${complex.price_per_sqm_usd?.toLocaleString()} / м²</span>
            {isCommissioned && reviewsData?.count > 0 && (
              <span className="badge badge-ok">★ {reviewsData.average_rating} · {reviewsData.count} {t('reviews.countLabel')}</span>
            )}
          </div>
          <div className="detail-actions">
            <Link to="/map" className="btn-outline btn-sm">{t('map.title')}</Link>
            <button
              type="button"
              className={`btn-compare btn-sm ${isSelected(slug) ? 'active' : ''}`}
              onClick={() => toggle(slug)}
            >
              {isSelected(slug) ? t('card.compared') : `+ ${t('card.compare')}`}
            </button>
          </div>
        </div>
      </div>

      <div className="tabs">
        {tabIds.map((id) => (
          <button key={id} type="button" className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
            {t(`detail.${id}`)}
          </button>
        ))}
      </div>

      <div className="tab-panel">
        {tab === 'overview' && (
          <div>
            <h2>{t('detail.overview')}</h2>
            <p>{complex.description}</p>
            <div className="info-grid">
              <div><span>{t('detail.class')}</span><strong>{statusLabel(t, 'filter', complex.class_type)}</strong></div>
              <div><span>{t('detail.completion')}</span><strong>{complex.completion_quarter} {complex.completion_year}</strong></div>
              <div><span>{t('detail.price')}</span><strong>${complex.price_per_sqm_usd} / {complex.price_per_sqm_kgs?.toLocaleString()} с</strong></div>
              <div><span>{t('detail.apartments')}</span><strong>{complex.apartments_count}</strong></div>
              <div><span>{t('detail.floors')}</span><strong>{complex.floors}</strong></div>
              <div><span>{t('detail.status')}</span><strong>{complex.status === 'commissioned' ? t('filter.commissioned') : t('filter.building')}</strong></div>
            </div>
          </div>
        )}

        {tab === 'location' && <LocationSection complex={complex} />}

        {tab === 'building' && (
          <div>
            <h2>{t('detail.building')}</h2>
            <div className="info-grid">
              <div><span>{t('detail.developer')}</span><strong>{complex.developer}</strong></div>
              <div><span>{t('detail.address')}</span><strong>{complex.address}</strong></div>
              <div><span>{t('detail.buildings')}</span><strong>{complex.buildings_count}</strong></div>
              <div><span>{t('detail.floors')}</span><strong>{complex.floors}</strong></div>
              <div><span>{t('detail.class')}</span><strong>{statusLabel(t, 'filter', complex.class_type)}</strong></div>
              <div><span>{t('detail.apartments')}</span><strong>{complex.apartments_count}</strong></div>
            </div>
          </div>
        )}

        {tab === 'documents' && (
          <div>
            <h2>{t('detail.documents')}</h2>
            <p className="muted">{t('detail.documentsHint')}</p>
            <DocumentWrittenList
              documents={documents}
              viewingPdf={viewingPdf}
              onViewPdf={setViewingPdf}
              onClosePdf={() => setViewingPdf(null)}
            />
          </div>
        )}

        {tab === 'verify' && verification && (
          <div>
            <h2>{t('detail.verify')}</h2>
            <div className="verify-score">
              <div className="score-circle">{verification.score}%</div>
              <div>
                <strong>{statusLabel(t, 'card', verification.status)}</strong>
                <p>{t('verify.validCount', { valid: verification.valid_documents, total: verification.total_documents })}</p>
              </div>
            </div>
            <div className="check-list">
              {verification.checks.map((c) => (
                <div key={c.type} className={`check-item check-${c.status}`}>
                  <strong>{statusLabel(t, 'docTypes', c.type)}</strong>
                  <span>{statusLabel(t, 'docMessages', c.status)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'legal' && (
          <div>
            <h2>{t('detail.legal')}</h2>
            <div className="legal-info">
              <p><strong>{t('legal.title')}</strong></p>
              <ul>
                <li>✓ {t('legal.viewOnly')}</li>
                <li>✓ {t('legal.unlimited')}</li>
                <li>✓ {t('legal.watermark')}</li>
                <li>✕ {t('legal.noDownload')}</li>
              </ul>
            </div>
            {!accessInfo ? (
              <form onSubmit={requestLegal} className="legal-form">
                <input type="email" placeholder={t('auth.emailPlaceholder')} value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit" className="btn-primary">{t('legal.getAccess')}</button>
              </form>
            ) : (
              <div className="access-granted">
                <p>{t('legal.accessGranted')}</p>
                <Link to={accessInfo.view_url} className="btn-primary">{t('legal.open')}</Link>
              </div>
            )}
          </div>
        )}

        {tab === 'reviews' && isCommissioned && (
          <div>
            <h2>{t('detail.reviews')}</h2>
            <p className="muted">{t('reviews.hint')}</p>

            {reviewsData && reviewsData.count > 0 && (
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
          </div>
        )}
      </div>
    </div>
  )
}
