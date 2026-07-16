import fs from 'node:fs';
import path from 'node:path';

const HERO_CANDIDATES = ['hero.jpg', 'hero.jpeg', 'hero.png'] as const;

/** Resolve hero image path at build time: prefer JPG, then PNG. */
export function resolveCaseStudyHero(publicBase: string): string {
  const dir = path.join(process.cwd(), 'public', ...publicBase.replace(/^\//, '').split('/'));

  for (const filename of HERO_CANDIDATES) {
    if (fs.existsSync(path.join(dir, filename))) {
      return `${publicBase}/${filename}`;
    }
  }

  return `${publicBase}/hero.jpg`;
}
