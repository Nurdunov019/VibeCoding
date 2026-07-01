import { useState } from 'react'
import { whatsappUrl } from '../config/site'

export default function QuickOrderSection() {
  const [template, setTemplate] = useState('')
  const [name, setName] = useState('')

  const handleOrder = (e) => {
    e.preventDefault()
    const parts = ['Chakyruu.kg — заказ']
    if (name.trim()) parts.push(`Аты: ${name.trim()}`)
    if (template.trim()) parts.push(`Макет: ${template.trim()}`)
    parts.push('Онлайн чакыруу сайтына заказ бергим келет.')
    window.open(whatsappUrl(parts.join('\n')), '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="order" className="section section-quick-order">
      <div className="container container-narrow">
        <form className="contact-form contact-form--standalone" onSubmit={handleOrder}>
          <h3>Тез заказ</h3>
          <label>
            Атыңыз
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Толук аты" />
          </label>
          <label>
            Макет номери
            <input
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder="Мисалы: Макет 1"
            />
          </label>
          <button type="submit" className="btn btn-primary btn-block">WhatsApp аркылуу жөнөтүү</button>
          <p className="contact-hint muted">Заказ берүүдө макет номерин жазыңыз</p>
        </form>
      </div>
    </section>
  )
}
