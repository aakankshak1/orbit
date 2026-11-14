import { useEffect, useRef } from 'react'
import { projects, slug } from './projects.js'

function Orbit({ n, layer }) {
  return (
    <div className={`sp-orbit sp-orbit--${n} sp-orbit--${layer}`} aria-hidden="true">
      <div className="sp-orbit-spin" />
    </div>
  )
}

export default function Hero() {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const callRefs = useRef([])

  // project labels ride the rings. Same maths the CSS rings use (rotate, then
  // perspective + rotateX), so each label stays exactly on its ring.
  useEffect(() => {
    const scene = sceneRef.current
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const ROT = (-16 * Math.PI) / 180
    const TILT = (72 * Math.PI) / 180
    const PERSP = 1400
    // d = ring size (% of scene), dur = seconds per lap, a = start angle
    const rides = [
      { d: 0.8, dur: 50, a: 2.4 },
      { d: 0.98, dur: 75, a: 4.9 },
      { d: 1.16, dur: 105, a: 0.6 },
    ]
    const paused = [false, false, false]
    const cleanups = []
    callRefs.current.forEach((el, i) => {
      if (!el) return
      const on = () => { paused[i] = true }
      const off = () => { paused[i] = false }
      el.addEventListener('pointerenter', on)
      el.addEventListener('pointerleave', off)
      el.addEventListener('focus', on)
      el.addEventListener('blur', off)
      cleanups.push(() => {
        el.removeEventListener('pointerenter', on)
        el.removeEventListener('pointerleave', off)
        el.removeEventListener('focus', on)
        el.removeEventListener('blur', off)
      })
    })

    function place() {
      const W = scene.clientWidth
      rides.forEach((r, i) => {
        const el = callRefs.current[i]
        if (!el) return
        const rad = (r.d * W) / 2
        const x = rad * Math.cos(r.a)
        const y0 = rad * Math.sin(r.a)
        const y = y0 * Math.cos(TILT)
        const z = y0 * Math.sin(TILT)
        const s = PERSP / (PERSP - z)
        const px = x * s
        const py = y * s
        const X = px * Math.cos(ROT) - py * Math.sin(ROT)
        const Y = px * Math.sin(ROT) + py * Math.cos(ROT)
        const front = Math.sin(r.a) > 0
        el.style.transform =
          `translate(${(W / 2 + X).toFixed(1)}px, ${(W / 2 + Y).toFixed(1)}px) translate(-50%, -115%) scale(${s.toFixed(3)})`
        el.style.zIndex = front ? '3' : '-1'
        el.style.opacity = (0.65 + 0.35 * ((Math.sin(r.a) + 1) / 2)).toFixed(2)
      })
    }

    place()
    let raf = 0
    if (!reduce) {
      let last = performance.now()
      const tick = (now) => {
        const dt = Math.min((now - last) / 1000, 0.1)
        last = now
        rides.forEach((r, i) => {
          if (!paused[i]) r.a += (dt * Math.PI * 2) / r.dur
        })
        place()
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    addEventListener('resize', place)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', place)
      cleanups.forEach((fn) => fn())
    }
  }, [])

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

  // scroll progress through the hero (0 at top, 1 when it has fully scrolled away).
  // CSS reads it as --hp to drive the fade/parallax in index.css.
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.documentElement
    const hero = document.getElementById('top')
    let raf = 0

    function update() {
      raf = 0
      const p = Math.min(Math.max(scrollY / hero.offsetHeight, 0), 1)
      root.style.setProperty('--hp', p.toFixed(3))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }

    addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      root.style.removeProperty('--hp')
    }
  }, [])

  return (
    <header className="sp" id="top">
      <canvas className="sp-stars" ref={canvasRef} aria-hidden="true" />
      <div className="sp-nebula" aria-hidden="true" />
      <div className="sp-scan" aria-hidden="true" />

      <div className="sp-copy">
        <h1 className="sp-title">
          <span className="sp-hi">// Hi, I’m</span>
          <span className="sp-name" data-text="Your Name" id="name">Aakanksha</span>
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
      </div>

      <div className="sp-scene" ref={sceneRef}>
        <Orbit n={3} layer="back" />
        <Orbit n={2} layer="back" />
        <Orbit n={1} layer="back" />

        <div className="sp-planet" aria-hidden="true">
          <div className="sp-clouds" />
          <div className="sp-lat" />
          <div className="sp-shade" />
        </div>

        <Orbit n={3} layer="front" />
        <Orbit n={2} layer="front" />
        <Orbit n={1} layer="front" />

        {projects.slice(0, 3).map((p, i) => (
          <a
            key={p.name}
            ref={(el) => { callRefs.current[i] = el }}
            className="sp-call sp-call--ride"
            style={{ '--rc': ['#ef798a', '#e5c3d1', '#9aa0d6'][i] }}
            href={`#project-${slug(p.name)}`}
          >
            {p.name}<em>{p.tags[0]}</em>
          </a>
        ))}
      </div>

      <div className="sp-hud">
        <a href="#projects">Scroll to dock ↓</a>
      </div>
    </header>
  )
}

