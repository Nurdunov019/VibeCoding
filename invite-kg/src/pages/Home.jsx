import { useEffect, useState } from 'react'
import { weddingInvitation } from '../data/weddingInvitation'
import { useWeddingTheme } from '../context/WeddingThemeContext'
import Petals from '../components/wedding/Petals'
import Nav from '../components/wedding/Nav'
import Hero from '../components/wedding/Hero'
import Countdown from '../components/wedding/Countdown'
import Story from '../components/wedding/Story'
import Program from '../components/wedding/Program'
import Venue from '../components/wedding/Venue'
import Gallery from '../components/wedding/Gallery'
import RsvpForm from '../components/wedding/RsvpForm'
import Footer from '../components/wedding/Footer'
import MusicToggle from '../components/MusicToggle'

export default function Home() {
  const data = weddingInvitation
  const { setTheme } = useWeddingTheme()
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    setTheme('day')
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    document.body.classList.add('wedding-maket-open')
    document.documentElement.classList.add('wedding-maket-active')
    return () => {
      document.body.classList.remove('wedding-maket-open')
      document.documentElement.classList.remove('wedding-maket-active')
    }
  }, [setTheme])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleOpen = () => {
    setOpened(true)
    window.setTimeout(() => scrollTo('wd-countdown'), 400)
  }

  return (
    <div className="wd-page">
      <Petals />
      <Nav opened={opened} />
      <div className="wd-music-float">
        <MusicToggle />
      </div>

      <Hero data={data} onOpen={handleOpen} />

      {opened && (
        <>
          <Countdown targetDate={data.date} />
          <Story photos={data.storyPhotos} timeline={data.timeline} />
          <Program items={data.program} />
          <Venue
            venue={data.venue}
            dressColors={data.dressColors}
            dressNote={data.dressNote}
          />
          <Gallery images={data.gallery} />
          <RsvpForm storageKey={data.rsvpStorageKey} />
          <Footer data={data} onNav={scrollTo} />
        </>
      )}
    </div>
  )
}
