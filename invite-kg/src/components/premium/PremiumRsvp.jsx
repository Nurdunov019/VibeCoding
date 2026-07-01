import { useState } from 'react'
import { fireConfetti } from '../../utils/confetti'
import Reveal from '../Reveal'
import SuccessCheckmark from '../SuccessCheckmark'

export default function PremiumRsvp({ deadline, alcoholOptions }) {
  const [name, setName] = useState('')
  const [attend, setAttend] = useState('yes')
  const [guests, setGuests] = useState('1')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [alcohol, setAlcohol] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const toggleAlcohol = (item) => {
    setAlcohol((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    window.setTimeout(() => {
      setSent(true)
      if (attend === 'yes') fireConfetti()
    }, 650)
  }

  if (sent) {
    return (
      <section id="pr-rsvp" className="pr-section pr-panel pr-rsvp-success fade-in">
        <SuccessCheckmark />
        <h2 className="pr-section-title">Рахмат!</h2>
        <p className="pr-rsvp-success-text">Жообуңуз кабыл алынды.</p>
      </section>
    )
  }

  return (
    <section id="pr-rsvp" className="pr-section pr-panel pr-panel--glass">
      <Reveal variant="blur">
        <h2 className="pr-section-title">RSVP</h2>
        <p className="pr-section-sub">Сураныч, {deadline} чейин жооп бериңиз</p>
      </Reveal>
      <form className="pr-rsvp-form" onSubmit={handleSubmit}>
        <label className="pr-input-wrap input-anim">
          <span>Атыңыз</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <fieldset className="pr-fieldset">
          <legend>Келесизби?</legend>
          <label className="pr-radio">
            <input type="radio" name="attend" checked={attend === 'yes'} onChange={() => setAttend('yes')} />
            Ооба
          </label>
          <label className="pr-radio">
            <input type="radio" name="attend" checked={attend === 'no'} onChange={() => setAttend('no')} />
            Жок
          </label>
        </fieldset>

        {attend === 'yes' && (
          <>
            <label className="pr-input-wrap input-anim">
              <span>Канча адам?</span>
              <input type="number" min="1" max="10" value={guests} onChange={(e) => setGuests(e.target.value)} />
            </label>
            <label className="pr-input-wrap input-anim">
              <span>Телефон</span>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <fieldset className="pr-fieldset">
              <legend>Алкоголь</legend>
              {alcoholOptions.map((opt) => (
                <label key={opt} className="pr-check">
                  <input type="checkbox" checked={alcohol.includes(opt)} onChange={() => toggleAlcohol(opt)} />
                  {opt}
                </label>
              ))}
            </fieldset>
          </>
        )}

        <label className="pr-input-wrap input-anim">
          <span>Комментарий</span>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
        </label>

        <button type="submit" className={`pr-btn pr-btn--primary btn-morph magnetic-btn${submitting ? ' btn-morph--loading' : ''}`} disabled={submitting}>
          <span className="btn-morph-label">{submitting ? '…' : 'Жөнөтүү'}</span>
        </button>
      </form>
    </section>
  )
}
