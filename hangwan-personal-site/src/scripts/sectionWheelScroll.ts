const COMMIT_THRESHOLD = 165;
const ACCUMULATOR_RESET_MS = 220;
const TRANSITION_LOCK_MS = 900;
const BOUNDARY_TOLERANCE = 6;
const EDGE_ARM_DELAY_MS = 180;

type BoundaryEdge = 'top' | 'bottom';

type SectionWheelState = {
  accumulatedDelta: number;
  resetTimer: number | null;
  edgeArmTimer: number | null;
  isLocked: boolean;
  edgeArmed: boolean;
  parkedEdge: BoundaryEdge | null;
  onWheel: (event: WheelEvent) => void;
  onScroll: () => void;
};

let state: SectionWheelState | null = null;

function getSections(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('.page-section'));
}

function getCurrentSectionIndex(sections: HTMLElement[], scrollY: number, viewportHeight: number) {
  const probe = scrollY + viewportHeight * 0.32;

  for (let index = sections.length - 1; index >= 0; index -= 1) {
    if (probe >= sections[index].offsetTop) return index;
  }

  return 0;
}

function isAtSectionTop(section: HTMLElement, scrollY: number) {
  return scrollY <= section.offsetTop + BOUNDARY_TOLERANCE;
}

function isAtSectionBottom(section: HTMLElement, scrollY: number, viewportHeight: number) {
  const sectionBottom = section.offsetTop + section.offsetHeight;
  return scrollY + viewportHeight >= sectionBottom - BOUNDARY_TOLERANCE;
}

function isTallSection(section: HTMLElement, viewportHeight: number) {
  return section.offsetHeight > viewportHeight + BOUNDARY_TOLERANCE * 2;
}

function pinScrollToSectionTop(section: HTMLElement) {
  if (window.scrollY < section.offsetTop) {
    window.scrollTo({ top: section.offsetTop, behavior: 'auto' });
  }
}

function pinScrollToSectionBottom(section: HTMLElement, viewportHeight: number) {
  const maxScroll = section.offsetTop + section.offsetHeight - viewportHeight;
  if (window.scrollY > maxScroll) {
    window.scrollTo({ top: maxScroll, behavior: 'auto' });
  }
}

function resetAccumulator() {
  if (!state) return;
  state.accumulatedDelta = 0;
}

function resetEdgeState() {
  if (!state) return;

  state.edgeArmed = false;
  state.parkedEdge = null;

  if (state.edgeArmTimer !== null) {
    window.clearTimeout(state.edgeArmTimer);
    state.edgeArmTimer = null;
  }
}

function scheduleAccumulatorReset() {
  if (!state) return;

  if (state.resetTimer !== null) {
    window.clearTimeout(state.resetTimer);
  }

  state.resetTimer = window.setTimeout(() => {
    if (!state) return;

    if (Math.abs(state.accumulatedDelta) < COMMIT_THRESHOLD) {
      resetAccumulator();
    }

    state.resetTimer = null;
  }, ACCUMULATOR_RESET_MS);
}

function scheduleEdgeArm(edge: BoundaryEdge, section: HTMLElement, viewportHeight: number) {
  if (!state) return;

  if (state.edgeArmTimer !== null) {
    window.clearTimeout(state.edgeArmTimer);
  }

  state.edgeArmTimer = window.setTimeout(() => {
    if (!state) return;
    state.edgeArmTimer = null;

    const scrollY = window.scrollY;
    const atTop = isAtSectionTop(section, scrollY);
    const atBottom = isAtSectionBottom(section, scrollY, viewportHeight);

    if (edge === 'bottom' && atBottom) {
      state.edgeArmed = true;
      state.parkedEdge = 'bottom';
    } else if (edge === 'top' && atTop) {
      state.edgeArmed = true;
      state.parkedEdge = 'top';
    }
  }, EDGE_ARM_DELAY_MS);
}

function isInsideScrollableAncestor(target: EventTarget | null, deltaY: number) {
  let element = target instanceof Element ? target : null;

  while (element && element !== document.body) {
    if (!(element instanceof HTMLElement)) break;

    const style = window.getComputedStyle(element);
    const overflowY = style.overflowY;

    if (
      (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
      element.scrollHeight > element.clientHeight + 1
    ) {
      if (deltaY > 0 && element.scrollTop + element.clientHeight < element.scrollHeight - 1) {
        return true;
      }
      if (deltaY < 0 && element.scrollTop > 1) {
        return true;
      }
    }

    element = element.parentElement;
  }

  return false;
}

function commitToSection(target: HTMLElement) {
  if (!state) return;

  state.isLocked = true;
  resetAccumulator();
  resetEdgeState();

  target.scrollIntoView({ behavior: 'smooth' });

  window.setTimeout(() => {
    if (state) state.isLocked = false;
  }, TRANSITION_LOCK_MS);
}

function handleScroll() {
  if (!state || state.isLocked) return;
  if (!document.body.classList.contains('is-home')) return;

  const sections = getSections();
  if (sections.length === 0) return;

  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const currentSection = sections[getCurrentSectionIndex(sections, scrollY, viewportHeight)];

  if (!isTallSection(currentSection, viewportHeight)) return;

  pinScrollToSectionTop(currentSection);
  pinScrollToSectionBottom(currentSection, viewportHeight);
}

function handleWheel(event: WheelEvent) {
  if (!state || state.isLocked) return;
  if (!document.body.classList.contains('is-home')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (isInsideScrollableAncestor(event.target, event.deltaY)) return;

  const sections = getSections();
  if (sections.length < 2) return;

  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const currentIndex = getCurrentSectionIndex(sections, scrollY, viewportHeight);
  const currentSection = sections[currentIndex];
  const nextSection = sections[currentIndex + 1];
  const previousSection = sections[currentIndex - 1];

  const atTop = isAtSectionTop(currentSection, scrollY);
  const atBottom = isAtSectionBottom(currentSection, scrollY, viewportHeight);
  const goingDown = event.deltaY > 0;
  const goingUp = event.deltaY < 0;

  const shouldHandleDown = goingDown && atBottom && Boolean(nextSection);
  const shouldHandleUp = goingUp && atTop && Boolean(previousSection);
  const isTall = isTallSection(currentSection, viewportHeight);

  if (!shouldHandleDown && !shouldHandleUp) {
    if (state.accumulatedDelta !== 0) resetAccumulator();
    resetEdgeState();
    return;
  }

  if (isTall && !state.edgeArmed) {
    event.preventDefault();

    if (shouldHandleDown) {
      pinScrollToSectionBottom(currentSection, viewportHeight);
      scheduleEdgeArm('bottom', currentSection, viewportHeight);
    } else {
      pinScrollToSectionTop(currentSection);
      scheduleEdgeArm('top', currentSection, viewportHeight);
    }

    resetAccumulator();
    return;
  }

  event.preventDefault();

  if (shouldHandleDown) {
    if (state.accumulatedDelta < 0) state.accumulatedDelta = 0;
    state.accumulatedDelta += event.deltaY;

    if (state.accumulatedDelta >= COMMIT_THRESHOLD && nextSection) {
      if (state.resetTimer !== null) {
        window.clearTimeout(state.resetTimer);
        state.resetTimer = null;
      }
      commitToSection(nextSection);
      return;
    }
  } else if (shouldHandleUp) {
    if (state.accumulatedDelta > 0) state.accumulatedDelta = 0;
    state.accumulatedDelta += event.deltaY;

    if (-state.accumulatedDelta >= COMMIT_THRESHOLD && previousSection) {
      if (state.resetTimer !== null) {
        window.clearTimeout(state.resetTimer);
        state.resetTimer = null;
      }
      commitToSection(previousSection);
      return;
    }
  }

  scheduleAccumulatorReset();
}

function cleanupSectionWheelScroll() {
  if (!state) return;

  window.removeEventListener('wheel', state.onWheel);
  window.removeEventListener('scroll', state.onScroll);
  if (state.resetTimer !== null) window.clearTimeout(state.resetTimer);
  if (state.edgeArmTimer !== null) window.clearTimeout(state.edgeArmTimer);
  delete document.documentElement.dataset.sectionWheelInit;
  state = null;
}

export function initSectionWheelScroll() {
  if (!document.body.classList.contains('is-home')) return;
  if (!document.querySelector('.one-page-site')) return;

  if (document.documentElement.dataset.sectionWheelInit === 'true') return;
  document.documentElement.dataset.sectionWheelInit = 'true';

  state = {
    accumulatedDelta: 0,
    resetTimer: null,
    edgeArmTimer: null,
    isLocked: false,
    edgeArmed: false,
    parkedEdge: null,
    onWheel: handleWheel,
    onScroll: handleScroll,
  };

  window.addEventListener('wheel', state.onWheel, { passive: false });
  window.addEventListener('scroll', state.onScroll, { passive: true });
  document.addEventListener('astro:before-swap', cleanupSectionWheelScroll, { once: true });
}
