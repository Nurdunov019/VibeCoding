import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api'
import CatalogCard from '../components/CatalogCard'
import ComplexCard from '../components/ComplexCard'
import ContactSection from '../components/ContactSection'
import HeroSlider from '../components/HeroSlider'
import { useCompare } from '../context/CompareContext'
import { useLocale } from '../context/LocaleContext'
import { useRegion } from '../context/RegionContext'
import { regionApiParams } from '../utils/regionFilter'

export default function Home() {
  const location = useLocation()
  const navigate = useNavigate()
  const { picking, startPicking } = useCompare()
  const { t } = useLocale()
  const { region } = useRegion()
  const [allComplexes, setAllComplexes] = useState([])
  const [stats, setStats] = useState(null)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [classType, setClassType] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (location.state?.comparePicking) startPicking()
    if (!location.state?.scrollToComplexes) return undefined
    const frame = requestAnimationFrame(() => {
      document.getElementById('complexes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      navigate(location.pathname, { replace: true, state: {} })
    })
    return () => cancelAnimationFrame(frame)
  }, [location.state, location.pathname, navigate, startPicking])

  useEffect(() => {
    setLoading(true)
    Promise.all([api.getComplexes(regionApiParams(region)), api.getStats()])
      .then(([c, s]) => {
        setAllComplexes(c)
        setStats(s)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [region])

  const complexes = useMemo(() => {
    let list = allComplexes
    if (status) list = list.filter((c) => c.status === status)
    if (classType) list = list.filter((c) => c.class_type === classType)
    if (verifiedOnly) list = list.filter((c) => c.verification_status === 'verified')
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (c) =>
          (c.name || '').toLowerCase().includes(q)
          || (c.developer || '').toLowerCase().includes(q)
          || (c.slug || '').toLowerCase().includes(q),
      )
    }
    return list
  }, [allComplexes, search, status, classType, verifiedOnly])

  useEffect(() => {
    if (search.trim().length < 2) return undefined
    const frame = requestAnimationFrame(() => {
      document.getElementById('complexes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [search])

  const resetFilters = () => {
    setSearch('')
    setStatus('')
    setClassType('')
    setVerifiedOnly(false)
  }

  const building = complexes.filter((c) => c.status === 'building')
  const commissioned = complexes.filter((c) => c.status === 'commissioned')
  const slideImages = (building.length ? building : complexes).map((c) => c.image_url).filter(Boolean)

  return (
    <div className="home-page">
      <HeroSlider images={slideImages}>
        <div className="hero-compact hero-compact--borsan">
          <p className="hero-brand">PROVERKAKG</p>
          <h1>{t('hero.title')}</h1>
          <a
            href="#complexes"
            className="btn-hero-cta"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('complexes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          >
            {t('catalog.viewObjects')}
          </a>
        </div>

        <section className="filter-compact filter-on-hero">
          <div className="hero-search-wrap">
            <input
              type="search"
              placeholder={t('filter.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
              autoComplete="off"
            />
            {searchOpen && search.trim().length >= 1 && (
              <ul className="hero-search-suggestions" role="listbox">
                {complexes.length === 0 ? (
                  <li className="hero-search-suggestion hero-search-suggestion--empty">{t('empty.notFound')}</li>
                ) : (
                  complexes.slice(0, 6).map((c) => (
                    <li key={c.slug} className="hero-search-suggestion" role="option">
                      <Link
                        to={`/complex/${c.slug}`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSearch('')
                          setSearchOpen(false)
                        }}
                      >
                        <strong>{c.name}</strong>
                        {c.developer && <span>{c.developer}</span>}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">{t('filter.allStatus')}</option>
            <option value="building">{t('filter.building')}</option>
            <option value="commissioned">{t('filter.commissioned')}</option>
          </select>
          <select value={classType} onChange={(e) => setClassType(e.target.value)}>
            <option value="">{t('filter.allClass')}</option>
            <option value="economy">{t('filter.economy')}</option>
            <option value="comfort">{t('filter.comfort')}</option>
            <option value="business">{t('filter.business')}</option>
            <option value="premium">{t('filter.premium')}</option>
          </select>
          <label className="verified-check verified-on-hero">
            <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
            <span>{t('filter.verified')}</span>
          </label>
          {(search || status || classType || verifiedOnly) && (
            <button type="button" className="btn-reset btn-reset-hero" onClick={resetFilters}>{t('filter.reset')}</button>
          )}
        </section>

        {stats && (
          <section className="digits-band">
            <p className="digits-eyebrow">{t('catalog.inNumbers')}</p>
            <div className="digits-grid">
              <div><strong>{stats.total_complexes}</strong><span>{t('stats.objects')}</span></div>
              <div><strong>{stats.verified_count}</strong><span>{t('stats.verified')}</span></div>
              <div><strong>{stats.building}</strong><span>{t('stats.building')}</span></div>
              <div><strong>{stats.commissioned}</strong><span>{t('stats.commissioned')}</span></div>
            </div>
          </section>
        )}
      </HeroSlider>

      <section id="complexes" className="section-head-simple">
        <h2>{t('catalog.projects')}</h2>
        <p className="muted">
          {complexes.length} {t('section.count')} · {t('catalog.openHint')}
          {picking && <> · {t('section.compareHint')}</>}
        </p>
      </section>

      {loading ? (
        <p className="empty">{t('empty.loading')}</p>
      ) : complexes.length === 0 ? (
        <p className="empty">{t('empty.notFound')}</p>
      ) : (
        <>
          {building.length > 0 && (
            <>
              <h3 className="catalog-section-title">{t('catalog.buildingSection')}</h3>
              <div className="catalog-grid">
                {building.map((c) => <CatalogCard key={c.slug} complex={c} />)}
              </div>
            </>
          )}

          {commissioned.length > 0 && (
            <>
              <h3 className="catalog-section-title">{t('catalog.commissionedSection')}</h3>
              <div className="grid cards-grid">
                {commissioned.map((c) => <ComplexCard key={c.slug} complex={c} />)}
              </div>
            </>
          )}
        </>
      )}

      <ContactSection complexes={complexes} />
    </div>
  )
}
