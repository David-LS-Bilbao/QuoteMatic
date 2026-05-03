# APIs Externas — QuoteMatic

Documentación de las APIs externas integradas en el proyecto.

---

## Dónde se usan

Únicamente en el panel de administración, ruta `/admin/import`.

Las llamadas se realizan **server-side** desde el controlador:

```
src/controllers/web/adminImport.controller.ts
```

No se llaman desde el cliente ni desde el dashboard de usuario.

---

## 1. Open Library — Autores reales e históricos

**URL base:** `https://openlibrary.org`

**Endpoint usado:**

```
GET https://openlibrary.org/search/authors.json?q=<query>&limit=10
```

**Parámetros:**

| Parámetro | Tipo   | Descripción                        |
|-----------|--------|------------------------------------|
| `q`       | string | Nombre del autor a buscar          |
| `limit`   | number | Máximo de resultados (usamos `10`) |

**Ejemplo de petición:**

```
GET https://openlibrary.org/search/authors.json?q=Marcus+Aurelius&limit=10
```

**Ejemplo de respuesta:**

```json
{
  "numFound": 3,
  "docs": [
    {
      "key": "/authors/OL168167A",
      "name": "Marcus Aurelius",
      "top_work": "Meditations",
      "birth_date": "121",
      "death_date": "180"
    }
  ]
}
```

**Campos usados en QuoteMatic:**

| Campo de la API | Campo en Author         | Notas                                      |
|-----------------|-------------------------|--------------------------------------------|
| `name`          | `name`                  |                                            |
| `top_work`      | `sourceWork`            | Obra principal del autor                   |
| `birth_date`    | `description` (display) | Solo para mostrar en resultados            |
| `death_date`    | `description` (display) | Si existe → `authorType: "historical"`     |
| —               | `authorType`            | `"historical"` si hay `death_date`, si no `"real"` |
| —               | `sourceType`            | Siempre `"book"`                           |

**Autenticación:** Ninguna. API pública y gratuita.

**Timeout aplicado:** 8 segundos (`AbortSignal.timeout(8000)`).

**Sitio oficial:** [openlibrary.org](https://openlibrary.org/developers)

---

## 2. Rick and Morty API — Personajes ficticios

**URL base:** `https://rickandmortyapi.com`

**Endpoint usado:**

```
GET https://rickandmortyapi.com/api/character?name=<query>
```

**Parámetros:**

| Parámetro | Tipo   | Descripción                     |
|-----------|--------|---------------------------------|
| `name`    | string | Nombre del personaje a buscar   |

**Ejemplo de petición:**

```
GET https://rickandmortyapi.com/api/character?name=Rick
```

**Ejemplo de respuesta:**

```json
{
  "info": { "count": 4 },
  "results": [
    {
      "id": 1,
      "name": "Rick Sanchez",
      "species": "Human",
      "origin": { "name": "Earth (C-137)" }
    }
  ]
}
```

**Campos usados en QuoteMatic:**

| Campo de la API   | Campo en Author         | Notas                        |
|-------------------|-------------------------|------------------------------|
| `name`            | `name`                  |                              |
| `species`         | `description` (display) | Solo para mostrar resultados |
| `origin.name`     | `description` (display) | Solo para mostrar resultados |
| —                 | `sourceWork`            | Siempre `"Rick and Morty"`   |
| —                 | `authorType`            | Siempre `"fictional"`        |
| —                 | `sourceType`            | Siempre `"tv_show"`          |

**Comportamiento si no hay resultados:** La API devuelve HTTP 404. El controlador lo captura y devuelve array vacío sin lanzar error.

**Autenticación:** Ninguna. API pública y gratuita.

**Límite aplicado:** Se toman los primeros 10 resultados (`.slice(0, 10)`).

**Timeout aplicado:** 8 segundos (`AbortSignal.timeout(8000)`).

**Sitio oficial:** [rickandmortyapi.com](https://rickandmortyapi.com/documentation)

---

## Comportamiento al guardar un autor importado

Cuando el admin pulsa "Guardar como autor" en `/admin/import`:

1. Se crea un documento `Author` en MongoDB.
2. El campo `verificationStatus` se establece como `"pending"`.
3. El campo `isVerified` es `false`.
4. El autor queda **activo** (`isActive: true`) pero sin verificar.
5. **No se crean frases automáticamente.**
6. El admin puede editar el autor en `/admin/authors/:id/edit` y completar los datos.

---

## Limitaciones conocidas

- Solo se buscan autores/personajes por nombre. No hay búsqueda por obra ni por categoría.
- Los resultados dependen de la disponibilidad de las APIs externas en el momento de la búsqueda.
- No se cachean resultados. Cada búsqueda hace una petición nueva.
- No se importan frases desde ninguna API externa. Solo autores.
- No se valida si el autor ya existe en la base de datos antes de guardar (puede generar error de `normalizedName` duplicado si se intenta guardar el mismo autor dos veces).
