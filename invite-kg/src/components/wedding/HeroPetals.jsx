const PETALS = [
  { left: '8%', top: '18%', size: 22, rot: 25, delay: 0, dur: 7 },
  { left: '82%', top: '12%', size: 18, rot: -40, delay: 1.2, dur: 8 },
  { left: '15%', top: '62%', size: 16, rot: 60, delay: 0.6, dur: 6.5 },
  { left: '88%', top: '55%', size: 20, rot: -15, delay: 2, dur: 7.5 },
  { left: '48%', top: '8%', size: 14, rot: 10, delay: 0.3, dur: 9 },
  { left: '72%', top: '78%', size: 17, rot: -55, delay: 1.5, dur: 8.5 },
]

export default function HeroPetals() {
  return (
    <div className="wd-hero-petals" aria-hidden>
      {PETALS.map((p) => (
        <span
          key={`${p.left}-${p.top}`}
          className="wd-hero-petal"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            '--rot': `${p.rot}deg`,
            '--float-dur': `${p.dur}s`,
            '--float-delay': `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
