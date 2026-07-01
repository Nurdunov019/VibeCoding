import { motion } from 'framer-motion'
import SectionTitle from './SectionTitle'
import Reveal from './Reveal'

export default function Gallery({ images }) {
  return (
    <section id="wd-gallery" className="wd-section wd-gallery">
      <SectionTitle subtitle="Биздин сүрөттөр">Галерея</SectionTitle>
      <div className="wd-gallery-grid">
        {images.map((src, i) => (
          <Reveal key={src} delay={i * 60} className="wd-gallery-item-wrap">
            <motion.div
              className="wd-gallery-item"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
              <img src={src} alt="" loading="lazy" className="wd-gallery-img" />
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
