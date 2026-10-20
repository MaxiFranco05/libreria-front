# Proposal

## Why

El sistema cuenta actualmente con el catálogo interactivo y los formularios de alta de libros y clientes en memoria, pero carece del circuito transaccional central requerido por el Ejercicio 5 de la consigna oficial: la simulación de órdenes de venta y la consulta auditable del historial de transacciones. Este cambio incorpora la composición dinámica de pedidos y garantiza por diseño la regla contable crítica del dominio (Regla Dura #7 y `RN-VNT-06`): congelar el precio unitario vigente como un snapshot histórico inmutable dentro de cada renglón vendido, de modo que futuras modificaciones de precios en el catálogo jamás alteren los importes de ventas pasadas.

## What Changes

- **Validadores y formateadores para transacciones comerciales (`js/utils/validators.js`, `js/utils/formatters.js`)**:
  - Nuevas funciones puras de validación para órdenes de venta: `validateSaleClient(clienteId, existingClients)` (`RN-VNT-01`), `validateSaleQuantity(quantity)` (`RN-VNT-02`) y `validateSaleRows(rows)` (`RN-VNT-02`).
  - Nuevos helpers de formato en `js/utils/formatters.js`: `formatDateTime(dateInput)` para fechas legibles de transacción y `getClientName(clienteId, clients)` para resolver el nombre completo del cliente.
- **Ampliación de estado centralizado (`js/state.js`)**:
  - Consolidación de la gestión de `state.ventas` con soporte de alta de venta (`addSale` / alias `addVenta`), generación de ID único correlativo (`VNT-1001`, `VNT-1002`, ...), clonación profunda (deep copy) de renglones con snapshot congelado de `precioUnitario`, `titulo` y `subtotal`, y emisión de eventos reactivos (`sale:added` y `ventas:updated`).
- **Vista interactiva de simulación de ventas (`js/views/ventas.view.js` y sección `#ventas` en `index.html`)**:
  - Selector de cliente activo poblado dinámicamente desde `state.clientes` y suscripto reactivamente a nuevas altas de clientes (`RN-CLI-04`, `RN-VNT-01`).
  - Selector de libro disponible poblado desde `state.libros` (mostrando título y precio actual formateado) y suscripto reactivamente a nuevas altas de libros (`RN-LIB-06`), junto con campo numérico de cantidad entera positiva (`cantidad >= 1`).
  - Acción "Agregar al pedido" con control de duplicidad (`RN-VNT-03`): si el libro seleccionado ya existe en el pedido en borrador, incrementa la cantidad del renglón existente, recalcula su subtotal y emite un aviso accesible informativo sin duplicar filas.
  - Tabla dinámica de canasta/pedido en borrador con columnas de Libro, Precio Unitario actual, Cantidad, Subtotal (`cantidad * precioUnitario`) y acciones por renglón para modificar la cantidad en vivo o eliminar el ítem antes de confirmar (`RN-VNT-04`).
  - Resumen financiero en tiempo real que calcula y formatea el total general acumulado con 2 decimales fijos (`$0.00`, `RN-VNT-05`).
  - Confirmación de venta con validación de cliente obligatorio (`RN-VNT-01`) y al menos un renglón válido (`RN-VNT-02`), congelamiento del snapshot histórico de `precioUnitario` en cada `RenglonVenta` (`RN-VNT-06`), vaciado automático del borrador, reseteo de controles y notificación accesible de éxito (`RN-VNT-08`).
- **Vista de historial de ventas e inmutabilidad (`js/views/historial.view.js`, sección `#historial` en `index.html` y estilos en `css/views.css`)**:
  - Tabla/listado maestro de transacciones confirmadas mostrando ID de venta, Fecha/Hora, Cliente y Total general formateado, actualizada reactivamente al confirmarse cada venta.
  - Mecanismo interactivo accesible por teclado (`aria-expanded`, `aria-controls` y `:focus-visible`) para expandir/colapsar el desglose de renglones de cada venta (título del libro, cantidad, precio unitario histórico congelado y subtotal).
  - Cumplimiento estricto de solo lectura e inmutabilidad (`RN-VNT-07` y Regla Dura #7): ausencia total de controles de edición o eliminación de ventas confirmadas, y renderizado exclusivo desde el snapshot guardado en cada `RenglonVenta` sin consultar ni recalcular jamás desde `state.libros`.

## Capabilities

### New Capabilities
- `sales-simulation`: Composición interactiva de pedidos en borrador, selectores reactivos de clientes y libros, control de duplicidad por libro, edición/eliminación de renglones en curso, cálculo dinámico de subtotales y total general a 2 decimales, validaciones previas y confirmación de venta con congelamiento del snapshot de precio unitario (`RN-VNT-01` a `RN-VNT-06`, `RN-VNT-08`, `US-005`).
- `sales-history`: Consulta auditable de solo lectura del historial de ventas registradas con desglose expandible accesible por renglón, exhibición estricta de precios unitarios y subtotales históricos congelados e inmunidad total frente a cambios posteriores en el catálogo (`RN-VNT-06`, `RN-VNT-07`, `US-006`).

### Modified Capabilities
<!-- No existing spec requirements are modified; reactive integration with books and clients is specified within sales-simulation. -->

## Impact

- **`index.html`**: Reemplazo de las tarjetas placeholder en `#ventas` y `#historial` por el marcado semántico accesible de simulación de ventas e historial de transacciones; enlace de `js/views/ventas.view.js` y `js/views/historial.view.js` mediante `<script defer>` (manteniendo compatibilidad `file://` sin `type="module"`).
- **`js/utils/validators.js` y `js/utils/formatters.js`**: Incorporación de validadores puros de venta y formateadores de fecha y cliente.
- **`js/state.js`**: Incorporación de alias `addVenta`, generador de IDs correlativos `VNT-XXXX` y garantía de inmutabilidad en los renglones almacenados en `state.ventas`.
- **`js/views/ventas.view.js` y `js/views/historial.view.js`**: Nuevos módulos de vista bajo patrón IIFE utilizando exclusivamente creación segura de nodos DOM (`document.createElement` y `.textContent`, sin `.innerHTML` dinámico).
- **`js/app.js` y `css/views.css`**: Inicialización de las nuevas vistas en el arranque de la SPA y estilos responsivos (320px–1280px sin scroll horizontal global) para el panel de ventas y el detalle expandible del historial.
- **`tests/test-c04.js`**: Suite de pruebas automatizadas en Node.js verificando validadores, cálculos financieros, control de duplicidad, reactividad y prueba de fuego de inmutabilidad histórica ante cambios de precio en catálogo.
