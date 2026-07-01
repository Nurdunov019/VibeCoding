import { SITE, orderWhatsapp, telegramUrl } from '../config/site'

export default function ContactSection() {
  return (
    <section id="contact" className="section section-contact">
      <div className="container container-narrow">
        <div className="section-head">
          <p className="section-eyebrow">Байланыш</p>
          <h2>Заказ же суроо?</h2>
          <p className="muted">WhatsApp, Telegram же телефон аркылуу жазыңыз</p>
        </div>

        <div className="contact-channels contact-channels--stack">
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
      </div>
    </section>
  )
}
