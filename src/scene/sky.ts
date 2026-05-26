import * as THREE from 'three';

export function createSky(scene: THREE.Scene): void {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, '#1a3a5c');
  gradient.addColorStop(0.3, '#3a7bd5');
  gradient.addColorStop(0.6, '#6db3f2');
  gradient.addColorStop(0.8, '#87ceeb');
  gradient.addColorStop(1.0, '#b8dce8');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  // Clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 300;
    const w = 50 + Math.random() * 100;
    const h = 15 + Math.random() * 25;
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = texture;
  scene.environment = texture;
}
