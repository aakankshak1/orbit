import './Effects.css'

// A glowing bridge that sits on the boundary between two sections,
// so the page flows instead of stopping at hard edges.
export default function Seam({ label }) {
  return (
    <div className="seam" aria-hidden="true">
      <span className="seam-line"><i /></span>
      <span className="seam-tag"><b />{label}</span>
    </div>
  )
}
