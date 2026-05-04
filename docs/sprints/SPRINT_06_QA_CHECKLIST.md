# Sprint 06 — QA Checklist

Rama: `feat/admin-protected-quotes`  
Resultado final: `APTO PARA DOCUMENTAR`

## Objetivo QA

Validar que Sprint 06 protege correctamente la escritura de `Quote` con sesión y rol `admin`, sin romper las rutas públicas, favoritos ni el handler JSON de rutas API inexistentes.

## Checklist Git

- [x] Rama esperada: `feat/admin-protected-quotes`.
- [x] `git status --short` revisado.
- [x] Últimos commits revisados.
- [x] No se hizo commit durante QA.
- [x] No se hizo push durante QA.

Comandos:

```bash
git status --short
git branch --show-current
git log --oneline --decorate -n 5
```

## Checklist Revisión Estática

| Archivo | Revisión | Resultado |
|---|---|---:|
| `src/routes/api/quoteApi.routes.ts` | GET públicos y POST/PUT/DELETE protegidos con `isAuthenticated` antes de `isAdmin` | PASS |
| `src/middlewares/auth.middleware.ts` | Sin sesión devuelve `401` JSON | PASS |
| `src/middlewares/role.middleware.ts` | Usuario no admin devuelve `403` JSON | PASS |
| `src/routes/api/favoriteApi.routes.ts` | Favoritos siguen protegidos con `isAuthenticated` | PASS |
| `src/app.ts` | Handler 404 `/api` está al final de rutas reales | PASS |

## Checklist Comandos

| Comando | Resultado | Observaciones |
|---|---:|---|
| `npm run typecheck` | PASS | TypeScript sin errores. |
| `npm run build` | PASS | Build correcta. |
| `docker compose up -d` | PASS | MongoDB local levantado. |
| `npm run seed` | PASS | En WSL puede requerir workaround. |
| `npm run dev` | PASS | Servidor local disponible. |

Workaround WSL si `tsx` falla con socket temporal:

```bash
TMPDIR=/tmp TEMP=/tmp TMP=/tmp npm run seed
```

## Checklist Rutas Públicas

- [x] `GET /api/quotes` devuelve `200`.
- [x] `GET /api/quotes/random` devuelve `200`.
- [x] `GET /api/authors` devuelve `200`.
- [x] `GET /api/situations` devuelve `200`.
- [x] `GET /api/quote-types` devuelve `200`.

## Checklist Rutas Sin Login

- [x] `POST /api/quotes` sin login devuelve `401`.
- [x] `GET /api/favorites/me` sin login devuelve `401`.
- [x] La respuesta usa JSON con mensaje claro.

## Checklist Usuario Normal

- [x] Registro de usuario normal probado.
- [x] Login de usuario normal probado.
- [x] `GET /auth/me` devuelve `role: user`.
- [x] `POST /api/quotes` con usuario normal devuelve `403`.

## Checklist Usuario Admin

- [x] Login admin devuelve `302`.
- [x] `GET /auth/me` devuelve `200` con `role: admin`.
- [x] `POST /api/quotes` como admin devuelve `201`.
- [x] `PUT /api/quotes/:id` como admin devuelve `200`.
- [x] `DELETE /api/quotes/:id` como admin devuelve `200`.
- [x] `GET /api/quotes/:id` tras DELETE lógico devuelve `404`.

## Checklist 404 API

- [x] `GET /api/ruta-inexistente` devuelve `404`.
- [x] Respuesta esperada:

```json
{
  "success": false,
  "message": "API route not found"
}
```

## Evidencia Quote QA

Quote de QA creada y borrada lógicamente:

```text
69f63666313334809b5328ca
```

El `DELETE` devolvió `isActive: false`.

## Errores Típicos a Vigilar

- Poner `isAdmin` antes de `isAuthenticated`.
- Proteger por error los endpoints GET públicos de quotes.
- Montar el handler 404 `/api` antes de rutas reales.
- Cambiar un usuario a admin en MongoDB Compass y no volver a iniciar sesión.
- Documentar credenciales reales.
- Crear admins por defecto en el seed.
- Romper favoritos al montar nuevas rutas API.

## Resultado Final

`APTO PARA DOCUMENTAR`
