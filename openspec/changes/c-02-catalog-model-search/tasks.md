# Tasks

## 1. Modelo de Datos en Memoria y Semilla Inicial

- [x] 1.1 Implementar `js/state.js` con el store centralizado en memoria `window.LibreriaApp.state` gestionando las colecciones `libros`, `editoriales`, `generos`, `autores`, `clientes` y `ventas`, exponiendo métodos inmutables de lectura (`getBooks`, `getEditorials`, etc.) y mutación (`setBooks`, `addBook`, etc.), verificando su estructura con pruebas unitarias.
- [x] 1.2 Implementar `js/seed.js` con la semilla inicial completa que incluya las 2 editoriales, 2 géneros, 3 autores, 3 clientes y los 6 libros obligatorios (incluyendo el libro con `generoId: null`), verificando la integridad de datos relacionales en memoria.

## 2. Utilidades de Formateo y Resolución Relacional

- [x] 2.1 Implementar `js/utils/formatters.js` con las funciones puras `formatCurrency` (formato `$0.00` con 2 decimales fijos), `getEditorialName` (resolución por ID), `getGeneroName` (resolución por ID con retorno de «Sin clasificar» si es null/vacío) y `formatAuthors` (concatenación por comas), verificando su comportamiento ante casos válidos y valores extremos.

## 3. Vista de Catálogo y Buscador Interactivo

- [x] 3.1 Actualizar `index.html` para estructurar la barra de búsqueda accesible con `<label for="catalogo-search">`, input de tipo `search`, región `aria-live="polite"` y el contenedor de la grilla de libros en la sección `#catalogo`.
- [x] 3.2 Implementar `js/views/catalogo.view.js` con la lógica de renderizado seguro de tarjetas de libros (creación de nodos DOM con `createElement` y `.textContent`, sin `.innerHTML`), y el filtrado en tiempo real reactivo al evento `input` que aplique `toLowerCase`, coincidencia parcial por subcadena, `trim`, restauración ante término vacío y mensaje explicativo cuando no existan resultados.
- [x] 3.3 Integrar los nuevos módulos en `js/app.js` asegurando la carga secuencial de `state.js`, `seed.js`, `formatters.js` y `catalogo.view.js` mediante `<script defer>` en `index.html`, verificando la inicialización del catálogo en la carga inicial.

## 4. Verificación Automatizada y Accesibilidad

- [x] 4.1 Crear y ejecutar la suite automatizada `tests/test-c02.js` comprobando la carga de los 6 libros semilla, el formateo de precios y nombres, el comportamiento de búsqueda en mayúsculas, minúsculas y espacios extremos, la visualización de «Sin clasificar», y el despliegue del mensaje de no coincidencias.
- [x] 4.2 Validar la navegación por teclado en la barra de búsqueda y tarjetas de catálogo con indicador `:focus-visible` activo y compatibilidad directa en ejecución `file://` y HTTP local sin errores de consola.
