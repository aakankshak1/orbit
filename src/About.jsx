import { useEffect, useRef, useState } from 'react'

// Put your photo in the /public folder with this name (or change the name here).
// If the file isn't there yet, the planet shows instead.
const PHOTO = '/aakanksha.jpeg'

// Edit the text here. Everything below comes from your projects and hero copy,
// so change anything that doesn't sound like you.
const LEAD =
  'Frontend developer and interface engineer. I like building things that feel fast, look sharp and stay out of the way.'

const PARAGRAPHS = [
  'React is my primary stack. I care about the details people feel without noticing: how a page loads, how it moves, and how it behaves on a small screen.',
  'Beyond the browser, I’ve built a molecular property prediction pipeline around two LLM agents, a small C daemon that restarts crashed programs, and a privacy-first Chrome extension for taming tabs.',
]

const STACK = ['React', 'C', 'Chrome extensions', 'LLM agents', 'Machine learning']

function Ring({ layer }) {
  return (
    <div className={`ab-orbit ab-orbit--${layer}`} aria-hidden="true">
      <i />
    </div>
  )
}

export default function About() {
  const rootRef = useRef(null)
  const [hasPhoto, setHasPhoto] = useState(true)

  // fade the text blocks up as the section scrolls into view
  useEffect(() => {
    const root = rootRef.current
    if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const items = root.querySelectorAll('.ab-title, .ab-lead, .ab-text, .ab-stack')
    items.forEach((el, i) => {
      el.classList.add('reveal')
      el.style.setProperty('--d', `${i * 0.1}s`)
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

  return (
    <section className="about-sec" id="about" ref={rootRef}>
      <div className="ab-card">
        <div className="ab-art">
          {hasPhoto ? (
            <img
              className="ab-photo"
              src={PHOTO}
              alt="Portrait of Aakanksha"
              onError={() => setHasPhoto(false)}
            />
          ) : (
            <>
              <Ring layer="back" />
              <div className="ab-planet" aria-hidden="true" />
              <Ring layer="front" />
            </>
          )}
        </div>

        <div className="ab-body">
          <h2 className="ab-title">About me.</h2>

          <div className="ab-cols">
            <p className="ab-lead">{LEAD}</p>
            <div className="ab-text">
              {PARAGRAPHS.map(p => <p key={p}>{p}</p>)}
            </div>
          </div>

          <div className="ab-stack">
            <h3 className="ab-stack-title">My tech stack.</h3>
            <ul aria-label="Technologies">
              {STACK.map(s => <li key={s}>{s}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
