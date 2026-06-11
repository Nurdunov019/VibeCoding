export default function PdfViewer({ url, title, watermark, noDownload = false }) {
  if (!url) {
    return (
      <div className="pdf-viewer pdf-empty">
        <p>PDF файл жок</p>
      </div>
    )
  }

  return (
    <div className="pdf-viewer" onContextMenu={noDownload ? (e) => e.preventDefault() : undefined}>
      {watermark && <div className="pdf-watermark">{watermark}</div>}
      <div className="pdf-toolbar">
        <span>{title || 'Документ'}</span>
        {noDownload && <span className="pdf-badge">Только просмотр</span>}
      </div>
      <iframe
        src={`${url}#toolbar=${noDownload ? 0 : 1}&navpanes=0`}
        title={title || 'PDF'}
        className="pdf-frame"
      />
    </div>
  )
}
