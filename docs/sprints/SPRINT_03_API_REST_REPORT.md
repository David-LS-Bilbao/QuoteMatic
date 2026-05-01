# Sprint 03 - API REST Quotes

Fecha: 2026-05-01  
Proyecto: QuoteMatic  
Rama usada: `feat/api-rest-quotes`  
Rama destino: `dev`

## Objetivo del Sprint

Implementar una API REST simple para consultar catalogos y realizar operaciones basicas sobre frases (`Quote`) usando Express, TypeScript, MongoDB y Mongoose.

El objetivo principal del sprint fue que QuoteMatic pudiera demostrarse como backend funcional: levantar MongoDB, ejecutar seed, arrancar servidor y probar endpoints REST reales con datos relacionados.

## Endpoints Implementados

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

## Arquitectura Usada

Se mantiene una arquitectura MVC simple:

```text
src/
├── app.ts
├── controllers/
│   └── api/
│       ├── catalogApi.controller.ts
│       └── quoteApi.controller.ts
├── models/
│   ├── Author.ts
│   ├── Quote.ts
│   ├── QuoteType.ts
│   └── Situation.ts
├── routes/
│   └── api/
│       ├── catalogApi.routes.ts
│       └── quoteApi.routes.ts
└── types/
    └── domain.types.ts
```

`app.ts` monta:

- `/api/quotes` para frases.
- `/api` para catalogos auxiliares.
- `/health` para comprobar estado basico.

## Decisiones Tecnicas

- Mantener controladores directos y legibles, sin servicios adicionales por ahora.
- Usar `populate` en respuestas de `Quote` para devolver informacion util de `author`, `situation` y `quoteType`.
- Mantener `GET /api/quotes/random` antes de `GET /api/quotes/:id` para evitar que `random` se interprete como parametro dinamico.
- Responder errores de API en JSON con `success: false` y `message`.
- Validar `ObjectId` antes de consultar MongoDB para evitar errores de casting.
- Validar enums con las constantes de `domain.types.ts`.
- Mantener borrado logico mediante `isActive: false`.
- No introducir autenticacion ni roles en Sprint 03.

## Validaciones Aplicadas

### POST `/api/quotes`

Valida:

- Campos obligatorios: `text`, `author`, `situation`, `quoteType`, `language`, `contentRating`, `verificationStatus`.
- `author`, `situation` y `quoteType` como ObjectId validos.
- Existencia activa de `author`, `situation` y `quoteType`.
- `contentRating` dentro de valores permitidos.
- `verificationStatus` dentro de valores permitidos.
- `sourceType` dentro de valores permitidos.

Tambien genera:

- `textNormalized` a partir de `text`.
- `isActive: true`.

Respuesta esperada:

- `201 Created`.

### PUT `/api/quotes/:id`

Valida:

- `id` como ObjectId valido.
- Que la frase exista y este activa.
- Actualizacion parcial.
- `author`, `situation` y `quoteType` si vienen en el body.
- `contentRating`, `verificationStatus` y `sourceType`.

Comportamiento relevante:

- Recalcula `textNormalized` si cambia `text`.
- No acepta `isActive` desde el body publico.
- No opera sobre frases inactivas.

### DELETE `/api/quotes/:id`

Valida:

- `id` como ObjectId valido.

Comportamiento:

- No borra fisicamente el documento.
- Marca `isActive: false`.
- Despues del DELETE, `GET /api/quotes/:id` devuelve `404`.

## Borrado Logico

El Sprint 03 usa borrado logico para `Quote`.

Motivos:

- Evita perdida accidental de datos.
- Permite auditoria futura.
- Mantiene historico para posibles paneles admin.
- Hace que los endpoints publicos trabajen solo con frases activas.

Implementacion:

- `DELETE /api/quotes/:id` actualiza `isActive` a `false`.
- `GET /api/quotes` filtra por `isActive: true`.
- `GET /api/quotes/:id` filtra por `isActive: true`.
- `GET /api/quotes/random` filtra por `isActive: true`.
- `PUT /api/quotes/:id` solo opera sobre documentos activos.

## Problema Detectado con Mongoose Populate

Durante el sprint se detecto un problema con `populate`:

```text
MissingSchemaError: Schema hasn't been registered for model "Author".
```

La causa fue que Mongoose necesitaba tener registrados los modelos usados en las referencias de `Quote`. En TypeScript, importar un modelo solo por efecto secundario puede no ser suficiente, porque el compilador puede eliminar imports si no se usan como valores.

La solucion aplicada fue referenciar los modelos directamente en la configuracion de `populate`:

```ts
const quotePopulate = [
  { path: "author", model: Author, select: "name authorType sourceWork isActive" },
  { path: "situation", model: Situation, select: "name slug description isActive" },
  { path: "quoteType", model: QuoteType, select: "name slug description contentRating isActive" },
];
```

Esto fuerza el registro correcto de modelos y evita depender de imports eliminables.

## Resultado Final

Sprint 03 queda completado con:

- API REST publica de frases.
- API REST publica de catalogos.
- CRUD basico de `Quote`.
- Validaciones basicas de ids, enums y referencias.
- Borrado logico funcional.
- Respuestas JSON consistentes.
- Seed compatible para pruebas locales.
- Documentacion de QA y proximos pasos.

Quedan fuera de Sprint 03: auth, sesiones, roles, age gate, favoritos funcionales, dashboard, paginacion, busqueda avanzada y APIs externas.
