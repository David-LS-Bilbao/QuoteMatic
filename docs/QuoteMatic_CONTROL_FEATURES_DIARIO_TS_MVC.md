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
| Estado | Planificación actualizada |

---

## 2. Estado global

| Área | Estado | Notas |
|---|---|---|
| Setup TypeScript | Pendiente | `tsconfig`, scripts, estructura |
| Express + EJS | Pendiente | App base y layout |
| MongoDB/Mongoose | Pendiente | Conexión tipada |
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
| Documentación | En progreso | README e informe actualizados |

Estados sugeridos: `Pendiente`, `En progreso`, `Bloqueado`, `En revisión`, `Finalizado`, `Descartado`.

---

## 3. Backlog de features

| ID | Feature | Prioridad | Rama sugerida | Estado | Notas |
|---|---|---:|---|---|---|
| F01 | Setup TypeScript + Express | Alta | `feat/typescript-project-setup` | Pendiente | Base técnica |
| F02 | Configurar EJS y assets | Alta | `feat/typescript-project-setup` | Pendiente | Layout + public/css |
| F03 | Conexión MongoDB | Alta | `feat/typescript-project-setup` | Pendiente | Mongoose + `.env` |
| F04 | Health route | Alta | `feat/typescript-project-setup` | Pendiente | `/health` |
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
| F24 | README + memoria | Alta | `docs/readme-memoria` | En progreso | actualizar durante el proyecto |
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
| D01 | YYYY-MM-DD | Usar TypeScript | Mejor aprendizaje y portfolio | JS puro | Más configuración, más robustez |
| D02 | YYYY-MM-DD | Usar MVC pragmático | Separación clara | Código todo en rutas | Más mantenible |
| D03 | YYYY-MM-DD | Usar EJS como minifront | Demo visual sin React | API-only | Más defendible en clase |
| D04 | YYYY-MM-DD | Usar sessions | Mejor con vistas EJS | JWT | Más simple para MVP |
| D05 | YYYY-MM-DD | MongoDB manda | Evitar dependencia externa | API runtime | Demo estable |
| D06 | YYYY-MM-DD | Services simples | Encapsular lógica | Controllers gigantes | Mejor transición a proyectos pro |

---

## 6. Diario de desarrollo

### Día 01 - YYYY-MM-DD

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
