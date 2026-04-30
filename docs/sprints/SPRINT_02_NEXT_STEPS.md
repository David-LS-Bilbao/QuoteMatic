# Sprint 02 - Next Steps

Fecha: 2026-04-30  
Proyecto: QuoteMatic  
Siguiente sprint recomendado: Sprint 03 - Auth, sesiones, roles y age gate

## Objetivo del Sprint 03

Implementar la base de autenticacion de QuoteMatic para permitir registro, inicio y cierre de sesion, persistencia de sesiones en MongoDB, control de roles y validacion de edad antes de crear usuarios o permitir acceso a funcionalidades sensibles.

El objetivo no es construir todo el panel de administracion ni todos los flujos sociales, sino dejar una base segura y comprobable para los siguientes sprints.

## Features Sugeridas

- `register`
- `login`
- `logout`
- `express-session`
- `connect-mongo`
- `bcrypt`
- Middleware `isAuthenticated`
- Middleware `isAdmin`
- Age gate
- Bloqueo de menores de 14
- Guardar `ageGroup` en `User`

## Alcance Funcional Recomendado

### Registro

- Crear formulario o endpoint de registro.
- Validar nombre, email, password y edad declarada.
- Rechazar usuarios menores de 14.
- Calcular y guardar `ageGroup`.
- Guardar password como `passwordHash`, nunca en texto plano.

### Login

- Buscar usuario por email.
- Validar password con `bcrypt`.
- Crear sesion si las credenciales son correctas.
- Rechazar usuarios inactivos.

### Logout

- Destruir sesion activa.
- Redirigir o responder con estado claro.

### Sesiones

- Configurar `express-session`.
- Persistir sesiones con `connect-mongo`.
- Usar una variable de entorno para el secreto de sesion.

### Roles

- Mantener `user` como rol por defecto.
- Proteger rutas futuras de administracion con `isAdmin`.
- Evitar crear panel admin completo dentro de este sprint.

### Age Gate

- Pedir edad o fecha de nacimiento antes del registro efectivo.
- Bloquear menores de 14.
- Asignar `teen_14_17` o `adult_18_plus`.
- Usar `ageGroup` como base para filtrar contenido en sprints posteriores.

## Ramas Sugeridas

- Rama principal del sprint: `feat/auth-sessions-age-gate`
- Alternativa por partes:
  - `feat/auth-base`
  - `feat/session-store`
  - `feat/age-gate`

## Commits Sugeridos

```text
feat(auth): add password hashing helpers
feat(auth): add register flow
feat(auth): add login and logout flow
feat(session): persist sessions in mongo
feat(auth): add authentication middleware
feat(auth): add admin middleware
feat(age-gate): block users under fourteen
docs(sprint): add sprint 03 documentation
```

## Riesgos

- Guardar passwords sin hash por error.
- Configurar sesiones sin secreto robusto.
- Dejar cookies inseguras para entorno productivo.
- Mezclar age gate con recomendacion avanzada antes de tiempo.
- Implementar CRUD admin completo y abrir demasiado el alcance.
- No distinguir entre autenticacion y autorizacion.
- No contemplar usuarios inactivos.
- No documentar variables nuevas en `.env.example`.

## Checklist de Salida

- [ ] Existe registro de usuario.
- [ ] Existe login.
- [ ] Existe logout.
- [ ] Password se guarda con `bcrypt`.
- [ ] Sesion se persiste con `connect-mongo`.
- [ ] Existe middleware `isAuthenticated`.
- [ ] Existe middleware `isAdmin`.
- [ ] Menores de 14 quedan bloqueados.
- [ ] `ageGroup` se guarda en `User`.
- [ ] Variables nuevas estan documentadas en `.env.example`.
- [ ] `npm run typecheck` pasa.
- [ ] `npm run build` pasa.
- [ ] README queda actualizado con Sprint 03.

## Fuera de Alcance Recomendado

- CRUD admin completo.
- Favoritos funcionales.
- APIs externas.
- Dashboard avanzado.
- Recomendacion compleja de frases.
- Moderacion avanzada de contenido.

## Resultado Esperado

Al cerrar Sprint 03, QuoteMatic deberia tener una base de identidad y sesiones suficiente para proteger rutas futuras, distinguir usuarios normales de administradores y aplicar una primera restriccion por edad sin mezclar todavia la logica de recomendacion.
