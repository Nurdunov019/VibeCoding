import { useEffect, useState } from 'react'
import BokehBackground from '../BokehBackground'
import LetterReveal from '../LetterReveal'

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
    }, 800)
  }

  if (!visible) return null

  return (
    <div className={`w-inv-intro${opening ? ' w-inv-intro--out' : ''}`}>
      <BokehBackground variant="warm" />
      <div className="w-inv-intro-inner fade-in">
        <p className="w-inv-intro-tag">
          <LetterReveal text="приглашение" delay={100} />
        </p>
        <h1 className="w-inv-intro-names">
          <LetterReveal text={groom} delay={200} />
          <span className="w-inv-intro-amp">
            <LetterReveal text="&" delay={350} />
          </span>
          <LetterReveal text={bride} delay={450} />
        </h1>
        <div className="w-inv-intro-line w-inv-intro-line--draw" aria-hidden />
        <button type="button" className="w-inv-intro-open btn-morph" onClick={handleOpen}>
          <span className="btn-morph-label">открыть</span>
        </button>
      </div>
    </div>
  )
}
