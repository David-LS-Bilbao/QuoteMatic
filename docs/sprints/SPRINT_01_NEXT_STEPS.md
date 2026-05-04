# Sprint 01 - Next Steps

Fecha: 2026-04-29

## Objetivo recomendado para Sprint 02

Construir la primera capa de dominio de QuoteMatic: tipos TypeScript, modelos Mongoose principales y datos iniciales minimos para validar que la base tecnica del Sprint 01 puede sostener el producto.

El foco recomendado no es crear todo el CRUD todavia, sino modelar bien las entidades, sus relaciones y una primera carga de datos controlada.

## Alcance sugerido

### Tipos de dominio TypeScript

- Definir tipos o interfaces para las entidades principales.
- Separar tipos compartidos en una carpeta clara, por ejemplo `src/types` o junto a cada modelo si se prefiere mantenerlo simple.
- Evitar tipos demasiado complejos hasta validar el dominio.

### Modelos Mongoose principales

Modelos recomendados para Sprint 02:

- `User`
- `Author`
- `Situation`
- `QuoteType`
- `Quote`

Relaciones iniciales sugeridas:

- `Quote` referencia a `Author`.
- `Quote` referencia a `Situation`.
- `Quote` referencia a `QuoteType`.
- `Quote` contiene rango de edad recomendado o metadatos necesarios para filtrar.
- `User` queda preparado para autenticacion posterior, sin implementar login todavia si se mantiene el alcance cerrado.

### Seed inicial

- Crear un seed pequeno y repetible.
- Incluir algunos autores, situaciones, tipos de frase y frases.
- Permitir validar la conexion a MongoDB y las relaciones entre modelos.
- Evitar depender de datos externos o APIs externas.

### Admin inicial opcional

- Si aporta valor al portfolio, preparar un usuario admin inicial en seed.
- No implementar panel completo de administracion todavia.
- No mezclar este punto con autenticacion si se decide dejar auth para Sprint 03.

### Validacion basica

- Validar campos obligatorios en esquemas Mongoose.
- Definir enums o listas controladas donde tenga sentido.
- Evitar que el seed cree datos duplicados si se ejecuta mas de una vez.

## Fuera de alcance recomendado

- No implementar todo el CRUD si el modelado todavia puede cambiar.
- No implementar register/login/logout en Sprint 02 si el objetivo principal es dominio y datos.
- No crear recomendador completo de frases todavia.
- No integrar APIs externas.
- No construir UI administrativa completa.

## Posible sprint posterior

Despues del modelado y seed, un sprint posterior puede cubrir:

- Auth register/login/logout.
- Sesiones.
- Roles.
- Age gate.
- Favoritos.
- Primeras rutas protegidas.

## Ramas sugeridas

- Rama de trabajo: `feat/domain-models-and-seed`
- Rama destino: `dev`
- Rama alternativa si se separa el seed: `feat/initial-seed-data`

## Features sugeridas

- `F04 Domain types`
- `F05 Mongoose models`
- `F06 Initial seed`
- `F07 Basic validation`
- `F08 Optional admin seed`

## Commits sugeridos

```text
feat(types): add domain interfaces
feat(models): add core mongoose models
feat(seed): add initial quote data seed
chore(seed): add seed npm script
docs(sprint-02): document domain setup
```

Si se decide separar el trabajo:

```text
feat(models): add user and catalog models
feat(models): add quote model relations
feat(seed): seed authors situations quote types and quotes
```

## Riesgos

- Modelar demasiadas relaciones antes de validar casos de uso reales.
- Mezclar autenticacion con modelado y aumentar el alcance del sprint.
- Crear un CRUD completo sobre modelos que aun pueden cambiar.
- Sembrar demasiados datos y perder claridad de prueba.
- No definir bien el rango de edad o dejarlo como texto libre dificil de consultar.

## Checklist de salida

- [ ] Existen tipos TypeScript del dominio principal.
- [ ] Existen modelos Mongoose para `User`, `Author`, `Situation`, `QuoteType` y `Quote`.
- [ ] Los modelos compilan con `npm run typecheck`.
- [ ] Los modelos tienen validaciones minimas.
- [ ] Existe seed inicial pequeno y documentado.
- [ ] El seed puede ejecutarse contra MongoDB local.
- [ ] El build sigue pasando.
- [ ] No se implementan funcionalidades fuera de alcance sin documentarlo.
- [ ] README o docs se actualizan con los comandos nuevos.
- [ ] La rama queda lista para PR hacia `dev`.
