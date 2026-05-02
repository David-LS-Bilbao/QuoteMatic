# QuoteMatic

QuoteMatic es una aplicación backend con minifront en EJS que recomienda frases según la situación del usuario, el tipo de frase y el rango de edad declarado.

Estado actual: **Sprint 04 completado en la rama `feat/auth-sessions-age-gate`**.

Sprint 04 incorpora autenticación básica con registro, login, logout, sesiones persistidas en MongoDB, roles `user/admin` y bloqueo de menores de 14 años.

## Enfoque Actual del MVP

QuoteMatic se mantiene como un proyecto backend pequeño y centrado en demostrar dominio práctico de:

```text
MongoDB + Mongoose + Seed + API REST simple + CRUD mínimo + Auth básica
```

Las vistas EJS son mínimas y funcionan como apoyo visual. El valor principal del MVP está en levantar MongoDB, ejecutar el seed, probar endpoints REST sobre datos reales y demostrar un flujo básico de usuario con sesiones.

## Stack

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- EJS
- bcrypt para hash de contraseñas
- express-session para sesiones
- connect-mongo para persistir sesiones en MongoDB
- Docker Compose para MongoDB local
- `tsx` para ejecución TypeScript en desarrollo y seed

## Requisitos

- Node.js instalado.
- npm instalado.
- Docker y Docker Compose para levantar MongoDB local.
- Git para trabajar con ramas y flujo de PR.

## Instalación

```bash
npm install
```

## Variables de Entorno

El proyecto incluye `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/quotematic
SESSION_SECRET=change_me_in_development
```

Para desarrollo local, crea un archivo `.env` en la raíz tomando como referencia `.env.example`.

Ejemplo local:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/quotematic
SESSION_SECRET=quotematic_dev_secret_change_me
```

Notas:

- No subir `.env` al repositorio.
- No usar secretos reales en documentación.
- `SESSION_SECRET` es obligatorio para que las sesiones funcionen.

## Docker y MongoDB

Levantar MongoDB local:

```bash
docker compose up -d
docker ps
```

El servicio usa MongoDB en `localhost:27017` y persiste datos en un volumen de Docker.

## Seed Inicial

Ejecutar seed:

```bash
npm run seed
```

El seed:

- Conecta usando `MONGODB_URI`.
- Limpia colecciones antes de insertar datos.
- Inserta 4 autores.
- Inserta 4 situaciones.
- Inserta 8 tipos de frase.
- Inserta 12 frases.
- Valida referencias internas antes de insertar frases.
- No crea usuarios por defecto.

### Nota WSL

En algunos entornos WSL, `tsx` puede fallar al crear un socket temporal en una ruta montada de Windows.

Si `npm run seed` falla con `listen ENOTSUP`, usar:

```bash
TMPDIR=/tmp npm run seed
```

## Ejecutar en Desarrollo

```bash
npm run dev
```

Por defecto la aplicación escucha en:

```text
http://localhost:3000
```

## Build y Start

Compilar TypeScript y copiar vistas/assets:

```bash
npm run build
```

Ejecutar la versión compilada:

```bash
npm start
```

## Endpoints Disponibles

### Base

- `GET /` - landing inicial renderizada con EJS.
- `GET /health` - endpoint de salud del servidor.

### Auth

Rutas montadas bajo `/auth`:

- `GET /auth/register`
- `POST /auth/register`
- `GET /auth/login`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /auth/admin-check`

### Quote API

Rutas montadas bajo `/api/quotes`:

- `GET /api/quotes`
- `GET /api/quotes/:id`
- `GET /api/quotes/random`
- `POST /api/quotes`
- `PUT /api/quotes/:id`
- `DELETE /api/quotes/:id`

### Catalog API

Rutas montadas bajo `/api`:

- `GET /api/authors`
- `GET /api/situations`
- `GET /api/quote-types`

## Flujo de Prueba Completo

1. Instalar dependencias.

```bash
npm install
```

2. Crear `.env`.

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/quotematic
SESSION_SECRET=quotematic_dev_secret_change_me
```

3. Levantar MongoDB.

```bash
docker compose up -d
docker ps
```

4. Ejecutar seed.

```bash
npm run seed
```

Si falla en WSL por socket temporal:

```bash
TMPDIR=/tmp npm run seed
```

5. Arrancar servidor.

```bash
npm run dev
```

6. Probar endpoints base y API.

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/authors
curl http://localhost:3000/api/situations
curl http://localhost:3000/api/quote-types
curl http://localhost:3000/api/quotes
curl http://localhost:3000/api/quotes/random
```

7. Probar autenticación desde navegador.

```text
http://localhost:3000/auth/register
http://localhost:3000/auth/login
http://localhost:3000/auth/me
http://localhost:3000/auth/admin-check
```

Comprobación rápida de sesión:

```bash
curl http://localhost:3000/auth/me
```

## Autenticación y Sesiones

Sprint 04 añade autenticación básica con vistas EJS mínimas.

### Registro

Rutas:

```text
GET /auth/register
POST /auth/register
```

Campos:

```text
name
email
password
ageRange
```

Valores disponibles en el formulario:

```text
under_14
teen_14_17
adult_18_plus
```

Reglas:

- Menores de 14 años no pueden registrarse.
- `teen_14_17` se guarda como `ageGroup`.
- `adult_18_plus` se guarda como `ageGroup`.
- `under_14` no se guarda en base de datos.
- La contraseña se guarda como `passwordHash`.
- No se guarda password en texto plano.
- El email se normaliza a minúsculas.
- El email debe ser único.
- El rol por defecto es `user`.
- El usuario se crea con `isActive: true`.

### Login

Rutas:

```text
GET /auth/login
POST /auth/login
```

Reglas:

- Busca usuario por email.
- Valida contraseña con bcrypt.
- Rechaza usuarios inexistentes.
- Rechaza contraseñas incorrectas.
- Rechaza usuarios inactivos.
- Guarda en sesión `userId`, `role` y `ageGroup`.

### Logout

Ruta:

```text
POST /auth/logout
```

Destruye la sesión activa y redirige al inicio.

### Comprobación de sesión

Ruta:

```text
GET /auth/me
```

Respuesta sin sesión:

```json
{
  "authenticated": false
}
```

Respuesta con sesión:

```json
{
  "authenticated": true,
  "user": {
    "userId": "USER_ID",
    "role": "user",
    "ageGroup": "adult_18_plus"
  }
}
```

### Comprobación de rol admin

Ruta:

```text
GET /auth/admin-check
```

Usa los middlewares:

```text
isAuthenticated
isAdmin
```

Resultados esperados:

- Sin login: `401`.
- Usuario normal: `403`.
- Usuario admin: `200`.

Respuesta para admin:

```json
{
  "success": true,
  "message": "Admin access granted"
}
```

### Sesiones

Las sesiones se guardan en MongoDB mediante `connect-mongo`, usando la colección:

```text
sessions
```

Configuración de cookies para desarrollo:

```text
httpOnly: true
sameSite: lax
secure: false
```

La configuración productiva con HTTPS, cookies seguras y endurecimiento adicional queda fuera del alcance del MVP.

## Ejemplos Curl

### Health

```bash
curl http://localhost:3000/health
```

### Auth Me

```bash
curl http://localhost:3000/auth/me
```

### Catalogos

```bash
curl http://localhost:3000/api/authors
curl http://localhost:3000/api/situations
curl http://localhost:3000/api/quote-types
```

### Listar Frases

```bash
curl http://localhost:3000/api/quotes
```

### Frase Aleatoria

```bash
curl http://localhost:3000/api/quotes/random
```

### Crear Frase

Reemplaza `AUTHOR_ID`, `SITUATION_ID` y `QUOTE_TYPE_ID` por ids reales obtenidos desde los endpoints de catálogo.

```bash
curl -X POST http://localhost:3000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Frase de prueba desde curl",
    "author": "AUTHOR_ID",
    "situation": "SITUATION_ID",
    "quoteType": "QUOTE_TYPE_ID",
    "language": "es",
    "contentRating": "all",
    "verificationStatus": "pending",
    "sourceType": "original",
    "sourceReference": "README"
  }'
```

Respuesta esperada:

```text
HTTP 201
```

### Actualizar Frase

```bash
curl -X PUT http://localhost:3000/api/quotes/QUOTE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Frase de prueba actualizada",
    "contentRating": "teen",
    "verificationStatus": "manual_verified",
    "sourceType": "original"
  }'
```

Notas:

- El `PUT` actualiza parcialmente.
- Si cambia `text`, se recalcula `textNormalized`.
- El body público no acepta `isActive`.
- El `PUT` no opera sobre frases inactivas.

### Borrado Lógico

```bash
curl -X DELETE http://localhost:3000/api/quotes/QUOTE_ID
```

El documento no se borra físicamente. Se marca:

```json
{ "isActive": false }
```

### Comprobar GET Después del DELETE

```bash
curl http://localhost:3000/api/quotes/QUOTE_ID
```

Respuesta esperada:

```json
{
  "success": false,
  "message": "Quote not found"
}
```

## Validaciones de Sprint 04

Comandos recomendados antes de cerrar cambios:

```bash
npm run typecheck
npm run build
docker compose up -d
npm run seed
npm run dev
```

Validaciones principales de auth:

- `GET /auth/register` renderiza formulario.
- `POST /auth/register` crea usuarios adultos y teen.
- `POST /auth/register` bloquea menores de 14 años.
- Password guardada como `passwordHash`.
- Password no se guarda en texto plano.
- `GET /auth/login` renderiza formulario.
- `POST /auth/login` crea sesión.
- `POST /auth/logout` destruye sesión.
- `GET /auth/me` comprueba sesión.
- `GET /auth/admin-check` bloquea usuarios no autenticados.
- `GET /auth/admin-check` bloquea usuarios normales.
- `GET /auth/admin-check` permite usuarios admin.
- Las sesiones se guardan en MongoDB.
- La API REST de Sprint 03 sigue funcionando.

Validaciones principales de API:

- `POST /api/quotes` valida campos obligatorios.
- `POST /api/quotes` valida `author`, `situation` y `quoteType` como ObjectId.
- `POST /api/quotes` valida que las referencias existen y están activas.
- `POST /api/quotes` genera `textNormalized`.
- `POST /api/quotes` responde `201`.
- `PUT /api/quotes/:id` valida id.
- `PUT /api/quotes/:id` actualiza parcialmente.
- `PUT /api/quotes/:id` recalcula `textNormalized` si cambia `text`.
- `PUT /api/quotes/:id` valida `contentRating`, `verificationStatus` y `sourceType`.
- `PUT /api/quotes/:id` no acepta `isActive` desde el body público.
- `PUT /api/quotes/:id` no opera sobre recursos inactivos.
- `DELETE /api/quotes/:id` realiza borrado lógico.
- `GET /api/quotes/:id` devuelve `404` después del DELETE lógico.
- Los errores de API devuelven JSON con `success: false` y `message`.

## Scripts npm

- `npm run dev` - ejecuta el servidor en modo desarrollo con `tsx watch`.
- `npm run typecheck` - valida TypeScript sin emitir archivos.
- `npm run build` - limpia `dist`, compila TypeScript y copia vistas/assets.
- `npm start` - ejecuta `dist/server.js`.
- `npm run seed` - ejecuta el seed inicial con `tsx src/seeds/seed.ts`.
- `npm run clean` - elimina `dist`.
- `npm run copy:views` - copia `src/views` a `dist/views`.
- `npm run copy:public` - copia `src/public` a `dist/public`.
- `npm run copy:assets` - copia vistas y assets públicos.

## Modelos Principales

- `User`
- `Author`
- `Situation`
- `QuoteType`
- `Quote`
- `Favorite`

Relaciones principales:

- `Quote.author` referencia a `Author`.
- `Quote.situation` referencia a `Situation`.
- `Quote.quoteType` referencia a `QuoteType`.
- `Favorite.user` referencia a `User`.
- `Favorite.quote` referencia a `Quote`.

## Modelo User

Campos principales:

- `name`
- `email`
- `passwordHash`
- `role`
- `ageGroup`
- `isActive`

Reglas:

- `email` es único.
- `passwordHash` es obligatorio.
- `role` permite `user` y `admin`.
- `role` por defecto es `user`.
- `ageGroup` permite `teen_14_17` y `adult_18_plus`.
- `isActive` por defecto es `true`.

## Tipos de Dominio

El proyecto usa tipos cerrados mediante constantes `as const`:

- `UserRole`
- `AgeGroup`
- `AuthorType`
- `SourceType`
- `ContentRating`
- `VerificationStatus`
- `QuoteTypeSlug`

Roles oficiales:

- `user`
- `admin`

Age groups oficiales:

- `teen_14_17`
- `adult_18_plus`

Slugs técnicos oficiales de `QuoteType`:

- `stoic`
- `philosophical`
- `motivational`
- `funny`
- `realistic`
- `sarcastic`
- `wise_advice`
- `excuse`

Los slugs se mantienen en inglés para estabilidad técnica. Los nombres visibles pueden estar en castellano.

## Estructura del Proyecto

```text
QuoteMatic/
├── docs/
│   ├── bug-mongoose-missing-schema-populate.md
│   └── sprints/
│       ├── SPRINT_01_NEXT_STEPS.md
│       ├── SPRINT_01_QA_CHECKLIST.md
│       ├── SPRINT_01_SETUP_REPORT.md
│       ├── SPRINT_02_DOMAIN_MODELS_REPORT.md
│       ├── SPRINT_02_NEXT_STEPS.md
│       ├── SPRINT_02_QA_CHECKLIST.md
│       ├── SPRINT_03_API_REST_REPORT.md
│       ├── SPRINT_03_NEXT_STEPS.md
│       ├── SPRINT_03_QA_CHECKLIST.md
│       ├── SPRINT_04_AUTH_REPORT.md
│       ├── SPRINT_04_NEXT_STEPS.md
│       └── SPRINT_04_QA_CHECKLIST.md
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── api/
│   │   │   ├── catalogApi.controller.ts
│   │   │   └── quoteApi.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── health.controller.ts
│   │   └── home.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   └── role.middleware.ts
│   ├── models/
│   ├── public/
│   ├── routes/
│   │   ├── api/
│   │   │   ├── catalogApi.routes.ts
│   │   │   └── quoteApi.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── health.routes.ts
│   │   └── index.routes.ts
│   ├── seeds/
│   │   └── seed.ts
│   ├── types/
│   │   ├── domain.types.ts
│   │   └── express-session.d.ts
│   ├── views/
│   │   ├── auth/
│   │   │   ├── login.ejs
│   │   │   └── register.ejs
│   │   └── index.ejs
│   ├── app.ts
│   └── server.ts
├── .env.example
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

## Documentación del Sprint

Sprint 01:

- `docs/sprints/SPRINT_01_SETUP_REPORT.md`
- `docs/sprints/SPRINT_01_QA_CHECKLIST.md`
- `docs/sprints/SPRINT_01_NEXT_STEPS.md`

Sprint 02:

- `docs/sprints/SPRINT_02_DOMAIN_MODELS_REPORT.md`
- `docs/sprints/SPRINT_02_QA_CHECKLIST.md`
- `docs/sprints/SPRINT_02_NEXT_STEPS.md`

Sprint 03:

- `docs/sprints/SPRINT_03_API_REST_REPORT.md`
- `docs/sprints/SPRINT_03_QA_CHECKLIST.md`
- `docs/sprints/SPRINT_03_NEXT_STEPS.md`
- `docs/bug-mongoose-missing-schema-populate.md`

Sprint 04:

- `docs/sprints/SPRINT_04_AUTH_REPORT.md`
- `docs/sprints/SPRINT_04_QA_CHECKLIST.md`
- `docs/sprints/SPRINT_04_NEXT_STEPS.md`

## Flujo Git

- Rama de trabajo del Sprint 04: `feat/auth-sessions-age-gate`.
- Rama destino: `dev`.
- `main` queda como rama estable.
- El flujo recomendado es trabajar por ramas `feat/*`, validar localmente y abrir PR hacia `dev`.

Flujo seguro recomendado:

```bash
git switch dev
git pull origin dev
git switch -c feat/nombre-del-sprint
```

Validar antes de commit:

```bash
npm run typecheck
npm run build
```

Commits pequeños y descriptivos:

```text
feat(auth): add register flow
feat(auth): add login and logout flow
feat(auth): add auth and role middleware
docs(auth): document sprint 04 auth flow
```

## Roadmap

- Sprint 01: setup técnico base. Completado.
- Sprint 02: modelos de dominio y seed inicial. Completado.
- Sprint 03: API REST pública de consulta y CRUD básico de `Quote`. Completado.
- Sprint 04: autenticación, sesiones, roles y age gate. Completado.
- Sprint 05: favoritos funcionales, rutas protegidas y polish mínimo.

## Fuera de Alcance Actual

QuoteMatic todavía no implementa:

- Favoritos funcionales.
- Dashboard.
- Paginación.
- Búsqueda avanzada.
- APIs externas.
- Panel admin complejo.
- Recuperación de contraseña.
- Verificación de email.
- OAuth.
- JWT.
- Configuración productiva completa de cookies.
- Tests automatizados complejos.