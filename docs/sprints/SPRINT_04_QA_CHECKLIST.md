Copia este contenido completo en:

```txt
docs/sprints/SPRINT_04_QA_CHECKLIST.md
```

````md
# Sprint 04 — QA Checklist

Fecha: 2026-05-02  
Proyecto: QuoteMatic  
Rama: `feat/auth-sessions-age-gate`

## Git y Entorno

- [x] Confirmar rama `feat/auth-sessions-age-gate`.
- [x] Confirmar que MongoDB está disponible.
- [x] Confirmar que `.env` contiene `MONGODB_URI`.
- [x] Confirmar que `.env` contiene `SESSION_SECRET`.
- [x] Confirmar que `.env` no está versionado.
- [x] Confirmar que no hay cambios fuera del alcance del sprint.

Comando:

```bash
git branch --show-current
git status --short
````

Resultado esperado:

```text
feat/auth-sessions-age-gate
```

## Dependencias

Dependencias de producción añadidas:

* [x] `bcrypt`
* [x] `express-session`
* [x] `connect-mongo`

Dependencias de desarrollo añadidas:

* [x] `@types/bcrypt`
* [x] `@types/express-session`

Validación de vulnerabilidades de producción:

```bash
npm audit --omit=dev
```

Resultado esperado:

```text
found 0 vulnerabilities
```

Nota:

`npm audit` puede mostrar vulnerabilidades en dependencias de desarrollo relacionadas con `cpx` y su árbol antiguo de dependencias. No se aplicó `npm audit fix --force` para evitar cambios incompatibles fuera del alcance del sprint.

## Variables de Entorno

Archivo de referencia:

```text
.env.example
```

Debe incluir:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/quotematic
SESSION_SECRET=change_me_in_development
```

Checklist:

* [x] `.env.example` incluye `PORT`.
* [x] `.env.example` incluye `MONGODB_URI`.
* [x] `.env.example` incluye `SESSION_SECRET`.
* [x] `.env` local incluye `SESSION_SECRET`.
* [x] `.env` no se sube al repositorio.
* [x] No se usan secretos reales.

## TypeScript

* [x] El proyecto compila sin errores de tipos.
* [x] `express-session` reconoce `req.session.userId`.
* [x] `express-session` reconoce `req.session.role`.
* [x] `express-session` reconoce `req.session.ageGroup`.
* [x] Los tipos `UserRole` y `AgeGroup` se usan desde `domain.types.ts`.

Comando:

```bash
npm run typecheck
```

Resultado esperado:

```text
Sin errores de TypeScript.
```

## Build

* [x] TypeScript compila a `dist`.
* [x] Las vistas se copian a `dist/views`.
* [x] Los assets públicos se copian a `dist/public`.
* [x] Las vistas nuevas de auth se incluyen en build.

Comando:

```bash
npm run build
```

Resultado esperado:

```text
Build completado correctamente.
```

## MongoDB con Docker

* [x] Levantar MongoDB local.
* [x] Confirmar contenedor activo.
* [x] Confirmar conexión desde la app.
* [x] Confirmar existencia de base `quotematic`.

Comandos:

```bash
docker compose up -d
docker ps
```

Resultado esperado:

```text
quotematic-mongodb running
```

## Seed

* [x] Ejecutar seed inicial.
* [x] Confirmar que inserta autores.
* [x] Confirmar que inserta situaciones.
* [x] Confirmar que inserta tipos de frase.
* [x] Confirmar que inserta frases.
* [x] Confirmar que el seed puede repetirse.
* [x] Confirmar que el seed no rompe usuarios creados fuera del seed si no limpia `User`.

Comando:

```bash
npm run seed
```

### Caso WSL con `tsx`

En algunos entornos WSL, `tsx` puede fallar al crear el socket temporal en una ruta montada de Windows.

Síntoma posible:

```text
Error: listen ENOTSUP: operation not supported on socket
```

Workaround:

```bash
TMPDIR=/tmp npm run seed
```

## Servidor

* [x] Arrancar servidor en modo desarrollo.
* [x] Confirmar que escucha en `http://localhost:3000`.
* [x] Confirmar que no falla por `SESSION_SECRET`.
* [x] Confirmar que no falla por `MONGODB_URI`.

Comando:

```bash
npm run dev
```

Resultado esperado:

```text
QuoteMatic server running on http://localhost:3000
```

## Endpoints Base

* [x] `GET /health` responde correctamente.
* [x] `GET /` renderiza landing EJS.
* [x] La app no rompe rutas previas al añadir sesiones.

Comandos:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/
```

## API REST Existente

Endpoints revisados para confirmar que Sprint 04 no rompe Sprint 03:

* [x] `GET /api/authors` responde.
* [x] `GET /api/situations` responde.
* [x] `GET /api/quote-types` responde.
* [x] `GET /api/quotes` responde.
* [x] `GET /api/quotes/random` responde.

Comandos:

```bash
curl http://localhost:3000/api/authors
curl http://localhost:3000/api/situations
curl http://localhost:3000/api/quote-types
curl http://localhost:3000/api/quotes
curl http://localhost:3000/api/quotes/random
```

## Registro

Rutas:

```text
GET  /auth/register
POST /auth/register
```

Checklist:

* [x] `GET /auth/register` renderiza formulario.
* [x] El formulario incluye `name`.
* [x] El formulario incluye `email`.
* [x] El formulario incluye `password`.
* [x] El formulario incluye `ageRange`.
* [x] Registro con `adult_18_plus` crea usuario.
* [x] Registro con `teen_14_17` crea usuario.
* [x] Registro con `under_14` bloquea el registro.
* [x] Usuario menor de 14 no aparece en MongoDB.
* [x] Email duplicado se rechaza.
* [x] Password no se guarda en texto plano.
* [x] `passwordHash` aparece hasheado.
* [x] `role` por defecto es `user`.
* [x] `isActive` por defecto es `true`.
* [x] `ageGroup` se guarda correctamente.

Valores probados:

```text
under_14
teen_14_17
adult_18_plus
```

Resultado esperado para menor de 14:

```text
No se permite el registro a menores de 14 años.
```

## Comprobación en MongoDB Compass

Colección:

```text
quotematic.users
```

Checklist:

* [x] El usuario adulto aparece creado.
* [x] El usuario teen aparece creado.
* [x] El usuario menor de 14 no aparece creado.
* [x] El email se guarda en minúsculas.
* [x] Existe `passwordHash`.
* [x] No existe campo `password`.
* [x] `passwordHash` empieza con formato bcrypt.
* [x] `role` aparece como `user` por defecto.
* [x] `ageGroup` aparece como `teen_14_17` o `adult_18_plus`.
* [x] `isActive` aparece como `true`.

## Login

Rutas:

```text
GET  /auth/login
POST /auth/login
```

Checklist:

* [x] `GET /auth/login` renderiza formulario.
* [x] El formulario incluye `email`.
* [x] El formulario incluye `password`.
* [x] Login con email y password válidos inicia sesión.
* [x] Login con email inexistente se rechaza.
* [x] Login con password incorrecta se rechaza.
* [x] Usuario inactivo no puede iniciar sesión.
* [x] La sesión guarda `userId`.
* [x] La sesión guarda `role`.
* [x] La sesión guarda `ageGroup`.

Resultado esperado con credenciales incorrectas:

```text
Email o contraseña incorrectos.
```

Resultado esperado con usuario inactivo:

```text
Usuario inactivo.
```

## Auth Me

Ruta:

```text
GET /auth/me
```

Checklist:

* [x] Sin sesión devuelve `authenticated: false`.
* [x] Con sesión devuelve `authenticated: true`.
* [x] Con sesión devuelve `userId`.
* [x] Con sesión devuelve `role`.
* [x] Con sesión devuelve `ageGroup`.

Respuesta esperada sin sesión:

```json
{
  "authenticated": false
}
```

Respuesta esperada con sesión:

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

Respuesta comprobada con usuario admin:

```json
{
  "authenticated": true,
  "user": {
    "userId": "69f5e0d67c69432c2a8b1716",
    "role": "admin",
    "ageGroup": "adult_18_plus"
  }
}
```

## Logout

Ruta:

```text
POST /auth/logout
```

Checklist:

* [x] Logout destruye la sesión.
* [x] Logout limpia la cookie de sesión.
* [x] Después de logout, `/auth/me` devuelve `authenticated: false`.
* [x] Después de logout, `/auth/admin-check` devuelve `401`.

Resultado esperado después de logout:

```json
{
  "authenticated": false
}
```

## Sesiones en MongoDB

Colección esperada:

```text
quotematic.sessions
```

Checklist:

* [x] Existe colección `sessions`.
* [x] La sesión se persiste en MongoDB.
* [x] La cookie de sesión se genera al iniciar sesión.
* [x] Al cerrar sesión, la sesión queda invalidada.
* [x] Cambiar el rol en Compass requiere nuevo login para actualizar la sesión.

Nota:

Si un usuario inicia sesión con `role: "user"` y luego se cambia manualmente en Compass a `role: "admin"`, hay que hacer logout/login para que la sesión guarde el nuevo rol.

## Middlewares

Archivos:

```text
src/middlewares/auth.middleware.ts
src/middlewares/role.middleware.ts
```

Checklist:

* [x] Existe `isAuthenticated`.
* [x] Existe `isAdmin`.
* [x] `isAuthenticated` bloquea usuario no logueado.
* [x] `isAuthenticated` permite usuario logueado.
* [x] `isAdmin` bloquea usuario normal.
* [x] `isAdmin` permite usuario admin.

## Ruta Admin Check

Ruta:

```text
GET /auth/admin-check
```

Checklist:

* [x] Usuario no logueado recibe `401`.
* [x] Usuario normal recibe `403`.
* [x] Usuario admin recibe `200`.

Respuesta esperada sin login:

```json
{
  "success": false,
  "message": "Authentication required"
}
```

Respuesta esperada con usuario normal:

```json
{
  "success": false,
  "message": "Admin role required"
}
```

Respuesta esperada con usuario admin:

```json
{
  "success": true,
  "message": "Admin access granted"
}
```

## Age Gate

Checklist:

* [x] `under_14` está disponible solo como opción del formulario.
* [x] `under_14` no se guarda como `ageGroup`.
* [x] `under_14` bloquea el registro.
* [x] `teen_14_17` se guarda como `ageGroup`.
* [x] `adult_18_plus` se guarda como `ageGroup`.
* [x] El modelo `User` solo acepta age groups válidos.

## Seguridad Básica

Checklist:

* [x] No se guarda contraseña en texto plano.
* [x] Se usa `bcrypt.hash` en registro.
* [x] Se usa `bcrypt.compare` en login.
* [x] Se usa `SESSION_SECRET`.
* [x] `.env` no se sube al repo.
* [x] La cookie usa `httpOnly`.
* [x] La cookie usa `sameSite: "lax"`.
* [x] La cookie usa `secure: false` solo para desarrollo local.
* [x] Se rechaza usuario inactivo.
* [x] Se guarda solo información mínima en sesión.

## Rutas Fuera de Alcance

No se validan en Sprint 04 porque quedan fuera de alcance:

* [ ] Favoritos funcionales.
* [ ] Dashboard avanzado.
* [ ] Panel admin complejo.
* [ ] Recuperación de contraseña.
* [ ] Verificación de email.
* [ ] OAuth.
* [ ] JWT.
* [ ] Protección completa de todos los endpoints.

## Criterios de Aceptación Final

* [x] `npm run typecheck` pasa.
* [x] `npm run build` pasa.
* [x] `docker compose up -d` levanta MongoDB.
* [x] `npm run seed` pasa, o `TMPDIR=/tmp npm run seed` pasa en WSL.
* [x] `npm run dev` arranca servidor.
* [x] `GET /health` responde.
* [x] `GET /auth/register` responde.
* [x] `POST /auth/register` crea usuario válido.
* [x] `POST /auth/register` bloquea menor de 14.
* [x] `GET /auth/login` responde.
* [x] `POST /auth/login` inicia sesión.
* [x] `POST /auth/logout` destruye sesión.
* [x] `GET /auth/me` comprueba sesión.
* [x] `GET /auth/admin-check` bloquea no autenticados.
* [x] `GET /auth/admin-check` bloquea usuarios normales.
* [x] `GET /auth/admin-check` permite admins.
* [x] API REST de Sprint 03 sigue funcionando.

## Estado Final QA

```text
Sprint 04 validado manualmente.
Auth básica funcional.
Registro funcional.
Login funcional.
Logout funcional.
Sesiones persistidas en MongoDB.
Roles user/admin comprobados.
Age gate comprobado.
Middlewares comprobados.
API REST anterior sin roturas detectadas.
```

```
```
