import { resolveCaseStudyHero } from '../utils/resolveCaseStudyHero';

const base = '/images/ixd/opalis/case-study';

export const opalisCaseStudyImages = {
  hero: resolveCaseStudyHero(base),
  problemImage: `${base}/problem-image.jpg`,
  prototypingVideo: `${base}/prototyping.mp4`,
} as const;

export const opalisDesignMethods = [
  {
    number: '01',
    title: 'Boot Up Note Taking',
    body: 'We revisited the identified problems and user needs to ensure the team was aligned on the core questions.',
  },
  {
    number: '02',
    title: '635',
    body: 'Using an adapted "635" method, we iteratively sketched and refined ideas, generating roughly 100 concepts in a stimulating environment.',
  },
  {
    number: '03',
    title: 'Dot Vote',
    body: 'We used dot voting to prioritize the top five concepts, simultaneously merging similar features to strengthen the candidates.',
  },
  {
    number: '04',
    title: 'Rumble or All-in-one',
    body: 'We compared the leading ideas for feasibility and reach, ultimately combining them into a single "all-in-one" solution.',
  },
] as const;
