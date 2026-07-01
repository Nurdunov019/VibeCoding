import { Link } from 'react-router-dom'
import { orderWhatsapp } from '../../config/site'
import TemplatePreviewArt from './TemplatePreviewArt'

export default function CatalogItem({ template }) {
  const priceLabel = `${template.price.toLocaleString('ru-RU')}`

  return (
    <article className="catalog-item">
      <div className="catalog-item-label">
        <span>{template.name}</span>
        <span className="catalog-item-sep">|</span>
        <span className="catalog-item-price">{priceLabel} сом</span>
      </div>

      <div className="catalog-phone">
        <div className="catalog-phone-shell">
          <div className="catalog-phone-island" aria-hidden />
          <div className="catalog-phone-screen">
            <TemplatePreviewArt style={template.style} featured={template.featured} />
          </div>
        </div>
        <div className="catalog-phone-shadow" aria-hidden />
      </div>

      <div className="catalog-item-actions">
        {template.preview ? (
          <Link to={template.preview} className="catalog-btn catalog-btn--view">
            Көрүү
          </Link>
        ) : (
          <button type="button" className="catalog-btn catalog-btn--view" disabled>
            Жакында
          </button>
        )}
        <a
          href={orderWhatsapp(template.name)}
          className="catalog-btn catalog-btn--order"
          target="_blank"
          rel="noreferrer"
        >
          Заказ
        </a>
      </div>
    </article>
  )
}
