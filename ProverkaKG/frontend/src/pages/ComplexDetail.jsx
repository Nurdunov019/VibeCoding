import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import ShowcaseComplexDetail from '../components/ShowcaseComplexDetail'
import { useLocale } from '../context/LocaleContext'
import { canonicalShowcaseSlug, isShowcaseSlug } from '../utils/showcaseSlug'

export default function ComplexDetail() {
  const { slug: rawSlug } = useParams()
  const navigate = useNavigate()
  const slug = isShowcaseSlug(rawSlug) ? canonicalShowcaseSlug(rawSlug) : rawSlug
  const { t } = useLocale()
  const [complex, setComplex] = useState(null)
  const [documents, setDocuments] = useState([])
  const [verification, setVerification] = useState(null)
  const [reviewsData, setReviewsData] = useState(null)
  const [loading, setLoading] = useState(true)

  const isCommissioned = complex?.status === 'commissioned'

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

  if (loading) return <p className="empty showcase-loading">{t('empty.loading')}</p>
  if (!complex) return <p className="empty showcase-loading">{t('empty.notFound')}</p>

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
