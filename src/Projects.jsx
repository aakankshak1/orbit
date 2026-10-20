import { useEffect, useRef } from 'react'
import { projects, slug } from './projects.js'

const BARS = [38, 62, 48, 80, 56, 92, 70, 84]
const LINES = [72, 46, 88, 32, 64, 52, 78]
const TABS = [86, 64, 78, 52]

function Visual({ kind, image }) {
  if (image) {
    return (
      <div className="proj-visual">
        <img src={image} alt="" loading="lazy" />
      </div>
    )
  }

  return (
    <div className="proj-visual" aria-hidden="true">
      <div className="win">
        <div className="win-bar"><i /><i /><i /></div>

        {kind === 'bars' && (
          <div className="win-bars">
            {BARS.map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}
          </div>
        )}

        {kind === 'lines' && (
          <div className="win-lines">
            {LINES.map((w, i) => <span key={i} style={{ width: `${w}%` }} />)}
          </div>
        )}

        {kind === 'tabs' && (
          <div className="win-tabs">
            {TABS.map((w, i) => (
              <div key={i}><b /><span style={{ width: `${w}%` }} /></div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Projects() {
  const rootRef = useRef(null)

  // reveal the title and cards as they scroll into view
  useEffect(() => {
    const root = rootRef.current
    if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const items = root.querySelectorAll('.projects-title, .proj')
    items.forEach((el, i) => {
      el.classList.add('reveal')
      // small stagger so the right-hand card lands just after the left one
      el.style.setProperty('--d', i > 1 && i % 2 === 1 ? '0.12s' : '0s')
    })

    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        // add when it comes into view, remove once it's fully out, so it replays every time
        if (e.intersectionRatio >= 0.15) e.target.classList.add('is-in')
        else if (!e.isIntersecting) e.target.classList.remove('is-in')
      }),
      { threshold: [0, 0.15], rootMargin: '0px 0px -8% 0px' }
    )
    items.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="trans" ref={rootRef}>
    <div className="trans-aura" aria-hidden="true" />
    <section className="projects" id="projects">
      <h2 className="projects-title">things i’ve built</h2>

      <div className="projects-grid">
        {projects.map((p, i) => (
          <article
            className={`proj${i === 0 ? ' proj--wide' : ''}`}
            id={`project-${slug(p.name)}`}
            key={p.name}
          >
            <div className="proj-copy">
              <h3>{p.name}</h3>
              <p>{p.pitch}</p>
              <ul className="proj-tags">
                {p.tags.map(t => <li key={t}>{t}</li>)}
              </ul>
              <a className="proj-btn" href={p.href ?? '#projects'}>
                Read more <span aria-hidden="true">↗</span>
              </a>
            </div>

            <Visual kind={p.kind} image={p.image} />
          </article>
        ))}
      </div>
    </section>
    </div>
  )
}
