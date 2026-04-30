# QuoteMatic

QuoteMatic es una aplicacion backend con minifront en EJS que recomendara frases segun la situacion del usuario, el tipo de frase y el rango de edad declarado.

Estado actual: **Sprint 02 implementado en la rama `feat/domain-models-and-seed`**.

Sprint 02 anade la primera capa de dominio del proyecto: tipos TypeScript, modelos Mongoose principales, relaciones entre colecciones y un seed inicial pequeno y repetible.

## Enfoque Actual del MVP

QuoteMatic se mantiene como un proyecto backend pequeno y centrado en demostrar dominio practico de MongoDB, Mongoose, seed y endpoints REST.

Prioridad tecnica:

```text
MongoDB + Mongoose + Seed + API REST simple + CRUD minimo
```

Las vistas EJS seran minimas y funcionaran solo como apoyo visual para demo. El objetivo principal es que el profesor pueda clonar el proyecto, levantar MongoDB, ejecutar el seed y probar endpoints REST sobre datos reales.

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

## Levantar MongoDB con Docker

```bash
docker compose up -d
docker ps
```

El servicio usa MongoDB en `localhost:27017` y persiste datos en un volumen de Docker.

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

Autores iniciales:

- Marco Aurelio
- Seneca
- Yoda
- Homer Simpson

Situaciones iniciales:

- Trabajo
- Estudios
- Estres
- Decisiones dificiles

Tipos de frase iniciales:

- Estoica
- Filosofica
- Motivacional
- Divertida
- Realista
- Sarcastica
- Consejo sabio
- Excusa

## Rutas Disponibles

- `GET /` - landing inicial renderizada con EJS.
- `GET /health` - endpoint de salud del servidor.

Ejemplo:

```bash
curl http://localhost:3000/health
```

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

## Modelos Creados

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

Sprint 02 incorpora tipos cerrados mediante constantes `as const`:

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
│   └── sprints/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── health.controller.ts
│   │   └── home.controller.ts
│   ├── models/
│   │   ├── Author.ts
│   │   ├── Favorite.ts
│   │   ├── Quote.ts
│   │   ├── QuoteType.ts
│   │   ├── Situation.ts
│   │   └── User.ts
│   ├── public/
│   │   └── styles.css
│   ├── routes/
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

## Flujo Git

- Rama de trabajo del Sprint 02: `feat/domain-models-and-seed`.
- Rama destino: `dev`.
- `main` queda como rama estable.
- El flujo recomendado es trabajar por ramas `feat/*`, validar localmente y abrir PR hacia `dev`.

## Roadmap

- Sprint 01: setup tecnico base. Completado.
- Sprint 02: modelos de dominio y seed inicial. Completado.
- Sprint 03: API REST publica de consulta y CRUD basico de `Quote`.
- Sprint 04: autenticacion, sesiones, roles y age gate.
- Sprint 05: vistas minimas, favoritos y polish.

## Nota de Alcance

QuoteMatic todavia no implementa:

- API REST completa de frases.
- Login.
- Register.
- Logout.
- CRUD admin.
- Favoritos funcionales.
- APIs externas.
- Dashboard avanzado.
- Recomendacion completa de frases.
- Paginacion o filtros avanzados.

Estas funcionalidades quedan planificadas para los siguientes sprints.
