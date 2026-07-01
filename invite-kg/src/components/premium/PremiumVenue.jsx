import Reveal from '../Reveal'

export default function PremiumVenue({ venue }) {
  return (
    <section id="pr-venue" className="pr-section">
      <Reveal variant="blur">
        <h2 className="pr-section-title">Орун</h2>
      </Reveal>
      <Reveal variant="fade" delay={80}>
        <div className="pr-venue-card pr-panel pr-panel--glass">
          <div className="pr-venue-map-wrap map-fade">
            <iframe
              title="Карта"
              src={venue.mapEmbed}
              className="pr-venue-map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <span className="pr-venue-pin pin-bounce" aria-hidden>📍</span>
          </div>
          <div className="pr-venue-info">
            <h3>{venue.name}</h3>
            <p>{venue.address}</p>
            <a href={venue.mapUrl} className="pr-btn pr-btn--outline magnetic-btn" target="_blank" rel="noreferrer">
              Google Maps
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
