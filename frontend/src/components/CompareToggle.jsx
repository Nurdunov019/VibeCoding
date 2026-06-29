import { useCompare } from '../context/CompareContext'
import { useLocale } from '../context/LocaleContext'

export default function CompareToggle({ slug, className = 'btn-compare btn-sm' }) {
  const { toggle, isSelected, max, slugs } = useCompare()
  const { t } = useLocale()
  const selected = isSelected(slug)
  const atMax = slugs.length >= max && !selected

  return (
    <button
      type="button"
      className={`${className}${selected ? ' active' : ''}`}
      disabled={atMax}
      title={atMax ? t('compare.maxReached', { max }) : undefined}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(slug)
      }}
      aria-pressed={selected}
    >
      {selected ? t('card.compared') : t('card.compare')}
    </button>
  )
}
