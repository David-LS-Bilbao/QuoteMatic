# QuoteMatic

QuoteMatic es una aplicación backend con minifront en EJS que recomienda frases según la situación del usuario, el tipo de frase y el rango de edad declarado.

Estado actual: **Sprint 08 completado — Interfaz EJS responsive funcional**.

Sprint 08 añade una interfaz visual sencilla para demo desde navegador y móvil. El MVP backend mantiene lecturas públicas, favoritos protegidos por sesión, escritura de frases reservada a admin y documentación Swagger.

## Enfoque Actual del MVP

QuoteMatic se mantiene como un proyecto backend pequeño y centrado en demostrar dominio práctico de:

```text
MongoDB + Mongoose + Seed + API REST simple + CRUD mínimo + Auth + Favoritos + Autorización admin
```

Las vistas EJS son funcionales y sirven como apoyo visual para demo. El valor principal del MVP sigue estando en levantar MongoDB, ejecutar el seed, probar endpoints REST sobre datos reales y demostrar sesiones, favoritos y autorización básica por rol.

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
- swagger-jsdoc y swagger-ui-express para documentación OpenAPI
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
- No crea usuarios admin por defecto.

### Nota WSL

En algunos entornos WSL, `tsx` puede fallar al crear un socket temporal en una ruta montada de Windows.

Si `npm run seed` falla con `listen ENOTSUP` o `EPERM`, usar:

```bash
TMPDIR=/tmp TEMP=/tmp TMP=/tmp npm run seed
```

## Flujo de demo recomendado

Secuencia completa para preparar el entorno antes de una demo:

```bash
docker compose up -d
npm run seed
npm run seed:admin
npm run dev
```

### Credenciales de demo

| Campo    | Valor                      |
|----------|----------------------------|
| Email    | `admin@quotematic.local`   |
| Password | `Admin123!`                |
| Rol      | `admin`                    |

**ADVERTENCIA:** Estas credenciales son solo para desarrollo y demo local. No usar en producción.

El script `npm run seed:admin` es idempotente: ejecutarlo varias veces actualiza el usuario existente sin crear duplicados.

---

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
- `GET /dashboard` - dashboard visual para pedir frases y guardar favoritos.
- `GET /favorites` - favoritos del usuario autenticado.
- `GET /admin` - panel admin mínimo.
- `GET /health` - endpoint de salud del servidor.
- `GET /api-docs` - documentación Swagger UI.
- `GET /api-docs.json` - especificación OpenAPI en JSON.

### Auth

Rutas montadas bajo `/auth`:

- `GET /auth/register`
- `POST /auth/register`
- `GET /auth/login`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me` - requiere sesión.
- `GET /auth/admin-check` - requiere sesión y rol `admin`.

### Quote API

Rutas montadas bajo `/api/quotes`:

- `GET /api/quotes` - público.
- `GET /api/quotes/:id` - público.
- `GET /api/quotes/random` - público.
- `POST /api/quotes` - requiere sesión y rol `admin`.
- `PUT /api/quotes/:id` - requiere sesión y rol `admin`.
- `DELETE /api/quotes/:id` - requiere sesión y rol `admin`.

### Catalog API

Rutas montadas bajo `/api`:

- `GET /api/authors` - público.
- `GET /api/situations` - público.
- `GET /api/quote-types` - público.

### Favorites API

Rutas montadas bajo `/api/favorites`:

- `GET /api/favorites/me` - requiere sesión.
- `POST /api/favorites/:quoteId` - requiere sesión.
- `DELETE /api/favorites/:quoteId` - requiere sesión.

### API 404

Rutas inexistentes bajo `/api/*` devuelven JSON:

```json
{
  "success": false,
  "message": "API route not found"
}
```

## Documentación Swagger / OpenAPI

Sprint 07 añade documentación interactiva de la API usando Swagger/OpenAPI.

URLs locales:

```text
http://localhost:3000/api-docs
http://localhost:3000/api-docs.json
```

Para probarlo:

```bash
docker compose up -d
npm run seed
npm run dev
```

Después abre en el navegador:

```text
http://localhost:3000/api-docs
```

También puedes inspeccionar la especificación JSON:

```bash
curl http://localhost:3000/api-docs.json
```

Notas:

- Swagger documenta los endpoints principales del MVP.
- Los endpoints protegidos requieren login y cookie de sesión.
- `POST /api/quotes`, `PUT /api/quotes/:id` y `DELETE /api/quotes/:id` requieren rol `admin`.
- La app usa sesión/cookie (`connect.sid`), no JWT.
- La documentación es suficiente para demo y revisión de bootcamp; no busca ser una especificación enterprise completa.

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
TMPDIR=/tmp TEMP=/tmp TMP=/tmp npm run seed
```

5. Arrancar servidor.

```bash
npm run dev
```

6. Probar endpoints públicos.

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/authors
curl http://localhost:3000/api/situations
curl http://localhost:3000/api/quote-types
curl http://localhost:3000/api/quotes
curl http://localhost:3000/api/quotes/random
```

## Uso desde navegador

Sprint 08 permite usar QuoteMatic desde páginas EJS responsive.

Rutas visuales disponibles:

- `http://localhost:3000/`
- `http://localhost:3000/dashboard`
- `http://localhost:3000/auth/register`
- `http://localhost:3000/auth/login`
- `http://localhost:3000/favorites`
- `http://localhost:3000/admin`
- `http://localhost:3000/api-docs`

Flujo demo recomendado:

1. Abrir `/`.
2. Crear cuenta en `/auth/register`.
3. Iniciar sesión en `/auth/login`.
4. Ir a `/dashboard`.
5. Pedir una frase aleatoria.
6. Guardar la frase como favorita.
7. Ir a `/favorites`.
8. Quitar un favorito.
9. Abrir `/api-docs` para ver Swagger.
10. Si el usuario tiene rol admin, entrar a `/admin`.

Notas:

- El dashboard es público para pedir frases aleatorias.
- Guardar favoritos requiere sesión.
- `/favorites` requiere sesión.
- `/admin` requiere rol `admin`.
- Swagger sigue disponible en `/api-docs`.

## Autenticación y Sesiones

Sprint 04 añadió autenticación básica con vistas EJS mínimas.

### Registro

Rutas:

```text
GET /auth/register
POST /auth/register
```

Reglas:

- Menores de 14 años no pueden registrarse.
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

## Autorización Admin en Quote API

Sprint 06 conecta los roles reales de usuario con la escritura de frases.

### Rutas públicas

No requieren login:

- `GET /api/quotes`
- `GET /api/quotes/:id`
- `GET /api/quotes/random`
- `GET /api/authors`
- `GET /api/situations`
- `GET /api/quote-types`

### Rutas protegidas por sesión

Requieren usuario autenticado:

- `GET /api/favorites/me`
- `POST /api/favorites/:quoteId`
- `DELETE /api/favorites/:quoteId`
- `GET /auth/me`

### Rutas protegidas por admin

Requieren sesión activa y rol `admin`:

- `POST /api/quotes`
- `PUT /api/quotes/:id`
- `DELETE /api/quotes/:id`

Estas rutas usan:

```text
isAuthenticated + isAdmin
```

Resultados esperados:

- Sin login: `401 Unauthorized`.
- Usuario normal: `403 Forbidden`.
- Usuario admin: operación permitida.

### Probar admin con MongoDB Compass

Flujo local recomendado:

1. Crear usuario normal desde `/auth/register`.
2. Abrir MongoDB Compass.
3. Ir a la colección `users`.
4. Cambiar el campo `role` de `"user"` a `"admin"`.
5. Guardar el documento.
6. Cerrar sesión.
7. Volver a iniciar sesión.

Es necesario volver a iniciar sesión porque el rol se guarda en la sesión durante login.

### 404 JSON para `/api/*`

Las rutas inexistentes bajo `/api` devuelven:

```json
{
  "success": false,
  "message": "API route not found"
}
```

## Favoritos

Sprint 05 añadió favoritos funcionales protegidos por sesión.

Comportamiento:

- Un usuario autenticado puede listar sus favoritos.
- Un usuario autenticado puede añadir una quote a favoritos.
- Un usuario autenticado puede quitar una quote de favoritos.
- No se crean duplicados para el mismo usuario y quote.
- Si un favorito se quitó con borrado lógico, un nuevo POST lo reactiva.
- Un usuario no puede operar sobre favoritos de otro usuario.

## Ejemplos Curl

### Health

```bash
curl http://localhost:3000/health
```

### Auth Me

```bash
curl http://localhost:3000/auth/me
```

### Catálogos

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

> Desde Sprint 06, esta operación requiere sesión activa con rol admin.

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

Respuesta esperada con admin:

```text
HTTP 201
```

### Actualizar Frase

> Desde Sprint 06, esta operación requiere sesión activa con rol admin.

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

> Desde Sprint 06, esta operación requiere sesión activa con rol admin.

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

### Favoritos

Requieren sesión activa.

```bash
curl http://localhost:3000/api/favorites/me
curl -X POST http://localhost:3000/api/favorites/QUOTE_ID
curl -X DELETE http://localhost:3000/api/favorites/QUOTE_ID
```

## Validaciones de Sprint 07

Comandos recomendados antes de cerrar cambios:

```bash
npm run typecheck
npm run build
docker compose up -d
npm run seed
npm run dev
```

Validaciones principales:

- `GET /api-docs` muestra Swagger UI.
- `GET /api-docs.json` devuelve OpenAPI JSON.
- `GET /api/quotes` devuelve 200 sin login.
- `GET /api/quotes/random` devuelve 200 sin login.
- `GET /api/authors` devuelve 200 sin login.
- `GET /api/situations` devuelve 200 sin login.
- `GET /api/quote-types` devuelve 200 sin login.
- `POST /api/quotes` sin login devuelve 401.
- `POST /api/quotes` con usuario normal devuelve 403.
- `POST /api/quotes` con admin devuelve 201.
- `PUT /api/quotes/:id` con admin devuelve 200.
- `DELETE /api/quotes/:id` con admin devuelve 200.
- `GET /api/quotes/:id` tras DELETE lógico devuelve 404.
- `GET /api/favorites/me` sin login devuelve 401.
- `GET /api/favorites/me` con login devuelve 200.
- `GET /api/ruta-inexistente` devuelve 404 JSON.
- Los errores de API devuelven JSON con `success: false` y `message`.

## Scripts npm

- `npm run dev` - ejecuta el servidor en modo desarrollo con `tsx watch`.
- `npm run typecheck` - valida TypeScript sin emitir archivos.
- `npm run build` - limpia `dist`, compila TypeScript y copia vistas/assets.
- `npm start` - ejecuta `dist/server.js`.
- `npm run seed` - ejecuta el seed inicial con `tsx src/seeds/seed.ts`.
- `npm run seed:admin` - crea o actualiza el usuario admin de demo (idempotente).
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
│       ├── SPRINT_04_QA_CHECKLIST.md
│       ├── SPRINT_05_FAVORITES_REPORT.md
│       ├── SPRINT_06_ADMIN_PROTECTION_REPORT.md
│       ├── SPRINT_06_QA_CHECKLIST.md
│       ├── SPRINT_06_NEXT_STEPS.md
│       ├── SPRINT_07_SWAGGER_REPORT.md
│       ├── SPRINT_07_QA_CHECKLIST.md
│       ├── SPRINT_07_NEXT_STEPS.md
│       ├── SPRINT_08_UI_REPORT.md
│       ├── SPRINT_08_QA_CHECKLIST.md
│       └── SPRINT_08_NEXT_STEPS.md
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── swagger.ts
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── public/
│   │   ├── app.js
│   │   └── styles.css
│   ├── routes/
│   ├── seeds/
│   ├── types/
│   ├── views/
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

Sprint 05:

- `docs/sprints/SPRINT_05_FAVORITES_REPORT.md`

Sprint 06:

- `docs/sprints/SPRINT_06_ADMIN_PROTECTION_REPORT.md`
- `docs/sprints/SPRINT_06_QA_CHECKLIST.md`
- `docs/sprints/SPRINT_06_NEXT_STEPS.md`

Sprint 07:

- `docs/sprints/SPRINT_07_SWAGGER_REPORT.md`
- `docs/sprints/SPRINT_07_QA_CHECKLIST.md`
- `docs/sprints/SPRINT_07_NEXT_STEPS.md`

Sprint 08:

- `docs/sprints/SPRINT_08_UI_REPORT.md`
- `docs/sprints/SPRINT_08_QA_CHECKLIST.md`
- `docs/sprints/SPRINT_08_NEXT_STEPS.md`

## Flujo Git

- Rama de trabajo del Sprint 08: `feat/ejs-responsive-ui`.
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
feat(favorites): add protected favorites api
feat(auth): protect quote write endpoints with admin role
feat(docs): add swagger openapi setup
feat(ui): add responsive ejs demo interface
docs(sprint): add sprint 06 admin protection documentation
```

## Roadmap

- Sprint 01: setup técnico base. Completado.
- Sprint 02: modelos de dominio y seed inicial. Completado.
- Sprint 03: API REST pública de consulta y CRUD básico de `Quote`. Completado.
- Sprint 04: autenticación, sesiones, roles y age gate. Completado.
- Sprint 05: favoritos funcionales, rutas protegidas y polish mínimo. Completado.
- Sprint 06: protección admin para escritura de quotes y hardening MVP. Completado.
- Sprint 07: documentación Swagger/OpenAPI para la API REST. Completado.
- Sprint 08: interfaz EJS responsive funcional para demo. Completado.

## Fuera de Alcance Actual

QuoteMatic todavía no implementa:

- Paginación.
- Búsqueda avanzada.
- Panel admin complejo.
- Recuperación de contraseña.
- Verificación de email.
- OAuth.
- JWT.
- Configuración productiva completa de cookies.
- Tests automatizados complejos.

## Mejoras Futuras

- Importación desde APIs externas como Quotable.
