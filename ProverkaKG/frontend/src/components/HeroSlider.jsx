import { useEffect, useState } from 'react'

const DEFAULT_SLIDES = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&h=700&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&h=700&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&h=700&fit=crop',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&h=700&fit=crop',
  'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1600&h=700&fit=crop',
]

const INTERVAL_MS = 5000

export default function HeroSlider({ images = [], children }) {
  const slides = [...new Set([...images.filter(Boolean), ...DEFAULT_SLIDES])].slice(0, 8)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return undefined
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="hero-banner">
      <div className="hero-slider" aria-hidden>
        {slides.map((src, i) => (
          <div
            key={src}
            className={`hero-slide ${i === index ? 'active' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
      <div className="hero-overlay" />
      <div className="hero-banner-content">
        {children}
      </div>
      {slides.length > 1 && (
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`hero-dot ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
