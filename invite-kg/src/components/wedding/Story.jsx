import { motion } from 'framer-motion'
import SectionTitle from './SectionTitle'
import Reveal from './Reveal'

export default function Story({ photos, timeline }) {
  return (
    <section id="wd-story" className="wd-section wd-story">
      <SectionTitle subtitle="Биздин окуя">Сүйүү тарыхы</SectionTitle>

      <div className="wd-polaroids">
        {photos.map((photo, i) => (
          <Reveal key={photo.caption} delay={i * 100}>
            <motion.figure
              className="wd-polaroid"
              style={{ '--rot': `${photo.rotate}deg` }}
              whileHover={{ rotate: 0, scale: 1.04, zIndex: 2 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
              <img src={photo.src} alt={photo.caption} loading="lazy" />
              <figcaption>{photo.caption}</figcaption>
            </motion.figure>
          </Reveal>
        ))}
      </div>

      <ol className="wd-timeline">
        {timeline.map((item, i) => (
          <Reveal key={item.year} delay={i * 80} as={motion.li}>
            <span className="wd-timeline-year">{item.year}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
