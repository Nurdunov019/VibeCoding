import { useEffect, useState } from 'react'

export default function IntroOverlay({ groom, bride, onOpen }) {
  const [visible, setVisible] = useState(true)
  const [opening, setOpening] = useState(false)

  useEffect(() => {
    document.body.classList.add('invitation-open')
    return () => document.body.classList.remove('invitation-open')
  }, [])

  const handleOpen = () => {
    setOpening(true)
    setTimeout(() => {
      setVisible(false)
      onOpen?.()
    }, 900)
  }

  if (!visible) return null

  return (
    <div className={`inv-intro${opening ? ' inv-intro--opening' : ''}`}>
      <div className="inv-intro-envelope" aria-hidden>
        <div className="inv-intro-flap" />
        <div className="inv-intro-body" />
      </div>
      <p className="inv-intro-text">Сизге чакыруу келди</p>
      <h1 className="inv-intro-names">{groom} & {bride}</h1>
      <button type="button" className="inv-intro-btn" onClick={handleOpen}>
        Ачуу
      </button>
    </div>
  )
}
