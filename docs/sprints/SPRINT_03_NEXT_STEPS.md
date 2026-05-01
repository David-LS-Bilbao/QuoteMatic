# Sprint 03 - Next Steps

Fecha: 2026-05-01  
Proyecto: QuoteMatic  
Siguiente sprint recomendado: Sprint 04 - Auth, sesiones, roles y experiencia minima

## Estado Tras Sprint 03

Sprint 03 deja QuoteMatic con API REST funcional para frases y catalogos:

- Consulta de frases.
- Frase aleatoria.
- Consulta por id.
- Creacion de frases.
- Actualizacion parcial de frases activas.
- Borrado logico de frases.
- Catalogos de autores, situaciones y tipos de frase.

El backend ya puede demostrarse con MongoDB, seed y comandos `curl`.

## Objetivo del Sprint 04

Implementar la primera capa funcional de usuario:

- Auth.
- Register/login.
- Sesiones.
- Roles.
- Age gate.
- Favoritos funcionales.
- Vistas minimas para demo.

El foco recomendado es mantener una implementacion simple y demostrable, sin convertir el proyecto en un panel admin grande.

## Trabajo Recomendado Para Sprint 04

### Auth

- Crear flujo de registro.
- Crear flujo de login.
- Crear logout.
- Guardar password como hash.
- Validar email unico.
- Preparar middleware basico de sesion.

### Sesiones

- Gestionar sesion de usuario autenticado.
- Exponer usuario actual a vistas EJS.
- Proteger rutas que requieran login.

### Roles

- Usar `User.role`.
- Diferenciar `user` y `admin`.
- Evitar rutas admin publicas.
- Mantener permisos simples.

### Age Gate

- Usar `User.ageGroup`.
- Evitar contenido `adult` para usuarios no aptos.
- Decidir comportamiento para usuarios no autenticados.
- Mantener reglas claras y faciles de probar.

### Favoritos Funcionales

- Usar modelo `Favorite`.
- Permitir marcar una frase como favorita.
- Permitir quitar favorito con borrado logico o estado inactivo.
- Listar favoritos del usuario autenticado.

### Vistas Minimas

- Home simple.
- Formulario de register.
- Formulario de login.
- Vista de frases.
- Vista de favoritos.
- Mensajes de error basicos.

### Mejoras de Validacion

- Manejar duplicados de `Quote` con respuesta `409` o `400`.
- Validar payloads vacios.
- Normalizar respuestas de error.
- Revisar `DELETE` sobre documentos ya inactivos.
- Mantener validaciones cerca de los controladores mientras el proyecto siga pequeno.

### Posible Paginacion Futura

- Evaluar `limit` y `page` en `GET /api/quotes`.
- Mantenerlo fuera si no aporta valor inmediato a la demo.
- Evitar busqueda avanzada hasta tener flujos de usuario cerrados.

## Lo Que NO Se Hizo En Sprint 03

- Auth.
- Register/login.
- Sesiones.
- Roles funcionales.
- Age gate.
- Favoritos funcionales.
- Dashboard.
- Paginacion.
- Busqueda avanzada.
- APIs externas.
- Panel admin completo.
- Importacion automatica de contenido.

## Riesgos Para Sprint 04

- Hacer auth demasiado compleja.
- Crear un dashboard antes de tener login y favoritos funcionando.
- Mezclar age gate, roles y admin en una unica tarea grande.
- Introducir dependencias nuevas sin necesidad.
- Crear APIs externas antes de cerrar el MVP local.

## Checklist de Entrada Para Sprint 04

- [ ] Sprint 03 mergeado en `dev`.
- [ ] README actualizado.
- [ ] Seed funcionando.
- [ ] API REST probada manualmente.
- [ ] Decidir si las sesiones seran con cookie simple.
- [ ] Decidir si el registro exigira edad/grupo de edad desde el inicio.
- [ ] Decidir rutas minimas EJS para demo.

## Resultado Esperado del Sprint 04

Al cerrar Sprint 04, QuoteMatic deberia permitir:

- Crear usuario.
- Iniciar sesion.
- Ver frases respetando reglas basicas de edad.
- Guardar favoritos.
- Ver favoritos en una vista minima.
- Mantener roles preparados para proteger funcionalidades futuras.
