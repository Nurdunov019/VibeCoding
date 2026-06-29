import { Link, useLocation } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { useLocale } from '../context/LocaleContext'

export default function CompareBar({ navHidden = false }) {
  const { pathname } = useLocation()
  const { slugs, clear, max, min, canCompare, remaining } = useCompare()
  const { t } = useLocale()

  if (slugs.length === 0 || pathname === '/compare') return null

  return (
    <div className={`compare-bar${navHidden ? ' compare-bar--nav-hidden' : ''}`}>
      <div className="container compare-bar-inner">
        <div className="compare-bar-text">
          <span>
            {t('compareBar.label')}: <strong>{slugs.length}</strong> {t('compareBar.of')} {max}
          </span>
          <span className="compare-bar-hint muted">
            {canCompare
              ? (remaining > 0 ? t('compareBar.readyAdd', { n: remaining }) : t('compareBar.ready'))
              : t('compareBar.min', { n: min - slugs.length })}
          </span>
        </div>
        <div className="compare-bar-actions">
          {canCompare ? (
            <Link to="/compare" className="btn-accent btn-sm">
              {t('compareBar.go')} ({slugs.length})
            </Link>
          ) : (
            <Link to="/compare" className="btn-accent btn-sm">{t('compareBar.pick')}</Link>
          )}
          <button type="button" className="btn-ghost btn-sm" onClick={clear}>{t('compareBar.clear')}</button>
        </div>
      </div>
    </div>
  )
}
