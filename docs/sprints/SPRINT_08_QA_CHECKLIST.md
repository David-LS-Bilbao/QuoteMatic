# Sprint 08 — QA Checklist

Proyecto: QuoteMatic  
Rama: `feat/ejs-responsive-ui`

## Objetivo QA

Validar que la UI EJS responsive funciona sin romper la API REST, auth, favoritos, Swagger ni autorización admin.

## Comandos

- [ ] `npm run typecheck` pasa.
- [ ] `npm run build` pasa.
- [ ] `npm run dev` arranca servidor.

## Rutas Visuales

- [ ] `GET /` responde y muestra home.
- [ ] `GET /dashboard` responde.
- [ ] `GET /auth/register` responde.
- [ ] `GET /auth/login` responde.
- [ ] `GET /favorites` sin login redirige a login.
- [ ] `GET /admin` sin login redirige a login.
- [ ] `GET /api-docs` sigue disponible.

## Usuario No Logueado

- [ ] Puede ver home.
- [ ] Puede ver dashboard.
- [ ] Puede pedir frase aleatoria.
- [ ] Al intentar guardar favorito recibe mensaje de login requerido.
- [ ] No puede ver `/favorites`.
- [ ] No puede ver `/admin`.

## Usuario Normal

- [ ] Puede registrarse.
- [ ] Puede iniciar sesión.
- [ ] Puede acceder a dashboard.
- [ ] Puede guardar una frase como favorita.
- [ ] Puede ver `/favorites`.
- [ ] Puede quitar favorito.
- [ ] No puede acceder como admin a `/admin`.
- [ ] Puede cerrar sesión.

## Usuario Admin

- [ ] Puede iniciar sesión.
- [ ] Puede entrar a `/admin`.
- [ ] Ve enlaces a Swagger y API quotes.
- [ ] Ve tabla mínima de frases activas.

## API Existente

- [ ] `GET /health` sigue funcionando.
- [ ] `GET /api/quotes` sigue funcionando.
- [ ] `GET /api/authors` sigue funcionando.
- [ ] `GET /api/favorites/me` sigue protegido por sesión.
- [ ] `POST /api/quotes` sigue protegido por admin.

## Responsive

- [ ] Home se ve correctamente en móvil.
- [ ] Dashboard se ve correctamente en móvil.
- [ ] Favoritos se ve correctamente en móvil.
- [ ] Admin no rompe layout en móvil.

## Resultado Esperado

Sprint 08 queda completo cuando la app se puede demostrar desde navegador sin usar Postman para los flujos básicos de usuario.
