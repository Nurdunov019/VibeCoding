import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import ComplexCard from '../components/ComplexCard'
import { useFavorites } from '../context/FavoritesContext'
import { useLocale } from '../context/LocaleContext'

export default function Favorites() {
  const { favorites } = useFavorites()
  const { t } = useLocale()
  const [complexes, setComplexes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (favorites.length === 0) {
      setComplexes([])
      setLoading(false)
      return
    }
    setLoading(true)
    api.getComplexes()
      .then((all) => {
        const bySlug = new Map(all.map((c) => [c.slug, c]))
        setComplexes(favorites.map((slug) => bySlug.get(slug)).filter(Boolean))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [favorites])

  return (
    <div className="favorites-page">
      <section className="page-header">
        <h1>{t('favorites.title')}</h1>
        <p className="muted">{t('favorites.sub', { count: favorites.length })}</p>
      </section>

      {loading ? (
        <p className="empty">{t('empty.loading')}</p>
      ) : favorites.length === 0 ? (
        <div className="favorites-empty">
          <span className="favorites-empty-icon" aria-hidden>♥</span>
          <p>{t('favorites.empty')}</p>
          <Link to="/" className="btn-primary">{t('favorites.browse')}</Link>
        </div>
      ) : complexes.length === 0 ? (
        <p className="empty">{t('favorites.removed')}</p>
      ) : (
        <div className="grid cards-grid">
          {complexes.map((c) => <ComplexCard key={c.slug} complex={c} />)}
        </div>
      )}
    </div>
  )
}
