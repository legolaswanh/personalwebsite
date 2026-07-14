import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  MOBILE_BREAKPOINT,
  getConnectedNodeIds,
  mobileSkillGroups,
  skillNodes,
  type SkillNode,
} from '../../data/skillNetwork';
import { aboutCenterIcons, aboutNetworkCursors } from '../../data/aboutAssets';
import {
  depthFactor,
  lerp,
  projectPoint,
  type ProjectedPoint,
  type Rotation,
} from '../../utils/sphereProjection';

const DRAG_SENSITIVITY = 0.0048;
/** Screen-space drag speed during auto-rotate (px/s), using the same drag mapping */
const AUTO_ROTATE_SPEED_PX_PER_SEC = 10;
/** 5° below horizontal, toward bottom-right */
const AUTO_ROTATE_DIRECTION_RAD = (5 * Math.PI) / 180;
const ROTATE_X_LIMIT = Math.PI / 2.15;

type ProjectedNodes = Record<string, ProjectedPoint>;

const NETWORK_SCALE = 1.4;
const CENTER_IMAGE_DRAG_THRESHOLD = 0.15;
/** Sort center slightly behind the ellipsoid mid-plane so front nodes can pass over it */
const CENTER_DEPTH_BIAS = 0.15;

type DepthStyle = {
  opacity: number;
  scale: number;
  blur: number;
  brightness: number;
  zIndex: number;
};

function buildNodeFilter(depthStyle: DepthStyle) {
  const filters: string[] = [];
  if (depthStyle.blur > 0) filters.push(`blur(${depthStyle.blur}px)`);
  if (Math.abs(depthStyle.brightness - 1) > 0.01) {
    filters.push(`brightness(${depthStyle.brightness})`);
  }
  return filters.length > 0 ? filters.join(' ') : undefined;
}

function pickRandomCenterIndex(current: number) {
  if (aboutCenterIcons.length <= 1) return 1;

  let next = current;
  while (next === current) {
    next = Math.floor(Math.random() * aboutCenterIcons.length) + 1;
  }
  return next;
}

function getSortDepth(node: SkillNode, projected: ProjectedPoint) {
  return node.type === 'center' ? projected.depth - CENTER_DEPTH_BIAS : projected.depth;
}

function getDepthZIndex(depth: number) {
  return Math.round(100 + depthFactor(depth) * 900);
}

function getSphereRadiusPx(width: number, height: number) {
  return Math.min(width * 0.5, height * 0.44) * NETWORK_SCALE;
}

function projectAllNodes(
  rotation: Rotation,
  width: number,
  height: number,
): ProjectedNodes {
  const radiusPx = getSphereRadiusPx(width, height);
  return Object.fromEntries(
    skillNodes.map((node) => [
      node.id,
      projectPoint(node.position, rotation, width, height, radiusPx),
    ]),
  );
}

function getNodeDepthStyle(node: SkillNode, projected: ProjectedPoint): DepthStyle {
  const sortDepth = getSortDepth(node, projected);
  const depth = depthFactor(sortDepth);

  if (node.type === 'center') {
    return {
      opacity: lerp(0.92, 1, depth),
      scale: lerp(1.38, 1.52, depth) * NETWORK_SCALE,
      blur: 0,
      brightness: lerp(0.94, 1.03, depth),
      zIndex: getDepthZIndex(sortDepth),
    };
  }

  return {
    opacity: lerp(0.2, 1, depth),
    scale: lerp(0.62, 1.18, depth) * NETWORK_SCALE,
    blur: depth < 0.5 ? lerp(2.2, 0, depth / 0.5) : 0,
    brightness: lerp(0.72, 1.05, depth),
    zIndex: getDepthZIndex(sortDepth),
  };
}

export default function IdentitySphereNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<Rotation>({ x: -0.18, y: 0.42 });
  const dragRef = useRef<{ active: boolean; lastX: number; lastY: number }>({
    active: false,
    lastX: 0,
    lastY: 0,
  });
  const dragDistanceRef = useRef(0);
  const centerTravelStepRef = useRef(0);
  const centerImageIndexRef = useRef(1);

  const [rotation, setRotation] = useState<Rotation>(rotationRef.current);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [centerImageIndex, setCenterImageIndex] = useState(1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const nodeMap = useMemo(() => new Map(skillNodes.map((node) => [node.id, node])), []);
  const centerNode = useMemo(() => skillNodes.find((node) => node.type === 'center'), []);
  const centerIconSrc = aboutCenterIcons[centerImageIndex - 1] ?? aboutCenterIcons[0];

  const pauseAutoRotate = isDragging;
  const pauseAutoRotateRef = useRef(pauseAutoRotate);
  pauseAutoRotateRef.current = pauseAutoRotate;
  const isHighlighting = Boolean(hoveredId);
  const connectedIds = useMemo(
    () => (hoveredId ? getConnectedNodeIds(hoveredId) : new Set<string>()),
    [hoveredId],
  );

  const projected = useMemo(
    () => (size.width > 0 && size.height > 0 ? projectAllNodes(rotation, size.width, size.height) : {}),
    [rotation, size.height, size.width],
  );

  const sortedNodes = useMemo(
    () =>
      [...skillNodes].sort((nodeA, nodeB) => {
        const pointA = projected[nodeA.id];
        const pointB = projected[nodeB.id];
        if (!pointA || !pointB) return 0;
        return getSortDepth(nodeA, pointA) - getSortDepth(nodeB, pointB);
      }),
    [projected],
  );

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const update = () => setIsMobile(media.matches);
    update();
    // Safari/older browsers may not support addEventListener on MediaQueryList.
    const mediaAny = media as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };

    if (typeof mediaAny.addEventListener === 'function') {
      mediaAny.addEventListener('change', update);
      return () => mediaAny.removeEventListener('change', update);
    }

    if (typeof mediaAny.addListener === 'function') {
      mediaAny.addListener(update);
      return () => mediaAny.removeListener?.(update);
    }

    return;
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || isMobile) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(stage);
    return () => observer.disconnect();
  }, [isMobile]);

  const accumulateCenterImageTravel = useCallback((distancePx: number) => {
    if (distancePx <= 0) return;

    const width = stageRef.current?.clientWidth ?? containerRef.current?.clientWidth ?? size.width;
    if (width <= 0) return;

    dragDistanceRef.current += distancePx;
    const threshold = width * CENTER_IMAGE_DRAG_THRESHOLD;
    if (threshold <= 0) return;

    const step = Math.floor(dragDistanceRef.current / threshold);
    while (centerTravelStepRef.current < step) {
      centerTravelStepRef.current += 1;
      const nextIndex = pickRandomCenterIndex(centerImageIndexRef.current);
      centerImageIndexRef.current = nextIndex;
      setCenterImageIndex(nextIndex);
    }
  }, [size.width]);

  useEffect(() => {
    if (isMobile) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let frame = 0;
    let lastTimestamp = 0;

    const tick = (timestamp: number) => {
      if (lastTimestamp === 0) {
        lastTimestamp = timestamp;
      }

      const deltaMs = Math.min(timestamp - lastTimestamp, 48);
      lastTimestamp = timestamp;

      if (!pauseAutoRotateRef.current && deltaMs > 0) {
        const travelPx = (AUTO_ROTATE_SPEED_PX_PER_SEC * deltaMs) / 1000;
        const deltaX = travelPx * Math.cos(AUTO_ROTATE_DIRECTION_RAD);
        const deltaY = travelPx * Math.sin(AUTO_ROTATE_DIRECTION_RAD);

        const nextX = Math.max(
          -ROTATE_X_LIMIT,
          Math.min(ROTATE_X_LIMIT, rotationRef.current.x + deltaY * DRAG_SENSITIVITY),
        );
        const nextY = rotationRef.current.y + deltaX * DRAG_SENSITIVITY;
        rotationRef.current = { x: nextX, y: nextY };
        setRotation({ ...rotationRef.current });
        accumulateCenterImageTravel(travelPx);
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [accumulateCenterImageTravel, isMobile]);

  const applyDragDelta = useCallback((deltaX: number, deltaY: number) => {
    const nextX = Math.max(
      -ROTATE_X_LIMIT,
      Math.min(ROTATE_X_LIMIT, rotationRef.current.x + deltaY * DRAG_SENSITIVITY),
    );
    const nextY = rotationRef.current.y + deltaX * DRAG_SENSITIVITY;
    rotationRef.current = { x: nextX, y: nextY };
    setRotation({ ...rotationRef.current });
  }, []);

  const updateCenterImageFromDrag = useCallback((deltaX: number, deltaY: number) => {
    accumulateCenterImageTravel(Math.hypot(deltaX, deltaY));
  }, [accumulateCenterImageTravel]);

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (isMobile) return;

    dragRef.current = {
      active: true,
      lastX: event.clientX,
      lastY: event.clientY,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }, [isMobile]);

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;

    const deltaX = event.clientX - dragRef.current.lastX;
    const deltaY = event.clientY - dragRef.current.lastY;
    dragRef.current.lastX = event.clientX;
    dragRef.current.lastY = event.clientY;
    applyDragDelta(deltaX, deltaY);
    updateCenterImageFromDrag(deltaX, deltaY);
  }, [applyDragDelta, updateCenterImageFromDrag]);

  const endDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current.active = false;
    setIsDragging(false);
  }, []);

  const renderMobileGroupLabel = (nodeId: string) => {
    const node = nodeMap.get(nodeId);
    if (!node) return null;

    return (
      <li key={nodeId} className={node.type === 'cross' ? 'is-cross' : undefined}>
        {node.icon ? (
          <img
            className="identity-sphere__stack-icon"
            src={node.icon}
            alt=""
            width={18}
            height={18}
            loading="lazy"
            draggable={false}
          />
        ) : null}
        <span>{node.label}</span>
      </li>
    );
  };

  const renderNodeMarker = (node: SkillNode) => {
    const iconSrc = node.type === 'center' ? centerIconSrc : node.icon;

    if (iconSrc) {
      return (
        <img
          className="identity-sphere__node-icon"
          src={iconSrc}
          alt=""
          width={node.type === 'center' ? 87 : 24}
          height={node.type === 'center' ? 87 : 24}
          loading="lazy"
          draggable={false}
        />
      );
    }

    if (node.type !== 'center') {
      return <span className="identity-sphere__node-dot" aria-hidden="true" />;
    }

    return null;
  };

  const renderNodeLabel = (node: SkillNode) => {
    if (node.labelLines?.length) {
      return (
        <span className="identity-sphere__node-label identity-sphere__node-label--stacked">
          {node.labelLines.map((line) => (
            <span key={line} className="identity-sphere__node-label-line">
              {line}
            </span>
          ))}
        </span>
      );
    }

    return <span className="identity-sphere__node-label">{node.label}</span>;
  };

  const renderDesktopNode = (node: SkillNode) => {
    const point = projected[node.id];
    if (!point) return null;

    const depthStyle = getNodeDepthStyle(node, point);
    const isActive = hoveredId === node.id;
    const isConnected = Boolean(hoveredId && connectedIds.has(node.id) && !isActive);

    return (
      <button
        key={node.id}
        type="button"
        className={[
          'identity-sphere__node',
          `identity-sphere__node--${node.type}`,
          node.icon || node.type === 'center' ? 'identity-sphere__node--has-icon' : '',
          isActive ? 'is-active' : '',
          isConnected ? 'is-connected' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          left: `${point.x}px`,
          top: `${point.y}px`,
          opacity: depthStyle.opacity,
          zIndex: depthStyle.zIndex,
          filter: buildNodeFilter(depthStyle),
          transform: `translate(-50%, -50%) scale(${depthStyle.scale})`,
        }}
        onMouseEnter={() => setHoveredId(node.id)}
        onFocus={() => setHoveredId(node.id)}
      >
        {renderNodeMarker(node)}
        {renderNodeLabel(node)}
      </button>
    );
  };

  return (
    <div
      ref={containerRef}
      className={[
        'identity-sphere',
        isHighlighting ? 'is-highlighting' : '',
        isDragging ? 'is-dragging' : '',
        isMobile ? 'is-mobile' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        ['--identity-sphere-cursor-open' as string]: `url('${aboutNetworkCursors.openHand}') 16 16, grab`,
        ['--identity-sphere-cursor-grab' as string]: `url('${aboutNetworkCursors.closedHand}') 16 16, grabbing`,
      }}
    >
      {!isMobile ? (
        <>
          <div
            ref={stageRef}
            className="identity-sphere__stage"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onMouseLeave={(event) => {
              const next = event.relatedTarget;
              if (next instanceof Node && event.currentTarget.contains(next)) return;
              setHoveredId(null);
            }}
          >
            <div className="identity-sphere__nodes" aria-label="Design identity network">
              {sortedNodes.map(renderDesktopNode)}
            </div>
          </div>
        </>
      ) : (
        <div className="identity-sphere__stack" aria-label="Design identity map">
          {centerNode ? (
            <div className="identity-sphere__stack-center-wrap">
              {centerIconSrc ? (
                <img
                  className="identity-sphere__stack-icon"
                  src={centerIconSrc}
                  alt=""
                  width={32}
                  height={32}
                  loading="lazy"
                  draggable={false}
                />
              ) : null}
              <p className="identity-sphere__stack-center">
                {centerNode.labelLines?.length
                  ? centerNode.labelLines.map((line) => (
                      <span key={line} className="identity-sphere__stack-center-line">
                        {line}
                      </span>
                    ))
                  : centerNode.label}
              </p>
            </div>
          ) : null}

          <div className="identity-sphere__stack-groups">
            {mobileSkillGroups.map((group) => (
              <div key={group.label} className="identity-sphere__stack-group">
                <h3 className="identity-sphere__stack-main">{group.label}</h3>
                <ul className="identity-sphere__stack-related">
                  {group.nodeIds.map((nodeId) => renderMobileGroupLabel(nodeId))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
