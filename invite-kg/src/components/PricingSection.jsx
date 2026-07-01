import { basePlan } from '../data/pricing'
import { orderWhatsapp } from '../config/site'

export default function PricingSection() {
  return (
    <section id="pricing" className="section section-alt">
      <div className="container">
        <div className="section-head">
          <p className="section-eyebrow">Тариф</p>
          <h2>Тарифтик план</h2>
        </div>
        <div className="pricing-layout">
          <div className="pricing-main">
            <p className="pricing-label">{basePlan.name}</p>
            <h3>{basePlan.subtitle}</h3>
            <p className="pricing-amount">
              <span>{basePlan.price.toLocaleString('ru-RU')}</span>
              <small>{basePlan.currency}</small>
            </p>
            <p className="muted pricing-note">{basePlan.note}</p>
            <h4>Идеалдуу чакыруу үчүн кирет:</h4>
            <ul className="check-list">
              {basePlan.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="pricing-extras">
            <h4>Сайтка кошууга болот:</h4>
            <ul className="extras-list">
              {basePlan.extras.map((e) => (
                <li key={e.name}>
                  <span>{e.name}</span>
                  <strong>{e.price}</strong>
                </li>
              ))}
            </ul>
            <a href={orderWhatsapp()} className="btn btn-primary btn-block btn-morph" target="_blank" rel="noreferrer">Заказ берүү</a>
          </div>
        </div>
      </div>
    </section>
  )
}
