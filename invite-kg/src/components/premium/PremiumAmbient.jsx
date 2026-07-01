export default function PremiumAmbient() {
  return (
    <div className="pr-ambient" aria-hidden>
      <div className="pr-grain" />
      <div className="pr-blob pr-blob--1" />
      <div className="pr-blob pr-blob--2" />
      <div className="pr-blob pr-blob--3" />
      <div className="pr-dust">
        {Array.from({ length: 18 }, (_, i) => (
          <span
            key={i}
            className="pr-dust-particle"
            style={{
              '--x': `${(i * 17 + 8) % 100}%`,
              '--y': `${(i * 23 + 5) % 100}%`,
              '--dur': `${8 + (i % 6)}s`,
              '--delay': `${i * 0.4}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
