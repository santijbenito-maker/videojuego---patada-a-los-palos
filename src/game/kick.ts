import RAPIER from '@dimforge/rapier3d-compat';
import { GameState } from './state';

const MAX_FORCE = 7;
const KICK_ANGLE = 0.75; // Elevation angle in radians (~43 degrees)

export function performKick(
  ballBody: RAPIER.RigidBody,
  state: GameState
): void {
  ballBody.setBodyType(RAPIER.RigidBodyType.Dynamic, true);

  const force = state.power * MAX_FORCE;
  const horizontalForce = force * Math.cos(KICK_ANGLE);
  const verticalForce = force * Math.sin(KICK_ANGLE);
  const lateralForce = state.direction * force * 0.3;

  const impulse = {
    x: lateralForce,
    y: verticalForce,
    z: -horizontalForce, // Negative Z = towards posts
  };

  ballBody.applyImpulse(impulse, true);

  // Add some spin
  ballBody.applyTorqueImpulse(
    { x: force * 0.05, y: lateralForce * 0.1, z: 0 },
    true
  );

  state.phase = 'kicked';
  state.attempts++;
}
