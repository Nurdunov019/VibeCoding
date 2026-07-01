import SectionTitle from './SectionTitle'
import Reveal from './Reveal'

export default function Venue({ venue, dressColors, dressNote }) {
  return (
    <section id="wd-venue" className="wd-section wd-venue">
      <SectionTitle subtitle="Кайда өтөт">Орун</SectionTitle>

      <Reveal>
        <div className="wd-venue-card">
          <div className="wd-venue-map">
            <iframe
              title="Карта"
              src={venue.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="wd-venue-info">
            <h3>{venue.name}</h3>
            <p>{venue.address}</p>
            <a href={venue.mapUrl} target="_blank" rel="noreferrer" className="wd-btn wd-btn--outline">
              Google Maps
            </a>
          </div>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="wd-dress">
          <h3 className="wd-dress-title">Dress Code</h3>
          <div className="wd-dress-colors">
            {dressColors.map((color) => (
              <span key={color} className="wd-dress-dot" style={{ '--c': color }} title={color} />
            ))}
          </div>
          <p className="wd-dress-note">{dressNote}</p>
        </div>
      </Reveal>
    </section>
  )
}
