import CatalogBrochureViewer from './CatalogBrochureViewer'

export default function PdfViewer({ url, title, watermark, noDownload = false, variant = 'paper' }) {
  if (!url) {
    return (
      <div className="pdf-viewer pdf-empty">
        <p>PDF файл жок</p>
      </div>
    )
  }

  return (
    <div
      className={`pdf-viewer${variant === 'paper' ? ' pdf-viewer--paper' : ''}`}
      onContextMenu={noDownload ? (e) => e.preventDefault() : undefined}
    >
      {watermark && <div className="pdf-watermark">{watermark}</div>}
      <div className="pdf-toolbar">
        <span>{title || 'Документ'}</span>
        {noDownload && <span className="pdf-badge">Только просмотр</span>}
      </div>
      <CatalogBrochureViewer url={url} title={title} variant={variant} />
    </div>
  )
}
