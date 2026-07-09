const TARGET_COL_WIDTH = 48;
const TARGET_ROW_HEIGHT = 56;
const MIN_COLS = 16;
const NETWORK_OVERLAP_RATIO = 0.2;
const HOVER_HOLD_MS = 2000;

const cellTimeouts = new WeakMap<HTMLElement, number>();
let pointerRaf = 0;

function getViewportWidth() {
  return document.documentElement.clientWidth;
}

function snapHeightToRows(height: number) {
  const rowCount = Math.max(8, Math.ceil(height / TARGET_ROW_HEIGHT));
  return rowCount * TARGET_ROW_HEIGHT;
}

function activateCell(cell: HTMLElement) {
  cell.classList.add('is-lit');

  const existing = cellTimeouts.get(cell);
  if (existing !== undefined) window.clearTimeout(existing);

  const timeout = window.setTimeout(() => {
    cell.classList.remove('is-lit');
    cellTimeouts.delete(cell);
  }, HOVER_HOLD_MS);

  cellTimeouts.set(cell, timeout);
}

function getGridCellAtPoint(x: number, y: number) {
  const stack = document.elementsFromPoint(x, y);

  for (const node of stack) {
    if (!(node instanceof HTMLElement)) continue;
    if (getComputedStyle(node).pointerEvents === 'none') continue;

    const cell = node.closest('.about-hero-grid__cell');
    return cell instanceof HTMLElement ? cell : null;
  }

  return null;
}

function bindGridPointerTracking() {
  if (document.documentElement.dataset.aboutGridPointerBound === 'true') return;
  document.documentElement.dataset.aboutGridPointerBound = 'true';

  document.addEventListener('mousemove', (event) => {
    if (!document.body.classList.contains('is-about')) return;

    const grid = document.querySelector<HTMLElement>('[data-about-hero-grid]');
    if (!grid) return;

    const { clientX, clientY } = event;
    const gridRect = grid.getBoundingClientRect();
    if (
      clientY < gridRect.top ||
      clientY > gridRect.bottom ||
      clientX < gridRect.left ||
      clientX > gridRect.right
    ) {
      return;
    }

    if (pointerRaf) return;
    pointerRaf = window.requestAnimationFrame(() => {
      pointerRaf = 0;
      const cell = getGridCellAtPoint(clientX, clientY);
      if (cell) activateCell(cell);
    });
  });
}

function createGridCell() {
  const cell = document.createElement('div');
  cell.className = 'about-hero-grid__cell';
  return cell;
}

function buildGridCells(container: HTMLElement, width: number, height: number) {
  if (height <= 0 || width <= 0) return;

  const colCount = Math.max(MIN_COLS, Math.round(width / TARGET_COL_WIDTH));
  const rowCount = Math.max(8, Math.ceil(height / TARGET_ROW_HEIGHT));
  const cellWidth = width / colCount;
  const cellHeight = TARGET_ROW_HEIGHT;
  const gridHeight = rowCount * cellHeight;
  const total = colCount * rowCount;

  container.style.gridTemplateColumns = `repeat(${colCount}, ${cellWidth}px)`;
  container.style.gridTemplateRows = `repeat(${rowCount}, ${cellHeight}px)`;
  container.style.width = `${width}px`;
  container.style.height = `${gridHeight}px`;

  if (container.childElementCount !== total) {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < total; index += 1) {
      fragment.appendChild(createGridCell());
    }

    container.replaceChildren(fragment);
  }

  return gridHeight;
}

function measureGridHeight(page: HTMLElement, network: HTMLElement | null) {
  const pageDocTop = page.getBoundingClientRect().top + window.scrollY;

  if (!network) {
    return snapHeightToRows(Math.max(window.innerHeight * 0.55, 320));
  }

  const networkRect = network.getBoundingClientRect();
  const endY = networkRect.top + window.scrollY + networkRect.height * NETWORK_OVERLAP_RATIO;
  return snapHeightToRows(Math.max(endY - pageDocTop, 280));
}

export function initAboutIntroGrid() {
  if (!document.body.classList.contains('is-about')) return;

  const page = document.querySelector<HTMLElement>('.about-page');
  const grid = document.querySelector<HTMLElement>('[data-about-hero-grid]');
  const cellsContainer = document.querySelector<HTMLElement>('[data-about-hero-grid-cells]');
  if (!page || !grid || !cellsContainer) return;

  const getNetwork = () =>
    document.querySelector<HTMLElement>('.about-intro__network .identity-sphere') ??
    document.querySelector<HTMLElement>('.about-intro__network');

  const refresh = () => {
    const width = getViewportWidth();
    const height = measureGridHeight(page, getNetwork());
    const gridHeight = buildGridCells(cellsContainer, width, height) ?? height;
    grid.style.width = `${width}px`;
    grid.style.height = `${gridHeight}px`;
  };

  refresh();
  bindGridPointerTracking();

  if (grid.dataset.gridReady === 'true') return;
  grid.dataset.gridReady = 'true';

  window.addEventListener('resize', refresh);
  document.fonts?.ready.then(refresh).catch(() => undefined);

  const resizeObserver = new ResizeObserver(() => refresh());
  resizeObserver.observe(page);

  const networkContainer = document.querySelector('.about-intro__network');
  if (networkContainer) resizeObserver.observe(networkContainer);

  const network = getNetwork();
  if (network) resizeObserver.observe(network);

  let attempts = 0;
  const waitForNetwork = () => {
    const nextNetwork = getNetwork();
    if (nextNetwork && nextNetwork !== network) {
      resizeObserver.observe(nextNetwork);
      refresh();
      return;
    }

    attempts += 1;
    if (attempts < 40) window.requestAnimationFrame(waitForNetwork);
  };

  waitForNetwork();
}
