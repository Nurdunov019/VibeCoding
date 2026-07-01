import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import HeroPetals from './HeroPetals'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Hero({ data, onOpen }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.35])

  return (
    <section ref={ref} id="wd-hero" className="wd-hero">
      <div
        className="wd-hero-bg"
        style={{ '--hero-image': `url("${data.coverImage}")` }}
        role="img"
        aria-label="Свадебное фото"
      />
      <div className="wd-hero-overlay" />
      <HeroPetals />

      <motion.div
        className="wd-hero-content"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.p className="wd-hero-date" {...fadeUp(0.15)}>
          {data.dateShort}
        </motion.p>

        <motion.h1 className="wd-hero-names" {...fadeUp(0.3)}>
          <span className="wd-hero-name">{data.groom}</span>
          <span className="wd-hero-amp">&</span>
          <span className="wd-hero-name">{data.bride}</span>
        </motion.h1>

        <motion.p className="wd-hero-sub" {...fadeUp(0.55)}>
          {data.heroSubtitle}
        </motion.p>

        <motion.div {...fadeUp(0.75)}>
          <button type="button" className="wd-hero-btn" onClick={onOpen}>
            Ачуу
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}
