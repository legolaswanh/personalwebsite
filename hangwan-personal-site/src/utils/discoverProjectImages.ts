import fs from 'node:fs';
import path from 'node:path';
import type { ChapterGalleryImageItem } from './chapterGallery';

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;

function labelForFile(filename: string): string {
  if (/^cover\./i.test(filename)) return 'Cover';

  const gameplayMatch = filename.match(/^gameplay-(\d+)\./i);
  if (gameplayMatch) return `Image ${gameplayMatch[1]}`;

  const base = filename.replace(/\.[^.]+$/, '');
  return base
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function sortKey(filename: string): number {
  if (/^cover\./i.test(filename)) return 0;

  const gameplayMatch = filename.match(/^gameplay-(\d+)\./i);
  if (gameplayMatch) return 1000 + Number(gameplayMatch[1]);

  return 2000;
}

/** Scan public/{chapter}/{slug}/ at build time and return gallery images in display order. */
export function discoverProjectImages(
  publicBase: string,
  slug: string,
): ChapterGalleryImageItem[] {
  const dir = path.join(
    process.cwd(),
    'public',
    ...publicBase.replace(/^\//, '').split('/'),
    slug,
  );

  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((file) => IMAGE_EXT.test(file))
    .sort((a, b) => {
      const order = sortKey(a) - sortKey(b);
      return order !== 0 ? order : a.localeCompare(b);
    });

  return files.map((file) => ({
    type: 'image' as const,
    src: `${publicBase}/${slug}/${file}`,
    label: labelForFile(file),
  }));
}

export type {
  ChapterGalleryImage,
  ChapterGalleryImageItem,
  ChapterGalleryItem,
  ChapterGalleryYoutubeItem,
} from './chapterGallery';

export { galleryItemPoster, projectCoverImage } from './chapterGallery';
