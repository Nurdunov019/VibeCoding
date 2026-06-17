import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import PdfViewer from '../components/PdfViewer'
import { useLocale } from '../context/LocaleContext'
import { statusLabel, translateApiError } from '../utils/translate'

export default function LegalView() {
  const { token } = useParams()
  const { t } = useLocale()
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')
  const [showPdf, setShowPdf] = useState(false)

  useEffect(() => {
    api.viewLegalReport(token)
      .then(setReport)
      .catch((e) => setError(translateApiError(e.message, t)))
  }, [token])

  if (error) {
    return (
      <div className="legal-view error">
        <h1>{t('legal.accessClosed')}</h1>
        <p>{error}</p>
        <Link to="/">{t('mobileNav.home')}</Link>
      </div>
    )
  }

  if (!report) return <p className="empty">{t('empty.loading')}</p>

  return (
    <div className="legal-page">
      <div className="legal-view" onContextMenu={(e) => e.preventDefault()}>
        <div className="watermark">{report.watermark}</div>
        <div className="legal-doc">
          <p className="eyebrow">{report.complex_name}</p>
          <h1>{report.title}</h1>
          {report.summary && <p className="summary">{report.summary}</p>}
          <div className={`risk risk-${report.risk_level}`}>
            {t('legal.risk')}: {statusLabel(t, 'risk', report.risk_level)}
          </div>
          <div className="conclusion">
            <h2>{t('detail.legal')}</h2>
            <p>{report.conclusion}</p>
          </div>
          <div className="legal-meta">
            <p>{t('legal.prepared')}: {report.prepared_at}</p>
            <p>{t('legal.unlimited')}</p>
          </div>
          {report.pdf_url && (
            <button type="button" className="btn-primary" onClick={() => setShowPdf(!showPdf)}>
              {showPdf ? t('legal.hidePdf') : t('legal.viewPdf')}
            </button>
          )}
          <p className="no-download">⛔ {t('legal.noDownload')}</p>
        </div>
      </div>

      {showPdf && report.pdf_url && (
        <div className="legal-pdf-section">
          <PdfViewer
            url={report.pdf_url}
            title={report.title}
            watermark={report.watermark}
            noDownload
          />
        </div>
      )}
    </div>
  )
}
