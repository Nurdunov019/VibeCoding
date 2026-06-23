export const LEGAL_DOC_URL_BY_SLUG = {
  salkyn: '/documents/salkyn-legal.docx',
  'borsan-brown': '/documents/brown-legal.docx',
}

export function getLegalDocUrl(slug) {
  return LEGAL_DOC_URL_BY_SLUG[slug] || null
}
