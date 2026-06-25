export const LEGAL_DOC_URL_BY_SLUG = {
  salkyn: '/documents/salkyn-legal.docx',
  'borsan-brown': '/documents/brown-legal.docx',
  'eliseiskie-polya': '/documents/eliseiskie-polya-legal.docx',
  'one-ordo-resort': '/documents/one-ordo-resort-legal.docx',
  siren: '/documents/siren-legal.docx',
  tokio: '/documents/tokio-legal.docx',
  'green-line': '/documents/green-line-legal.docx',
}

export function getLegalDocUrl(slug) {
  return LEGAL_DOC_URL_BY_SLUG[slug] || null
}
