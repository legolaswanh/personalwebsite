/**
 * About page image paths (public/images/about/)
 *
 * Drop images into the matching folders using the filenames below.
 * Supported formats: .png, .jpg, .webp, .svg
 */

const base = '/images/about';

export const aboutPathImages = {
  sichuan: `${base}/path/sichuan.png`,
  'game-industry': `${base}/path/game-tester.png`,
  chalmers: `${base}/path/chalmers.png`,
  current: `${base}/path/current.png`,
} as const;

export const aboutShapeImages = {
  games: `${base}/shapes/games.png`,
  movies: `${base}/shapes/movies.png`,
  marriage: `${base}/shapes/marriage.png`,
  cats: `${base}/shapes/cats.png`,
  presence: `${base}/shapes/presence.png`,
  football: `${base}/shapes/football.png`,
  travelling: `${base}/shapes/travelling.png`,
} as const;

/** Center hub images — cycle randomly while dragging the identity sphere */
export const aboutCenterIcons = [
  `${base}/network/center-1.png`,
  `${base}/network/center-2.png`,
  `${base}/network/center-3.png`,
  `${base}/network/center-4.png`,
  `${base}/network/center-5.png`,
] as const;

/** Optional icons for the identity sphere — keyed by node id in skillNetwork.ts */
export const aboutNetworkIcons: Partial<Record<string, string>> = {
  unity: `${base}/network/unity.png`,
  csharp: `${base}/network/csharp.png`,
  arduino: `${base}/network/arduino.png`,
  blender: `${base}/network/blender.png`,
  figma: `${base}/network/figma.png`,
  framer: `${base}/network/framer.png`,
  photoshop: `${base}/network/photoshop.png`,
  premierpro: `${base}/network/premierpro.png`,
  python: `${base}/network/python.png`,
};

/** Custom cursors for the identity sphere — drop PNGs into public/images/about/network/ */
export const aboutNetworkCursors = {
  openHand: `${base}/network/cursor-open-hand.png`,
  closedHand: `${base}/network/cursor-closed-hand.png`,
} as const;

export type AboutPathImageKey = keyof typeof aboutPathImages;
export type AboutShapeImageKey = keyof typeof aboutShapeImages;
export type AboutNetworkIconKey = keyof typeof aboutNetworkIcons;

export const aboutContactIcons = {
  gmail: `${base}/contact/gmail.png`,
  linkedin: `${base}/contact/linkedin.png`,
  instagram: `${base}/contact/instagram.png`,
  facebook: `${base}/contact/facebook.png`,
} as const;
