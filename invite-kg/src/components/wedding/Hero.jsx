import { motion } from 'framer-motion'
import Reveal from './Reveal'

export default function Hero({ data, onOpen }) {
  return (
    <section id="wd-hero" className="wd-hero">
      <div
        className="wd-hero-bg"
        style={{ backgroundImage: `url("${data.coverImage}")` }}
        role="img"
        aria-label="Свадебное фото"
      />
      <div className="wd-hero-overlay" />

      <div className="wd-hero-content">
        <Reveal delay={100}>
          <p className="wd-hero-date">{data.dateShort}</p>
        </Reveal>

        <motion.h1
          className="wd-hero-names"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="wd-hero-name">{data.groom}</span>
          <span className="wd-hero-amp">&</span>
          <span className="wd-hero-name">{data.bride}</span>
        </motion.h1>

        <Reveal delay={500}>
          <p className="wd-hero-sub">{data.heroSubtitle}</p>
        </Reveal>

        <Reveal delay={700}>
          <button type="button" className="wd-hero-btn" onClick={onOpen}>
            Открыть приглашение
          </button>
        </Reveal>
      </div>
    </section>
  )
}
