# QuoteMatic - Direccion Tecnica del Proyecto

Fecha: 2026-04-30

## Enfoque Actual del Proyecto

QuoteMatic es un proyecto individual de backend para aprendizaje y portfolio. El enfoque actualizado es mantenerlo pequeno, claro y demostrable, priorizando una API REST propia sobre una base MongoDB con modelos Mongoose y seed inicial.

Prioridad tecnica:

```text
MongoDB + Mongoose + Seed + API REST simple + CRUD minimo
```

Las vistas EJS seran minimas y se usaran solo como apoyo visual para demo.

## Que es QuoteMatic

QuoteMatic es una aplicacion backend que gestionara frases segun situacion, tipo de frase y edad declarada. En el MVP, lo importante es demostrar que el proyecto puede modelar datos, cargarlos con seed y exponerlos mediante endpoints REST.

## Que se Prioriza

- Modelos Mongoose claros.
- Relaciones entre colecciones.
- Seed inicial repetible.
- Endpoints REST faciles de probar.
- CRUD basico sobre `Quote`.
- Documentacion academica y util para bootcamp.
- Simplicidad tecnica.

## Que Queda Fuera del MVP

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

## Roadmap Actualizado

- Sprint 01 - Setup tecnico base. Completado.
- Sprint 02 - Modelos + seed. Completado.
- Sprint 03 - API REST publica de consulta + CRUD basico de `Quote`.
- Sprint 04 - Auth + sesiones + roles + age gate.
- Sprint 05 - Vistas minimas + favoritos + polish.

## Criterio de Exito Para el Profesor

El proyecto debe poder evaluarse con un flujo simple:

1. Clonar el repositorio.
2. Instalar dependencias.
3. Levantar MongoDB con Docker.
4. Ejecutar el seed inicial.
5. Arrancar el servidor.
6. Probar endpoints REST con datos reales.

El valor principal del MVP es que se entienda rapidamente la conexion entre modelos, seed, MongoDB y API REST.

## Endpoints Objetivo del Sprint 03

Endpoints principales de `Quote`:

- `GET /api/quotes`
- `GET /api/quotes/:id`
- `GET /api/quotes/random`
- `POST /api/quotes`
- `PUT /api/quotes/:id`
- `DELETE /api/quotes/:id`

Endpoints auxiliares:

- `GET /api/authors`
- `GET /api/situations`
- `GET /api/quote-types`

Los endpoints auxiliares son de consulta y sirven para entender los datos relacionados necesarios para crear o probar frases.

## Regla de Simplicidad

Si una funcionalidad no ayuda a demostrar MongoDB, Mongoose, endpoints o CRUD, queda fuera del MVP.
