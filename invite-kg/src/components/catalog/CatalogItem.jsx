import { Link } from 'react-router-dom'
import { orderWhatsapp } from '../../config/site'
import Reveal from '../Reveal'
import TemplatePreviewArt from './TemplatePreviewArt'

export default function CatalogItem({ template, revealDelay = 0 }) {
  const priceLabel = `${template.price.toLocaleString('ru-RU')}`

  return (
    <Reveal as="article" className="catalog-item hover-scale" delay={revealDelay}>
      <div className="catalog-card">
        <div className="catalog-phone">
          <div className="catalog-phone-shell">
            <div className="catalog-phone-island" aria-hidden />
            <div className="catalog-phone-screen img-zoom-wrap hover-zoom">
              <div className="img-zoom catalog-preview-zoom">
                <TemplatePreviewArt style={template.style} featured={template.featured} />
              </div>
            </div>
          </div>
          <div className="catalog-phone-shadow" aria-hidden />
        </div>
      </div>

      <div className="catalog-item-label">
        <span>{template.name}</span>
        <span className="catalog-item-sep">|</span>
        <span className="catalog-item-price">{priceLabel}</span>
      </div>

      <div className="catalog-item-actions catalog-item-actions--stack">
        {template.preview ? (
          <Link to={template.preview} className="catalog-btn catalog-btn--view hover-lift">
            Көрүү
          </Link>
        ) : (
          <button type="button" className="catalog-btn catalog-btn--view" disabled>
            Жакында
          </button>
        )}
        <a
          href={orderWhatsapp(template.name)}
          className="catalog-btn catalog-btn--order hover-lift"
          target="_blank"
          rel="noreferrer"
        >
          Заказ
        </a>
      </div>
    </Reveal>
  )
}
