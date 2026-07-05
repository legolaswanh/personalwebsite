/**
 * Design Research chapter image paths (public/images/research/)
 */

import { discoverProjectImages } from '../utils/discoverProjectImages';

const base = '/images/research';

export const researchProjectImages = {
  'gameplay-style': discoverProjectImages(base, 'gameplay-style'),
  'telemedicine-mirror': discoverProjectImages(base, 'telemedicine-mirror'),
  'ixd-paper': discoverProjectImages(base, 'ixd-paper'),
  'hri-paper': discoverProjectImages(base, 'hri-paper'),
} as const;

export const researchToolIcons = {
  figma: `${base}/tools/figma.png`,
  framer: `${base}/tools/framer.png`,
  photoshop: `${base}/tools/photoshop.png`,
  premierpro: `${base}/tools/premierpro.png`,
  arduino: `${base}/tools/arduino.png`,
  blender: `${base}/tools/blender.png`,
  python: `${base}/tools/python.png`,
  prusaslicer: `${base}/tools/prusaslicer.png`,
} as const;
