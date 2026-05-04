# Sprint 07 — QA Checklist

Proyecto: QuoteMatic  
Rama: `feat/swagger-openapi-docs`

## Objetivo QA

Validar que Swagger/OpenAPI queda disponible sin romper la API existente ni cambiar lógica funcional.

## Instalación de Dependencias

- [ ] `swagger-jsdoc` instalado en dependencies.
- [ ] `swagger-ui-express` instalado en dependencies.
- [ ] `@types/swagger-jsdoc` instalado en devDependencies.
- [ ] `@types/swagger-ui-express` instalado en devDependencies.
- [ ] No se añadieron dependencias fuera del alcance del sprint.

Comandos:

```bash
npm install swagger-ui-express swagger-jsdoc
npm install -D @types/swagger-ui-express @types/swagger-jsdoc
```

## TypeScript

- [ ] `src/config/swagger.ts` compila.
- [ ] `src/routes/docs.routes.ts` compila.
- [ ] `src/app.ts` importa y monta docs sin errores.

Comando:

```bash
npm run typecheck
```

## Build

- [ ] TypeScript compila a `dist`.
- [ ] Assets y vistas se copian correctamente.

Comando:

```bash
npm run build
```

## Swagger UI

- [ ] `GET /api-docs` abre Swagger UI.
- [ ] Se ve el título `QuoteMatic API`.
- [ ] Aparecen grupos principales: Base, Auth, Catalogs, Quotes, Favorites.
- [ ] Los endpoints protegidos indican cookie/session.

URL:

```text
http://localhost:3000/api-docs
```

## OpenAPI JSON

- [ ] `GET /api-docs.json` devuelve JSON.
- [ ] `openapi` aparece como `3.0.3`.
- [ ] Incluye paths principales.
- [ ] Incluye schemas mínimos.

URL:

```text
http://localhost:3000/api-docs.json
```

## Endpoints Existentes

- [ ] `GET /health` sigue funcionando.
- [ ] `GET /api/quotes` sigue funcionando.
- [ ] `GET /api/authors` sigue funcionando.

Comandos:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/quotes
curl http://localhost:3000/api/authors
```

## No Rotura de API Previa

- [ ] No se tocaron controladores.
- [ ] No se tocaron modelos.
- [ ] No se cambiaron reglas de negocio.
- [ ] No se cambió auth.
- [ ] No se cambió favoritos.
- [ ] No se cambió protección admin.
- [ ] El handler 404 `/api/*` sigue al final de las rutas API.

## Documentación README

- [ ] README incluye sección `Documentación Swagger / OpenAPI`.
- [ ] README indica `http://localhost:3000/api-docs`.
- [ ] README indica `http://localhost:3000/api-docs.json`.
- [ ] README explica que endpoints protegidos requieren sesión.
- [ ] README explica que POST/PUT/DELETE de quotes requieren admin.

## Resultado Esperado

Sprint 07 queda completo cuando:

- `npm run typecheck` pasa.
- `npm run build` pasa.
- `/api-docs` muestra Swagger UI.
- `/api-docs.json` devuelve la especificación.
- Endpoints existentes siguen respondiendo.
