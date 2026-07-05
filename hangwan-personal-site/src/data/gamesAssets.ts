/**
 * Game Design chapter image paths (public/images/games/)
 */

import { discoverProjectImages } from '../utils/discoverProjectImages';

const base = '/images/games';

export const gamesProjectImages = {
  zompanion: discoverProjectImages(base, 'zompanion'),
  scarlett: discoverProjectImages(base, 'scarlett'),
  babel: discoverProjectImages(base, 'babel'),
  'double-vision': discoverProjectImages(base, 'double-vision'),
  ionized: discoverProjectImages(base, 'ionized'),
  'no-worries': discoverProjectImages(base, 'no-worries'),
  uroboros: discoverProjectImages(base, 'uroboros'),
  unself: discoverProjectImages(base, 'unself'),
  obscura: discoverProjectImages(base, 'obscura'),
} as const;

export const gamesToolIcons = {
  unity: `${base}/tools/unity.png`,
  csharp: `${base}/tools/csharp.png`,
  vscode: `${base}/tools/vscode.png`,
  git: `${base}/tools/git.png`,
} as const;

export type GamesToolIconKey = keyof typeof gamesToolIcons;
