# Sprint 05 — Favorites API Report

## Objetivo

Implementar favoritos funcionales protegidos por sesión para QuoteMatic.

El usuario autenticado puede:

- guardar una frase como favorita
- quitar una frase de favoritos
- listar sus frases favoritas
- evitar duplicados
- reactivar un favorito previamente desactivado

## Alcance implementado

Endpoints añadidos bajo `/api/favorites`:

```txt
GET    /api/favorites/me
POST   /api/favorites/:quoteId
DELETE /api/favorites/:quoteId


Arquitectura
Se mantiene arquitectura MVC simple:
Route -> Middleware -> Controller -> Model -> MongoDB
Archivos principales:
src/controllers/api/favoriteApi.controller.tssrc/routes/api/favoriteApi.routes.tssrc/app.ts
Modelo usado
Modelo Favorite existente:


user


quote


isActive


timestamps


El modelo tiene índice único por:
user + quote
Esto evita duplicados a nivel de base de datos.
Reglas funcionales
GET /api/favorites/me


Requiere sesión.


Devuelve solo favoritos activos del usuario actual.


Hace populate de quote.


La quote incluye populate de:


author


situation


quoteType




POST /api/favorites/:quoteId


Requiere sesión.


Valida quoteId como ObjectId.


Comprueba que la quote existe y está activa.


Si no existe favorito previo, lo crea.


Si existe inactivo, lo reactiva.


Si ya existe activo, responde sin duplicar.


DELETE /api/favorites/:quoteId


Requiere sesión.


Valida quoteId.


Busca favorito activo del usuario.


Si existe, aplica borrado lógico con isActive: false.


Si no existe, responde 404.


No borra documentos físicamente.


Decisiones técnicas


Se usa req.session.userId como identidad del usuario.


Se reutiliza el modelo Favorite.


Se usa borrado lógico para mantener historial.


Se valida ObjectId antes de consultar MongoDB.


Se mantiene una API JSON simple con success, message y data.


Resultado
Sprint 05 completa favoritos funcionales protegidos por sesión, manteniendo la API REST anterior operativa.
---## Archivo/ruta```txtdocs/sprints/SPRINT_05_QA_CHECKLIST.md
Contenido
# Sprint 05 — QA Checklist## Validación técnica- [ ] La rama de trabajo es `feat/favorites-api`.- [ ] MongoDB levanta correctamente con Docker Compose.- [ ] El seed se ejecuta correctamente.- [ ] El servidor arranca con `npm run dev`.- [ ] TypeScript compila sin errores.- [ ] El build final funciona.## Comandos obligatorios```bashnpm run typechecknpm run builddocker compose up -dnpm run seednpm run dev
Validación de rutas protegidas
Sin login


 GET /api/favorites/me devuelve 401.


 POST /api/favorites/:quoteId devuelve 401.


 DELETE /api/favorites/:quoteId devuelve 401.


Con login


 GET /auth/me confirma usuario autenticado.


 GET /api/favorites/me devuelve lista de favoritos.


 POST /api/favorites/:quoteId crea favorito.


 POST /api/favorites/:quoteId repetido no duplica.


 DELETE /api/favorites/:quoteId marca favorito como inactivo.


 GET /api/favorites/me ya no muestra el favorito eliminado.


 POST /api/favorites/:quoteId después del DELETE reactiva el favorito.


Validaciones de errores


 POST /api/favorites/id-no-valido devuelve 400.


 DELETE /api/favorites/id-no-valido devuelve 400.


 POST /api/favorites/:quoteId con quote inexistente devuelve 404.


 DELETE /api/favorites/:quoteId sin favorito activo devuelve 404.


Validación de datos


 No se crean favoritos duplicados.


 El borrado es lógico, no físico.


 Favorite.isActive cambia a false al eliminar.


 Favorite.isActive vuelve a true al reactivar.


 El populate de quote funciona.


 La quote poblada incluye author, situation y quoteType.


Validación de regresión


 GET /health sigue funcionando.


 GET /api/quotes sigue funcionando.


 GET /api/quotes/random sigue funcionando.


 GET /api/authors sigue funcionando.


 GET /api/situations sigue funcionando.


 GET /api/quote-types sigue funcionando.


 Auth de Sprint 04 sigue funcionando.


---## Archivo/ruta```txtdocs/sprints/SPRINT_05_NEXT_STEPS.md
Contenido
# Sprint 05 — Next Steps## Estado al cerrar Sprint 05QuoteMatic ya permite que usuarios autenticados gestionen favoritos mediante API REST protegida por sesión.Funcionalidades disponibles:- login con sesión- listar favoritos propios- guardar frase favorita- evitar duplicados- quitar favorito mediante borrado lógico- reactivar favorito eliminado## Próximos pasos recomendados### 1. Mejorar documentación de usoAñadir ejemplos curl completos al README para:- login con cookie- obtener quoteId- añadir favorito- listar favoritos- eliminar favorito- reactivar favorito### 2. Pulir respuestas JSONUnificar formato de respuesta entre módulos:```json{  "success": true,  "message": "Operation completed",  "data": {}}
3. Añadir protección admin a escritura de quotes
Pendiente para futuro sprint:


POST /api/quotes


PUT /api/quotes/:id


DELETE /api/quotes/:id


Estas rutas podrían requerir isAuthenticated + isAdmin.
4. Añadir vistas mínimas de favoritos
Fuera del Sprint 05, pero útil para demo:


botón "Guardar favorito"


vista simple "Mis favoritos"


botón "Quitar favorito"


5. Añadir tests básicos
Futuro:


tests unitarios de controller


tests de integración de endpoints


pruebas de sesión


Fuera de alcance
No se implementó:


dashboard avanzado


paginación


filtros de favoritos


panel admin complejo


frontend bonito


tests automatizados complejos


### 6. Endurecer concurrencia en favoritos

Mejora futura no bloqueante:

- Si dos peticiones `POST /api/favorites/:quoteId` llegan exactamente al mismo tiempo para el mismo usuario y la misma frase, MongoDB evitará duplicados gracias al índice único `{ user, quote }`.
- Actualmente una de esas peticiones podría recibir un error interno si ambas intentan crear el documento a la vez.
- Se podría mejorar manejando el error `E11000 duplicate key` o usando una operación atómica con `findOneAndUpdate` + `upsert`.
- No afecta al flujo normal secuencial del Sprint 05.
