import type { ChapterProject } from '../types/chapterProject';
import { CHAPTER_DEFAULT_ROLE_LABEL } from '../types/chapterProject';
import type {
  ChapterGalleryImageItem,
  ChapterGalleryYoutubeItem,
} from '../utils/chapterGallery';
import { galleryItemPoster } from '../utils/chapterGallery';
import { youtubeEmbedUrl } from '../utils/parseYoutubeId';
import { alignIxdSectionTools } from './alignIxdTools';

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

function clearYoutubeEmbed(section: HTMLElement) {
  const container = section.querySelector<HTMLElement>('[data-gallery-youtube]');
  if (!container) return;

  container.replaceChildren();
  container.hidden = true;
  section.querySelector('[data-gallery-stage]')?.classList.remove('is-youtube-active');
}

function showImageItem(
  section: HTMLElement,
  item: ChapterGalleryImageItem,
  label: string,
) {
  clearYoutubeEmbed(section);

  const main = section.querySelector<HTMLImageElement>('[data-gallery-main]');
  const placeholder = section.querySelector<HTMLElement>('[data-gallery-placeholder]');
  const stage = section.querySelector<HTMLElement>('[data-gallery-stage]');

  stage?.classList.remove('has-image');

  if (main) {
    main.removeAttribute('crossorigin');
    main.classList.remove('is-gallery-media-hidden');
    main.src = item.src;
    main.alt = label;
    main.classList.remove('is-missing');
    delete main.dataset.assetReady;
    initAssetImages(section);
  }

  if (placeholder) {
    placeholder.textContent = label;
  }
}

function showYoutubeItem(
  section: HTMLElement,
  item: ChapterGalleryYoutubeItem,
  label: string,
) {
  const main = section.querySelector<HTMLImageElement>('[data-gallery-main]');
  const container = section.querySelector<HTMLElement>('[data-gallery-youtube]');
  const placeholder = section.querySelector<HTMLElement>('[data-gallery-placeholder]');
  const stage = section.querySelector<HTMLElement>('[data-gallery-stage]');

  clearYoutubeEmbed(section);

  stage?.classList.remove('has-image');

  const poster = galleryItemPoster(item);

  if (main) {
    main.crossOrigin = 'anonymous';
    main.classList.add('is-gallery-media-hidden');
    main.src = poster;
    main.alt = label;
    main.classList.remove('is-missing');
    delete main.dataset.assetReady;
    initAssetImages(section);
  }

  if (placeholder) {
    placeholder.textContent = label;
  }

  if (container) {
    container.hidden = false;
    stage?.classList.add('is-youtube-active');
    stage?.classList.add('has-image');

    const iframe = document.createElement('iframe');
    iframe.className = 'chapter-gallery__youtube-iframe';
    iframe.src = youtubeEmbedUrl(item.videoId);
    iframe.title = label;
    iframe.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
    );
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    container.appendChild(iframe);
  }
}

function setGalleryIndex(section: HTMLElement, index: number) {
  const projectId = section.dataset.activeProject;
  if (!projectId) return;

  const project = getProjects(section).find((item) => item.id === projectId);
  if (!project || project.images.length === 0) return;

  const normalized =
    ((index % project.images.length) + project.images.length) %
    project.images.length;
  section.dataset.galleryIndex = String(normalized);

  const galleryItem = project.images[normalized];
  const label = `${project.title} — ${galleryItem.label}`;

  if (galleryItem.type === 'youtube') {
    showYoutubeItem(section, galleryItem, label);
  } else {
    showImageItem(section, galleryItem, label);
  }

  section.querySelectorAll('[data-gallery-dot]').forEach((dot, dotIndex) => {
    const isActive = dotIndex === normalized;
    dot.classList.toggle('is-active', isActive);
    dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
}

function renderTags(
  container: HTMLElement,
  highlightTags: string[],
  tags: string[],
) {
  const createTag = (tag: string, featured: boolean) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.className = `chapter-info__tag${featured ? ' chapter-info__tag--featured' : ''}`;
    span.textContent = tag;
    li.appendChild(span);
    return li;
  };

  container.replaceChildren(
    ...highlightTags.map((tag) => createTag(tag, true)),
    ...tags.map((tag) => createTag(tag, false)),
  );
}

function syncGalleryControls(section: HTMLElement, imageCount: number) {
  const stage = section.querySelector<HTMLElement>('[data-gallery-stage]');
  if (!stage) return;

  stage.dataset.galleryCount = String(imageCount);
}

function renderGalleryDots(section: HTMLElement, project: ChapterProject) {
  const dots = section.querySelector<HTMLElement>('[data-gallery-dots]');
  if (!dots) return;

  dots.replaceChildren(
    ...project.images.map((item, index) => {
      const label = `${project.title} — ${item.label}`;

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
  setText('[data-info-role-label]', project.roleLabel ?? CHAPTER_DEFAULT_ROLE_LABEL);
  setText('[data-info-role]', project.role);
  setText('[data-info-summary]', project.summary);

  const tags = section.querySelector<HTMLElement>('[data-info-tags]');
  if (tags) renderTags(tags, project.highlightTags, project.tags);

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
  syncGalleryControls(section, project.images.length);
  setGalleryIndex(section, 0);

  if (section.classList.contains('ixd-section')) {
    requestAnimationFrame(() => alignIxdSectionTools(section));
  }
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
    if (!project || project.railDisabled) return;

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

      const defaultProject = getProjects(section).find((p) => p.id === defaultId);
      if (defaultProject) {
        syncGalleryControls(section, defaultProject.images.length);
        setGalleryIndex(section, 0);
      }
    }

    initAssetImages(section);
    bindGalleryControls(section);
    bindRailControls(section);
  });
}
