# Design

## Context

Actualmente el estado de la aplicación reside exclusivamente en memoria volátil dentro del módulo `LibreriaApp.state` (`js/state.js`). El inicializador central `LibreriaApp.initApp` (`js/app.js`) inyecta `LibreriaApp.seedData` incondicionalmente en cada carga de página.

Para cumplir con el Ejercicio 6 de la consigna y las reglas de negocio `RN-PER-01`, `RN-PER-02` y `RN-PER-03`, se requiere una capa desacoplada de almacenamiento que gestione la persistencia en `localStorage`, controle la bandera `libreria_inicializada` y mantenga sincronizado el estado ante mutaciones reactivas, preservando la compatibilidad con ejecución directa mediante protocolo `file://` (Regla Dura #2) y la prevención estricta de XSS (Regla Dura #5).

## Goals / Non-Goals

**Goals:**
- Crear el adaptador `LibreriaApp.storage` en `js/storage.js` con métodos encapsulados y tolerantes a fallos (`try/catch`).
- Implementar el ciclo de vida de arranque en `js/app.js`: verificar `storage.isInitialized()`; sembrar si es el primer inicio; hidratar desde `localStorage` si ya fue inicializado, garantizando **cero duplicación de datos semilla en recarga**.
- Implementar sincronización automática y reactiva en `js/app.js` escuchando los eventos del bus de estado (`libros:updated`, `clientes:updated`, `ventas:updated`).
- Preservar la inmutabilidad de precios históricos en `libreria_ventas` ante modificaciones externas del catálogo en `libreria_libros` (Flujo 4).
- Proveer cobertura de tests automatizados unitarios y de integración para el ciclo de persistencia, recargas simuladas y tolerancia a fallos.

**Non-Goals:**
- No implementar bases de datos remotas, IndexedDB ni llamadas HTTP / `fetch` (Regla Dura #3).
- No permitir edición ni eliminación de ventas registradas en `localStorage` desde la interfaz (Regla Dura #7 y `RN-VNT-07`).
- No modificar el esquema de datos ni los modelos core de entidades definidos en `knowledge-base/04_modelo_de_datos.md`.

## Decisions

### 1. Modularización como Adaptador IIFE (`js/storage.js`)
- **Decisión**: Exponer `LibreriaApp.storage` bajo el patrón IIFE universal compatible con navegadores (`window`) y Node.js (`globalThis` / `module.exports`), idéntico a los módulos existentes (`state.js`, `seed.js`).
- **Alternativas consideradas**:
  - *Módulos ES6 (`export/import`)*: Descartado rotundamente por violar la Regla Dura #2 (provoca errores de CORS al abrir `index.html` con doble clic mediante `file://`).
  - *Llamadas dispersas a `localStorage` en cada vista*: Descartado por violar la separación de responsabilidades y dificultar el testing unitario y la gestión centralizada de errores.

### 2. Claves Canónicas Granulares por Colección
- **Decisión**: Usar claves estandarizadas e independientes:
  - `libreria_inicializada` (`"true"`)
  - `libreria_libros` (Array de libros)
  - `libreria_clientes` (Array de clientes)
  - `libreria_ventas` (Array de ventas y renglones con precio histórico)
  - `libreria_editoriales`, `libreria_generos`, `libreria_autores` (Entidades de referencia fijas)
- **Rationale**: Almacenar colecciones independientes evita tener que re-serializar un objeto gigantesco con cada pequeño cambio y, fundamentalmente, permite a los docentes/evaluadores abrir DevTools (F12) -> Application -> Local Storage y editar puntualmente el array `libreria_libros` para comprobar la prueba de inmutabilidad (Flujo 4).
- **Alternativas consideradas**:
  - *Un único mega-objeto `libreria_state`*: Aunque reduce la cantidad de claves, dificulta la inspección en DevTools, incrementa el costo de serialización y expone todo el estado ante una corrupción accidental.

### 3. Orquestación Reactiva mediante el Bus de Eventos de `state.js`
- **Decisión**: La vista no invoca directamente al storage. En su lugar, `js/app.js` suscribe el almacenamiento a los eventos emitidos por `LibreriaApp.state`:
  - `state.on('libros:updated', () => storage.saveBooks(state.getBooks()))`
  - `state.on('clientes:updated', () => storage.saveClients(state.getClients()))`
  - `state.on('ventas:updated', () => storage.saveSales(state.getSales()))`
- **Rationale**: Mantiene el acoplamiento mínimo; las vistas solo interactúan con el modelo/estado y la persistencia ocurre de manera transparente y reactiva como efecto colateral seguro.

### 4. Tolerancia a Fallos y Manejo Defensivo (`try/catch`)
- **Decisión**: Todos los métodos de `storage` envuelven las operaciones nativas en bloques `try/catch`. En caso de que `localStorage` lance una excepción (ej. cuota excedida, modo incógnito restringido en Safari o JSON malformado por edición manual externa), el adaptador emite advertencia amigable y retorna fallbacks seguros (`defaultValue`), garantizando que la aplicación continúe operando en memoria sin congelar la UI.

## Risks / Trade-offs

- **[Riesgo: JSON inválido editado por usuario en DevTools]** → *Mitigación*: `storage.get(key, defaultValue)` valida el resultado de `JSON.parse`. Si falla, captura el error, loguea advertencia y devuelve el fallback en memoria sin romper la ejecución.
- **[Riesgo: Duplicación de datos al recargar con F5]** → *Mitigación*: El guardián `storage.isInitialized()` previene estrictamente la reinyección de `seedData`. Si es `"true"`, `app.js` hidrata el estado directamente desde las claves guardadas.
- **[Riesgo: Mutación de catálogo afectando ventas en storage]** → *Mitigación*: `libreria_ventas` guarda snapshots profundamente clonados de cada `RenglonVenta`. Las ventas nunca contienen referencias vivas a `libreria_libros`.
