import { useEffect, useRef, useState } from 'react'
import { MUSIC_STORAGE_KEY, WEDDING_TRACKS } from '../data/weddingMusic'

function getStoredTrackId() {
  try {
    const stored = localStorage.getItem(MUSIC_STORAGE_KEY)
    if (stored && WEDDING_TRACKS.some((track) => track.id === stored)) return stored
  } catch {
    /* ignore */
  }
  return WEDDING_TRACKS[0].id
}

export default function MusicToggle({ className = '' }) {
  const audioRef = useRef(null)
  const widgetRef = useRef(null)
  const playingRef = useRef(false)
  const [trackId, setTrackId] = useState(getStoredTrackId)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [listOpen, setListOpen] = useState(false)

  const activeTrack = WEDDING_TRACKS.find((track) => track.id === trackId) ?? WEDDING_TRACKS[0]

  useEffect(() => {
    try {
      localStorage.setItem(MUSIC_STORAGE_KEY, trackId)
    } catch {
      /* ignore */
    }
  }, [trackId])

  useEffect(() => {
    const wasPlaying = playingRef.current
    const audio = new Audio(activeTrack.url)
    audio.loop = true
    audio.volume = 0.35
    audio.preload = 'metadata'
    audioRef.current = audio
    setReady(false)

    const onReady = () => setReady(true)
    audio.addEventListener('canplaythrough', onReady, { once: true })

    if (wasPlaying) {
      audio.play().then(() => {
        playingRef.current = true
        setPlaying(true)
      }).catch(() => {
        playingRef.current = false
        setPlaying(false)
      })
    }

    return () => {
      audio.removeEventListener('canplaythrough', onReady)
      audio.pause()
      audio.src = ''
    }
  }, [activeTrack.url])

  useEffect(() => {
    if (!listOpen) return undefined

    const onPointerDown = (event) => {
      if (!widgetRef.current?.contains(event.target)) setListOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setListOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [listOpen])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return
    try {
      if (playing) {
        audio.pause()
        playingRef.current = false
        setPlaying(false)
      } else {
        await audio.play()
        playingRef.current = true
        setPlaying(true)
      }
    } catch {
      playingRef.current = false
      setPlaying(false)
    }
  }

  const selectTrack = async (nextId) => {
    if (nextId === trackId) {
      setListOpen(false)
      return
    }
    playingRef.current = true
    setPlaying(true)
    setTrackId(nextId)
    setListOpen(false)
  }

  return (
    <div
      ref={widgetRef}
      className={`music-widget${listOpen ? ' music-widget--open' : ''}${className ? ` ${className}` : ''}`}
    >
      <div className="music-widget-controls">
        <button
          type="button"
          className={`music-toggle${playing ? ' music-toggle--on' : ''}`}
          onClick={togglePlay}
          aria-label={playing ? 'Музыканы өчүрүү' : 'Музыканы күйгүзүү'}
          aria-pressed={playing}
          disabled={!ready && !playing}
        >
          <span className="music-toggle-icon" aria-hidden>
            {playing ? '♫' : '♪'}
          </span>
        </button>
        <button
          type="button"
          className="music-toggle-picker"
          onClick={() => setListOpen((open) => !open)}
          aria-label="Мелодия тандоо"
          aria-expanded={listOpen}
          aria-haspopup="listbox"
        >
          ▾
        </button>
      </div>

      {playing && (
        <p className="music-widget-now" title={activeTrack.title}>
          {activeTrack.title}
        </p>
      )}

      {listOpen && (
        <ul className="music-track-list" role="listbox" aria-label="Той мелодиялары">
          {WEDDING_TRACKS.map((track) => (
            <li key={track.id}>
              <button
                type="button"
                role="option"
                aria-selected={track.id === trackId}
                className={`music-track-item${track.id === trackId ? ' music-track-item--active' : ''}`}
                onClick={() => selectTrack(track.id)}
              >
                <span className="music-track-item-title">{track.title}</span>
                <span className="music-track-item-sub">{track.subtitle}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
