# QuoteMatic

QuoteMatic es una aplicacion backend con minifront en EJS que recomienda frases segun la situacion del usuario, el tipo de frase y el rango de edad declarado.

Estado actual: **Sprint 03 completado en la rama `feat/api-rest-quotes`**.

Sprint 03 incorpora una API REST publica para consultar catalogos y realizar CRUD basico sobre frases (`Quote`) usando Node.js, Express, TypeScript, MongoDB y Mongoose.

## Enfoque Actual del MVP

QuoteMatic se mantiene como un proyecto backend pequeno y centrado en demostrar dominio practico de:

```text
MongoDB + Mongoose + Seed + API REST simple + CRUD minimo
```

Las vistas EJS son minimas y funcionan como apoyo visual. El valor principal del MVP esta en levantar MongoDB, ejecutar el seed y probar endpoints REST sobre datos reales.

## Stack

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- EJS
- Docker Compose para MongoDB local
- `tsx` para ejecucion TypeScript en desarrollo y seed

## Requisitos

- Node.js instalado.
- npm instalado.
- Docker y Docker Compose para levantar MongoDB local.
- Git para trabajar con ramas y flujo de PR.

## Instalacion

```bash
npm install
```

## Variables de Entorno

El proyecto incluye `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/quotematic
```

Para desarrollo local, crea un archivo `.env` en la raiz tomando como referencia `.env.example`.

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
- No crea usuarios todavia.

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

Por defecto la aplicacion escucha en:

```text
http://localhost:3000
```

## Build y Start

Compilar TypeScript y copiar vistas/assets:

```bash
npm run build
```

Ejecutar la version compilada:

```bash
npm start
```

## Endpoints Disponibles

### Base

- `GET /` - landing inicial renderizada con EJS.
- `GET /health` - endpoint de salud del servidor.

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

2. Levantar MongoDB.

```bash
docker compose up -d
docker ps
```

3. Ejecutar seed.

```bash
npm run seed
```

Si falla en WSL por socket temporal:

```bash
TMPDIR=/tmp npm run seed
```

4. Arrancar servidor.

```bash
npm run dev
```

5. Probar endpoints.

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/authors
curl http://localhost:3000/api/situations
curl http://localhost:3000/api/quote-types
curl http://localhost:3000/api/quotes
curl http://localhost:3000/api/quotes/random
```

## Ejemplos Curl

### Health

```bash
curl http://localhost:3000/health
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

Reemplaza `AUTHOR_ID`, `SITUATION_ID` y `QUOTE_TYPE_ID` por ids reales obtenidos desde los endpoints de catalogo.

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
- El body publico no acepta `isActive`.
- El `PUT` no opera sobre frases inactivas.

### Borrado Logico

```bash
curl -X DELETE http://localhost:3000/api/quotes/QUOTE_ID
```

El documento no se borra fisicamente. Se marca:

```json
{ "isActive": false }
```

### Comprobar GET Despues Del DELETE

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

## Validaciones de Sprint 03

Comandos recomendados antes de cerrar cambios:

```bash
npm run typecheck
npm run build
docker compose up -d
npm run seed
npm run dev
```

Validaciones principales:

- `POST /api/quotes` valida campos obligatorios.
- `POST /api/quotes` valida `author`, `situation` y `quoteType` como ObjectId.
- `POST /api/quotes` valida que las referencias existen y estan activas.
- `POST /api/quotes` genera `textNormalized`.
- `POST /api/quotes` responde `201`.
- `PUT /api/quotes/:id` valida id.
- `PUT /api/quotes/:id` actualiza parcialmente.
- `PUT /api/quotes/:id` recalcula `textNormalized` si cambia `text`.
- `PUT /api/quotes/:id` valida `contentRating`, `verificationStatus` y `sourceType`.
- `PUT /api/quotes/:id` no acepta `isActive` desde el body publico.
- `PUT /api/quotes/:id` no opera sobre recursos inactivos.
- `DELETE /api/quotes/:id` realiza borrado logico.
- `GET /api/quotes/:id` devuelve `404` despues del DELETE logico.
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
- `npm run copy:assets` - copia vistas y assets publicos.

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

## Tipos de Dominio

El proyecto usa tipos cerrados mediante constantes `as const`:

- `UserRole`
- `AgeGroup`
- `AuthorType`
- `SourceType`
- `ContentRating`
- `VerificationStatus`
- `QuoteTypeSlug`

Slugs tecnicos oficiales de `QuoteType`:

- `stoic`
- `philosophical`
- `motivational`
- `funny`
- `realistic`
- `sarcastic`
- `wise_advice`
- `excuse`

Los slugs se mantienen en ingles para estabilidad tecnica. Los nombres visibles pueden estar en castellano.

## Estructura del Proyecto

```text
QuoteMatic/
├── docs/
│   ├── bug-mongoose-missing-schema-populate.md
│   └── sprints/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── api/
│   │   │   ├── catalogApi.controller.ts
│   │   │   └── quoteApi.controller.ts
│   │   ├── health.controller.ts
│   │   └── home.controller.ts
│   ├── models/
│   ├── public/
│   ├── routes/
│   │   ├── api/
│   │   │   ├── catalogApi.routes.ts
│   │   │   └── quoteApi.routes.ts
│   │   ├── health.routes.ts
│   │   └── index.routes.ts
│   ├── seeds/
│   │   └── seed.ts
│   ├── types/
│   │   └── domain.types.ts
│   ├── views/
│   │   └── index.ejs
│   ├── app.ts
│   └── server.ts
├── .env.example
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

## Documentacion del Sprint

- `docs/sprints/SPRINT_03_API_REST_REPORT.md`
- `docs/sprints/SPRINT_03_QA_CHECKLIST.md`
- `docs/sprints/SPRINT_03_NEXT_STEPS.md`
- `docs/bug-mongoose-missing-schema-populate.md`

## Flujo Git

- Rama de trabajo del Sprint 03: `feat/api-rest-quotes`.
- Rama destino: `dev`.
- `main` queda como rama estable.
- El flujo recomendado es trabajar por ramas `feat/*`, validar localmente y abrir PR hacia `dev`.

## Roadmap

- Sprint 01: setup tecnico base. Completado.
- Sprint 02: modelos de dominio y seed inicial. Completado.
- Sprint 03: API REST publica de consulta y CRUD basico de `Quote`. Completado.
- Sprint 04: autenticacion, sesiones, roles, age gate y favoritos funcionales.
- Sprint 05: vistas minimas, favoritos y polish.

## Fuera de Alcance Actual

QuoteMatic todavia no implementa:

- Auth.
- Register/login.
- Sesiones.
- Roles funcionales.
- Age gate.
- Favoritos funcionales.
- Dashboard.
- Paginacion.
- Busqueda avanzada.
- APIs externas.
