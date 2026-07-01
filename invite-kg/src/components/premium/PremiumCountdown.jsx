import { useEffect, useRef, useState } from 'react'
import Reveal from '../Reveal'

function pad(n) {
  return String(n).padStart(2, '0')
}

function FlipCell({ value, label }) {
  const [flip, setFlip] = useState(false)
  const prev = useRef(value)

  useEffect(() => {
    if (prev.current !== value) {
      setFlip(true)
      prev.current = value
      const id = setTimeout(() => setFlip(false), 550)
      return () => clearTimeout(id)
    }
    return undefined
  }, [value])

  return (
    <div className={`pr-count-cell${flip ? ' pr-count-cell--flip pr-count-cell--glow' : ''}`}>
      <span className="pr-count-num">{value > 99 ? value : pad(value)}</span>
      <span className="pr-count-label">{label}</span>
    </div>
  )
}

export default function PremiumCountdown({ targetDate }) {
  const [left, setLeft] = useState(null)

  useEffect(() => {
    const target = new Date(targetDate).getTime()
    const tick = () => {
      const diff = Math.max(0, target - Date.now())
      setLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (!left) return null

  const cells = [
    { v: left.days, l: 'күн' },
    { v: left.hours, l: 'саат' },
    { v: left.mins, l: 'мүнөт' },
    { v: left.secs, l: 'секунд' },
  ]

  return (
    <section id="pr-countdown" className="pr-section pr-panel pr-panel--glass">
      <Reveal variant="blur">
        <h2 className="pr-section-title">Санаак</h2>
      </Reveal>
      <div className="pr-countdown-row">
        {cells.map((c) => (
          <FlipCell key={c.l} value={c.v} label={c.l} />
        ))}
      </div>
    </section>
  )
}
