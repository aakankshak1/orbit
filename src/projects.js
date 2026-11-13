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
    href: 'https://github.com/aakankshak1/Drug-Agent',
  },
  {
    name: 'Process Supervisor',
    pitch:
      'A small C daemon that watches your programs and restarts them when they crash.',
    tags: ['c', 'systems'],
    kind: 'lines',
    image: null,
    href: 'https://github.com/aakankshak1/process-supervisor',
  },
  {
    name: 'TidyStack',
    pitch:
      'A Chrome extension that keeps your tabs tidy: group them by topic, catch duplicates, and send idle ones to the graveyard.',
    tags: ['chrome extension'],
    kind: 'tabs',
    image: '/tidystack_image.png',
    href: 'https://github.com/aakankshak1/TidyStack',
  },
]

// 'Process Supervisor' -> 'process-supervisor' (used for in-page links)
export const slug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
