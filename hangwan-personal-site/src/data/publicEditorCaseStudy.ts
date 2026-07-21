import { resolveCaseStudyHero } from '../utils/resolveCaseStudyHero';

const base = '/images/ixd/public-editor/case-study';

export const publicEditorCaseStudyImages = {
  hero: resolveCaseStudyHero(base),
  siteResearch: [
    `${base}/site-research-1.jpg`,
    `${base}/site-research-2.jpg`,
  ],
  systemOverview: `${base}/system-overview.jpg`,
  newsCamera: `${base}/news-camera.jpg`,
  interviewRecorder: `${base}/interview-recorder.jpg`,
  editorsTypewriter: `${base}/editors-typewriter.jpg`,
  centralScreen: `${base}/central-screen.jpg`,
  prototype0: `${base}/prototype-0.jpg`,
  prototypes: [
    `${base}/prototype-1.jpg`,
    `${base}/prototype-2.jpg`,
    `${base}/prototype-3.jpg`,
  ],
  poster: `${base}/poster.png`,
} as const;

export const publicEditorDesignCriteria = [
  'take less than one minute',
  'work independently from the other stations',
  'require no personal device or account',
  'provide clear and immediate public feedback',
  'avoid blocking pedestrian movement',
] as const;
