import { resolveCaseStudyHero } from '../utils/resolveCaseStudyHero';

const base = '/images/ixd/calmpanion/case-study';

export const calmpanionDemoVideoId = 'IOh7x6-VL0U';

export const calmpanionCaseStudyImages = {
  hero: resolveCaseStudyHero(base),
  prototypes: [
    `${base}/prototype-1.png`,
    `${base}/prototype-2.png`,
    `${base}/prototype-3.png`,
  ],
  refinedPrototypes: [
    `${base}/refined-prototype-1.jpg`,
    `${base}/refined-prototype-2.png`,
    `${base}/refined-prototype-3.png`,
  ],
} as const;
