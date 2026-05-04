# Sprint 06 — Admin Protection Report

Proyecto: QuoteMatic  
Rama: `feat/admin-protected-quotes`  
Resultado final: `Sprint 06 completado correctamente`

## Objetivo del Sprint

Cerrar el MVP backend conectando la autenticación real con autorización por rol admin.

Hasta Sprint 05 ya existían API REST, auth, sesiones y favoritos funcionales. En Sprint 06 el objetivo fue endurecer el CRUD de `Quote`: las lecturas siguen siendo públicas, pero la escritura de frases queda reservada a usuarios autenticados con rol `admin`.

## Alcance Implementado

- Protección admin para crear frases.
- Protección admin para actualizar frases.
- Protección admin para borrar frases lógicamente.
- Lecturas públicas de frases y catálogos mantenidas.
- Favoritos protegidos por sesión mantenidos.
- Respuesta JSON limpia para rutas `/api/*` inexistentes.

## Rutas Públicas Mantenidas

Estas rutas no requieren login:

- `GET /api/quotes`
- `GET /api/quotes/:id`
- `GET /api/quotes/random`
- `GET /api/authors`
- `GET /api/situations`
- `GET /api/quote-types`

## Rutas Protegidas por Sesión

Estas rutas requieren usuario autenticado:

- `GET /api/favorites/me`
- `POST /api/favorites/:quoteId`
- `DELETE /api/favorites/:quoteId`
- `GET /auth/me`
- `GET /auth/admin-check`

Sin sesión, la API responde `401 Unauthorized`.

## Rutas Protegidas por Admin

Estas rutas requieren sesión activa y rol `admin`:

- `POST /api/quotes`
- `PUT /api/quotes/:id`
- `DELETE /api/quotes/:id`

El orden de middlewares esperado es:

```text
isAuthenticated -> isAdmin -> controller
```

Resultados esperados:

- Sin login: `401 Unauthorized`.
- Usuario normal: `403 Forbidden`.
- Usuario admin: operación permitida.

## Mejora 404 JSON para `/api/*`

Sprint 06 añade un handler final para rutas API inexistentes:

```json
{
  "success": false,
  "message": "API route not found"
}
```

Este handler está después de montar las rutas reales:

- `/api/quotes`
- `/api`
- `/api/favorites`

Así no rompe endpoints existentes ni vistas EJS.

## Decisión de No Crear Admin en Seed

No se crea un usuario admin automáticamente en el seed.

Motivos:

- Evitar credenciales por defecto en el repositorio.
- No documentar passwords reales.
- Mantener el seed centrado en datos de dominio: autores, situaciones, tipos de frase y frases.
- Obligar a crear/promocionar admin de forma consciente en entorno local.

## Admin Manual con MongoDB Compass

Flujo recomendado para pruebas locales:

1. Crear un usuario normal desde `/auth/register`.
2. Abrir MongoDB Compass.
3. Buscar el documento del usuario en la colección `users`.
4. Cambiar:

```json
{ "role": "user" }
```

por:

```json
{ "role": "admin" }
```

5. Guardar el documento.
6. Cerrar sesión.
7. Volver a iniciar sesión.

Importante: hay que cerrar sesión y volver a iniciar sesión porque el rol se guarda en la sesión (`req.session.role`) durante el login.

## Tabla QA

| Caso admin | Estado esperado | Estado obtenido | Resultado |
|---|---:|---:|---:|
| Login admin | 302 | 302 | PASS |
| `GET /auth/me` | 200 con `role: admin` | 200 | PASS |
| `POST /api/quotes` como admin | 201 | 201 | PASS |
| `PUT /api/quotes/:id` como admin | 200 | 200 | PASS |
| `DELETE /api/quotes/:id` como admin | 200 | 200 | PASS |
| `GET /api/quotes/:id` tras DELETE | 404 | 404 | PASS |

## Evidencia Quote QA

Quote de QA creada y borrada lógicamente:

```text
69f63666313334809b5328ca
```

El `DELETE` devolvió `isActive: false`, por lo que la frase ya no queda expuesta por la API pública.

## Validaciones Técnicas Ejecutadas

| Validación | Resultado |
|---|---:|
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
| `docker compose up -d` | PASS |
| `npm run seed` | PASS con posible workaround WSL |
| `npm run dev` | PASS |
| `GET /api/quotes` | 200 PASS |
| `GET /api/quotes/random` | 200 PASS |
| `GET /api/authors` | 200 PASS |
| `GET /api/situations` | 200 PASS |
| `GET /api/quote-types` | 200 PASS |
| `POST /api/quotes` sin login | 401 PASS |
| `POST /api/quotes` como usuario normal | 403 PASS |
| `GET /api/favorites/me` sin login | 401 PASS |
| `GET /api/favorites/me` con login | 200 PASS |
| `GET /api/ruta-inexistente` | 404 JSON PASS |

## Resultado Final

Sprint 06 completado correctamente.

El MVP backend queda con lecturas públicas, favoritos protegidos por sesión y escritura de frases protegida por rol admin.
