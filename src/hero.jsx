import { useEffect, useRef, useState } from 'react'

const STATS = [
  ['03', 'Projects in orbit'],
  ['React', 'Primary stack'],
  ['∞', 'Curiosity'],
]

function Orbit({ n, layer }) {
  return (
    <div className={`sp-orbit sp-orbit--${n} sp-orbit--${layer}`} aria-hidden="true">
      <div className="sp-orbit-spin"><span className="sp-sat" /></div>
    </div>
  )
}

export default function Hero() {
  const canvasRef = useRef(null)
  const [sec, setSec] = useState(0)

  // mission clock
  useEffect(() => {
    const id = setInterval(() => setSec(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const clock = [(sec / 3600) | 0, ((sec / 60) | 0) % 60, sec % 60]
    .map(n => String(n).padStart(2, '0')).join(':')

  // starfield + shooting stars
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const colors = ['#e5c3d1', '#f7a9a8', '#7d82b8', '#ffffff']
    let w = 0, h = 0, stars = [], shooters = [], raf = 0, t = 0
    let tx = 0, ty = 0, mx = 0, my = 0

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.round((w * h) / 5500)
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        z: Math.random() * 0.9 + 0.1,
        tw: Math.random() * Math.PI * 2,
        c: colors[(Math.random() * colors.length) | 0],
      }))
      if (reduce) draw()
    }

    function draw() {
      t += 0.016
      mx += (tx - mx) * 0.05; my += (ty - my) * 0.05
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        ctx.globalAlpha = reduce ? 0.7 : 0.3 + 0.7 * Math.abs(Math.sin(t * s.z * 1.5 + s.tw))
        ctx.fillStyle = s.c
        const r = s.z * 1.6
        ctx.fillRect(s.x + mx * 26 * s.z, s.y + my * 26 * s.z, r, r)
      }
      if (!reduce && Math.random() < 0.006 && shooters.length < 2) {
        shooters.push({
          x: w * 0.2 + Math.random() * w * 0.8, y: Math.random() * h * 0.4,
          vx: -(6 + Math.random() * 4), vy: 3 + Math.random() * 2, life: 1,
        })
      }
      shooters = shooters.filter(s => s.life > 0)
      for (const s of shooters) {
        const ex = s.x - s.vx * 9, ey = s.y - s.vy * 9
        const g = ctx.createLinearGradient(s.x, s.y, ex, ey)
        g.addColorStop(0, '#ef798a'); g.addColorStop(1, 'rgba(239,121,138,0)')
        ctx.globalAlpha = s.life
        ctx.strokeStyle = g; ctx.lineWidth = 1.6
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(ex, ey); ctx.stroke()
        s.x += s.vx; s.y += s.vy; s.life -= 0.02
      }
      ctx.globalAlpha = 1
      if (!reduce) raf = requestAnimationFrame(draw)
    }

    const onMove = e => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5 }
    window.addEventListener('pointermove', onMove)
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    if (!reduce) draw()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <header className="sp" id="top">
      <canvas className="sp-stars" ref={canvasRef} aria-hidden="true" />
      <div className="sp-nebula" aria-hidden="true" />
      <div className="sp-grid" aria-hidden="true" />
      <div className="sp-scan" aria-hidden="true" />
      <div className="sp-frame" aria-hidden="true"><i /><i /><i /><i /></div>

      <div className="sp-copy">
        <p className="sp-tag"><span className="sp-pulse" />Sys.online // Sector 07</p>

        <h1 className="sp-title">
          <span className="sp-hi">// Hi, I’m</span>
          <span className="sp-name" data-text="Your Name">Aakanksha</span>
        </h1>

        <h2 className="sp-role">Frontend developer <b>//</b> Interface engineer</h2>

        <p className="sp-body">
          I design and build interfaces that feel fast, look sharp, and behave
          like they were engineered for zero gravity. Pick a mission below to
          see what I’ve shipped.
        </p>

        <div className="sp-cta">
          <a className="sp-btn" href="#projects"><span>Explore projects</span><i aria-hidden="true">↓</i></a>
          <a className="sp-btn sp-btn--ghost" href="#contact"><span>Open comms</span></a>
        </div>

        <ul className="sp-stats">
          {STATS.map(([v, l]) => (
            <li key={l}><b>{v}</b><span>{l}</span></li>
          ))}
        </ul>
      </div>

      <div className="sp-scene" aria-hidden="true">
        <div className="sp-reticle" />
        <div className="sp-reticle sp-reticle--b" />

        <Orbit n={3} layer="back" />
        <Orbit n={2} layer="back" />
        <Orbit n={1} layer="back" />

        <div className="sp-planet">
          <div className="sp-clouds" />
          <div className="sp-lat" />
          <div className="sp-shade" />
        </div>

        <Orbit n={3} layer="front" />
        <Orbit n={2} layer="front" />
        <Orbit n={1} layer="front" />

        <span className="sp-call sp-call--a">ORB-01<em>Project One · 2.1 AU</em></span>
        <span className="sp-call sp-call--b">ORB-02<em>Project Two · 2.7 AU</em></span>
      </div>

      <div className="sp-hud">
        <span>Mission clock <b>T+ {clock}</b></span>
        <a href="#projects">Scroll to dock ↓</a>
      </div>
    </header>
  )
}