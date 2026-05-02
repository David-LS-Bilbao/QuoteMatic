# Bug: MissingSchemaError en populate de Mongoose

## Síntoma

`GET /api/quotes` devolvía `500 Internal Server Error` con el cuerpo:

```json
{ "success": false, "message": "Internal server error" }
```

El error real quedaba silenciado dentro del `try/catch` del controlador y solo era visible en los logs del servidor:

```
Quote API error: MissingSchemaError: Schema hasn't been registered for model "Author".
Use mongoose.model(name, schema)
```

## Causa raíz

El controlador `quoteApi.controller.ts` ejecutaba `.populate()` sobre el modelo `Quote`, que tiene referencias a los modelos `Author`, `Situation` y `QuoteType`. Mongoose busca esos modelos por nombre en su registro interno en el momento de ejecutar el populate.

El problema tenía dos capas:

**1. Imports faltantes.** Los modelos `Author` y `Situation` no estaban importados en el controlador, por lo que nunca se registraban en Mongoose.

**2. TypeScript import elision.** Al añadir los imports, el error persistía. TypeScript elimina en tiempo de compilación los imports que detecta como "no usados como valor" (*import elision*). Como `Author` y `Situation` se importaban pero no se referenciaban en ninguna expresión del código, TypeScript los borraba antes de que tsx los ejecutara. Solo `Quote` y `QuoteType` sobrevivían porque sí se usaban directamente en las queries.

Esto se confirmó comprobando los modelos registrados al arrancar:

```
Connected, models registered: [ 'Quote', 'QuoteType' ]
```

## Solución

Referenciar los modelos importados como valores dentro de `quotePopulate`, usando la propiedad `model` que acepta el populate de Mongoose:

```ts
// Antes
const quotePopulate = [
  { path: "author", select: "name authorType sourceWork isActive" },
  { path: "situation", select: "name slug description isActive" },
  { path: "quoteType", select: "name slug description contentRating isActive" },
];

// Después
const quotePopulate = [
  { path: "author", model: Author, select: "name authorType sourceWork isActive" },
  { path: "situation", model: Situation, select: "name slug description isActive" },
  { path: "quoteType", model: QuoteType, select: "name slug description contentRating isActive" },
];
```

Esto resuelve ambos problemas a la vez:

- Fuerza a TypeScript a mantener los imports porque `Author`, `Situation` y `QuoteType` son ahora valores referenciados.
- Le indica a Mongoose el modelo a usar de forma explícita, sin depender de la búsqueda por nombre string en el registro global.

## Archivos afectados

- `src/controllers/api/quoteApi.controller.ts`

## Lección

En proyectos TypeScript + Mongoose, nunca confiar en imports "de efecto secundario" para registrar modelos. Si un modelo se importa solo para que Mongoose lo registre pero no se usa como valor en el código, TypeScript lo eliminará. La forma segura es referenciar siempre el modelo como valor, ya sea en el `populate`, en una query, o en cualquier otra expresión.



## solucion generada con ayuda de claude code sonnet 4.6 CLI-VSCODE.