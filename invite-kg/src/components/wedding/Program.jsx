import { motion } from 'framer-motion'
import SectionTitle from './SectionTitle'
import Reveal from './Reveal'

export default function Program({ items }) {
  return (
    <section id="wd-program" className="wd-section wd-program">
      <SectionTitle subtitle="Күндүн программасы">Программа</SectionTitle>
      <ul className="wd-program-list">
        {items.map((item, i) => (
          <Reveal key={item.time} delay={i * 70} as={motion.li}>
            <motion.div
              className="wd-program-card"
              whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(64, 55, 46, 0.12)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              <span className="wd-program-icon" aria-hidden>{item.icon}</span>
              <div>
                <time>{item.time}</time>
                <h3>{item.title}</h3>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
