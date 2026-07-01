/** Rich CSS mini-invitation preview inside phone frame (weddinv-style catalog art). */
export default function TemplatePreviewArt({ style, featured }) {
  return (
    <div className={`preview-art preview-art--${style}${featured ? ' preview-art--featured' : ''}`}>
      <div className="preview-art-scroll">
        <div className="preview-art-hero">
          <span className="preview-art-eyebrow">үйлөнүүгө чакыруу</span>
          <span className="preview-art-names">Алмаз</span>
          <span className="preview-art-amp">&</span>
          <span className="preview-art-names">Айзада</span>
          <span className="preview-art-date">15 · 08 · 2026</span>
        </div>
        <div className="preview-art-photo" aria-hidden />
        <div className="preview-art-countdown">
          <span><b>42</b><small>күн</small></span>
          <span><b>08</b><small>саат</small></span>
          <span><b>24</b><small>мүн</small></span>
        </div>
        <div className="preview-art-block">
          <span className="preview-art-block-title">Программа</span>
          <span className="preview-art-line" />
          <span className="preview-art-line preview-art-line--short" />
        </div>
        <div className="preview-art-rsvp">RSVP</div>
      </div>
      {featured && <span className="preview-art-badge">Демо</span>}
    </div>
  )
}
