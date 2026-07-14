const CHAPTER_DESIGN_W = 1680;
const CHAPTER_DESIGN_H = 1080;
const MIN_CHAPTER_SCALE = 0.55;
const SCALE_EPSILON = 0.005;

const PROJECT_CHAPTER_SELECTOR =
  '.games-section.chapter-page[data-chapter-page], .ixd-section.chapter-page[data-chapter-page], .research-section.chapter-page[data-chapter-page]';

function getChapterScale(section: HTMLElement) {
  return parseFloat(
    getComputedStyle(section).getPropertyValue('--chapter-scale') || '1',
  );
}

function computeBaseChapterScale() {
  const widthScale = Math.min(1, window.innerWidth / CHAPTER_DESIGN_W);
  const heightScale = Math.min(1, window.innerHeight / CHAPTER_DESIGN_H);
  return Math.max(MIN_CHAPTER_SCALE, Math.min(widthScale, heightScale));
}

function setChapterScale(section: HTMLElement, scale: number) {
  const clamped = Math.max(MIN_CHAPTER_SCALE, Math.min(1, scale));
  section.style.setProperty('--chapter-scale', String(clamped));

  if (clamped < 1 - SCALE_EPSILON) {
    section.dataset.chapterScaled = 'true';
  } else {
    section.removeAttribute('data-chapter-scaled');
  }
}

function chapterInfoOverflows(section: HTMLElement) {
  const info = section.querySelector<HTMLElement>('.chapter-showcase .chapter-info');
  if (!info) return false;

  return info.scrollHeight > info.clientHeight + 1;
}

function fitChapterInfo(section: HTMLElement, baseScale: number) {
  let scale = baseScale;

  for (let i = 0; i < 24; i += 1) {
    setChapterScale(section, scale);
    void section.offsetHeight;

    if (!chapterInfoOverflows(section)) {
      return;
    }

    if (scale <= MIN_CHAPTER_SCALE + SCALE_EPSILON) {
      return;
    }

    scale = Math.max(MIN_CHAPTER_SCALE, scale - 0.03);
  }
}

function syncChapterSection(section: HTMLElement) {
  const baseScale = computeBaseChapterScale();
  fitChapterInfo(section, baseScale);
}

function bindChapterLayout(section: HTMLElement) {
  if (section.dataset.chapterLayoutBound === 'true') return;
  section.dataset.chapterLayoutBound = 'true';

  const scheduleSync = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => syncChapterSection(section));
    });
  };

  scheduleSync();
  window.addEventListener('resize', scheduleSync, { passive: true });
  document.fonts?.ready.then(scheduleSync);

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(scheduleSync);
    const frame = section.querySelector('.chapter-page__frame');
    const showcase = section.querySelector('.chapter-showcase');
    const info = section.querySelector('.chapter-showcase .chapter-info');
    if (frame) observer.observe(frame);
    if (showcase) observer.observe(showcase);
    if (info) observer.observe(info);
  }

  const mutationObserver = new MutationObserver(scheduleSync);
  mutationObserver.observe(section, {
    attributes: true,
    attributeFilter: ['data-active-project', 'data-mask-tone'],
    subtree: true,
    childList: true,
    characterData: true,
  });
}

export function initChapterLayout(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>(PROJECT_CHAPTER_SELECTOR).forEach((section) => {
    bindChapterLayout(section);
  });
}

export function syncChapterLayout() {
  document.querySelectorAll<HTMLElement>(PROJECT_CHAPTER_SELECTOR).forEach((section) => {
    syncChapterSection(section);
  });
}

export function getProjectChapterScale(section: HTMLElement) {
  return getChapterScale(section);
}
