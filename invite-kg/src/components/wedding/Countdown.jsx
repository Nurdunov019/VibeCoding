import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionTitle from './SectionTitle'
import Reveal from './Reveal'

function Cell({ value, label }) {
  return (
    <div className="wd-count-cell">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          className="wd-count-num"
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
      <span className="wd-count-label">{label}</span>
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
    { v: left.days, l: 'күн' },
    { v: left.hours, l: 'саат' },
    { v: left.mins, l: 'мүнөт' },
    { v: left.secs, l: 'секунд' },
  ]

  return (
    <section id="wd-countdown" className="wd-section wd-countdown">
      <SectionTitle subtitle="Свадьбага чейин">Таймер</SectionTitle>
      <Reveal delay={120}>
        <div className="wd-count-row">
          {cells.map((c) => (
            <Cell key={c.l} value={c.v} label={c.l} />
          ))}
        </div>
      </Reveal>
    </section>
  )
}
