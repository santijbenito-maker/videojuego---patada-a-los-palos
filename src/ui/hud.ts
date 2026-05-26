import { GameState } from '../game/state';

const scoreEl = document.getElementById('score')!;
const attemptsEl = document.getElementById('attempts')!;
const conversionsEl = document.getElementById('conversions')!;
const powerFill = document.getElementById('power-bar-fill')!;
const powerLabel = document.getElementById('power-label')!;
const dirArrow = document.getElementById('direction-arrow')!;
const messageEl = document.getElementById('message')!;
const instructionsEl = document.getElementById('instructions')!;

export function updateHUD(state: GameState): void {
  scoreEl.textContent = state.score.toString();
  attemptsEl.textContent = state.attempts.toString();
  conversionsEl.textContent = state.conversions.toString();

  // Power bar
  const powerPercent = Math.round(state.power * 100);
  powerFill.style.width = `${powerPercent}%`;

  if (state.phase === 'charging') {
    powerLabel.textContent = `${powerPercent}%`;
  } else if (state.phase === 'aiming') {
    powerLabel.textContent = 'Mantené ESPACIO para cargar potencia';
  } else {
    powerLabel.textContent = '';
  }

  // Direction arrow
  const rotation = state.direction * 30; // Max 30 degrees visual
  dirArrow.style.transform = `rotate(${rotation}deg)`;

  // Instructions visibility
  instructionsEl.style.opacity = state.phase === 'aiming' || state.phase === 'charging' ? '1' : '0';
}

export function showMessage(text: string, duration: number = 2000): void {
  messageEl.textContent = text;
  messageEl.style.opacity = '1';
  setTimeout(() => {
    messageEl.style.opacity = '0';
  }, duration);
}
