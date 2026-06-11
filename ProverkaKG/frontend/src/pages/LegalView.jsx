import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import PdfViewer from '../components/PdfViewer'

export default function LegalView() {
  const { token } = useParams()
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')
  const [showPdf, setShowPdf] = useState(false)

  useEffect(() => {
    api.viewLegalReport(token)
      .then(setReport)
      .catch((e) => setError(e.message))
  }, [token])

  if (error) {
    return (
      <div className="legal-view error">
        <h1>Доступ закрыт</h1>
        <p>{error}</p>
        <Link to="/">На главную</Link>
      </div>
    )
  }

  if (!report) return <p className="empty">Загрузка...</p>

  return (
    <div className="legal-page">
      <div className="legal-view" onContextMenu={(e) => e.preventDefault()}>
        <div className="watermark">{report.watermark}</div>
        <div className="legal-doc">
          <p className="eyebrow">{report.complex_name}</p>
          <h1>{report.title}</h1>
          {report.summary && <p className="summary">{report.summary}</p>}
          <div className={`risk risk-${report.risk_level}`}>
            Уровень риска: {report.risk_level}
          </div>
          <div className="conclusion">
            <h2>Заключение</h2>
            <p>{report.conclusion}</p>
          </div>
          <div className="legal-meta">
            <p>Дата подготовки: {report.prepared_at}</p>
            <p>Доступ до: {new Date(report.expires_at).toLocaleString('ru')}</p>
            <p>Осталось просмотров: {report.views_left}</p>
          </div>
          {report.pdf_url && (
            <button type="button" className="btn-primary" onClick={() => setShowPdf(!showPdf)}>
              {showPdf ? 'Скрыть PDF' : 'Просмотр PDF заключения'}
            </button>
          )}
          <p className="no-download">⛔ Скачивание отключено. Документ доступен только для просмотра на платформе.</p>
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
