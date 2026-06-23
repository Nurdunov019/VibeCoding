import { useEffect, useState } from 'react'
import mammoth from 'mammoth'
import { useLocale } from '../context/LocaleContext'
import LegalWrittenSection from './LegalWrittenSection'
import { getLegalDocUrl } from '../data/legalDocuments'

export default function LegalDocumentModal({ open, onClose, slug, report }) {
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
        if (!cancelled) setHtml(result.value)
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
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="legal-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="legal-modal"
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
              className="legal-modal-doc legal-written legal-written--showcase"
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
