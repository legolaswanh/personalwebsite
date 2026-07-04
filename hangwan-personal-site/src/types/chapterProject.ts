export interface ChapterProjectImages {
  coverImage: string;
  gameplayImage1: string;
  gameplayImage2: string;
  gameplayImage3: string;
  gameplayImage4: string;
}

export interface ChapterProject {
  id: string;
  title: string;
  label: string;
  category: string;
  role: string;
  focus: string;
  summary: string;
  tags: string[];
  /** Short capability label shown in the project rail */
  focusLabel: string;
  href?: string;
  images: ChapterProjectImages;
  featured?: boolean;
}

export interface ChapterConfig {
  number: number;
  title: string;
  subtitle: string;
  tools: { src: string; label: string }[];
}
