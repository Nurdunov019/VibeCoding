import { useState } from 'react'

export default function RsvpForm() {
  const [status, setStatus] = useState('yes')
  const [name, setName] = useState('')
  const [guests, setGuests] = useState(1)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  if (sent) {
    return (
      <section className="inv-block inv-rsvp">
        <h2>Рахмат!</h2>
        <p>Жообуңуз катталды. Көрүшкөнчө!</p>
      </section>
    )
  }

  return (
    <section className="inv-block inv-rsvp">
      <h2>RSVP</h2>
      <p className="inv-muted">Келесизби? Бизге билдириңиз</p>
      <form className="inv-form" onSubmit={handleSubmit}>
        <label className="inv-field">
          Атыңыз
          <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Толук аты" />
        </label>
        <div className="inv-radio-group">
          <label>
            <input type="radio" name="rsvp" checked={status === 'yes'} onChange={() => setStatus('yes')} />
            Келем
          </label>
          <label>
            <input type="radio" name="rsvp" checked={status === 'no'} onChange={() => setStatus('no')} />
            Келбейм
          </label>
        </div>
        {status === 'yes' && (
          <label className="inv-field">
            Киши саны
            <input type="number" min={1} max={10} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
          </label>
        )}
        <label className="inv-field">
          Куттуктоо
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Тилегиңиз..." />
        </label>
        <button type="submit" className="inv-btn">Жөнөтүү</button>
      </form>
    </section>
  )
}
