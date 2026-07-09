import { ixdProjectImages, ixdToolIcons } from './ixdAssets';
import type { ChapterConfig, ChapterProject } from '../types/chapterProject';

export const ixdChapterConfig: ChapterConfig = {
  number: 2,
  title: 'Interaction Design',
  subtitle: 'Public interaction, tangible interfaces, UX experiments.',
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
    category: 'Editorial experience / Service interaction',
    role: 'Interaction Designer / UX Researcher',
    focus:
      'Editorial workflows · reader journeys · content structure · collaborative publishing tools',
    summary:
      'An editorial interaction concept exploring how newsroom tools and reader-facing experiences can support clearer, more human storytelling.',
    highlightTags: ['Editorial UX'],
    tags: ['Service Design', 'Content Systems'],
    focusLabel: 'Editorial UX',
    images: ixdProjectImages['public-editor'],
    featured: true,
  },
  {
    id: 'opalis',
    title: 'Opalis',
    roleLabel: 'Group project | My Role:',
    label: 'Selected Work',
    category: 'Public installation / Participatory interaction',
    role: 'Interaction Designer / Prototyper / Facilitator',
    focus:
      'Public engagement · spatial interaction · participatory feedback · on-site prototyping',
    summary:
      'A public interaction installation inviting passersby to shape shared narratives through tactile, in-the-moment participation.',
    highlightTags: ['Public Interaction'],
    tags: ['Participatory Design', 'Spatial UX'],
    focusLabel: 'Public Interaction',
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
    category: 'Wearable interaction / Movement support',
    role: 'Interaction Designer / Hardware Prototyper',
    focus:
      'Movement guidance · wearable feedback · rehabilitation support · accessible physical training',
    summary:
      'A wearable interaction system helping users understand muscle engagement through responsive feedback during guided movement practice.',
    highlightTags: ['Wearable UX'],
    tags: ['Movement Design', 'Rehabilitation Support'],
    focusLabel: 'Wearable UX',
    images: ixdProjectImages['muscle-mate'],
  },
  {
    id: 'calmpanion',
    title: 'Calmpanion',
    roleLabel: 'Group project | My Role:',
    label: 'Selected Work',
    category: 'Tangible interface / Emotional support',
    role: 'Interaction Designer / Prototyper',
    focus:
      'Calming rituals · embodied feedback · gentle pacing · everyday emotional regulation',
    summary:
      'A tangible companion object designed to support calm through subtle haptic cues and low-friction daily rituals.',
    highlightTags: ['Tangible UX'],
    tags: ['Emotional Design', 'Embodied Interaction'],
    focusLabel: 'Tangible UX',
    images: [
      ...ixdProjectImages.calmpanion,
      { type: 'youtube', videoId: 'IOh7x6-VL0U', label: 'Calmpanion Demo' }
    ],
  },
];

export const ixdDefaultProject =
  ixdProjects.find((p) => p.featured) ?? ixdProjects[0];
