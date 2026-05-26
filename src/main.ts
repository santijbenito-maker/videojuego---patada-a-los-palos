import * as THREE from 'three';
import { initPhysics, getWorld, getRapier } from './physics/world';
import { createPhysicsBodies, PhysicsBodies } from './physics/bodies';
import { createField } from './scene/field';
import { createPosts } from './scene/posts';
import { createBall } from './scene/ball';
import { createLighting } from './scene/lighting';
import { createSky } from './scene/sky';
import { initInput, getInput, consumeSpaceRelease } from './controls/input';
import { createGameState, GameState } from './game/state';
import { performKick } from './game/kick';
import { checkScore, resetScoring } from './game/scoring';
import { updateHUD, showMessage } from './ui/hud';

const BALL_START = { x: 0, y: 0.15, z: -20 };

async function init() {
  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  document.getElementById('app')!.appendChild(renderer.domElement);

  // Scene
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x87ceeb, 80, 200);

  // Camera - behind the kicker
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
  camera.position.set(0, 2.5, -15);
  camera.lookAt(0, 3, -52);

  // Scene setup
  createSky(scene);
  createLighting(scene);
  createField(scene);
  createPosts(scene);
  const ballMesh = createBall(scene);
  ballMesh.position.set(BALL_START.x, BALL_START.y, BALL_START.z);

  // Physics
  await initPhysics();
  const world = getWorld();
  const rapier = getRapier();
  let bodies: PhysicsBodies = createPhysicsBodies(world, rapier, BALL_START);

  // Input
  const input = initInput();

  // Game state
  const gameState: GameState = createGameState();

  // Resize handling
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Reset ball to initial position
  function resetBall() {
    bodies.ballBody.setTranslation(
      { x: BALL_START.x, y: BALL_START.y, z: BALL_START.z },
      true
    );
    bodies.ballBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
    bodies.ballBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
    bodies.ballBody.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
    ballMesh.position.set(BALL_START.x, BALL_START.y, BALL_START.z);
    ballMesh.quaternion.set(0, 0, 0, 1);
    resetScoring(BALL_START.z);
    gameState.power = 0;
    gameState.direction = 0;
    gameState.phase = 'aiming';
  }

  // Game loop
  const clock = new THREE.Clock();
  let chargeDir = 1;

  function gameLoop() {
    requestAnimationFrame(gameLoop);
    const dt = Math.min(clock.getDelta(), 0.05);

    // Game logic per phase
    switch (gameState.phase) {
      case 'aiming':
        // Direction control
        if (input.leftHeld) gameState.direction = Math.max(gameState.direction - 1.5 * dt, -1);
        if (input.rightHeld) gameState.direction = Math.min(gameState.direction + 1.5 * dt, 1);

        // Start charging
        if (input.spaceHeld) {
          gameState.phase = 'charging';
          chargeDir = 1;
        }
        break;

      case 'charging':
        // Direction control while charging
        if (input.leftHeld) gameState.direction = Math.max(gameState.direction - 1.0 * dt, -1);
        if (input.rightHeld) gameState.direction = Math.min(gameState.direction + 1.0 * dt, 1);

        // Power oscillates up and down
        gameState.power += chargeDir * dt * 1.2;
        if (gameState.power >= 1) {
          gameState.power = 1;
          chargeDir = -1;
        } else if (gameState.power <= 0) {
          gameState.power = 0;
          chargeDir = 1;
        }

        // Release to kick
        if (consumeSpaceRelease()) {
          performKick(bodies.ballBody, gameState);
        }
        break;

      case 'kicked':
        // Consume any pending space release
        consumeSpaceRelease();

        // Step physics
        world.step();

        // Sync ball mesh with physics
        const pos = bodies.ballBody.translation();
        const rot = bodies.ballBody.rotation();
        ballMesh.position.set(pos.x, pos.y, pos.z);
        ballMesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);

        // Camera follows ball slightly
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, pos.x * 0.3, 0.02);
        camera.lookAt(pos.x * 0.5, Math.max(pos.y, 3), -52);

        // Check scoring
        const result = checkScore(bodies.ballBody, gameState);
        if (result.checked) {
          if (result.scored) {
            showMessage('¡CONVERSIÓN! +3 puntos', 2500);
          } else {
            showMessage('¡Fallaste!', 2000);
          }
          gameState.phase = 'result';
          gameState.resultTimer = 0;
        }
        break;

      case 'result':
        // Keep simulating briefly
        world.step();
        const p = bodies.ballBody.translation();
        const r = bodies.ballBody.rotation();
        ballMesh.position.set(p.x, p.y, p.z);
        ballMesh.quaternion.set(r.x, r.y, r.z, r.w);

        gameState.resultTimer += dt;
        if (gameState.resultTimer > 3) {
          resetBall();
          camera.position.set(0, 2.5, -15);
          camera.lookAt(0, 3, -52);
        }
        break;
    }

    updateHUD(gameState);
    renderer.render(scene, camera);
  }

  // Start
  resetScoring(BALL_START.z);
  showMessage('¡Pateá a los Palos!', 3000);
  gameLoop();
}

init().catch(console.error);
