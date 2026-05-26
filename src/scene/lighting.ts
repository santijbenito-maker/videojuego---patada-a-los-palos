import * as THREE from 'three';

export function createLighting(scene: THREE.Scene): void {
  // Ambient light for base illumination
  const ambient = new THREE.AmbientLight(0x404060, 0.4);
  scene.add(ambient);

  // Hemisphere light (sky/ground)
  const hemi = new THREE.HemisphereLight(0x87ceeb, 0x2d5a1e, 0.5);
  scene.add(hemi);

  // Main directional light (sun)
  const sun = new THREE.DirectionalLight(0xfff4e0, 1.8);
  sun.position.set(20, 40, -10);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 150;
  sun.shadow.camera.left = -60;
  sun.shadow.camera.right = 60;
  sun.shadow.camera.top = 80;
  sun.shadow.camera.bottom = -80;
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);

  // Stadium floodlights
  const floodPositions: [number, number, number][] = [
    [-30, 25, -20],
    [30, 25, -20],
    [-30, 25, 10],
    [30, 25, 10],
  ];

  for (const pos of floodPositions) {
    const flood = new THREE.SpotLight(0xfff8f0, 40, 100, Math.PI / 4, 0.5, 1.5);
    flood.position.set(...pos);
    flood.target.position.set(0, 0, -25);
    flood.castShadow = false;
    scene.add(flood);
    scene.add(flood.target);
  }
}
