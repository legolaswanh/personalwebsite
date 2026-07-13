import { ixdProjectImages, ixdToolIcons } from './ixdAssets';
import type { ChapterConfig, ChapterProject } from '../types/chapterProject';

export const ixdChapterConfig: ChapterConfig = {
  number: 2,
  title: 'Interaction Design',
  subtitle: 'Public participation, shared experiences, and interactive systems.',
  ctaLabel: 'Case Study',
  tools: [
    { src: ixdToolIcons.figma, label: 'Figma' },
    { src: ixdToolIcons.framer, label: 'Framer' },
    { src: ixdToolIcons.photoshop, label: 'Photoshop' },
    { src: ixdToolIcons.premierpro, label: 'Premiere Pro' },
    { src: ixdToolIcons.arduino, label: 'Arduino' },
    { src: ixdToolIcons.blender, label: 'Blender' },
    { src: ixdToolIcons.python, label: 'Python' },
    { src: ixdToolIcons.prusaslicer, label: 'PrusaSlicer' },
  ],
};

export const ixdProjects: ChapterProject[] = [
  {
    id: 'public-editor',
    title: 'Public Editor',
    roleLabel: 'Group project | My Role:',
    label: 'Featured Project',
    category: 'Public participation / Editorial installation',
    role: 'Interaction Designer / UX Researcher / Prototyper',
    focus:
      'Editorial workflows · reader journeys · content structure · collaborative publishing tools',
    summary:
      'A public-facing interactive installation that invites visitors to participate in local news-making through physical-digital editorial tools.',
    highlightTags: ['Public Interaction', 'Participatory Installation'],
    tags: ['Physical-digital Interaction', '3D Printing', 'Journalism'],
    focusLabel: 'Participatory Installation',
    images: ixdProjectImages['public-editor'],
    featured: true,
  },
  {
    id: 'opalis',
    title: 'Opalis',
    roleLabel: 'Group project | My Role:',
    label: 'Selected Work',
    category: 'Public installation / Participatory interaction',
    role: 'Interaction Designer / UX Researcher',
    focus:
      'Public engagement · spatial interaction · participatory feedback · on-site prototyping',
    summary:
      'A co-creation project that supports people in contributing, combining, and shaping ideas together through a shared interactive experience.',
    highlightTags: ['Participatory Design'],
    tags: ['Collective Creation', 'Shared Experience', 'Social Interaction'],
    focusLabel: 'Public Installation',
    images: [
      ...ixdProjectImages.opalis,
      { type: 'youtube', videoId: 'fHX7dZmgLFE', label: 'Opalis Demo' }
    ],
  },
  {
    id: 'muscle-mate',
    title: 'Muscle Mate',
    roleLabel: 'Group project | My Role:',
    label: 'Selected Work',
    category: 'Fitness app / Social motivation',
    role: 'UX Designer',
    focus:
      'Movement guidance · wearable feedback · rehabilitation support · accessible physical training',
    summary:
      'A fitness app concept that adds social and team-based features to make training more motivating, connected, and sustainable.',
    highlightTags: ['Mobile App'],
    tags: ['Social Support', 'Fitness', 'Beginner-friendly'],
    focusLabel: 'Fitness app',
    images: ixdProjectImages['muscle-mate'],
  },
  {
    id: 'calmpanion',
    title: 'Calmpanion',
    roleLabel: 'Group project | My Role:',
    label: 'Selected Work',
    category: 'Tangible Interaction / Emotional support',
    role: 'Interaction Designer / Prototyper / UX Researcher',
    focus:
      'Calming rituals · embodied feedback · gentle pacing · everyday emotional regulation',
    summary:
      'A tangible interaction prototype designed to support dogs when they are alone at home through treat rewards, physical play, and calming music.',
    highlightTags: ['Human-animal Interaction', 'Research-based'],
    tags: ['Emotional Care', 'Wearable Design'],
    focusLabel: 'Human-animal Interaction',
    images: [
      ...ixdProjectImages.calmpanion,
      { type: 'youtube', videoId: 'IOh7x6-VL0U', label: 'Calmpanion Demo' }
    ],
  },
  {
    id: 'portfolio',
    title: 'Portfolio Redesign',
    roleLabel: 'Personal project | My Work:',
    label: 'Selected Work',
    category: 'Information Architecture / Interface System',
    role: 'UI/UX Designer',
    focus:
      'Calming rituals · embodied feedback · gentle pacing · everyday emotional regulation',
    summary:
      'A self-initiated redesign that reorganizes my portfolio into a clearer project structure, navigation flow, and visual interface system.',
    highlightTags: ['Information Architecture', 'Interface System'],
    tags: ['Visual System', 'Project Hierarchy', 'Navigation Design'],
    focusLabel: 'Interface System',
    images: ixdProjectImages['portfolio-redesign'],
  },
];

export const ixdDefaultProject =
  ixdProjects.find((p) => p.featured) ?? ixdProjects[0];
