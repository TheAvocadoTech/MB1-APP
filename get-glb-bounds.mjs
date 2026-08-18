import { NodeIO } from '@gltf-transform/core';
import { getBounds } from '@gltf-transform/functions';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';

const io = new NodeIO()
  .registerExtensions(KHRONOS_EXTENSIONS);

const document = await io.read(
  'src/assets/models/mb1-campus.glb'
);

const scene = document.getRoot().getDefaultScene();

if (!scene) {
  throw new Error('No default scene found in GLB');
}

const result = getBounds(scene);

console.log('\n========== GLB BOUNDS ==========');

console.log('MIN:', result.min);
console.log('MAX:', result.max);

const size = [
  result.max[0] - result.min[0],
  result.max[1] - result.min[1],
  result.max[2] - result.min[2],
];

const center = [
  (result.min[0] + result.max[0]) / 2,
  (result.min[1] + result.max[1]) / 2,
  (result.min[2] + result.max[2]) / 2,
];

console.log('SIZE:', size);
console.log('CENTER:', center);

console.log('================================\n');