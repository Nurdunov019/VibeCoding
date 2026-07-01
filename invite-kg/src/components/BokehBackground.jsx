const ORBS = [
  { w: 120, t: '12%', l: '8%', dur: 14, delay: 0, dx: 18, dy: -24, o: 0.35 },
  { w: 80, t: '22%', l: '72%', dur: 11, delay: 1.2, dx: -22, dy: 16, o: 0.28 },
  { w: 160, t: '58%', l: '18%', dur: 16, delay: 0.6, dx: 14, dy: -18, o: 0.22 },
  { w: 96, t: '68%', l: '78%', dur: 13, delay: 2, dx: -16, dy: 20, o: 0.3 },
  { w: 64, t: '38%', l: '48%', dur: 10, delay: 0.8, dx: 10, dy: -12, o: 0.25 },
  { w: 140, t: '82%', l: '52%', dur: 15, delay: 1.5, dx: -12, dy: -20, o: 0.2 },
]

export default function BokehBackground({ className = '', variant = 'light' }) {
  return (
    <div className={`bokeh-bg bokeh-bg--${variant}${className ? ` ${className}` : ''}`} aria-hidden>
      {ORBS.map((orb, i) => (
        <span
          key={i}
          className="bokeh-orb"
          style={{
            width: orb.w,
            height: orb.w,
            top: orb.t,
            left: orb.l,
            opacity: orb.o,
            '--dur': `${orb.dur}s`,
            '--delay': `${orb.delay}s`,
            '--dx': `${orb.dx}px`,
            '--dy': `${orb.dy}px`,
          }}
        />
      ))}
    </div>
  )
}
