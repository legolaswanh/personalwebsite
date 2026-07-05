function getPremiereLabel(tools: HTMLElement) {
  const labels = [...tools.querySelectorAll<HTMLElement>('.tool-icon__label')];
  return (
    labels.find((label) => label.textContent?.trim() === 'Premiere Pro') ??
    labels[3] ??
    null
  );
}

export function alignIxdSectionTools(section: HTMLElement) {
  const tools = section.querySelector<HTMLElement>('.chapter-header__tools');
  const stage = section.querySelector<HTMLElement>('[data-gallery-stage]');
  const premiere = tools ? getPremiereLabel(tools) : null;

  if (!tools || !stage || !premiere) return;

  const stageRect = stage.getBoundingClientRect();
  if (!stageRect.width) return;

  tools.style.transform = '';

  const premiereRight = premiere.getBoundingClientRect().right;
  const shift = stageRect.right - premiereRight;

  tools.style.transform = Math.abs(shift) < 0.5 ? '' : `translateX(${shift}px)`;
}

function bindIxdToolsAlign(section: HTMLElement) {
  if (section.dataset.ixdToolsAlignBound === 'true') return;
  section.dataset.ixdToolsAlignBound = 'true';

  const tools = section.querySelector<HTMLElement>('.chapter-header__tools');
  const stage = section.querySelector<HTMLElement>('[data-gallery-stage]');
  const image = section.querySelector<HTMLImageElement>('[data-gallery-main]');
  const premiere = tools ? getPremiereLabel(tools) : null;

  const scheduleAlign = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => alignIxdSectionTools(section));
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
    if (premiere) observer.observe(premiere);
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

export function initIxdToolsAlign(root: ParentNode = document) {
  root
    .querySelectorAll<HTMLElement>(
      '.ixd-section.chapter-page, .research-section.chapter-page',
    )
    .forEach((section) => {
      bindIxdToolsAlign(section);
    });
}
