import { useReveal } from '../../hooks/useReveal'
import Reveal from '../Reveal'

export default function PremiumProgram({ items }) {
  const { ref, visible } = useReveal({ threshold: 0.12 })

  return (
    <section id="pr-program" className="pr-section pr-panel pr-panel--glass">
      <Reveal variant="blur">
        <h2 className="pr-section-title">Той программасы</h2>
      </Reveal>
      <ul ref={ref} className={`pr-program-list timeline-draw${visible ? ' timeline-draw--visible' : ''}`}>
        {items.map((item, i) => (
          <li key={item.time} style={{ '--i': i }}>
            <span className="pr-program-icon" aria-hidden>{item.icon}</span>
            <div>
              <span className="pr-program-time">{item.time}</span>
              <span className="pr-program-title">{item.title}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
