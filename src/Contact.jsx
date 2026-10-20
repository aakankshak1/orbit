import { useEffect, useRef } from 'react'
import './Contact.css'

// Put your real links and handles here. Delete a line to remove that card.
const EMAIL = 'you@example.com'

const SOCIALS = [
  { name: 'LinkedIn', handle: 'in/your-handle', url: 'https://www.linkedin.com/in/your-handle', icon: 'linkedin' },
  { name: 'GitHub', handle: '@your-handle', url: 'https://github.com/your-handle', icon: 'github' },
  { name: 'Instagram', handle: '@your-handle', url: 'https://www.instagram.com/your-handle', icon: 'instagram' },
  // email card (hidden if EMAIL is empty)
  ...(EMAIL ? [{ name: 'Email', handle: EMAIL, url: `mailto:${EMAIL}`, icon: 'mail' }] : []),
]

function Icon({ name }) {
  if (name === 'mail') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 8 8 6 8-6" />
      </svg>
    )
  }
  if (name === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    )
  }
  if (name === 'github') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function Contact() {
  const rootRef = useRef(null)
  const canvasRef = useRef(null)

  // same fade-up reveal as the About section
  useEffect(() => {
    const root = rootRef.current
    if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const items = root.querySelectorAll('.ct-kicker, .ct-title, .ct-lead, .ct-card, .ct-actions')
    items.forEach((el, i) => {
      el.classList.add('reveal')
      el.style.setProperty('--d', `${i * 0.08}s`)
    })

    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        // add when it comes into view, remove once it's fully out, so it replays every time
        if (e.intersectionRatio >= 0.2) e.target.classList.add('is-in')
        else if (!e.isIntersecting) e.target.classList.remove('is-in')
      }),
      { threshold: [0, 0.2], rootMargin: '0px 0px -6% 0px' }
    )
    items.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  // interactive constellation behind the heading: drifting stars that link up with each other,
  // reach toward the cursor / finger, and a click or tap adds a new star
  useEffect(() => {
    const canvas = canvasRef.current
    const sec = rootRef.current
    if (!canvas || !sec) return
    const ctx = canvas.getContext('2d')
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
    const COLORS = ['229,195,209', '239,121,138', '125,130,184']
    const mouse = { x: -9999, y: -9999 }
    let w = 0, h = 0, link = 120, reach = 180, target = 40
    let nodes = [], raf = 0, visible = true, t = 0

    const make = (x, y, burst = 0) => {
      const a = Math.random() * Math.PI * 2
      const s = burst || Math.random() * 0.22 + 0.04
      return {
        x: x ?? Math.random() * w, y: y ?? Math.random() * h,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s,
        r: Math.random() * 1.3 + 0.8,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        tw: Math.random() * Math.PI * 2,
      }
    }

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      w = sec.clientWidth
      h = sec.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // everything scales with the screen: fewer, tighter links on phones
      link = Math.max(80, Math.min(150, w / 9))
      reach = link * 1.5
      target = Math.min(110, Math.max(26, Math.round((w * h) / 13000)))
      if (nodes.length > target + 20) nodes.length = target + 20
      while (nodes.length < target) nodes.push(make())
      nodes.forEach(p => { p.x = Math.min(p.x, w); p.y = Math.min(p.y, h) })
      draw()
    }

    function step() {
      for (const p of nodes) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y
        const d = Math.hypot(dx, dy)
        if (d < reach && d > 1) {
          // gentle pull toward the pointer, but never right on top of it
          const f = (1 - d / reach) * 0.035 * (d > 60 ? 1 : -1)
          p.vx += (dx / d) * f
          p.vy += (dy / d) * f
        }
        const sp = Math.hypot(p.vx, p.vy)
        if (sp > 0.7) { p.vx *= 0.7 / sp; p.vy *= 0.7 / sp }
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) { p.vx *= -1; p.x = Math.min(Math.max(p.x, 0), w) }
        if (p.y < 0 || p.y > h) { p.vy *= -1; p.y = Math.min(Math.max(p.y, 0), h) }
      }
      // extra stars from clicks slowly fade back out so it never gets crowded
      if (nodes.length > target && t % 90 === 0) nodes.shift()
    }

    function draw() {
      ctx.clearRect(0, 0, w, h)

      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < link) {
            ctx.strokeStyle = `rgba(229,195,209,${((1 - d / link) * 0.28).toFixed(3)})`
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y)
        if (dm < reach) {
          ctx.strokeStyle = `rgba(239,121,138,${((1 - dm / reach) * 0.6).toFixed(3)})`
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke()
        }
      }

      for (const p of nodes) {
        const tw = calm ? 0.8 : 0.55 + 0.45 * Math.sin(t * 0.03 + p.tw)
        ctx.fillStyle = `rgba(${p.c},${tw.toFixed(3)})`
        ctx.shadowColor = `rgba(${p.c},.8)`
        ctx.shadowBlur = 8
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
      }
      ctx.shadowBlur = 0
    }

    function frame() {
      raf = 0
      t++
      step()
      draw()
      if (visible && !calm) raf = requestAnimationFrame(frame)
    }
    const start = () => { if (!raf && visible && !calm) raf = requestAnimationFrame(frame) }

    const setPointer = e => {
      const r = sec.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      if (calm) draw()
    }
    const clearPointer = () => { mouse.x = mouse.y = -9999; if (calm) draw() }
    const addStar = e => {
      if (e.target.closest && e.target.closest('a, button')) return
      setPointer(e)
      nodes.push(make(mouse.x, mouse.y, 0.5))
      if (calm) draw()
    }

    sec.addEventListener('pointermove', setPointer, { passive: true })
    sec.addEventListener('pointerleave', clearPointer)
    sec.addEventListener('pointerup', e => { if (e.pointerType === 'touch') clearPointer() })
    sec.addEventListener('pointerdown', addStar)

    const ro = new ResizeObserver(resize)
    ro.observe(sec)
    // only animate while the section is on screen
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start() })
    io.observe(sec)

    resize()
    start()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      sec.removeEventListener('pointermove', setPointer)
      sec.removeEventListener('pointerleave', clearPointer)
      sec.removeEventListener('pointerdown', addStar)
    }
  }, [])

  return (
    <section className="contact-sec" id="contact" ref={rootRef}>
      <canvas className="ct-constellation" ref={canvasRef} aria-hidden="true" />
      <div className="ct-inner">
        <h2 className="ct-title">let’s connect<span>.</span></h2>
        <p className="ct-lead">
          Open to frontend internships and collaborations. Say hi on any of these, or send me an email.
        </p>

        <div className="ct-grid">
          {SOCIALS.map(s => (
            <a
              key={s.name}
              className="ct-card"
              href={s.url}
              {...(s.url.startsWith('https://') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              aria-label={`${s.name}, ${s.handle}${s.url.startsWith('https://') ? ' (opens in a new tab)' : ''}`}
            >
              <span className="ct-icon"><Icon name={s.icon} /></span>
              <span className="ct-name">{s.name}</span>
              <span className="ct-handle">{s.handle}</span>
              <span className="ct-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>

      </div>

      <div className="ct-foot">
        <span>© 2026 aakanksha.</span>
        <a href="#top">back to top ↑</a>
      </div>
    </section>
  )
}
