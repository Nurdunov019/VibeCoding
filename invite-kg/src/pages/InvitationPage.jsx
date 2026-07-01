import { useState } from 'react'
import { Link } from 'react-router-dom'
import IntroOverlay from '../components/invitation/IntroOverlay'
import Countdown from '../components/invitation/Countdown'
import RsvpForm from '../components/invitation/RsvpForm'
import Reveal from '../components/Reveal'
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
        <main className="w-inv-main fade-in">
          <section className="w-inv-cover img-zoom-wrap">
            <div className="w-inv-cover-photo img-zoom img-zoom--slow" role="img" aria-label="Фото пары" />
            <div className="w-inv-cover-overlay fade-in" style={{ '--fade-delay': '200ms' }}>
              <h1 className="w-inv-cover-names">
                {inv.groom}
                <span className="w-inv-cover-amp">&</span>
                {inv.bride}
              </h1>
            </div>
          </section>

          <div className="w-inv-ornament-line" aria-hidden />

          <Reveal as="section" className="w-inv-section w-inv-greeting">
            <h2 className="w-inv-script">Дорогие гости!</h2>
            <p className="w-inv-text w-inv-text--lead">
              {inv.dateDisplay} состоится долгожданное событие
            </p>
            {inv.story.map((p) => (
              <p key={p} className="w-inv-text">{p}</p>
            ))}
          </Reveal>

          <Reveal as="section" className="w-inv-monogram" delay={60}>
            <div className="w-inv-monogram-circle hover-scale">{inv.groomInitial}</div>
            <span className="w-inv-monogram-sep">|</span>
            <div className="w-inv-monogram-circle hover-scale">{inv.brideInitial}</div>
          </Reveal>

          <Reveal delay={80}>
            <p className="w-inv-day-label">день нашей свадьбы!</p>
          </Reveal>

          <Reveal as="section" className="w-inv-section w-inv-venue" delay={100}>
            <h2 className="w-inv-section-title">Место проведения</h2>
            <div className="w-inv-ornament-line w-inv-ornament-line--short" aria-hidden />
            <p className="w-inv-venue-name">{inv.venue}</p>
            <p className="w-inv-text">{inv.address}</p>
            <a href={inv.mapUrl} className="w-inv-map-link hover-lift" target="_blank" rel="noreferrer">
              Открыть на карте
            </a>
          </Reveal>

          <Reveal as="section" className="w-inv-section w-inv-program" delay={100}>
            <div className="w-inv-ornament-line w-inv-ornament-line--short" aria-hidden />
            <ul className="w-inv-program-list">
              {inv.program.map((item) => (
                <li key={item.time}>
                  <span className="w-inv-program-time">– {item.time}</span>
                  <span className="w-inv-program-title">{item.title}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal as="section" className="w-inv-section w-inv-dress" delay={100}>
            <h2 className="w-inv-section-title">Dress code</h2>
            <p className="w-inv-text">{inv.dressCode}</p>
          </Reveal>

          <Reveal as="section" className="w-inv-section w-inv-wishes" delay={100}>
            <h2 className="w-inv-section-title">Пожелания</h2>
            <p className="w-inv-text">{inv.wishes}</p>
          </Reveal>

          <Reveal delay={120}>
            <p className="w-inv-date-stamp">{inv.dateShort}</p>
          </Reveal>

          <Countdown targetDate={inv.date} />

          <Reveal as="section" className="w-inv-section w-inv-request" delay={80}>
            <h2 className="w-inv-section-title">Просьба</h2>
          </Reveal>

          <Reveal delay={100}>
            <RsvpForm deadline={inv.rsvpDeadline} alcoholOptions={inv.alcoholOptions} />
          </Reveal>

          <footer className="w-inv-footer reveal reveal--visible">
            <p className="w-inv-footer-names">{inv.groom} & {inv.bride}</p>
            <Link to="/" className="w-inv-footer-brand">chakyruu.kg</Link>
          </footer>
        </main>
      )}
    </div>
  )
}
