import Reveal from '../Reveal'

export default function PremiumDressCode({ dressCode }) {
  return (
    <section id="pr-dress" className="pr-section pr-panel">
      <Reveal variant="blur">
        <h2 className="pr-section-title">Dress Code</h2>
      </Reveal>
      <div className="pr-dress-grid">
        <Reveal delay={60} className="pr-dress-card hover-lift card-float">
          <span className="pr-dress-emoji" aria-hidden>👔</span>
          <span className="pr-dress-role">Эркектер</span>
          <p>{dressCode.men}</p>
        </Reveal>
        <Reveal delay={120} className="pr-dress-card hover-lift card-float">
          <span className="pr-dress-emoji" aria-hidden>👗</span>
          <span className="pr-dress-role">Аялдар</span>
          <p>{dressCode.women}</p>
        </Reveal>
      </div>
      <Reveal delay={180}>
        <p className="pr-dress-colors-label">Түстөр</p>
        <div className="pr-dress-colors">
          {dressCode.colors.map((color, i) => (
            <button
              key={color}
              type="button"
              className="pr-color-dot hover-scale color-ripple"
              style={{ '--c': color, '--i': i }}
              title={color}
              aria-label={`Түс ${i + 1}`}
            />
          ))}
        </div>
        <p className="pr-dress-note">{dressCode.note}</p>
      </Reveal>
    </section>
  )
}
