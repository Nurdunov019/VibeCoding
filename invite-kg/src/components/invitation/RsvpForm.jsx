import { useState } from 'react'

export default function RsvpForm({ deadline, alcoholOptions }) {
  const [name, setName] = useState('')
  const [attend, setAttend] = useState('yes')
  const [alcohol, setAlcohol] = useState([])
  const [partner, setPartner] = useState('')
  const [song, setSong] = useState('')
  const [sent, setSent] = useState(false)

  const toggleAlcohol = (item) => {
    setAlcohol((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  if (sent) {
    return (
      <section className="w-inv-section w-inv-rsvp">
        <h2 className="w-inv-section-title">Спасибо!</h2>
        <p className="w-inv-text w-inv-text--center">Ваш ответ принят. До встречи на празднике!</p>
      </section>
    )
  }

  return (
    <section className="w-inv-section w-inv-rsvp">
      <p className="w-inv-rsvp-note">
        Чтобы всё прошло идеально, пожалуйста, заполните анкету до {deadline}.
        Если вы с парой — заполните отдельно. Спасибо!
      </p>
      <h2 className="w-inv-section-title">Анкета гостя</h2>

      <form className="w-inv-form" onSubmit={handleSubmit}>
        <label className="w-inv-field">
          <span>Ваше имя и фамилия</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <fieldset className="w-inv-fieldset">
          <legend>Планируете ли Вы присутствовать на свадьбе?</legend>
          <label className="w-inv-radio">
            <input type="radio" name="attend" checked={attend === 'yes'} onChange={() => setAttend('yes')} />
            Да, с удовольствием!
          </label>
          <label className="w-inv-radio">
            <input type="radio" name="attend" checked={attend === 'no'} onChange={() => setAttend('no')} />
            К сожалению, не смогу
          </label>
        </fieldset>

        {attend === 'yes' && (
          <>
            <fieldset className="w-inv-fieldset">
              <legend>Уточните предпочтения в алкоголе:</legend>
              {alcoholOptions.map((opt) => (
                <label key={opt} className="w-inv-check">
                  <input
                    type="checkbox"
                    checked={alcohol.includes(opt)}
                    onChange={() => toggleAlcohol(opt)}
                  />
                  {opt}
                </label>
              ))}
            </fieldset>

            <label className="w-inv-field">
              <span>Имя и фамилия вашей второй половинки</span>
              <input value={partner} onChange={(e) => setPartner(e.target.value)} />
            </label>

            <label className="w-inv-field">
              <span>Какой трек вы хотели бы услышать на свадьбе?</span>
              <input value={song} onChange={(e) => setSong(e.target.value)} />
            </label>
          </>
        )}

        <button type="submit" className="w-inv-submit">Отправить</button>
      </form>
    </section>
  )
}
