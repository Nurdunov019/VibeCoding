import Reveal from '../Reveal'

const LINKS = [
  { key: 'spotify', label: 'Spotify', icon: '♫' },
  { key: 'apple', label: 'Apple Music', icon: '♪' },
  { key: 'youtube', label: 'YouTube Music', icon: '▶' },
]

export default function PremiumPlaylist({ playlist }) {
  return (
    <section id="pr-playlist" className="pr-section pr-panel pr-panel--glass">
      <Reveal variant="blur">
        <div className="pr-disc-wrap">
          <span className="pr-disc disc-rotate" aria-hidden />
          <h2 className="pr-section-title">Playlist</h2>
        </div>
        <p className="pr-playlist-quote">«{playlist.title}»</p>
      </Reveal>
      <div className="pr-playlist-links">
        {LINKS.map((link, i) => (
          <Reveal key={link.key} delay={i * 80}>
            <a href={playlist[link.key]} className="pr-playlist-link hover-lift magnetic-btn" target="_blank" rel="noreferrer">
              <span aria-hidden>{link.icon}</span>
              {link.label}
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
