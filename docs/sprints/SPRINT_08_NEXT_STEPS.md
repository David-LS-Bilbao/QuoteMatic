# Sprint 08 — Next Steps

Proyecto: QuoteMatic  
Rama actual: `feat/ejs-responsive-ui`

## Estado Actual

Sprint 08 añade una interfaz EJS responsive y funcional para demo.

La app permite:

- Ver home.
- Registrarse.
- Iniciar sesión.
- Usar dashboard.
- Pedir frases aleatorias.
- Guardar favoritos.
- Ver favoritos.
- Quitar favoritos.
- Acceder a Swagger.
- Entrar a panel admin mínimo.

## Siguiente Sprint Recomendado

Sprint 09 — QA final, documentación de entrega y polish.

## Qué Hacer en Sprint 09

- Revisar README completo.
- Revisar docs de sprints.
- Hacer QA manual end-to-end.
- Limpiar documentación duplicada si existe.
- Revisar `.gitignore`.
- Revisar que no haya credenciales en el repo.
- Preparar descripción final de proyecto.
- Preparar demo para profesor.

## Qué No Hacer Todavía

- No migrar a React.
- No crear dashboard complejo.
- No añadir APIs externas.
- No añadir features grandes.
- No cambiar arquitectura del backend.

## Validación Recomendada

```bash
npm run typecheck
npm run build
npm run dev
```

Rutas a revisar:

```text
http://localhost:3000/
http://localhost:3000/dashboard
http://localhost:3000/auth/register
http://localhost:3000/auth/login
http://localhost:3000/favorites
http://localhost:3000/admin
http://localhost:3000/api-docs
```

## Commit Sugerido

```text
feat(ui): add responsive ejs demo interface
```
