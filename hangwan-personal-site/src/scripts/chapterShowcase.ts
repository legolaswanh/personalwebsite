import type { ChapterProject } from '../types/chapterProject';

type GalleryImageKey = keyof ChapterProject['images'];

const GALLERY_KEYS: GalleryImageKey[] = [
  'coverImage',
  'gameplayImage1',
  'gameplayImage2',
  'gameplayImage3',
  'gameplayImage4',
];

const GALLERY_LABELS = [
  'Cover',
  'Gameplay 1',
  'Gameplay 2',
  'Gameplay 3',
  'Gameplay 4',
];

function getProjects(section: HTMLElement): ChapterProject[] {
  const dataEl = section.querySelector<HTMLScriptElement>('[data-chapter-projects]');
  if (!dataEl?.textContent) return [];

  try {
    return JSON.parse(dataEl.textContent) as ChapterProject[];
  } catch {
    return [];
  }
}

function initAssetImages(root: ParentNode) {
  root.querySelectorAll('[data-asset-image]').forEach((node) => {
    if (!(node instanceof HTMLImageElement)) return;
    if (node.dataset.assetReady === 'true') return;
    node.dataset.assetReady = 'true';

    const wrap = node.closest('[data-asset-wrap]');

    const markLoaded = () => {
      if (node.naturalWidth > 0) {
        wrap?.classList.add('has-image');
      }
    };

    const markMissing = () => {
      node.classList.add('is-missing');
    };

    if (node.complete) {
      node.naturalWidth > 0 ? markLoaded() : markMissing();
    } else {
      node.addEventListener('load', markLoaded);
      node.addEventListener('error', markMissing);
    }
  });
}

function setGalleryIndex(section: HTMLElement, index: number) {
  const projectId = section.dataset.activeProject;
  if (!projectId) return;

  const project = getProjects(section).find((item) => item.id === projectId);
  if (!project) return;

  const normalized =
    ((index % GALLERY_KEYS.length) + GALLERY_KEYS.length) % GALLERY_KEYS.length;
  section.dataset.galleryIndex = String(normalized);

  const key = GALLERY_KEYS[normalized];
  const src = project.images[key];
  const label = `${project.title} — ${GALLERY_LABELS[normalized]}`;

  const main = section.querySelector<HTMLImageElement>('[data-gallery-main]');
  const placeholder = section.querySelector<HTMLElement>('[data-gallery-placeholder]');
  const stage = section.querySelector<HTMLElement>('[data-gallery-stage]');

  if (main) {
    main.src = src;
    main.alt = label;
    main.classList.remove('is-missing');
    delete main.dataset.assetReady;
    initAssetImages(section);
  }

  if (placeholder) {
    placeholder.textContent = label;
  }

  stage?.classList.remove('has-image');

  section.querySelectorAll('[data-gallery-dot]').forEach((dot, dotIndex) => {
    const isActive = dotIndex === normalized;
    dot.classList.toggle('is-active', isActive);
    dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
}

function renderTags(container: HTMLElement, tags: string[]) {
  container.replaceChildren(
    ...tags.map((tag, index) => {
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.className = `chapter-info__tag${index === 0 ? ' chapter-info__tag--featured' : ''}`;
      span.textContent = tag;
      li.appendChild(span);
      return li;
    }),
  );
}

function renderGalleryDots(section: HTMLElement, project: ChapterProject) {
  const dots = section.querySelector<HTMLElement>('[data-gallery-dots]');
  if (!dots) return;

  dots.replaceChildren(
    ...GALLERY_KEYS.map((_, index) => {
      const label = `${project.title} — ${GALLERY_LABELS[index]}`;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = `chapter-gallery__dot${index === 0 ? ' is-active' : ''}`;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      button.setAttribute('aria-label', label);
      button.dataset.galleryDot = '';

      return button;
    }),
  );
}

function updateShowcase(section: HTMLElement, project: ChapterProject) {
  section.dataset.activeProject = project.id;
  section.dataset.galleryIndex = '0';

  const setText = (selector: string, value: string) => {
    const node = section.querySelector<HTMLElement>(selector);
    if (node) node.textContent = value;
  };

  setText('[data-info-label]', project.label);
  setText('[data-info-title]', project.title);
  setText('[data-info-category]', project.category);
  setText('[data-info-role]', project.role);
  setText('[data-info-focus]', project.focus);
  setText('[data-info-summary]', project.summary);

  const tags = section.querySelector<HTMLElement>('[data-info-tags]');
  if (tags) renderTags(tags, project.tags);

  const cta = section.querySelector<HTMLAnchorElement>('[data-info-cta]');
  if (cta) {
    if (project.href) {
      cta.href = project.href;
      cta.classList.remove('chapter-info__cta--disabled');
      cta.removeAttribute('aria-disabled');
      cta.tabIndex = 0;
    } else {
      cta.removeAttribute('href');
      cta.classList.add('chapter-info__cta--disabled');
      cta.setAttribute('aria-disabled', 'true');
      cta.tabIndex = -1;
    }
  }

  renderGalleryDots(section, project);
  setGalleryIndex(section, 0);
}

function setActiveRailItem(section: HTMLElement, projectId: string) {
  section.querySelectorAll('[data-chapter-rail] [data-project-id]').forEach((item) => {
    const isActive = item instanceof HTMLElement && item.dataset.projectId === projectId;
    item.classList.toggle('is-active', isActive);
    item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function bindGalleryControls(section: HTMLElement) {
  section.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const dot = target.closest<HTMLElement>('[data-gallery-dot]');
    if (dot) {
      const index = Array.from(
        section.querySelectorAll('[data-gallery-dot]'),
      ).indexOf(dot);
      if (index >= 0) setGalleryIndex(section, index);
      return;
    }

    if (target.closest('[data-gallery-prev]')) {
      const current = Number(section.dataset.galleryIndex ?? '0');
      setGalleryIndex(section, current - 1);
      return;
    }

    if (target.closest('[data-gallery-next]')) {
      const current = Number(section.dataset.galleryIndex ?? '0');
      setGalleryIndex(section, current + 1);
    }
  });
}

function bindRailControls(section: HTMLElement) {
  const rail = section.querySelector<HTMLElement>('[data-chapter-rail]');
  if (!rail || rail.dataset.railReady === 'true') return;
  rail.dataset.railReady = 'true';

  let isPointerDown = false;
  let hasDragged = false;
  let startX = 0;
  let startScrollLeft = 0;
  const dragThreshold = 5;

  const selectRailItem = (item: HTMLElement) => {
    const projectId = item.dataset.projectId;
    if (!projectId) return;

    const project = getProjects(section).find((entry) => entry.id === projectId);
    if (!project) return;

    updateShowcase(section, project);
    setActiveRailItem(section, project.id);
  };

  const endPointer = (event: PointerEvent) => {
    if (!isPointerDown) return;

    const dragged = hasDragged;
    isPointerDown = false;
    hasDragged = false;
    rail.classList.remove('is-dragging');

    if (rail.hasPointerCapture(event.pointerId)) {
      rail.releasePointerCapture(event.pointerId);
    }

    if (dragged) {
      rail.dataset.suppressClick = 'true';
      window.setTimeout(() => {
        delete rail.dataset.suppressClick;
      }, 0);
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) return;

    const item = target.closest<HTMLElement>('[data-project-id]');
    if (item) selectRailItem(item);
  };

  rail.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;

    isPointerDown = true;
    hasDragged = false;
    startX = event.clientX;
    startScrollLeft = rail.scrollLeft;
  });

  rail.addEventListener('pointermove', (event) => {
    if (!isPointerDown) return;

    const deltaX = event.clientX - startX;
    if (!hasDragged && Math.abs(deltaX) > dragThreshold) {
      hasDragged = true;
      rail.classList.add('is-dragging');
      rail.setPointerCapture(event.pointerId);
    }

    if (!hasDragged) return;

    event.preventDefault();
    rail.scrollLeft = startScrollLeft - deltaX;
  });

  rail.addEventListener('pointerup', endPointer);
  rail.addEventListener('pointercancel', endPointer);

  rail.addEventListener('click', (event) => {
    if (rail.dataset.suppressClick === 'true') {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  rail.addEventListener('dragstart', (event) => {
    event.preventDefault();
  });
}

export function initChapterShowcase(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-chapter-page]').forEach((section) => {
    if (section.dataset.chapterReady === 'true') return;
    section.dataset.chapterReady = 'true';

    const defaultId =
      section.dataset.defaultProject ??
      getProjects(section).find((p) => p.featured)?.id ??
      getProjects(section)[0]?.id;

    if (defaultId) {
      section.dataset.activeProject = defaultId;
      section.dataset.galleryIndex = '0';
    }

    initAssetImages(section);
    bindGalleryControls(section);
    bindRailControls(section);
  });
}
