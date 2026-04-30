# Sprint 02 - Domain Models + Seed Inicial

Fecha: 2026-04-30  
Proyecto: QuoteMatic  
Rama usada: `feat/domain-models-and-seed`  
Rama destino: `dev`

## Objetivo del Sprint

Implementar la primera capa de dominio de QuoteMatic con tipos TypeScript cerrados, modelos principales de Mongoose, relaciones entre colecciones y un seed inicial pequeño, repetible y orientado a pruebas locales.

El sprint prepara la base de datos para futuros flujos de autenticacion, filtrado por edad, recomendacion de frases, favoritos y administracion de contenido.

## Features Realizadas

### F04 Domain Types

Se creo `src/types/domain.types.ts` con constantes `as const` y tipos derivados para limitar valores de dominio sin introducir complejidad innecesaria.

Tipos creados:

- `UserRole`
- `AgeGroup`
- `AuthorType`
- `SourceType`
- `ContentRating`
- `VerificationStatus`
- `QuoteTypeSlug`

### F05 Core Mongoose Models

Se crearon los modelos principales de la aplicacion:

- `User`
- `Author`
- `Situation`
- `QuoteType`
- `Quote`
- `Favorite`

Todos los modelos usan `timestamps: true` y campos `isActive` cuando aplica para permitir desactivacion logica sin borrar datos.

### F06 Initial Seed Data

Se creo `src/seeds/seed.ts` con datos iniciales de dominio:

- 4 autores
- 4 situaciones
- 8 tipos de frase
- 12 frases

El seed limpia las colecciones antes de insertar datos, por lo que puede ejecutarse varias veces sobre la misma base local.

### F07 Seed Validation + Docs

El seed valida las referencias internas antes de insertar frases:

- Busca autores por nombre.
- Busca situaciones por slug.
- Busca tipos de frase por slug.
- Falla si alguna referencia no existe.

Tambien se actualiza la documentacion del proyecto para reflejar el estado real del Sprint 02.

## Archivos Creados o Modificados

Archivos de dominio:

- `src/types/domain.types.ts`
- `src/models/User.ts`
- `src/models/Author.ts`
- `src/models/Situation.ts`
- `src/models/QuoteType.ts`
- `src/models/Quote.ts`
- `src/models/Favorite.ts`
- `src/seeds/seed.ts`

Archivos de configuracion/documentacion:

- `package.json`
- `README.md`
- `docs/sprints/SPRINT_02_DOMAIN_MODELS_REPORT.md`
- `docs/sprints/SPRINT_02_QA_CHECKLIST.md`
- `docs/sprints/SPRINT_02_NEXT_STEPS.md`

## Modelos Creados

### User

Representa usuarios futuros de la aplicacion. Incluye nombre, email, hash de password, rol, grupo de edad y estado activo.

Campos clave:

- `email` unico e indexado.
- `role` restringido a `user` o `admin`.
- `ageGroup` restringido a grupos permitidos.
- `passwordHash` preparado para Sprint 03.

### Author

Representa autores reales, historicos, ficticios o desconocidos.

Campos clave:

- `normalizedName` unico e indexado.
- `authorType`
- `sourceType`
- `sourceWork`
- `verificationStatus`
- `isVerified`

### Situation

Representa contextos de uso para recomendar frases.

Campos clave:

- `slug` unico e indexado.
- `description`
- `isActive`

### QuoteType

Representa categorias tecnicas de frase.

Slugs oficiales:

- `stoic`
- `philosophical`
- `motivational`
- `funny`
- `realistic`
- `sarcastic`
- `wise_advice`
- `excuse`

Los nombres visibles pueden estar en castellano, pero los slugs se mantienen en ingles para estabilidad tecnica.

### Quote

Representa una frase concreta y sus relaciones principales.

Campos clave:

- `text`
- `textNormalized`
- `author`
- `situation`
- `quoteType`
- `language`
- `contentRating`
- `sourceType`
- `sourceReference`
- `verificationStatus`

Incluye indice compuesto unico por `textNormalized` y `author`.

### Favorite

Representa la relacion futura entre un usuario y una frase favorita.

Campos clave:

- `user`
- `quote`
- `isActive`

Incluye indice compuesto unico por `user` y `quote`.

## Relaciones Entre Colecciones

- `Quote.author` referencia a `Author`.
- `Quote.situation` referencia a `Situation`.
- `Quote.quoteType` referencia a `QuoteType`.
- `Favorite.user` referencia a `User`.
- `Favorite.quote` referencia a `Quote`.

Estas relaciones permiten construir consultas con `populate` en sprints posteriores sin duplicar informacion de dominio.

## Decisiones Tecnicas

- TypeScript pragmatico con Mongoose, evitando sobreingenieria en esta fase.
- Constantes `as const` para mantener enums de dominio reutilizables.
- No se incluye `AuthorType` `system`.
- `QuoteType` usa slugs tecnicos oficiales en ingles.
- Los nombres visibles de `QuoteType`, `Situation` y autores pueden estar en castellano.
- `SourceType` representa origen o fuente, no tipo de frase.
- `ContentRating` existe en `QuoteType` y en `Quote`.
- Si una frase concreta tiene una clasificacion mas restrictiva, prevalece `Quote.contentRating`.
- `isActive` permite desactivacion logica.
- `timestamps: true` queda activado en modelos principales.
- El seed no crea usuarios todavia.
- Auth, sesiones, roles funcionales, favoritos funcionales, CRUD admin y APIs externas quedan fuera del Sprint 02.

## Estructura Final Relevante

```text
src/
├── models/
│   ├── Author.ts
│   ├── Favorite.ts
│   ├── Quote.ts
│   ├── QuoteType.ts
│   ├── Situation.ts
│   └── User.ts
├── seeds/
│   └── seed.ts
└── types/
    └── domain.types.ts
```

## Comandos Usados

```bash
git status
git log --oneline --decorate -n 12
npm run typecheck
npm run build
docker compose up -d
npm run seed
```

## Validaciones Realizadas

- Revision de estado Git.
- Revision de scripts npm.
- Revision de tipos de dominio.
- Revision de modelos Mongoose.
- Revision de relaciones por `ObjectId` y `ref`.
- Revision del seed inicial.
- Validacion TypeScript con `npm run typecheck`.
- Build del proyecto con `npm run build`.
- Ejecucion del seed con `npm run seed`.

## Problemas Encontrados y Soluciones Aplicadas

- Necesidad de mantener slugs tecnicos estables: se definieron slugs oficiales en ingles para `QuoteTypeSlug`.
- Necesidad de datos iniciales repetibles: el seed limpia colecciones antes de insertar.
- Necesidad de evitar referencias rotas: el seed usa mapas por nombre/slug y falla si una referencia no existe.
- Necesidad de separar fuente y categoria: `SourceType` se usa para origen de la frase, mientras `QuoteType` modela la intencion o tono de la frase.
- Necesidad de control por edad flexible: `ContentRating` se guarda tanto a nivel de tipo como de frase concreta.

## Commits Realizados en la Rama

Commits detectados con `git log --oneline --decorate -n 12`:

```text
46a49f8 feat(seed): add initial seed data
299b990 feat(models): add user model
74d85c9 feat(models): add quote and favorite models
60e113a feat(models): add base mongoose models
36048ea feat(types): add quote type slugs
39b18d7 feat(types): add domain types
f28707a rama creada
```

## Estado Final

Sprint 02 queda implementado en la rama `feat/domain-models-and-seed`.

Estado funcional:

- Tipos de dominio creados.
- Modelos principales creados.
- Relaciones base definidas.
- Seed inicial disponible.
- Script `npm run seed` disponible.
- Login, register, CRUD admin, favoritos funcionales y APIs externas no implementados todavia.

## Recomendaciones Para Sprint 03

- Implementar autenticacion con register, login y logout.
- Usar `bcrypt` para generar `passwordHash`.
- Incorporar `express-session` y `connect-mongo`.
- Crear middleware `isAuthenticated`.
- Crear middleware `isAdmin`.
- Implementar age gate antes de permitir registro o acceso a contenido.
- Bloquear menores de 14.
- Guardar `ageGroup` en `User`.
- Mantener CRUD admin y favoritos funcionales fuera del Sprint 03 para controlar el alcance.
