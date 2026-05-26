import * as THREE from 'three';

export function createField(scene: THREE.Scene): THREE.Mesh {
  const fieldWidth = 70;
  const fieldLength = 120;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base grass color with variation
  ctx.fillStyle = '#2d7a2d';
  ctx.fillRect(0, 0, 1024, 1024);

  // Grass stripes
  for (let i = 0; i < 1024; i += 64) {
    ctx.fillStyle = i % 128 === 0 ? '#267326' : '#338033';
    ctx.fillRect(0, i, 1024, 64);
  }

  // Grass texture noise
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    ctx.fillStyle = `rgba(${30 + Math.random() * 20}, ${100 + Math.random() * 40}, ${30 + Math.random() * 20}, 0.3)`;
    ctx.fillRect(x, y, 2, 4);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 12);

  const fieldGeo = new THREE.PlaneGeometry(fieldWidth, fieldLength);
  const fieldMat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.9,
    metalness: 0.0,
  });

  const field = new THREE.Mesh(fieldGeo, fieldMat);
  field.rotation.x = -Math.PI / 2;
  field.receiveShadow = true;
  scene.add(field);

  // Field lines
  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  // Try line (22m from goal line)
  const lineGeo = new THREE.PlaneGeometry(fieldWidth, 0.15);

  const tryLine = new THREE.Mesh(lineGeo, lineMaterial);
  tryLine.rotation.x = -Math.PI / 2;
  tryLine.position.set(0, 0.01, -30);
  scene.add(tryLine);

  // 22m line
  const line22 = new THREE.Mesh(lineGeo.clone(), lineMaterial);
  line22.rotation.x = -Math.PI / 2;
  line22.position.set(0, 0.01, -8);
  scene.add(line22);

  // Goal line
  const goalLine = new THREE.Mesh(lineGeo.clone(), lineMaterial);
  goalLine.rotation.x = -Math.PI / 2;
  goalLine.position.set(0, 0.01, -52);
  scene.add(goalLine);

  // Side lines
  const sideLineGeo = new THREE.PlaneGeometry(0.15, fieldLength);
  const leftSide = new THREE.Mesh(sideLineGeo, lineMaterial);
  leftSide.rotation.x = -Math.PI / 2;
  leftSide.position.set(-fieldWidth / 2, 0.01, 0);
  scene.add(leftSide);

  const rightSide = new THREE.Mesh(sideLineGeo.clone(), lineMaterial);
  rightSide.rotation.x = -Math.PI / 2;
  rightSide.position.set(fieldWidth / 2, 0.01, 0);
  scene.add(rightSide);

  return field;
}
