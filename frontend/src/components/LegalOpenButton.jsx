import { useState } from 'react'
import { api } from '../api'
import { resolveLegalDocUrl } from '../data/legalDocuments'
import { useLocale } from '../context/LocaleContext'
import LegalDocumentModal from './LegalDocumentModal'

export default function LegalOpenButton({
  slug,
  docUrl,
  className = 'btn-legal btn-sm',
  label,
}) {
  const { t } = useLocale()
  const resolvedDocUrl = docUrl || resolveLegalDocUrl(slug)
  const [open, setOpen] = useState(false)
  const [report, setReport] = useState(null)
  const text = label || t('card.legal')

  const handleClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    let nextReport = report
    if (!nextReport) {
      try {
        nextReport = await api.getLegalPreview(slug)
        setReport(nextReport)
      } catch {
        // preview unavailable
      }
    }
    if (!nextReport && !resolvedDocUrl) return
    setOpen(true)
  }

  return (
    <>
      <button type="button" className={className} onClick={handleClick}>
        {text}
      </button>
      <LegalDocumentModal
        open={open}
        onClose={() => setOpen(false)}
        slug={slug}
        docUrl={resolvedDocUrl}
        report={report}
        theme="paper"
      />
    </>
  )
}
