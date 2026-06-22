import { useLocale } from '../context/LocaleContext'
import { formatCompletion } from '../utils/formatCompletion'

export default function ComplexStatsBand({ complex }) {
  const { t } = useLocale()
  const stats = [
    complex.floors != null && { value: complex.floors, label: t('detail.floors') },
    complex.buildings_count > 1 && {
      value: complex.buildings_count,
      label: t('catalog.blocks'),
    },
    complex.entrances_count != null && {
      value: complex.entrances_count,
      label: t('catalog.entrances'),
    },
    formatCompletion(complex, t('catalog.yearShort')) && {
      value: formatCompletion(complex, t('catalog.yearShort')),
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
