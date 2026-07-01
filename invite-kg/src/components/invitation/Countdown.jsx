import { useEffect, useState } from 'react'

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function Countdown({ targetDate }) {
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
    { v: left.days, l: 'дней' },
    { v: left.hours, l: 'часов' },
    { v: left.mins, l: 'минут' },
    { v: left.secs, l: 'секунд' },
  ]

  return (
    <section className="w-inv-section w-inv-countdown">
      <h2 className="w-inv-section-title">До свадьбы осталось:</h2>
      <div className="w-inv-countdown-row">
        {cells.map((c) => (
          <div key={c.l} className="w-inv-countdown-item">
            <span className="w-inv-countdown-num">{pad(c.v)}</span>
            <span className="w-inv-countdown-label">{c.l}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
