/**
 * Interaction Design chapter image paths (public/images/ixd/)
 */

import { discoverProjectImages } from '../utils/discoverProjectImages';

const base = '/images/ixd';

export const ixdProjectImages = {
  opalis: discoverProjectImages(base, 'opalis'),
  'public-editor': discoverProjectImages(base, 'public-editor'),
  calmpanion: discoverProjectImages(base, 'calmpanion'),
  'muscle-mate': discoverProjectImages(base, 'muscle-mate'),
} as const;

export const ixdToolIcons = {
  figma: `${base}/tools/figma.png`,
  framer: `${base}/tools/framer.png`,
  photoshop: `${base}/tools/photoshop.png`,
  premierpro: `${base}/tools/premierpro.png`,
  arduino: `${base}/tools/arduino.png`,
  blender: `${base}/tools/blender.png`,
  python: `${base}/tools/python.png`,
  prusaslicer: `${base}/tools/prusaslicer.png`,
} as const;
