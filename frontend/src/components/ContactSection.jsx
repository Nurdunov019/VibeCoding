import { useEffect, useState } from 'react'
import { useLocale } from '../context/LocaleContext'

const WHATSAPP_NUMBER = '996550858502'

function ContactIcon() {
  return (
    <svg className="home-contact-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      <circle cx="12" cy="5" r="2" fill="currentColor" />
      <circle cx="12" cy="19" r="2" fill="currentColor" />
      <circle cx="5" cy="12" r="2" fill="currentColor" />
      <circle cx="19" cy="12" r="2" fill="currentColor" />
    </svg>
  )
}

export default function ContactSection({ complexes = [] }) {
  const { t } = useLocale()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [complexSlug, setComplexSlug] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (complexes.length && !complexSlug) {
      setComplexSlug(complexes[0].slug)
    }
  }, [complexes, complexSlug])

  const handleSubmit = (e) => {
    e.preventDefault()
    const complex = complexes.find((c) => c.slug === complexSlug)
    const lines = [
      'ProverkaKG — заявка',
      `${t('contact.fieldName')}: ${name.trim()}`,
      `${t('contact.fieldPhone')}: +996 ${phone.trim()}`,
      `${t('contact.fieldObject')}: ${complex?.name || '—'}`,
    ]
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  return (
    <section className="home-contact" id="contact">
      <div className="home-contact-inner">
        <div className="home-contact-head">
          <div className="home-contact-eyebrow">
            <ContactIcon />
            <span>{t('contact.eyebrow')}</span>
          </div>
          <h2 className="home-contact-title">
            {t('contact.title1')}
            <br />
            {t('contact.title2')}
            <br />
            {t('contact.title3')}
          </h2>
          <p className="home-contact-sub">{t('contact.sub')}</p>
        </div>

        <form className="home-contact-form" onSubmit={handleSubmit}>
          <label className="home-contact-field">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('contact.namePlaceholder')}
              required
              autoComplete="name"
            />
          </label>

          <label className="home-contact-field home-contact-field--phone">
            <span className="home-contact-phone-prefix" aria-hidden>
              <span className="home-contact-flag">🇰🇬</span>
              <span className="home-contact-code">+996</span>
            </span>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d\s()-]/g, ''))}
              placeholder={t('contact.phonePlaceholder')}
              required
              autoComplete="tel"
            />
          </label>

          <div className="home-contact-field home-contact-field--select">
            <span className="home-contact-label">{t('contact.objectLabel')}</span>
            <div className="home-contact-select-wrap">
              <select
                value={complexSlug}
                onChange={(e) => setComplexSlug(e.target.value)}
                required
              >
                {complexes.length === 0 ? (
                  <option value="">{t('contact.noObjects')}</option>
                ) : (
                  complexes.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))
                )}
              </select>
              <span className="home-contact-select-arrow" aria-hidden>▾</span>
            </div>
          </div>

          <button type="submit" className="home-contact-submit" disabled={!complexes.length}>
            {t('contact.submit')}
          </button>

          {sent && <p className="home-contact-success">{t('contact.success')}</p>}
        </form>
      </div>
    </section>
  )
}
