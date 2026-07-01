import { useEffect, useRef, useState } from 'react'
import { SITE } from '../config/site'

export default function MusicToggle({ className = '' }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const audio = new Audio(SITE.weddingMusic)
    audio.loop = true
    audio.volume = 0.35
    audio.preload = 'metadata'
    audioRef.current = audio
    audio.addEventListener('canplaythrough', () => setReady(true), { once: true })
    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return
    try {
      if (playing) {
        audio.pause()
        setPlaying(false)
      } else {
        await audio.play()
        setPlaying(true)
      }
    } catch {
      setPlaying(false)
    }
  }

  return (
    <button
      type="button"
      className={`music-toggle${playing ? ' music-toggle--on' : ''}${className ? ` ${className}` : ''}`}
      onClick={toggle}
      aria-label={playing ? 'Музыканы өчүрүү' : 'Музыканы күйгүзүү'}
      aria-pressed={playing}
      disabled={!ready && !playing}
    >
      <span className="music-toggle-icon" aria-hidden>
        {playing ? '♫' : '♪'}
      </span>
    </button>
  )
}
