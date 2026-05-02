Copia este contenido completo en:

```txt id="qpbgnf"
docs/sprints/SPRINT_04_NEXT_STEPS.md
```

````md id="c5bk13"
# Sprint 04 — Next Steps

Fecha: 2026-05-02  
Proyecto: QuoteMatic  
Siguiente sprint recomendado: Sprint 05 — Favoritos funcionales y rutas protegidas

## Estado Tras Sprint 04

Sprint 04 deja QuoteMatic con autenticación básica funcional:

- registro de usuarios;
- bloqueo de menores de 14 años;
- hash de contraseñas con `bcrypt`;
- login;
- logout;
- sesiones persistidas en MongoDB;
- roles `user` y `admin`;
- middleware `isAuthenticated`;
- middleware `isAdmin`;
- endpoint `/auth/me`;
- endpoint técnico `/auth/admin-check`.

El backend ya puede demostrarse con MongoDB, seed, sesiones persistidas y flujo básico de usuario.

## Objetivo Recomendado del Sprint 05

Implementar favoritos funcionales para usuarios autenticados.

Objetivo principal:

```text
Permitir que un usuario autenticado pueda guardar, quitar y consultar sus frases favoritas.
````

El Sprint 05 debe apoyarse en el modelo `Favorite` existente y en los middlewares creados en Sprint 04.

## Trabajo Recomendado Para Sprint 05

### Favoritos Funcionales

Crear rutas mínimas para favoritos:

```text
POST   /api/favorites/:quoteId
DELETE /api/favorites/:quoteId
GET    /api/favorites/me
```

Reglas recomendadas:

* Solo usuarios autenticados pueden usar favoritos.
* Un usuario no debe poder guardar la misma frase dos veces como favorita activa.
* Si un favorito existe pero está inactivo, puede reactivarse.
* El borrado puede ser lógico usando `isActive: false`.
* La consulta de favoritos debe devolver solo favoritos activos del usuario autenticado.

### Middleware de Autenticación

Aplicar `isAuthenticated` a las rutas de favoritos:

```text
/api/favorites/*
```

No proteger todavía toda la API de quotes, porque en el MVP sigue teniendo sentido que las frases sean consultables públicamente.

### Modelo Favorite

El modelo `Favorite` ya existe desde Sprint 02.

Campos principales:

```text
user
quote
isActive
```

Índice existente:

```text
user + quote
```

Este índice ayuda a evitar duplicados por usuario y frase.

### Controlador de Favoritos

Crear un controlador específico:

```text
src/controllers/api/favoriteApi.controller.ts
```

Responsabilidades:

* crear favorito;
* quitar favorito;
* listar favoritos del usuario autenticado;
* validar `quoteId`;
* comprobar que la frase existe y está activa;
* manejar duplicados o reactivaciones.

### Rutas de Favoritos

Crear archivo:

```text
src/routes/api/favoriteApi.routes.ts
```

Montaje recomendado en `app.ts`:

```text
app.use("/api/favorites", favoriteApiRoutes)
```

### Respuestas JSON

Mantener el estilo actual de la API:

```json
{
  "success": true,
  "data": {}
}
```

Para errores:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Funcionalidades Opcionales del Sprint 05

Solo si el MVP de favoritos queda cerrado pronto.

### Mini Vista de Perfil

Crear una vista mínima:

```text
GET /profile
```

Mostrar:

* usuario autenticado;
* rol;
* grupo de edad;
* enlace a favoritos;
* botón de logout.

No debe convertirse en dashboard complejo.

### Vista Mínima de Favoritos

Crear una vista EJS opcional:

```text
GET /favorites
```

Mostrar:

* frases favoritas del usuario;
* autor;
* tipo de frase;
* situación;
* botón para quitar favorito.

Si consume demasiado tiempo, dejar solo API REST.

### Enlaces Básicos en Landing

Mejorar `index.ejs` con enlaces a:

```text
/auth/register
/auth/login
/auth/me
```

Si hay sesión, en una fase posterior se podría mostrar también logout o perfil.

## Age Gate Futuro

Sprint 04 bloquea el registro de menores de 14 años, pero todavía no aplica filtrado avanzado de contenido por edad.

Posibles mejoras futuras:

* Si usuario `teen_14_17`, evitar contenido `adult`.
* Si usuario `adult_18_plus`, permitir todo el contenido.
* Si usuario no autenticado, mostrar solo contenido `all` o mantener API pública sin filtrar según decisión del MVP.
* Documentar claramente la regla aplicada.

Recomendación:

```text
No mezclar age gate avanzado con favoritos si complica Sprint 05.
```

## Admin Futuro

Sprint 04 solo añade una ruta técnica de comprobación admin:

```text
GET /auth/admin-check
```

Posibles mejoras futuras:

* Proteger `POST /api/quotes` con `isAdmin`.
* Proteger `PUT /api/quotes/:id` con `isAdmin`.
* Proteger `DELETE /api/quotes/:id` con `isAdmin`.
* Crear panel admin mínimo para gestionar frases.

Recomendación:

```text
No crear panel admin completo hasta cerrar favoritos.
```

## Testing Futuro

Actualmente la validación es manual.

Tests candidatos para más adelante:

* registro adulto correcto;
* registro menor de 14 bloqueado;
* login correcto;
* login incorrecto;
* logout;
* middleware `isAuthenticated`;
* middleware `isAdmin`;
* crear favorito;
* evitar favorito duplicado;
* listar favoritos del usuario;
* quitar favorito.

Recomendación:

```text
Añadir tests básicos cuando el flujo MVP esté estable.
```

## Documentación Para Sprint 05

Crear al cerrar Sprint 05:

```text
docs/sprints/SPRINT_05_FAVORITES_REPORT.md
docs/sprints/SPRINT_05_QA_CHECKLIST.md
docs/sprints/SPRINT_05_NEXT_STEPS.md
```

Actualizar:

```text
README.md
```

## Riesgos Para Sprint 05

### Riesgo 1 — Mezclar favoritos con dashboard

Problema:

```text
Intentar construir perfil, dashboard, favoritos y admin a la vez.
```

Mitigación:

```text
Primero API mínima de favoritos. Después vista opcional.
```

### Riesgo 2 — Sobreproteger la API

Problema:

```text
Proteger todos los endpoints de quotes puede romper la demo pública del backend.
```

Mitigación:

```text
Mantener quotes públicas. Proteger solo favoritos.
```

### Riesgo 3 — Duplicados en favoritos

Problema:

```text
Un usuario podría intentar guardar varias veces la misma frase.
```

Mitigación:

```text
Usar el índice user + quote y controlar reactivación si isActive está en false.
```

### Riesgo 4 — Poblar demasiados datos

Problema:

```text
Un populate excesivo puede hacer respuestas grandes o confusas.
```

Mitigación:

```text
Devolver solo campos útiles: text, author, situation, quoteType, contentRating.
```

### Riesgo 5 — Sesión antigua con datos desactualizados

Problema:

```text
Cambios manuales de rol en Compass no actualizan una sesión ya creada.
```

Mitigación:

```text
Documentar que cambios manuales requieren logout/login.
```

## Checklist de Entrada Para Sprint 05

Antes de empezar Sprint 05:

* [ ] Sprint 04 mergeado en `dev`.
* [ ] README actualizado.
* [ ] `.env.example` actualizado con `SESSION_SECRET`.
* [ ] Registro validado.
* [ ] Login validado.
* [ ] Logout validado.
* [ ] `/auth/me` validado.
* [ ] `/auth/admin-check` validado.
* [ ] API REST de Sprint 03 sigue funcionando.
* [ ] Modelo `Favorite` revisado.
* [ ] Alcance de favoritos definido.

## Backlog Posterior

Después de Sprint 05 podrían venir:

* panel admin mínimo;
* protección de creación/edición/borrado de quotes solo para admin;
* filtros por edad;
* vistas EJS más completas;
* documentación de arquitectura;
* tests básicos;
* deploy;
* paginación;
* búsqueda avanzada;
* importación de contenido;
* integración futura con frontend React.

## Recomendación de Enfoque

Mantener el proyecto en modo bootcamp MVP:

```text
1 funcionalidad clara por sprint
commits pequeños
validación manual
documentación suficiente
sin sobrearquitectura
```

Para Sprint 05, la prioridad debe ser:

```text
Favoritos funcionales protegidos por sesión.
```

No avanzar a dashboard, admin complejo o diseño visual hasta que favoritos esté probado y documentado.

## Resultado Esperado del Sprint 05

Al cerrar Sprint 05, QuoteMatic debería permitir:

* iniciar sesión;
* guardar una frase como favorita;
* quitar una frase de favoritos;
* listar favoritos del usuario autenticado;
* evitar duplicados;
* mantener la API de frases funcionando;
* documentar el flujo completo en README y docs.

```
```
