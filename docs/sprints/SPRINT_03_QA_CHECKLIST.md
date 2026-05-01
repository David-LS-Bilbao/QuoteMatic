# Sprint 03 - QA Checklist

Fecha: 2026-05-01  
Proyecto: QuoteMatic  
Rama: `feat/api-rest-quotes`

## Git y Entorno

- [ ] Confirmar rama `feat/api-rest-quotes`.
- [ ] Confirmar que MongoDB esta disponible.
- [ ] Confirmar que `.env` contiene `MONGODB_URI`.
- [ ] Confirmar que no hay cambios fuera del alcance del sprint.

Comando:

```bash
git status --short
```

## TypeScript

- [ ] El proyecto compila sin errores de tipos.
- [ ] Los controladores API importan modelos y tipos correctamente.
- [ ] Los enums de dominio se usan para validar valores permitidos.

Comando:

```bash
npm run typecheck
```

## Build

- [ ] TypeScript compila a `dist`.
- [ ] Las vistas se copian a `dist/views`.
- [ ] Los assets publicos se copian a `dist/public`.

Comando:

```bash
npm run build
```

## MongoDB con Docker

- [ ] Levantar MongoDB local.
- [ ] Confirmar contenedor activo.

Comandos:

```bash
docker compose up -d
docker ps
```

## Seed

- [ ] Ejecutar seed inicial.
- [ ] Confirmar que inserta autores, situaciones, tipos de frase y frases.
- [ ] Confirmar que el seed puede repetirse.

Comando:

```bash
npm run seed
```

### Caso WSL con `tsx`

En algunos entornos WSL, `tsx` puede fallar al crear el socket temporal en una ruta montada de Windows.

Sintoma posible:

```text
Error: listen ENOTSUP: operation not supported on socket
```

Workaround:

```bash
TMPDIR=/tmp npm run seed
```

## Servidor

- [ ] Arrancar servidor en modo desarrollo.
- [ ] Confirmar que escucha en `http://localhost:3000`.

Comando:

```bash
npm run dev
```

## Endpoints Base

- [ ] `GET /health` responde `200`.
- [ ] `GET /api/authors` responde `200`.
- [ ] `GET /api/situations` responde `200`.
- [ ] `GET /api/quote-types` responde `200`.
- [ ] `GET /api/quotes` responde `200`.
- [ ] `GET /api/quotes/random` responde `200`.

Comandos:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/authors
curl http://localhost:3000/api/situations
curl http://localhost:3000/api/quote-types
curl http://localhost:3000/api/quotes
curl http://localhost:3000/api/quotes/random
```

## POST `/api/quotes`

- [ ] Crea una frase nueva.
- [ ] Valida campos obligatorios.
- [ ] Valida `author`, `situation` y `quoteType` como ObjectId.
- [ ] Valida que las referencias existen y estan activas.
- [ ] Genera `textNormalized`.
- [ ] Responde `201`.

Ejemplo:

```bash
curl -X POST http://localhost:3000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Frase de prueba Sprint 03",
    "author": "AUTHOR_ID",
    "situation": "SITUATION_ID",
    "quoteType": "QUOTE_TYPE_ID",
    "language": "es",
    "contentRating": "all",
    "verificationStatus": "pending",
    "sourceType": "original",
    "sourceReference": "QA Sprint 03"
  }'
```

## PUT `/api/quotes/:id`

- [ ] Valida `id`.
- [ ] Actualiza parcialmente.
- [ ] Recalcula `textNormalized` si cambia `text`.
- [ ] Valida `contentRating`.
- [ ] Valida `verificationStatus`.
- [ ] Valida `sourceType`.
- [ ] No acepta `isActive` desde el body publico.
- [ ] No opera sobre recursos inactivos.

Ejemplo:

```bash
curl -X PUT http://localhost:3000/api/quotes/QUOTE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Frase de prueba Sprint 03 actualizada",
    "contentRating": "teen",
    "verificationStatus": "manual_verified",
    "sourceType": "original"
  }'
```

Prueba defensiva:

```bash
curl -X PUT http://localhost:3000/api/quotes/QUOTE_ID \
  -H "Content-Type: application/json" \
  -d '{ "isActive": false }'
```

Resultado esperado: `isActive` no debe cambiar por PUT publico.

## DELETE `/api/quotes/:id`

- [ ] Valida `id`.
- [ ] No borra fisicamente.
- [ ] Marca `isActive: false`.
- [ ] Responde JSON con `success: true`.

Comando:

```bash
curl -X DELETE http://localhost:3000/api/quotes/QUOTE_ID
```

## GET Despues del DELETE

- [ ] `GET /api/quotes/:id` despues del DELETE devuelve `404`.
- [ ] La respuesta contiene `success: false`.
- [ ] La respuesta contiene `message`.

Comando:

```bash
curl http://localhost:3000/api/quotes/QUOTE_ID
```

## Criterios de Aceptacion Final

- [ ] `npm run typecheck` pasa.
- [ ] `npm run build` pasa.
- [ ] `docker compose up -d` levanta MongoDB.
- [ ] `npm run seed` pasa, o `TMPDIR=/tmp npm run seed` pasa en WSL.
- [ ] `npm run dev` arranca servidor.
- [ ] Endpoints de catalogo responden correctamente.
- [ ] Endpoints GET de quotes responden correctamente.
- [ ] POST crea quote valida.
- [ ] PUT actualiza quote activa sin aceptar `isActive`.
- [ ] DELETE realiza borrado logico.
- [ ] GET por id devuelve `404` despues del borrado logico.
