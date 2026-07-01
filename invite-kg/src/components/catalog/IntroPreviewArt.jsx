export default function IntroPreviewArt({ style }) {
  return (
    <div className={`intro-art intro-art--${style}`}>
      {style === 'envelope' && (
        <>
          <div className="intro-art-envelope" />
          <span>Ачуу</span>
        </>
      )}
      {style === 'curtain' && (
        <>
          <div className="intro-art-curtain intro-art-curtain--l" />
          <div className="intro-art-curtain intro-art-curtain--r" />
          <span className="intro-art-names">А & А</span>
        </>
      )}
      {style === 'fade' && (
        <span className="intro-art-fade-text">Сизге чакыруу</span>
      )}
      {style === 'music' && (
        <>
          <span className="intro-art-music">♫</span>
          <span className="intro-art-fade-text">А & А</span>
        </>
      )}
      {style === 'confetti' && (
        <>
          <span className="intro-art-confetti" aria-hidden>✦ ✧ ✦</span>
          <span>Куттуктоолор!</span>
        </>
      )}
    </div>
  )
}
