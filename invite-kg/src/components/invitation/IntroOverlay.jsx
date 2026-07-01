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
    }, 800)
  }

  if (!visible) return null

  return (
    <div className={`w-inv-intro${opening ? ' w-inv-intro--out' : ''}`}>
      <div className="w-inv-intro-inner">
        <p className="w-inv-intro-tag">приглашение</p>
        <h1 className="w-inv-intro-names">
          {groom}
          <span className="w-inv-intro-amp">&</span>
          {bride}
        </h1>
        <div className="w-inv-intro-line" aria-hidden />
        <button type="button" className="w-inv-intro-open" onClick={handleOpen}>
          открыть
        </button>
      </div>
    </div>
  )
}
