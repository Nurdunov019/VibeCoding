import { SITE, telegramUrl, whatsappUrl } from '../../config/site'
import Reveal from '../Reveal'

export default function PremiumFooter({ data }) {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer id="pr-footer" className="pr-footer">
      <Reveal variant="fade">
        <p className="pr-footer-names">{data.groom} & {data.bride}</p>
        <p className="pr-footer-date">{data.dateDisplay}</p>
        <div className="pr-footer-contacts">
          <a href={`tel:${data.contacts.phone}`} className="pr-footer-link hover-glow">{data.contacts.phone}</a>
          <a href={whatsappUrl()} className="pr-footer-link hover-glow" target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={telegramUrl()} className="pr-footer-link hover-glow" target="_blank" rel="noreferrer">Telegram</a>
          <a href={data.contacts.instagram} className="pr-footer-link hover-glow" target="_blank" rel="noreferrer">Instagram</a>
        </div>
        <button type="button" className="pr-back-top magnetic-btn hover-lift" onClick={scrollTop}>
          ↑ Жогору
        </button>
        <a href="/" className="pr-footer-brand">{SITE.name}</a>
      </Reveal>
    </footer>
  )
}
