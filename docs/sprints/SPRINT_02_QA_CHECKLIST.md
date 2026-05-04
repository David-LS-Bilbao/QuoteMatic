# Sprint 02 - QA Checklist

Fecha: 2026-04-30  
Proyecto: QuoteMatic  
Rama: `feat/domain-models-and-seed`

## Git y Rama

- [ ] Confirmar que la rama actual es `feat/domain-models-and-seed`.
- [ ] Confirmar que la rama destino del PR sera `dev`.
- [ ] Confirmar que no hay cambios funcionales no revisados.
- [ ] Confirmar que no se han modificado modelos fuera del alcance del sprint.

Comando:

```bash
git status
```

## Instalacion

- [ ] Confirmar que las dependencias del proyecto estan instaladas.
- [ ] No instalar dependencias nuevas para este sprint salvo necesidad justificada.

Comando:

```bash
npm install
```

## TypeScript

- [ ] `domain.types.ts` compila sin errores.
- [ ] Los modelos importan correctamente los tipos de dominio.
- [ ] No hay errores de tipos en el proyecto.

Comando:

```bash
npm run typecheck
```

## Tipos de Dominio

- [ ] `USER_ROLES` contiene `user` y `admin`.
- [ ] `AGE_GROUPS` contiene `teen_14_17` y `adult_18_plus`.
- [ ] `AUTHOR_TYPES` no incluye `system`.
- [ ] `SOURCE_TYPES` representa fuentes u origenes.
- [ ] `CONTENT_RATINGS` contiene `all`, `teen` y `adult`.
- [ ] `VERIFICATION_STATUSES` cubre estados basicos de verificacion.
- [ ] `QUOTE_TYPE_SLUGS` contiene los 8 slugs oficiales.

## Modelos Mongoose

- [ ] Existe modelo `User`.
- [ ] Existe modelo `Author`.
- [ ] Existe modelo `Situation`.
- [ ] Existe modelo `QuoteType`.
- [ ] Existe modelo `Quote`.
- [ ] Existe modelo `Favorite`.
- [ ] Los modelos principales usan `timestamps: true`.
- [ ] Los modelos usan `isActive` cuando aplica.
- [ ] Los campos unicos e indexados estan definidos donde corresponde.

## Relaciones

- [ ] `Quote.author` referencia a `Author`.
- [ ] `Quote.situation` referencia a `Situation`.
- [ ] `Quote.quoteType` referencia a `QuoteType`.
- [ ] `Favorite.user` referencia a `User`.
- [ ] `Favorite.quote` referencia a `Quote`.
- [ ] `Quote` tiene indice unico por `textNormalized` y `author`.
- [ ] `Favorite` tiene indice unico por `user` y `quote`.

## Seed

- [ ] Existe `src/seeds/seed.ts`.
- [ ] El seed carga variables de entorno.
- [ ] El seed conecta con `MONGODB_URI`.
- [ ] El seed limpia colecciones antes de insertar.
- [ ] El seed inserta 4 autores.
- [ ] El seed inserta 4 situaciones.
- [ ] El seed inserta 8 tipos de frase.
- [ ] El seed inserta 12 frases.
- [ ] El seed valida referencias antes de insertar frases.
- [ ] El seed no crea usuarios todavia.

Comando:

```bash
npm run seed
```

## MongoDB Docker

- [ ] Docker esta disponible en el entorno local.
- [ ] MongoDB local esta levantado antes de ejecutar el seed.
- [ ] `MONGODB_URI` apunta a la instancia correcta.

Comando:

```bash
docker compose up -d
```

## Scripts npm

- [ ] Existe `npm run dev`.
- [ ] Existe `npm run typecheck`.
- [ ] Existe `npm run build`.
- [ ] Existe `npm start`.
- [ ] Existe `npm run seed`.

## Build

- [ ] TypeScript compila correctamente.
- [ ] Las vistas EJS se copian a `dist/views`.
- [ ] Los assets publicos se copian a `dist/public`.
- [ ] La build no depende de datos externos.

Comando:

```bash
npm run build
```

## Seguridad Basica

- [ ] No se versionan secretos reales.
- [ ] `.env.example` documenta variables necesarias.
- [ ] `passwordHash` existe en `User`, pero no se implementa login todavia.
- [ ] No hay rutas de administracion expuestas en este sprint.
- [ ] No hay endpoints de escritura publica para modelos.
- [ ] `ageGroup` existe como base para Sprint 03.
- [ ] Menores de 14 aun no estan gestionados porque age gate queda para Sprint 03.

## Criterios de Aceptacion Final

- [ ] La rama contiene tipos de dominio cerrados y reutilizables.
- [ ] La rama contiene los 6 modelos principales.
- [ ] Las relaciones entre colecciones estan definidas.
- [ ] El seed inicial es repetible.
- [ ] `npm run typecheck` pasa.
- [ ] `npm run build` pasa.
- [ ] `npm run seed` pasa con MongoDB disponible.
- [ ] README refleja el estado real del Sprint 02.
- [ ] La documentacion deja claro que no existen login, register, CRUD admin ni favoritos funcionales todavia.
