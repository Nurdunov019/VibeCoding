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
      const days = Math.floor(diff / 86400000)
      const hours = Math.floor((diff % 86400000) / 3600000)
      const mins = Math.floor((diff % 3600000) / 60000)
      const secs = Math.floor((diff % 60000) / 1000)
      setLeft({ days, hours, mins, secs })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (!left) return null

  const items = [
    { label: 'күн', value: left.days },
    { label: 'саат', value: left.hours },
    { label: 'мүн', value: left.mins },
    { label: 'сек', value: left.secs },
  ]

  return (
    <section className="inv-block inv-countdown">
      <h2>Калган убакыт</h2>
      <div className="inv-countdown-grid">
        {items.map((item) => (
          <div key={item.label} className="inv-countdown-cell">
            <span>{pad(item.value)}</span>
            <small>{item.label}</small>
          </div>
        ))}
      </div>
    </section>
  )
}
