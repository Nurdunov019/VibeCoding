import { useMemo, useState } from 'react'
import { chunkTemplates, eventTypes, introBlocks, templates } from '../../data/templates'
import { orderWhatsapp } from '../../config/site'
import CatalogItem from './CatalogItem'
import IntroPreviewArt from './IntroPreviewArt'

export default function TemplateGallery() {
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return templates
    return templates.filter((t) => t.event === filter)
  }, [filter])

  const rows = chunkTemplates(filtered, 3)

  return (
    <>
      <section id="templates" className="catalog-section">
        <div className="catalog-section-head">
          <h2 className="catalog-title">Шаблондор</h2>
          <p className="catalog-note">
            * Макет номери жана баасы телефондун үстүндө көрсөтүлгөн
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

        <div className="catalog-rows">
          {rows.map((row, rowIdx) => (
            <div key={row.map((t) => t.id).join('-')} className="catalog-row">
              {rowIdx > 0 && rowIdx % 2 === 0 && (
                <div className="catalog-row-divider" aria-hidden>
                  <span>Шаблондор</span>
                </div>
              )}
              <div className="catalog-row-grid">
                {row.map((t) => (
                  <CatalogItem key={t.id} template={t} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="intro-blocks" className="catalog-section catalog-section--intro">
        <div className="catalog-section-head">
          <h2 className="catalog-title">Кирүү блоктору</h2>
          <p className="catalog-note muted">Анимациялуу ачылыш — конверт, аттар, конфетти, музыка</p>
        </div>
        <div className="intro-catalog-grid">
          {introBlocks.map((b) => (
            <article key={b.id} className="intro-catalog-item">
              <div className="intro-catalog-label">
                <span>{b.name}</span>
                <span className="catalog-item-sep">|</span>
                <span>{b.price} сом</span>
              </div>
              <div className="intro-catalog-preview">
                <IntroPreviewArt style={b.style} />
              </div>
              <div className="catalog-item-actions">
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
