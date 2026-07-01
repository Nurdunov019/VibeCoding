import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionTitle from './SectionTitle'
import Reveal from './Reveal'

function pad(n) {
  return String(n).padStart(2, '0')
}

function FlipCell({ value, label, flipOnChange }) {
  const [flip, setFlip] = useState(false)
  const prev = useRef(value)

  useEffect(() => {
    if (prev.current !== value) {
      if (flipOnChange) setFlip(true)
      prev.current = value
      if (!flipOnChange) return undefined
      const id = setTimeout(() => setFlip(false), 550)
      return () => clearTimeout(id)
    }
    return undefined
  }, [value, flipOnChange])

  const display = label === 'күн' && value > 99 ? String(value) : pad(value)

  return (
    <div className={`wd-count-cell${flip ? ' wd-count-cell--flip' : ''}`}>
      <div className="wd-count-flip">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            className="wd-count-num"
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="wd-count-label">{label}</span>
    </div>
  )
}

function CountSep({ delay }) {
  return (
    <span
      className="wd-count-sep"
      aria-hidden
      style={{ '--sep-delay': `${delay}s` }}
    >
      ·
    </span>
  )
}

export default function CountdownSection({ targetDate = '2026-08-15T15:00:00' }) {
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
    { v: left.days, l: 'күн', flip: false },
    { v: left.hours, l: 'саат', flip: false },
    { v: left.mins, l: 'мүнөт', flip: true },
    { v: left.secs, l: 'секунд', flip: true },
  ]

  return (
    <section id="wd-countdown" className="wd-section wd-countdown">
      <SectionTitle subtitle="15 · 08 · 2026">Таймер</SectionTitle>
      <Reveal delay={120}>
        <div className="wd-count-row">
          {cells.map((c, i) => (
            <div key={c.l} className="wd-count-group">
              {i > 0 && <CountSep delay={i * 0.35} />}
              <FlipCell value={c.v} label={c.l} flipOnChange={c.flip} />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
