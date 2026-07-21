const base = '/images/games/double-vision/case-study';

export const doubleVisionCaseStudyImages = {
  hero: `${base}/hero.png`,
  narrativeDesign: `${base}/narrative-design-image.png`,
  narrativeDesignOutcome1: `${base}/narrative-design-outcome-image-1.jpg`,
  narrativeDesignOutcome2: `${base}/narrative-design-outcome-image-2.jpg`,
  gameDesignImage1: `${base}/game-design-image-1.png`,
  gameDesignImage2: `${base}/game-design-image-2.jpg`,
  gameDesignImage3: `${base}/game-design-image-3.jpg`,
  gameDesignImage4: `${base}/game-design-image-4.jpg`,
  inspirationImage: `${base}/inspiration-image.png`,
  inspirationShapedPrimary: `${base}/inspiration-shaped-primary.jpg`,
  inspirationShapedSecondary: `${base}/inspiration-shaped-secondary.jpg`,
  gameDesignFarewell: `${base}/game-design-farewell.mp4`,
  devScenePhoto: `${base}/dev-scene-photo.jpg`,
  devSceneGame: `${base}/dev-scene-game.jpg`,
  devUiMain: `${base}/dev-ui-main.jpg`,
  devUiDetail1: `${base}/dev-ui-detail-1.jpg`,
  reflectionPhoto: `${base}/reflection-photo.jpg`,
} as const;

export type DoubleVisionStateOverviewImage = {
  image: string;
  placeholder: string;
  aspectRatio: string;
};

export const doubleVisionStateOverviewImages: DoubleVisionStateOverviewImage[] = [
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

export const doubleVisionDemoVideoId = 'h_lnbsFGBpQ';

export type DoubleVisionStateMachineVideo = {
  src: string;
  placeholder: string;
  aspectRatio?: string;
};

export const doubleVisionStateMachineVideos: DoubleVisionStateMachineVideo[] = [
  {
    src: `${base}/state-machine-1.mp4`,
    placeholder: 'State machine video 1',
    aspectRatio: '1914 / 1076',
  },
  {
    src: `${base}/state-machine-2.mp4`,
    placeholder: 'State machine video 2',
    aspectRatio: '1914 / 1076',
  },
];
