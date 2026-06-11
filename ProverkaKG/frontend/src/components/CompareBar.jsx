import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { useLocale } from '../context/LocaleContext'

export default function CompareBar() {
  const { slugs, clear, max } = useCompare()
  const { t } = useLocale()
  if (slugs.length === 0) return null

  return (
    <div className="compare-bar">
      <div className="container compare-bar-inner">
        <span>{t('compareBar.label')}: <strong>{slugs.length}</strong> {t('compareBar.of')} {max}</span>
        <div className="compare-bar-actions">
          {slugs.length >= 2 ? (
            <Link to="/compare" className="btn-accent btn-sm">{t('compareBar.go')}</Link>
          ) : (
            <span className="muted">{t('compareBar.min')}</span>
          )}
          <button type="button" className="btn-ghost btn-sm" onClick={clear}>{t('compareBar.clear')}</button>
        </div>
      </div>
    </div>
  )
}
