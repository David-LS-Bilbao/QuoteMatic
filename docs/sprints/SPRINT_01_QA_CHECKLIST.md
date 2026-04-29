# Sprint 01 - QA Checklist

Fecha: 2026-04-29

## Git y ramas

- [ ] La rama actual es `feat/typescript-project-setup`.
- [ ] La rama destino prevista es `dev`.
- [ ] `git status` no muestra cambios no esperados antes de abrir PR.
- [ ] No se versiona `.env`.
- [ ] No se versiona `node_modules`.
- [ ] No se versiona `dist`.

Comandos:

```bash
git branch --show-current
git status
```

## Instalacion npm

- [ ] Las dependencias se instalan correctamente.
- [ ] Existe `package-lock.json`.
- [ ] No aparecen errores criticos de instalacion.

Comando:

```bash
npm install
```

## TypeScript

- [ ] `tsconfig.json` apunta a `src` como `rootDir`.
- [ ] La salida compilada va a `dist`.
- [ ] El proyecto usa `strict: true`.
- [ ] El typecheck termina sin errores.

Comando:

```bash
npm run typecheck
```

## Express

- [ ] `src/app.ts` configura Express.
- [ ] `src/server.ts` arranca el servidor.
- [ ] La app separa rutas y controladores.
- [ ] El servidor usa `PORT` desde variables de entorno o `3000` por defecto.

Comandos:

```bash
npm run dev
npm start
```

## EJS

- [ ] EJS esta configurado como motor de vistas.
- [ ] `src/views/index.ejs` existe.
- [ ] `GET /` renderiza la landing inicial.
- [ ] La vista sigue siendo simple y coherente con el alcance del sprint.

Verificacion manual:

```bash
curl http://localhost:3000/
```

## Public assets

- [ ] `src/public/styles.css` existe.
- [ ] Express sirve assets estaticos desde `public`.
- [ ] El build copia `src/public` a `dist/public`.

Comando:

```bash
npm run build
```

## Health endpoint

- [ ] Existe ruta `GET /health`.
- [ ] La ruta esta separada en `health.routes.ts`.
- [ ] La logica esta separada en `health.controller.ts`.
- [ ] La respuesta permite comprobar que el servidor esta vivo.

Comando:

```bash
curl http://localhost:3000/health
```

## MongoDB config

- [ ] `src/config/database.ts` centraliza la conexion.
- [ ] La conexion usa `MONGODB_URI`.
- [ ] Si `MONGODB_URI` no esta definida, la app no rompe durante pruebas basicas.
- [ ] Si MongoDB falla al conectar con URI definida, el error queda visible.

## Docker MongoDB

- [ ] `docker-compose.yml` define un servicio `mongodb`.
- [ ] La imagen usada es `mongo:7`.
- [ ] El puerto `27017` queda expuesto localmente.
- [ ] Existe volumen persistente para datos locales.

Comandos:

```bash
docker compose up -d
docker ps
```

## Variables de entorno

- [ ] Existe `.env.example`.
- [ ] `.env.example` incluye `PORT`.
- [ ] `.env.example` incluye `MONGODB_URI`.
- [ ] `.env` local no se sube al repositorio.

Ejemplo:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/quotematic
```

## Build/start

- [ ] `npm run build` limpia `dist`, compila TypeScript y copia assets.
- [ ] `dist/views` existe despues del build.
- [ ] `dist/public` existe despues del build.
- [ ] `npm start` ejecuta `dist/server.js`.

Comandos:

```bash
npm run build
npm start
```

## Seguridad basica

- [ ] No hay secretos reales en archivos versionados.
- [ ] `.env.example` solo contiene valores locales de ejemplo.
- [ ] No se sube `node_modules`.
- [ ] No se sube `dist`.
- [ ] No se implementa auth falsa o incompleta en Sprint 01.

## Criterio de aceptacion final

- [ ] `npm install` funciona.
- [ ] `npm run typecheck` pasa.
- [ ] `npm run build` pasa.
- [ ] `npm run dev` levanta la app en desarrollo.
- [ ] `npm start` levanta la app compilada.
- [ ] `docker compose up -d` levanta MongoDB local.
- [ ] `docker ps` muestra el contenedor de MongoDB.
- [ ] `GET /` responde con la landing inicial.
- [ ] `GET /health` responde correctamente.
- [ ] El sprint queda documentado y sin funcionalidades fuera de alcance.
