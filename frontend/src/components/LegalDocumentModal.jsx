import { useEffect, useState } from 'react'
import mammoth from 'mammoth'
import { useLocale } from '../context/LocaleContext'
import LegalWrittenSection from './LegalWrittenSection'
import { getLegalDocUrl } from '../data/legalDocuments'

function cleanLegalHtml(html) {
  return html
    .replace(/\sstyle="[^"]*"/gi, '')
    .replace(/\sstyle='[^']*'/gi, '')
    .replace(/<table/gi, '<table class="legal-doc-table"')
}

export default function LegalDocumentModal({ open, onClose, slug, report, theme = 'dark' }) {
  const { t } = useLocale()
  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      setHtml('')
      setError('')
      return undefined
    }

    const docUrl = getLegalDocUrl(slug)
    if (!docUrl) return undefined

    let cancelled = false
    setLoading(true)
    setError('')

    fetch(docUrl)
      .then((res) => {
        if (!res.ok) throw new Error('load failed')
        return res.arrayBuffer()
      })
      .then((buffer) => mammoth.convertToHtml({ arrayBuffer: buffer }))
      .then((result) => {
        if (!cancelled) setHtml(cleanLegalHtml(result.value))
      })
      .catch(() => {
        if (!cancelled) setError(t('errors.legalNotAvailable'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [open, slug, t])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    const scrollY = window.scrollY
    document.addEventListener('keydown', onKey)
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="legal-modal-overlay" onClick={onClose} role="presentation">
      <div
        className={`legal-modal${theme === 'paper' ? ' legal-modal--paper' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t('card.legal')}
      >
        <header className="legal-modal-head">
          <h2>{report?.title || t('card.legal')}</h2>
          <button type="button" className="legal-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="legal-modal-body">
          {loading && <p className="muted">{t('empty.loading')}</p>}
          {error && !html && report && (
            <LegalWrittenSection report={report} hideAccessForm variant="showcase" />
          )}
          {error && !html && !report && <p className="muted">{error}</p>}
          {html && (
            <div
              className={`legal-modal-doc${theme === 'paper' ? ' legal-modal-doc--paper' : ' legal-written legal-written--showcase'}`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
          {!loading && !html && !error && report && (
            <LegalWrittenSection report={report} hideAccessForm variant="showcase" />
          )}
        </div>
      </div>
    </div>
  )
}
