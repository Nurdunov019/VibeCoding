import Reveal from '../Reveal'

export default function PremiumWishes({ wishes }) {
  return (
    <section id="pr-wishes" className="pr-section pr-panel pr-panel--glass">
      <Reveal variant="fade">
        <h2 className="pr-section-title">{wishes.title}</h2>
        <blockquote className="pr-wishes-quote">
          <p>{wishes.example}</p>
        </blockquote>
      </Reveal>
    </section>
  )
}
