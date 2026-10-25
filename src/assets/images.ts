import type { Picture } from 'vite-imagetools'
// Each import is resized and re-encoded at build time (vite-imagetools):
// AVIF and WebP at several widths, with intrinsic dimensions to prevent layout shift.
import avatarPicture from './avatar.webp?w=96;192&format=avif;webp&as=picture'
import cartoonPicture from './portrait-cartoon.webp?w=360;560;800&aspect=4:5&position=top&format=avif;webp&as=picture'
import portraitPicture from './portrait.webp?w=400;640;880&aspect=4:5&format=avif;webp&as=picture'

export type { Picture }

export const images = {
  portrait: {
    picture: portraitPicture,
    alt: 'Illustrated portrait of Ignacio at his desk, with architecture diagrams, a chessboard and a piano keyboard around him',
  },
  cartoon: {
    picture: cartoonPicture,
    alt: 'Cartoon of Ignacio wearing a headset, holding a coffee mug, surrounded by monitoring dashboards and a deploy button',
  },
  avatar: {
    picture: avatarPicture,
    alt: 'Ignacio Zenteno Smith',
  },
}
