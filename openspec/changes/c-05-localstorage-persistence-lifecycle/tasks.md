# Tasks

## 1. Adaptador de Almacenamiento Local (`js/storage.js`)

- [x] 1.1 Implementar el módulo base `LibreriaApp.storage` con patrón IIFE universal, definición de claves canónicas (`libreria_inicializada`, `libreria_libros`, `libreria_clientes`, `libreria_ventas`, etc.) y métodos primitivos seguros `get(key, defaultValue)` y `set(key, value)` con manejo defensivo de errores (`try/catch`). Verificar con tests unitarios en `tests/test-c05.js`.
- [x] 1.2 Implementar los métodos de dominio del storage: `isInitialized()`, `setInitialized()`, `saveInitialSeed(seedData)`, `getBooks()`, `saveBooks(books)`, `getClients()`, `saveClients(clients)`, `getSales()`, `saveSales(sales)` y `clearAll()`. Verificar con tests de serialización y recuperación de datos íntegros.

## 2. Ciclo de Vida y Sincronización Reactiva (`js/app.js`)

- [x] 2.1 Refactorizar la inicialización `initApp()` en `js/app.js` para orquestar el ciclo de vida: si no está inicializado, persistir la semilla completa y fijar bandera `libreria_inicializada = "true"`; si ya está inicializado, cargar colecciones desde `localStorage` directamente hacia `state.init()`, evitando estrictamente la duplicación de datos en recargas (`RN-PER-01` y `RN-PER-02`). Verificar con test de recarga simulada.
- [x] 2.2 Implementar la suscripción reactiva en `js/app.js` conectando los eventos de `LibreriaApp.state` (`libros:updated`, `clientes:updated`, `ventas:updated`) con los métodos de persistencia inmediata de `storage` (`RN-PER-03`). Verificar que altas de libros, clientes y confirmación de ventas actualicen automáticamente sus claves en `localStorage`.

## 3. Integración en SPA y Prueba de Inmutabilidad Histórica (Flujo 4)

- [x] 3.1 Enlazar `<script defer src="js/storage.js"></script>` en `index.html` en el orden correcto de dependencias (antes de `state.js` y las vistas) y validar que no genera errores de sintaxis ni bloqueos bajo protocolo `file://`.
- [x] 3.2 Desarrollar y ejecutar la prueba guiada de inmutabilidad (Flujo 4 de consigna): registrar una venta, modificar manualmente el precio de un libro en `localStorage` (simulando edición en DevTools), ejecutar recarga (`F5`) y verificar que el historial de ventas y sus subtotales permanecen inalterados. Confirmar que la suite completa `tests/test-c05.js` aprueba el 100% de las aserciones.

## Workflow follow-up

- Ejecutar `/opsx:apply c-05-localstorage-persistence-lifecycle` para implementar los cambios con TDD estricto.
- Finalizada la implementación, archivar el change con `/opsx:archive c-05-localstorage-persistence-lifecycle`.
