// Edit this list to change the project cards.
// kind: 'bars' | 'lines' | 'tabs'  -> picks the little preview graphic
// image: optional path to a screenshot (e.g. '/projects/drug-agent.png', put the file in /public)
// href:  link for the "read more" button (GitHub repo, demo, case study...)
export const projects = [
  {
    name: 'Drug-Agent',
    pitch:
      'A molecular property prediction pipeline built around a two-agent LLM design.',
    tags: ['machine learning', 'llm agents'],
    kind: 'bars',
    image: null,
    href: null,
  },
  {
    name: 'Process Supervisor',
    pitch:
      'A small C daemon that watches your programs and restarts them when they crash.',
    tags: ['c', 'systems'],
    kind: 'lines',
    image: null,
    href: null,
  },
  {
    name: 'Tab Tamer',
    pitch:
      'A calm, privacy-first Chrome extension for keeping your tabs under control.',
    tags: ['chrome extension', 'privacy'],
    kind: 'tabs',
    image: null,
    href: null,
  },
]

// 'Process Supervisor' -> 'process-supervisor' (used for in-page links)
export const slug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
