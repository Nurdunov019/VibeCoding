import { useState } from 'react'
import Reveal from '../Reveal'

export default function PremiumFaq({ items }) {
  const [open, setOpen] = useState(0)

  return (
    <section id="pr-faq" className="pr-section pr-panel">
      <Reveal variant="blur">
        <h2 className="pr-section-title">FAQ</h2>
      </Reveal>
      <div className="pr-faq-list">
        {items.map((item, i) => (
          <Reveal key={item.q} delay={i * 60}>
            <div className={`pr-faq-item accordion-item${open === i ? ' pr-faq-item--open' : ''}`}>
              <button
                type="button"
                className="pr-faq-q magnetic-btn"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
              >
                {item.q}
                <span className="pr-faq-icon" aria-hidden>{open === i ? '−' : '+'}</span>
              </button>
              <div className="pr-faq-a">
                <p>{item.a}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
