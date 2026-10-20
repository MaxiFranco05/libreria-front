# Tasks: C-03 forms-validation-books-clients

## 1. Módulo de Validadores Puros y Pruebas Unitarias

- [x] 1.1 Implementar funciones de validación puras en `js/utils/validators.js` (`validateRequired`, `normalizeISBN`, `validateISBN`, `validatePrice`, `validateEmail`, `validateAuthorsSelection`) y verificar la correcta exportación y firma.
- [x] 1.2 Crear suite de tests automatizada `tests/test-c03.js` con cobertura exhaustiva de validaciones (ISBN con guiones/espacios, unicidad, precios negativos/cero/válidos, formatos de email y autores) y verificar ejecución con `node tests/test-c03.js`.

## 2. Almacén de Estado y Reactividad

- [x] 2.1 Extender `LibreriaState` en `js/state.js` con métodos `addLibro`/`addCliente` (como mutaciones inmutables y alias de `addBook`/`addClient`), emisión de eventos `'libros:updated'` y `'clientes:updated'`, y método `on(event, handler)` preservando retrocompatibilidad total con `subscribe` y los tests de C-02.
- [x] 2.2 Suscribir `CatalogoView` (`js/views/catalogo.view.js`) al evento `'libros:updated'` para refrescar el catálogo automáticamente ante nuevas altas y verificar con pruebas automatizadas.

## 3. Vistas y Formularios de Alta

- [x] 3.1 Maquetar la estructura semántica y accesible de formularios en `index.html` para `#form-libro` y `#form-cliente` con labels (`for`/`id`), atributos de accesibilidad (`aria-describedby`, `aria-live`), contenedores de feedback y contenedor de tabla para la nómina de clientes (`table-responsive`).
- [x] 3.2 Añadir reglas de estilo en `css/components.css` y `css/views.css` para controles de formulario, selectores, grupos de checkboxes de autor y banners de error/éxito con contraste WCAG AA sin desborde horizontal.
- [x] 3.3 Construir el controlador de vista `js/views/libros.view.js` con poblado dinámico de selects/checkboxes desde el estado, interceptación con `preventDefault()`, validaciones, feedback accesible y reseteo limpio.
- [x] 3.4 Construir el controlador de vista `js/views/clientes.view.js` con interceptación con `preventDefault()`, validación de nombre y unicidad de email, mensajes accesibles, renderizado reactivo de la tabla de nómina de clientes (`table-responsive`) y reseteo limpio del formulario.

## 4. Integración y Verificación Integral

- [x] 4.1 Enlazar `validators.js`, `libros.view.js` y `clientes.view.js` en `index.html` con atributos `defer` (sin `type="module"`) e inicializarlos en `js/app.js` garantizando compatibilidad con protocolo `file://`.
- [x] 4.2 Ejecutar las suites completas `tests/test-c01.js`, `tests/test-c02.js` y `tests/test-c03.js` y verificar que el 100% de las pruebas pasen con éxito sin regresiones.
