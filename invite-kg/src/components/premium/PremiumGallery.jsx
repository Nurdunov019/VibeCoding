import { useState } from 'react'
import Reveal from '../Reveal'

function GalleryImage({ item }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <figure className={`pr-gallery-item${item.tall ? ' pr-gallery-item--tall' : ''} img-reveal-wrap`}>
      <img
        src={item.src}
        alt=""
        loading="lazy"
        className={`pr-gallery-img img-reveal${loaded ? ' img-reveal--loaded' : ''}`}
        onLoad={() => setLoaded(true)}
      />
      <span className="pr-gallery-sweep" aria-hidden />
    </figure>
  )
}

export default function PremiumGallery({ items }) {
  return (
    <section id="pr-gallery" className="pr-section">
      <Reveal variant="blur" className="pr-gallery-head">
        <h2 className="pr-section-title">Фото галерея</h2>
        <p className="pr-section-sub">Pinterest стили</p>
      </Reveal>
      <div className="pr-gallery-masonry">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={i * 60} variant="fade">
            <GalleryImage item={item} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
