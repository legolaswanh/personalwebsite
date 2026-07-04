/**
 * Games chapter image paths (public/images/games/)
 */

const base = '/images/games';

function projectImages(slug: string) {
  const path = `${base}/${slug}`;
  return {
    coverImage: `${path}/cover.jpg`,
    gameplayImage1: `${path}/gameplay-1.jpg`,
    gameplayImage2: `${path}/gameplay-2.jpg`,
    gameplayImage3: `${path}/gameplay-3.jpg`,
    gameplayImage4: `${path}/gameplay-4.jpg`,
  } as const;
}

/** Legacy featured / experiment paths — used as cover fallbacks */
export const gamesFeaturedImages = {
  zompanion: `${base}/featured/zompanion.jpg`,
  scarlett: `${base}/featured/scarlett.jpg`,
} as const;

export const gamesExperimentImages = {
  babel: `${base}/experiments/babel.png`,
  doublevision: `${base}/experiments/doublevision.png`,
  ionized: `${base}/experiments/ionized.png`,
  noworries: `${base}/experiments/noworries.png`,
  uroboros: `${base}/experiments/uroboros.png`,
  unself: `${base}/experiments/unself.png`,
} as const;

export const gamesProjectImages = {
  zompanion: {
    ...projectImages('zompanion'),
    coverImage: gamesFeaturedImages.zompanion,
  },
  scarlett: {
    ...projectImages('scarlett'),
    coverImage: gamesFeaturedImages.scarlett,
  },
  babel: {
    ...projectImages('babel'),
    coverImage: gamesExperimentImages.babel,
  },
  'double-vision': {
    ...projectImages('double-vision'),
    coverImage: gamesExperimentImages.doublevision,
  },
  ionized: {
    ...projectImages('ionized'),
    coverImage: gamesExperimentImages.ionized,
  },
  'no-worries': {
    ...projectImages('no-worries'),
    coverImage: gamesExperimentImages.noworries,
  },
  uroboros: {
    ...projectImages('uroboros'),
    coverImage: gamesExperimentImages.uroboros,
  },
  unself: {
    ...projectImages('unself'),
    coverImage: gamesExperimentImages.unself,
  },
} as const;

export const gamesToolIcons = {
  unity: `${base}/tools/unity.png`,
  csharp: `${base}/tools/csharp.png`,
  vscode: `${base}/tools/vscode.png`,
  git: `${base}/tools/git.png`,
} as const;

export type GamesToolIconKey = keyof typeof gamesToolIcons;
