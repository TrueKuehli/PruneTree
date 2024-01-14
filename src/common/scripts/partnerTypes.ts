const PARTNER_TYPES = [
  'Partner', // DEFAULT
  'Ex-Partner',
  'Married',
  'Abduction',
] as const;

type PartnerType = typeof PARTNER_TYPES[number];


const LEGACY_PARTNER_TYPES = {
  'PARTNER': 'Partner',
  'EX_PARTNER': 'Ex-Partner',
  'MARRIED': 'Married',
  'ABDUCTION': 'Abduction',
} as const;


export {
  PARTNER_TYPES,
  PartnerType,
  LEGACY_PARTNER_TYPES,
};
