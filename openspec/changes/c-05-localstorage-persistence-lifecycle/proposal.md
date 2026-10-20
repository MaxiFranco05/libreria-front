# Proposal

## Why

Actualmente la aplicación mantiene todo el estado de la librería (libros dados de alta, clientes registrados y ventas simuladas con sus snapshots históricos) únicamente en la memoria volátil del navegador (`LibreriaApp.state`). Al recargar la página (`F5`), cerrar la pestaña o reiniciar el navegador, todas las altas y ventas se pierden, y el sistema vuelve a inyectar la semilla estática original.

Este cambio implementa la capa de persistencia en `localStorage` (Ejercicio 6 de la consigna oficial del parcial), garantizando la conservación de los datos entre sesiones, la no duplicación de la semilla inicial mediante el control del ciclo de vida (`libreria_inicializada`), la sincronización reactiva inmediata de nuevas entidades y la preservación estricta de la inmutabilidad histórica requerida por la cátedra ante ediciones manuales en DevTools.

## What Changes

- **Adaptador de persistencia (`js/storage.js`)**: Creación de un módulo desacoplado bajo el espacio de nombres `LibreriaApp.storage` con métodos seguros (`isInitialized`, `initStorage`, `get`, `set`, `saveBooks`, `saveClients`, `saveSales`, etc.) encapsulados en bloques `try/catch` para tolerancia a cuota y navegación privada.
- **Claves canónicas estructuradas**: Definición de claves estandarizadas en `localStorage`:
  - `libreria_inicializada`: bandera de control de ciclo de vida (`"true"`).
  - `libreria_libros`: colección de libros (semilla + altas).
  - `libreria_clientes`: colección de clientes (semilla + altas).
  - `libreria_editoriales`, `libreria_generos`, `libreria_autores`: entidades de referencia fijas.
  - `libreria_ventas`: transacciones confirmadas con snapshots de renglones históricos.
- **Ciclo de vida e inicialización inteligente en `js/app.js`**:
  - En el primer inicio (`libreria_inicializada` inexistente o falsa): se graba la semilla inicial en `localStorage` y se activa la bandera.
  - En recargas posteriores (`libreria_inicializada === "true"`): se hidrata el estado en memoria (`LibreriaApp.state.init`) directamente desde `localStorage`, **sin reinyectar ni duplicar la semilla**.
- **Sincronización reactiva automática**: Vinculación de `LibreriaApp.storage` con los eventos del bus de estado (`libros:updated`, `clientes:updated`, `ventas:updated`) para persistencia inmediata y transparente.
- **Inclusión en HTML y compatibilidad `file://`**: Enlace del script `js/storage.js` con atributo `defer` en `index.html` respetando el orden estricto de dependencias sin módulos ES6 (`type="module"`) ni dependencias externas.

## Capabilities

### New Capabilities
- `data-persistence`: Persistencia en `localStorage` de todas las entidades, ciclo de vida e inicialización idempotente, prevención de duplicación en recargas y preservación de inmutabilidad del historial frente a modificaciones externas del catálogo.

### Modified Capabilities
*(Ninguna. Los requerimientos funcionales de catálogo, libros, clientes, ventas e historial se mantienen intactos; este change añade la capa de persistencia y ciclo de vida subyacente).*

## Impact

- **Código modificado / agregado**:
  - `js/storage.js` (nuevo archivo con el adaptador de almacenamiento local).
  - `js/app.js` (actualización de `initApp` para orquestar la inicialización basada en persistencia y configurar la sincronización reactiva).
  - `index.html` (inclusión de `<script defer src="js/storage.js"></script>` antes de `state.js` y las vistas).
- **APIs / Dependencias**: 100% JavaScript nativo (Web Storage API - `localStorage`). Sin frameworks, librerías externas ni llamadas HTTP. Compatible con apertura directa `file://` y servidores estáticos locales.
