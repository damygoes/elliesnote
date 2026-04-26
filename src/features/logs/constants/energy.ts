export const ENERGY_LEVELS = [1, 2, 3, 4, 5] as const;
export type EnergyLevel = (typeof ENERGY_LEVELS)[number];

export const ENERGY_COLORS: Record<EnergyLevel, string> = {
  1: '#C97B6A', // soft coral  — very low
  2: '#C4975A', // warm amber  — low
  3: '#B8A860', // muted gold  — moderate
  4: '#7A9E72', // soft green  — good
  5: '#5C7A62', // sage        — great (matches primary)
};

export const ENERGY_SOFT_COLORS: Record<EnergyLevel, string> = {
  1: '#F5E8E6', // light coral tint
  2: '#F5EDE3', // light amber tint
  3: '#F2EDD8', // light gold tint
  4: '#E5EEE3', // light green tint
  5: '#EBF2EC', // sage_soft (matches primary_soft)
};
