import * as THREE from 'three';

// Rugby ball approximate dimensions: ~30cm long, ~18cm wide
const BALL_LENGTH = 0.30;
const BALL_WIDTH = 0.18;

export function createBall(scene: THREE.Scene): THREE.Mesh {
  // Oval shape using a sphere scaled on one axis
  const ballGeo = new THREE.SphereGeometry(BALL_WIDTH / 2, 32, 24);

  // Create canvas texture for the ball
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Base leather color
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(0, 0, 512, 256);

  // Panels
  ctx.strokeStyle = '#f5f5dc';
  ctx.lineWidth = 3;

  // Seam lines
  ctx.beginPath();
  ctx.moveTo(256, 0);
  ctx.lineTo(256, 256);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 128);
  ctx.lineTo(512, 128);
  ctx.stroke();

  // Grip dots pattern
  ctx.fillStyle = '#6b3410';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 16; col++) {
      const x = col * 32 + 16;
      const y = row * 32 + 16;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);

  const ballMat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.6,
    metalness: 0.0,
    bumpScale: 0.01,
  });

  const ball = new THREE.Mesh(ballGeo, ballMat);
  // Scale to make it oval (elongate along Z axis)
  ball.scale.set(1, 1, BALL_LENGTH / BALL_WIDTH);
  ball.castShadow = true;
  ball.receiveShadow = true;

  scene.add(ball);
  return ball;
}

export const BALL_RADIUS = BALL_WIDTH / 2;
export const BALL_SCALE_Z = BALL_LENGTH / BALL_WIDTH;
