import Header from '../components/Header'
import Hero from '../components/Hero'
import TemplateGallery from '../components/catalog/TemplateGallery'
import QuickOrderSection from '../components/QuickOrderSection'
import PricingSection from '../components/PricingSection'
import ReviewsSection from '../components/ReviewsSection'
import FaqSection from '../components/FaqSection'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'
import Reveal from '../components/Reveal'

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TemplateGallery />
        <Reveal>
          <QuickOrderSection />
        </Reveal>
        <Reveal delay={80} variant="blur">
          <PricingSection />
        </Reveal>
        <Reveal delay={80} variant="fade">
          <ReviewsSection />
        </Reveal>
        <Reveal delay={80} variant="blur">
          <FaqSection />
        </Reveal>
        <Reveal delay={80}>
          <ContactSection />
        </Reveal>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
