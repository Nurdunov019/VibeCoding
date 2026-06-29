export const SHOWCASE_SLUGS = ['salkyn', 'borsan-brown', 'eliseiskie-polya', 'one-ordo-resort', 'siren', 'tokio', 'green-line']

export function canonicalShowcaseSlug(slug) {
  if (!slug) return slug
  const s = decodeURIComponent(slug).toLowerCase().trim()
  if (s === 'salkyn' || s.includes('салкын')) return 'salkyn'
  if (s === 'borsan-brown' || s.includes('brown') || s.includes('borsan')) return 'borsan-brown'
  if (
    s === 'eliseiskie-polya' ||
    s.includes('елисей') ||
    s.includes('elisei') ||
    s.includes('elysian')
  ) {
    return 'eliseiskie-polya'
  }
  if (
    s === 'one-ordo-resort' ||
    s.includes('one ordo') ||
    s.includes('one-ordo') ||
    s.includes('ordo resort')
  ) {
    return 'one-ordo-resort'
  }
  if (s === 'siren' || s.includes('сирень') || s.includes('siren')) return 'siren'
  if (s === 'tokio' || s.includes('токио') || s.includes('tokyo')) return 'tokio'
  if (s === 'green-line' || s.includes('green line') || s.includes('грин') || s.includes('greenline')) return 'green-line'
  return slug
}

export function isShowcaseSlug(slug) {
  if (!slug) return false
  return SHOWCASE_SLUGS.includes(canonicalShowcaseSlug(slug))
}

export function isShowcasePath(pathname) {
  return /^\/complex\/[^/]+/.test(pathname)
}
