const CONCEPTION_TYPES = [
  'WooHoo', // DEFAULT
  'Alien Abduction',
  'Cloning',
] as const;

type ConceptionType = typeof CONCEPTION_TYPES[number];


const LEGACY_PARENT_TYPES = {
  'NONE': 'WooHoo',
  'ABDUCTION': 'Alien Abduction',
  'CLONE': 'Cloning',
} as const;


export {
  CONCEPTION_TYPES,
  ConceptionType,
  LEGACY_PARENT_TYPES,
};
