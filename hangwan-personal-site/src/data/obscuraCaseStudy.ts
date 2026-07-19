const base = '/images/games/obscura/case-study';

export const obscuraCaseStudyImages = {
  hero: `${base}/hero.mp4`,
  inspirationShapedPrimary: `${base}/inspiration-shaped-primary.jpg`,
  inspirationShapedSecondary: `${base}/inspiration-shaped-secondary.jpg`,
  gameDesignImage1: `${base}/game-design-image-1.mp4`,
  gameDesignImage2: `${base}/game-design-image-2.mp4`,
  gameDesignImage3: `${base}/game-design-image-3.mp4`,
  gameDesignFarewell: `${base}/game-design-farewell.mp4`,
  narrativeDesignImage1: `${base}/narrative-design-image-1.png`,
  narrativeDesignImage2: `${base}/narrative-design-image-2.png`,
  narrativeDesignImage3: `${base}/narrative-design-image-3.png`,
  devScenePhoto: `${base}/dev-scene-photo.jpg`,
  devSceneGame: `${base}/dev-scene-game.jpg`,
  devUiMain: `${base}/dev-ui-main.jpg`,
  devUiDetail1: `${base}/dev-ui-detail-1.jpg`,
  reflectionPhoto: `${base}/reflection-photo.jpg`,
} as const;

export const obscuraNarrativeDesignImages = [
  {
    src: `${base}/narrative-design-image-1.png`,
    placeholder: 'Narrative design image 1',
  },
  {
    src: `${base}/narrative-design-image-2.png`,
    placeholder: 'Narrative design image 2',
  },
  {
    src: `${base}/narrative-design-image-3.png`,
    placeholder: 'Narrative design image 3',
  },
] as const;

export type ObscuraStateOverviewImage = {
  image: string;
  placeholder: string;
  aspectRatio: string;
};

export const obscuraStateOverviewImages: ObscuraStateOverviewImage[] = [
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

export const obscuraDemoVideoId = '';

export type ObscuraStateMachineVideo = {
  src: string;
  placeholder: string;
  aspectRatio?: string;
};

export const obscuraStateMachineVideos: ObscuraStateMachineVideo[] = [
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
