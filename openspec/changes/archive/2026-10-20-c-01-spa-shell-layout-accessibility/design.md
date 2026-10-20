# Design

## Context

Este diseño define la solución técnica para el shell SPA, navegación, arquitectura CSS y accesibilidad (ver `proposal.md` y `knowledge-base/08_arquitectura_propuesta.md`). La aplicación debe operar al 100% como Single Page Application en el navegador utilizando vanilla HTML5/CSS3/JavaScript, respetando la regla contractual del proyecto de funcionar de forma idéntica bajo apertura directa `file://` (doble clic) y bajo servidor HTTP local, sin compiladores, sin paquetes npm ni librerías externas.

## Goals / Non-Goals

**Goals:**
- Implementar el marcado semántico completo en `index.html` con las 5 secciones de vista (`#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial`).
- Implementar un enrutador por hash nativo (`js/router.js`) con soporte de fallback automático a `#catalogo` y gestión de `aria-current="page"`.
- Estructurar el sistema de diseño CSS en 4 archivos modulares (`base.css`, `layout.css`, `components.css`, `views.css`) con variables de diseño editorial cálido, ratios de contraste WCAG AA (> 4.5:1) y soporte responsivo de 320px a 1280px.
- Garantizar accesibilidad por teclado completa: skip-link al contenido principal, `:focus-visible` de alto contraste (2px) y transferencia de foco al titular de la vista activa.
- Garantizar cero errores de consola y ejecución fluida mediante `file://` y HTTP local.

**Non-Goals:**
- No incluye el renderizado de datos semilla ni la búsqueda de catálogo (alcance de `C-02`).
- No incluye formularios funcionales ni validaciones de libros/clientes (alcance de `C-03`).
- No incluye lógica de ventas, renglones ni precios históricos (alcance de `C-04`).
- No incluye persistencia ni manipulación de `localStorage` (alcance de `C-05`).

## Decisions

### Decisión 1: Enrutamiento por Hash en lugar de History API (`pushState`)
- **Elección**: Router cliente basado en `window.location.hash` y eventos `hashchange` + `DOMContentLoaded`.
- **Justificación**: El protocolo `file:///` bloquea o restringe llamadas a `history.pushState()` para modificar la ruta en la mayoría de los navegadores por políticas de origen de seguridad. El hash es universalmente seguro, no genera peticiones de red, permite enlaces directos (deep linking interno) y funciona idéntico en `file://` y en servidores HTTP.
- **Alternativa descartada**: History API / HTML5 pushState (requiere servidor web y configuración de reescritura de URLs para no dar 404).

### Decisión 2: Visibilidad de vistas mediante clases CSS (`.active`) y DOM persistente
- **Elección**: Todas las vistas (`<section class="view-section">`) coexisten en el DOM dentro de `<main id="main-content">`. La clase `.active` aplica `display: block`, mientras que las vistas inactivas tienen `display: none`.
- **Justificación**: Mantiene el HTML limpio y semántico. Evita la destrucción y recreación innecesaria del DOM, preservando el estado de inputs y formularios al navegar entre pantallas. Elimina riesgos de inyección XSS asociados a la inserción de plantillas HTML mediante cadenas.
- **Alternativa descartada**: Destruir e inyectar HTML en `<main>` con `.innerHTML` en cada cambio de ruta.

### Decisión 3: Carga de scripts sin módulos ES6 en navegador
- **Elección**: Los scripts se cargan mediante etiquetas `<script defer src="...">` en orden de dependencia en `index.html`. La comunicación y exposición se organiza bajo un namespace global limpio (`window.LibreriaApp`).
- **Justificación**: Los navegadores modernos bloquean `<script type="module">` con errores de CORS cuando se abre un archivo local con protocolo `file:///`. Para cumplir la regla dura de "doble clic inmediato", el código se estructura con funciones puras y objetos organizados sin la directiva `import/export` nativa en el navegador.
- **Alternativa descartada**: Bundlers (Webpack, Vite) o ES Modules nativos (violan la apertura vía `file://` sin servidor HTTP o introducen dependencias npm prohibidas).

### Decisión 4: Arquitectura CSS modular en 4 capas
- **Elección**:
  1. `base.css`: Reset CSS moderno, tokens en `:root` (colores editoriales, tipografías, espaciados) y tipografía global.
  2. `layout.css`: Contenedores principales, `<header>`, `<nav>`, `<main>`, `<footer>`, media queries de 320px a 1280px y prevención de scroll horizontal.
  3. `components.css`: Clases reutilizables para botones (`.btn`), tarjetas (`.card`), inputs/selects (`.form-control`), badges y wrappers responsivos de tablas (`.table-responsive`).
  4. `views.css`: Estilos estructurales y contenedores propios de cada sección de la aplicación.
- **Justificación**: Facilita el desarrollo incremental. Los changes posteriores (`C-02` a `C-05`) sólo agregan estilos en `components.css` o `views.css` sin riesgo de romper el layout global.

### Decisión 5: Gestión accesible de foco en transiciones de ruta
- **Elección**: Cada sección `<section>` contiene un encabezado `<h2>` con `tabindex="-1"`. Al ejecutarse el cambio de ruta en `js/router.js`, tras activar la sección se llama a `section.querySelector('h2').focus()`.
- **Justificación**: Resuelve el problema común de las SPAs donde el foco del teclado se queda en el enlace del menú tras navegar, obligando a los usuarios de tecnología asistiva o teclado a tabular nuevamente por toda la página.

## Risks / Trade-offs

- **[Riesgo] Desbordes de layout en viewport móvil mínimo (320px)**
  → *Mitigación*: Declarar `box-sizing: border-box` en `*`, `max-width: 100%` en elementos bloque y definir contenedores de tabla con `overflow-x: auto` y margen negativo controlado.
- **[Riesgo] Parpadeo visual de vistas antes de la carga de JavaScript**
  → *Mitigación*: En `layout.css`, las secciones `.view-section:not(.active)` están ocultas por defecto (`display: none`), y solo la sección inicial `#catalogo` posee la clase `.active` en el HTML estático.
- **[Riesgo] Contraste insuficiente en la paleta de colores editorial**
  → *Mitigación*: Se calibran estrictamente los tokens (`--text-primary: #2B2D42` sobre `--bg-primary: #FDFBF7` ofrece ratio de contraste ~12:1, superando ampliamente el estándar WCAG AA de 4.5:1).
