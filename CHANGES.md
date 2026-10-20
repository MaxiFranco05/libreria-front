# CHANGES — Secuencia de Implementación

> Índice canónico de todos los changes del proyecto **Librería UTN (Parcial 1 - Programación III)**.
> Cada change es atómico: un agente puede implementarlo en una sesión (~4-6 horas).
> **Leer este archivo antes de ejecutar cualquier `/opsx:propose`.**

---

## Cómo usar este documento

1. Identificar el change a implementar (verificar que sus dependencias están en `openspec/changes/archive/`).
2. Leer los docs de la knowledge-base indicados en "Leer antes".
3. Ejecutar `/opsx:propose <nombre-del-change>`.
4. Al terminar el change, archivarlo con `/opsx:archive <nombre-del-change>`.
5. Marcar el checkbox `[x]` en este archivo.

---

## Árbol de dependencias

```
C-01 spa-shell-layout-accessibility
  └── C-02 catalog-model-search
        └── C-03 forms-validation-books-clients
              └── C-04 sales-simulation-historical-price
                    └── C-05 localstorage-persistence-lifecycle
                          └── C-06 technical-documentation-test-cases
```

### Paralelismo por fase

> Cada "gate" es un punto de sincronización secuencial del pipeline de ejercicios del parcial.

```
GATE 0: ninguna
  → C-01 spa-shell-layout-accessibility             [Agente A]

GATE 1: C-01 ✓
  → C-02 catalog-model-search                       [Agente A]

GATE 2: C-02 ✓
  → C-03 forms-validation-books-clients             [Agente B]

GATE 3: C-03 ✓
  → C-04 sales-simulation-historical-price          [Agente A]

GATE 4: C-04 ✓
  → C-05 localstorage-persistence-lifecycle         [Agente C]

GATE 5: C-05 ✓
  → C-06 technical-documentation-test-cases         [Agente C]
```

### Camino crítico (6 changes — mínimo irreducible)

```
C-01 → C-02 → C-03 → C-04 → C-05 → C-06
```

### Plan óptimo con 3 agentes

```
Paso │ Agente A (Core & Ventas)                 │ Agente B (UI & Formularios)           │ Agente C (Persistencia & Docs)
─────┼──────────────────────────────────────────┼───────────────────────────────────────┼───────────────────────────────
  1  │ C-01 spa-shell-layout-accessibility      │                   —                   │               —
  2  │ C-02 catalog-model-search                │                   —                   │               —
  3  │                    —                     │ C-03 forms-validation-books-clients   │               —
  4  │ C-04 sales-simulation-historical-price   │                   —                   │               —
  5  │                    —                     │                   —                   │ C-05 localstorage-persistence-lifecycle
  6  │                    —                     │                   —                   │ C-06 technical-documentation-test-cases
```

---

## FASE 1 — Cimientos de Interfaz y Navegación SPA

### [C-01] `spa-shell-layout-accessibility`
- **Estado**: `[x]` completado (archivado 2026-10-20)
- **Scope**: Scaffolding base de la aplicación Single Page Application (SPA), marcado semántico HTML5, sistema de diseño responsivo y pautas de accesibilidad por teclado (Ejercicios 1 y 2 de consigna).
  - Estructura de archivos y directorios: `index.html`, `css/base.css`, `css/layout.css`, `css/components.css`, `css/views.css`, `js/app.js`, `js/router.js`, `assets/`.
  - Markup semántico en `index.html`: `<header>` con identidad visual institucional, `<nav>` accesible con lista de enlaces de navegación (`#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial`), `<main>` contenedor con 5 secciones semánticas `<section id="...">` correspondientes a cada vista, y `<footer>` con datos de cátedra y autoría.
  - Enrutador por hash en `js/router.js`: escucha del evento `hashchange` y carga inicial `DOMContentLoaded`, activación de sección correspondiente mediante clase `.active` y ocultamiento del resto, fallback automático a `#catalogo` si no hay hash o es inválido, y actualización de atributo `aria-current="page"` en el enlace activo.
  - Sistema de estilos modular en `css/`:
    - `base.css`: reset moderno, variables CSS de diseño editorial cálido (`--bg-primary: #FDFBF7`, `--bg-surface: #FFFFFF`, `--text-primary: #2B2D42`, `--accent-primary: #C85A32`, `--accent-navy: #1D3557`), tipografía legible y ratios de contraste superiores a 4.5:1 (WCAG AA).
    - `layout.css`: grillas y cajas flexibles fluidas, breakpoints responsivos testeados en 320px, 768px y 1280px sin desborde horizontal global en ventana (`overflow-x: hidden` en body/root y `overflow-x: auto` en contenedores de tablas).
    - `components.css`: botones semánticos, campos de formulario accesibles, tablas estilizadas, tarjetas de libro y badges de estado.
    - `views.css`: estilos contextuales para secciones de catálogo, formularios de alta, panel de ventas y tabla de historial.
  - Accesibilidad e interacción por teclado: indicador de foco visible consistente (`:focus-visible` con contorno de alto contraste de 2px), navegación completa mediante tecla `Tab`, skip-link para saltar al contenido principal, etiquetas asociadas a controles con `for`/`id` y atributos `aria-label` / `aria-labelledby`.
  - Compatibilidad de apertura dual: verificación de ejecución libre de errores abriendo `index.html` directamente mediante protocolo `file://` (doble clic) y bajo servidor HTTP local sin compiladores ni dependencias npm.
  - Tests manuales y de interfaz: verificación de cambio de vistas sin recarga de página, adaptación responsiva en resoluciones de 320px a 1280px y navegación por teclado en todos los controles interactivos.
- **Dependencias**: ninguna
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/01_vision_y_objetivos.md` §Objetivos del sistema y alcance
  - `knowledge-base/02_descripcion_general.md` §Stack tecnológico y restricciones
  - `knowledge-base/06_funcionalidades.md` §Épica 1 (US-001) y Épica 5 (US-008)
  - `knowledge-base/08_arquitectura_propuesta.md` §Estructura de directorios y patrones SPA
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-01 (SPA), DD-02 (file://) y DD-03 (Identidad visual)

---

## FASE 2 — Modelo Core, Catálogo y Búsqueda

### [C-02] `catalog-model-search`
- **Estado**: `[x]` completado
- **Scope**: Modelado de datos relacional en memoria, inyección de semilla de datos iniciales requerida por consigna y renderizado de catálogo con buscador en tiempo real por título (Ejercicio 3 de consigna).
  - Módulos core de datos:
    - `js/state.js`: almacén centralizado de estado en memoria (`app.state`) para colecciones de `libros`, `editoriales`, `generos`, `autores`, `clientes` y `ventas`.
    - `js/seed.js`: datos semilla iniciales obligatorios con 6 libros completos, 2 editoriales (Siglo XXI, Penguin Random House), 2 géneros (Ficción, Ensayo), 3 autores (Borges, Cortázar, Enríquez) y 3 clientes (Pérez, Gómez, Rodríguez), contemplando libro con género «Sin clasificar».
  - Módulo de formato y utilidades en `js/utils/formatters.js`: formateo de moneda estándar (`$0.00` con 2 decimales fijos), concatenación legible de autores y resolución de nombres descriptivos de editorial y género a partir de sus IDs.
  - Vista de catálogo en `js/views/catalogo.view.js`:
    - Renderizado de tarjetas o filas semánticas en la sección `#catalogo` exhibiendo: título, ISBN, precio formateado, editorial, género asignado (o leyenda explícita «Sin clasificar» si es null/vacío según RN-CAT-06) y lista de autores asociados.
    - Barra de búsqueda interactiva por título: escucha de evento `input` con filtrado dinámico en memoria.
    - Reglas de filtrado de catálogo: comparación insensible a mayúsculas/minúsculas (`toLowerCase`, RN-CAT-01), coincidencia parcial por subcadena en cualquier posición del título (RN-CAT-02) y eliminación de espacios en blanco extremos antes de comparar (`trim`, RN-CAT-03).
    - Estados visuales del buscador: restauración inmediata de todo el catálogo cuando el término de búsqueda está vacío (RN-CAT-04) y visualización de mensaje accesible y claro "No se encontraron libros que coincidan con la búsqueda" cuando ningún título coincide (RN-CAT-05).
  - Tests funcionales: verificación de renderizado de los 6 libros semilla, búsqueda con texto en minúsculas, mayúsculas y mixto, búsqueda con espacios exteriores, búsqueda sin coincidencias y visualización de etiqueta «Sin clasificar».
- **Dependencias**: `C-01`
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Entidades y Seed data inicial
  - `knowledge-base/05_reglas_de_negocio.md` §Dominio: Catálogo y Búsqueda (RN-CAT-01 a RN-CAT-06)
  - `knowledge-base/06_funcionalidades.md` §Épica 2: Catálogo y Búsqueda de Libros (US-002)
  - `knowledge-base/07_flujos_principales.md` §Flujo 3: Inicialización y datos semilla
  - `knowledge-base/08_arquitectura_propuesta.md` §Store centralizado y formatters

---

## FASE 3 — Altas y Validación de Entidades

### [C-03] `forms-validation-books-clients`
- **Estado**: [x] completado (archivado 2026-10-20)
- **Scope**: Formularios de alta para libros y clientes con validaciones estrictas en cliente, interceptación de submit sin recarga y actualización reactiva de las vistas vinculadas (Ejercicio 4 de consigna).
  - Módulo desacoplado de validadores en `js/utils/validators.js`: funciones puras reutilizables para `validateRequired(value)`, `validateISBN(isbn, existingBooks)`, `validatePrice(price)`, `validateEmail(email, existingClients)` y `validateAuthorsSelection(authorIds)`.
  - Formulario y vista de libros en `js/views/libros.view.js`:
    - Campos en formulario `#form-libro`: Título, ISBN, Precio, Editorial (selector poblado dinámicamente desde `state.editoriales`), Género (selector con géneros y opción explícita «Sin clasificar») y Autores (selector múltiple o conjunto de checkboxes desde `state.autores`).
    - Validaciones de negocio: título obligatorio no vacío tras trim (RN-LIB-01), normalización de ISBN removiendo guiones y espacios (`isbn.replace(/[\s-]/g, '')`) y verificación de unicidad frente a libros existentes (RN-LIB-02), precio numérico estrictamente mayor a 0 (RN-LIB-03), y selección de al menos un autor existente (RN-LIB-04).
    - Interceptación con `event.preventDefault()`: bloqueo de recarga de página, exhibición de mensajes de error accesibles cerca de cada campo infractor y mensaje de confirmación de éxito.
    - Reactividad sin recarga: creación de entidad `Libro` con ID único, inserción en `state.libros`, reseteo limpio del formulario y re-renderizado automático del catálogo (`catalogo.view.js`), listado de libros y selectores de la vista de ventas (RN-LIB-06).
  - Formulario y vista de clientes en `js/views/clientes.view.js`:
    - Campos en formulario `#form-cliente`: Nombre completo y Correo electrónico.
    - Validaciones de negocio: campos no vacíos (RN-CLI-01), validación de formato estándar de correo mediante expresión regular (RN-CLI-02) y control de unicidad de email comparado sin espacios y en minúsculas (`email.trim().toLowerCase()`, RN-CLI-03).
    - Interceptación con `event.preventDefault()`: despliegue de mensajes de error o éxito, creación de entidad `Cliente`, agregado a `state.clientes`, reseteo del formulario y actualización reactiva del listado de clientes y del selector de clientes en la vista de ventas (RN-CLI-04).
  - Tests funcionales: rechazo de ISBN repetido (con y sin guiones), rechazo de precio negativo o cero, rechazo de email mal formado o duplicado con distintas mayúsculas, confirmación de alta válida y comprobación de actualización reactiva en catálogo y ventas sin recarga de página.
- **Dependencias**: `C-02`
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Entidades Libro y Cliente
  - `knowledge-base/05_reglas_de_negocio.md` §Dominio: Alta de Libros (RN-LIB-01 a RN-LIB-06) y Clientes (RN-CLI-01 a RN-CLI-04)
  - `knowledge-base/06_funcionalidades.md` §Épica 3: Gestión de Altas (US-003, US-004)
  - `knowledge-base/07_flujos_principales.md` §Flujo 2: Alta de Libros con Normalización de ISBN
  - `knowledge-base/08_arquitectura_propuesta.md` §Seguridad y Validación (XSS y prevención DOM)

---

## FASE 4 — Simulación de Ventas y Snapshot Histórico

### [C-04] `sales-simulation-historical-price`
- **Estado**: `[x]` completado (archivado 2026-10-20)
- **Scope**: Módulo interactivo de simulación de ventas con composición dinámica de renglones, cálculo de importes, congelamiento de precio histórico inmutable y consulta de historial de transacciones (Ejercicio 5 de consigna).
  - Vista de ventas en `js/views/ventas.view.js`:
    - Selector de cliente activo poblado reactivamente a partir de `state.clientes`.
    - Selector de libro disponible (desde `state.libros`) y campo de cantidad entera positiva (`cantidad >= 1`).
    - Botón "Agregar al pedido" con validación de renglón y control de duplicidad: si el libro ya está presente en el pedido en curso, incrementa la cantidad existente o emite aviso explicativo sin crear filas duplicadas (RN-VNT-03).
    - Canasta/tabla dinámica de renglones en borrador: columnas de Libro, Precio Unitario actual, Cantidad y Subtotal (`cantidad * precioUnitario`).
    - Controles interactivos por renglón: botones accesibles para modificar cantidad o eliminar renglón antes de la confirmación (RN-VNT-04).
    - Resumen financiero en tiempo real: cálculo dinámico del total general acumulado de la venta con 2 decimales (`$0.00`, RN-VNT-05).
  - Confirmación de orden de venta y snapshot histórico:
    - Validación obligatoria antes de confirmar: verificar selección de cliente (RN-VNT-01) y existencia de al menos un renglón válido (RN-VNT-02).
    - Creación de objeto `Venta`: generación de ID único (`VNT-XXXX`), fecha/hora legible actual y congelamiento de `RenglonVenta` conteniendo copia fija del `precioUnitario` vigente en catálogo en ese instante (RN-VNT-06).
    - Vaciado automático de la canasta temporal, reseteo del formulario de ventas y notificación de éxito (RN-VNT-08).
  - Vista de historial en `js/views/historial.view.js`:
    - Listado de ventas registradas con ID, fecha, nombre completo del cliente y total general.
    - Mecanismo interactivo accesible (acordeón o detalle expandible) para visualizar el desglose de cada renglón: título del libro, cantidad, precio unitario histórico congelado y subtotal.
    - Regla de inmutabilidad y auditoría: ventas confirmadas de solo lectura, sin controles de edición ni borrado en la interfaz (RN-VNT-07).
  - Tests funcionales: adición de renglones con cálculo exacto de subtotales y total, incremento de cantidad ante selección de libro repetido en el pedido, bloqueo de confirmación sin cliente o con pedido vacío, confirmación de venta y verificación de inmutabilidad del precio histórico en historial.
- **Dependencias**: `C-03`
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Entidades Venta y RenglonVenta
  - `knowledge-base/05_reglas_de_negocio.md` §Dominio: Ventas e Historial (RN-VNT-01 a RN-VNT-08)
  - `knowledge-base/06_funcionalidades.md` §Épica 4: Venta Simulada e Historial Inmutable (US-005, US-006)
  - `knowledge-base/07_flujos_principales.md` §Flujo 1 (Composición y confirmación de venta) y Flujo 4 (Inmutabilidad)
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-04 (Estrategia de snapshot) y SU-03 (No edición/baja)

---

## FASE 5 — Persistencia en Almacenamiento Local

### [C-05] `localstorage-persistence-lifecycle`
- **Estado**: [x] completado (archivado 2026-10-20)
- **Scope**: Capa de persistencia en `localStorage`, control de ciclo de vida para evitar duplicación de datos semilla en recarga y preservación de inmutabilidad ante mutaciones externas (Ejercicio 6 de consigna - Persistencia).
  - Adaptador de almacenamiento en `js/storage.js`:
    - Métodos encapsulados para lectura, escritura y verificación con serialización y deserialización JSON segura envuelta en bloques `try/catch`.
    - Claves canónicas estructuradas: `libreria_inicializada`, `libreria_libros`, `libreria_clientes`, `libreria_editoriales`, `libreria_generos`, `libreria_autores`, `libreria_ventas`.
  - Ciclo de vida y prevención de duplicación (RN-PER-01 y RN-PER-02):
    - Al dispararse `DOMContentLoaded` en `js/app.js`: consultar `storage.isInitialized()`.
    - Primer acceso (no inicializado): guardar las colecciones de la semilla inicial (`seed.js`) en sus respectivas claves de `localStorage` y fijar `libreria_inicializada = "true"`.
    - Recargas o sesiones posteriores (inicializado es "true"): leer directamente las entidades desde `localStorage` y poblar el estado en memoria, **sin volver a reinsertar ni duplicar la semilla inicial**.
  - Sincronización reactiva inmediata (RN-PER-03):
    - Actualización automática de `libreria_libros` tras cada alta confirmada de libro.
    - Actualización automática de `libreria_clientes` tras cada alta confirmada de cliente.
    - Actualización automática de `libreria_ventas` tras cada venta confirmada.
  - Tolerancia a fallos: manejo seguro de cuotas de almacenamiento y navegación privada/restringida mediante advertencias amigables en consola/UI sin provocar bloqueo de la ejecución.
  - Verificación de la prueba de inmutabilidad (Flujo 4): confirmación de que al editar manualmente el precio de un libro en `localStorage.getItem("libreria_libros")` vía DevTools y presionar `F5`, las ventas registradas en `libreria_ventas` mantienen inalterados su precio unitario histórico y subtotales.
  - Tests funcionales: recarga con F5 verificando catálogo sin duplicados, persistencia de nuevas altas de libros y clientes tras recarga, persistencia del historial de ventas completo y prueba guiada de inmutabilidad post-recarga.
- **Dependencias**: `C-04`
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Seed data inicial
  - `knowledge-base/05_reglas_de_negocio.md` §Dominio: Persistencia y Almacenamiento (RN-PER-01 a RN-PER-03)
  - `knowledge-base/06_funcionalidades.md` §Épica 5: Persistencia (US-007)
  - `knowledge-base/07_flujos_principales.md` §Flujo 3: Inicialización y Flujo 4: Prueba Guiada de Inmutabilidad
  - `knowledge-base/08_arquitectura_propuesta.md` §Repository / Storage Adapter y Tolerancia a fallos

---

## FASE 6 — Documentación Técnica y Validación de Casos de Prueba

### [C-06] `technical-documentation-test-cases`
- **Estado**: [x] completado (archivado 2026-10-20)
- **Scope**: Elaboración exhaustiva del `README.md` institucional, guía de ejecución sin npm y registro formal de los 8 casos de prueba manuales requeridos por la consigna oficial (Ejercicio 6 de consigna - Documentación).
  - Documentación técnica institucional en `README.md`:
    - Portada del proyecto: datos de los autores, institución (Universidad Tecnológica Nacional - UTN), materia (Programación III), año lectivo y cuatrimestre.
    - Guía de inicio rápido sin herramientas de compilación: procedimiento paso a paso para abrir `index.html` directamente en el navegador con doble clic mediante protocolo `file://`, y alternativas recomendadas con servidores web locales estáticos (`python -m http.server`, Visual Studio Code Live Server).
    - Manual operativo de la aplicación: recorrido funcional ilustrado por las 5 vistas de la SPA (Catálogo, Alta de Libros, Alta de Clientes, Simulación de Ventas e Historial).
    - Resumen de arquitectura y decisiones de diseño: justificación de la SPA con hash routing, sistema de persistencia en `localStorage` con prevención de duplicación, y patrón de inmutabilidad contable por snapshot de precios.
  - Matriz y registro formal de los 8 casos de prueba manuales exigidos por la consigna oficial:
    - *Caso 1: Carga inicial y Catálogo*: verificación de los 6 libros semilla, sus atributos completos y visualización de «Sin clasificar».
    - *Caso 2: Búsqueda insensible y parcial*: búsqueda por títulos con minúsculas, mayúsculas y subcadenas parciales.
    - *Caso 3: Búsqueda sin coincidencias y reseteo*: visualización del mensaje explicativo ante búsqueda sin resultados y restauración con campo vacío.
    - *Caso 4: Alta de Libro con validaciones*: rechazo de ISBN repetido (con/sin guiones), validación de precio `> 0`, bloqueo con `preventDefault` y reactividad en catálogo y ventas.
    - *Caso 5: Alta de Cliente con validaciones*: rechazo de email inválido o duplicado (case-insensitive) y actualización reactiva de selectores.
    - *Caso 6: Composición de Venta y cálculo dinámico*: cliente requerido, renglones mínimos, no duplicidad de libros en la venta y cálculo dinámico de subtotales y total general.
    - *Caso 7: Congelamiento de precio histórico (Prueba DevTools)*: registro de venta, edición manual del precio en `localStorage` vía DevTools, recarga (`F5`) y comprobación de inmutabilidad en historial.
    - *Caso 8: Persistencia en recarga sin duplicación*: verificación de persistencia completa de altas y ventas tras recarga de página sin duplicar los 6 libros iniciales.
  - Tabla de evidencias con columnas: `Caso #`, `Funcionalidad / Requisito`, `Pasos ejecutados`, `Resultado esperado`, `Resultado obtenido` y `Estado (Aprobado)`.
- **Dependencias**: `C-05`
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/01_vision_y_objetivos.md` §Objetivos y Criterios de éxito
  - `knowledge-base/02_descripcion_general.md` §Instrucciones de entrega y evaluación
  - `knowledge-base/06_funcionalidades.md` §Criterios de aceptación (US-001 a US-008)
  - `knowledge-base/07_flujos_principales.md` §Flujo 4: Prueba Guiada de Inmutabilidad
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-02 (Apertura directa file:// sin npm)
