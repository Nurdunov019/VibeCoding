import { SITE } from '../config/site'
import BokehBackground from './BokehBackground'
import LetterReveal from './LetterReveal'
import ParallaxLayer from './ParallaxLayer'
import Reveal from './Reveal'
import StaggerReveal from './StaggerReveal'

const heroEvents = [
  { icon: '💍', label: 'үйлөнүү' },
  { icon: '🎂', label: 'туулган күн' },
  { icon: '🏢', label: 'корпоратив' },
  { icon: '🎀', label: 'gender party' },
  { icon: '✨', label: 'мастер-класс' },
]

export default function Hero() {
  return (
    <section className="hero hero--video">
      <ParallaxLayer className="hero-media" speed={0.08} aria-hidden>
        <video
          className="hero-video hero-video--ken-burns"
          autoPlay
          muted
          loop
          playsInline
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23f7f0e8' width='800' height='600'/%3E%3C/svg%3E"
        >
          <source src={SITE.heroVideo} type="video/mp4" />
        </video>
        <div className="hero-video-overlay" />
      </ParallaxLayer>
      <div className="hero-bg">
        <BokehBackground variant="light" />
        <div className="hero-blob hero-blob--1" />
        <div className="hero-blob hero-blob--2" />
        <div className="hero-grain" />
      </div>
      <ParallaxLayer className="container hero-inner" speed={0.12}>
        <p className="hero-eyebrow fade-in" style={{ '--fade-delay': '0ms' }}>{SITE.eyebrow}</p>
        <h1 className="hero-title">
          <LetterReveal text="Сайт " delay={80} />
          <LetterReveal text="чакыруу" className="hero-title-accent" delay={200} />
        </h1>
        <p className="hero-subtitle fade-in" style={{ '--fade-delay': '280ms' }}>онлайн чакыруу сайттары</p>
        <Reveal variant="blur" delay={360} className="hero-lead-wrap">
          <p className="hero-lead">
            Үйлөнүү, туулган күн, корпоратив жана башка иш-чаралар үчүн кооз мобилдик чакыруулар.
            Шаблон тандаңыз — биз сизге жеке сайт даярдайбыз.
          </p>
        </Reveal>
        <StaggerReveal className="hero-actions" delay={420} step={90}>
          <a href="#templates" className="btn btn-primary btn-morph hover-lift">Шаблондорду көрүү</a>
          <a href="#contact" className="btn btn-ghost btn-morph hover-lift">Заказ берүү</a>
        </StaggerReveal>
        <StaggerReveal as="ul" className="event-types" delay={500} step={70}>
          {heroEvents.map((t) => (
            <li key={t.label} className="hover-scale hover-lift">
              <span className="event-icon" aria-hidden>{t.icon}</span>
              {t.label}
            </li>
          ))}
        </StaggerReveal>
      </ParallaxLayer>
    </section>
  )
}
