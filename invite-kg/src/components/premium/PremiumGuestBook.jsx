import { useState } from 'react'
import Reveal from '../Reveal'

export default function PremiumGuestBook({ guestBook }) {
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [messages, setMessages] = useState(guestBook.messages)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    setMessages((prev) => [{ name: name.trim(), text: text.trim(), time: 'Жаңы' }, ...prev])
    setName('')
    setText('')
  }

  return (
    <section id="pr-guestbook" className="pr-section pr-panel pr-panel--glass">
      <Reveal variant="blur">
        <h2 className="pr-section-title">Guest Book</h2>
        <p className="pr-section-sub">Тилегиңизди жазыңыз</p>
      </Reveal>
      <form className="pr-guest-form" onSubmit={handleSubmit}>
        <label className="pr-input-wrap input-anim">
          <span>Атыңыз</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="pr-input-wrap input-anim">
          <span>Билдирүү</span>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} required />
        </label>
        <button type="submit" className="pr-btn pr-btn--outline magnetic-btn">Жазуу</button>
      </form>
      <div className="pr-guest-messages">
        <p className="pr-guest-messages-title">Акыркы билдирүүлөр</p>
        {messages.map((msg) => (
          <article key={`${msg.name}-${msg.time}`} className="pr-guest-msg slide-in">
            <header>
              <strong>{msg.name}</strong>
              <time>{msg.time}</time>
            </header>
            <p>{msg.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
