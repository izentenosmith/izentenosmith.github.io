// Renders every brand asset from two sources of truth: the icon sheets in
// brand/ (one per site theme, as designed) and the profile in
// src/content/profile.ts. Run with `pnpm brand` after changing either. Writes
// the PNG app icons for both themes, the header badges, site.webmanifest and og.png.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import { profile } from '../src/content/profile.ts'

const root = fileURLToPath(new URL('..', import.meta.url))
const publicDir = path.join(root, 'public')
const badgeDir = path.join(root, 'src/assets/brand')
// The geist package only exports its Next.js entry points, so read the TTFs by path.
const fonts = path.join(root, 'node_modules/geist/dist/fonts')

const PAPER = '#fafafa'
const ELECTRIC = '#4d8dff'

type Box = { left: number; top: number; width: number; height: number }

/**
 * Where the largest (512) icon sits on each sheet, a few pixels wider than
 * the drawn edge so anti-aliasing survives the crop.
 */
const ELECTRIC_ICON: Box = { left: 513, top: 165, width: 550, height: 582 }
const OLD_MONEY_ICON: Box = { left: 872, top: 129, width: 462, height: 467 }

const luminance = (data: Buffer, i: number) => 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]

/**
 * The electric tile is a dark rounded square drawn on a light sheet. Each row
 * keeps everything between its first and last dark pixel (the tile and its
 * white letters); outside that span, how dark a pixel is becomes how opaque
 * it is, so the rounded corners stay smooth on any background. The result is
 * padded to a square rather than stretched, so the letters keep their shape.
 */
async function electricTile() {
  const { data, info } = await sharp(path.join(root, 'brand/electric-icons.jpg'))
    .extract(ELECTRIC_ICON)
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const paper = luminance(data, 0)
  // A pixel inside the tile, below the blue bar, holds the tile colour.
  const inkIndex = (Math.round(height * 0.9) * width + Math.round(width / 2)) * channels
  const ink = [data[inkIndex], data[inkIndex + 1], data[inkIndex + 2]]
  const inkLuminance = luminance(data, inkIndex)

  const rgba = Buffer.alloc(width * height * 4)
  for (let y = 0; y < height; y++) {
    let first = -1
    let last = -1
    for (let x = 0; x < width; x++) {
      if (luminance(data, (y * width + x) * channels) < 128) {
        if (first < 0) first = x
        last = x
      }
    }
    for (let x = 0; x < width; x++) {
      const from = (y * width + x) * channels
      const to = (y * width + x) * 4
      if (x >= first && x <= last) {
        rgba.set([data[from], data[from + 1], data[from + 2], 255], to)
      } else {
        const coverage = (paper - luminance(data, from)) / (paper - inkLuminance)
        rgba.set([...ink, Math.round(Math.min(1, Math.max(0, coverage)) * 255)], to)
      }
    }
  }

  const side = Math.max(width, height)
  const tile = await sharp(rgba, { raw: { width, height, channels: 4 } })
    .extend({
      left: Math.floor((side - width) / 2),
      right: Math.ceil((side - width) / 2),
      top: Math.floor((side - height) / 2),
      bottom: Math.ceil((side - height) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()
  return { tile, ink: `#${ink.map((c) => c.toString(16).padStart(2, '0')).join('')}` }
}

/** The old money emblem is a square bronze frame, so a tight crop is the icon. */
const oldMoneyTile = () =>
  sharp(path.join(root, 'brand/old-money-icons.jpg')).extract(OLD_MONEY_ICON).png().toBuffer()

const png = (tile: Buffer, size: number) => sharp(tile).resize(size, size, { fit: 'fill' }).png().toBuffer()

/** The tile centred on a full-bleed square, for icons the OS masks itself. */
const onSquare = async (tile: Buffer, size: number, inner: number, background: string) =>
  sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: await png(tile, inner) }])
    .png()
    .toBuffer()

async function icons() {
  const electric = await electricTile()
  const oldMoney = await oldMoneyTile()

  // Electric is the default theme, so its icons keep the standard file names.
  await writeFile(path.join(publicDir, 'favicon-32.png'), await png(electric.tile, 32))
  await writeFile(path.join(publicDir, 'icon-192.png'), await png(electric.tile, 192))
  await writeFile(path.join(publicDir, 'icon-512.png'), await png(electric.tile, 512))
  // Square, no transparency: iOS and Android apply their own masks.
  await writeFile(
    path.join(publicDir, 'apple-touch-icon.png'),
    await onSquare(electric.tile, 180, 150, electric.ink),
  )
  await writeFile(
    path.join(publicDir, 'icon-maskable-512.png'),
    await onSquare(electric.tile, 512, 400, electric.ink),
  )

  await mkdir(path.join(publicDir, 'icons'), { recursive: true })
  for (const size of [32, 192, 512]) {
    await writeFile(path.join(publicDir, `icons/old-money-${size}.png`), await png(oldMoney, size))
  }
  await writeFile(path.join(publicDir, 'icons/old-money-apple-touch.png'), await png(oldMoney, 180))

  // Header and footer badges: shown at 32px, drawn at 2x for sharp screens.
  await mkdir(badgeDir, { recursive: true })
  for (const [name, tile] of [
    ['electric', electric.tile],
    ['old-money', oldMoney],
  ] as const) {
    await sharp(tile)
      .resize(64, 64, { fit: 'fill' })
      .webp({ quality: 90 })
      .toFile(path.join(badgeDir, `${name}-badge.webp`))
  }

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
  return electric.tile
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

async function previewImage(electricTile: Buffer) {
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
  <image x="80" y="72" width="72" height="72" href="data:image/png;base64,${(await png(electricTile, 144)).toString('base64')}" />
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

await previewImage(await icons())
console.log("wrote both themes' app icons, header badges, site.webmanifest and og.png")
