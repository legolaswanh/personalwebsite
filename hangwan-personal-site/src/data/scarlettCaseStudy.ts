const base = '/images/games/scarlett/case-study';

export const scarlettCaseStudyImages = {
  hero: `${base}/hero.jpg`,
  inspirationShapedPrimary: `${base}/inspiration-shaped-primary.jpg`,
  inspirationShapedSecondary: `${base}/inspiration-shaped-secondary.jpg`,
  gameDesignFarewell: `${base}/game-design-farewell.gif`,
  devScenePhoto: `${base}/dev-scene-photo.jpg`,
  devSceneGame: `${base}/dev-scene-game.jpg`,
  devUiMain: `${base}/dev-ui-main.jpg`,
  devUiDetail1: `${base}/dev-ui-detail-1.jpg`,
  reflectionPhoto: `${base}/reflection-photo.jpg`,
} as const;

export type ScarlettStateOverviewImage = {
  image: string;
  placeholder: string;
  aspectRatio: string;
};

export const scarlettStateOverviewImages: ScarlettStateOverviewImage[] = [
  {
    image: `${base}/dev-state-overview-1.jpg`,
    placeholder: 'State overview 1',
    aspectRatio: '744 / 462',
  },
  {
    image: `${base}/dev-state-overview-2.jpg`,
    placeholder: 'State overview 2',
    aspectRatio: '590 / 462',
  },
  {
    image: `${base}/dev-state-overview-3.jpg`,
    placeholder: 'State overview 3',
    aspectRatio: '580 / 462',
  },
];

export const scarlettDemoVideoId = 'fx3pUFxNuX8';

export type ScarlettStateMachineGif = {
  image: string;
  placeholder: string;
};

export const scarlettStateMachineGifs: ScarlettStateMachineGif[] = [
  {
    image: `${base}/state-machine-1.gif`,
    placeholder: 'State machine GIF 1',
  },
  {
    image: `${base}/state-machine-2.gif`,
    placeholder: 'State machine GIF 2',
  },
];
