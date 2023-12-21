const PARTNER_TYPES = [
  'Partner', // DEFAULT
  'Ex-Partner',
  'Married',
  'Abduction',
] as const;

type PartnerType = typeof PARTNER_TYPES[number];


export {
  PARTNER_TYPES,
  PartnerType,
};
