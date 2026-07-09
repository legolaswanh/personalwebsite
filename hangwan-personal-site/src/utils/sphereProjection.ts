export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Rotation {
  x: number;
  y: number;
}

export interface ProjectedPoint {
  x: number;
  y: number;
  z: number;
  scale: number;
  depth: number;
}

export const SPHERE_RADIUS = 1;
export const PERSPECTIVE = 2.8;
/** Fixed screen-space ellipse radii — applied only at projection, not in 3D rotation */
export const PROJECTION_ELLIPSE_X = 1.18;
export const PROJECTION_ELLIPSE_Y = 0.76;

export function normalize(vec: Vec3): Vec3 {
  const length = Math.hypot(vec.x, vec.y, vec.z) || 1;
  return {
    x: vec.x / length,
    y: vec.y / length,
    z: vec.z / length,
  };
}

export function onSphere(x: number, y: number, z: number): Vec3 {
  return normalize({ x, y, z });
}

export function rotatePoint(point: Vec3, rotation: Rotation): Vec3 {
  const cosX = Math.cos(rotation.x);
  const sinX = Math.sin(rotation.x);
  const cosY = Math.cos(rotation.y);
  const sinY = Math.sin(rotation.y);

  const y1 = point.y * cosX - point.z * sinX;
  const z1 = point.y * sinX + point.z * cosX;

  const x2 = point.x * cosY + z1 * sinY;
  const z2 = -point.x * sinY + z1 * cosY;

  return { x: x2, y: y1, z: z2 };
}

export function projectPoint(
  point: Vec3,
  rotation: Rotation,
  width: number,
  height: number,
  radiusPx: number,
): ProjectedPoint {
  const rotated = rotatePoint(point, rotation);
  const depth = rotated.z;
  const perspectiveScale = PERSPECTIVE / (PERSPECTIVE - depth * SPHERE_RADIUS);
  const radiusX = radiusPx * PROJECTION_ELLIPSE_X;
  const radiusY = radiusPx * PROJECTION_ELLIPSE_Y;

  return {
    x: width / 2 + rotated.x * radiusX * perspectiveScale,
    y: height / 2 + rotated.y * radiusY * perspectiveScale,
    z: depth,
    scale: perspectiveScale,
    depth,
  };
}

export function lerp(min: number, max: number, t: number) {
  return min + (max - min) * t;
}

export function depthFactor(depth: number, minDepth = -1, maxDepth = 1) {
  const t = (depth - minDepth) / (maxDepth - minDepth);
  return Math.min(1, Math.max(0, t));
}

/** Evenly distribute points on a unit sphere (Fibonacci / golden spiral). */
export function fibonacciSphere(index: number, total: number): Vec3 {
  if (total <= 1) {
    return { x: 0, y: 1, z: 0 };
  }

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (index / (total - 1)) * 2;
  const radius = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = goldenAngle * index;

  return normalize({
    x: Math.cos(theta) * radius,
    y,
    z: Math.sin(theta) * radius,
  });
}
