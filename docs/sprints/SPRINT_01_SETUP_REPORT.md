# Sprint 01 - Setup tecnico base

Fecha: 2026-04-29

## Objetivo del sprint

Preparar la base tecnica de QuoteMatic como aplicacion backend Node.js con Express, TypeScript, MongoDB/Mongoose y minifront EJS, dejando una arquitectura MVC pragmatica lista para crecer en los siguientes sprints.

El alcance de este sprint fue fundacional: configurar el proyecto, comprobar que compila, servir una landing inicial, exponer un endpoint de salud y preparar la conexion a MongoDB local mediante Docker Compose.

## Ramas

- Rama usada: `feat/typescript-project-setup`
- Rama destino: `dev`

## Features realizadas

### F01 Setup TypeScript + Express

- Inicializacion de proyecto Node.js.
- Configuracion de TypeScript con salida a `dist`.
- Configuracion de Express en una app separada del arranque del servidor.
- Separacion entre `app.ts` y `server.ts`.
- Estructura MVC inicial con `routes`, `controllers`, `views`, `public` y `config`.

### F02 EJS + landing + health

- Configuracion de EJS como motor de vistas.
- Landing inicial disponible en `GET /`.
- Endpoint de salud disponible en `GET /health`.
- Controladores separados para home y health.

### F03 MongoDB + entorno

- Configuracion de Mongoose en `src/config/database.ts`.
- Carga de variables con `dotenv`.
- Archivo `.env.example` con `PORT` y `MONGODB_URI`.
- Arranque tolerante si `MONGODB_URI` no esta definido.

### F03b Docker MongoDB local

- `docker-compose.yml` con servicio `mongodb`.
- Imagen `mongo:7`.
- Puerto local `27017`.
- Volumen persistente `quotematic_mongodb_data`.

### Build assets

- Compilacion TypeScript a `dist`.
- Copia de `src/views` a `dist/views`.
- Copia de `src/public` a `dist/public`.
- Script `build` preparado para limpiar, compilar y copiar assets.

## Archivos creados/modificados

Principales archivos del sprint:

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `docker-compose.yml`
- `.env.example`
- `.gitignore`
- `src/app.ts`
- `src/server.ts`
- `src/config/database.ts`
- `src/controllers/home.controller.ts`
- `src/controllers/health.controller.ts`
- `src/routes/index.routes.ts`
- `src/routes/health.routes.ts`
- `src/views/index.ejs`
- `src/public/styles.css`
- `README.md`
- `docs/sprints/SPRINT_01_SETUP_REPORT.md`
- `docs/sprints/SPRINT_01_QA_CHECKLIST.md`
- `docs/sprints/SPRINT_01_NEXT_STEPS.md`

No se eliminaron `README_QuoteMatic_TS_MVC.md` ni `docs/QuoteMatic_CONTROL_FEATURES_DIARIO_TS_MVC.md`.

## Estructura resultante del proyecto

```text
QuoteMatic/
├── docs/
│   ├── QuoteMatic_CONTROL_FEATURES_DIARIO_TS_MVC.md
│   └── sprints/
│       ├── SPRINT_01_SETUP_REPORT.md
│       ├── SPRINT_01_QA_CHECKLIST.md
│       └── SPRINT_01_NEXT_STEPS.md
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
├── .gitignore
├── docker-compose.yml
├── package.json
├── package-lock.json
├── README.md
├── README_QuoteMatic_TS_MVC.md
└── tsconfig.json
```

## Decisiones tecnicas tomadas

- Usar TypeScript en modo estricto para detectar errores temprano.
- Mantener `app.ts` como configuracion de Express y `server.ts` como punto de arranque.
- Usar MVC pragmatica sin sobrearquitectura en Sprint 01.
- Usar EJS para el minifront inicial.
- Centralizar la conexion a MongoDB en `src/config/database.ts`.
- Permitir que la app arranque sin MongoDB cuando `MONGODB_URI` no exista, util para primeras pruebas.
- Usar Docker Compose solo para MongoDB local en este sprint.
- Copiar `views` y `public` al build para que `npm start` funcione desde `dist`.

## Comandos usados

```bash
npm install
npm run typecheck
npm run build
npm start
npm run dev
docker compose up -d
docker ps
curl http://localhost:3000/health
git status
git log --oneline
```

## Validaciones realizadas

- TypeScript compila sin errores mediante `npm run typecheck`.
- El build genera `dist` mediante `npm run build`.
- Las vistas EJS y assets publicos se copian a `dist`.
- Express registra `GET /` y `GET /health`.
- La configuracion de MongoDB queda preparada mediante `MONGODB_URI`.
- Docker Compose define MongoDB local en el puerto `27017`.

## Problemas encontrados y soluciones

- `tsconfig` generado inicialmente con JSX/React y `nodenext`.
  - Solucion: se ajusto a una configuracion backend sin React, con `module` y `moduleResolution` en `Node16`.
- `moduleResolution Node` aparece como deprecado en TypeScript 6.
  - Solucion: se migro a `moduleResolution: "Node16"`.
- Imports mal nombrados por diferencia entre `indexRoutes` e `index.routes`.
  - Solucion: se alinearon los imports con los nombres reales de archivo.
- `.env` creado accidentalmente dentro de `src`.
  - Solucion: se retiro de `src` y se dejo `.env.example` en la raiz como referencia versionable.
- `node_modules` subido accidentalmente.
  - Solucion: se limpio del control de versiones y se reforzo `.gitignore`.
- Necesidad de copiar `views/public` al build.
  - Solucion: se agregaron scripts `copy:views`, `copy:public` y `copy:assets`.

## Estado final

Sprint 01 completado como setup tecnico base. El proyecto queda listo para comenzar el modelado de dominio en Sprint 02.

No se implementaron en este sprint:

- Autenticacion.
- CRUD de entidades.
- Modelos de dominio completos.
- Logica de recomendacion de frases.
- Integraciones con APIs externas.

## Commits realizados

Commits disponibles en la rama:

```text
17424d7 chore(db): add mongodb docker compose
b9f4da9 chore(build): copy ejs and public assets
1565d5e feat(config): add mongodb connection setup
01879b9 chore(git): remove docs placeholder gitignore
3dd9b21 chore(git): ignore local generated files
e9cad47 feat(app): add express app with ejs
f1425ef cambios despliegue
01ea593 chore(ts): configure typescript
ce2d43f chore(project): initialize node project
18d4c66 Initial commit
```

## Recomendaciones para Sprint 02

- Definir tipos TypeScript del dominio antes de crear controladores complejos.
- Crear modelos Mongoose principales: `User`, `Author`, `Situation`, `QuoteType` y `Quote`.
- Preparar un seed inicial pequeno para validar relaciones.
- Anadir validacion basica de datos.
- Separar el CRUD completo en otro sprint si el modelado necesita consolidarse primero.
- Mantener la arquitectura simple hasta que aparezcan necesidades reales de servicio o repositorio.
