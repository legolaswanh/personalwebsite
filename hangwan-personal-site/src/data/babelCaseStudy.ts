import { resolveCaseStudyHero } from '../utils/resolveCaseStudyHero';

const base = '/images/games/babel/case-study';

export const babelCaseStudyImages = {
  hero: resolveCaseStudyHero(base),
  playersIcon: `${base}/player.png`,
  playtimeIcon: `${base}/playtime.png`,
  configurationImage1: `${base}/configuration-image-1.jpg`,
  gameDesignFarewell: `${base}/game-design-farewell.mp4`,
  devScenePhoto: `${base}/dev-scene-photo.jpg`,
  devSceneGame: `${base}/dev-scene-game.jpg`,
  devUiMain: `${base}/dev-ui-main.jpg`,
  devUiDetail1: `${base}/dev-ui-detail-1.jpg`,
} as const;

export const babelConfigurationGallery = [
  `${base}/configuration-image-2.jpg`,
  `${base}/configuration-image-3.jpg`,
  `${base}/configuration-image-4.jpg`,
  `${base}/configuration-image-5.jpg`,
  `${base}/configuration-image-6.jpg`,
  `${base}/configuration-image-7.png`,
] as const;

export type BabelGameDesignImage = {
  image: string;
  placeholder: string;
  aspectRatio: string;
};

export const babelGameDesignImages: BabelGameDesignImage[] = [
  {
    image: `${base}/game-design-image-1.png`,
    placeholder: 'Game design image 1',
    aspectRatio: '257 / 158',
  },
  {
    image: `${base}/game-design-image-2.png`,
    placeholder: 'Game design image 2',
    aspectRatio: '207 / 325',
  },
  {
    image: `${base}/game-design-image-3.png`,
    placeholder: 'Game design image 3',
    aspectRatio: '292 / 333',
  },
];

export const babelGameplayImages: BabelGameDesignImage[] = [
  {
    image: `${base}/gameplay-image-1.jpg`,
    placeholder: 'Gameplay image 1',
    aspectRatio: '395 / 258',
  },
  {
    image: `${base}/gameplay-image-2.jpg`,
    placeholder: 'Gameplay image 2',
    aspectRatio: '375 / 258',
  },
  {
    image: `${base}/gameplay-image-3.jpg`,
    placeholder: 'Gameplay image 3',
    aspectRatio: '394 / 258',
  },
];

export const babelDemoVideoId = '';
