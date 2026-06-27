const DEMO_PDF_HOSTS = ['w3.org/WAI', 'table-word.pdf']

export function isViewablePdf(url) {
  if (!url?.trim()) return false
  return !DEMO_PDF_HOSTS.some((h) => url.includes(h))
}
