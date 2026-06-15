import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '../api'
import ComplexCard from '../components/ComplexCard'
import HeroSlider from '../components/HeroSlider'
import { useLocale } from '../context/LocaleContext'
import { useRegion } from '../context/RegionContext'

export default function Home() {
  const { hash } = useLocation()
  const { t } = useLocale()
  const [complexes, setComplexes] = useState([])
  const [stats, setStats] = useState(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [classType, setClassType] = useState('')
  const { region } = useRegion()
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (hash === '#complexes') {
      document.getElementById('complexes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash])

  useEffect(() => {
    setLoading(true)
    const params = {
      search: search || undefined,
      status: status || undefined,
      class_type: classType || undefined,
      region,
    }
    Promise.all([api.getComplexes(params), api.getStats()])
      .then(([c, s]) => {
        const list = verifiedOnly ? c.filter((x) => x.verification_status === 'verified') : c
        setComplexes(list)
        setStats(s)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [search, status, classType, region, verifiedOnly])

  const resetFilters = () => {
    setSearch('')
    setStatus('')
    setClassType('')
    setVerifiedOnly(false)
  }

  const slideImages = complexes.map((c) => c.image_url).filter(Boolean)

  return (
    <div className="home-page">
      <HeroSlider images={slideImages}>
        <div className="hero-compact">
          <h1>{t('hero.title')}</h1>
          <p className="hero-compact-sub">{t('hero.sub')}</p>
        </div>

        <section className="filter-compact filter-on-hero">
          <input
            placeholder={t('filter.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
          <section className="stats-compact stats-on-hero">
            <div className="stat-item"><strong>{stats.total_complexes}</strong><span>{t('stats.objects')}</span></div>
            <div className="stat-item"><strong>{stats.verified_count}</strong><span>{t('stats.verified')}</span></div>
            <div className="stat-item"><strong>{stats.building}</strong><span>{t('stats.building')}</span></div>
            <div className="stat-item"><strong>{stats.commissioned}</strong><span>{t('stats.commissioned')}</span></div>
          </section>
        )}
      </HeroSlider>

      <section id="complexes" className="section-head-simple">
        <h2>{t('section.list')}</h2>
        <p className="muted">{complexes.length} {t('section.count')} · {t('section.legalHint')}</p>
      </section>

      {loading ? (
        <p className="empty">{t('empty.loading')}</p>
      ) : complexes.length === 0 ? (
        <p className="empty">{t('empty.notFound')}</p>
      ) : (
        <div className="grid cards-grid">
          {complexes.map((c) => <ComplexCard key={c.slug} complex={c} />)}
        </div>
      )}
    </div>
  )
}
