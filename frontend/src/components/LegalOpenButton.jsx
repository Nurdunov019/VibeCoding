import { useState } from 'react'
import { api } from '../api'
import { getLegalDocUrl } from '../data/legalDocuments'
import { useLocale } from '../context/LocaleContext'
import LegalDocumentModal from './LegalDocumentModal'

export default function LegalOpenButton({
  slug,
  docUrl,
  className = 'btn-legal btn-sm',
  label,
}) {
  const { t } = useLocale()
  const resolvedDocUrl = docUrl || getLegalDocUrl(slug)
  const [open, setOpen] = useState(false)
  const [report, setReport] = useState(null)
  const text = label || t('card.legal')

  const handleClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!report) {
      try {
        const data = await api.getLegalPreview(slug)
        setReport(data)
      } catch {
        if (!resolvedDocUrl) return
      }
    }
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
