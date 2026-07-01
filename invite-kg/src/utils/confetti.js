/** Lightweight canvas confetti burst */
export function fireConfetti(durationMs = 2800) {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  canvas.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;width:100%;height:100%'
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  const resize = () => {
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()
  window.addEventListener('resize', resize)

  const colors = ['#c4a062', '#a04d5c', '#f5e6dc', '#8b9678', '#e8d4b0', '#ffffff']
  const particles = Array.from({ length: 120 }, () => ({
    x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 120,
    y: window.innerHeight * 0.55,
    vx: (Math.random() - 0.5) * 14,
    vy: -Math.random() * 16 - 4,
    w: 6 + Math.random() * 6,
    h: 4 + Math.random() * 4,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    color: colors[Math.floor(Math.random() * colors.length)],
    gravity: 0.35 + Math.random() * 0.15,
    life: 1,
  }))

  const start = performance.now()

  const frame = (now) => {
    const elapsed = now - start
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    let alive = 0
    for (const p of particles) {
      if (p.life <= 0) continue
      alive++
      p.vy += p.gravity
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.99
      p.rot += p.vr
      if (elapsed > durationMs * 0.6) p.life -= 0.018

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.globalAlpha = Math.max(0, p.life)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      ctx.restore()
    }

    if (elapsed < durationMs && alive > 0) {
      requestAnimationFrame(frame)
    } else {
      window.removeEventListener('resize', resize)
      canvas.remove()
    }
  }

  requestAnimationFrame(frame)
}
