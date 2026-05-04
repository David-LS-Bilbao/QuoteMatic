import "express-session";

import type { AgeGroup, UserRole } from "./domain.types";


// Extensión de tipos para express-session para incluir userId, role y ageGroup
//  en la sesión de usuario y así poder acceder a esta información en cualquier parte de la aplicación a través de req.session.
// Esto es útil para manejar la autenticación y autorización de usuarios, así como para personalizar la experiencia del usuario según su grupo de edad.


declare module "express-session" {
  interface SessionData {
    userId?: string;
    role?: UserRole;
    ageGroup?: AgeGroup;
  }
}


/*
Por qué hace falta

Permite que TypeScript entienda:

req.session.userId
req.session.role
req.session.ageGroup

Sin este archivo, npm run typecheck probablemente fallará.
*/