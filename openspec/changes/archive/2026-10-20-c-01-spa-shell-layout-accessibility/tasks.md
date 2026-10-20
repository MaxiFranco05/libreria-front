# Tasks

## 1. Scaffolding y Marcado Semántico HTML5

- [x] 1.1 Crear la estructura de directorios (`css/`, `js/`, `assets/`) y el archivo base `index.html` con marcado semántico HTML5 (`<header>`, `<nav>`, `<main id="main-content">`, cinco `<section class="view-section">` con IDs `catalogo`, `libros`, `clientes`, `ventas` e `historial`, y `<footer>`), verificando la correcta jerarquía semántica en el DOM.
- [x] 1.2 Agregar el skip-link accesible (`<a href="#main-content" class="skip-link">Saltar al contenido principal</a>`) y los títulos `<h2>` con `tabindex="-1"` en cada sección de vista, verificando que los enlaces de navegación del menú apunten a los hashes correspondientes (`#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial`).

## 2. Sistema de Diseño CSS Modular y Responsivo

- [x] 2.1 Implementar `css/base.css` con reset moderno, variables CSS para la paleta editorial cálida (`--bg-primary: #FDFBF7`, `--bg-surface: #FFFFFF`, `--text-primary: #2B2D42`, `--accent-primary: #C85A32`, `--accent-navy: #1D3557`), tipografía legible y verificación de ratios de contraste WCAG AA (> 4.5:1).
- [x] 2.2 Implementar `css/layout.css` con grillas y cajas flexibles para header institucional, barra de navegación sticky/superior, contenedor principal fluido y footer, asegurando la regla de visualización de vistas (`.view-section:not(.active) { display: none; }`).
- [x] 2.3 Implementar `css/components.css` y `css/views.css` con estilos para botones base, tarjetas, campos de formulario accesibles, contenedores `.table-responsive` con `overflow-x: auto` y reglas de `:focus-visible` con contorno de alto contraste de 2px.

## 3. Enrutador SPA y Ciclo de Vida

- [x] 3.1 Implementar `js/router.js` escuchando `hashchange` y `DOMContentLoaded` para conmutar la clase `.active` en la vista seleccionada, aplicar fallback predeterminado a `#catalogo` ante hash vacío o inválido, actualizar `aria-current="page"` en el menú y transferir el foco al `<h2>` de la sección activa.
- [x] 3.2 Implementar `js/app.js` coordinando la inicialización del enrutador y enlazando los scripts con `defer` en `index.html` en el orden correcto dentro del espacio de nombres `window.LibreriaApp`, sin usar ES modules en el navegador.

## 4. Verificación Integral y Accesibilidad

- [x] 4.1 Verificar la apertura dual y ejecución libre de errores abriendo `index.html` directamente mediante protocolo `file://` (doble clic) y bajo servidor HTTP local, comprobando cero advertencias o excepciones en consola.
- [x] 4.2 Verificar la navegación asistiva por teclado comprobando que la tecla `Tab` permite recorrer secuencialmente el skip-link, los enlaces de navegación y los controles interactivos manteniendo el indicador visual `:focus-visible` en todo momento.
- [x] 4.3 Comprobar la respuesta adaptativa del layout en anchos de 320px, 768px y 1280px, confirmando la ausencia de barra de scroll horizontal en la ventana principal (`window`).
