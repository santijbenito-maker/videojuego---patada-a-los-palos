import RAPIER from '@dimforge/rapier3d-compat';
import { POSTS_Z } from '../scene/posts';
import { GameState } from './state';

const POST_WIDTH = 5.6;
const CROSSBAR_HEIGHT = 3;

export interface ScoringResult {
  scored: boolean;
  checked: boolean;
}

let lastBallZ = 0;
let hasChecked = false;

export function resetScoring(ballZ: number): void {
  lastBallZ = ballZ;
  hasChecked = false;
}

export function checkScore(ballBody: RAPIER.RigidBody, state: GameState): ScoringResult {
  if (hasChecked) return { scored: false, checked: true };

  const pos = ballBody.translation();
  const currentZ = pos.z;

  // Ball crossed the goal line plane
  if (lastBallZ > POSTS_Z && currentZ <= POSTS_Z) {
    hasChecked = true;

    const betweenPosts = Math.abs(pos.x) < POST_WIDTH / 2;
    const aboveCrossbar = pos.y > CROSSBAR_HEIGHT;

    if (betweenPosts && aboveCrossbar) {
      state.score += 3;
      state.conversions++;
      return { scored: true, checked: true };
    }
    return { scored: false, checked: true };
  }

  // Ball went past posts and is now far away or stopped
  const vel = ballBody.linvel();
  const speed = Math.sqrt(vel.x ** 2 + vel.y ** 2 + vel.z ** 2);
  const isStopped = speed < 0.5 && pos.y < 1;
  const isFarPast = currentZ < POSTS_Z - 20;

  if ((isStopped || isFarPast) && state.phase === 'kicked') {
    hasChecked = true;
    return { scored: false, checked: true };
  }

  lastBallZ = currentZ;
  return { scored: false, checked: false };
}
