# Design

## Context

Este diseño define la solución técnica para el modelado relacional de datos en memoria, la semilla inicial y el renderizado y búsqueda interactiva del catálogo (ver `proposal.md` y `knowledge-base/04_modelo_de_datos.md` / `08_arquitectura_propuesta.md`). Toda la gestión se ejecuta en el navegador con JavaScript nativo ES6+, sin dependencias externas, asegurando compatibilidad con el shell SPA creado en `C-01` y con apertura directa `file://`.

## Goals / Non-Goals

**Goals:**
- Implementar el store centralizado en memoria `js/state.js` (`window.LibreriaApp.state`) con colecciones para `libros`, `editoriales`, `generos`, `autores`, `clientes` y `ventas`.
- Inyectar en `js/seed.js` la semilla obligatoria del parcial con 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes, incluyendo el libro de Enríquez con género nulo («Sin clasificar»).
- Implementar funciones puras en `js/utils/formatters.js` para formateo monetario fijo a dos decimales (`$0.00`) y resolución relacional de entidades asociadas.
- Construir `js/views/catalogo.view.js` con renderizado seguro de nodos DOM (sin `.innerHTML` inseguro) y filtrado dinámico por título insensible a mayúsculas y espacios.
- Proveer accesibilidad en la búsqueda con `<label>` visible y región `aria-live="polite"` para anunciar resultados.

**Non-Goals:**
- No incluye persistencia en `localStorage` (alcance de `C-05`).
- No incluye formularios ni validaciones de altas de libros o clientes (alcance de `C-03`).
- No incluye lógica de ventas, renglones ni precios históricos congelados (alcance de `C-04`).
- No incluye ABMs de editoriales, géneros o autores (entidades fijas según regla dura 4 de `AGENTS.md`).

## Decisions

### Decisión 1: Store centralizado en memoria con inmutabilidad defensiva
- **Elección**: `window.LibreriaApp.state` encapsulado en un módulo con métodos de consulta (`getBooks()`, `getClients()`, `getEditorials()`, `getGenres()`, `getAuthors()`) que devuelven copias superficiales (`[...coleccion]`), y métodos de mutación controlados (`addBook()`, `addClient()`, etc.).
- **Justificación**: Protege el estado global contra mutaciones externas no controladas y prepara el terreno para que `C-03`, `C-04` y `C-05` interactúen con una fuente de verdad única y predecible.
- **Alternativa descartada**: Variables globales sueltas o mutación directa de arrays en el objeto global.

### Decisión 2: Creación segura de elementos DOM sin `.innerHTML`
- **Elección**: Las tarjetas de libros y los mensajes informativos se construirán instanciando nodos con `document.createElement()`, asignando clases mediante `classList.add()` y seteando contenido textual exclusivamente con `.textContent`.
- **Justificación**: Cumple estrictamente con la regla contractual 5 de `AGENTS.md` ("NUNCA usar .innerHTML con datos no sanitizados") protegiendo la aplicación contra vectores XSS.
- **Alternativa descartada**: Concatenación de cadenas HTML e inyección mediante `.innerHTML`.

### Decisión 3: Formateo monetario determinístico
- **Elección**: Función pura `formatCurrency(val)` que realiza `'$' + Number(val).toFixed(2)` controlando que valores inválidos devuelvan `'$0.00'`.
- **Justificación**: Garantiza que sin importar la configuración regional o idioma del navegador (ej. es-AR vs en-US), la salida de importes mantenga el formato exacto requerido por consigna con dos decimales y el prefijo de pesos.

### Decisión 4: Motor de búsqueda en tiempo real reactivo al evento `input`
- **Elección**: La barra de búsqueda escucha el evento nativo `input` del elemento `<input type="search">`. En cada pulsación, normaliza el texto (`query.trim().toLowerCase()`), filtra `state.getBooks()` y ejecuta el re-renderizado del contenedor.
- **Justificación**: Al tratarse de una colección local de libros en memoria, el filtrado nativo con `.filter()` y `.includes()` se ejecuta en microsegundos, brindando una respuesta inmediata y fluida sin latencia.

## Risks / Trade-offs

- **[Riesgo] Ausencia de datos al recargar la página antes de la fase de persistencia**
  → *Mitigación*: En esta fase `C-02`, el store se puebla automáticamente al inicio con los datos de `js/seed.js` en memoria. En `C-05` se agregará el adaptador de `localStorage` con la bandera `libreria_inicializada` respetando la regla 8 de `AGENTS.md`.
- **[Riesgo] Pérdida de accesibilidad en lectores de pantalla durante búsquedas rápidas**
  → *Mitigación*: Se incorpora un elemento `<p class="visually-hidden" aria-live="polite" id="search-status">` que comunica el recuento de coincidencias tras cada filtrado.
