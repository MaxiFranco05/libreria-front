# Librería Central — Sistema de Gestión Editorial y Ventas

> **Universidad Tecnológica Nacional (UTN)**  
> **Facultad Regional Mendoza (FRM)**  
> **Carrera:** Tecnicatura Universitaria en Programación (TUP)  
> **Cátedra:** Programación III  
> **Evaluación:** Primer Parcial — Aplicación Web Single Page Application (SPA) Nativa  
> **Año Lectivo:** 2026  
> **Grupo de Desarrollo:** Grupo LocalHost  

---

## 1. Descripción General del Proyecto

**Librería Central** es una aplicación web interactiva desarrollada para la administración integral de una librería comercial y editorial. La solución implementa la gestión y búsqueda dinámica de catálogo, altas de libros y clientes con validaciones estrictas en el cliente, simulación transaccional de ventas con canasta interactiva, consulta de historial contable con congelamiento de precios históricos y persistencia local en `localStorage`.

El proyecto fue construido bajo la consigna oficial del Parcial 1 de Programación III, cumpliendo con los estándares de diseño editorial cálido, accesibilidad web (WCAG AA), comportamiento responsivo fluido (320px a 1280px) y una arquitectura modular desacoplada basada exclusivamente en tecnologías web nativas.

---

## 2. Stack Tecnológico (100% Nativo / Vanilla)

El desarrollo respeta la restricción de **cero dependencias externas** impuesta por la cátedra:

| Capa | Tecnologías | Estándar / API | Justificación y Cumplimiento |
|---|---|---|---|
| **Estructura** | HTML5 semántico | W3C Standard | Marcado con `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<table>` y atributos ARIA de accesibilidad. |
| **Estilos** | CSS3 nativo | CSS Grid & Flexbox | Sistema de diseño modular en `css/` con variables CSS (`:root`), tipografía fluida, modo responsivo sin scroll horizontal global y foco visible (`:focus-visible`). |
| **Comportamiento** | JavaScript nativo | ECMAScript 2020 (ES11+) | Módulos desacoplados bajo patrón IIFE universal sin frameworks, librerías externas ni llamadas HTTP / `fetch`. |
| **Persistencia** | Web Storage API | `localStorage` nativo | Almacenamiento local estructurado con serialización JSON tolerante a fallos y control de ciclo de vida (`libreria_inicializada`). |

> **Garantía Académica**: La aplicación no utiliza Node.js para su ejecución en cliente, ni paquetes `npm`, ni frameworks (`React`, `Vue`, `Angular`), ni utilidades CSS (`Tailwind`, `Bootstrap`), ni librerías de DOM (`jQuery`).

---

## 3. Guía de Inicio Rápido (Ejecución Buildless)

La aplicación no requiere instalación de dependencias, compilación, transpilación ni empaquetado.

### Método 1: Apertura Directa mediante `file://` (Recomendado)
1. Descargar o clonar el repositorio en cualquier directorio local.
2. Hacer **doble clic** en el archivo `index.html` (o abrirlo arrastrándolo a cualquier navegador moderno como Google Chrome, Mozilla Firefox, Microsoft Edge o Brave).
3. La aplicación se ejecutará de forma inmediata, libre de errores de CORS y sin requerir conexión a Internet.

### Método 2: Servidores Web Estáticos Locales (Opcional)
Si se desea servir la aplicación mediante protocolo HTTP local, pueden emplearse cualquiera de las siguientes alternativas estándar:

- **Con Python 3**:
  ```bash
  python -m http.server 8000
  ```
  Acceder desde el navegador a `http://localhost:8000`.

- **Con Visual Studio Code**:
  Abrir la carpeta del proyecto y hacer clic en **"Go Live"** mediante la extensión *Live Server*.

- **Con Node / npx (sin instalación local)**:
  ```bash
  npx serve .
  ```

---

## 4. Manual Operativo de la SPA (Recorrido de Vistas)

La interfaz se organiza como una **Single Page Application (SPA)** con navegación por hash en tiempo real, manteniendo la persistencia y el estado de la sesión sin recargar la página.

```
[#catalogo] ──── [#libros] ──── [#clientes] ──── [#ventas] ──── [#historial]
```

### 1. Vista de Catálogo (`#catalogo`)
- **Visualización**: Exhibe la lista de libros disponibles en tarjetas semánticas (`.book-card`) mostrando título, ISBN, precio formateado con dos decimales (`$0.00`), editorial, lista de autores y género.
- **Leyenda «Sin clasificar»**: Aquellos libros sin género asignado (`null` o vacío) presentan de forma explícita el badge «Sin clasificar» (`RN-CAT-06`).
- **Buscador en tiempo real**:
  - Filtro dinámico por título mediante evento `input`.
  - Comparación insensible a mayúsculas y minúsculas (`toLowerCase`, `RN-CAT-01`).
  - Coincidencia parcial por subcadena en cualquier posición del título (`RN-CAT-02`).
  - Limpieza automática de espacios en blanco extremos antes de comparar (`trim`, `RN-CAT-03`).
  - Restauración inmediata del catálogo completo al vaciar el campo (`RN-CAT-04`).
  - Mensaje claro y accesible ante búsquedas sin resultados (`RN-CAT-05`).

### 2. Vista de Alta de Libros (`#libros`)
- **Formulario `#form-libro`**:
  - **Título**: Texto obligatorio no vacío.
  - **ISBN**: Normalizado automáticamente removiendo espacios y guiones; validación estricta de unicidad frente a libros existentes (`RN-LIB-02`).
  - **Precio**: Valor numérico mayor a cero (`precio > 0`, `RN-LIB-03`).
  - **Editorial**: Selector desplegable poblado dinámicamente desde las editoriales registradas.
  - **Género**: Selector opcional con opción explícita «Sin clasificar».
  - **Autores**: Lista de casillas de verificación (`checkboxes`) con selección obligatoria de al menos un autor registrado (`RN-LIB-04`).
- **Control y Reactividad**: Interceptación con `event.preventDefault()` evitando recargas de página. Al confirmarse el alta, se persiste la entidad en `localStorage` y se actualizan de inmediato el catálogo, la lista de libros y los selectores de la vista de ventas (`RN-LIB-06`).

### 3. Vista de Alta de Clientes (`#clientes`)
- **Formulario `#form-cliente`**:
  - **Nombre completo**: Campo de texto obligatorio.
  - **Correo electrónico**: Validación de formato estándar de email (`usuario@dominio.ext`, `RN-CLI-02`) y control estricto de unicidad insensible a mayúsculas/minúsculas y espacios (`RN-CLI-03`).
- **Tabla reactiva**: Lista de clientes registrados actualizada automáticamente. Los nuevos clientes quedan habilitados de inmediato en el selector de ventas sin recarga (`RN-CLI-04`).

### 4. Vista de Simulación de Ventas (`#ventas`)
- **Composición del pedido**:
  - Selector de cliente activo poblado reactivamente.
  - Selector de libro y campo de cantidad entera positiva (`cantidad >= 1`).
  - Botón **"Agregar al pedido"**: Si el libro ya fue incorporado previamente al pedido en curso, el sistema incrementa la cantidad del renglón existente en lugar de duplicar filas (`RN-VNT-03`).
- **Canasta dinámica (Borrador)**:
  - Visualización tabular con columnas: Libro, Precio Unitario actual, Cantidad y Subtotal.
  - Botones accesibles por renglón para modificar la cantidad o eliminar el renglón antes de la confirmación (`RN-VNT-04`).
  - Totalizador general financiero recalculado dinámicamente en tiempo real (`$0.00`, `RN-VNT-05`).
- **Confirmación de la venta**:
  - Valida la selección de cliente (`RN-VNT-01`) y la existencia de al menos un renglón válido (`RN-VNT-02`).
  - Genera una entidad `Venta` con ID correlativo (`VNT-XXXX`), fecha/hora legible y copia congelada del `precioUnitario` vigente en ese instante (`RN-VNT-06`).
  - Vacía la canasta, resetea el formulario y emite notificación accesible de éxito (`RN-VNT-08`).

### 5. Vista de Historial de Ventas (`#historial`)
- **Auditoría e Inmutabilidad**: Lista de transacciones históricas confirmadas. Por regla de negocio (`RN-VNT-07`), las ventas registradas son de **estricta solo lectura**, sin controles de modificación ni borrado.
- **Desglose de renglones**: Detalle expandible por venta exhibiendo los libros adquiridos, cantidades, precio unitario histórico y subtotales.
- **Snapshot inalterable**: El precio reflejado en el historial corresponde al momento exacto de la confirmación; cualquier cambio posterior en el catálogo jamás modifica transacciones pasadas.

---

## 5. Arquitectura del Sistema y Decisiones de Diseño

El sistema aplica una arquitectura por capas desacoplada orientada a eventos en el navegador:

```
┌─────────────────────────────────────────────────────────────┐
│                       index.html                            │
│           (SPA Shell, Layout Semántico y Enlaces)           │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
       ┌───────▼────────┐             ┌────────▼────────┐
       │  js/router.js  │             │   Vistas SPA    │
       │ (Hash Routing) │             │ (catalogo, etc) │
       └────────────────┘             └────────┬────────┘
                                               │ eventos / UI
       ┌───────────────────────────────────────▼────────┐
       │                  js/state.js                   │
       │     (Almacén Central y Bus de Eventos Pub/Sub) │
       └──────────────┬────────────────────────▲────────┘
                      │ sincronización         │ hidratación
       ┌──────────────▼────────┐               │
       │     js/storage.js     │───────────────┘
       │  (Adaptador Storage)  │
       └──────────────┬────────┘
                      │
              ┌───────▼────────┐
              │  localStorage  │
              └────────────────┘
```

### 1. Patrón IIFE Universal sin Módulos ES6
Todos los scripts (`js/*.js`) están construidos bajo Funciones Invocadas Inmediatamente (IIFE) que exponen sus APIs en el espacio de nombres global `window.LibreriaApp`, proveyendo compatibilidad simultánea con navegadores vía `file://` y entornos de testing bajo Node.js (`module.exports`).

### 2. State Manager Centralizado (`js/state.js`)
Actúa como única fuente de verdad en memoria. Expone métodos de lectura inmutables que retornan copias clonadas de las colecciones, impidiendo que controladores externos muten el estado privado por referencia directa. Incorpora un sistema de eventos reactivos (`on(eventName, handler)`) para sincronización entre módulos.

### 3. Storage Adapter y Control de Ciclo de Vida (`js/storage.js`)
- **Bandera `libreria_inicializada`**: En el primer inicio almacena la semilla de datos obligatoria (`seed.js`) y fija la bandera en `"true"`. En recargas posteriores (`F5`), recupera las colecciones guardadas sin volver a inyectar la semilla, evitando estrictamente la duplicación de libros o clientes (`RN-PER-01`, `RN-PER-02`).
- **Sincronización reactiva inmediata**: Escucha los eventos `libros:updated`, `clientes:updated` y `ventas:updated` para persistir cambios de forma transparente (`RN-PER-03`).
- **Manejo defensivo de excepciones**: Todas las operaciones `get`/`set` están envueltas en bloques `try/catch` para tolerar restricciones de modo incógnito o cuotas excedidas sin congelar la interfaz.

### 4. Patrón de Congelamiento Contable (Snapshot)
Al registrarse una venta, cada renglón realiza una copia profunda (`deep clone`) del libro y de su precio unitario en ese instante. Las ventas históricas no se vinculan por puntero vivo al catálogo de libros, garantizando inmutabilidad contable ante futuras mutaciones de precios en el inventario.

### 5. Seguridad DOM y Prevención Activa de XSS (Regla Dura #5)
Se prohíbe la asignación directa de datos dinámicos mediante `.innerHTML`. Toda inyección de texto provisto por usuarios o almacenamiento se realiza mediante la propiedad segura `.textContent` o la creación explícita de nodos DOM (`document.createElement`), neutralizando cualquier vector de inyección de scripts.

### 6. Accesibilidad Web (WCAG 2.1 / 2.2 Nivel AA)
- Contraste cromático superior a 4.5:1 en todos los textos e interactivos.
- Navegación íntegra por teclado mediante tecla `Tab`.
- Enlace de salto directo al contenido principal (`.skip-link`) accesible con foco visual.
- Indicador visual de foco persistente (`:focus-visible`) con contorno de alto contraste.
- Mensajes de estado y alertas vinculados con atributos `aria-live="polite"` y `role="alert"`.

---

## 6. Suite de Pruebas Automatizadas (Node.js nativo, sin npm)

La verificación funcional y estructural del proyecto se ejecuta con el runtime de Node.js, sin instalar dependencias ni frameworks de testing. Cada archivo de la carpeta `tests/` imprime el detalle de sus verificaciones y finaliza con código de salida `0` si todo pasa.

### Ejecución individual

```bash
node tests/test-c01.js
node tests/test-c02.js
node tests/test-c03.js
node tests/test-c04.js
node tests/test-c05.js
```

### Ejecución completa en consola (PowerShell)

```powershell
foreach ($f in @('test-c01','test-c02','test-c03','test-c04','test-c05')) {
  node "tests/$f.js"
  if ($LASTEXITCODE -ne 0) { throw "Falló $f" }
}
```

### Cobertura por change

| Suite | Change verificado | Verificaciones |
|---|---|---|
| `test-c01.js` | C-01 — SPA shell, layout y accesibilidad | 43 |
| `test-c02.js` | C-02 — Modelo de catálogo y búsqueda | 16 |
| `test-c03.js` | C-03 — Altas y validaciones de libros y clientes | 18 |
| `test-c04.js` | C-04 — Ventas y snapshot histórico | 26 |
| `test-c05.js` | C-05 — Persistencia en `localStorage` | 13 |
| **Total** | **C-01 a C-05** | **116** |

> Estado actual: **116/116 verificaciones en verde (0 fallos)**.

---

## 7. Matriz de los 8 Casos de Prueba Manuales

Registro formal de evidencias exigido por la consigna oficial del Primer Parcial. Todos los casos fueron ejecutados sobre la aplicación abierta mediante `file://` y resultaron **Aprobados**.

| Caso # | Funcionalidad / Requisito | Pasos ejecutados | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|---|
| **1** | Carga inicial y catálogo (RN-SEED / RN-CAT-06) | Abrir `index.html`; navegar a `#catalogo`; verificar los 6 libros semilla y sus datos (título, ISBN, precio, editorial, género, autores). | Se muestran los 6 libros iniciales con precios `$0.00`; el libro sin género muestra «Sin clasificar». | 6 libros visibles, precios con 2 decimales y badge «Sin clasificar» correcto. | **Aprobado** |
| **2** | Búsqueda insensible y parcial (RN-CAT-01/02/03) | En `#catalogo`, buscar con minúsculas, mayúsculas y subcadenas parciales (p. ej. `borg`, `BORGES`, `or`); probar espacios extremos. | El filtro ignora mayúsculas/minúsculas, coincide por subcadena en cualquier posición y recorta espacios extremos. | Resultados coincidentes en todos los formatos; sin falsos negativos por mayúsculas ni espacios. | **Aprobado** |
| **3** | Búsqueda sin coincidencias y reseteo (RN-CAT-04/05) | Buscar un término inexistente (`zzzz`); luego vaciar el campo de búsqueda. | Aparece el mensaje «No se encontraron libros que coincidan con la búsqueda»; al vaciar, se restaura el catálogo completo. | Mensaje visible y accesible; catálogo completo restaurado al limpiar el campo. | **Aprobado** |
| **4** | Alta de libro con validaciones (RN-LIB-01/02/03/04/06) | En `#libros`, intentar alta con ISBN repetido (con y sin guiones), precio `0`/negativo, sin autor y con título vacío; luego completar un alta válida. | Se rechazan los casos inválidos con mensajes junto a cada campo, sin recargar la página; el alta válida actualiza catálogo, lista y selector de ventas. | Rechazos correctos con `preventDefault`; alta válida visible de inmediato en catálogo y ventas. | **Aprobado** |
| **5** | Alta de cliente con validaciones (RN-CLI-01/02/03/04) | En `#clientes`, intentar alta con email inválido, con campos vacíos y con email duplicado variando mayúsculas/espacios; luego completar un alta válida. | Se rechazan formatos inválidos y duplicados *case-insensitive*; el alta válida se refleja en la tabla y en el selector de ventas. | Validaciones correctas; cliente nuevo disponible en ventas sin recargar. | **Aprobado** |
| **6** | Composición de venta y cálculo dinámico (RN-VNT-01 a RN-VNT-05) | En `#ventas`, intentar confirmar sin cliente y con pedido vacío; agregar renglones, repetir un libro, modificar cantidad y eliminar un renglón. | La venta exige cliente y al menos un renglón; un libro repetido incrementa cantidad sin duplicar filas; subtotales y total se recalculan con 2 decimales. | Bloqueos correctos; sin filas duplicadas; subtotales y total exactos en tiempo real. | **Aprobado** |
| **7** | Congelamiento de precio histórico en DevTools (RN-VNT-06/07 / Regla Dura #7) | Registrar una venta; abrir DevTools, editar el precio del libro en `localStorage.getItem('libreria_libros')`; recargar con `F5`; revisar `#historial`. | El renglón histórico conserva el precio unitario y el subtotal del momento de la venta, ajeno al cambio posterior del catálogo. | Precio y subtotal históricos inalterados tras la edición y recarga; venta en solo lectura. | **Aprobado** |
| **8** | Persistencia en recarga sin duplicación (RN-PER-01/02/03) | Crear un libro y un cliente, confirmar una venta; recargar con `F5`; verificar colecciones y bandera `libreria_inicializada`. | Altas y ventas persisten; los 6 libros semilla no se duplican porque la semilla solo se inyecta cuando la bandera no existe. | Datos persistidos correctamente y sin duplicados de la semilla tras múltiples recargas. | **Aprobado** |

> **Evidencia de inmutabilidad**: el Caso 7 es la prueba guiada del Flujo 4; complementa la triangulación automatizada de `test-c04.js` y `test-c05.js`, que simulan la mutación externa del catálogo y verifican que el snapshot histórico permanezca intacto.
