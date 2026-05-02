# QuoteMatic - Control de Features y Diario de Desarrollo

Documento de seguimiento para el desarrollo de **QuoteMatic** con **TypeScript + Express + MongoDB + EJS + MVC pragmático**.

Sirve para registrar features, avances, complicaciones, decisiones técnicas, pruebas, commits y aprendizajes.

---

## 1. Información general

| Campo | Valor |
|---|---|
| Proyecto | QuoteMatic |
| Tipo | Backend con minifront EJS |
| Stack | Node.js, Express, TypeScript, MongoDB, Mongoose, EJS |
| Arquitectura | MVC pragmática con services simples |
| Rama estable | `main` |
| Rama integración | `dev` |
| Estado | Sprint 01 completado; Sprint 02 pendiente |

---

## 2. Estado global

| Área | Estado | Notas |
|---|---|---|
| Setup TypeScript | Finalizado | `tsconfig`, scripts, estructura base |
| Express + EJS | Finalizado | App base, landing y assets |
| MongoDB/Mongoose | Finalizado | Conexión preparada con `MONGODB_URI` |
| Auth | Pendiente | Registro, login, logout |
| Sesiones | Pendiente | `express-session` + `connect-mongo` |
| Roles | Pendiente | `user` y `admin` |
| Control edad | Pendiente | <14 bloqueado, 14-17 filtrado |
| Modelos | Pendiente | User, Author, Quote, etc. |
| Seed | Pendiente | Admin + datos iniciales |
| Dashboard usuario | Pendiente | Selectores + quote card |
| MiniFront | Pendiente | CSS, tarjetas, animación suave |
| Favoritos | Pendiente | Guardar y eliminar |
| Admin CRUD | Pendiente | Autores, frases, situaciones, tipos |
| ImportCandidate | Bonus | Flujo admin con APIs externas |
| Documentación | En progreso | README principal y docs Sprint 01 actualizados |

Estados sugeridos: `Pendiente`, `En progreso`, `Bloqueado`, `En revisión`, `Finalizado`, `Descartado`.

---

## 3. Backlog de features

| ID | Feature | Prioridad | Rama sugerida | Estado | Notas |
|---|---|---:|---|---|---|
| F01 | Setup TypeScript + Express | Alta | `feat/typescript-project-setup` | Finalizado | Base técnica completada |
| F02 | Configurar EJS y assets | Alta | `feat/typescript-project-setup` | Finalizado | Landing, view engine y assets publicos |
| F03 | Conexión MongoDB | Alta | `feat/typescript-project-setup` | Finalizado | Mongoose + `.env.example` + Docker MongoDB |
| F04 | Health route | Alta | `feat/typescript-project-setup` | Finalizado | `GET /health` |
| F05 | Tipos de dominio | Alta | `feat/models-seed` | Pendiente | UserRole, AgeGroup, etc. |
| F06 | Modelos Mongoose | Alta | `feat/models-seed` | Pendiente | User, Quote, Author... |
| F07 | Seed inicial | Alta | `feat/models-seed` | Pendiente | Admin + frases |
| F08 | Age gate | Alta | `feat/auth` | Pendiente | Bloqueo <14 |
| F09 | Registro | Alta | `feat/auth` | Pendiente | bcrypt + validación |
| F10 | Login/logout | Alta | `feat/auth` | Pendiente | sesiones |
| F11 | Middlewares auth/role | Alta | `feat/auth` | Pendiente | rutas protegidas |
| F12 | Dashboard usuario | Alta | `feat/user-dashboard` | Pendiente | selectores |
| F13 | Servicio de búsqueda de frase | Alta | `feat/user-dashboard` | Pendiente | filtro edad + tipo |
| F14 | Quote card UI | Media | `feat/minifront-ui` | Pendiente | presentación visual |
| F15 | Favoritos | Media | `feat/favorites` | Pendiente | guardar/eliminar |
| F16 | Admin dashboard | Alta | `feat/admin-crud` | Pendiente | índice admin |
| F17 | CRUD Author | Alta | `feat/admin-crud` | Pendiente | completo |
| F18 | CRUD Quote | Alta | `feat/admin-crud` | Pendiente | completo |
| F19 | CRUD Situation | Media | `feat/admin-crud` | Pendiente | completo |
| F20 | CRUD QuoteType | Media | `feat/admin-crud` | Pendiente | completo |
| F21 | CSS demo | Media | `feat/minifront-ui` | Pendiente | gradiente + animación |
| F22 | ImportCandidate | Bonus | `feat/import-candidates` | Pendiente | staging |
| F23 | Búsqueda API admin | Bonus | `feat/import-candidates` | Pendiente | no runtime usuario |
| F24 | README + memoria | Alta | `docs/readme-memoria` | En progreso | README principal e informes Sprint 01 creados |
| F25 | Integración final | Alta | `test/final-integration` | Pendiente | pruebas end-to-end manuales |

---

## 4. Plantilla por feature

```md
## Feature FXX - Nombre

| Campo | Valor |
|---|---|
| Rama | `feat/...` |
| Fecha inicio | YYYY-MM-DD |
| Fecha fin | Pendiente |
| Estado | Pendiente |
| Prioridad | Alta/Media/Baja |

### Objetivo

### Alcance incluido

- [ ] 

### Fuera de alcance

- 

### Archivos previstos

```txt
src/...
```

### Decisiones técnicas

- 

### Avances

| Fecha | Avance | Commit/PR |
|---|---|---|

### Complicaciones

| Fecha | Problema | Causa | Solución | Estado |
|---|---|---|---|---|

### Pruebas

- [ ] Funciona en navegador.
- [ ] Funciona en MongoDB.
- [ ] No rompe rutas existentes.
- [ ] `npm run typecheck` pasa.
- [ ] Se actualiza diario si aplica.

### Checklist cierre

- [ ] Feature terminada.
- [ ] Código revisado.
- [ ] Commit pequeño.
- [ ] PR hacia `dev` preparada.
- [ ] Documentación actualizada si aplica.
```

---

## 5. Registro de decisiones técnicas

| ID | Fecha | Decisión | Motivo | Alternativas | Impacto |
|---|---|---|---|---|---|
| D01 | 2026-04-29 | Usar TypeScript | Mejor aprendizaje y portfolio | JS puro | Más configuración, más robustez |
| D02 | 2026-04-29 | Usar MVC pragmático | Separación clara | Código todo en rutas | Más mantenible |
| D03 | 2026-04-29 | Usar EJS como minifront | Demo visual sin React | API-only | Más defendible en clase |
| D04 | Pendiente | Usar sessions | Mejor con vistas EJS | JWT | Se decidirá en sprint de auth |
| D05 | 2026-04-29 | MongoDB manda | Evitar dependencia externa | API runtime | Demo estable |
| D06 | Pendiente | Services simples | Encapsular lógica | Controllers gigantes | Se aplicará cuando exista lógica de negocio |

---

## 6. Diario de desarrollo

### Día 01 - 2026-04-29

#### Objetivo

- Completar el setup técnico base del Sprint 01.
- Dejar una app Express + TypeScript + EJS preparada para crecer en siguientes sprints.

#### Trabajo realizado

- Inicialización de proyecto Node.js.
- Configuración TypeScript.
- Configuración Express separando `app.ts` y `server.ts`.
- Configuración EJS y landing inicial en `GET /`.
- Endpoint `GET /health`.
- Configuración MongoDB con Mongoose.
- Docker Compose para MongoDB local.
- Scripts npm para desarrollo, typecheck, build, start, clean y copia de assets.
- Documentación Sprint 01 y README principal.

#### Archivos tocados

```txt
README.md
package.json
package-lock.json
tsconfig.json
docker-compose.yml
.env.example
.gitignore
src/app.ts
src/server.ts
src/config/database.ts
src/controllers/home.controller.ts
src/controllers/health.controller.ts
src/routes/index.routes.ts
src/routes/health.routes.ts
src/views/index.ejs
src/public/styles.css
docs/sprints/SPRINT_01_SETUP_REPORT.md
docs/sprints/SPRINT_01_QA_CHECKLIST.md
docs/sprints/SPRINT_01_NEXT_STEPS.md
```

#### Problemas

- `tsconfig` inicial generado con configuración poco adecuada para backend.
- `moduleResolution Node` deprecado en TypeScript 6.
- Diferencia de nombres entre imports y archivos de rutas.
- `.env` creado accidentalmente dentro de `src`.
- `node_modules` subido accidentalmente durante el proceso.
- Necesidad de copiar `views` y `public` al build.

#### Soluciones

- Ajuste de TypeScript a `Node16`.
- Corrección de imports.
- Limpieza de archivos locales no versionables.
- Refuerzo de `.gitignore`.
- Scripts `copy:views`, `copy:public` y `copy:assets`.

#### Pruebas

- `npm run typecheck` correcto.
- `npm run build` correcto.
- Verificación de rutas `GET /` y `GET /health`.
- Verificación documental del Sprint 01.

#### Commits

```txt
ce2d43f chore(project): initialize node project
01ea593 chore(ts): configure typescript
e9cad47 feat(app): add express app with ejs
1565d5e feat(config): add mongodb connection setup
b9f4da9 chore(build): copy ejs and public assets
17424d7 chore(db): add mongodb docker compose
767419c docs(sprint): add sprint 01 documentation
```

#### Pendiente próximo día

- Iniciar Sprint 02 con tipos de dominio, modelos Mongoose y seed inicial.
- No mezclar todavía auth, CRUD completo ni lógica de recomendación.

#### Aprendizaje

- En proyectos TypeScript backend conviene ajustar el `tsconfig` al entorno Node desde el principio.
- Si se usan EJS y assets estáticos, el build debe copiar archivos no TypeScript a `dist`.
- La documentación por sprint ayuda a separar estado real de roadmap futuro.

---

### Día 02 - YYYY-MM-DD

#### Objetivo

- 

#### Trabajo realizado

- 

#### Archivos tocados

```txt

```

#### Problemas

- 

#### Soluciones

- 

#### Pruebas

- 

#### Commits

```txt

```

#### Pendiente próximo día

- 

#### Aprendizaje

- 

---

## 7. Checklist de pruebas manuales

| Área | Caso | Resultado | Notas |
|---|---|---|---|
| Setup | `/health` responde | Pendiente |  |
| Auth | Registro 18+ | Pendiente |  |
| Auth | Registro 14-17 | Pendiente |  |
| Auth | Registro <14 bloqueado | Pendiente |  |
| Auth | Login correcto | Pendiente |  |
| Auth | Login incorrecto | Pendiente |  |
| Roles | User entra en admin | Pendiente | Debe bloquear |
| Edad | Teen no ve adult | Pendiente |  |
| Frases | Buscar por situación/tipo | Pendiente |  |
| Favoritos | Guardar favorita | Pendiente |  |
| Favoritos | Eliminar favorita | Pendiente |  |
| Admin | Crear autor | Pendiente |  |
| Admin | Editar autor | Pendiente |  |
| Admin | Desactivar autor | Pendiente |  |
| Admin | Crear frase | Pendiente |  |
| Admin | Editar frase | Pendiente |  |
| Admin | Desactivar frase | Pendiente |  |
| TS | `npm run typecheck` | Pendiente |  |

---

## 8. Registro de problemas

| ID | Fecha | Problema | Dónde | Solución | Prevención |
|---|---|---|---|---|---|
| P01 | YYYY-MM-DD |  |  |  |  |

---

## 9. Registro de commits

| Fecha | Rama | Commit | Descripción | Validado |
|---|---|---|---|---|
| YYYY-MM-DD | `feat/...` | `hash` |  | No |

---

## 10. Checklist final de entrega

### Funcionalidad

- [ ] Registro funcional.
- [ ] Login funcional.
- [ ] Logout funcional.
- [ ] Password con bcrypt.
- [ ] Sesiones persistidas.
- [ ] Rol admin protegido.
- [ ] Bloqueo menor de 14.
- [ ] Filtro 14-17.
- [ ] Dashboard usuario.
- [ ] Quote card.
- [ ] Favoritos.
- [ ] CRUD admin de autores.
- [ ] CRUD admin de frases.
- [ ] CRUD admin de situaciones.
- [ ] CRUD admin de tipos.

### Técnico

- [ ] TypeScript configurado.
- [ ] `npm run typecheck` pasa.
- [ ] Modelos Mongoose definidos.
- [ ] Seed funcional.
- [ ] `.env.example` incluido.
- [ ] `.env` fuera de Git.
- [ ] Arquitectura MVC clara.

### Documentación

- [ ] README actualizado.
- [ ] Memoria técnica.
- [ ] Diagramas.
- [ ] Diario de desarrollo.
- [ ] Decisiones técnicas registradas.
- [ ] Problemas y soluciones registrados.

---

## 11. Convención Git

Ramas:

```txt
main
dev
feat/typescript-project-setup
feat/auth
feat/models-seed
feat/user-dashboard
feat/favorites
feat/admin-crud
feat/age-content-filter
feat/minifront-ui
feat/import-candidates
docs/readme-memoria
test/final-integration
```

Commits:

```txt
feat(auth): add login flow
feat(models): add quote schema
fix(age): prevent adult content for teen users
docs(readme): update TypeScript setup
```
