# QuoteMatic

QuoteMatic es una aplicacion backend con minifront en EJS que recomendara frases segun la situacion del usuario, el tipo de frase y el rango de edad declarado.

Estado actual: **Sprint 01 - Setup tecnico base completado**.

En este sprint se preparo la base del proyecto: Node.js, Express, TypeScript, EJS, arquitectura MVC inicial, endpoint de salud, configuracion de MongoDB con Mongoose y Docker Compose para MongoDB local.

## Stack

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- EJS
- Docker Compose para MongoDB local

## Requisitos

- Node.js instalado.
- npm instalado.
- Docker y Docker Compose si se quiere levantar MongoDB local.
- Git para trabajar con ramas y flujo de PR.

## Instalacion

```bash
npm install
```

## Variables de entorno

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

## Ejecutar en desarrollo

```bash
npm run dev
```

Por defecto la aplicacion escucha en:

```text
http://localhost:3000
```

## Build y start

Compilar TypeScript y copiar vistas/assets:

```bash
npm run build
```

Ejecutar la version compilada:

```bash
npm start
```

## Rutas disponibles

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
- `npm run clean` - elimina `dist`.
- `npm run copy:views` - copia `src/views` a `dist/views`.
- `npm run copy:public` - copia `src/public` a `dist/public`.
- `npm run copy:assets` - copia vistas y assets publicos.

## Estructura del proyecto

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
│   ├── public/
│   │   └── styles.css
│   ├── routes/
│   │   ├── health.routes.ts
│   │   └── index.routes.ts
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

- Rama de trabajo del Sprint 01: `feat/typescript-project-setup`.
- Rama destino: `dev`.
- `main` queda como rama estable.
- El flujo recomendado es trabajar por ramas `feat/*`, validar localmente y abrir PR hacia `dev`.

## Roadmap resumido

- Sprint 01: setup tecnico base con Express, TypeScript, EJS, MongoDB config y Docker Compose.
- Sprint 02: tipos de dominio, modelos Mongoose principales y seed inicial.
- Sprint posterior: autenticacion, sesiones, roles, age gate y favoritos.
- Sprints posteriores: CRUD, logica de recomendacion de frases y mejoras de minifront.

## Nota de alcance

Este repositorio todavia no implementa autenticacion, CRUD completo, modelos de dominio completos ni logica de recomendacion de frases. Esas funcionalidades quedan planificadas para siguientes sprints.
