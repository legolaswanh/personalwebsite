const base = '/images/games/zompanion/case-study';

export const zompanionCaseStudyImages = {
  hero: `${base}/hero.png`,
  heroGif: `${base}/hero-gif.gif`,
  heroTitle: `${base}/hero-title.png`,
  gameDesignImage: `${base}/game-design-image.png`,
  gameDevelopmentImage1: `${base}/game-development-image-1.jpg`,
  gameDevelopmentImage2: `${base}/game-development-image-2.jpg`,
} as const;

export const zompanionConceptImages = [
  {
    src: `${base}/concept-image-1.png`,
    placeholder: 'Concept image 1',
  },
  {
    src: `${base}/concept-image-2.png`,
    placeholder: 'Concept image 2',
  },
  {
    src: `${base}/concept-image-3.png`,
    placeholder: 'Concept image 3',
  },
] as const;

export const zompanionGameDevelopmentImages = [
  {
    src: `${base}/game-development-image-1.jpg`,
    placeholder: 'Game development image 1',
  },
  {
    src: `${base}/game-development-image-2.jpg`,
    placeholder: 'Game development image 2',
  },
] as const;

export const zompanionDemoVideoId = '';
