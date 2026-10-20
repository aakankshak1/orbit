import { useEffect, useRef } from 'react'
import './Effects.css'

// Page-wide effects: a soft light that follows the cursor, a light film grain,
// and a spotlight that tracks the mouse across project and contact cards.
export default function Effects() {
  const glow = useRef(null)

  useEffect(() => {
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = glow.current
    if (!fine || calm || !el) return

    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, seen = false

    const tick = () => {
      x += (tx - x) * 0.14
      y += (ty - y) * 0.14
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0
    }

    const onMove = e => {
      tx = e.clientX
      ty = e.clientY
      if (!seen) { x = tx; y = ty; seen = true }
      el.style.opacity = '1'
      if (!raf) raf = requestAnimationFrame(tick)

      const card = e.target.closest ? e.target.closest('.proj, .ct-card') : null
      if (card) {
        const r = card.getBoundingClientRect()
        card.style.setProperty('--px', `${e.clientX - r.left}px`)
        card.style.setProperty('--py', `${e.clientY - r.top}px`)
      }
    }
    const onLeave = () => { el.style.opacity = '0' }

    addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div className="fx-cursor" ref={glow} aria-hidden="true" />
      <div className="fx-grain" aria-hidden="true" />
    </>
  )
}
