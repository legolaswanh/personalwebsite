type LayoutTier = 'desktop' | 'tablet' | 'mobile';

const TIERS = {
  desktop: { w: 1680, h: 1080, maxWidth: 1680 },
  tablet: { w: 800, h: 1080, maxWidth: 800 },
  mobile: { w: 375, h: 1080, maxWidth: 375 },
} as const;

const MOBILE_MAX_WIDTH = 480;
const TABLET_MAX_WIDTH = 900;
const LAPTOP_MAX_HEIGHT = 1100;
const DESKTOP_CANVAS_W = 1680;
const DESKTOP_CANVAS_H = 1080;
const LAPTOP_CONTAINER_MAX = 1280;
const MIN_LAYOUT_SCALE = 0.62;
const MIN_SUBTITLE_WIDTH_RATIO = 1;
const MAX_SUBTITLE_WIDTH_RATIO = 1.1;
const BASE_ILLUSTRATION_MULT = 1.43;

function getLeadingEdgeLeft(element: Element | null) {
  if (!element) return null;

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  const textNode = walker.nextNode();
  if (textNode?.textContent) {
    const offset = textNode.textContent.search(/\S/);
    if (offset >= 0) {
      const range = document.createRange();
      range.setStart(textNode, offset);
      range.setEnd(textNode, offset + 1);
      return range.getBoundingClientRect().left;
    }
  }

  return element.getBoundingClientRect().left;
}

export function pickLayoutTier(): LayoutTier {
  const width = window.innerWidth;

  if (width <= MOBILE_MAX_WIDTH) {
    return 'mobile';
  }

  if (width <= TABLET_MAX_WIDTH) {
    return 'tablet';
  }

  return 'desktop';
}

function isLaptopViewport() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  if (width <= TABLET_MAX_WIDTH) {
    return false;
  }

  return width <= DESKTOP_CANVAS_W || height <= LAPTOP_MAX_HEIGHT;
}

function getDesktopContainerMax() {
  if (!isLaptopViewport()) {
    return DESKTOP_CANVAS_W;
  }

  return Math.min(LAPTOP_CONTAINER_MAX, window.innerWidth - 32);
}

function computeDesktopLayoutScale() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const widthScale = Math.min(1, width / DESKTOP_CANVAS_W);

  if (!isLaptopViewport()) {
    return Math.max(MIN_LAYOUT_SCALE, widthScale);
  }

  const heightScale = Math.min(1, height / DESKTOP_CANVAS_H);
  const wideShortScale = width > DESKTOP_CANVAS_W ? DESKTOP_CANVAS_W / width : 1;

  return Math.max(MIN_LAYOUT_SCALE, Math.min(widthScale, heightScale, wideShortScale));
}

function getLayoutScale(section: HTMLElement) {
  return parseFloat(getComputedStyle(section).getPropertyValue('--layout-scale') || '1');
}

function setLayoutScales(section: HTMLElement, layoutScale: number, identityScale: number) {
  section.style.setProperty('--layout-scale', String(layoutScale));
  document.body.style.setProperty('--layout-scale', String(layoutScale));
  section.style.setProperty('--identity-scale', String(identityScale));
  section.style.setProperty(
    '--illustration-size-mult',
    layoutScale >= 0.99
      ? String(BASE_ILLUSTRATION_MULT)
      : String(BASE_ILLUSTRATION_MULT * layoutScale),
  );
}

function getInitialLayoutScale(section: HTMLElement) {
  return parseFloat(section.dataset.initialLayoutScale || '1');
}

function getLayoutScaleFloor(section: HTMLElement) {
  return Math.max(MIN_LAYOUT_SCALE, getInitialLayoutScale(section));
}

function resetHomeLayout(section: HTMLElement) {
  section.removeAttribute('data-tier');
  section.removeAttribute('data-density');
  section.removeAttribute('data-initial-layout-scale');
  document.body.removeAttribute('data-home-tier');
  document.body.removeAttribute('data-home-density');
  document.body.style.removeProperty('--layout-scale');
  document.body.style.removeProperty('--container');

  setLayoutScales(section, 1, 1);
  section.style.removeProperty('--container');

  const hero = document.querySelector<HTMLElement>('.home-page__hero');
  const index = document.querySelector<HTMLElement>('.home-page__index');
  const projectIndex = document.querySelector<HTMLElement>('.home-section .project-index');
  const composition = document.querySelector<HTMLElement>('.home-illustration__composition');
  const status = document.querySelector<HTMLElement>('.identity-frame__status');

  hero?.style.removeProperty('margin-top');
  hero?.style.removeProperty('margin-left');
  index?.style.removeProperty('margin-left');
  index?.style.removeProperty('margin-top');
  projectIndex?.style.removeProperty('width');
  projectIndex?.style.removeProperty('max-width');
  projectIndex?.style.removeProperty('margin-bottom');
  status?.style.removeProperty('top');
  status?.style.removeProperty('height');

  document.querySelector<HTMLElement>('.slogan-line-sub')?.style.removeProperty('font-size');

  composition?.style.removeProperty('top');
  composition?.style.removeProperty('left');
  composition?.style.removeProperty('width');
  composition?.style.removeProperty('height');
  composition?.style.removeProperty('display');
  composition?.style.removeProperty('transform');
  composition?.style.removeProperty('transform-origin');
  composition?.style.removeProperty('margin-bottom');
}

function applyTierScale(section: HTMLElement, tier: LayoutTier) {
  let layoutScale: number;
  let containerValue: string;

  if (tier === 'desktop') {
    layoutScale = computeDesktopLayoutScale();
    const containerMax = getDesktopContainerMax();
    section.dataset.density = isLaptopViewport() ? 'laptop' : 'default';
    containerValue = `${containerMax}px`;
  } else if (tier === 'tablet') {
    const canvas = TIERS[tier];
    layoutScale = Math.max(MIN_LAYOUT_SCALE, Math.min(1, window.innerWidth / canvas.w));
    section.dataset.density = 'default';
    containerValue = `${TIERS.tablet.maxWidth}px`;
  } else {
    const canvas = TIERS[tier];
    layoutScale = Math.max(MIN_LAYOUT_SCALE, Math.min(1, window.innerWidth / canvas.w));
    section.dataset.density = 'default';
    containerValue = `min(${TIERS.mobile.maxWidth}px, calc(100vw - 2rem))`;
  }

  section.style.setProperty('--container', containerValue);
  document.body.style.setProperty('--container', containerValue);
  section.dataset.initialLayoutScale = String(layoutScale);
  setLayoutScales(section, layoutScale, layoutScale);
}

function syncIdentityAndRules(page: HTMLElement, tier: LayoutTier) {
  const frame = document.querySelector('.identity-frame');
  const leftDivider = document.querySelector('.identity-line__divider');
  const ruleH = document.querySelector('.identity-frame__rule-h');
  const accentLine = document.querySelector('.slogan-line--accent');
  const ruleV = document.querySelector<HTMLElement>('.home-page__rule-v');
  const status = document.querySelector<HTMLElement>('.identity-frame__status');

  if (!frame || !leftDivider || !ruleH || !ruleV || !status) return;

  const pageRect = page.getBoundingClientRect();
  const frameRect = frame.getBoundingClientRect();
  const dividerRect = leftDivider.getBoundingClientRect();
  const ruleHRect = ruleH.getBoundingClientRect();

  const ruleTop = dividerRect.top - pageRect.top;
  ruleV.style.top = `${ruleTop}px`;

  if (tier === 'desktop' && accentLine) {
    const accentRect = accentLine.getBoundingClientRect();
    ruleV.style.height = `${Math.max(0, accentRect.bottom - dividerRect.top)}px`;
  } else if (tier === 'desktop') {
    ruleV.style.height = `${Math.max(0, pageRect.height - ruleTop)}px`;
  }

  if (tier === 'desktop') {
    status.style.top = `${dividerRect.top - frameRect.top}px`;
    status.style.height = `${Math.max(0, ruleHRect.top - dividerRect.top)}px`;
    status.style.removeProperty('left');
    status.style.removeProperty('right');
    status.style.removeProperty('width');
  } else {
    status.style.removeProperty('top');
    status.style.removeProperty('height');
    status.style.removeProperty('left');
    status.style.removeProperty('right');
    status.style.removeProperty('width');
  }
}

function getEditorialDividerX(page: HTMLElement) {
  const pageRect = page.getBoundingClientRect();
  const ruleV = document.querySelector('.home-page__rule-v');
  return ruleV?.getBoundingClientRect().left ?? pageRect.left + pageRect.width * (6 / 7);
}

function syncEditorialAlign() {
  const name = document.querySelector('.identity-line__name');
  const designing = document.querySelector('.home-page__hero .slogan-line--lead');
  const contents = document.querySelector('.home-page__index .project-index');
  const hero = document.querySelector<HTMLElement>('.home-page__hero');
  const index = document.querySelector<HTMLElement>('.home-page__index');

  if (!name || !designing || !contents || !hero || !index) return;

  const refLeft = getLeadingEdgeLeft(name);
  if (refLeft === null) return;

  hero.style.marginLeft = `${refLeft - (getLeadingEdgeLeft(designing) ?? refLeft)}px`;
  index.style.marginLeft = `${refLeft - contents.getBoundingClientRect().left}px`;
}

function measureProjectIndexLinkWidth(link: HTMLElement) {
  const marker = link.querySelector<HTMLElement>('.project-index__marker');
  const title = link.querySelector<HTMLElement>('.project-index__title');
  const arrow = link.querySelector<HTMLElement>('.project-index__arrow');
  const linkStyle = getComputedStyle(link);
  const columnGap = parseFloat(linkStyle.columnGap) || 0;

  const markerWidth = marker?.scrollWidth ?? 0;
  const titleWidth = title?.scrollWidth ?? 0;
  const arrowWidth = arrow?.offsetWidth ?? 0;

  return markerWidth + titleWidth + arrowWidth + columnGap * 2;
}

function syncContentsWidth(tier: LayoutTier) {
  const subtitle = document.querySelector('.slogan-line-sub');
  const projectIndex = document.querySelector<HTMLElement>('.home-section .project-index');
  const page = document.querySelector<HTMLElement>('.home-page');
  if (!subtitle || !projectIndex || !page) return;

  projectIndex.style.removeProperty('width');
  projectIndex.style.removeProperty('max-width');
  void projectIndex.offsetWidth;

  const indexRect = projectIndex.getBoundingClientRect();
  const subtitleRect = subtitle.getBoundingClientRect();
  let width = subtitleRect.right - indexRect.left;

  let maxRowWidth = 0;
  projectIndex.querySelectorAll<HTMLElement>('.project-index__link').forEach((link) => {
    maxRowWidth = Math.max(maxRowWidth, measureProjectIndexLinkWidth(link));
  });
  width = Math.max(width, maxRowWidth);

  if (tier === 'desktop') {
    const dividerX = getEditorialDividerX(page);
    const editorialWidth = dividerX - 14 - indexRect.left;
    width = Math.min(width, editorialWidth);
  }

  width = Math.ceil(Math.max(0, width));

  if (width > 0) {
    projectIndex.style.width = `${width}px`;
    projectIndex.style.maxWidth = `${width}px`;
  }
}

function syncVerticalRhythm() {
  const ruleH = document.querySelector('.identity-frame__rule-h');
  const hero = document.querySelector<HTMLElement>('.home-page__hero');
  const index = document.querySelector<HTMLElement>('.home-page__index');
  const contentsLabel = document.querySelector('.project-index__label');
  if (!ruleH || !hero || !index || !contentsLabel) return;

  hero.style.marginTop = '0px';
  index.style.removeProperty('margin-top');
  void index.offsetHeight;

  const baseIndexMargin = parseFloat(getComputedStyle(index).marginTop) || 0;
  const gapAboveHero = hero.getBoundingClientRect().top - ruleH.getBoundingClientRect().bottom;
  const gapBelowHero =
    contentsLabel.getBoundingClientRect().top - hero.getBoundingClientRect().bottom;
  const indexExtra = Math.max(0, gapAboveHero - gapBelowHero);
  const heroExtra = Math.max(0, gapBelowHero - gapAboveHero);

  hero.style.marginTop = `${heroExtra}px`;
  index.style.marginTop = `${baseIndexMargin + indexExtra}px`;
}

function identityFitsRow() {
  const identityLine = document.querySelector('.identity-line');
  const identityRow = document.querySelector('.identity-frame__row');
  if (!identityLine || !identityRow) return true;

  const lineWidth = identityLine.getBoundingClientRect().width;
  const rowWidth = identityRow.getBoundingClientRect().width;
  return lineWidth <= rowWidth + 1;
}

function statusFitsContainer(tier: LayoutTier) {
  const status = document.querySelector<HTMLElement>('.identity-frame__status');
  const statusText = document.querySelector<HTMLElement>('.identity-frame__status-text');
  const statusAnchor = document.querySelector<HTMLElement>('.identity-frame__status-anchor');
  const statusGlow = document.querySelector<HTMLElement>('.identity-frame__status-glow');
  if (!status || !statusText) return true;

  if (statusText.scrollWidth > statusText.clientWidth + 1) {
    return false;
  }

  const slotRect = status.getBoundingClientRect();
  if (slotRect.width <= 0) return true;

  let contentRight = statusText.getBoundingClientRect().right;
  if (statusGlow) {
    contentRight = Math.max(contentRight, statusGlow.getBoundingClientRect().right);
  }

  if (statusAnchor && tier !== 'desktop') {
    return statusAnchor.scrollWidth <= slotRect.width + 1;
  }

  return contentRight <= slotRect.right + 1;
}

function accentFitsContainer() {
  const accent = document.querySelector('.slogan-line--accent');
  const hero = document.querySelector('.home-page__hero');
  if (!accent || !hero) return true;

  const accentWidth = accent.getBoundingClientRect().width;
  const heroWidth = hero.getBoundingClientRect().width;
  return accentWidth <= heroWidth + 1;
}

function subtitleFitsContainer() {
  const subtitle = document.querySelector('.slogan-line-sub');
  const hero = document.querySelector('.home-page__hero');
  if (!subtitle || !hero) return true;

  const subtitleWidth = subtitle.getBoundingClientRect().width;
  const heroWidth = hero.getBoundingClientRect().width;
  return subtitleWidth <= heroWidth + 1;
}

function subtitleMeetsAccentRatio() {
  const accent = document.querySelector('.slogan-line--accent');
  const subtitle = document.querySelector('.slogan-line-sub');
  if (!accent || !subtitle) return true;

  const accentWidth = accent.getBoundingClientRect().width;
  const subtitleWidth = subtitle.getBoundingClientRect().width;
  if (accentWidth <= 0) return true;

  return (
    subtitleWidth >= accentWidth * MIN_SUBTITLE_WIDTH_RATIO &&
    subtitleWidth <= accentWidth * MAX_SUBTITLE_WIDTH_RATIO
  );
}

function syncSubtitleAccentRatio() {
  const accent = document.querySelector('.slogan-line--accent');
  const subtitle = document.querySelector<HTMLElement>('.slogan-line-sub');
  if (!accent || !subtitle) return;

  subtitle.style.removeProperty('font-size');
  void subtitle.offsetHeight;

  const accentWidth = accent.getBoundingClientRect().width;
  if (accentWidth <= 0) return;

  const minWidth = accentWidth * MIN_SUBTITLE_WIDTH_RATIO;
  const maxWidth = accentWidth * MAX_SUBTITLE_WIDTH_RATIO;
  const cssSize = parseFloat(getComputedStyle(subtitle).fontSize) || 16;

  const measure = (size: number) => {
    subtitle.style.fontSize = `${size}px`;
    void subtitle.offsetWidth;
    return subtitle.getBoundingClientRect().width;
  };

  let low = cssSize * 0.35;
  let high = cssSize * 2.5;

  for (let i = 0; i < 30; i += 1) {
    const mid = (low + high) / 2;
    if (measure(mid) < minWidth) {
      low = mid;
    } else {
      high = mid;
    }
  }

  let width = measure(high);
  if (width > maxWidth) {
    low = cssSize * 0.35;
    high = parseFloat(subtitle.style.fontSize);
    for (let i = 0; i < 30; i += 1) {
      const mid = (low + high) / 2;
      if (measure(mid) > maxWidth) {
        high = mid;
      } else {
        low = mid;
      }
    }
    measure(low);
  }
}

function contentRulesMet(tier: LayoutTier) {
  return (
    subtitleMeetsAccentRatio() &&
    subtitleFitsContainer() &&
    identityFitsRow() &&
    statusFitsContainer(tier) &&
    accentFitsContainer()
  );
}

function enforceContentRules(section: HTMLElement, page: HTMLElement, tier: LayoutTier) {
  const subtitle = document.querySelector<HTMLElement>('.slogan-line-sub');
  const layoutFloor = getLayoutScaleFloor(section);
  let layoutScale = getLayoutScale(section);
  let identityScale = parseFloat(
    getComputedStyle(section).getPropertyValue('--identity-scale') || String(layoutScale),
  );

  for (let i = 0; i < 28; i += 1) {
    setLayoutScales(section, layoutScale, identityScale);
    subtitle?.style.removeProperty('font-size');

    if (tier === 'desktop') {
      syncIdentityAndRules(page, tier);
      if (section.dataset.density === 'laptop') {
        const heroEl = document.querySelector<HTMLElement>('.home-page__hero');
        const indexEl = document.querySelector<HTMLElement>('.home-page__index');
        heroEl?.style.setProperty('margin-top', '0px');
        indexEl?.style.removeProperty('margin-top');
      } else {
        syncVerticalRhythm();
      }
    }

    void section.offsetHeight;
    syncSubtitleAccentRatio();

    if (contentRulesMet(tier)) {
      break;
    }

    if (layoutScale <= layoutFloor && identityScale <= MIN_LAYOUT_SCALE) {
      syncSubtitleAccentRatio();
      break;
    }

    if (!identityFitsRow() || !statusFitsContainer(tier)) {
      if (identityScale > MIN_LAYOUT_SCALE) {
        identityScale = Math.max(MIN_LAYOUT_SCALE, identityScale - 0.05);
        if (tier === 'desktop') {
          syncIdentityAndRules(page, tier);
        }
        continue;
      }
    }

    if (!subtitleMeetsAccentRatio() || !subtitleFitsContainer() || !accentFitsContainer()) {
      if (layoutScale > layoutFloor) {
        layoutScale = Math.max(layoutFloor, layoutScale - 0.035);
        identityScale = Math.min(identityScale, layoutScale);
        continue;
      }
    }
  }

  setLayoutScales(section, layoutScale, identityScale);
}

function getIllustrationBottomRef(index: HTMLElement | null, heroBottom: number) {
  const lastItem = index?.querySelector('.project-index__item:last-child');
  if (lastItem) {
    return lastItem.getBoundingClientRect().bottom;
  }

  return index?.getBoundingClientRect().bottom ?? heroBottom + 400;
}

function positionIllustration(page: HTMLElement, section: HTMLElement) {
  const composition = document.querySelector<HTMLElement>('.home-illustration__composition');
  const hero = document.querySelector<HTMLElement>('.home-page__hero');
  const index = document.querySelector<HTMLElement>('.home-page__index');
  const accentLine = document.querySelector('.slogan-line--accent');
  const ruleV = document.querySelector('.home-page__rule-v');

  if (!composition || !hero) return;

  const pageRect = page.getBoundingClientRect();
  const heroRect = hero.getBoundingClientRect();
  const lineX = ruleV
    ? ruleV.getBoundingClientRect().left
    : pageRect.left + pageRect.width * (6 / 7);

  const bottomRef = getIllustrationBottomRef(index, heroRect.bottom);
  const columnGap = parseFloat(getComputedStyle(page).columnGap) || 0;
  const columnStart = heroRect.right + columnGap;
  const rightPadding = 20;
  const rightEdge = pageRect.right - rightPadding;
  const layoutScale = getLayoutScale(section);
  const extendLeft = Math.min(Math.max(0, lineX - columnStart), 200 * layoutScale);
  const boxLeft = lineX - extendLeft;
  const boxWidth = Math.max(0, rightEdge - boxLeft);

  const accentRect = accentLine?.getBoundingClientRect();
  let top = accentRect
    ? accentRect.top + accentRect.height / 2 - pageRect.top
    : heroRect.top - pageRect.top;
  const height = bottomRef - (pageRect.top + top);

  const illustrationMult =
    parseFloat(getComputedStyle(section).getPropertyValue('--illustration-size-mult')) ||
    BASE_ILLUSTRATION_MULT;

  const useComfortableIllustration = layoutScale >= 0.99;
  const scaledHeight =
    Math.max(useComfortableIllustration ? 320 : 320 * layoutScale, height) * illustrationMult;
  top -= scaledHeight * 0.3;

  const scaledWidth =
    Math.max(useComfortableIllustration ? 280 : 280 * layoutScale, boxWidth) * illustrationMult;
  const shiftLeft = scaledWidth * 0.2;
  let leftPos = boxLeft - pageRect.left - shiftLeft;
  const maxLeft = pageRect.width - scaledWidth - rightPadding;

  if (leftPos > maxLeft) {
    leftPos = Math.max(0, maxLeft);
  }

  composition.style.removeProperty('display');
  composition.style.top = `${top}px`;
  composition.style.left = `${leftPos}px`;
  composition.style.width = `${scaledWidth}px`;
  composition.style.height = `${scaledHeight}px`;

  const viewportPadding = 16;
  const maxRight = window.innerWidth - viewportPadding;
  let rightmost = composition.getBoundingClientRect().right;

  composition.querySelectorAll('.home-illustration__polaroid').forEach((polaroid) => {
    rightmost = Math.max(rightmost, polaroid.getBoundingClientRect().right);
  });

  if (rightmost > maxRight) {
    leftPos -= rightmost - maxRight;
    composition.style.left = `${Math.max(0, leftPos)}px`;
  }
}

function clearAbsoluteIllustration() {
  const composition = document.querySelector<HTMLElement>('.home-illustration__composition');
  if (!composition) return;

  composition.style.removeProperty('top');
  composition.style.removeProperty('left');
  composition.style.removeProperty('width');
  composition.style.removeProperty('height');
  composition.style.removeProperty('display');
  composition.style.removeProperty('transform');
  composition.style.removeProperty('transform-origin');
}

export function syncPageContainer(target: HTMLElement = document.body) {
  const tier = pickLayoutTier();
  let containerValue: string;

  if (tier === 'desktop') {
    containerValue = `${getDesktopContainerMax()}px`;
    target.dataset.homeTier = tier;
    if (isLaptopViewport()) {
      target.dataset.homeDensity = 'laptop';
    } else {
      target.removeAttribute('data-home-density');
    }
  } else if (tier === 'tablet') {
    containerValue = `${TIERS.tablet.maxWidth}px`;
    target.dataset.homeTier = tier;
    target.removeAttribute('data-home-density');
  } else {
    containerValue = `min(${TIERS.mobile.maxWidth}px, calc(100vw - 2rem))`;
    target.dataset.homeTier = tier;
    target.removeAttribute('data-home-density');
  }

  target.style.setProperty('--container', containerValue);
}

export function syncIllustrationSlot() {
  const section = document.querySelector<HTMLElement>('.home-section');
  const page = document.querySelector<HTMLElement>('.home-page');
  if (!section || !page || section.dataset.tier !== 'desktop') {
    clearAbsoluteIllustration();
    return;
  }

  positionIllustration(page, section);
}

function applyTierPostLayout(section: HTMLElement, page: HTMLElement, tier: LayoutTier) {
  syncEditorialAlign();
  syncContentsWidth(tier);

  if (tier === 'desktop') {
    syncIdentityAndRules(page, tier);
    positionIllustration(page, section);
    return;
  }

  clearAbsoluteIllustration();
}

export function syncHomeLayout() {
  const section = document.querySelector<HTMLElement>('.home-section');
  const page = document.querySelector<HTMLElement>('.home-page');

  if (!section || !page) return;

  resetHomeLayout(section);

  const tier = pickLayoutTier();
  section.dataset.tier = tier;
  document.body.dataset.homeTier = tier;
  if (tier === 'desktop' && isLaptopViewport()) {
    document.body.dataset.homeDensity = 'laptop';
  } else {
    document.body.removeAttribute('data-home-density');
  }

  applyTierScale(section, tier);
  enforceContentRules(section, page, tier);
  applyTierPostLayout(section, page, tier);
}
