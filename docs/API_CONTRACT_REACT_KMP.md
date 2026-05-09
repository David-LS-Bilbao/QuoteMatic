# QuoteMatic API Contract — React & KMP

Documento vivo del contrato API de QuoteMatic para clientes externos:

- **QuoteMatic-Web React** en local.
- **QuoteMatic Mobile KMP** en fase posterior.

Backend base:

```text
https://quotematic.davlos.es

Swagger:

https://quotematic.davlos.es/api-docs/
1. Objetivo

Esta API debe permitir que QuoteMatic funcione como backend REST para:

Un frontend React independiente.
Una app Android/iOS con Kotlin Multiplatform.
El frontend EJS/admin actual, sin romper compatibilidad.

La lógica de negocio permanece en el backend Node.js/Express/MongoDB.
Los clientes React y KMP solo consumen la API.

2. Autenticación

QuoteMatic usa sesiones con cookie, no JWT.

Cookie principal:

connect.sid

Configuración esperada en producción/demo:

HttpOnly
Secure
SameSite=None

Esto permite que React local consuma la API remota usando cookies cross-origin.

3. CORS para React local

Origen React local previsto:

http://localhost:5173
http://127.0.0.1:5173

El backend debe responder con:

Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true

En React, todas las peticiones autenticadas deben usar:

credentials: "include"

Ejemplo:

fetch("https://quotematic.davlos.es/api/auth/me", {
  credentials: "include",
});
4. Endpoints de Auth JSON

Los endpoints JSON para clientes externos viven bajo:

/api/auth

No sustituyen a las rutas EJS existentes /auth/*.

Register
POST /api/auth/register

Body:

{
  "name": "David",
  "email": "david@example.com",
  "password": "test1234",
  "ageRange": "adult_18_plus"
}

Respuesta correcta:

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

Errores esperados:

400 MISSING_FIELDS
400 INVALID_AGE_GROUP
403 AGE_RESTRICTED
409 EMAIL_TAKEN
500 INTERNAL_ERROR
Login
POST /api/auth/login

Body:

{
  "email": "david@example.com",
  "password": "test1234"
}

Respuesta correcta:

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

La respuesta debe incluir Set-Cookie con connect.sid.

Errores esperados:

400 MISSING_FIELDS
401 INVALID_CREDENTIALS
403 USER_INACTIVE
500 INTERNAL_ERROR
Me
GET /api/auth/me

Con sesión activa:

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

Sin sesión activa:

{
  "success": true,
  "authenticated": false,
  "data": null
}
Logout
POST /api/auth/logout

Respuesta correcta:

{
  "success": true
}

Nota: actualmente requiere sesión activa. Si no hay sesión, puede devolver 401.

Admin check
GET /api/auth/admin-check

Requiere:

sesión activa + rol admin

Respuesta correcta:

{
  "success": true,
  "message": "Admin access granted"
}

Errores esperados:

401 AUTH_REQUIRED
403 ADMIN_REQUIRED
5. Endpoints públicos de catálogos
Authors
GET /api/authors

Uso principal:

cargar autores para filtros;
obtener author._id para filtrar frases por autor.
Situations
GET /api/situations

Uso principal:

cargar situaciones;
usar situation.slug para filtros.
Quote types
GET /api/quote-types

Uso principal:

cargar tipos de frase;
usar quoteType.slug para filtros.
6. Endpoints públicos de frases
Listar frases
GET /api/quotes

Query params soportados:

Param	Tipo	Descripción
situation	string	Slug de situación
quoteType	string	Slug de tipo de frase
contentRating	all, teen, adult	Clasificación de contenido
author	ObjectId	ID MongoDB del autor
search	string	Búsqueda por texto, 2 a 100 caracteres
page	number	Página, mínimo 1
limit	number	Resultados por página, 1 a 100

Valores por defecto:

page=1
limit=20

Ejemplo:

GET /api/quotes?situation=trabajo&quoteType=motivational&page=1&limit=20

Respuesta correcta:

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

Reglas:

slug inexistente → 404
author con formato inválido → 400
author inexistente/inactivo → 404
contentRating inválido → 400
page inválida → 400
limit inválido → 400
search demasiado corto/largo → 400
filtro válido sin resultados → 200 + data: [] + total: 0
Frase aleatoria
GET /api/quotes/random

Query params soportados:

situation
quoteType
contentRating

Ejemplo:

GET /api/quotes/random?situation=trabajo&quoteType=motivational

Respuesta correcta:

{
  "success": true,
  "data": {
    "_id": "QUOTE_ID",
    "text": "Texto de la frase"
  }
}
Detalle de frase
GET /api/quotes/:id

Respuesta correcta:

{
  "success": true,
  "data": {
    "_id": "QUOTE_ID",
    "text": "Texto de la frase"
  }
}

Errores esperados:

400 Invalid quote id
404 Quote not found
7. Favoritos

Los favoritos requieren sesión activa.

Mis favoritos
GET /api/favorites/me
Añadir favorito
POST /api/favorites/:quoteId
Eliminar favorito
DELETE /api/favorites/:quoteId

Nota: en la versión actual, favoritos aplica sobre frases públicas.

8. Ejemplos curl
Login guardando cookie
curl -i -sc /tmp/qm_cookie.txt -X POST https://quotematic.davlos.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"test1234"}'
Consultar sesión
curl -i -sb /tmp/qm_cookie.txt https://quotematic.davlos.es/api/auth/me
Logout
curl -i -sb /tmp/qm_cookie.txt -X POST https://quotematic.davlos.es/api/auth/logout
Listar frases paginadas
curl -s "https://quotematic.davlos.es/api/quotes?page=1&limit=20"
Filtrar por situación
curl -s "https://quotematic.davlos.es/api/quotes?situation=trabajo"
Filtrar por tipo
curl -s "https://quotematic.davlos.es/api/quotes?quoteType=motivational"
Buscar texto
curl -s "https://quotematic.davlos.es/api/quotes?search=vida"
9. Ejemplo fetch para React
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

Login:

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
10. Nota para Kotlin Multiplatform

La futura app móvil no hablará con MongoDB directamente.

Arquitectura prevista:

KMP shared
  ↓
Ktor Client
  ↓
QuoteMatic REST API
  ↓
Node.js + Express + MongoDB

La autenticación móvil v1 usará cookie de sesión, igual que React.

Pendiente de validar en KMP:

Ktor Client cookie storage
persistencia de sesión
logout y limpieza de cookie
manejo de 401/403
11. Pendientes de API

Pendientes antes de considerar estable el contrato para KMP:

1. CRUD privado de frases por usuario: /api/me/quotes
2. Validar favoritos desde React local.
3. Decidir si logout debe ser idempotente.
4. Importación CSV admin.
5. Revisar Swagger completo tras nuevas features.
6. Definir contrato final de errores.
12. Estado de hitos
[OK] /api/auth/* JSON
[OK] CORS para React local
[OK] Cookies cross-origin
[OK] /api/quotes con filtros y paginación
[PENDIENTE] /api/me/quotes CRUD privado
[PENDIENTE] CSV admin import
[PENDIENTE] React local validando flujo completo
[PENDIENTE] KMP Mobile

