export const listCardAccents = [
  "oklch(0.78 0.1 50)",
  "oklch(0.68 0.09 245)",
  "oklch(0.78 0.06 320)",
  "oklch(0.78 0.07 150)",
  "oklch(0.86 0.05 95)",
] as const;

export const listCardTilts = ["", "", "tilt-r", "", "", "tilt-l"] as const;

export const getListCardAccent = (id: number) => {
  return listCardAccents[id % listCardAccents.length];
};

export const getListCardTilt = (id: number) => {
  return listCardTilts[id % listCardTilts.length];
};
