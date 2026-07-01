import Header from '../components/Header'
import Hero from '../components/Hero'
import TemplateGallery from '../components/TemplateGallery'
import PricingSection from '../components/PricingSection'
import ReviewsSection from '../components/ReviewsSection'
import FaqSection from '../components/FaqSection'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TemplateGallery />
        <PricingSection />
        <ReviewsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
