import { gamesProjectImages, gamesToolIcons } from './gamesAssets';
import type { ChapterConfig, ChapterProject } from '../types/chapterProject';

export const gamesChapterConfig: ChapterConfig = {
  number: 1,
  title: 'Games',
  subtitle: 'Game systems, narrative loops, and emotional play.',
  tools: [
    { src: gamesToolIcons.unity, label: 'Unity' },
    { src: gamesToolIcons.csharp, label: 'C#' },
    { src: gamesToolIcons.vscode, label: 'VS Code' },
    { src: gamesToolIcons.git, label: 'Git' },
  ],
};

export const gamesProjects: ChapterProject[] = [
  {
    id: 'zompanion',
    title: 'Zompanion',
    label: 'Featured Game',
    category: 'Digital game / Management & Exploration',
    role: 'Game Designer / System Designer / Unity Developer',
    focus:
      'Core loop design · exploration risk · resource economy · companion progression',
    summary:
      'A 2D pixel-art management and exploration game about collecting, restoring, and living with jiangshi companions.',
    tags: [
      'System Design',
      'Core Loop Design',
      'Resource Balance',
      'Narrative Progression',
    ],
    focusLabel: 'System Design',
    href: '/projects/zompanion',
    images: gamesProjectImages.zompanion,
    featured: true,
  },
  {
    id: 'scarlett',
    title: 'Scarlett',
    label: 'Selected Work',
    category: 'Digital game / Narrative Exploration',
    role: 'Game Designer / Narrative Designer / Unity Prototyper',
    focus:
      'Environmental storytelling · memory architecture · emotional pacing · quiet discovery',
    summary:
      'An exploration-driven game set in a sun-worn world of memory, architecture, and quiet emotional discovery.',
    tags: ['Narrative Exploration', 'Atmosphere', 'Environmental Storytelling'],
    focusLabel: 'Narrative Design',
    href: '/projects/scarlett',
    images: gamesProjectImages.scarlett,
  },
  {
    id: 'babel',
    title: 'Babel',
    label: 'Selected Work',
    category: 'Digital game / Puzzle & Narrative',
    role: 'Game Designer / Puzzle Designer',
    focus: 'Language puzzles · layered narrative · symbolic logic · player interpretation',
    summary:
      'A puzzle-driven experience where language, structure, and meaning unfold through careful observation and connection.',
    tags: ['Puzzle Logic', 'Narrative Design', 'Symbol Systems'],
    focusLabel: 'Puzzle Logic',
    images: gamesProjectImages.babel,
  },
  {
    id: 'double-vision',
    title: 'Double Vision',
    label: 'Selected Work',
    category: 'Digital game / Interaction Prototype',
    role: 'Interaction Designer / Unity Prototyper',
    focus: 'Perceptual switching · dual-state mechanics · embodied feedback · prototype iteration',
    summary:
      'An interaction prototype exploring perception, dual viewpoints, and the friction between seeing and understanding.',
    tags: ['Interaction Prototype', 'Perception', 'Rapid Prototyping'],
    focusLabel: 'Interaction Prototype',
    images: gamesProjectImages['double-vision'],
  },
  {
    id: 'ionized',
    title: 'Ionized',
    label: 'Selected Work',
    category: 'Digital game / Arcade & Atmosphere',
    role: 'Game Designer / Mechanics Designer',
    focus: 'Arcade rhythm · playful physics · atmospheric feedback · moment-to-moment joy',
    summary:
      'A playful arcade experience built around charged movement, reactive environments, and tactile moment-to-moment feedback.',
    tags: ['Playful Mechanics', 'Arcade Feel', 'Juice & Feedback'],
    focusLabel: 'Playful Mechanics',
    images: gamesProjectImages.ionized,
  },
  {
    id: 'no-worries',
    title: 'No Worries',
    label: 'Selected Work',
    category: 'Board game / Social Play',
    role: 'Game Designer / Social Mechanics Designer',
    focus: 'Tabletop social dynamics · low-stakes negotiation · shared humor · group facilitation',
    summary:
      'A tabletop game designed to spark conversation, shared laughter, and low-pressure social negotiation around the table.',
    tags: ['Social Mechanics', 'Tabletop Design', 'Group Play'],
    focusLabel: 'Social Mechanics',
    href: '/projects/no-worries',
    images: gamesProjectImages['no-worries'],
  },
  {
    id: 'uroboros',
    title: 'Uroboros',
    label: 'Selected Work',
    category: 'Digital game / Puzzle & Cycle',
    role: 'Game Designer / Systems Designer',
    focus:
      'Recursive mechanics · cyclical progression · spatial puzzle logic · emergent player strategies',
    summary:
      'A puzzle-driven game exploring recursion and self-reference, where every action reshapes the loop players must learn to break.',
    tags: ['Recursive Mechanics', 'Puzzle Design', 'Systemic Play'],
    focusLabel: 'Recursive Mechanics',
    images: gamesProjectImages.uroboros,
  },
  {
    id: 'unself',
    title: 'Unself',
    label: 'Selected Work',
    category: 'Digital game / Thematic Experience',
    role: 'Game Designer / Experience Designer',
    focus: 'Identity exploration · reflective pacing · thematic systems · emotional ambiguity',
    summary:
      'A thematic experience about identity, self-perception, and the quiet tension between who we are and who we perform.',
    tags: ['Thematic Exploration', 'Identity', 'Reflective Play'],
    focusLabel: 'Thematic Exploration',
    images: gamesProjectImages.unself,
  },
];

export const gamesDefaultProject =
  gamesProjects.find((p) => p.featured) ?? gamesProjects[0];

/** @deprecated Use gamesProjects */
export const gamesPrimaryProject = {
  title: gamesDefaultProject.title,
  type: gamesDefaultProject.category,
  description: gamesDefaultProject.summary,
  role: gamesDefaultProject.role,
  tags: gamesDefaultProject.tags,
  href: gamesDefaultProject.href ?? '#',
  imageSrc: gamesDefaultProject.images.coverImage,
  imageLabel: `${gamesDefaultProject.title} image`,
};

/** @deprecated Use gamesProjects */
export const gamesSecondaryProject = {
  title: gamesProjects[1].title,
  type: gamesProjects[1].category,
  description: gamesProjects[1].summary,
  role: gamesProjects[1].role,
  tags: gamesProjects[1].tags,
  href: gamesProjects[1].href ?? '#',
  imageSrc: gamesProjects[1].images.coverImage,
  imageLabel: `${gamesProjects[1].title} image`,
};

/** @deprecated Use gamesProjects */
export const gamesExperiments = gamesProjects.slice(2).map((p) => ({
  name: p.title,
  type: p.focusLabel,
  category: p.category.split(' / ')[0],
  imageSrc: p.images.coverImage,
}));
