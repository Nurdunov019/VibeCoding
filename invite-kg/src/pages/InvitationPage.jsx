import { useState } from 'react'
import { Link } from 'react-router-dom'
import IntroOverlay from '../components/invitation/IntroOverlay'
import Countdown from '../components/invitation/Countdown'
import RsvpForm from '../components/invitation/RsvpForm'
import { demoInvitation } from '../data/demoInvitation'

export default function InvitationPage() {
  const [opened, setOpened] = useState(false)
  const inv = demoInvitation

  return (
    <div className="w-inv-page">
      {!opened && (
        <IntroOverlay groom={inv.groom} bride={inv.bride} onOpen={() => setOpened(true)} />
      )}

      {opened && (
        <main className="w-inv-main">
          {/* Cover + names — maket1 */}
          <section className="w-inv-cover">
            <div className="w-inv-cover-photo" role="img" aria-label="Фото пары" />
            <div className="w-inv-cover-overlay">
              <h1 className="w-inv-cover-names">
                {inv.groom}
                <span className="w-inv-cover-amp">&</span>
                {inv.bride}
              </h1>
            </div>
          </section>

          <div className="w-inv-ornament-line" aria-hidden />

          <section className="w-inv-section w-inv-greeting">
            <h2 className="w-inv-script">Дорогие гости!</h2>
            <p className="w-inv-text w-inv-text--lead">
              {inv.dateDisplay} состоится долгожданное событие
            </p>
            {inv.story.map((p) => (
              <p key={p} className="w-inv-text">{p}</p>
            ))}
          </section>

          <section className="w-inv-monogram">
            <div className="w-inv-monogram-circle">{inv.groomInitial}</div>
            <span className="w-inv-monogram-sep">|</span>
            <div className="w-inv-monogram-circle">{inv.brideInitial}</div>
          </section>

          <p className="w-inv-day-label">день нашей свадьбы!</p>

          <section className="w-inv-section w-inv-venue">
            <h2 className="w-inv-section-title">Место проведения</h2>
            <div className="w-inv-ornament-line w-inv-ornament-line--short" aria-hidden />
            <p className="w-inv-venue-name">{inv.venue}</p>
            <p className="w-inv-text">{inv.address}</p>
            <a href={inv.mapUrl} className="w-inv-map-link" target="_blank" rel="noreferrer">
              Открыть на карте
            </a>
          </section>

          <section className="w-inv-section w-inv-program">
            <div className="w-inv-ornament-line w-inv-ornament-line--short" aria-hidden />
            <ul className="w-inv-program-list">
              {inv.program.map((item) => (
                <li key={item.time}>
                  <span className="w-inv-program-time">– {item.time}</span>
                  <span className="w-inv-program-title">{item.title}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="w-inv-section w-inv-dress">
            <h2 className="w-inv-section-title">Dress code</h2>
            <p className="w-inv-text">{inv.dressCode}</p>
          </section>

          <section className="w-inv-section w-inv-wishes">
            <h2 className="w-inv-section-title">Пожелания</h2>
            <p className="w-inv-text">{inv.wishes}</p>
          </section>

          <p className="w-inv-date-stamp">{inv.dateShort}</p>

          <Countdown targetDate={inv.date} />

          <section className="w-inv-section w-inv-request">
            <h2 className="w-inv-section-title">Просьба</h2>
          </section>

          <RsvpForm deadline={inv.rsvpDeadline} alcoholOptions={inv.alcoholOptions} />

          <footer className="w-inv-footer">
            <p className="w-inv-footer-names">{inv.groom} & {inv.bride}</p>
            <Link to="/" className="w-inv-footer-brand">chakyruu.kg</Link>
          </footer>
        </main>
      )}
    </div>
  )
}
