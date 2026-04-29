# QuoteMatic

**QuoteMatic** es una aplicación backend con **Node.js, Express, TypeScript, MongoDB, Mongoose y EJS**. Su objetivo es recomendar frases según la situación del usuario, el tipo de frase seleccionado y el rango de edad declarado.

El proyecto se plantea como entrega individual del módulo de Backend del bootcamp Full Stack, con foco en calidad, seguridad, organización MVC y documentación.

---

## 1. Enfoque del proyecto

QuoteMatic combina backend y un minifront sencillo:

- Backend principal con Express y TypeScript.
- MongoDB como fuente principal de datos.
- Mongoose para modelos y relaciones.
- Vistas EJS para login, registro, dashboard de usuario y dashboard admin.
- CSS propio para una interfaz agradable de demo.
- Arquitectura tipo MVC, con services sencillos cuando aporten claridad.

No es un proyecto React. La parte visual será deliberadamente pequeña para no desviar el objetivo del módulo backend.

---

## 2. Objetivo académico

Demostrar dominio de:

- Autenticación y sesiones.
- Autorización por roles.
- Control de acceso por edad.
- CRUD completo.
- Modelado de datos con MongoDB.
- Relaciones con Mongoose.
- Vistas renderizadas en servidor.
- TypeScript aplicado de forma pragmática.
- Separación de responsabilidades tipo MVC.
- Documentación técnica y trazabilidad.

---

## 3. Stack técnico

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- EJS
- express-session
- connect-mongo
- bcrypt
- dotenv
- method-override
- tsx
- JSDoc opcional para funciones principales

---

## 4. Funcionalidades principales

### Usuario

- Registro.
- Login.
- Logout.
- Dashboard con selectores básicos.
- Selección de situación.
- Selección de tipo de frase.
- Visualización de frase recomendada.
- Guardado de frases favoritas.
- Listado y eliminación de favoritas.

### Control por edad

- Menores de 14 años: no pueden registrarse.
- Usuarios de 14 a 17 años: solo ven contenido `all` y `teen`.
- Usuarios de 18 años o más: pueden ver contenido `all`, `teen` y `adult`.

No se almacena fecha de nacimiento ni documentación personal. Solo se guarda el rango de edad declarado.

### Admin

- Dashboard de administración.
- CRUD de autores.
- CRUD de frases.
- CRUD de situaciones.
- CRUD de tipos de frase.
- Activación/desactivación de contenido.
- Revisión de estado de verificación.

### Bonus

- Búsqueda de autores/frases desde APIs externas.
- Guardado de candidatos en `ImportCandidate`.
- Revisión y aceptación manual desde el panel admin.

---

## 5. MiniFront previsto

Vistas EJS principales:

```txt
views/
  layouts/
    main.ejs
  pages/
    home.ejs
    age-gate.ejs
    dashboard.ejs
  auth/
    register.ejs
    login.ejs
  quotes/
    result.ejs
    favorites.ejs
  admin/
    dashboard.ejs
    quotes-list.ejs
    quote-form.ejs
    authors-list.ejs
    author-form.ejs
    import.ejs
```

La interfaz será sencilla pero cuidada:

- Fondo degradado o imagen suave.
- Tarjetas para frases.
- Formularios claros.
- Botones con hover.
- Animación simple `fade-in` o `slide-up`.
- Dashboard admin funcional, no complejo.

---

## 6. Arquitectura MVC pragmática

Flujo principal:

```txt
Route -> Middleware -> Controller -> Service -> Model -> MongoDB
                         ↓
                       View EJS
```

Responsabilidades:

- `routes/`: define URLs y middlewares.
- `controllers/`: gestiona request/response, render y redirect.
- `services/`: contiene lógica de negocio reutilizable.
- `models/`: define esquemas Mongoose.
- `views/`: contiene pantallas EJS.
- `middlewares/`: protege rutas y aplica reglas transversales.
- `types/`: centraliza tipos del dominio y extensiones de sesión.

---

## 7. Estructura prevista

```txt
src/
  app.ts
  server.ts
  config/
    db.ts
  models/
    User.ts
    Author.ts
    Situation.ts
    QuoteType.ts
    Quote.ts
    Favorite.ts
    ImportCandidate.ts
  routes/
    auth.routes.ts
    dashboard.routes.ts
    quote.routes.ts
    favorite.routes.ts
    admin.routes.ts
    import.routes.ts
  controllers/
    auth.controller.ts
    dashboard.controller.ts
    quote.controller.ts
    favorite.controller.ts
    admin.controller.ts
    import.controller.ts
  services/
    auth.service.ts
    quote.service.ts
    favorite.service.ts
    admin.service.ts
    import.service.ts
  middlewares/
    auth.middleware.ts
    role.middleware.ts
    age.middleware.ts
    error.middleware.ts
  types/
    domain.types.ts
    express-session.d.ts
  utils/
    normalizeText.ts
  seeds/
    seed.ts
  views/
  public/
    css/
      styles.css

docs/
  diagrams.md
  memoria.md
.env.example
README.md
```

---

## 8. Colecciones principales

- `User`
- `Author`
- `Situation`
- `QuoteType`
- `Quote`
- `Favorite`
- `ImportCandidate` como bonus

---

## 9. Tipos principales

```ts
export type UserRole = "user" | "admin";
export type AgeGroup = "teen_14_17" | "adult_18_plus";
export type ContentRating = "all" | "teen" | "adult";
export type AuthorType = "real" | "historical" | "fictional" | "system" | "unknown";
export type VerificationStatus = "original" | "pending" | "manual_verified" | "rejected" | "disputed";
```

---

## 10. Rutas previstas

### Auth

```txt
GET    /auth/register
POST   /auth/register
GET    /auth/login
POST   /auth/login
POST   /auth/logout
```

### Usuario

```txt
GET    /
GET    /age-gate
GET    /dashboard
GET    /quotes/random
GET    /favorites
POST   /favorites
POST   /favorites/:id/delete
```

### Admin

```txt
GET    /admin
GET    /admin/quotes
GET    /admin/quotes/new
POST   /admin/quotes
GET    /admin/quotes/:id/edit
POST   /admin/quotes/:id/update
POST   /admin/quotes/:id/delete

GET    /admin/authors
GET    /admin/authors/new
POST   /admin/authors
GET    /admin/authors/:id/edit
POST   /admin/authors/:id/update
POST   /admin/authors/:id/delete
```

### Bonus importación

```txt
GET    /admin/import
POST   /admin/import/search
POST   /admin/import/save
POST   /admin/import/:id/accept
POST   /admin/import/:id/reject
```

---

## 11. Variables de entorno

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/quotematic
SESSION_SECRET=change_this_secret
NODE_ENV=development
```

---

## 12. Instalación prevista

```bash
npm install
cp .env.example .env
npm run seed
npm run dev
```

---

## 13. Scripts previstos

```json
{
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "seed": "tsx src/seeds/seed.ts",
  "typecheck": "tsc --noEmit"
}
```

---

## 14. Estrategia de datos

MongoDB será la fuente principal. Las frases iniciales se cargarán mediante seed local, con autores y contenido curado.

Las APIs externas, si se usan, serán solo para enriquecer datos desde el panel admin. El usuario final no dependerá de llamadas externas.

Flujo bonus:

```txt
API externa -> búsqueda admin -> ImportCandidate -> revisión humana -> MongoDB final -> usuario
```

---

## 15. Seguridad básica

- Contraseñas con `bcrypt`.
- Sesiones con `express-session`.
- Almacenamiento de sesión con `connect-mongo`.
- Rutas admin protegidas por rol.
- Filtro por edad desde backend.
- `.env` fuera del repositorio.
- Validación de formularios.
- Desactivación lógica cuando convenga.

---

## 16. Flujo Git recomendado

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

---

## 17. Estado actual

Proyecto en fase de planificación técnica actualizada.

Decisión actual:

```txt
QuoteMatic se desarrollará con TypeScript, Express, MongoDB, EJS y arquitectura MVC pragmática.
```
