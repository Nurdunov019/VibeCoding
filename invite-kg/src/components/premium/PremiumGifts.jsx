import Reveal from '../Reveal'

export default function PremiumGifts({ gifts }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent('https://chakyruu.kg')}`

  return (
    <section id="pr-gifts" className="pr-section pr-panel">
      <Reveal variant="fade">
        <h2 className="pr-section-title">Белектер</h2>
        <p className="pr-section-sub">{gifts.note}</p>
        <div className="pr-qr-card hover-lift card-float">
          <img src={qrUrl} alt={gifts.qrLabel} className="pr-qr-img" width={160} height={160} loading="lazy" />
          <span className="pr-qr-label">{gifts.qrLabel}</span>
        </div>
      </Reveal>
    </section>
  )
}
