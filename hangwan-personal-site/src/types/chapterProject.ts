import type { ChapterGalleryItem } from '../utils/chapterGallery';

export const CHAPTER_DEFAULT_ROLE_LABEL = 'Role / My Work:';
export const CHAPTER_DEFAULT_CTA_LABEL = 'View Project';

export interface ChapterProject {
  id: string;
  title: string;
  label: string;
  category: string;
  /** Heading above the role description, e.g. "Role / My Work:" or "Game Jam Role:" */
  roleLabel?: string;
  role: string;
  focus: string;
  summary: string;
  /** Highlighted capability tags in the project detail panel (accent pill style) */
  highlightTags: string[];
  /** Regular capability tags in the project detail panel */
  tags: string[];
  /** Subtitle under the project title in the left project rail */
  focusLabel: string;
  /** Rail placeholder: shows label but cannot be selected or switched to */
  railDisabled?: boolean;
  href?: string;
  images: ChapterGalleryItem[];
  featured?: boolean;
}

export interface ChapterConfig {
  number: number;
  title: string;
  subtitle: string;
  tools?: { src: string; label: string }[];
  /** Label for the project detail link button */
  ctaLabel?: string;
}
