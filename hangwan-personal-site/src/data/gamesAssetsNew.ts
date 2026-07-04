/**
 * Games_new chapter image paths (public/images/games/)
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
export const gamesNewFeaturedImages = {
  zompanion: `${base}/featured/zompanion.jpg`,
  scarlett: `${base}/featured/scarlett.jpg`,
} as const;

export const gamesNewExperimentImages = {
  babel: `${base}/experiments/babel.png`,
  doublevision: `${base}/experiments/doublevision.png`,
  ionized: `${base}/experiments/ionized.png`,
  noworries: `${base}/experiments/noworries.png`,
  uroboros: `${base}/experiments/uroboros.png`,
  unself: `${base}/experiments/unself.png`,
} as const;

export const gamesNewProjectImages = {
  zompanion: {
    ...projectImages('zompanion'),
    coverImage: gamesNewFeaturedImages.zompanion,
  },
  scarlett: {
    ...projectImages('scarlett'),
    coverImage: gamesNewFeaturedImages.scarlett,
  },
  babel: {
    ...projectImages('babel'),
    coverImage: gamesNewExperimentImages.babel,
  },
  'double-vision': {
    ...projectImages('double-vision'),
    coverImage: gamesNewExperimentImages.doublevision,
  },
  ionized: {
    ...projectImages('ionized'),
    coverImage: gamesNewExperimentImages.ionized,
  },
  'no-worries': {
    ...projectImages('no-worries'),
    coverImage: gamesNewExperimentImages.noworries,
  },
  uroboros: {
    ...projectImages('uroboros'),
    coverImage: gamesNewExperimentImages.uroboros,
  },
  unself: {
    ...projectImages('unself'),
    coverImage: gamesNewExperimentImages.unself,
  },
} as const;

export const gamesNewToolIcons = {
  unity: `${base}/tools/unity.png`,
  csharp: `${base}/tools/csharp.png`,
  vscode: `${base}/tools/vscode.png`,
  git: `${base}/tools/git.png`,
} as const;

export type GamesNewToolIconKey = keyof typeof gamesNewToolIcons;
