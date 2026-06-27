import { useLocale } from '../context/LocaleContext'
import { formatCompletion } from '../utils/formatCompletion'
import { translateFloors } from '../utils/translateContent'

export default function ComplexStatsBand({ complex }) {
  const { t, lang } = useLocale()
  const floorValue = complex.floors ? translateFloors(complex.floors, lang) : null
  const stats = [
    floorValue && { value: floorValue, label: t('detail.floors'), small: String(floorValue).length > 6 },
    complex.buildings_count > 1 && {
      value: complex.buildings_count,
      label: t('catalog.blocks'),
    },
    complex.entrances_count != null && {
      value: complex.entrances_count,
      label: t('catalog.entrances'),
    },
    formatCompletion(complex, t('catalog.yearShort'), lang) && {
      value: formatCompletion(complex, t('catalog.yearShort'), lang),
      label: t('detail.completion'),
      small: true,
    },
    complex.price_per_sqm_usd != null && { value: `$${complex.price_per_sqm_usd}`, label: t('catalog.perSqm') },
  ].filter(Boolean)

  if (!stats.length) return null

  return (
    <section className="showcase-stats" aria-label={t('catalog.inNumbers')}>
      <p className="showcase-stats-eyebrow">{t('catalog.inNumbers')}</p>
      <div className="showcase-stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="showcase-stat">
            <span className={`showcase-stat-value${s.small ? ' showcase-stat-value--sm' : ''}`}>{s.value}</span>
            <span className="showcase-stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
