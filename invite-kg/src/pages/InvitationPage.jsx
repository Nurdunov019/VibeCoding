import { useState } from 'react'
import { Link } from 'react-router-dom'
import IntroOverlay from '../components/invitation/IntroOverlay'
import Countdown from '../components/invitation/Countdown'
import RsvpForm from '../components/invitation/RsvpForm'
import { demoInvitation } from '../data/demoInvitation'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ky-KG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('ky-KG', { hour: '2-digit', minute: '2-digit' })
}

export default function InvitationPage() {
  const [opened, setOpened] = useState(false)
  const inv = demoInvitation

  return (
    <div className="invitation-page">
      {!opened && (
        <IntroOverlay groom={inv.groom} bride={inv.bride} onOpen={() => setOpened(true)} />
      )}

      {opened && (
        <main className="invitation-main">
          <section className="inv-hero">
            <p className="inv-eyebrow">үйлөнүүгө чакыруу</p>
            <h1>{inv.groom} <span>&</span> {inv.bride}</h1>
            <p className="inv-date">{formatDate(inv.date)}</p>
            <p className="inv-time">{formatTime(inv.date)}</p>
          </section>

          <section className="inv-block inv-story">
            <p>{inv.story}</p>
          </section>

          <Countdown targetDate={inv.date} />

          <section className="inv-block inv-details">
            <h2>Орун жана убакыт</h2>
            <p className="inv-venue">{inv.venue}</p>
            <p className="inv-muted">{inv.address}</p>
            <a href={inv.mapUrl} target="_blank" rel="noreferrer" className="inv-link">
              Картада ачуу
            </a>
          </section>

          <section className="inv-block inv-program">
            <h2>Программа</h2>
            <ul>
              {inv.program.map((item) => (
                <li key={item.time}>
                  <time>{item.time}</time>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="inv-block inv-dress">
            <h2>Дресс-код</h2>
            <p>{inv.dressCode}</p>
          </section>

          <RsvpForm />

          <footer className="inv-footer">
            <p>Сүйүү менен чакырабыз 💕</p>
            <Link to="/" className="inv-back">chakyruu.kg</Link>
          </footer>
        </main>
      )}
    </div>
  )
}
