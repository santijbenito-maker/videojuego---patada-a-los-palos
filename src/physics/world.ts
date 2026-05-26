import RAPIER from '@dimforge/rapier3d-compat';

let rapierWorld: RAPIER.World | null = null;

export async function initPhysics(): Promise<RAPIER.World> {
  await RAPIER.init();
  rapierWorld = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  return rapierWorld;
}

export function getWorld(): RAPIER.World {
  if (!rapierWorld) throw new Error('Physics not initialized');
  return rapierWorld;
}

export function getRapier(): typeof RAPIER {
  return RAPIER;
}
