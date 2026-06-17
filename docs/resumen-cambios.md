# Cambios Realizados

Este documento detalla los cambios realizados en el repositorio para la implementación de las funcionalidades de cancelación y consulta de detalles de eventos.

## 🛠️ Cambios en el Código

### 1. Entidad de Dominio (`src/domain/entities/evento.ts`)
* **Propiedades agregadas:** `descripcion`, `telefono` y `nombre`.
* **Constructor:** Actualizado para soportar e inicializar los nuevos campos con valores por defecto (manteniendo la compatibilidad con otras partes del código).
* **Getters:** Agregados los métodos públicos `obtenerDescripcion()`, `obtenerTelefono()` y `obtenerNombre()`.
* **Método `cancelarEvento()`:** Modifica el estado del evento a `"cancelado"`, arrojando una excepción si el evento ya se encontraba en estado `"completado"`.
* **Método `obtenerDetalle()`:** Retorna un objeto plano con toda la información consolidada del evento para su fácil consulta.

### 2. Pruebas Unitarias (`tests/domain/evento.test.ts`)

* **MO5 US4 (Ver detalle evento):**
  * Se añadió una prueba para verificar que `obtenerDetalle()` retorne correctamente el objeto plano con todos los atributos de la reserva (`id`, `estado`, `fechaHora`, `descripcion`, `telefono` y `nombre`).

* **MO5 US2 (Cancelación Reserva):**
  * Se añadió una prueba para verificar que `cancelarEvento()` cambie el estado de la reserva a `"cancelado"`.
  * Se añadió una prueba para asegurar que no se pueda cancelar una reserva en estado `"completado"`, verificando que lance la excepción esperada.
