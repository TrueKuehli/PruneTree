const CONCEPTION_TYPES = [
  'WooHoo', // DEFAULT
  'Alien Abduction',
  'Cloning',
] as const;

type ConceptionType = typeof CONCEPTION_TYPES[number];


export {
  CONCEPTION_TYPES,
  ConceptionType,
};
