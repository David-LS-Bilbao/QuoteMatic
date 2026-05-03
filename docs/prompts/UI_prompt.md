Actúa como **Senior UI/UX Designer + Full-Stack Engineer Express/EJS + QA pragmático de bootcamp**.

Proyecto: **QuoteMatic**
Stack: **Node.js + Express + TypeScript + MongoDB + Mongoose + EJS + CSS propio**
Rama actual: `feat/ejs-responsive-ui` o la rama de UI correspondiente.

## Regla principal

Puedes modificar archivos locales del proyecto y ejecutar comandos locales, pero:

* No hagas push.
* No abras PR.
* No hagas merge.
* No modifiques `main` ni `dev` directamente.
* No añadas React.
* No añadas frameworks CSS.
* No añadas dependencias externas salvo que sea imprescindible y lo expliques antes.
* No cambies la lógica backend si no es necesario.
* No rompas API, auth, sesiones, favoritos ni Swagger.
* Antes de tocar archivos, revisa el estado del repo.

## Preflight obligatorio

Ejecuta primero:

```bash
git status --short
git branch --show-current
```

Si hay cambios sin commitear, revísalos y explícame qué archivos están modificados antes de actuar.

## Contexto funcional de QuoteMatic

QuoteMatic es una aplicación backend con minifront EJS para recomendar frases según:

1. **Situación del usuario**
2. **Tipo de frase**
3. **Reglas internas de edad/contenido**

El objetivo de la app es que el usuario pueda:

```txt
entrar → registrarse/login → ir al dashboard → elegir situación + tipo de frase → pedir frase → guardar favorito → ver favoritos
```

También debe poder:

```txt
admin → entrar a panel mínimo → ver accesos útiles → usar Swagger/API para gestionar quotes
```

El proyecto ya tiene:

* API REST de quotes.
* API de catálogos.
* API de favoritos.
* Auth con sesiones.
* Roles `user` y `admin`.
* Age gate.
* Swagger en `/api-docs`.
* Vistas EJS básicas.

## Documentación que debes revisar

Antes de rediseñar o corregir la UI, revisa estos archivos si existen:

```txt
README.md
docs/PROJECT_DIRECTION.md
docs/sprints/SPRINT_08_UI_REPORT.md
docs/sprints/SPRINT_08_QA_CHECKLIST.md
docs/sprints/SPRINT_08_NEXT_STEPS.md
src/routes/web.routes.ts
src/controllers/web/dashboard.controller.ts
src/controllers/web/favoritesPage.controller.ts
src/controllers/web/adminPage.controller.ts
src/public/app.js
src/public/styles.css
src/views/dashboard.ejs
src/views/favorites.ejs
src/views/admin.ejs
src/views/index.ejs
```

Si algún archivo no existe o tiene otro nombre, localiza la estructura real.

## Problema actual a corregir

El dashboard muestra un selector de:

```txt
Clasificación: All / Teen / Adult
```

Eso es incorrecto para la UI del usuario.

### Decisión de producto

`contentRating` es una regla interna del sistema, no un filtro visible para el usuario final.

El usuario NO debe elegir:

```txt
All / Teen / Adult
```

El dashboard debe mostrar:

```txt
Situación
Tipo de frase
```

Ejemplo correcto:

```txt
Situación: Trabajo
Tipo de frase: Motivacional
```

El control por edad debe aplicarse por detrás, según sesión/usuario:

```txt
sin login → contenido público/seguro
teen_14_17 → contenido apto para teen
adult_18_plus → contenido completo
```

Pero no debe aparecer como selector de UI.

## Objetivo de esta tarea

Rediseñar y corregir la interfaz EJS para que sea:

* funcional;
* clara;
* responsive;
* coherente con el producto;
* apta para demo en vivo;
* usable en móvil y escritorio.

No buscamos una UI de producto final SaaS, sino una demo profesional de bootcamp.

## Pantallas principales

### 1. Home `/`

Debe mostrar:

* nombre QuoteMatic;
* descripción clara;
* CTA a Dashboard;
* enlaces a Login/Register si no hay sesión;
* enlace a Favoritos si hay sesión;
* enlace a Admin si el usuario es admin;
* enlace a Swagger `/api-docs`;
* diseño limpio y responsive.

### 2. Dashboard `/dashboard`

Debe ser la pantalla principal de uso.

Debe mostrar:

* título claro: “Generador de frases”
* explicación breve;
* selector de **Situación**;
* selector de **Tipo de frase**;
* botón “Pedir frase”;
* tarjeta de resultado;
* frase con tamaño controlado;
* autor;
* situación;
* tipo de frase;
* botón “Guardar favorito”;
* mensaje claro si el usuario no está logueado.

No debe mostrar selector de `contentRating`.

### 3. Favoritos `/favorites`

Debe:

* requerir login;
* mostrar lista de favoritos del usuario;
* usar tarjetas;
* mostrar frase, autor, tipo y situación;
* permitir quitar favorito;
* mostrar estado vacío si no hay favoritos.

### 4. Admin `/admin`

Debe ser mínimo.

Debe:

* requerir rol admin;
* mostrar mensaje “Panel admin”;
* mostrar enlaces útiles:

  * Swagger;
  * API quotes;
  * Dashboard;
* mostrar tabla/lista básica de quotes si ya existe;
* no intentar construir un CRUD visual complejo salvo que ya esté casi hecho.

### 5. Auth

Mejorar visualmente, sin cambiar lógica:

```txt
/auth/login
/auth/register
```

Deben verse integradas con el estilo general.

## Navegación común

Crear o mejorar una navegación visual común en las páginas principales:

* Inicio
* Dashboard
* Favoritos
* API Docs
* Login/Register si no hay sesión
* Logout si hay sesión
* Admin si `role === "admin"`

No hace falta crear layout engine complejo si no existe. Se puede repetir un bloque simple en EJS si es más rápido para el MVP.

## Comportamiento esperado del dashboard

### Flujo sin sesión

* Puede ver dashboard.
* Puede pedir frase.
* Si intenta guardar favorito:

  * mostrar mensaje: “Inicia sesión para guardar favoritos.”
  * opcionalmente enlace a `/auth/login`.

### Flujo con sesión

* Puede pedir frase.
* Puede guardar favorito.
* Si ya está guardada, mostrar mensaje claro.

### Flujo admin

* Puede usar dashboard igual que usuario.
* Tiene enlace visible a `/admin`.

## Datos del dashboard

El dashboard debe obtener listas reales desde MongoDB o desde endpoints existentes:

* situaciones activas;
* tipos de frase activos.

No hardcodear opciones si ya existen modelos/endpoints.

Si por simplicidad se usan datos renderizados desde controlador EJS, correcto.

Si se usa JS en frontend llamando API, correcto.

Pero el resultado visible debe ser:

```txt
Situación + Tipo de frase
```

No:

```txt
Clasificación + Tipo
```

## API esperada

Revisa cómo funciona actualmente:

```txt
GET /api/quotes/random
GET /api/situations
GET /api/quote-types
POST /api/favorites/:quoteId
DELETE /api/favorites/:quoteId
GET /api/favorites/me
```

Si `/api/quotes/random` no soporta filtro por situación, evalúa el cambio mínimo para soportarlo.

Preferencia:

```txt
GET /api/quotes/random?situation=<id>&quoteType=<slug-or-id>
```

Pero no hagas un refactor grande.

Si necesitas cambiar API, hazlo de forma mínima, documenta el cambio y no rompas compatibilidad con llamadas actuales.

## Reglas de diseño

Usar solo:

```txt
EJS + CSS propio + JavaScript mínimo
```

No usar:

* React
* Bootstrap
* Tailwind
* librerías externas
* animaciones pesadas

Estilo deseado:

* fondo oscuro elegante o gradiente suave;
* tarjetas limpias;
* buena jerarquía visual;
* botones claros;
* tipografía legible;
* contraste suficiente;
* responsive mobile-first;
* frase con tamaño elegante, no gigante;
* spacing consistente.

## Archivos que puedes modificar

```txt
src/views/index.ejs
src/views/dashboard.ejs
src/views/favorites.ejs
src/views/admin.ejs
src/views/auth/login.ejs
src/views/auth/register.ejs
src/public/styles.css
src/public/app.js
src/controllers/home.controller.ts
src/controllers/web/dashboard.controller.ts
src/controllers/web/favoritesPage.controller.ts
src/controllers/web/adminPage.controller.ts
src/routes/web.routes.ts
README.md
docs/sprints/SPRINT_08_UI_REPORT.md
docs/sprints/SPRINT_08_QA_CHECKLIST.md
docs/sprints/SPRINT_08_NEXT_STEPS.md
```

Solo toca controladores API si es imprescindible para que el filtro de situación funcione.

No toques modelos salvo que detectes un error crítico.

## Validaciones obligatorias

Ejecuta:

```bash
npm run typecheck
npm run build
```

Después indica cómo probar con:

```bash
npm run dev
```

Probar manualmente en navegador:

```txt
/
 /dashboard
/auth/register
/auth/login
/favorites
/admin
/api-docs
```

## Casos de prueba obligatorios

### Usuario sin sesión

* `/` carga.
* `/dashboard` carga.
* Puede pedir frase.
* No puede guardar favorito; recibe mensaje claro.
* `/favorites` redirige a login.
* `/admin` redirige o bloquea.

### Usuario normal

* Puede login.
* Puede dashboard.
* Puede pedir frase.
* Puede guardar favorito.
* Puede ver favoritos.
* Puede quitar favorito.
* No puede entrar en admin.

### Admin

* Puede login.
* Puede entrar en `/admin`.
* Puede ver enlaces útiles.
* API/Swagger siguen funcionando.

## Resultado esperado

Al terminar, devuélveme:

1. Archivos modificados.
2. Cambios visuales realizados.
3. Cambios funcionales realizados.
4. Si cambiaste API o no.
5. Resultado de `npm run typecheck`.
6. Resultado de `npm run build`.
7. Rutas probadas.
8. Limitaciones pendientes.
9. Checklist antes de commit.

No hagas commit ni push.
