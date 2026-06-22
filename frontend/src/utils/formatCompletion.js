export function formatCompletion(complex, yearSuffix = 'г.') {
  const q = complex.completion_quarter?.trim()
  const y = complex.completion_year
  if (!q && !y) return ''
  const yearPart = y ? `${y} ${yearSuffix}`.trim() : ''
  return [q, yearPart].filter(Boolean).join(' ')
}

export function formatLocation(complex) {
  const city = complex.city?.trim()
  const address = complex.address?.trim()
  if (city && address) return `${city}, ${address}`
  return address || city || ''
}
