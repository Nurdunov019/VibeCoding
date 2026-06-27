import {
  DESCRIPTIONS,
  DOC_NOTES,
  DOC_TITLES,
  FEATURES,
  FLOORS,
  LEGAL,
  PHRASES,
  QUARTERS,
} from '../i18n/dynamicContent'

function pick(map, text, lang) {
  if (!text || lang === 'ru') return text
  const key = text.trim()
  return map[key]?.[lang] || text
}

export function translatePhrase(text, lang) {
  if (!text || lang === 'ru') return text
  let out = text
  const sorted = Object.keys(PHRASES).sort((a, b) => b.length - a.length)
  for (const phrase of sorted) {
    if (out.includes(phrase) && PHRASES[phrase][lang]) {
      out = out.split(phrase).join(PHRASES[phrase][lang])
    }
  }
  return out
}

export function translateFeature(line, lang) {
  return pick(FEATURES, line, lang)
}

export function translateDocTitle(title, lang, docType, t) {
  if (!title || lang === 'ru') return title
  const translated = pick(DOC_TITLES, title, lang)
  if (translated !== title) return translated
  if (docType && t) {
    const fromType = t(`docTypes.${docType}`)
    if (fromType !== `docTypes.${docType}`) return fromType
  }
  return translatePhrase(title, lang)
}

export function translateDocNotes(slug, docType, notes, lang) {
  if (!notes || lang === 'ru') return notes
  const keyed = DOC_NOTES[`${slug}:${docType}`]
  if (keyed?.[lang]) return keyed[lang]
  if (notes.trim() === 'Участок на красной книге') {
    const redBook = DOC_NOTES['jannat-tower:land_title']
    if (redBook?.[lang]) return redBook[lang]
  }
  return translatePhrase(notes, lang)
}

export function translateDocMeta(text, lang) {
  if (!text || lang === 'ru') return text
  const key = text.trim()
  return PHRASES[key]?.[lang] || translatePhrase(text, lang)
}

export function translateDescription(slug, description, lang) {
  if (!description || lang === 'ru') return description
  return DESCRIPTIONS[slug]?.[lang] || translatePhrase(description, lang)
}

export function translateFeaturesText(features, lang) {
  if (!features?.trim()) return []
  const chunks = features.includes('\n')
    ? features.split('\n')
    : features.split(/(?<=\.)\s+/)
  return chunks.map((s) => s.trim()).filter(Boolean).map((line) => translateFeature(line, lang))
}

export function translateQuarter(quarter, lang) {
  if (!quarter || lang === 'ru') return quarter
  const key = quarter.trim().toLowerCase()
  return QUARTERS[key]?.[lang] || quarter
}

export function translateFloors(floors, lang) {
  if (!floors || lang === 'ru') return floors
  const str = String(floors).trim()
  if (FLOORS[str]) return FLOORS[str][lang]
  return translatePhrase(str, lang)
}

export function translateVerifyMessage(message, status, lang, t) {
  if (!message || lang === 'ru') return message
  const defaults = {
    missing: t('docMessages.missing'),
    valid: t('docMessages.valid'),
    expired: t('docMessages.expired'),
    pending: t('docMessages.pending'),
  }
  if (message === 'Документ не загружен') return defaults.missing
  if (message === 'Срок действия истёк') return defaults.expired
  if (message === 'Документ действителен') return defaults.valid
  if (message === 'Требует проверки') return defaults.pending
  if (message === 'Участок на красной книге') return t('catalog.redBook')
  return translateDocNotes('', '', message, lang) || translatePhrase(message, lang) || defaults[status] || message
}

export function localizeLegalReport(report, slug, lang) {
  if (!report || lang === 'ru') return report
  const pack = LEGAL[slug]
  if (!pack) {
    return {
      ...report,
      title: translatePhrase(report.title, lang),
      summary: translatePhrase(report.summary, lang),
      conclusion: translatePhrase(report.conclusion, lang),
    }
  }
  return {
    ...report,
    title: pack.title?.[lang] || translatePhrase(report.title, lang),
    summary: pack.summary?.[lang] || translatePhrase(report.summary, lang),
    conclusion: pack.conclusion?.[lang] || translatePhrase(report.conclusion, lang),
  }
}
