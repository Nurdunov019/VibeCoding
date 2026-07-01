const PETALS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${(i * 13 + 5) % 100}%`,
  delay: `${(i * 0.7) % 5}s`,
  duration: `${9 + (i % 5)}s`,
  size: 10 + (i % 4) * 4,
  rotate: (i * 37) % 360,
}))

export default function Petals() {
  return (
    <div className="wd-petals" aria-hidden>
      {PETALS.map((p) => (
        <span
          key={p.id}
          className="wd-petal"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
            '--rot': `${p.rotate}deg`,
          }}
        />
      ))}
    </div>
  )
}
