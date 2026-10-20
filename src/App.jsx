import { useEffect, useState } from 'react'
import Hero from './hero.jsx'
import Projects from './Projects.jsx'
import About from './About.jsx'
import Contact from './Contact.jsx'

export default function App() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const [active, setActive] = useState('top')

  // one scroll listener: highlights the nav link for the section you're in
  // and fills the thin progress line under the nav (--sp, 0 to 1)
  useEffect(() => {
    const ids = ['top', 'about', 'projects', 'contact']
    const root = document.documentElement
    let raf = 0

    function update() {
      raf = 0
      const max = root.scrollHeight - innerHeight
      root.style.setProperty('--sp', max > 0 ? Math.min(scrollY / max, 1).toFixed(3) : '0')

      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= innerHeight * 0.4) current = id
      }
      setActive(current)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }

    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    update()
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      
<nav className={`nav${open ? ' open' : ''}`} aria-label="Main navigation">
  <a className="nav-brand" href="#top" aria-label="Home" onClick={close}>
    aakanksha<span>.</span>
  </a>

  <button
    className="nav-toggle"
    type="button"
    aria-label="Toggle menu"
    aria-expanded={open}
    onClick={() => setOpen(o => !o)}
  >
    <i />
    <i />
  </button>

  <div className="nav-right">
    <div className="nav-links">
      <a className={active === 'top' ? 'active' : ''} href="#top" onClick={close}>Home</a>
      <a className={active === 'about' ? 'active' : ''} href="#about" onClick={close}>About</a>
      <a className={active === 'projects' ? 'active' : ''} href="#projects" onClick={close}>Projects</a>
      <a className={active === 'contact' ? 'active' : ''} href="#contact" onClick={close}>Contact</a>
    </div>

    <a className="nav-cta" href="#contact" onClick={close}>
      Let’s Talk <span aria-hidden="true">↗</span>
    </a>
  </div>
</nav>


      <Hero />
      <About />
      <Projects />
      <Contact />
    </>
  )
}