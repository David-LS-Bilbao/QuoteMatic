# Sprint 07 — Next Steps

Proyecto: QuoteMatic  
Rama actual: `feat/swagger-openapi-docs`

## Estado Actual

Sprint 07 añade documentación Swagger/OpenAPI para la API REST existente.

Queda disponible:

- `GET /api-docs`
- `GET /api-docs.json`

## Siguiente Sprint Propuesto

Sprint 08 — Interfaz EJS responsive funcional.

El siguiente paso recomendado es mejorar la experiencia visual mínima del proyecto sin cambiar de stack ni introducir React todavía.

## Qué Se Recomienda Para Sprint 08

- Mejorar layout EJS.
- Crear navegación básica.
- Añadir vista de quotes.
- Añadir vista de favoritos.
- Mostrar estado de sesión.
- Mostrar acciones disponibles según rol.
- Mantener CSS simple y responsive.

## Qué NO Hacer Todavía

- No hacer React.
- No crear SPA.
- No añadir dashboard complejo.
- No meter APIs externas.
- No hacer importación automática de datos.
- No cambiar la arquitectura backend.

## Validación Antes de Cerrar Sprint 07

```bash
npm run typecheck
npm run build
npm run dev
```

Probar:

```text
http://localhost:3000/api-docs
http://localhost:3000/api-docs.json
```

Y comprobar:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/quotes
curl http://localhost:3000/api/authors
```

## Commits Sugeridos

```text
feat(docs): add swagger openapi setup
docs(api): document swagger usage
docs(sprint): add sprint 07 swagger report
```

## Estado Recomendado Antes de PR

- Working tree revisado.
- Sin credenciales reales.
- `npm run typecheck` en PASS.
- `npm run build` en PASS.
- Swagger UI accesible.
- README actualizado.
- Documentación del sprint creada.
