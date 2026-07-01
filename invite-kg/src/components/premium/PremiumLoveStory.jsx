import { useReveal } from '../../hooks/useReveal'
import Reveal from '../Reveal'

export default function PremiumLoveStory({ items }) {
  const { ref, visible } = useReveal({ threshold: 0.15 })

  return (
    <section id="pr-story" className="pr-section pr-panel">
      <Reveal variant="blur">
        <h2 className="pr-section-title">Сүйүү тарыхы</h2>
      </Reveal>
      <ol
        ref={ref}
        className={`pr-story-timeline${visible ? ' pr-story-timeline--visible' : ''}`}
      >
        {items.map((item, i) => (
          <li key={item.year} className="pr-story-item" style={{ '--stagger-i': i }}>
            <span className="pr-story-year">{item.year}</span>
            <span className="pr-story-title">{item.title}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
