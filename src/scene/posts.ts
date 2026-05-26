import * as THREE from 'three';

// World Rugby regulation dimensions
const POST_HEIGHT = 16;       // Minimum 16m above crossbar, we use total post height
const CROSSBAR_HEIGHT = 3;    // 3m from ground
const POST_WIDTH = 5.6;       // 5.6m between inner edges of posts
const POST_RADIUS = 0.075;    // ~15cm diameter posts
const CROSSBAR_RADIUS = 0.075;

export const POSTS_Z = -52;   // Position at goal line

export function createPosts(scene: THREE.Scene): THREE.Group {
  const postsGroup = new THREE.Group();

  const postMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.6,
  });

  // Left post
  const postGeo = new THREE.CylinderGeometry(POST_RADIUS, POST_RADIUS, POST_HEIGHT + CROSSBAR_HEIGHT, 16);
  const leftPost = new THREE.Mesh(postGeo, postMaterial);
  leftPost.position.set(-POST_WIDTH / 2, (POST_HEIGHT + CROSSBAR_HEIGHT) / 2, POSTS_Z);
  leftPost.castShadow = true;
  postsGroup.add(leftPost);

  // Right post
  const rightPost = new THREE.Mesh(postGeo.clone(), postMaterial);
  rightPost.position.set(POST_WIDTH / 2, (POST_HEIGHT + CROSSBAR_HEIGHT) / 2, POSTS_Z);
  rightPost.castShadow = true;
  postsGroup.add(rightPost);

  // Crossbar
  const crossbarGeo = new THREE.CylinderGeometry(CROSSBAR_RADIUS, CROSSBAR_RADIUS, POST_WIDTH, 16);
  const crossbar = new THREE.Mesh(crossbarGeo, postMaterial);
  crossbar.rotation.z = Math.PI / 2;
  crossbar.position.set(0, CROSSBAR_HEIGHT, POSTS_Z);
  crossbar.castShadow = true;
  postsGroup.add(crossbar);

  // Padding at base (safety pads)
  const padMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a4d8f,
    roughness: 0.8,
    metalness: 0.0,
  });

  const padGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.8, 16);

  const leftPad = new THREE.Mesh(padGeo, padMaterial);
  leftPad.position.set(-POST_WIDTH / 2, 0.9, POSTS_Z);
  postsGroup.add(leftPad);

  const rightPad = new THREE.Mesh(padGeo.clone(), padMaterial);
  rightPad.position.set(POST_WIDTH / 2, 0.9, POSTS_Z);
  postsGroup.add(rightPad);

  scene.add(postsGroup);
  return postsGroup;
}
