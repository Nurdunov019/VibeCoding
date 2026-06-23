import PdfViewer from './PdfViewer'
import { useLocale } from '../context/LocaleContext'
import { isViewablePdf } from '../utils/documentDisplay'
import { statusLabel } from '../utils/translate'

export default function DocumentWrittenList({ documents, viewingPdf, onViewPdf, onClosePdf, variant = 'default' }) {
  const { t } = useLocale()
  const rootClass = variant === 'showcase' ? 'doc-written-list doc-written-list--showcase' : 'doc-written-list'

  return (
    <>
      <div className={rootClass}>
        {documents.map((d) => {
          const hasPdf = isViewablePdf(d.file_url) && d.status === 'valid'
          const meta = [d.number && `№ ${d.number}`, d.issued_by, d.issued_date].filter(Boolean).join(' · ')

          return (
            <article key={d.id} className={`doc-written-card doc-${d.status}`}>
              <div className="doc-written-head">
                <h4>{d.title || statusLabel(t, 'docTypes', d.doc_type)}</h4>
                <span className={`doc-written-status doc-written-status--${d.status}`}>
                  {statusLabel(t, 'docStatus', d.status)}
                </span>
              </div>
              {meta && <p className="doc-written-meta">{meta}</p>}
              <p className="doc-written-text">
                {d.notes || statusLabel(t, 'docMessages', d.status)}
              </p>
              {hasPdf && (
                <button type="button" className="btn-outline btn-sm doc-written-pdf" onClick={() => onViewPdf(d)}>
                  PDF
                </button>
              )}
            </article>
          )
        })}
      </div>

      {viewingPdf && (
        <div className="pdf-modal">
          <div className="pdf-modal-header">
            <h3>{viewingPdf.title}</h3>
            <button type="button" className="btn-ghost" onClick={onClosePdf}>×</button>
          </div>
          <PdfViewer url={viewingPdf.file_url} title={viewingPdf.title} />
        </div>
      )}
    </>
  )
}
