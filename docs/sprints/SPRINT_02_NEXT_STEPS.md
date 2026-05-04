# Sprint 02 - Next Steps

Fecha: 2026-04-30  
Proyecto: QuoteMatic  
Siguiente sprint recomendado: Sprint 03 - API REST publica de consulta + CRUD basico de Quote

## Objetivo del Sprint 03

Implementar una API REST simple para consultar los datos cargados por el seed y realizar CRUD basico sobre `Quote`.

El objetivo principal es que el profesor pueda clonar el proyecto, levantar MongoDB, ejecutar el seed y probar endpoints REST contra datos reales. Sprint 03 debe demostrar el uso practico de Express, MongoDB, Mongoose, relaciones entre colecciones y operaciones CRUD sin introducir autenticacion ni paneles complejos.

## Endpoints Previstos

Endpoints principales de frases:

- `GET /api/quotes`
- `GET /api/quotes/:id`
- `GET /api/quotes/random`
- `POST /api/quotes`
- `PUT /api/quotes/:id`
- `DELETE /api/quotes/:id`

Endpoints auxiliares de consulta:

- `GET /api/authors`
- `GET /api/situations`
- `GET /api/quote-types`

El CRUD principal del MVP sera sobre `Quote`. Los endpoints auxiliares serviran para entender los datos relacionados y facilitar la creacion o prueba de frases.

## Rama Sugerida

```text
feat/api-rest-quotes
```

## Commits Sugeridos

```text
docs(project): update mvp direction
docs(sprint): update sprint 03 api roadmap
```

Para la implementacion posterior del Sprint 03, se sugieren commits separados como:

```text
feat(api): add quote read endpoints
feat(api): add quote create endpoint
feat(api): add quote update endpoint
feat(api): add quote delete endpoint
feat(api): add catalog read endpoints
docs(api): document sprint 03 endpoints
```

## Fuera de Alcance

- Auth.
- Sesiones.
- Roles reales.
- Login/register.
- Favoritos funcionales.
- APIs externas.
- Dashboard avanzado.
- Panel admin complejo.
- Paginacion.
- Filtros avanzados.
- `ImportCandidate`.
- Staging de APIs externas.

## Riesgos de Sobreingenieria

- Intentar construir autenticacion antes de tener endpoints REST probables.
- Crear un panel admin completo cuando basta con CRUD basico de `Quote`.
- Anadir paginacion, filtros avanzados o busqueda compleja demasiado pronto.
- Mezclar el Sprint 03 con favoritos o dashboard.
- Introducir dependencias nuevas sin necesidad real.
- Crear abstracciones genericas antes de validar el flujo basico con Mongoose.

Regla de simplicidad: si una funcionalidad no ayuda a demostrar MongoDB, Mongoose, endpoints o CRUD, queda fuera del MVP.

## Checklist de Salida

- [ ] Existe `GET /api/quotes`.
- [ ] Existe `GET /api/quotes/:id`.
- [ ] Existe `GET /api/quotes/random`.
- [ ] Existe `POST /api/quotes`.
- [ ] Existe `PUT /api/quotes/:id`.
- [ ] Existe `DELETE /api/quotes/:id`.
- [ ] Existe `GET /api/authors`.
- [ ] Existe `GET /api/situations`.
- [ ] Existe `GET /api/quote-types`.
- [ ] Las respuestas de `Quote` incluyen referencias utiles o pobladas cuando aporte claridad.
- [ ] El CRUD valida ids y referencias basicas.
- [ ] `npm run typecheck` pasa.
- [ ] `npm run build` pasa.
- [ ] `npm run seed` permite preparar datos de prueba.
- [ ] README documenta endpoints y flujo de prueba.

## Resultado Esperado

Al cerrar Sprint 03, QuoteMatic debe poder demostrarse como backend REST pequeno: base MongoDB levantada, seed ejecutado y endpoints disponibles para consultar, crear, editar y desactivar o eliminar frases.
