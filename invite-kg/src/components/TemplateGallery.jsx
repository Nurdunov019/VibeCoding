import { Link } from 'react-router-dom'
import { introBlocks, templates } from '../data/templates'
import { orderWhatsapp } from '../config/site'

function TemplateCard({ t }) {
  return (
    <article className="template-card">
      <div className="phone-frame">
        <div className="phone-notch" aria-hidden />
        <div className="template-preview">
          <div className={`template-mock template-mock--${t.tag}`}>
            <span className="template-mock-deco" aria-hidden>✦</span>
            <span className="template-mock-names">А & А</span>
            <span className="template-mock-date">15 · 08 · 2026</span>
          </div>
        </div>
        <span className="template-price">{t.name} · {t.price.toLocaleString('ru-RU')} сом</span>
      </div>
      <div className="template-actions">
        {t.preview ? (
          <Link to={t.preview} className="btn btn-ghost btn-sm">Көрүү</Link>
        ) : (
          <button type="button" className="btn btn-ghost btn-sm" disabled>Жакында</button>
        )}
        <a href={orderWhatsapp(t.name)} className="btn btn-primary btn-sm" target="_blank" rel="noreferrer">Заказ</a>
      </div>
    </article>
  )
}

export default function TemplateGallery() {
  return (
    <section id="templates" className="section">
      <div className="container">
        <div className="section-head">
          <p className="section-eyebrow">Каталог</p>
          <h2>Шаблондор</h2>
          <p className="muted section-note">* Макет номери жана баасы карточканын үстүндө көрсөтүлгөн</p>
        </div>
        <div className="template-grid">
          {templates.map((t) => (
            <TemplateCard key={t.id} t={t} />
          ))}
        </div>

        <div className="section-head section-head--sub">
          <h3>Кирүү блоктору</h3>
          <p className="muted">Анимациялуу ачылыш — конверт, аттар, конфетти</p>
        </div>
        <div className="extras-grid">
          {introBlocks.map((b) => (
            <div key={b.id} className="extra-card">
              <strong>{b.name}</strong>
              <span>{b.price} сом</span>
              <a href={orderWhatsapp(b.name)} className="btn btn-ghost btn-sm" target="_blank" rel="noreferrer">Заказ</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
