import Reveal from '../Reveal'

export default function PremiumInstagram({ instagram }) {
  return (
    <section id="pr-instagram" className="pr-section">
      <Reveal variant="blur">
        <h2 className="pr-section-title">Instagram</h2>
        <a href={instagram.url} className="pr-hashtag magnetic-btn" target="_blank" rel="noreferrer">
          {instagram.hashtag}
        </a>
      </Reveal>
      <div className="pr-insta-grid">
        {instagram.photos.map((src, i) => (
          <Reveal key={src} delay={i * 70} variant="fade">
            <a href={instagram.url} className="pr-insta-item img-reveal-wrap" target="_blank" rel="noreferrer">
              <img src={src} alt="" loading="lazy" className="pr-insta-img img-reveal img-reveal--loaded" />
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
