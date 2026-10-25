// Renders every brand asset from one source of truth: the IZS mark below and
// the profile in src/content/profile.ts. Run with `pnpm brand` after changing
// either. Writes favicon.svg, PNG app icons, site.webmanifest and og.png.
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import { profile } from '../src/content/profile.ts'

const root = fileURLToPath(new URL('..', import.meta.url))
const publicDir = path.join(root, 'public')
// The geist package only exports its Next.js entry points, so read the TTFs by path.
const fonts = path.join(root, 'node_modules/geist/dist/fonts')

const INK = '#0a0a0b'
const PAPER = '#fafafa'
const ELECTRIC = '#4d8dff'

/** IZS drawn as strokes on a 64×64 grid, so it never depends on a font. */
const letters = `
  <g fill="none" stroke="${PAPER}" stroke-width="5.5" stroke-linecap="butt" stroke-linejoin="miter">
    <path d="M10.5 19 H21.5 M16 19 V45 M10.5 45 H21.5" />
    <path d="M25 19 H39 L25 45 H39" />
    <path d="M54 22 C51.5 19 43.8 18.6 43.8 25 C43.8 31.6 54.2 30.2 54.2 37.6 C54.2 44.6 46.4 45.6 42.8 42.4" />
  </g>
  <rect x="10.5" y="50.5" width="43.7" height="3" rx="1.5" fill="${ELECTRIC}" />`

/** The mark on its tile. `inset` shrinks it for maskable icons' safe zone. */
function markSvg(size: number, { radius = 14, inset = 0 } = {}) {
  const scale = (64 - inset * 2) / 64
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="${radius}" fill="${INK}" />
  <g transform="translate(${inset} ${inset}) scale(${scale})">${letters}</g>
</svg>`
}

const render = (svg: string, width?: number) =>
  new Resvg(svg, {
    fitTo: width ? { mode: 'width', value: width } : { mode: 'original' },
    font: {
      loadSystemFonts: false,
      fontFiles: [
        path.join(fonts, 'geist-sans/Geist-Regular.ttf'),
        path.join(fonts, 'geist-sans/Geist-SemiBold.ttf'),
        path.join(fonts, 'geist-mono/GeistMono-Regular.ttf'),
      ],
      defaultFontFamily: 'Geist',
    },
  })
    .render()
    .asPng()

async function icons() {
  await writeFile(path.join(publicDir, 'favicon.svg'), markSvg(64))
  await writeFile(path.join(publicDir, 'favicon-32.png'), render(markSvg(64), 32))
  await writeFile(path.join(publicDir, 'icon-192.png'), render(markSvg(64), 192))
  await writeFile(path.join(publicDir, 'icon-512.png'), render(markSvg(64), 512))
  // Square, no transparency: iOS and Android apply their own masks.
  await writeFile(path.join(publicDir, 'apple-touch-icon.png'), render(markSvg(64, { radius: 0, inset: 6 }), 180))
  await writeFile(path.join(publicDir, 'icon-maskable-512.png'), render(markSvg(64, { radius: 0, inset: 10 }), 512))

  const manifest = {
    name: profile.name,
    short_name: 'IZS',
    start_url: '/',
    display: 'browser',
    background_color: '#09090b',
    theme_color: '#09090b',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
  await writeFile(path.join(publicDir, 'site.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`)
}

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

async function previewImage() {
  const W = 1200
  const H = 630
  const avatar = await sharp(await readFile(path.join(root, 'src/assets/avatar.webp')))
    .resize(360, 360)
    .png()
    .toBuffer()

  const tagline = wrap(profile.tagline, 40)
    .map((line, index) => `<tspan x="80" dy="${index === 0 ? 0 : 42}">${escape(line)}</tspan>`)
    .join('')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="100%" height="100%" fill="#09090b" />
  <svg x="80" y="72" width="72" height="72" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="14" fill="#18181b" stroke="#27272a" />${letters}
  </svg>
  <circle cx="87" cy="222" r="7" fill="#34d399" />
  <text x="106" y="230" font-family="Geist Mono" font-size="23" fill="#a1a1aa">${escape(profile.title)} · ${escape(profile.location)}</text>
  <text x="80" y="318" font-family="Geist" font-weight="600" font-size="62" fill="${PAPER}" letter-spacing="-1.5">${escape(profile.name)}</text>
  <text x="80" y="384" font-family="Geist" font-size="30" fill="#d4d4d8">${tagline}</text>
  <defs><clipPath id="photo"><rect x="770" y="135" width="350" height="350" rx="28" /></clipPath></defs>
  <image x="770" y="135" width="350" height="350" clip-path="url(#photo)" href="data:image/png;base64,${avatar.toString('base64')}" />
  <rect x="770" y="135" width="350" height="350" rx="28" fill="none" stroke="#27272a" stroke-width="2" />
  <rect x="80" y="${H - 84}" width="${W - 160}" height="1" fill="#27272a" />
  <text x="80" y="${H - 44}" font-family="Geist Mono" font-size="22" fill="${ELECTRIC}">izentenosmith.github.io</text>
  <text x="${W - 80}" y="${H - 44}" text-anchor="end" font-family="Geist Mono" font-size="22" fill="#a1a1aa">CV · Blog · Contact</text>
</svg>`

  await writeFile(path.join(publicDir, 'og.png'), render(svg))
}

await icons()
await previewImage()
console.log('wrote favicon.svg, favicon-32.png, icon-192/512, apple-touch-icon, maskable icon, site.webmanifest, og.png')
