# Proposal

## Why

Para cumplir los requisitos del Ejercicio 3 del Parcial 1 de Programación III (UTN), la aplicación necesita estructurar su modelo de datos relacional en memoria, inyectar la semilla inicial de datos obligatoria (6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes) y renderizar la vista interactiva de Catálogo en la sección `#catalogo`. Esto habilita la exploración de ejemplares con sus relaciones (editorial, autores, género o «Sin clasificar») y el filtrado por título en tiempo real con normalización de mayúsculas/minúsculas y espacios.

## What Changes

- Creación del almacén centralizado de estado en memoria en `js/state.js` (`window.LibreriaApp.state`) para gestionar las colecciones de `libros`, `editoriales`, `generos`, `autores`, `clientes` y `ventas`.
- Creación del módulo de datos semilla en `js/seed.js` con las entidades base exigidas por consigna: 6 libros (incluyendo el caso de género ausente «Sin clasificar»), 2 editoriales (Editorial Siglo XXI, Penguin Random House), 2 géneros (Ficción, Ensayo), 3 autores (Jorge Luis Borges, Julio Cortázar, Mariana Enríquez) y 3 clientes iniciales.
- Creación de utilidades puras de resolución y formateo en `js/utils/formatters.js`:
  - `formatCurrency(amount)`: Formato estándar en pesos con 2 decimales fijos (`$0.00`).
  - `formatAuthors(authorIds, authorsList)`: Resolución y concatenación legible de nombres de autores.
  - `getEditorialName(editorialId, editorialesList)`: Resolución de nombre de editorial.
  - `getGeneroName(generoId, generosList)`: Resolución de nombre de género con fallback explícito a «Sin clasificar» (RN-CAT-06).
- Creación de la vista de catálogo en `js/views/catalogo.view.js`:
  - Renderizado semántico de tarjetas de libros (título, ISBN, editorial, género/badge, autores y precio formateado).
  - Barra de búsqueda accesible por título con escucha reactiva en tiempo real al evento `input`.
  - Filtrado insensible a mayúsculas/minúsculas (`toLowerCase`, RN-CAT-01), coincidencia parcial por subcadena (RN-CAT-02) y recorte de espacios extremos (`trim`, RN-CAT-03).
  - Restauración completa de la lista al vaciar el término de búsqueda (RN-CAT-04).
  - Mensaje accesible claro cuando no existan coincidencias: *"No se encontraron libros que coincidan con la búsqueda"* (RN-CAT-05).
- Actualización de `index.html` para estructurar la barra de búsqueda y el contenedor dinámico de libros en `#catalogo`, cargando los nuevos módulos mediante `<script defer src="...">` en orden de dependencia sin `type="module"` para preservar la compatibilidad dual `file://` y HTTP.

## Capabilities

### New Capabilities
- `catalog-search`: Modelado relacional en memoria del catálogo y entidades base, inyección de datos semilla, formateo monetario y relacional, renderizado dinámico de tarjetas de libros y motor de búsqueda interactivo por título en tiempo real.

### Modified Capabilities
*(Ninguna)*

## Impact

- **Archivos creados**: `js/state.js`, `js/seed.js`, `js/utils/formatters.js`, `js/views/catalogo.view.js`, `tests/test-c02.js`.
- **Archivos modificados**: `index.html` (markup accesible de barra de búsqueda y grilla en `#catalogo`, más scripts con `defer`) y `js/app.js` (orquestación de inicialización de estado y render de catálogo).
- **APIs y dependencias**: 100% JavaScript vanilla ES6+, HTML5 semántico y CSS3 nativo. Cero dependencias npm y compatibilidad nativa garantizada mediante protocolo `file://` y servidores HTTP.
- **Contrato con siguientes changes**: `C-03` consumirá `state.js` para registrar libros y clientes; `C-04` lo consumirá para el selector de libros en ventas; `C-05` sincronizará este estado con `localStorage`.
