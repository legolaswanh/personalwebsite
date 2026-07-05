import { youtubePosterUrl } from './parseYoutubeId';

export interface ChapterGalleryImageItem {
  type: 'image';
  src: string;
  label: string;
}

export interface ChapterGalleryYoutubeItem {
  type: 'youtube';
  videoId: string;
  label: string;
  poster?: string;
}

export type ChapterGalleryItem = ChapterGalleryImageItem | ChapterGalleryYoutubeItem;

/** @deprecated Use ChapterGalleryItem */
export type ChapterGalleryImage = ChapterGalleryItem;

/** Poster/thumbnail URL used for mask sampling and placeholders. */
export function galleryItemPoster(item: ChapterGalleryItem): string {
  if (item.type === 'image') return item.src;
  return item.poster ?? youtubePosterUrl(item.videoId);
}

export function projectCoverImage(images: ChapterGalleryItem[]): string {
  if (images.length === 0) return '';

  const firstImage = images.find((item) => item.type === 'image');
  if (firstImage?.type === 'image') return firstImage.src;

  return galleryItemPoster(images[0]);
}
