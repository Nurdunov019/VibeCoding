import { SITE } from '../config/site'

const heroEvents = [
  { icon: '💍', label: 'үйлөнүү' },
  { icon: '🎂', label: 'туулган күн' },
  { icon: '🏢', label: 'корпоратив' },
  { icon: '🎀', label: 'gender party' },
  { icon: '✨', label: 'мастер-класс' },
]

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden>
        <div className="hero-blob hero-blob--1" />
        <div className="hero-blob hero-blob--2" />
        <div className="hero-grain" />
      </div>
      <div className="container hero-inner">
        <p className="hero-eyebrow">{SITE.eyebrow}</p>
        <h1 className="hero-title">
          Сайт <em>чакыруу</em>
        </h1>
        <p className="hero-subtitle">онлайн чакыруу сайттары</p>
        <p className="hero-lead">
          Үйлөнүү, туулган күн, корпоратив жана башка иш-чаралар үчүн кооз мобилдик чакыруулар.
          Шаблон тандаңыз — биз сизге жеке сайт даярдайбыз.
        </p>
        <div className="hero-actions">
          <a href="#templates" className="btn btn-primary">Шаблондорду көрүү</a>
          <a href="#contact" className="btn btn-ghost">Заказ берүү</a>
        </div>
        <ul className="event-types">
          {heroEvents.map((t) => (
            <li key={t.label}>
              <span className="event-icon" aria-hidden>{t.icon}</span>
              {t.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
