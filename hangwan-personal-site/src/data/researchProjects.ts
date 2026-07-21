import { researchProjectImages } from './researchAssets';
import type { ChapterConfig, ChapterProject } from '../types/chapterProject';
import { youtubeWatchUrl } from '../utils/parseYoutubeId';

const GAMEPLAY_STYLE_VIDEO_ID = 'KItHz61ma5c';

export const researchChapterConfig: ChapterConfig = {
  number: 3,
  title: 'Design Research',
  subtitle: 'Design analysis, experimental thinking, and research writing.',
  ctaLabel: 'Case Study',
};

export const researchProjects: ChapterProject[] = [
  {
    id: 'gameplay-style',
    title: 'Gameplay Style',
    roleLabel: 'Personal project | My Work:',
    label: 'Featured Project',
    category: 'Gameplay style / Design analysis',
    role: 'Researcher / Writer / Video Maker',
    focus:
      'Gameplay aesthetics · player expression · visual language · comparative game studies',
    summary:
      'A video essay and design study analyzing how long-term indirect control creates progression, delayed feedback, and player expression in different genres of games.',
    highlightTags: ['System Disassembly', 'Design Guidelines'],
    tags: ['Gameplay Systems', 'Game Study'],
    focusLabel: 'Design analysis',
    href: youtubeWatchUrl(GAMEPLAY_STYLE_VIDEO_ID),
    ctaLabel: 'View on YouTube',
    images: [{ type: 'youtube', videoId: GAMEPLAY_STYLE_VIDEO_ID, label: 'Gameplay Demo' }],
    featured: true,
  },
  {
    id: 'telemedicine-mirror',
    title: 'Telemedicine Mirror',
    roleLabel: 'Personal project | My Work:',
    label: 'Selected Work',
    category: 'Design experiment / Healthcare research',
    role: 'Researcher / Writer',
    focus:
      'Remote care · reflective self-check · trust-building · sensitive health communication',
    summary:
      'A healthcare UX conceptual essay exploring how a mirror-based interface can support remote consultation, daily health reflection, and clearer patient communication.',
    highlightTags: ['Research-based', 'Trust Design'],
    tags: ['User Scenario', 'Home Exam'],
    focusLabel: 'Healthcare Research',
    href: '/projects/telemedicine-mirror',
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
    highlightTags: ['Academic Research'],
    tags: ['IXD Methods', 'Design Writing'],
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
    highlightTags: ['HRI'],
    tags: ['Social Robotics', 'Trust & Agency'],
    focusLabel: 'Coming soon',
    railDisabled: true,
    images: researchProjectImages['hri-paper'],
  },
];

export const researchDefaultProject =
  researchProjects.find((p) => p.featured) ?? researchProjects[0];
