export function complexUrls(slug, status) {
  const base = `/complex/${slug}`
  return {
    detail: base,
    legal: `${base}?tab=legal`,
    reviews: status === 'commissioned' ? `${base}?tab=reviews` : null,
  }
}

export function verificationBadgeClass(status) {
  if (status === 'verified') return 'ok'
  if (status === 'risk') return 'bad'
  return 'warn'
}

export function isCommissioned(status) {
  return status === 'commissioned'
}
