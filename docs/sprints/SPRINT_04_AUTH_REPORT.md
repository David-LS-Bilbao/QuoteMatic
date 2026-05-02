Copia este contenido completo en:

```txt
docs/sprints/SPRINT_04_AUTH_REPORT.md
```

````md
# Sprint 04 — Auth, sesiones, roles y age gate

Fecha: 2026-05-02  
Proyecto: QuoteMatic  
Rama usada: `feat/auth-sessions-age-gate`  
Rama destino: `dev`

## Objetivo del Sprint

Implementar una autenticación simple y funcional para QuoteMatic.

El objetivo principal del Sprint 04 fue añadir una capa mínima de autenticación que permita:

- registrar usuarios;
- iniciar sesión;
- cerrar sesión;
- persistir sesiones en MongoDB;
- distinguir roles `user` y `admin`;
- bloquear el registro de menores de 14 años;
- guardar el grupo de edad declarado;
- proteger rutas mediante middlewares básicos.

Este sprint mantiene el enfoque MVP del proyecto: backend claro, arquitectura MVC pragmática, vistas EJS mínimas y comprobación manual sencilla.

## Alcance Implementado

Sprint 04 incorpora:

- registro de usuario con formulario EJS;
- login con formulario EJS;
- logout mediante `POST`;
- sesiones con `express-session`;
- persistencia de sesiones con `connect-mongo`;
- hash de contraseñas con `bcrypt`;
- middleware `isAuthenticated`;
- middleware `isAdmin`;
- endpoint de comprobación de sesión `/auth/me`;
- endpoint técnico de comprobación admin `/auth/admin-check`;
- bloqueo de menores de 14 años mediante age gate.

## Rama de Trabajo

```text
feat/auth-sessions-age-gate
````

Rama destino:

```text
dev
```

## Dependencias Añadidas

Dependencias de producción:

```text
bcrypt
express-session
connect-mongo
```

Dependencias de desarrollo:

```text
@types/bcrypt
@types/express-session
```

## Variables de Entorno

Se añadió la variable:

```env
SESSION_SECRET=change_me_in_development
```

Configuración local recomendada:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/quotematic
SESSION_SECRET=quotematic_dev_secret_change_me
```

Notas:

* `.env.example` documenta las variables necesarias.
* `.env` no debe subirse al repositorio.
* No se deben usar secretos reales en documentación ni commits.

## Endpoints Implementados

Rutas montadas bajo `/auth`:

```text
GET  /auth/register
POST /auth/register
GET  /auth/login
POST /auth/login
POST /auth/logout
GET  /auth/me
GET  /auth/admin-check
```

## Arquitectura Usada

Se mantiene una arquitectura MVC simple y pragmática.

Estructura principal añadida o modificada:

```text
src/
├── app.ts
├── server.ts
├── controllers/
│   └── auth.controller.ts
├── middlewares/
│   ├── auth.middleware.ts
│   └── role.middleware.ts
├── routes/
│   └── auth.routes.ts
├── types/
│   ├── domain.types.ts
│   └── express-session.d.ts
└── views/
    └── auth/
        ├── login.ejs
        └── register.ejs
```

`app.ts` monta la ruta:

```text
/auth
```

y mantiene las rutas existentes:

```text
/
/health
/api/quotes
/api
```

## Registro de Usuario

El registro se realiza mediante:

```text
GET  /auth/register
POST /auth/register
```

Campos del formulario:

```text
name
email
password
ageRange
```

Valores posibles recibidos desde el formulario:

```text
under_14
teen_14_17
adult_18_plus
```

Reglas aplicadas:

* `under_14`: se bloquea el registro.
* `teen_14_17`: se crea usuario con `ageGroup: "teen_14_17"`.
* `adult_18_plus`: se crea usuario con `ageGroup: "adult_18_plus"`.
* La contraseña se guarda como `passwordHash`.
* No se guarda contraseña en texto plano.
* El email se normaliza a minúsculas.
* El email debe ser único.
* El rol por defecto es `user`.
* El usuario queda activo por defecto con `isActive: true`.

## Age Gate

El age gate se aplica durante el registro.

Objetivo:

```text
Evitar que menores de 14 años puedan crear cuenta.
```

Comportamiento:

* Si `ageRange` es `under_14`, se responde con error y no se crea usuario.
* Si `ageRange` es `teen_14_17`, se permite el registro.
* Si `ageRange` es `adult_18_plus`, se permite el registro.
* `under_14` no forma parte de los `AgeGroup` guardables en base de datos.

Esto mantiene la base de datos limpia, porque solo se guardan usuarios que pueden registrarse.

## Modelo User

El modelo `User` ya estaba preparado desde Sprint 02 con los campos necesarios:

```text
name
email
passwordHash
role
ageGroup
isActive
```

Campos relevantes:

* `email`: único, en minúsculas e indexado.
* `passwordHash`: obligatorio.
* `role`: enum `user/admin`, por defecto `user`.
* `ageGroup`: enum `teen_14_17/adult_18_plus`.
* `isActive`: por defecto `true`.

No fue necesario rediseñar el modelo para Sprint 04.

## Login

El login se realiza mediante:

```text
GET  /auth/login
POST /auth/login
```

Campos del formulario:

```text
email
password
```

Reglas aplicadas:

* Se busca el usuario por email normalizado.
* Se rechaza email inexistente.
* Se rechaza contraseña incorrecta.
* Se rechaza usuario inactivo.
* Se valida la contraseña con `bcrypt.compare`.
* Si el login es correcto, se crea sesión.

Datos guardados en sesión:

```text
userId
role
ageGroup
```

No se guarda en sesión:

* contraseña;
* password hash;
* datos innecesarios del usuario.

## Logout

El logout se realiza mediante:

```text
POST /auth/logout
```

Comportamiento:

* destruye la sesión activa con `req.session.destroy`;
* limpia la cookie de sesión;
* redirige al inicio.

Después del logout, `/auth/me` debe devolver:

```json
{
  "authenticated": false
}
```

## Sesiones Persistidas en MongoDB

Se configuró `express-session` junto con `connect-mongo`.

La sesión se guarda en MongoDB usando la colección:

```text
sessions
```

Configuración MVP de cookie para desarrollo:

```text
httpOnly: true
sameSite: lax
secure: false
```

Motivos:

* `httpOnly: true`: evita que JavaScript del navegador lea la cookie.
* `sameSite: lax`: protección básica adecuada para el MVP.
* `secure: false`: permite trabajar en `localhost` sin HTTPS.

La configuración productiva con HTTPS, cookies seguras y endurecimiento adicional queda fuera del alcance de este sprint.

## Carga de Variables de Entorno

Durante el sprint se detectó un error inicial:

```text
SESSION_SECRET is not defined
```

La causa fue el orden de carga de `dotenv`.

Solución aplicada:

```ts
import "dotenv/config";
```

Esto asegura que las variables de entorno estén cargadas antes de importar `app.ts`, donde se configura la sesión.

## Tipado de Sesión

Se añadió:

```text
src/types/express-session.d.ts
```

Objetivo:

Permitir que TypeScript reconozca los datos añadidos a `req.session`:

```text
userId
role
ageGroup
```

Sin esta extensión de tipos, TypeScript no reconoce esas propiedades dentro de `SessionData`.

## Middlewares Implementados

### `isAuthenticated`

Archivo:

```text
src/middlewares/auth.middleware.ts
```

Responsabilidad:

* Comprueba si existe `req.session.userId`.
* Si no existe, responde `401 Unauthorized`.
* Si existe, permite continuar con `next()`.

Respuesta esperada cuando no hay sesión:

```json
{
  "success": false,
  "message": "Authentication required"
}
```

### `isAdmin`

Archivo:

```text
src/middlewares/role.middleware.ts
```

Responsabilidad:

* Comprueba si `req.session.role === "admin"`.
* Si no es admin, responde `403 Forbidden`.
* Si es admin, permite continuar con `next()`.

Respuesta esperada cuando el usuario no es admin:

```json
{
  "success": false,
  "message": "Admin role required"
}
```

## Ruta `/auth/me`

Se añadió:

```text
GET /auth/me
```

Objetivo:

Comprobar de forma rápida si existe sesión activa.

Respuesta sin sesión:

```json
{
  "authenticated": false
}
```

Respuesta con sesión:

```json
{
  "authenticated": true,
  "user": {
    "userId": "USER_ID",
    "role": "user",
    "ageGroup": "adult_18_plus"
  }
}
```

Esta ruta es útil para QA manual y para futuras vistas o frontend.

## Ruta `/auth/admin-check`

Se añadió:

```text
GET /auth/admin-check
```

Esta ruta solo existe como comprobación técnica del sprint.

Middlewares aplicados:

```text
isAuthenticated
isAdmin
```

Resultados esperados:

* Usuario no logueado: `401`.
* Usuario con rol `user`: `403`.
* Usuario con rol `admin`: `200`.

Respuesta esperada para admin:

```json
{
  "success": true,
  "message": "Admin access granted"
}
```

## Pruebas Manuales Realizadas

Flujo validado:

* Registro de usuario adulto.
* Registro de usuario teen.
* Bloqueo de menor de 14 años.
* Comprobación de usuario creado en MongoDB Compass.
* Comprobación de `passwordHash`.
* Verificación de que no se guarda `password` en texto plano.
* Login correcto.
* Login con contraseña incorrecta.
* Login con email inexistente.
* Logout.
* `/auth/me` sin sesión.
* `/auth/me` con sesión.
* `/auth/admin-check` sin sesión.
* `/auth/admin-check` con usuario normal.
* Cambio manual de rol a `admin` en Compass.
* Nuevo login para refrescar la sesión.
* `/auth/admin-check` con usuario admin.

## Nota Sobre Cambio de Rol

Durante las pruebas se confirmó que cambiar el rol en MongoDB Compass no actualiza automáticamente una sesión ya iniciada.

Motivo:

```text
El rol se guarda en la sesión durante el login.
```

Por tanto, si un usuario inicia sesión como `user` y luego se cambia su rol a `admin` en Compass, debe hacer logout/login para que la nueva sesión guarde:

```text
role: "admin"
```

## Validaciones Técnicas

Comandos usados para validar:

```bash
npm run typecheck
npm run build
docker compose up -d
npm run seed
npm run dev
```

Comprobaciones principales:

* TypeScript compila correctamente.
* El build se genera correctamente.
* MongoDB levanta con Docker Compose.
* El seed sigue funcionando.
* El servidor arranca correctamente.
* Las rutas de Sprint 03 siguen funcionando.
* Las rutas de Sprint 04 funcionan correctamente.

## Impacto Sobre Sprint 03

Sprint 04 no rompe la API REST existente.

Se mantienen disponibles:

```text
GET /health
GET /api/authors
GET /api/situations
GET /api/quote-types
GET /api/quotes
GET /api/quotes/random
POST /api/quotes
PUT /api/quotes/:id
DELETE /api/quotes/:id
```

No se aplicó protección global a la API de quotes para evitar complicar el MVP.

## Decisiones Técnicas

* Mantener vistas EJS mínimas.
* No introducir servicios adicionales todavía.
* Mantener controladores pragmáticos.
* Guardar solo datos mínimos en sesión.
* Usar `bcrypt` para hash de contraseñas.
* Usar `connect-mongo` para persistencia de sesión.
* Usar `/auth/me` como endpoint simple de QA.
* Usar `/auth/admin-check` como prueba técnica de roles.
* No implementar favoritos en Sprint 04.
* No sobreproteger endpoints públicos todavía.

## Seguridad Básica Aplicada

* No se guarda password en texto plano.
* Se usa `passwordHash`.
* Se usa `SESSION_SECRET`.
* `.env` queda fuera del repositorio.
* Cookies con `httpOnly`.
* Sesiones persistidas en MongoDB.
* Bloqueo de menores de 14 años.
* Rechazo de usuarios inactivos en login.
* Roles controlados mediante enum de dominio.

## Fuera de Alcance

No se implementó en este sprint:

* favoritos funcionales;
* dashboard avanzado;
* panel admin complejo;
* protección completa de todos los endpoints;
* refresh de sesión avanzado;
* recuperación de contraseña;
* verificación de email;
* OAuth;
* JWT;
* configuración productiva completa de cookies;
* tests automatizados complejos;
* paginación;
* filtros avanzados;
* APIs externas.

## Archivos Principales Modificados o Creados

```text
package.json
package-lock.json
.env.example
src/app.ts
src/server.ts
src/controllers/auth.controller.ts
src/routes/auth.routes.ts
src/middlewares/auth.middleware.ts
src/middlewares/role.middleware.ts
src/types/express-session.d.ts
src/views/auth/register.ejs
src/views/auth/login.ejs
docs/sprints/SPRINT_04_AUTH_REPORT.md
docs/sprints/SPRINT_04_QA_CHECKLIST.md
docs/sprints/SPRINT_04_NEXT_STEPS.md
README.md
```

## Commits Sugeridos del Sprint

Commits realizados o esperados:

```text
feat(auth): add auth session dependencies
feat(session): persist sessions in mongo
feat(auth): add register flow
feat(auth): add login and logout flow
feat(auth): add auth and role middleware
docs(auth): document sprint 04 auth flow
```

## Resultado Final

Sprint 04 queda completado con:

* autenticación básica funcional;
* registro de usuarios;
* bloqueo de menores de 14 años;
* contraseñas hasheadas;
* login funcional;
* logout funcional;
* sesiones persistidas en MongoDB;
* roles `user` y `admin`;
* middleware `isAuthenticated`;
* middleware `isAdmin`;
* endpoint `/auth/me`;
* endpoint `/auth/admin-check`;
* documentación de QA y próximos pasos.

QuoteMatic queda preparado para Sprint 05, donde se recomienda implementar favoritos funcionales protegidos por sesión.

```
```
