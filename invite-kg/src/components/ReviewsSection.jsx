import { reviews } from '../data/reviews'

export default function ReviewsSection() {
  return (
    <section id="reviews" className="section section-reviews">
      <div className="container">
        <div className="section-head">
          <p className="section-eyebrow">Пикирлер</p>
          <h2>Бизди тандагандар эмне дейт</h2>
        </div>
        <div className="reviews-grid">
          {reviews.map((r) => (
            <article key={r.name} className="review-card">
              <div className="review-stars" aria-label={`${r.stars} жылдыз`}>
                {'★'.repeat(r.stars)}
              </div>
              <p className="review-text">«{r.text}»</p>
              <footer>
                <strong>{r.name}</strong>
                <span className="muted">{r.event}</span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
