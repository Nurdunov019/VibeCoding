import { useEffect } from 'react'
import { premiumInvitation } from '../data/premiumInvitation'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { useSectionSpy } from '../hooks/useSectionSpy'
import ThemeToggle from '../components/ThemeToggle'
import MusicToggle from '../components/MusicToggle'
import PremiumAmbient from '../components/premium/PremiumAmbient'
import PremiumChrome from '../components/premium/PremiumChrome'
import PremiumHero from '../components/premium/PremiumHero'
import PremiumInvite from '../components/premium/PremiumInvite'
import PremiumCountdown from '../components/premium/PremiumCountdown'
import PremiumLoveStory from '../components/premium/PremiumLoveStory'
import PremiumGallery from '../components/premium/PremiumGallery'
import PremiumProgram from '../components/premium/PremiumProgram'
import PremiumVenue from '../components/premium/PremiumVenue'
import PremiumDressCode from '../components/premium/PremiumDressCode'
import PremiumWishes from '../components/premium/PremiumWishes'
import PremiumRsvp from '../components/premium/PremiumRsvp'
import PremiumGifts from '../components/premium/PremiumGifts'
import PremiumPlaylist from '../components/premium/PremiumPlaylist'
import PremiumInstagram from '../components/premium/PremiumInstagram'
import PremiumGuestBook from '../components/premium/PremiumGuestBook'
import PremiumFaq from '../components/premium/PremiumFaq'
import PremiumFooter from '../components/premium/PremiumFooter'

const SECTION_IDS = [
  'pr-hero', 'pr-invite', 'pr-countdown', 'pr-story', 'pr-gallery',
  'pr-program', 'pr-venue', 'pr-dress', 'pr-wishes', 'pr-rsvp',
]

export default function PremiumInvitationPage() {
  const data = premiumInvitation
  const progress = useScrollProgress()
  const activeSection = useSectionSpy(SECTION_IDS)

  useEffect(() => {
    document.body.classList.add('premium-open')
    const onMove = (e) => {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`)
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      document.body.classList.remove('premium-open')
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <div className="pr-page">
      <PremiumAmbient />
      <PremiumChrome progress={progress} activeSection={activeSection} />

      <div className="pr-floating-tools">
        <ThemeToggle />
        <MusicToggle />
      </div>

      <main className="pr-main">
        <PremiumHero data={data} />
        <PremiumInvite data={data} />
        <PremiumCountdown targetDate={data.date} />
        <PremiumLoveStory items={data.loveStory} />
        <PremiumGallery items={data.gallery} />
        <PremiumProgram items={data.program} />
        <PremiumVenue venue={data.venue} />
        <PremiumDressCode dressCode={data.dressCode} />
        <PremiumWishes wishes={data.wishes} />
        <PremiumRsvp deadline={data.rsvpDeadline} alcoholOptions={data.alcoholOptions} />
        <PremiumGifts gifts={data.gifts} />
        <PremiumPlaylist playlist={data.playlist} />
        <PremiumInstagram instagram={data.instagram} />
        <PremiumGuestBook guestBook={data.guestBook} />
        <PremiumFaq items={data.faq} />
        <PremiumFooter data={data} />
      </main>
    </div>
  )
}
