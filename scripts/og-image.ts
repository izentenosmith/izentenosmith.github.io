// Renders the link-preview image (public/og.png, 1200×630). Run with `pnpm og`
// after changing the name, title or tagline in src/content/profile.ts.
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'
import { profile } from '../src/content/profile.ts'

// The geist package only exports its Next.js entry points, so read the TTFs by path.
const fonts = fileURLToPath(new URL('../node_modules/geist/dist/fonts', import.meta.url))

const WIDTH = 1200
const HEIGHT = 630

/** Greedy word wrap; good enough for a fixed-width headline. */
function wrap(text: string, maxChars: number) {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(' ')) {
    if (line && `${line} ${word}`.length > maxChars) {
      lines.push(line)
      line = word
    } else {
      line = line ? `${line} ${word}` : word
    }
  }
  return [...lines, line]
}

const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const tagline = wrap(profile.tagline, 52)
  .map((line, index) => `<tspan x="80" dy="${index === 0 ? 0 : 44}">${escape(line)}</tspan>`)
  .join('')

const dots = Array.from({ length: 12 * 7 }, (_, index) => {
  const x = 820 + (index % 12) * 28
  const y = 60 + Math.floor(index / 12) * 28
  return `<circle cx="${x}" cy="${y}" r="1.6" fill="#2a2a2a" />`
}).join('')

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="100%" height="100%" fill="#0a0a0a" />
  ${dots}
  <rect x="80" y="80" width="64" height="64" rx="14" fill="#fafafa" />
  <text x="112" y="122" text-anchor="middle" font-family="Geist Mono" font-weight="700" font-size="26" fill="#0a0a0a">IZ</text>
  <circle cx="86" cy="236" r="7" fill="#3fd1c1" />
  <text x="104" y="244" font-family="Geist Mono" font-size="24" fill="#a3a3a3">${escape(profile.title)} · ${escape(profile.location)}</text>
  <text x="80" y="330" font-family="Geist" font-weight="600" font-size="72" fill="#fafafa" letter-spacing="-1.5">${escape(profile.name)}</text>
  <text x="80" y="400" font-family="Geist" font-size="32" fill="#d4d4d4">${tagline}</text>
  <rect x="80" y="${HEIGHT - 84}" width="${WIDTH - 160}" height="1" fill="#262626" />
  <text x="80" y="${HEIGHT - 44}" font-family="Geist Mono" font-size="22" fill="#3fd1c1">izentenosmith.github.io</text>
  <text x="${WIDTH - 80}" y="${HEIGHT - 44}" text-anchor="end" font-family="Geist Mono" font-size="22" fill="#737373">CV · Blog · Contact</text>
</svg>`

const png = new Resvg(svg, {
  font: {
    loadSystemFonts: false,
    fontFiles: [
      path.join(fonts, 'geist-sans/Geist-Regular.ttf'),
      path.join(fonts, 'geist-sans/Geist-SemiBold.ttf'),
      path.join(fonts, 'geist-mono/GeistMono-Regular.ttf'),
      path.join(fonts, 'geist-mono/GeistMono-Bold.ttf'),
    ],
    defaultFontFamily: 'Geist',
  },
}).render()

await writeFile(new URL('../public/og.png', import.meta.url), png.asPng())
console.log(`wrote public/og.png (${png.width}×${png.height})`)
