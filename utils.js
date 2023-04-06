export const clamp = (num, min, max) => Math.max(min, Math.min(num, max));

export const fuzzyCompare = (mainStr, subStr) =>
  mainStr.toLowerCase().includes(subStr.toLowerCase());