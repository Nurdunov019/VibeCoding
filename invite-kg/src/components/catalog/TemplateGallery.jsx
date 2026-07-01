import { useMemo, useState } from 'react'
import { eventTypes, introBlocks, templates } from '../../data/templates'
import { orderWhatsapp } from '../../config/site'
import CatalogItem from './CatalogItem'
import IntroPreviewArt from './IntroPreviewArt'

export default function TemplateGallery() {
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return templates
    return templates.filter((t) => t.event === filter)
  }, [filter])

  return (
    <>
      <section id="templates" className="catalog-section">
        <div className="catalog-section-head">
          <h2 className="catalog-title">Шаблондор</h2>
          <p className="catalog-note">
            * Макет номери жана баасы төмөндө көрсөтүлгөн
          </p>
        </div>

        <div className="catalog-filters">
          {eventTypes.map((e) => (
            <button
              key={e.id}
              type="button"
              className={`catalog-filter${filter === e.id ? ' catalog-filter--active' : ''}`}
              onClick={() => setFilter(e.id)}
            >
              <span aria-hidden>{e.icon}</span>
              {e.label}
            </button>
          ))}
        </div>

        <div className="catalog-grid">
          {filtered.map((t) => (
            <CatalogItem key={t.id} template={t} />
          ))}
        </div>
      </section>

      <section id="intro-blocks" className="catalog-section catalog-section--intro">
        <div className="catalog-section-head">
          <h2 className="catalog-title">Кирүү блоктору</h2>
          <p className="catalog-note muted">Анимациялуу ачылыш — конверт, аттар, конфетти, музыка</p>
        </div>
        <div className="intro-catalog-grid catalog-grid catalog-grid--intro">
          {introBlocks.map((b) => (
            <article key={b.id} className="intro-catalog-item">
              <div className="catalog-card intro-catalog-card">
                <div className="intro-catalog-preview">
                  <IntroPreviewArt style={b.style} />
                </div>
              </div>
              <div className="catalog-item-label intro-catalog-label">
                <span>{b.name}</span>
                <span className="catalog-item-sep">|</span>
                <span>{b.price}</span>
              </div>
              <div className="catalog-item-actions catalog-item-actions--stack">
                <button type="button" className="catalog-btn catalog-btn--view" disabled>Көрүү</button>
                <a
                  href={orderWhatsapp(b.name)}
                  className="catalog-btn catalog-btn--order"
                  target="_blank"
                  rel="noreferrer"
                >
                  Заказ
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
