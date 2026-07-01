import { SITE, telegramUrl, whatsappUrl } from '../../config/site'
import { WEDDING_NAV } from '../../data/weddingInvitation'

export default function Footer({ data, onNav }) {
  return (
    <footer id="wd-footer" className="wd-footer">
      <p className="wd-footer-names">
        {data.groom} <span className="wd-footer-amp">&</span> {data.bride}
      </p>
      <p className="wd-footer-date">{data.dateDisplay}</p>

      <nav className="wd-footer-nav" aria-label="Навигация">
        {WEDDING_NAV.map((item) => (
          <button key={item.id} type="button" onClick={() => onNav(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="wd-footer-contacts">
        <a href={`tel:${data.contacts.phone}`}>{data.contacts.phone}</a>
        <a href={whatsappUrl()} target="_blank" rel="noreferrer">WhatsApp</a>
        <a href={telegramUrl()} target="_blank" rel="noreferrer">Telegram</a>
        <a href={data.contacts.instagram} target="_blank" rel="noreferrer">Instagram</a>
      </div>

      <a href="/" className="wd-footer-brand">{SITE.name}</a>
    </footer>
  )
}
