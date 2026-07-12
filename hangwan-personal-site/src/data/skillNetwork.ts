import { aboutCenterIcons, aboutNetworkIcons } from './aboutAssets';
import { fibonacciSphere, type Vec3 } from '../utils/sphereProjection';

export type SkillNodeType = 'center' | 'related' | 'cross';

export interface SkillNode {
  id: string;
  label: string;
  /** Multi-line label for center node display */
  labelLines?: string[];
  type: SkillNodeType;
  position: Vec3;
  /** Optional icon path — set in aboutAssets.ts via aboutNetworkIcons */
  icon?: string;
}

export interface SkillConnection {
  from: string;
  to: string;
}

export interface MobileSkillGroup {
  label: string;
  nodeIds: string[];
}

function resolveNodeIcon(id: string): string | undefined {
  return aboutNetworkIcons[id];
}

const surfaceNodeDefs: Array<{ id: string; label: string; type: Exclude<SkillNodeType, 'center'> }> = [
  { id: 'systems', label: 'System Design', type: 'related' },
  { id: 'mechanics', label: 'Mechanic-driven', type: 'related' },
  { id: 'narrative', label: 'Narrative-driven', type: 'related' },
  { id: 'concept', label: 'Concept-driven', type: 'related' },
  { id: 'prototyping-gd', label: 'Prototyping', type: 'related' },
  { id: 'ux', label: 'UX', type: 'related' },
  { id: 'empathic', label: 'Deeply Empathic', type: 'related' },
  { id: 'level', label: 'Level Design', type: 'related' },
  { id: 'tangible', label: 'Tangible Interfaces', type: 'related' },
  { id: 'storytelling', label: 'Storytelling', type: 'related' },
  { id: 'user-research', label: 'User Research', type: 'related' },
  { id: 'design-studies', label: 'Design Studies', type: 'related' },
  { id: 'visual-analysis', label: 'Visual Analysis', type: 'related' },
  { id: 'reflection', label: 'Reflection', type: 'related' },
  { id: 'unity', label: 'Unity', type: 'related' },
  { id: 'csharp', label: 'C#', type: 'related' },
  { id: 'python', label: 'Python', type: 'related' },
  { id: 'web-proto', label: 'Web Prototyping', type: 'related' },
  { id: 'arduino', label: 'Arduino', type: 'related' },
  { id: 'blender', label: 'Blender', type: 'related' },
  { id: 'figma', label: 'Figma', type: 'related' },
  { id: 'framer', label: 'Framer', type: 'related' },
  { id: 'photoshop', label: 'Photoshop', type: 'related' },
  { id: 'premierpro', label: 'Premiere Pro', type: 'related' },
  { id: 'emotional-play', label: 'Emotional Play', type: 'cross' },
  { id: 'computational', label: 'Computational Logic', type: 'cross' },
  { id: 'spatial', label: 'Spatial Puzzles', type: 'cross' },
  { id: 'physical', label: 'Physical Prototyping', type: 'cross' },
  { id: 'player-exp', label: 'Player Experience', type: 'cross' },
  { id: 'playtesting', label: 'Playtesting', type: 'cross' },
  { id: 'human-centered', label: 'Human-centered Design', type: 'cross' },
  { id: 'user-journey', label: 'User Journey', type: 'cross' },
  { id: 'rapid-prototyping', label: 'Rapid Prototyping', type: 'cross' },
  { id: 'research-backed', label: 'Research-backed', type: 'cross' },
  { id: 'cross-medium', label: 'Cross-Medium', type: 'cross' },
];

const surfaceSkillNodes = surfaceNodeDefs.map((node, index) => ({
  ...node,
  position: fibonacciSphere(index, surfaceNodeDefs.length),
  icon: resolveNodeIcon(node.id),
}));

export const skillNodes: SkillNode[] = [
  {
    id: 'center',
    label: 'Game Designer',
    labelLines: ['Game Designer', 'Interaction Designer'],
    type: 'center',
    position: { x: 0, y: 0, z: 0 },
    icon: aboutCenterIcons[0],
  },
  ...surfaceSkillNodes,
];

function sphericalAngleBetween(a: Vec3, b: Vec3) {
  const dot = Math.min(1, Math.max(-1, a.x * b.x + a.y * b.y + a.z * b.z));
  return Math.acos(dot);
}

/** Connect each surface node to its nearest neighbors on the sphere. */
function buildSphereNeighborConnections(nodes: SkillNode[], neighborCount = 3): SkillConnection[] {
  const surfaceNodes = nodes.filter((node) => node.type !== 'center');
  const edgeKeys = new Set<string>();
  const connections: SkillConnection[] = [];

  surfaceNodes.forEach((node) => {
    const nearest = surfaceNodes
      .filter((other) => other.id !== node.id)
      .map((other) => ({
        id: other.id,
        angle: sphericalAngleBetween(node.position, other.position),
      }))
      .sort((left, right) => left.angle - right.angle)
      .slice(0, neighborCount);

    nearest.forEach((neighbor) => {
      const key = [node.id, neighbor.id].sort().join('|');
      if (edgeKeys.has(key)) return;
      edgeKeys.add(key);
      connections.push({ from: node.id, to: neighbor.id });
    });
  });

  return connections;
}

export const skillConnections: SkillConnection[] = buildSphereNeighborConnections(skillNodes);

export const mobileSkillGroups: MobileSkillGroup[] = [
  {
    label: 'Game & Mechanics',
    nodeIds: ['systems', 'mechanics', 'narrative', 'prototyping-gd', 'spatial', 'emotional-play'],
  },
  {
    label: 'Interaction & Service',
    nodeIds: ['ux', 'public', 'tangible', 'service', 'physical', 'figma', 'framer'],
  },
  {
    label: 'Research & Writing',
    nodeIds: ['user-research', 'design-studies', 'visual-analysis', 'reflection', 'photoshop', 'premierpro'],
  },
  {
    label: 'Engineering',
    nodeIds: ['unity', 'csharp', 'python', 'web-proto', 'computational', 'arduino', 'blender'],
  },
  {
    label: 'Experience',
    nodeIds: ['player-exp'],
  },
];

export const MOBILE_BREAKPOINT = 768;

export function getConnectionsForNode(nodeId: string): SkillConnection[] {
  return skillConnections.filter(
    (connection) => connection.from === nodeId || connection.to === nodeId,
  );
}

export function getConnectedNodeIds(nodeId: string): Set<string> {
  const connected = new Set<string>([nodeId]);
  getConnectionsForNode(nodeId).forEach((connection) => {
    connected.add(connection.from);
    connected.add(connection.to);
  });
  return connected;
}
