import RAPIER from '@dimforge/rapier3d-compat';
import { BALL_RADIUS } from '../scene/ball';
import { POSTS_Z } from '../scene/posts';

const POST_WIDTH = 5.6;
const POST_HEIGHT = 16;
const CROSSBAR_HEIGHT = 3;
const POST_RADIUS = 0.075;

export interface PhysicsBodies {
  ballBody: RAPIER.RigidBody;
  ballCollider: RAPIER.Collider;
}

export function createPhysicsBodies(
  world: RAPIER.World,
  rapier: typeof RAPIER,
  ballStartPos: { x: number; y: number; z: number }
): PhysicsBodies {
  // Ground
  const groundDesc = rapier.RigidBodyDesc.fixed().setTranslation(0, 0, 0);
  const groundBody = world.createRigidBody(groundDesc);
  const groundColliderDesc = rapier.ColliderDesc.cuboid(50, 0.1, 80)
    .setTranslation(0, -0.1, 0)
    .setRestitution(0.3)
    .setFriction(0.8);
  world.createCollider(groundColliderDesc, groundBody);

  // Ball
  const ballBodyDesc = rapier.RigidBodyDesc.dynamic()
    .setTranslation(ballStartPos.x, ballStartPos.y, ballStartPos.z)
    .setLinearDamping(0.3)
    .setAngularDamping(0.5);
  const ballBody = world.createRigidBody(ballBodyDesc);
  const ballColliderDesc = rapier.ColliderDesc.ball(BALL_RADIUS)
    .setRestitution(0.5)
    .setFriction(0.6)
    .setDensity(0.44); // ~450g rugby ball
  const ballCollider = world.createCollider(ballColliderDesc, ballBody);

  // Left post
  const leftPostDesc = rapier.RigidBodyDesc.fixed()
    .setTranslation(-POST_WIDTH / 2, (POST_HEIGHT + CROSSBAR_HEIGHT) / 2, POSTS_Z);
  const leftPostBody = world.createRigidBody(leftPostDesc);
  const leftPostCollider = rapier.ColliderDesc.cylinder((POST_HEIGHT + CROSSBAR_HEIGHT) / 2, POST_RADIUS)
    .setRestitution(0.8);
  world.createCollider(leftPostCollider, leftPostBody);

  // Right post
  const rightPostDesc = rapier.RigidBodyDesc.fixed()
    .setTranslation(POST_WIDTH / 2, (POST_HEIGHT + CROSSBAR_HEIGHT) / 2, POSTS_Z);
  const rightPostBody = world.createRigidBody(rightPostDesc);
  const rightPostCollider = rapier.ColliderDesc.cylinder((POST_HEIGHT + CROSSBAR_HEIGHT) / 2, POST_RADIUS)
    .setRestitution(0.8);
  world.createCollider(rightPostCollider, rightPostBody);

  // Crossbar
  const crossbarDesc = rapier.RigidBodyDesc.fixed()
    .setTranslation(0, CROSSBAR_HEIGHT, POSTS_Z)
    .setRotation({ x: 0, y: 0, z: Math.sin(Math.PI / 4), w: Math.cos(Math.PI / 4) });
  const crossbarBody = world.createRigidBody(crossbarDesc);
  const crossbarCollider = rapier.ColliderDesc.cylinder(POST_WIDTH / 2, POST_RADIUS)
    .setRestitution(0.8);
  world.createCollider(crossbarCollider, crossbarBody);

  return { ballBody, ballCollider };
}
