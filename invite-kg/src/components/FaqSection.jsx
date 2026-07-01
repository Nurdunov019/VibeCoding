import { useState } from 'react'
import { faqItems } from '../data/faq'

export default function FaqSection() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="section">
      <div className="container container-narrow">
        <div className="section-head">
          <h2>Суроо — жооп</h2>
        </div>
        <div className="faq-list">
          {faqItems.map((item, i) => (
            <div key={item.q} className={`faq-item${open === i ? ' faq-item--open' : ''}`}>
              <button
                type="button"
                className="faq-q"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
              >
                {item.q}
                <span aria-hidden>{open === i ? '−' : '+'}</span>
              </button>
              {open === i && <p className="faq-a">{item.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
