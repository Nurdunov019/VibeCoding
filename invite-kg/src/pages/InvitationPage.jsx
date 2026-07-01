import { useState } from 'react'
import { Link } from 'react-router-dom'
import IntroOverlay from '../components/invitation/IntroOverlay'
import Countdown from '../components/invitation/Countdown'
import RsvpForm from '../components/invitation/RsvpForm'
import ProgramTimeline from '../components/invitation/ProgramTimeline'
import InvDivider from '../components/invitation/InvDivider'
import Reveal from '../components/Reveal'
import LetterReveal from '../components/LetterReveal'
import ParallaxLayer from '../components/ParallaxLayer'
import StaggerReveal from '../components/StaggerReveal'
import ThemeToggle from '../components/ThemeToggle'
import MusicToggle from '../components/MusicToggle'
import { demoInvitation } from '../data/demoInvitation'

export default function InvitationPage() {
  const [opened, setOpened] = useState(false)
  const inv = demoInvitation

  return (
    <div className="w-inv-page">
      <div className="inv-floating-tools">
        <ThemeToggle />
        <MusicToggle />
      </div>
      {!opened && (
        <IntroOverlay groom={inv.groom} bride={inv.bride} onOpen={() => setOpened(true)} />
      )}

      {opened && (
        <main className="w-inv-main fade-in">
          <section className="w-inv-cover img-zoom-wrap">
            <div
              className="w-inv-cover-photo img-zoom img-zoom--slow"
              role="img"
              aria-label="Фото пары"
              style={{ '--cover-image': `url("${inv.coverImage}")` }}
            />
            <div className="w-inv-cover-frame" aria-hidden />
            <ParallaxLayer className="w-inv-cover-overlay fade-in" speed={0.18} style={{ '--fade-delay': '200ms' }}>
              <p className="w-inv-cover-date">{inv.dateShort}</p>
              <h1 className="w-inv-cover-names">
                <LetterReveal text={inv.groom} delay={120} />
                <span className="w-inv-cover-amp">
                  <LetterReveal text="&" delay={280} />
                </span>
                <LetterReveal text={inv.bride} delay={360} />
              </h1>
            </ParallaxLayer>
          </section>

          <InvDivider />

          <Reveal as="section" className="w-inv-section w-inv-panel w-inv-greeting" variant="blur">
            <h2 className="w-inv-script">
              <LetterReveal text="Дорогие гости!" />
            </h2>
            <p className="w-inv-text w-inv-text--lead fade-in" style={{ '--fade-delay': '200ms' }}>
              {inv.dateDisplay} состоится долгожданное событие
            </p>
            <div className="w-inv-story">
              {inv.story.map((p, i) => (
                <Reveal key={p} variant="fade" delay={i * 80}>
                  <p className="w-inv-text">{p}</p>
                </Reveal>
              ))}
            </div>
          </Reveal>

          <StaggerReveal as="section" className="w-inv-monogram" delay={60} step={100}>
            <div className="w-inv-monogram-circle hover-scale">
              <span>{inv.groomInitial}</span>
            </div>
            <span className="w-inv-monogram-heart" aria-hidden>♥</span>
            <div className="w-inv-monogram-circle hover-scale">
              <span>{inv.brideInitial}</span>
            </div>
          </StaggerReveal>

          <Reveal delay={80}>
            <p className="w-inv-day-label">
              <LetterReveal text="день нашей свадьбы!" />
            </p>
          </Reveal>

          <InvDivider gem="◇" />

          <Reveal as="section" className="w-inv-section w-inv-panel w-inv-panel--soft w-inv-venue" delay={100} variant="blur">
            <h2 className="w-inv-section-title">Место проведения</h2>
            <div className="w-inv-venue-card">
              <span className="w-inv-venue-pin" aria-hidden>📍</span>
              <p className="w-inv-venue-name">{inv.venue}</p>
              <p className="w-inv-text w-inv-text--venue">{inv.address}</p>
              <a href={inv.mapUrl} className="w-inv-map-link hover-lift" target="_blank" rel="noreferrer">
                Открыть на карте
              </a>
            </div>
          </Reveal>

          <Reveal as="section" className="w-inv-section w-inv-panel w-inv-program" delay={100}>
            <h2 className="w-inv-section-title">Программа дня</h2>
            <ProgramTimeline items={inv.program} />
          </Reveal>

          <Reveal as="section" className="w-inv-section w-inv-panel w-inv-panel--soft w-inv-dress" delay={100} variant="fade">
            <h2 className="w-inv-section-title">Dress code</h2>
            <div className="w-inv-dress-swatches">
              {inv.dressColors.map((swatch) => (
                <span
                  key={swatch.name}
                  className="w-inv-dress-swatch"
                  style={{ '--swatch': swatch.color }}
                  title={swatch.name}
                />
              ))}
            </div>
            <p className="w-inv-text">{inv.dressCode}</p>
          </Reveal>

          <Reveal as="section" className="w-inv-section w-inv-panel w-inv-wishes" delay={100} variant="blur">
            <h2 className="w-inv-section-title">Пожелания</h2>
            <blockquote className="w-inv-quote">
              <p>{inv.wishes}</p>
            </blockquote>
          </Reveal>

          <Reveal delay={120}>
            <div className="w-inv-date-badge">
              <span className="w-inv-date-badge-label">Дата</span>
              <p className="w-inv-date-stamp">
                <LetterReveal text={inv.dateShort} />
              </p>
            </div>
          </Reveal>

          <Countdown targetDate={inv.date} />

          <InvDivider gem="♥" />

          <Reveal as="section" className="w-inv-section w-inv-request" delay={80}>
            <h2 className="w-inv-section-title">Просьба</h2>
            <p className="w-inv-text w-inv-text--center w-inv-text--muted">
              Пожалуйста, подтвердите своё присутствие
            </p>
          </Reveal>

          <Reveal delay={100} variant="blur">
            <RsvpForm deadline={inv.rsvpDeadline} alcoholOptions={inv.alcoholOptions} />
          </Reveal>

          <footer className="w-inv-footer reveal reveal--visible">
            <InvDivider gem="✦" />
            <p className="w-inv-footer-names">{inv.groom} & {inv.bride}</p>
            <p className="w-inv-footer-date">{inv.dateDisplay}</p>
            <Link to="/" className="w-inv-footer-brand">chakyruu.kg</Link>
          </footer>
        </main>
      )}
    </div>
  )
}
