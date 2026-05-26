export interface InputState {
  spaceHeld: boolean;
  spaceJustReleased: boolean;
  leftHeld: boolean;
  rightHeld: boolean;
}

const state: InputState = {
  spaceHeld: false,
  spaceJustReleased: false,
  leftHeld: false,
  rightHeld: false,
};

export function initInput(): InputState {
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      state.spaceHeld = true;
    }
    if (e.code === 'ArrowLeft') state.leftHeld = true;
    if (e.code === 'ArrowRight') state.rightHeld = true;
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      state.spaceHeld = false;
      state.spaceJustReleased = true;
    }
    if (e.code === 'ArrowLeft') state.leftHeld = false;
    if (e.code === 'ArrowRight') state.rightHeld = false;
  });

  return state;
}

export function consumeSpaceRelease(): boolean {
  if (state.spaceJustReleased) {
    state.spaceJustReleased = false;
    return true;
  }
  return false;
}

export function getInput(): InputState {
  return state;
}
