import { useState } from 'react'
import { SITE, orderWhatsapp, telegramUrl, whatsappUrl } from '../config/site'

export default function ContactSection() {
  const [template, setTemplate] = useState('')
  const [name, setName] = useState('')

  const handleOrder = (e) => {
    e.preventDefault()
    const parts = ['Chakyruu.kg — заказ']
    if (name.trim()) parts.push(`Аты: ${name.trim()}`)
    if (template.trim()) parts.push(`Макет: ${template.trim()}`)
    parts.push('Онлайн чакыруу сайтына заказ бергим келет.')
    window.open(whatsappUrl(parts.join('\n')), '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="contact" className="section section-contact">
      <div className="container">
        <div className="section-head">
          <p className="section-eyebrow">Байланыш</p>
          <h2>Заказ же суроо?</h2>
          <p className="muted">WhatsApp, Telegram же телефон аркылуу жазыңыз</p>
        </div>

        <div className="contact-layout">
          <div className="contact-channels">
            <p className="contact-brand">{SITE.name}</p>
            <a href={orderWhatsapp()} className="channel-card channel-card--wa" target="_blank" rel="noreferrer">
              <span className="channel-icon">💬</span>
              <span>
                <strong>WhatsApp</strong>
                <small>{SITE.phoneDisplay}</small>
              </span>
            </a>
            <a href={telegramUrl()} className="channel-card channel-card--tg" target="_blank" rel="noreferrer">
              <span className="channel-icon">✈️</span>
              <span>
                <strong>Telegram</strong>
                <small>{SITE.phoneDisplay}</small>
              </span>
            </a>
            <a href={`tel:${SITE.phone}`} className="channel-card">
              <span className="channel-icon">📞</span>
              <span>
                <strong>Телефон</strong>
                <small>{SITE.phoneDisplay}</small>
              </span>
            </a>
          </div>

          <form className="contact-form" onSubmit={handleOrder}>
            <h3>Тез заказ</h3>
            <label>
              Атыңыз
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Толук аты" />
            </label>
            <label>
              Макет номери
              <input
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                placeholder="Мисалы: Макет 1"
              />
            </label>
            <button type="submit" className="btn btn-primary btn-block">WhatsApp аркылуу жөнөтүү</button>
            <p className="contact-hint muted">Заказ берүүдө макет номерин жазыңыз</p>
          </form>
        </div>
      </div>
    </section>
  )
}
