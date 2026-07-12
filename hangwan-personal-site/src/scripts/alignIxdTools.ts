function getFirstRowEndLabel(tools: HTMLElement) {
  const icons = [...tools.querySelectorAll<HTMLElement>('.tool-icon')];
  return icons[3]?.querySelector<HTMLElement>('.tool-icon__label') ?? null;
}

export function alignChapterSectionTools(section: HTMLElement) {
  const tools = section.querySelector<HTMLElement>('.chapter-header__tools');
  const stage = section.querySelector<HTMLElement>('[data-gallery-stage]');
  const anchor = tools ? getFirstRowEndLabel(tools) : null;

  if (!tools || !stage || !anchor) return;

  const stageRect = stage.getBoundingClientRect();
  if (!stageRect.width) return;

  tools.style.transform = '';

  const anchorRight = anchor.getBoundingClientRect().right;
  const shift = stageRect.right - anchorRight;

  tools.style.transform = Math.abs(shift) < 0.5 ? '' : `translateX(${shift}px)`;
}

/** @deprecated Use alignChapterSectionTools */
export const alignIxdSectionTools = alignChapterSectionTools;

function bindChapterToolsAlign(section: HTMLElement) {
  if (section.dataset.chapterToolsAlignBound === 'true') return;
  section.dataset.chapterToolsAlignBound = 'true';

  const tools = section.querySelector<HTMLElement>('.chapter-header__tools');
  const stage = section.querySelector<HTMLElement>('[data-gallery-stage]');
  const image = section.querySelector<HTMLImageElement>('[data-gallery-main]');
  const anchor = tools ? getFirstRowEndLabel(tools) : null;

  const scheduleAlign = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => alignChapterSectionTools(section));
    });
  };

  scheduleAlign();
  window.addEventListener('resize', scheduleAlign, { passive: true });
  window.addEventListener('scroll', scheduleAlign, { passive: true });
  document.fonts?.ready.then(scheduleAlign);

  if ('IntersectionObserver' in window) {
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          scheduleAlign();
        }
      },
      { threshold: 0.15 },
    );
    visibilityObserver.observe(section);
  }

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(scheduleAlign);
    if (tools) observer.observe(tools);
    if (stage) observer.observe(stage);
    if (anchor) observer.observe(anchor);
    const frame = section.querySelector('.chapter-page__frame');
    if (frame) observer.observe(frame);
  }

  if (image) {
    image.addEventListener('load', scheduleAlign);
    const imageObserver = new MutationObserver(scheduleAlign);
    imageObserver.observe(image, { attributes: true, attributeFilter: ['src'] });
  }

  const sectionObserver = new MutationObserver(scheduleAlign);
  sectionObserver.observe(section, {
    attributes: true,
    attributeFilter: ['data-active-project', 'data-mask-tone'],
  });
}

export function initChapterToolsAlign(root: ParentNode = document) {
  root
    .querySelectorAll<HTMLElement>(
      '.games-section.chapter-page, .ixd-section.chapter-page',
    )
    .forEach((section) => {
      bindChapterToolsAlign(section);
    });
}

/** @deprecated Use initChapterToolsAlign */
export const initIxdToolsAlign = initChapterToolsAlign;
