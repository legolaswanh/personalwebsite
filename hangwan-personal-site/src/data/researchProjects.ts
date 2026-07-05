import { researchProjectImages, researchToolIcons } from './researchAssets';
import type { ChapterConfig, ChapterProject } from '../types/chapterProject';

export const researchChapterConfig: ChapterConfig = {
  number: 3,
  title: 'Design Research',
  subtitle: 'Video essays, papers, design studies.',
  ctaLabel: 'Case Study',
  tools: [
    { src: researchToolIcons.figma, label: 'Figma' },
    { src: researchToolIcons.framer, label: 'Framer' },
    { src: researchToolIcons.photoshop, label: 'Photoshop' },
    { src: researchToolIcons.premierpro, label: 'Premiere Pro' },
    { src: researchToolIcons.arduino, label: 'Arduino' },
    { src: researchToolIcons.blender, label: 'Blender' },
    { src: researchToolIcons.python, label: 'Python' },
    { src: researchToolIcons.prusaslicer, label: 'PrusaSlicer' },
  ],
};

export const researchProjects: ChapterProject[] = [
  {
    id: 'gameplay-style',
    title: 'Gameplay Style',
    roleLabel: 'Personal project | My Work:',
    label: 'Featured Project',
    category: 'Design research / Game aesthetics',
    role: 'Researcher / Writer / Visual Analyst',
    focus:
      'Gameplay aesthetics · player expression · visual language · comparative game studies',
    summary:
      'A research project examining how gameplay style communicates player identity, rhythm, and emotional tone across interactive experiences.',
    tags: ['Gameplay Aesthetics', 'Visual Analysis', 'Player Expression'],
    focusLabel: 'Gameplay Aesthetics',
    images: [{ type: 'youtube', videoId: 'KItHz61ma5c', label: 'Gameplay Demo' }],
    featured: true,
  },
  {
    id: 'telemedicine-mirror',
    title: 'Telemedicine Mirror',
    roleLabel: 'Personal project | My Work:',
    label: 'Selected Work',
    category: 'Healthcare UX / Reflective interface',
    role: 'Interaction Designer / Research-led Prototyper',
    focus:
      'Remote care · reflective self-check · trust-building · sensitive health communication',
    summary:
      'A telemedicine mirror concept that reframes remote consultations through reflective interaction and clearer care guidance.',
    tags: ['Healthcare UX', 'Reflective Interfaces', 'Trust Design'],
    focusLabel: 'Healthcare UX',
    images: researchProjectImages['telemedicine-mirror'],
  },
  {
    id: 'ixd-paper',
    title: 'IXD Paper',
    roleLabel: 'Group project | My Role:',
    label: 'Selected Work',
    category: 'Academic publication / Interaction design',
    role: 'Researcher / Author',
    focus:
      'Interaction frameworks · design methodology · field studies · academic writing',
    summary:
      'An interaction design research paper exploring methodological approaches to studying embodied and social interaction in everyday contexts.',
    tags: ['Academic Research', 'IXD Methods', 'Design Writing'],
    focusLabel: 'Coming soon',
    railDisabled: true,
    images: researchProjectImages['ixd-paper'],
  },
  {
    id: 'hri-paper',
    title: 'HRI Paper',
    roleLabel: 'Group project | My Role:',
    label: 'Selected Work',
    category: 'Academic publication / Human-robot interaction',
    role: 'Researcher / Co-author',
    focus:
      'Human-robot interaction · social cues · trust · collaborative behavior studies',
    summary:
      'A human-robot interaction study investigating how social cues and interface framing shape trust, cooperation, and perceived agency.',
    tags: ['HRI', 'Social Robotics', 'Trust & Agency'],
    focusLabel: 'Coming soon',
    railDisabled: true,
    images: researchProjectImages['hri-paper'],
  },
];

export const researchDefaultProject =
  researchProjects.find((p) => p.featured) ?? researchProjects[0];
