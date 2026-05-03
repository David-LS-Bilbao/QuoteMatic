# Sprint 08 — EJS Responsive UI Report

Proyecto: QuoteMatic  
Rama: `feat/ejs-responsive-ui`

## Objetivo

Crear una interfaz EJS responsive y funcional para demo, manteniendo el foco principal del proyecto en el backend: MongoDB, Mongoose, seed, API REST, auth, favoritos y autorización admin.

La UI no busca ser un frontend complejo. Busca permitir probar la app desde navegador y móvil de forma clara.

## Alcance Implementado

- Home con navegación útil.
- Dashboard web para pedir frases aleatorias.
- Guardado de favoritos desde el dashboard.
- Página de favoritos protegida por sesión.
- Eliminación de favoritos desde navegador.
- Panel admin mínimo protegido por rol.
- Acceso visible a Swagger.
- Estilos responsive mobile-first.

## Páginas Añadidas o Mejoradas

- `GET /`
- `GET /dashboard`
- `GET /favorites`
- `GET /admin`
- `GET /auth/register`
- `GET /auth/login`

## Archivos Creados

- `src/controllers/web/dashboard.controller.ts`
- `src/controllers/web/favoritesPage.controller.ts`
- `src/controllers/web/adminPage.controller.ts`
- `src/routes/web.routes.ts`
- `src/views/dashboard.ejs`
- `src/views/favorites.ejs`
- `src/views/admin.ejs`
- `src/public/app.js`
- `docs/sprints/SPRINT_08_UI_REPORT.md`
- `docs/sprints/SPRINT_08_QA_CHECKLIST.md`
- `docs/sprints/SPRINT_08_NEXT_STEPS.md`

## Archivos Modificados

- `src/app.ts`
- `src/controllers/home.controller.ts`
- `src/views/index.ejs`
- `src/views/auth/login.ejs`
- `src/views/auth/register.ejs`
- `src/public/styles.css`
- `README.md`

## Decisiones Técnicas

- Mantener MVC simple.
- No añadir dependencias frontend.
- No usar React.
- Usar EJS y CSS propio.
- Usar JavaScript mínimo en `src/public/app.js`.
- Reutilizar la API existente para:
  - `GET /api/quotes/random`
  - `POST /api/favorites/:quoteId`
  - `DELETE /api/favorites/:quoteId`
- No cambiar controladores REST.
- No cambiar modelos.
- No cambiar reglas de negocio.

## Resultado Funcional

Usuario no logueado:

- Puede ver home.
- Puede ver dashboard.
- Puede pedir frase aleatoria.
- No puede guardar favoritos.
- No puede entrar a `/favorites`.

Usuario normal:

- Puede registrarse.
- Puede iniciar sesión.
- Puede usar dashboard.
- Puede guardar favoritos.
- Puede ver favoritos.
- Puede quitar favoritos.

Usuario admin:

- Puede entrar a `/admin`.
- Puede acceder rápido a Swagger y endpoints útiles.
- Puede ver tabla mínima de frases activas.

## Fuera de Alcance

- React.
- SPA.
- Dashboard complejo.
- Panel CRUD visual completo.
- Paginación.
- Búsqueda avanzada.
- APIs externas.
- Nuevas reglas de negocio.
- Tests complejos.
