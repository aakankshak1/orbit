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

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// Cards: a spotlight that follows the mouse, and a gentle 3D tilt.
function tilt(e) {
  if (e.pointerType !== 'mouse' || reduceMotion()) return
  const c = e.currentTarget
  const r = c.getBoundingClientRect()
  const x = e.clientX - r.left
  const y = e.clientY - r.top
  c.style.setProperty('--px', `${x}px`)
  c.style.setProperty('--py', `${y}px`)
  c.style.setProperty('--rx', `${(y / r.height - 0.5) * -9}deg`)
  c.style.setProperty('--ry', `${(x / r.width - 0.5) * 9}deg`)
}
function untilt(e) {
  const c = e.currentTarget
  c.style.setProperty('--rx', '0deg')
  c.style.setProperty('--ry', '0deg')
}

export default function Contact() {
  const rootRef = useRef(null)
  const canvasRef = useRef(null)

  // fade-up reveal (replays every time you scroll to it)
  useEffect(() => {
    const root = rootRef.current
    if (!root || reduceMotion()) return

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

  // constellation: drifting nodes joined by lines, reacting to the mouse
  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const calm = reduceMotion()
    let w = 0, h = 0, nodes = [], raf = 0, inView = true
    const pointer = { x: 0, y: 0, on: false }

    const build = () => {
      const r = root.getBoundingClientRect()
      w = r.width
      h = r.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(w < 700 ? 38 : 80, Math.round((w * h) / 16000))
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.4 + 0.7,
        pink: i % 4 === 0,
      }))
    }

    const draw = () => {
      const link = w < 700 ? 110 : 150
      const reach = 190
      ctx.clearRect(0, 0, w, h)

      for (const n of nodes) {
        if (!calm) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < 0 || n.x > w) n.vx *= -1
          if (n.y < 0 || n.y > h) n.vy *= -1
          if (pointer.on) {
            // nodes lean gently toward the cursor
            const dx = pointer.x - n.x, dy = pointer.y - n.y
            if (dx * dx + dy * dy < reach * reach) { n.x += dx * 0.003; n.y += dy * 0.003 }
          }
        }
      }

      ctx.lineWidth = 0.8
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < link * link) {
            ctx.strokeStyle = `rgba(229,195,209,${(1 - Math.sqrt(d2) / link) * 0.3})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
        if (pointer.on) {
          const dx = a.x - pointer.x, dy = a.y - pointer.y
          const d2 = dx * dx + dy * dy
          if (d2 < reach * reach) {
            ctx.strokeStyle = `rgba(239,121,138,${(1 - Math.sqrt(d2) / reach) * 0.7})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(pointer.x, pointer.y)
            ctx.stroke()
          }
        }
      }

      for (const n of nodes) {
        let r = n.r
        if (pointer.on) {
          const dx = n.x - pointer.x, dy = n.y - pointer.y
          if (dx * dx + dy * dy < reach * reach) r *= 1.6
        }
        ctx.fillStyle = n.pink ? 'rgba(247,169,168,.9)' : 'rgba(229,195,209,.8)'
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = () => { draw(); raf = requestAnimationFrame(loop) }
    const update = () => {
      cancelAnimationFrame(raf)
      raf = 0
      if (calm) { draw(); return }
      if (inView && !document.hidden) raf = requestAnimationFrame(loop)
    }

    const onMove = e => {
      const r = root.getBoundingClientRect()
      pointer.x = e.clientX - r.left
      pointer.y = e.clientY - r.top
      pointer.on = e.pointerType === 'mouse'
      if (calm) draw()
    }
    const onLeave = () => { pointer.on = false; if (calm) draw() }

    build()
    update()
    const ro = new ResizeObserver(() => { build(); if (calm) draw() })
    ro.observe(root)
    const io = new IntersectionObserver(([en]) => { inView = en.isIntersecting; update() })
    io.observe(root)
    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', update)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', update)
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
              onPointerMove={tilt}
              onPointerLeave={untilt}
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
