import Hero from './hero.jsx'

export default function App() {
  return (
    <>
      <nav aria-label="Main">
        <a className="brand" href="#top">Your Name</a>
        <div className="links">
          <a href="#projects">Projects</a>
          <a href="#about" className="hide-s">About</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <Hero />
    </>
  )
}