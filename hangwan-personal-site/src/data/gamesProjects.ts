import { gamesProjectImages, gamesToolIcons } from './gamesAssets';
import type { ChapterConfig, ChapterProject } from '../types/chapterProject';
import type { ChapterGalleryItem } from '../utils/chapterGallery';
import { projectCoverImage } from '../utils/chapterGallery';
import { youtubeGalleryItem } from '../utils/parseYoutubeId';

/** Paste Zompanion demo YouTube URL or video ID; leave empty to hide the video slide */
const ZOMPANION_DEMO_VIDEO_URL = '';

function zompanionGallery(): ChapterGalleryItem[] {
  const items: ChapterGalleryItem[] = [...gamesProjectImages.zompanion];
  const demo = youtubeGalleryItem(ZOMPANION_DEMO_VIDEO_URL, 'Gameplay Demo');
  if (demo) items.push(demo);
  return items;
}

export const gamesChapterConfig: ChapterConfig = {
  number: 1,
  title: 'Game Design',
  subtitle: 'Playful systems, crafted mechanics, and emotional worlds.',
  tools: [
    { src: gamesToolIcons.unity, label: 'Unity' },
    { src: gamesToolIcons.csharp, label: 'C#' },
    { src: gamesToolIcons.vscode, label: 'VS Code' },
    { src: gamesToolIcons.aseprite, label: 'Aseprite' },
    { src: gamesToolIcons.git, label: 'Git' },
    { src: gamesToolIcons.cursor, label: 'Cursor' },
  ],
};

export const gamesProjects: ChapterProject[] = [
  {
    id: 'zompanion',
    title: 'Zompanion',
    roleLabel: 'Group project | My Role:',
    label: 'Featured Game',
    category: 'Digital game / Management & Exploration',
    role: 'Game Designer / System Designer / Unity Developer',
    focus:
      'Core loop design · exploration risk · resource economy · companion progression',
    summary:
      'A 2D pixel-art management and exploration game about collecting, restoring, and living with zombie companions.',
    highlightTags: ['System Design', 'Management Loop'],
    tags: ['Companion System', 'Resource Management'],
    focusLabel: 'System Design',
    href: '/projects/zompanion',
    images: zompanionGallery(),
    featured: true,
  },
  {
    id: 'scarlet',
    title: 'Scarlet',
    roleLabel: 'Personal project | My Work:',
    label: 'Selected Work',
    category: 'Digital game / Narrative Exploration',
    role: 'Game Design / Narrative Design / Unity Develop',
    focus:
      'Environmental storytelling · memory architecture · emotional pacing · quiet discovery',
    summary:
      'An emotional third-person cat adventure that turns memory, absence, and farewell into playful domestic exploration.',
    highlightTags: ['Emotion-driven', 'Environmental Storytelling'],
    tags: ['State Machine', 'Life-based Experience', 'Animal-like Interaction'],
    focusLabel: 'Emotion-driven',
    href: '/projects/scarlett',
    images: [
      ...gamesProjectImages.scarlett,
      { type: 'youtube', videoId: 'fx3pUFxNuX8', label: 'Gameplay Demo' },
    ],
  },
  {
    id: 'obscura',
    title: 'Obscura',
    roleLabel: 'GameJam project | My Role:',
    label: 'Selected Work',
    category: 'Digital game / Atmospheric Exploration',
    role: 'Game Designer / Level Designer / Unity Developer',
    focus:
      'Light and shadow · obscured navigation · environmental mystery · tense pacing',
    summary:
      'A spatial puzzle game built around level structure, navigation, and environmental reasoning.',
    highlightTags: ['Spatial Puzzle', 'Level Design'],
    tags: ['Environmental Navigation', 'Spatial Reasoning'],
    focusLabel: 'Spatial Puzzle',
    href: '/projects/obscura',
    images: gamesProjectImages.obscura,
  },
  {
    id: 'unself',
    title: 'Unself',
    roleLabel: 'GameJam project | My Role:',
    label: 'Selected Work',
    category: 'Digital game / Thematic Experience',
    role: 'Game Designer / Narrative Designer',
    focus: 'Identity exploration · reflective pacing · thematic systems · emotional ambiguity',
    summary:
      'A thematic game exploring identity, self-expression, and internal conflict through symbolic interaction.',
    highlightTags: ['Thematic Design', 'Self-expression'],
    tags: ['Identity Reflection', 'Symbolic Interaction'],
    focusLabel: 'Thematic Design',
    href: '/projects/unself',
    images: gamesProjectImages.unself,
  },
  {
    id: 'uroboros',
    title: 'Uroboros',
    roleLabel: 'GameJam project | My Role:',
    label: 'Selected Work',
    category: 'Digital game / Programmatic Puzzle',
    role: 'Game Designer / Mechanics Designer / Level Designer',
    focus:
      'Recursive mechanics · cyclical progression · spatial puzzle logic · emergent player strategies',
    summary:
      'A mechanic-focused game built around recursive rules and self-referential gameplay structures.',
    highlightTags: ['Recursive Mechanics', 'System Logic'],
    tags: ['Puzzle Design', 'Systemic Play'],
    focusLabel: 'Recursive Mechanics',
    href: '/projects/uroboros',
    images: gamesProjectImages.uroboros,
  },
  {
    id: 'double-vision',
    title: 'Double Vision',
    roleLabel: 'Personal project | My Work:',
    label: 'Selected Work',
    category: 'Digital game / Narrative & Puzzle',
    role: 'Game Design / Narrative Design / Unity Develop',
    focus: 'Perceptual switching · dual-state mechanics · embodied feedback · prototype iteration',
    summary:
      'A narrative-driven game about shifting perspectives, hidden meanings, and fragmented perception.',
    highlightTags: ['Narrative Design', 'Story Structure'],
    tags: ['Perspective Shift', 'Clue Integration'],
    focusLabel: 'Narrative Design',
    href: '/projects/double-vision',
    images: [
      ...gamesProjectImages['double-vision'],
      { type: 'youtube', videoId: 'h_lnbsFGBpQ', label: 'Double Vision Demo' }
    ],
  },
  {
    id: 'babel',
    title: 'Babel',
    roleLabel: 'Personal project | My Role:',
    label: 'Selected Work',
    category: 'Digital game / Cooperation & Confrontation',
    role: 'Game Design / Physical Prototyping',
    focus: 'Language puzzles · layered narrative · symbolic logic · player interpretation',
    summary:
      'A cooperative-strategic tabletop game that turns language systems, interpretation, and player negotiation into the core of play.',
    highlightTags: ['Puzzle Logic', 'Language System'],
    tags: ['Cooperative Strategy', 'Symbol Systems'],
    focusLabel: 'Mechanic-driven',
    href: '/projects/babel',
    images: gamesProjectImages.babel,
  },
  {
    id: 'ionized',
    title: 'Ionized',
    roleLabel: 'Group project | My Role:',
    label: 'Selected Work',
    category: 'Card game / Social & Calculation',
    role: 'Game Designer / Playtester',
    focus: 'Arcade rhythm · playful physics · atmospheric feedback · moment-to-moment joy',
    summary:
      'A calculation-based card game designed for party play, combining numerical logic, card interactions, and player confrontation.',
    highlightTags: ['Playful Mechanics'],
    tags: ['Party Play', 'Player Confrontation'],
    focusLabel: 'Calculation Logic',
    href: '/projects/ionized',
    images: gamesProjectImages.ionized,
  },
  {
    id: 'no-worries',
    title: 'No Worries',
    roleLabel: 'Personal project | My Work:',
    label: 'Selected Work',
    category: 'Board game / Social Simulation',
    role: 'Game Design / Physical Prototyping',
    focus: 'Tabletop social dynamics · low-stakes negotiation · shared humor · group facilitation',
    summary:
      'A concept-driven game experiment using playful systems to reflect on social dynamics and human interaction.',
    highlightTags: ['Concept-driven', 'First-person Design'],
    tags: ['Playful Reflection', 'Design Experiment'],
    focusLabel: 'Concept-driven',
    href: '/projects/no-worries',
    images: gamesProjectImages['no-worries'],
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
  imageSrc: projectCoverImage(gamesDefaultProject.images),
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
  imageSrc: projectCoverImage(gamesProjects[1].images),
  imageLabel: `${gamesProjects[1].title} image`,
};

/** @deprecated Use gamesProjects */
export const gamesExperiments = gamesProjects.slice(2).map((p) => ({
  name: p.title,
  type: p.focusLabel,
  category: p.category.split(' / ')[0],
  imageSrc: projectCoverImage(p.images),
}));
