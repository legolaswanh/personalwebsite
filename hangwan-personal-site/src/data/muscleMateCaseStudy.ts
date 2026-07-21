import { resolveCaseStudyHero } from '../utils/resolveCaseStudyHero';

const base = '/images/ixd/muscle-mate/case-study';

export const muscleMateCaseStudyImages = {
  hero: resolveCaseStudyHero(base),
  heroIcon: `${base}/hero-icon.png`,
  persona: `${base}/persona.png`,
  designSolution: `${base}/design-solution.png`,
  designImage: `${base}/design-image.png`,
  prototypes: [
    `${base}/prototype-1.png`,
    `${base}/prototype-2.png`,
    `${base}/prototype-3.png`,
    `${base}/prototype-4.png`,
  ],
} as const;
