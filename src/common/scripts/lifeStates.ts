const LIFE_STATES = [
  'Alien',
  'Cat',
  'Dog',
  'Ghost',
  'Mermaid',
  'PlantSim',
  'Servo',
  'Sim',
  'Skeleton',
  'Spellcaster',
  'Vampire',
] as const;

type LifeState = typeof LIFE_STATES[number];


export {
  LifeState,
  LIFE_STATES,
};
