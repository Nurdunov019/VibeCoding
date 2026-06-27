import { translatePhrase, translateQuarter } from './translateContent'

export function formatCompletion(complex, yearSuffix = 'г.', lang = 'ru') {
  const q = complex.completion_quarter?.trim()
  const y = complex.completion_year
  if (!q && !y) return ''
  const quarterPart = q ? translateQuarter(q, lang) : ''
  const yearPart = y ? `${y} ${yearSuffix}`.trim() : ''
  return [quarterPart, yearPart].filter(Boolean).join(' ')
}

export function formatLocation(complex, lang = 'ru') {
  const city = complex.city?.trim()
  const address = complex.address?.trim()
  const cityLabel = city && lang !== 'ru' ? translatePhrase(city, lang) : city
  const addressLabel = address ? translatePhrase(address, lang) : ''
  if (cityLabel && addressLabel) return `${cityLabel}, ${addressLabel}`
  return addressLabel || cityLabel || ''
}
