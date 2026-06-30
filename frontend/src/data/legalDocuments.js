export const LEGAL_DOC_URL_BY_SLUG = {
  salkyn: '/documents/salkyn-legal.docx',
  'borsan-brown': '/documents/brown-legal.docx',
  'eliseiskie-polya': '/documents/eliseiskie-polya-legal.docx',
  'one-ordo-resort': '/documents/one-ordo-resort-legal.docx',
  siren: '/documents/siren-legal.docx',
  tokio: '/documents/tokio-legal.docx',
  'green-line': '/documents/green-line-legal.docx',
  'jannat-tower': '/documents/jannat-tower-legal.docx',
  'levan-park': '/documents/levan-park-legal.docx',
  'level-lux': '/documents/level-lux-legal.docx',
  akkula: '/documents/akkula-legal.pdf',
  'vremena-goda': '/documents/vremena-goda-legal.docx',
  gorizont: '/documents/gorizont-legal.docx',
  'tokio-city': '/documents/tokio-city-legal.docx',
}

export function getLegalDocUrl(slug) {
  return LEGAL_DOC_URL_BY_SLUG[slug] || null
}

export function resolveLegalDocUrl(complex) {
  if (!complex) return null
  if (typeof complex === 'string') return getLegalDocUrl(complex)
  return complex.legal_doc_url || getLegalDocUrl(complex.slug)
}
