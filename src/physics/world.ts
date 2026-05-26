import RAPIER from '@dimforge/rapier3d';

let rapierWorld: RAPIER.World | null = null;
let rapierModule: typeof RAPIER | null = null;

export async function initPhysics(): Promise<RAPIER.World> {
  rapierModule = await import('@dimforge/rapier3d');
  rapierWorld = new rapierModule.World({ x: 0, y: -9.81, z: 0 });
  return rapierWorld;
}

export function getWorld(): RAPIER.World {
  if (!rapierWorld) throw new Error('Physics not initialized');
  return rapierWorld;
}

export function getRapier(): typeof RAPIER {
  if (!rapierModule) throw new Error('Rapier not initialized');
  return rapierModule;
}
