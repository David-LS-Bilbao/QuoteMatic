# QuoteMatic API Contract — React & KMP

Documento vivo del contrato API de QuoteMatic para clientes externos:

- **QuoteMatic-Web React** en local.
- **QuoteMatic Mobile KMP** en fase posterior.

Backend base:

```text
https://quotematic.davlos.es
```

Swagger:

```text
https://quotematic.davlos.es/api-docs/
```

---

## 1. Objetivo

Esta API debe permitir que QuoteMatic funcione como backend REST para:

1. Un frontend React independiente.
2. Una app Android/iOS con Kotlin Multiplatform.
3. El frontend EJS/admin actual, sin romper compatibilidad.

La lógica de negocio permanece en el backend Node.js/Express/MongoDB. Los clientes React y KMP solo consumen la API.

---

## 2. Autenticación

QuoteMatic usa sesiones con cookie, no JWT.

Cookie principal:

```text
connect.sid
```

Configuración esperada en producción/demo:

```text
HttpOnly
Secure
SameSite=None
```

Esto permite que React local consuma la API remota usando cookies cross-origin.

---

## 3. CORS para React local

Origen React local previsto:

```text
http://localhost:5173
http://127.0.0.1:5173
```

El backend debe responder con:

```text
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
```

En React, todas las peticiones autenticadas deben usar:

```ts
credentials: "include"
```

Ejemplo:

```ts
fetch("https://quotematic.davlos.es/api/auth/me", {
  credentials: "include",
});
```

---

## 4. Endpoints de Auth JSON

Los endpoints JSON para clientes externos viven bajo:

```text
/api/auth
```

No sustituyen a las rutas EJS existentes `/auth/*`.

### 4.1 Register

```http
POST /api/auth/register
```

Body:

```json
{
  "name": "David",
  "email": "david@example.com",
  "password": "test1234",
  "ageRange": "adult_18_plus"
}
```

Respuesta correcta:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "USER_ID",
      "role": "user",
      "ageGroup": "adult_18_plus"
    }
  }
}
```

Errores esperados:

```text
400 MISSING_FIELDS
400 INVALID_AGE_GROUP
403 AGE_RESTRICTED
409 EMAIL_TAKEN
500 INTERNAL_ERROR
```

### 4.2 Login

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "david@example.com",
  "password": "test1234"
}
```

Respuesta correcta:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "USER_ID",
      "role": "user",
      "ageGroup": "adult_18_plus"
    }
  }
}
```

La respuesta debe incluir `Set-Cookie` con `connect.sid`.

Errores esperados:

```text
400 MISSING_FIELDS
401 INVALID_CREDENTIALS
403 USER_INACTIVE
500 INTERNAL_ERROR
```

### 4.3 Me

```http
GET /api/auth/me
```

Con sesión activa:

```json
{
  "success": true,
  "authenticated": true,
  "data": {
    "user": {
      "id": "USER_ID",
      "role": "user",
      "ageGroup": "adult_18_plus"
    }
  }
}
```

Sin sesión activa:

```json
{
  "success": true,
  "authenticated": false,
  "data": null
}
```

### 4.4 Logout

```http
POST /api/auth/logout
```

Respuesta correcta:

```json
{
  "success": true
}
```

Nota: actualmente requiere sesión activa. Si no hay sesión, puede devolver `401`.

### 4.5 Admin check

```http
GET /api/auth/admin-check
```

Requiere:

```text
sesión activa + rol admin
```

Respuesta correcta:

```json
{
  "success": true,
  "message": "Admin access granted"
}
```

Errores esperados:

```text
401 AUTH_REQUIRED
403 ADMIN_REQUIRED
```

---

## 5. Endpoints públicos de catálogos

### 5.1 Authors

```http
GET /api/authors
```

Uso principal:

- cargar autores para filtros;
- obtener `author._id` para filtrar frases por autor.

### 5.2 Situations

```http
GET /api/situations
```

Uso principal:

- cargar situaciones;
- usar `situation.slug` para filtros.

### 5.3 Quote types

```http
GET /api/quote-types
```

Uso principal:

- cargar tipos de frase;
- usar `quoteType.slug` para filtros.

---

## 6. Endpoints públicos de frases

### 6.1 Listar frases

```http
GET /api/quotes
```

Query params soportados:

| Param | Tipo | Descripción |
|---|---|---|
| `situation` | string | Slug de situación |
| `quoteType` | string | Slug de tipo de frase |
| `contentRating` | `all`, `teen`, `adult` | Clasificación de contenido |
| `author` | ObjectId | ID MongoDB del autor |
| `search` | string | Búsqueda por texto, 2 a 100 caracteres |
| `page` | number | Página, mínimo 1 |
| `limit` | number | Resultados por página, 1 a 100 |

Valores por defecto:

```text
page=1
limit=20
```

Ejemplo:

```http
GET /api/quotes?situation=trabajo&quoteType=motivational&page=1&limit=20
```

Respuesta correcta:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```

Reglas:

```text
slug inexistente → 404
author con formato inválido → 400
author inexistente/inactivo → 404
contentRating inválido → 400
page inválida → 400
limit inválido → 400
search demasiado corto/largo → 400
filtro válido sin resultados → 200 + data: [] + total: 0
```

### 6.2 Frase(s) aleatoria(s)

```http
GET /api/quotes/random
```

Query params soportados:

```text
count         — integer 1–50 (opcional). Sin count o count=1 → objeto. count>1 → array.
situation     — slug de Situation activa
quoteType     — slug de QuoteType activo
contentRating — "all" | "teen" | "adult"
```

#### Sin `count` — comportamiento original (objeto único)

```http
GET /api/quotes/random
GET /api/quotes/random?situation=trabajo&quoteType=motivational
```

Respuesta `200`:

```json
{
  "success": true,
  "data": {
    "_id": "QUOTE_ID",
    "text": "Texto de la frase"
  }
}
```

#### Con `count > 1` — pool aleatorio (array + meta)

```http
GET /api/quotes/random?count=10
GET /api/quotes/random?count=5&situation=trabajo&contentRating=all
```

Respuesta `200`:

```json
{
  "success": true,
  "data": [
    { "_id": "QUOTE_ID_1", "text": "..." },
    { "_id": "QUOTE_ID_2", "text": "..." }
  ],
  "meta": {
    "count": 10,
    "returned": 10
  }
}
```

> Si hay menos frases disponibles que `count`, `returned` será menor que `count`.

Errores:

```text
400 count must be an integer between 1 and 50
400 Invalid contentRating. Allowed values: all, teen, adult
404 Quote type not found
404 Situation not found
404 No active quotes found
```

### 6.3 Detalle de frase

```http
GET /api/quotes/:id
```

Respuesta correcta:

```json
{
  "success": true,
  "data": {
    "_id": "QUOTE_ID",
    "text": "Texto de la frase"
  }
}
```

Errores esperados:

```text
400 Invalid quote id
404 Quote not found
```

---

## 7. Favoritos

Los favoritos requieren sesión activa.

### 7.1 Mis favoritos

```http
GET /api/favorites/me
```

### 7.2 Añadir favorito

```http
POST /api/favorites/:quoteId
```

### 7.3 Eliminar favorito

```http
DELETE /api/favorites/:quoteId
```

Nota: en la versión actual, favoritos aplica sobre frases públicas.

---

## 8. Frases privadas del usuario

Los endpoints de frases privadas viven bajo:

```text
/api/me/quotes
```

Todos requieren sesión activa. El backend obtiene el propietario desde `req.session.userId`; el cliente nunca debe enviar `ownerUserId`.

Regla de seguridad:

```text
Toda operación por id se filtra por ownerUserId + isActive.
Si la frase no pertenece al usuario autenticado, la API devuelve 404.
```

### 8.1 Listar mis frases privadas

```http
GET /api/me/quotes
```

Query params soportados:

| Param | Tipo | Descripción |
|---|---|---|
| `situation` | string | Slug de situación, opcional |
| `quoteType` | string | Slug de tipo de frase, opcional |
| `contentRating` | `all`, `teen`, `adult` | Clasificación de contenido, opcional |
| `search` | string | Búsqueda por texto, 2 a 100 caracteres |
| `page` | number | Página, mínimo 1 |
| `limit` | number | Resultados por página, 1 a 100 |

Valores por defecto:

```text
page=1
limit=20
```

Respuesta correcta:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### 8.2 Crear frase privada

```http
POST /api/me/quotes
```

Body mínimo:

```json
{
  "text": "Mi frase privada",
  "contentRating": "all",
  "sourceType": "original"
}
```

Body con categorías opcionales:

```json
{
  "text": "Mi frase privada",
  "authorText": "Yo mismo",
  "situation": "trabajo",
  "quoteType": "motivational",
  "language": "es",
  "contentRating": "all",
  "sourceType": "original",
  "sourceReference": "Mi diario"
}
```

Notas:

- `situation` y `quoteType` se envían como `slug`, no como ObjectId.
- `authorText` es texto libre.
- `ownerUserId` lo asigna el servidor desde la sesión.
- Si el mismo usuario crea otra frase con el mismo texto normalizado, la API devuelve `409`.

Respuesta correcta:

```json
{
  "success": true,
  "data": {
    "_id": "USER_QUOTE_ID",
    "text": "Mi frase privada",
    "ownerUserId": "USER_ID",
    "isActive": true
  }
}
```

Errores esperados:

```text
400 payload inválido
401 sesión requerida
404 slug de situation o quoteType no encontrado
409 texto duplicado para este usuario
500 error interno
```

### 8.3 Frase privada aleatoria

```http
GET /api/me/quotes/random
```

Query params soportados:

```text
situation
quoteType
contentRating
```

Respuesta correcta:

```json
{
  "success": true,
  "data": {
    "_id": "USER_QUOTE_ID",
    "text": "Mi frase privada"
  }
}
```

Si el usuario no tiene frases privadas activas para el filtro indicado, devuelve `404`.

### 8.4 Detalle de frase privada

```http
GET /api/me/quotes/:id
```

Respuesta correcta:

```json
{
  "success": true,
  "data": {
    "_id": "USER_QUOTE_ID",
    "text": "Mi frase privada"
  }
}
```

Errores esperados:

```text
400 id inválido
401 sesión requerida
404 frase no encontrada o no pertenece al usuario
```

### 8.5 Actualizar frase privada

```http
PUT /api/me/quotes/:id
```

Body parcial:

```json
{
  "text": "Texto actualizado",
  "contentRating": "teen",
  "situation": "trabajo",
  "quoteType": "stoic"
}
```

Reglas:

- Si se actualiza `text`, el backend recalcula `textNormalized`.
- No se acepta `ownerUserId` desde el cliente.
- `situation` y `quoteType` se actualizan por `slug`.

Errores esperados:

```text
400 payload o id inválido
401 sesión requerida
404 frase no encontrada o no pertenece al usuario
409 texto duplicado para este usuario
500 error interno
```

### 8.6 Borrar frase privada

```http
DELETE /api/me/quotes/:id
```

El borrado es lógico: el backend marca `isActive=false`.

Respuesta correcta:

```json
{
  "success": true,
  "data": {
    "_id": "USER_QUOTE_ID",
    "isActive": false
  }
}
```

Errores esperados:

```text
400 id inválido
401 sesión requerida
404 frase no encontrada o no pertenece al usuario
```

---

## 9. Ejemplos curl

### Login guardando cookie

```bash
curl -i -sc /tmp/qm_cookie.txt -X POST https://quotematic.davlos.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"test1234"}'
```

### Consultar sesión

```bash
curl -i -sb /tmp/qm_cookie.txt https://quotematic.davlos.es/api/auth/me
```

### Logout

```bash
curl -i -sb /tmp/qm_cookie.txt -X POST https://quotematic.davlos.es/api/auth/logout
```

### Listar frases públicas paginadas

```bash
curl -s "https://quotematic.davlos.es/api/quotes?page=1&limit=20"
```

### Filtrar frases públicas por situación

```bash
curl -s "https://quotematic.davlos.es/api/quotes?situation=trabajo"
```

### Filtrar frases públicas por tipo

```bash
curl -s "https://quotematic.davlos.es/api/quotes?quoteType=motivational"
```

### Buscar frases públicas por texto

```bash
curl -s "https://quotematic.davlos.es/api/quotes?search=vida"
```

### Crear frase privada

```bash
curl -s -X POST "https://quotematic.davlos.es/api/me/quotes" \
  -b /tmp/qm_cookie.txt \
  -H "Content-Type: application/json" \
  -d '{"text":"Mi frase privada","contentRating":"all","sourceType":"original"}'
```

### Listar mis frases privadas

```bash
curl -s "https://quotematic.davlos.es/api/me/quotes" \
  -b /tmp/qm_cookie.txt
```

### Frase privada aleatoria

```bash
curl -s "https://quotematic.davlos.es/api/me/quotes/random" \
  -b /tmp/qm_cookie.txt
```

---

## 10. Ejemplo fetch para React

```ts
const API_BASE_URL = "https://quotematic.davlos.es";

export async function getCurrentSession() {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error checking session");
  }

  return response.json();
}
```

Login:

```ts
export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? "Login error");
  }

  return json;
}
```

Crear frase privada:

```ts
export async function createMyQuote(text: string) {
  const response = await fetch(`${API_BASE_URL}/api/me/quotes`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      contentRating: "all",
      sourceType: "original",
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? "Error creating private quote");
  }

  return json;
}
```

---

## 11. Nota para Kotlin Multiplatform

La futura app móvil no hablará con MongoDB directamente.

Arquitectura prevista:

```text
KMP shared
  ↓
Ktor Client
  ↓
QuoteMatic REST API
  ↓
Node.js + Express + MongoDB
```

La autenticación móvil v1 usará cookie de sesión, igual que React.

Pendiente de validar en KMP:

```text
Ktor Client cookie storage
persistencia de sesión
logout y limpieza de cookie
manejo de 401/403
```

---

## 12. Pendientes de API

Pendientes antes de considerar estable el contrato para KMP:

1. Validar favoritos desde React local.
2. Decidir si logout debe ser idempotente.
3. Importación CSV admin.
4. Revisar Swagger completo tras nuevas features.
5. Definir contrato final de errores.
6. Añadir tests automatizados backend si se amplía el proyecto.

---

## 13. Estado de hitos

```text
[OK] /api/auth/* JSON
[OK] CORS para React local
[OK] Cookies cross-origin
[OK] /api/quotes con filtros y paginación
[OK] /api/me/quotes CRUD privado
[PENDIENTE] CSV admin import
[PENDIENTE] React local validando flujo completo
[PENDIENTE] KMP Mobile
```
