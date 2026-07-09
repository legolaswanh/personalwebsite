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
  { id: 'systems', label: 'Systems', type: 'related' },
  { id: 'mechanics', label: 'Mechanics', type: 'related' },
  { id: 'narrative', label: 'Narrative', type: 'related' },
  { id: 'prototyping-gd', label: 'Prototyping', type: 'related' },
  { id: 'ux', label: 'UX', type: 'related' },
  { id: 'public', label: 'Public Interaction', type: 'related' },
  { id: 'tangible', label: 'Tangible Interfaces', type: 'related' },
  { id: 'service', label: 'Service Thinking', type: 'related' },
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
];

const surfaceNodeIds = surfaceNodeDefs.map((node) => node.id);

export const skillNodes: SkillNode[] = [
  {
    id: 'center',
    label: 'Game Designer',
    labelLines: ['Game Designer', 'Interaction Designer'],
    type: 'center',
    position: { x: 0, y: 0, z: 0 },
    icon: aboutCenterIcons[0],
  },
  ...surfaceNodeDefs.map((node, index) => ({
    ...node,
    position: fibonacciSphere(index, surfaceNodeDefs.length),
    icon: resolveNodeIcon(node.id),
  })),
];

export const skillConnections: SkillConnection[] = [
  ...surfaceNodeIds.map((nodeId) => ({ from: 'center', to: nodeId })),

  { from: 'systems', to: 'mechanics' },
  { from: 'narrative', to: 'player-exp' },
  { from: 'reflection', to: 'player-exp' },
  { from: 'ux', to: 'public' },
  { from: 'unity', to: 'csharp' },
  { from: 'python', to: 'computational' },
  { from: 'emotional-play', to: 'ux' },
  { from: 'computational', to: 'mechanics' },
  { from: 'spatial', to: 'systems' },
  { from: 'physical', to: 'tangible' },

  { from: 'arduino', to: 'physical' },
  { from: 'arduino', to: 'python' },
  { from: 'blender', to: 'tangible' },
  { from: 'blender', to: 'unity' },
  { from: 'figma', to: 'ux' },
  { from: 'figma', to: 'framer' },
  { from: 'framer', to: 'web-proto' },
  { from: 'photoshop', to: 'visual-analysis' },
  { from: 'premierpro', to: 'narrative' },
  { from: 'premierpro', to: 'photoshop' },
];

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
