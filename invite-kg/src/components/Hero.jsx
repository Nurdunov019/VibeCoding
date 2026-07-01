import { eventTypes } from '../data/templates'
import { SITE } from '../config/site'

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
          Онлайн <em>чакыруу</em>
          <br />
          сайттары
        </h1>
        <p className="hero-lead">
          Үйлөнүү, туулган күн, корпоратив жана башка иш-чаралар үчүн кооз мобилдик чакыруулар.
          Шаблон тандаңыз — биз сизге жеке сайт даярдайбыз.
        </p>
        <div className="hero-actions">
          <a href="#templates" className="btn btn-primary">Шаблондорду көрүү</a>
          <a href="#contact" className="btn btn-ghost">Заказ берүү</a>
        </div>
        <ul className="event-types">
          {eventTypes.map((t) => (
            <li key={t.id}>
              <span className="event-icon" aria-hidden>{t.icon}</span>
              {t.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
