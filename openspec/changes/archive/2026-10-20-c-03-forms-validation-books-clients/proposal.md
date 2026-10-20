# Proposal: C-03 forms-validation-books-clients

## Why

Para expandir el catálogo y preparar la operatoria de ventas de la librería, el sistema necesita permitir el alta de nuevos libros y clientes desde la interfaz de usuario. Este change incorpora formularios accesibles con validaciones estrictas en el cliente (unicidad, normalización y tipos), bloqueo de recarga mediante `event.preventDefault()` y actualización reactiva inmediata en memoria de las vistas vinculadas sin alterar la compatibilidad con `file://`.

## What Changes

- **Módulo de Validaciones Puras (`js/utils/validators.js`)**: Funciones reutilizables y sin efectos secundarios para validar obligatoriedad (`validateRequired`), normalización y unicidad de ISBN (`validateISBN`), precio estrictamente positivo (`validatePrice`), formato y unicidad de email (`validateEmail`), y selección válida de autores (`validateAuthorsSelection`).
- **Controlador y Vista de Alta de Libros (`js/views/libros.view.js`)**: Interceptación del formulario `#form-libro`, poblado dinámico de editoriales, géneros y autores desde el estado, validaciones de negocio (RN-LIB-01 a RN-LIB-05), emisión de mensajes de error/éxito accesibles (`aria-live`), reseteo del formulario y actualización reactiva del catálogo y listados (RN-LIB-06).
- **Controlador y Vista de Alta de Clientes (`js/views/clientes.view.js`)**: Interceptación del formulario `#form-cliente`, validaciones de nombre y unicidad de email (RN-CLI-01 a RN-CLI-03), emisión de notificaciones accesibles, renderizado reactivo de la tabla de nómina de clientes registrados en `#clientes`, reseteo del formulario y actualización reactiva de las colecciones locales (RN-CLI-04).
- **Ampliación del Almacén de Estado (`js/state.js`)**: Incorporación de métodos de mutación controlada `addLibro(libro)` y `addCliente(cliente)` que retornan copias inmutables y notifican a observadores o suscriptores de cambios.
- **Estructura HTML en `index.html`**: Maquetación semántica y accesible de formularios en las secciones `<section id="libros">` y `<section id="clientes">` con labels asociados (`for`/`id`), atributos de accesibilidad (`aria-describedby`, `aria-invalid`, `aria-live`) y contenedores para mensajes de feedback.
- **Estilos de Formularios y Mensajes (`css/components.css` y `css/views.css`)**: Reglas de estilos para campos de formulario, controles de selección múltiple, indicadores de error inline y banners de confirmación con contraste WCAG AA.
- **Pruebas Automatizadas (`tests/test-c03.js`)**: Suite de tests unitarios y de integración para validadores y altas de libros y clientes.

## Capabilities

### New Capabilities
- `book-management`: Formulario de alta y validaciones de negocio para nuevos libros (título obligatorio, ISBN único normalizado, precio positivo, autor y editorial existentes, género con soporte «Sin clasificar») e incorporación reactiva al catálogo.
- `client-management`: Formulario de alta y validaciones de negocio para clientes (nombre obligatorio, email válido y único insensible a mayúsculas/minúsculas) e incorporación reactiva al estado.

### Modified Capabilities
<!-- Ninguna especificación existente cambia sus requisitos fundamentales; catalog-search y spa-shell se mantienen intactas y se consumen mediante los contratos vigentes. -->

## Impact

- **Archivos creados**:
  - `js/utils/validators.js`
  - `js/views/libros.view.js`
  - `js/views/clientes.view.js`
  - `tests/test-c03.js`
- **Archivos modificados**:
  - `index.html` (formularios semánticos en `#libros` y `#clientes`, enlaces de scripts diferidos sin `type=module`)
  - `js/state.js` (métodos `addLibro`, `addCliente`, sistema de eventos o suscripciones)
  - `js/app.js` (inicialización de vistas de libros y clientes)
  - `css/components.css` y `css/views.css` (estilos para formularios, mensajes de error y badges)
- **Dependencias y compatibilidad**:
  - Continúa 100% JavaScript nativo (vanilla), sin npm ni librerías externas.
  - Ejecución directa verificada con protocolo `file://` (doble clic) y bajo servidor HTTP local.
