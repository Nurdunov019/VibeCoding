export const SHOWCASE_SLUGS = ['salkyn', 'borsan-brown']

export function canonicalShowcaseSlug(slug) {
  if (!slug) return slug
  const s = decodeURIComponent(slug).toLowerCase().trim()
  if (s === 'salkyn' || s.includes('салкын')) return 'salkyn'
  if (s === 'borsan-brown' || s.includes('brown') || s.includes('borsan')) return 'borsan-brown'
  return slug
}

export function isShowcaseSlug(slug) {
  if (!slug) return false
  return SHOWCASE_SLUGS.includes(canonicalShowcaseSlug(slug))
}

export function isShowcasePath(pathname) {
  const slug = pathname.replace(/^\/complex\//, '')
  return pathname.startsWith('/complex/') && isShowcaseSlug(slug)
}
