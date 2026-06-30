import { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import { useCompare } from '../context/CompareContext'
import { useLocale } from '../context/LocaleContext'
import { mediaUrl } from '../utils/mediaUrl'
import { resolveLegalDocUrl } from '../data/legalDocuments'
import LegalOpenButton from './LegalOpenButton'

export default function ComparePicker({ showSearch = true }) {
  const { slugs, toggle, remove, max, min } = useCompare()
  const { t } = useLocale()
  const [complexes, setComplexes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    api.getComplexes()
      .then(setComplexes)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const selected = useMemo(
    () => slugs.map((slug) => complexes.find((c) => c.slug === slug)).filter(Boolean),
    [slugs, complexes],
  )

  const available = useMemo(() => {
    const q = search.trim().toLowerCase()
    return complexes.filter((c) => {
      if (slugs.includes(c.slug)) return false
      if (!q) return true
      return [c.name, c.developer, c.address, c.city].some((v) => v?.toLowerCase().includes(q))
    })
  }, [complexes, slugs, search])

  const atMax = slugs.length >= max
  const needMore = Math.max(0, min - slugs.length)

  return (
    <div className="compare-picker">
      <div className="compare-picker-head">
        <h2>{t('compare.pickTitle')}</h2>
        <p className="muted compare-picker-sub">
          {needMore > 0
            ? t('compare.pickMore', { n: needMore })
            : t('compare.countHint', { n: slugs.length, max })}
        </p>
      </div>

      {selected.length > 0 && (
        <div className="compare-picker-selected">
          <p className="compare-picker-label">{t('compare.selected')}</p>
          <div className="compare-picker-chips">
            {selected.map((c) => (
              <div key={c.slug} className="compare-picker-chip">
                <span className="compare-picker-chip-thumb">
                  {c.image_url ? (
                    <img src={mediaUrl(c.image_url)} alt="" />
                  ) : (
                    <span aria-hidden>🏢</span>
                  )}
                </span>
                <span className="compare-picker-chip-name">{c.name}</span>
                <button
                  type="button"
                  className="compare-picker-chip-remove"
                  onClick={() => remove(c.slug)}
                  aria-label={t('compare.remove')}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!atMax && (
        <>
          {showSearch && (
            <input
              type="search"
              className="compare-picker-search"
              placeholder={t('compare.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}

          {loading ? (
            <p className="empty">{t('empty.loading')}</p>
          ) : available.length === 0 ? (
            <p className="empty">{t('empty.notFound')}</p>
          ) : (
            <ul className="compare-picker-list">
              {available.map((c) => (
                <li key={c.slug} className="compare-picker-row">
                  <button type="button" className="compare-picker-item" onClick={() => toggle(c.slug)}>
                    <span className="compare-picker-item-thumb">
                      {c.image_url ? (
                        <img src={mediaUrl(c.image_url)} alt="" />
                      ) : (
                        <span aria-hidden>🏢</span>
                      )}
                    </span>
                    <span className="compare-picker-item-body">
                      <strong>{c.name}</strong>
                      <span className="muted">{c.address}</span>
                      {c.price_per_sqm_usd != null && (
                        <span className="compare-picker-item-price">${c.price_per_sqm_usd} / м²</span>
                      )}
                    </span>
                    <span className="compare-picker-add">{t('compare.tapToAdd')}</span>
                  </button>
                  <LegalOpenButton
                    slug={c.slug}
                    docUrl={resolveLegalDocUrl(c)}
                    className="compare-picker-legal btn-outline btn-sm"
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
