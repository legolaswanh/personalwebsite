const FALLBACK_MASK: [number, number, number] = [212, 210, 204];
const LUMINANCE_TEXT_THRESHOLD = 0.58;
const RIGHT_EDGE_SAMPLE_RATIO = 0.02;

function getLuminance([r, g, b]: [number, number, number]) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function sampleRightEdgeDominantColor(img: HTMLImageElement): [number, number, number] {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context || !img.naturalWidth || !img.naturalHeight) {
    return FALLBACK_MASK;
  }

  const stripWidth = Math.max(2, Math.ceil(img.naturalWidth * RIGHT_EDGE_SAMPLE_RATIO));
  const sourceX = img.naturalWidth - stripWidth;
  const sampleHeight = Math.min(img.naturalHeight, 128);

  canvas.width = stripWidth;
  canvas.height = sampleHeight;

  try {
    context.drawImage(
      img,
      sourceX,
      0,
      stripWidth,
      img.naturalHeight,
      0,
      0,
      stripWidth,
      sampleHeight,
    );

    const { data } = context.getImageData(0, 0, stripWidth, sampleHeight);
    const buckets = new Map<number, { red: number; green: number; blue: number; count: number }>();

    for (let index = 0; index < data.length; index += 4) {
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const key = ((red >> 4) << 8) | ((green >> 4) << 4) | (blue >> 4);

      const bucket = buckets.get(key) ?? { red: 0, green: 0, blue: 0, count: 0 };
      bucket.red += red;
      bucket.green += green;
      bucket.blue += blue;
      bucket.count += 1;
      buckets.set(key, bucket);
    }

    if (!buckets.size) return FALLBACK_MASK;

    let dominant = { red: FALLBACK_MASK[0], green: FALLBACK_MASK[1], blue: FALLBACK_MASK[2], count: 0 };

    for (const bucket of buckets.values()) {
      if (bucket.count > dominant.count) {
        dominant = {
          red: Math.round(bucket.red / bucket.count),
          green: Math.round(bucket.green / bucket.count),
          blue: Math.round(bucket.blue / bucket.count),
          count: bucket.count,
        };
      }
    }

    return [dominant.red, dominant.green, dominant.blue];
  } catch {
    return FALLBACK_MASK;
  }
}

function applyMaskPalette(section: HTMLElement) {
  const stage = section.querySelector<HTMLElement>('[data-gallery-stage]');
  const image = section.querySelector<HTMLImageElement>('[data-gallery-main]');
  if (!stage || !image) return;

  const [red, green, blue] = sampleRightEdgeDominantColor(image);
  const luminance = getLuminance([red, green, blue]);

  stage.style.setProperty('--games-new-mask-r', String(red));
  stage.style.setProperty('--games-new-mask-g', String(green));
  stage.style.setProperty('--games-new-mask-b', String(blue));
  stage.style.setProperty('--games-new-mask-color', `rgb(${red}, ${green}, ${blue})`);
  section.dataset.maskTone = luminance >= LUMINANCE_TEXT_THRESHOLD ? 'light' : 'dark';
}

function scheduleMaskPalette(section: HTMLElement) {
  const image = section.querySelector<HTMLImageElement>('[data-gallery-main]');
  if (!image) return;

  const update = () => applyMaskPalette(section);

  if (image.complete && image.naturalWidth > 0) {
    update();
    return;
  }

  image.addEventListener('load', update, { once: true });
  image.addEventListener('error', () => applyMaskPalette(section), { once: true });
}

function observeGalleryImage(section: HTMLElement) {
  const image = section.querySelector<HTMLImageElement>('[data-gallery-main]');
  if (!image || image.dataset.gamesChapterObserved === 'true') return;

  image.dataset.gamesChapterObserved = 'true';

  const observer = new MutationObserver((records) => {
    const srcChanged = records.some(
      (record) => record.type === 'attributes' && record.attributeName === 'src',
    );

    if (srcChanged) {
      scheduleMaskPalette(section);
    }
  });

  observer.observe(image, { attributes: true, attributeFilter: ['src'] });
}

export function initGamesChapterGallery(root: ParentNode = document) {
  root
    .querySelectorAll<HTMLElement>(
      '.games-section.chapter-page[data-chapter-page], .ixd-section.chapter-page[data-chapter-page], .research-section.chapter-page[data-chapter-page]',
    )
    .forEach((section) => {
      if (!section.dataset.maskTone) {
        section.dataset.maskTone = 'light';
      }

      scheduleMaskPalette(section);
      observeGalleryImage(section);
    });
}
