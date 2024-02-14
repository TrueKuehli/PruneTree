const LIFE_STATES = [
  'Alien',
  'Cat',
  'Dog',
  'Ghost',
  'Horse',
  'Mermaid',
  'PlantSim',
  'Servo',
  'Sim',
  'Skeleton',
  'Spellcaster',
  'Unicorn',
  'Vampire',
  'Werewolf',
] as const;

type LifeState = typeof LIFE_STATES[number];


export {
  LifeState,
  LIFE_STATES,
};
