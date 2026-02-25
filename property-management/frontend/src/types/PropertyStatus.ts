export const PropertyStatus = {
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED",
} as const;

export type PropertyStatus =
  typeof PropertyStatus[keyof typeof PropertyStatus];
