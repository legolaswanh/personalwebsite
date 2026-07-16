import { resolveCaseStudyHero } from '../utils/resolveCaseStudyHero';

const base = '/images/games/ionized/case-study';

export const ionizedCaseStudyImages = {
  hero: resolveCaseStudyHero(base),
  playersIcon: `${base}/player.png`,
  playtimeIcon: `${base}/playtime.png`,
  configurationImage: `${base}/configeration-image.png`,
  gameplayImage1: `${base}/gameplay-image-1.png`,
} as const;

export type IonizedRuleModule = {
  number: string;
  title: string;
  body: string;
  image: string;
  aspectRatio: string;
};

export const ionizedRuleModules: IonizedRuleModule[] = [
  {
    number: '01',
    title: 'Yellow',
    body: 'Flip one of your own hidden cards',
    image: `${base}/gameplay-image-2.png`,
    aspectRatio: '150 / 223',
  },
  {
    number: '02',
    title: 'Red',
    body: "Swap one of your cards with another player's card, whether the cards are revealed or still hidden.",
    image: `${base}/gameplay-image-3.png`,
    aspectRatio: '150 / 223',
  },
  {
    number: '03',
    title: 'Blue',
    body: "Flip a scoring symbol on any player's board, changing whether its row or column is added to or subtracted from the final total.",
    image: `${base}/gameplay-image-4.png`,
    aspectRatio: '150 / 223',
  },
];

export const ionizedDemoVideoId = '';
