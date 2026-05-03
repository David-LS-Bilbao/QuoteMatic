# Sprint 09 — Importación programática de frases desde API externa

Proyecto: QuoteMatic
Rama: `feat/ejs-responsive-ui`

---

## Estado actual

La importación desde APIs externas (Quotable, Open Library, Rick and Morty) queda como **mejora futura**. En esta fase se prioriza el CRUD manual desde el panel admin y el seed controlado en español.

El script CLI `npm run import:quotes` sigue disponible como herramienta opcional para enriquecer datos en local, pero la pantalla `/admin/import` no está visible en la navegación principal del admin.

---

## Objetivo

Enriquecer la base de datos de QuoteMatic con frases reales en inglés procedentes de una API pública, de forma controlada, trazable y sin romper el flujo normal del usuario.

El script es un **enriquecimiento opcional** y no forma parte del arranque habitual de la app.

---

## API usada

**Quotable API**

| Campo         | Valor                                        |
|---------------|----------------------------------------------|
| Base URL      | `https://api.quotable.io`                    |
| Endpoint      | `GET /quotes?limit=30&page=1`                |
| Autenticación | Ninguna (API pública y gratuita)             |
| Formato       | JSON                                         |
| Timeout       | 10 segundos (`AbortSignal.timeout(10000)`)   |
| Petición      | Server-side únicamente                       |

Ejemplo de respuesta:

```json
{
  "count": 30,
  "results": [
    {
      "_id": "abc123",
      "content": "The only way to do great work is to love what you do.",
      "author": "Steve Jobs",
      "authorSlug": "steve-jobs",
      "tags": ["inspirational", "work"],
      "length": 52
    }
  ]
}
```

---

## Script

```
src/seeds/importQuotesFromQuotable.ts
```

Comando:

```bash
npm run import:quotes
```

---

## Límite de datos

- Máximo **30 frases** por ejecución.
- Límite intencional para mantener el dataset controlado durante el bootcamp.
- Se puede ajustar la constante `MAX_QUOTES` en el script si se necesita más.

---

## Deduplicación

El modelo `Quote` tiene un índice único compuesto:

```typescript
{ textNormalized: 1, author: 1 }  // índice único
```

El script comprueba si ya existe una frase con el mismo `textNormalized` y el mismo `author` (ObjectId) antes de insertar. Si existe, la omite y la cuenta como duplicado.

Ejecutar el script varias veces es idempotente: no crea duplicados.

---

## Mapeo a autores

Por cada frase recibida de Quotable:

1. Se normaliza el nombre del autor (`normalizeText`).
2. Se busca en la colección `Author` por `normalizedName`.
3. Si existe, se reutiliza su `_id`.
4. Si no existe, se crea con:

| Campo                | Valor        |
|----------------------|--------------|
| `authorType`         | `"real"`     |
| `sourceType`         | `"unknown"`  |
| `verificationSource` | `"quotable"` |
| `verificationStatus` | `"pending"`  |
| `isVerified`         | `false`      |
| `isActive`           | `true`       |

Se usa un caché en memoria (`Map`) para evitar múltiples consultas a DB por el mismo autor durante la misma ejecución.

---

## Mapeo a tipos de frase

Los tags de Quotable se mapean a los slugs de `QuoteType` del proyecto:

| Tag de Quotable     | QuoteType slug   |
|---------------------|------------------|
| `inspirational`     | `motivational`   |
| `motivational`      | `motivational`   |
| `success`           | `motivational`   |
| `stoicism`          | `stoic`          |
| `work`, `work-ethic`| `stoic`          |
| `philosophy`        | `philosophical`  |
| `knowledge`         | `philosophical`  |
| `truth`             | `philosophical`  |
| `life`              | `wise_advice`    |
| `wisdom`            | `wise_advice`    |
| `famous-quotes`     | `wise_advice`    |
| `leadership`        | `wise_advice`    |
| `humor`, `humorous` | `funny`          |
| `technology`        | `realistic`      |
| `education`         | `wise_advice`    |
| *(sin coincidencia)*| `wise_advice`    |

Si ningún tag coincide, se usa `wise_advice` como fallback.

---

## Mapeo a situaciones

Las frases de Quotable son genéricas y no indican situación. Se distribuyen por **rotación de índice** entre las situaciones existentes en DB:

```
trabajo → estudios → estres → decisiones-dificiles → trabajo → ...
```

Esto garantiza una distribución equitativa sin necesidad de lógica semántica compleja.

---

## Metadatos guardados en cada frase importada

| Campo               | Valor                     |
|---------------------|---------------------------|
| `language`          | `"en"`                    |
| `contentRating`     | `"all"`                   |
| `verificationStatus`| `"pending"`               |
| `sourceType`        | `"unknown"`               |
| `sourceReference`   | `"quotable:<_id externo>"`|
| `isActive`          | `true`                    |

El campo `sourceReference` permite trazar el origen de cada frase importada.

---

## Logs de ejecución

El script emite logs claros durante la ejecución:

```
MongoDB conectado.
Situaciones disponibles: trabajo, estudios, estres, decisiones-dificiles
Tipos disponibles: stoic, philosophical, motivational, ...

Consultando Quotable API (máx. 30 frases)...
Recibidas 30 frases de la API.

  [autor+]  Steve Jobs
  [ok]      [motivational/trabajo] "The only way to do great work..."
  [dup]     "A journey of a thousand miles begins..."
  [autor+]  Marcus Aurelius
  [ok]      [stoic/estudios] "You have power over your mind..."

─── Resumen de importación ───────────────────────────
  Autores creados:       12
  Frases creadas:        28
  Duplicados omitidos:    2
  Errores:                0
──────────────────────────────────────────────────────
Conexión MongoDB cerrada.
```

---

## Validaciones realizadas

```bash
npm run typecheck   # sin errores
npm run build       # compilación limpia
npm run import:quotes
```

Verificado en navegador y con curl:

```bash
curl http://localhost:3000/api/quotes
curl "http://localhost:3000/api/quotes/random?situation=estres&quoteType=motivational"
curl "http://localhost:3000/api/quotes/random?situation=trabajo&quoteType=philosophical"
```

Panel admin:

```
/admin/quotes    → frases importadas visibles con badge "pending"
/admin/authors   → autores importados visibles
/dashboard       → frases importadas disponibles en los selectores
```

---

## Archivos creados o modificados

| Archivo                                            | Cambio                              |
|----------------------------------------------------|-------------------------------------|
| `src/seeds/importQuotesFromQuotable.ts`            | Script de importación (nuevo)       |
| `package.json`                                     | Script `import:quotes` añadido      |
| `README.md`                                        | Sección "Importación opcional"      |
| `docs/EXTERNAL_APIS.md`                            | Ya existía de Sprint 09 admin       |
| `docs/sprints/SPRINT_09_IMPORT_QUOTES_REPORT.md`   | Este archivo                        |

---

## Limitaciones conocidas

| Limitación | Detalle |
|---|---|
| Disponibilidad de la API | `api.quotable.io` es un servicio externo que puede estar fuera de servicio. El script falla con mensaje claro en ese caso. |
| Frases en inglés | Quotable es una API en inglés. Las frases importadas tienen `language: "en"`. El dashboard puede mostrar frases en inglés mezcladas con las del seed en español. |
| Situación asignada por rotación | La asignación es mecánica, no semántica. Una frase sobre amor puede quedar en situación "trabajo". |
| Sin validación humana previa | Las frases se importan con `verificationStatus: "pending"`. Un admin debería revisarlas antes de un entorno productivo. |
| Sin paginación | El script solo descarga la primera página (30 frases). No hay lógica de paginación. |
| Autores duplicados entre seed y Quotable | Si el seed tiene "Marco Aurelio" y Quotable devuelve "Marcus Aurelius", se crean dos autores distintos porque los nombres normalizados son diferentes. |

---

## Riesgos

- Importar autores duplicados si el nombre en Quotable difiere del seed (distintos idiomas o grafías).
- En entorno de producción, importar frases con `isActive: true` sin revisión humana podría publicar contenido no verificado.
- La API puede cambiar su formato de respuesta sin previo aviso.

---

## Dataset de demo

### Estrategia de datos

El dataset de QuoteMatic se construye en tres capas independientes:

| Capa | Script | Idioma | Estado | Descripción |
|---|---|---|---|---|
| **Base controlada** | `npm run seed` | Español | `pending` | Frases propias, bien atribuidas, revisadas manualmente |
| **Admin de demo** | `npm run seed:admin` | — | — | Crea usuario admin para uso en demo |
| **Enriquecimiento externo** | `npm run import:quotes` | Inglés | `pending` | Frases de Quotable API, opcionales |

### Seed base ampliado

Tras la ampliación del sprint 09:

| Colección | Cantidad | Notas |
|---|---|---|
| `authors` | 10 | 4 originales + 6 nuevos (Epicteto, Nietzsche, Wilde, Cervantes, Camus, Gandalf) |
| `situations` | 4 | Sin cambios |
| `quotetypes` | 8 | Sin cambios |
| `quotes` | 32 | 12 originales + 20 nuevas en español |

### Cobertura de combinaciones prioritarias

Todas las combinaciones críticas del dashboard tienen ≥ 2 frases:

| Combinación | Frases | Autores |
|---|---|---|
| trabajo + motivational | 2 | Nietzsche, Camus |
| trabajo + stoic | 2 | Marco Aurelio, Epicteto |
| trabajo + wise_advice | 2 | Yoda, Séneca |
| estudios + motivational | 2 | Nietzsche, Séneca |
| estudios + philosophical | 3 | Marco Aurelio, Séneca, Cervantes |
| estres + stoic | 2 | Marco Aurelio, Epicteto |
| estres + motivational | 2 | Camus, Nietzsche |
| decisiones-dificiles + wise_advice | 2 | Séneca, Gandalf |
| decisiones-dificiles + philosophical | 2 | Yoda, Epicteto |

### Admin de demo

El script `npm run seed:admin` crea o actualiza el usuario:

```
email:    admin@quotematic.local
password: Admin123!
rol:      admin
```

Es idempotente: ejecutarlo varias veces actualiza el usuario existente sin crear duplicados.

**Solo para desarrollo y demo. No usar en producción.**

### Criterio de selección de frases del seed

- Solo frases con atribución documentada y fuente conocida.
- Si existe duda sobre la atribución, la frase no se incluye.
- `verificationStatus: "pending"` en todas (sin excepción).
- `isActive: true` para que el dashboard las muestre en demo.
- `language: "es"` para el seed base; `"en"` para frases importadas de Quotable.

### Limitaciones del dataset

- Las frases importadas de Quotable están en inglés. En el dashboard aparecen mezcladas con el seed en español.
- La asignación de situación en `npm run import:quotes` es mecánica (rotación). No garantiza coherencia semántica.
- El seed no crea usuarios normales de demo. El corrector/profesor debe registrarse en `/auth/register`.
