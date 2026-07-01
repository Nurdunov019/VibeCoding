import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionTitle from './SectionTitle'

function FaqItem({ item, open, onToggle, index }) {
  return (
    <motion.article
      className={`wd-faq-item${open ? ' wd-faq-item--open' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.button
        type="button"
        className="wd-faq-q"
        onClick={onToggle}
        aria-expanded={open}
        whileHover={{ x: 4 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      >
        <span>{item.q}</span>
        <motion.span
          className="wd-faq-icon"
          aria-hidden
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 18 }}
        >
          +
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="wd-faq-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p
              className="wd-faq-a"
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              exit={{ y: -4 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {item.a}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

export default function FaqSection({ items }) {
  const [open, setOpen] = useState(0)

  return (
    <section id="wd-faq" className="wd-section wd-faq">
      <SectionTitle subtitle="Көп берилүүчү суроолор">Суроо — жооп</SectionTitle>
      <div className="wd-faq-list">
        {items.map((item, i) => (
          <FaqItem
            key={item.q}
            item={item}
            index={i}
            open={open === i}
            onToggle={() => setOpen(open === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  )
}
