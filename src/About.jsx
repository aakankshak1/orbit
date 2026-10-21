import { useEffect, useRef, useState } from 'react'
import './About.css'

// Your photo lives in the /public folder. If it's missing, a gradient shows instead.
const PHOTO = '/aakanksha.jpeg'

// Edit the text here.
const LEAD =
  'I love coding and building stuff that scratches a part of my brain and triggers my creativity.'

const PARAGRAPHS = [
  'Something that hasn’t been built yet, something that would help people ease their day to day tasks. And honestly, as an engineer, that’s what I want to do: take ideas that live in my head and turn them into something real that makes someone’s life a little easier.',
  'I want to contribute my share to software engineering by building products that people actually use, not just products that exist. Ngl, it’s actually really fun, and it’s what makes my work worth it.',
]

const BEYOND = [
  'Outside of tech, I’m into crypto, music, art, and Rubik’s cubes, which is a slightly random combination, but that’s kind of the point.',
  'Apart from that, I love exploring nature and gardening. As for sports, I love playing table tennis and badminton.',
]

// These scroll across the screen. Add or remove names freely.
const STACK = [
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'Tailwind CSS',
  'Vite',
  'Python',
  'C',
  'C++',
  'Java',
  'MySQL',
  'JSON',
  'Pandas',
  'Scikit-learn',
  'RDKit',
  'APIs',
  'Git & GitHub',
  'Linux',
  'Vim',
]

export default function About() {
  const rootRef = useRef(null)
  const [hasPhoto, setHasPhoto] = useState(true)

  // fade the blocks up as they scroll into view (replays every time)
  useEffect(() => {
    const root = rootRef.current
    if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const items = root.querySelectorAll(
      '.ab2-title, .ab2-intro .ab2-text, .ab2-tile, .ab2-marquee'
    )
    items.forEach((el, i) => {
      el.classList.add('reveal')
      el.style.setProperty('--d', `${(i % 3) * 0.1}s`)
    })

    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.intersectionRatio >= 0.2) e.target.classList.add('is-in')
        else if (!e.isIntersecting) e.target.classList.remove('is-in')
      }),
      { threshold: [0, 0.2], rootMargin: '0px 0px -6% 0px' }
    )
    items.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section className="about2" id="about" ref={rootRef}>
      <div className="ab2-bg" aria-hidden="true" />

      <div className="ab2-main">
        {/* photo on the left edge of the screen, fading into the background */}
        <div className="ab2-photo">
          {hasPhoto ? (
            <img
              src={PHOTO}
              alt="Portrait of Aakanksha"
              draggable={false}
              onError={() => setHasPhoto(false)}
            />
          ) : (
            <div className="ab2-ph" aria-hidden="true" />
          )}
        </div>

        <div className="ab2-content">
          <div className="ab2-intro">
            <h2 className="ab2-title">about me</h2>
            <div className="ab2-text">
              {[LEAD, ...PARAGRAPHS].map(p => <p key={p}>{p}</p>)}
            </div>
          </div>

          <article className="ab2-tile ab2-tile--beyond">
            <h3 className="ab2-h3">beyond the screen</h3>
            <div className="ab2-text">
              {BEYOND.map(p => <p key={p}>{p}</p>)}
            </div>
          </article>
        </div>
      </div>

      {/* tech stack scrolls across the whole screen like a ticker */}
      <div className="ab2-marquee">
        <ul className="ab2-track" aria-label="Tech stack">
          {[...STACK, ...STACK].map((t, i) => (
            <li
              key={i}
              className={(i % STACK.length) % 2 ? 'is-solid' : undefined}
              aria-hidden={i >= STACK.length ? 'true' : undefined}
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
