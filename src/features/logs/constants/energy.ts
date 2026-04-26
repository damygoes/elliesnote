export const ENERGY_LEVELS = [1, 2, 3, 4, 5] as const;
export type EnergyLevel = (typeof ENERGY_LEVELS)[number];
