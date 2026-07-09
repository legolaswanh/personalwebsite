function getSections(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('.page-section'));
}

/** Active section hash: '' for home, '#chapter-N' for chapters. */
export function getActiveSectionHash(): string {
  const sections = getSections();
  if (sections.length === 0) return '';

  const probe = window.scrollY + window.innerHeight * 0.32;

  for (let index = sections.length - 1; index >= 0; index -= 1) {
    if (probe >= sections[index].offsetTop) {
      const { id } = sections[index];
      return id === 'home' ? '' : `#${id}`;
    }
  }

  return '';
}

export function applySectionUrl(hash: string) {
  if (!document.body.classList.contains('is-home')) return;

  const onHomePath = (window.location.pathname.replace(/\/$/, '') || '/') === '/';

  if (!onHomePath) return;

  if (hash) {
    if (window.location.hash !== hash) {
      history.replaceState(null, '', hash);
    }
    return;
  }

  if (window.location.hash) {
    history.replaceState(null, '', '/');
  }
}

export function syncHomeSectionHash() {
  if (document.documentElement.dataset.sectionScrollLock === 'true') return;
  applySectionUrl(getActiveSectionHash());
}

export function scrollToHomeSection(targetId: string): boolean {
  const target = document.querySelector(targetId);
  if (!target) return false;

  target.scrollIntoView({ behavior: 'smooth' });
  applySectionUrl(targetId === '#home' ? '' : targetId);
  return true;
}

export function hashForSectionElement(section: HTMLElement): string {
  return section.id === 'home' ? '' : `#${section.id}`;
}
