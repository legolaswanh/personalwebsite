import {
  aboutPathImages,
  aboutShapeImages,
} from './aboutAssets';

export interface PathMilestone {
  id: string;
  era: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export interface LifeShape {
  id: string;
  name: string;
  description: string;
  image: string;
  column: 1 | 2 | 3;
}

export const positioningSentence = {
  before: 'I design ',
  emphasis: 'playful and thoughtful interactions',
  after:
    ', shaped by a background in game industry, software engineering, and interaction design.',
} as const;

export const pathMilestones: PathMilestone[] = [
  {
    id: 'sichuan',
    era: 'Journey start',
    title: 'Software Engineering',
    subtitle: 'Sichuan University',
    description:
      'Where I learned to build systems, write code, and think in structures.',
    image: aboutPathImages.sichuan,
  },
  {
    id: 'game-industry',
    era: 'Work experience',
    title: 'Game Tester, Manager & Project Manager',
    subtitle: 'Game industry',
    description:
      'From testing mechanics and managing releases to bridging teams and timelines — learning how games are made and shipped.',
    image: aboutPathImages['game-industry'],
  },
  {
    id: 'chalmers',
    era: 'Graduate study',
    title: 'Interaction Design & Technologies',
    subtitle: 'Chalmers University of Technology',
    description:
      'Studying how people interact with technology, spaces, and each other.',
    image: aboutPathImages.chalmers,
  },
  {
    id: 'current',
    era: 'Current direction',
    title: 'Game Design + Interaction Design',
    subtitle: 'About the future',
    description:
      'Bringing engineering rigour and design empathy into playful, thoughtful experiences.',
    image: aboutPathImages.current,
  },
];

export const lifeShapes: LifeShape[] = [
  {
    id: 'games',
    name: 'Games',
    description: 'Enjoyment and engagement',
    image: aboutShapeImages.games,
    column: 1,
  },
  {
    id: 'movies',
    name: 'Movies',
    description: 'Emotion and imagination',
    image: aboutShapeImages.movies,
    column: 1,
  },
  {
    id: 'marriage',
    name: 'Marriage',
    description: 'Commitment and shared growth',
    image: aboutShapeImages.marriage,
    column: 2,
  },
  {
    id: 'cats',
    name: 'Cats',
    description: 'Care and attention',
    image: aboutShapeImages.cats,
    column: 2,
  },
  {
    id: 'presence',
    name: 'Presence',
    description: 'Groundedness and self-awareness',
    image: aboutShapeImages.presence,
    column: 2,
  },
  {
    id: 'football',
    name: 'Football',
    description: 'Loyalty and competitive aspiration',
    image: aboutShapeImages.football,
    column: 3,
  },
  {
    id: 'travelling',
    name: 'Travelling',
    description: 'Curiosity and perspective',
    image: aboutShapeImages.travelling,
    column: 3,
  },
];

export const resumeUrl =
  'https://drive.google.com/file/d/1yYNvvnpq2QIb2F3S9P9OkD5jCeE-0CQJ/view?usp=drive_link';

export const contactEmail = 'legolaswandd@gmail.com';

export const socialLinks = {
  linkedin: 'https://www.linkedin.com/in/hangwan',
  instagram: 'https://www.instagram.com/hangwan',
  facebook: 'https://www.facebook.com/hangwan',
} as const;
