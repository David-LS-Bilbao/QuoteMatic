# Sprint 07 — Swagger / OpenAPI Report

Proyecto: QuoteMatic  
Rama: `feat/swagger-openapi-docs`

## Objetivo

Añadir documentación Swagger/OpenAPI para la API REST existente de QuoteMatic, sin cambiar la lógica funcional de controladores, modelos ni reglas de negocio.

El objetivo es que el profesor pueda abrir una documentación interactiva, entender los endpoints principales y probar la API localmente con mayor facilidad.

## Archivos Modificados

- `package.json`
- `package-lock.json`
- `src/config/swagger.ts`
- `src/routes/docs.routes.ts`
- `src/app.ts`
- `README.md`
- `docs/sprints/SPRINT_07_SWAGGER_REPORT.md`
- `docs/sprints/SPRINT_07_QA_CHECKLIST.md`
- `docs/sprints/SPRINT_07_NEXT_STEPS.md`

## Dependencias Añadidas

Dependencies:

- `swagger-jsdoc`
- `swagger-ui-express`

Dev dependencies:

- `@types/swagger-jsdoc`
- `@types/swagger-ui-express`

## Endpoints Documentados

Base:

- `GET /health`

Auth:

- `GET /auth/register`
- `POST /auth/register`
- `GET /auth/login`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /auth/admin-check`

Catálogos:

- `GET /api/authors`
- `GET /api/situations`
- `GET /api/quote-types`

Quotes:

- `GET /api/quotes`
- `GET /api/quotes/:id`
- `GET /api/quotes/random`
- `POST /api/quotes`
- `PUT /api/quotes/:id`
- `DELETE /api/quotes/:id`

Favorites:

- `GET /api/favorites/me`
- `POST /api/favorites/:quoteId`
- `DELETE /api/favorites/:quoteId`

Documentación:

- `GET /api-docs`
- `GET /api-docs.json`

## Schemas Incluidos

- `ApiSuccess`
- `ApiError`
- `Author`
- `Situation`
- `QuoteType`
- `Quote`
- `Favorite`
- `UserSession`
- `RegisterRequest`
- `LoginRequest`
- `CreateQuoteRequest`
- `UpdateQuoteRequest`

## Decisiones Técnicas

- Usar OpenAPI `3.0.3`.
- Centralizar la especificación en `src/config/swagger.ts`.
- Separar las rutas de documentación en `src/routes/docs.routes.ts`.
- Montar documentación desde `src/app.ts` sin tocar controladores existentes.
- Documentar sesión mediante cookie `connect.sid`.
- No introducir JWT.
- No crear UI propia.
- No cambiar modelos ni rutas funcionales existentes.

## Validaciones Realizadas

- `npm run typecheck`
- `npm run build`

Validaciones manuales recomendadas:

- Abrir `http://localhost:3000/api-docs`.
- Abrir `http://localhost:3000/api-docs.json`.
- Probar `curl http://localhost:3000/health`.
- Probar `curl http://localhost:3000/api/quotes`.
- Probar `curl http://localhost:3000/api/authors`.

## Estado Final

Sprint 07 deja Swagger UI disponible en `/api-docs` y la especificación OpenAPI disponible en `/api-docs.json`.

La documentación cubre los endpoints principales del MVP y distingue endpoints públicos, endpoints con sesión y endpoints reservados a admin.

## Fuera de Alcance

- Nueva UI.
- Dashboard.
- React.
- APIs externas.
- Importación de datos.
- Tests complejos.
- Refactors grandes.
- Nuevas reglas de negocio.
