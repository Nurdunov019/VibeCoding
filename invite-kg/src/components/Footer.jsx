import { SITE } from '../config/site'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p className="footer-brand">{SITE.name}</p>
        <p>© {new Date().getFullYear()} — {SITE.tagline}</p>
        <p className="muted footer-note">Мобилдик чакыруу сайттары · Бишкек, Кыргызстан</p>
      </div>
    </footer>
  )
}
