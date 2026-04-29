
// roles de usuarios
export const USER_ROLES = [
    "user", 
    "admin"
] as const;
export type UserRole = (typeof USER_ROLES)[number];

// grupos de edad
export const AGE_GROUPS = [
    "teen_14_17", 
    "adult_18_plus"
] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number];


// tipos de autores
export const AUTHOR_TYPES = [
    "real",
  "historical",
  "fictional",
  "unknown",
] as const;
export type AuthorType = (typeof AUTHOR_TYPES)[number];

// tipos de fuentes
export const SOURCE_TYPES = [
    "book", 
    "movie",
     "tv_show",
     "historical",
     "original", 
     "unknown"
    ] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

// rangos de edades
export const CONTENT_RATINGS = [
    "all",
    "teen",
    "adult"
] as const;
export type ContentRating = (typeof CONTENT_RATINGS)[number];

// estados de verificación
export const VERIFICATION_STATUSES = [
  "original",
  "pending",
  "manual_verified",
  "rejected",
  "disputed",
] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

// tipos de frases disponibles en la app
export const QUOTE_TYPE_SLUGS = [
  "stoic",
  "philosophical",
  "motivational",
  "funny",
  "realistic",
  "sarcastic",
  "wise_advice",
  "excuse",
] as const;

export type QuoteTypeSlug = (typeof QUOTE_TYPE_SLUGS)[number];