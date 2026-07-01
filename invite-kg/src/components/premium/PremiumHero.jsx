import LetterReveal from '../LetterReveal'
import MusicToggle from '../MusicToggle'
import ParallaxLayer from '../ParallaxLayer'

export default function PremiumHero({ data }) {
  const scrollDown = () => {
    document.getElementById('pr-invite')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="pr-hero" className="pr-hero">
      <div
        className="pr-hero-bg img-zoom--slow"
        style={{ '--cover-image': `url("${data.coverImage}")` }}
        role="img"
        aria-label="Свадебное фото"
      />
      <div className="pr-hero-overlay" />
      <div className="pr-hero-glass" />

      <ParallaxLayer className="pr-hero-content" speed={0.1}>
        <p className="pr-hero-date fade-in">
          <LetterReveal text={data.dateShort} delay={0} />
        </p>
        <h1 className="pr-hero-names blur-reveal-on-load">
          <LetterReveal text={data.groom} delay={100} />
          <span className="pr-hero-amp">&</span>
          <LetterReveal text={data.bride} delay={250} />
        </h1>
        <p className="pr-hero-quote fade-in" style={{ '--fade-delay': '500ms' }}>
          {data.heroQuote}
        </p>
      </ParallaxLayer>

      <div className="pr-hero-tools">
        <MusicToggle className="pr-music-btn" />
      </div>

      <button type="button" className="pr-scroll-indicator" onClick={scrollDown} aria-label="Төмөн жылдыруу">
        <span className="pr-scroll-indicator-mouse" />
        <span className="pr-scroll-indicator-text">Scroll</span>
      </button>
    </section>
  )
}
