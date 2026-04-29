
export const USER_ROLES = ["user", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const AGE_GROUP = ["teen_14_17", "adult_18_plus"] as const;
export type AgeGroup = (typeof AGE_GROUP)[number];

export const AUTHOR_TYPES = [
    "real",
  "historical",
  "fictional",
  "unknown",
] as const;

export type AuthorType = (typeof AUTHOR_TYPES)[number];

export const SOURCE_TYPES = ["book", "movie", "tv_show","historical","original", "unknown"] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export const CONTENT_RATNGS = ["all","teen","adult"] as const;
export type ContentRating = (typeof CONTENT_RATNGS)[number];

export const VERIFICATION_STATUSES = [
  "original",
  "pending",
  "manual_verified",
  "rejected",
  "disputed",
] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];