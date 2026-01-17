import type { Unit } from '../store/weatherSlice';

export const convertTemp = (tempInC: number, unit: Unit): number => {
  if (unit === 'F') {
    return Math.round((tempInC * 9 / 5) + 32);
  }
  if (unit === 'K') {
    return Math.round(tempInC + 273.15);
  }
  return Math.round(tempInC);
};