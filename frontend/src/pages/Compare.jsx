import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useCompare } from '../context/CompareContext'
import { useLocale } from '../context/LocaleContext'
import { complexUrls, verificationBadgeClass } from '../utils/complex'
import LegalOpenButton from '../components/LegalOpenButton'

export default function Compare() {
  const { slugs, remove, clear, max, remaining } = useCompare()
  const { t } = useLocale()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (slugs.length < 2) {
      setItems([])
      return
    }
    setLoading(true)
    setError('')
    api.compareComplexes(slugs)
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [slugs])

  if (slugs.length < 2) {
    return (
      <div className="compare-page">
        <h1>{t('compare.title')}</h1>
        <p className="empty">{t('compare.minHint')}</p>
        <Link to="/" className="btn-primary">{t('compare.toObjects')}</Link>
      </div>
    )
  }

  return (
    <div className="compare-page">
      <div className="compare-header">
        <div>
          <h1>{t('compare.title')}</h1>
          <p className="compare-sub muted">
            {t('compare.countHint', { n: slugs.length, max })}
            {remaining > 0 && (
              <> · <Link to="/#complexes">{t('compare.addMore', { n: remaining })}</Link></>
            )}
          </p>
        </div>
        <button type="button" className="btn-ghost" onClick={clear}>{t('compare.clearAll')}</button>
      </div>

      {loading && <p className="empty">{t('empty.loading')}</p>}
      {error && <p className="auth-error">{error}</p>}

      {!loading && items.length > 0 && (
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th>{t('compare.param')}</th>
                {items.map((item) => (
                  <th key={item.complex.slug}>
                    <button type="button" className="compare-remove" onClick={() => remove(item.complex.slug)}>×</button>
                    <Link to={`/complex/${item.complex.slug}`}>{item.complex.name}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t('detail.developer')}</td>
                {items.map((i) => <td key={i.complex.slug}>{i.complex.developer}</td>)}
              </tr>
              <tr>
                <td>{t('detail.address')}</td>
                {items.map((i) => <td key={i.complex.slug}>{i.complex.address}</td>)}
              </tr>
              <tr>
                <td>{t('detail.price')}</td>
                {items.map((i) => (
                  <td key={i.complex.slug}>
                    <strong>${i.complex.price_per_sqm_usd?.toLocaleString()}</strong>
                    <br />
                    <span className="muted">{i.complex.price_per_sqm_kgs?.toLocaleString()} с</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td>{t('detail.completion')}</td>
                {items.map((i) => <td key={i.complex.slug}>{i.complex.completion_quarter} {i.complex.completion_year}</td>)}
              </tr>
              <tr>
                <td>{t('detail.class')}</td>
                {items.map((i) => <td key={i.complex.slug}>{t(`filter.${i.complex.class_type}`) || i.complex.class_type}</td>)}
              </tr>
              <tr>
                <td>{t('detail.floors')}</td>
                {items.map((i) => <td key={i.complex.slug}>{i.complex.floors}</td>)}
              </tr>
              <tr>
                <td>{t('detail.apartments')}</td>
                {items.map((i) => <td key={i.complex.slug}>{i.complex.apartments_count}</td>)}
              </tr>
              <tr>
                <td>{t('card.check')}</td>
                {items.map((i) => (
                  <td key={i.complex.slug}>
                    <strong>{i.complex.verification_score}%</strong>
                    <br />
                    <span className={`badge badge-${verificationBadgeClass(i.complex.verification_status)}`}>
                      {t(`card.${i.complex.verification_status}`) || i.complex.verification_status}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td>{t('detail.documents')}</td>
                {items.map((i) => (
                  <td key={i.complex.slug}>
                    ✓ {i.documents_valid} / ✕ {i.documents_missing} / {i.documents_total}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{t('detail.legal')}</td>
                {items.map((i) => (
                  <td key={i.complex.slug}>
                    <LegalOpenButton
                      slug={i.complex.slug}
                      fallbackHref={complexUrls(i.complex.slug, i.complex.status).legal}
                    />
                  </td>
                ))}
              </tr>
              <tr>
                <td>{t('detail.reviews')}</td>
                {items.map((i) => (
                  <td key={i.complex.slug}>
                    {i.complex.status === 'commissioned' ? (
                      <Link to={complexUrls(i.complex.slug, i.complex.status).reviews} className="btn-outline btn-sm">
                        {t('card.reviews')}
                      </Link>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
