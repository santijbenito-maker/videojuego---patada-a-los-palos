export type GamePhase = 'aiming' | 'charging' | 'kicked' | 'result';

export interface GameState {
  phase: GamePhase;
  score: number;
  attempts: number;
  conversions: number;
  power: number;
  direction: number; // -1 to 1 (left to right)
  resultTimer: number;
  ballStartZ: number;
}

export function createGameState(): GameState {
  return {
    phase: 'aiming',
    score: 0,
    attempts: 0,
    conversions: 0,
    power: 0,
    direction: 0,
    resultTimer: 0,
    ballStartZ: -20,
  };
}
