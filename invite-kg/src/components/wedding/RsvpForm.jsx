import { useState } from 'react'
import { motion } from 'framer-motion'
import { fireConfetti } from '../../utils/confetti'
import SectionTitle from './SectionTitle'
import Reveal from './Reveal'

function saveRsvp(storageKey, payload) {
  try {
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]')
    existing.push({ ...payload, savedAt: new Date().toISOString() })
    localStorage.setItem(storageKey, JSON.stringify(existing))
    return true
  } catch {
    return false
  }
}

export default function RsvpForm({ storageKey }) {
  const [name, setName] = useState('')
  const [attend, setAttend] = useState('yes')
  const [guests, setGuests] = useState('1')
  const [wish, setWish] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    saveRsvp(storageKey, { name, attend, guests, wish })
    setSent(true)
    if (attend === 'yes') fireConfetti()
  }

  if (sent) {
    return (
      <section id="wd-rsvp" className="wd-section wd-rsvp">
        <motion.div
          className="wd-rsvp-success"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <span className="wd-rsvp-check" aria-hidden>✓</span>
          <h2>Рахмат!</h2>
          <p>Жообуңуз сакталды. Көрүшкөнчө!</p>
        </motion.div>
      </section>
    )
  }

  return (
    <section id="wd-rsvp" className="wd-section wd-rsvp">
      <SectionTitle subtitle="Катышууңузду ырастаңыз">RSVP</SectionTitle>
      <Reveal>
        <form className="wd-rsvp-form" onSubmit={handleSubmit}>
          <label className="wd-field">
            <span>Атыңыз</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <fieldset className="wd-fieldset">
            <legend>Келесизби?</legend>
            <label className="wd-radio">
              <input type="radio" name="attend" checked={attend === 'yes'} onChange={() => setAttend('yes')} />
              Ооба, келем
            </label>
            <label className="wd-radio">
              <input type="radio" name="attend" checked={attend === 'no'} onChange={() => setAttend('no')} />
              Кечиресиз, келе албайм
            </label>
          </fieldset>

          {attend === 'yes' && (
            <label className="wd-field">
              <span>Канча адам?</span>
              <input
                type="number"
                min="1"
                max="10"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
            </label>
          )}

          <label className="wd-field">
            <span>Каалоо / комментарий</span>
            <textarea value={wish} onChange={(e) => setWish(e.target.value)} rows={3} />
          </label>

          <motion.button
            type="submit"
            className="wd-btn wd-btn--primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Жөнөтүү
          </motion.button>
        </form>
      </Reveal>
    </section>
  )
}
