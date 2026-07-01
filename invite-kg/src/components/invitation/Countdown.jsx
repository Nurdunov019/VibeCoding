import { useEffect, useRef, useState } from 'react'
import Reveal from '../Reveal'

function pad(n) {
  return String(n).padStart(2, '0')
}

function CountdownCell({ value, label }) {
  const [tick, setTick] = useState(false)
  const prev = useRef(value)

  useEffect(() => {
    if (prev.current !== value) {
      setTick(true)
      prev.current = value
      const id = setTimeout(() => setTick(false), 450)
      return () => clearTimeout(id)
    }
    return undefined
  }, [value])

  return (
    <div className={`w-inv-countdown-item${tick ? ' w-inv-countdown-item--pulse' : ''}`}>
      <span className={`w-inv-countdown-num${tick ? ' countdown-tick' : ''}`}>{pad(value)}</span>
      <span className="w-inv-countdown-label">{label}</span>
    </div>
  )
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
    <Reveal as="section" className="w-inv-section w-inv-countdown">
      <h2 className="w-inv-section-title">До свадьбы осталось:</h2>
      <div className="w-inv-countdown-row">
        {cells.map((c) => (
          <CountdownCell key={c.l} value={c.v} label={c.l} />
        ))}
      </div>
    </Reveal>
  )
}
