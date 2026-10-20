# spa-shell Specification

## Purpose
Provee el shell semántico de la aplicación web tipo Single Page Application (SPA), enrutamiento por hash sin recarga de página, adaptación de interfaz responsiva entre 320px y 1280px y accesibilidad completa por teclado.

## Requirements

### Requirement: Estructura semántica del shell SPA
La aplicación SHALL estructurarse mediante elementos semánticos HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) conteniendo cinco vistas identificables en el DOM (`#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial`).

#### Scenario: Carga inicial de elementos semánticos en el DOM
- **WHEN** el usuario carga `index.html` en el navegador
- **THEN** el DOM contiene un `<header>` con título de la librería, un menú de navegación `<nav>`, un contenedor `<main id="main-content">` con 5 elementos `<section>` correspondientes a las vistas, y un `<footer>` institucional

### Requirement: Enrutamiento por hash y alternancia de vistas
El enrutador SHALL escuchar los eventos `hashchange` y `DOMContentLoaded` para mostrar exclusivamente la sección asociada al hash actual (mediante clase `.active`) y ocultar las cuatro restantes, aplicando `#catalogo` como vista predeterminada si el hash está vacío o no coincide con una vista válida.

#### Scenario: Navegación a vista válida
- **WHEN** el hash de la URL cambia a `#libros`
- **THEN** la sección con id `libros` recibe la clase `.active`, se vuelve visible, y las secciones restantes quedan ocultas

#### Scenario: Fallback ante hash vacío o desconocido
- **WHEN** la URL no contiene hash o contiene un hash no reconocido como `#desconocido`
- **THEN** el enrutador redirige a `#catalogo`, mostrando únicamente la vista de catálogo

### Requirement: Accesibilidad de navegación y foco de teclado
La navegación SHALL indicar el estado activo mediante el atributo `aria-current="page"` en el enlace del menú correspondiente a la vista visible, proveer un enlace de salto directo (skip-link) al contenido principal y mantener un indicador visual de foco consistente (`:focus-visible`) en todos los controles interactivos.

#### Scenario: Actualización de enlace activo en el menú
- **WHEN** la vista `#clientes` se activa
- **THEN** el enlace de navegación hacia `#clientes` posee el atributo `aria-current="page"`, mientras que los demás enlaces de navegación carecen de dicho atributo

#### Scenario: Navegación interactiva por teclado
- **WHEN** el usuario navega la interfaz utilizando la tecla `Tab`
- **THEN** cada enlace y botón recibe foco visible con un contorno de alto contraste (mínimo 2px) y el primer elemento focuseable es el skip-link al contenido principal

### Requirement: Diseño responsivo y prevención de scroll horizontal
La interfaz SHALL adaptarse de forma fluida a pantallas entre 320px y 1280px de ancho sin generar scroll horizontal en la ventana principal (`window`), confinando el desplazamiento horizontal exclusivamente a contenedores dedicados (`overflow-x: auto`) para tablas o listados que excedan el ancho del viewport.

#### Scenario: Visualización en viewport móvil de 320px
- **WHEN** la ventana del navegador se ajusta a un ancho de 320 píxeles
- **THEN** el cuerpo del documento y la ventana principal no presentan barra de scroll horizontal y los elementos del layout se apilan o ajustan verticalmente

#### Scenario: Visualización en viewport de escritorio de 1280px
- **WHEN** la ventana del navegador se ajusta a un ancho de 1280 píxeles
- **THEN** el layout distribuye el contenido aprovechando el ancho disponible con márgenes centrados y sin desbordes laterales

### Requirement: Compatibilidad de ejecución dual
La aplicación SHALL ejecutarse de forma completa e idéntica tanto al ser abierta directamente mediante protocolo `file://` (doble clic) como al ser servida a través de un servidor HTTP local, sin emitir errores de consola ni requerir dependencias npm o procesos de compilación.

#### Scenario: Apertura directa mediante file://
- **WHEN** el usuario abre el archivo `index.html` directamente con protocolo `file://`
- **THEN** la aplicación inicia correctamente, el router activa `#catalogo` y no se producen excepciones de seguridad o errores de carga de módulos en la consola del navegador
