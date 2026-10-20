# Proposal

## Why

Para implementar la aplicación web de gestión de librería requerida por el Parcial 1 de Programación III (UTN) es imprescindible establecer primero la base estructural, semántica y visual de la aplicación. Sin un shell semántico Single Page Application (SPA), un sistema de diseño responsivo editorial sin dependencias y un enrutador por hash liviano y accesible por teclado, no es posible construir ni evaluar las vistas de catálogo, altas, ventas e historial garantizando soporte de 320px a 1280px y ejecución inmediata vía `file://`.

## What Changes

- Creación del archivo raíz `index.html` con maquetación semántica HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
- Definición de 5 secciones de vista en el DOM: `#catalogo`, `#libros`, `#clientes`, `#ventas` e `#historial`.
- Creación del enrutador SPA nativo en `js/router.js` que escucha los eventos `hashchange` y `DOMContentLoaded`, alternando la visibilidad de vistas mediante clases CSS (`.active`) y asignando fallback predeterminado a `#catalogo`.
- Indicación de accesibilidad en navegación actualizando dinámicamente `aria-current="page"` en el enlace activo del menú de navegación.
- Implementación de un skip-link accesible para permitir a usuarios de teclado saltar directamente al contenido principal (`<main id="main-content">`).
- Creación de la arquitectura de estilos CSS modular en `css/`:
  - `css/base.css`: reset moderno, variables CSS para diseño editorial cálido (`--bg-primary: #FDFBF7`, `--text-primary: #2B2D42`, `--accent-primary: #C85A32`, `--accent-navy: #1D3557`), tipografía legible y ratios de contraste WCAG AA (> 4.5:1).
  - `css/layout.css`: contenedores fluidos con CSS Grid y Flexbox, soporte de breakpoints responsivos (320px, 768px, 1280px) y prevención estricta de scroll horizontal en ventana (`overflow-x: hidden` en raíz y wrappers con `overflow-x: auto` para tablas).
  - `css/components.css`: estilos base de botones, tarjetas, campos de formulario accesibles y badges.
  - `css/views.css`: estilos contextuales y placeholders para cada una de las 5 secciones.
- Estilos de foco visible accesible mediante `:focus-visible` con contorno de 2px de alto contraste en todos los elementos interactivos.
- Inicialización básica de la aplicación en `js/app.js` coordinando el enrutador y la preparación del DOM sin dependencias externas ni compiladores.

## Capabilities

### New Capabilities
- `spa-shell`: Estructura semántica SPA, navegación por hash entre vistas sin recarga de página, adaptación responsiva fluida de 320px a 1280px y pautas de accesibilidad con navegación por teclado y foco visible.

### Modified Capabilities
*(Ninguna - primer change del proyecto)*

## Impact

- **Archivos creados**: `index.html`, `css/base.css`, `css/layout.css`, `css/components.css`, `css/views.css`, `js/app.js`, `js/router.js`, `assets/`.
- **APIs y dependencias**: 100% JavaScript nativo ES6+, HTML5 y CSS3 nativo. Cero dependencias npm, cero librerías externas o CDNs.
- **Compatibilidad**: Funciona de forma idéntica al abrirse directamente mediante protocolo `file://` (doble clic sobre `index.html`) o servido a través de cualquier servidor web HTTP local.
- **Contrato con siguientes changes**: `C-02` (catálogo), `C-03` (formularios de libros y clientes), `C-04` (ventas) y `C-05` (persistencia) inyectarán su lógica y contenido dentro de las secciones semánticas creadas en este change.
