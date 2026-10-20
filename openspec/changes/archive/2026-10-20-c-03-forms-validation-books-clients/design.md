# Design: C-03 forms-validation-books-clients

## Context

La aplicación cuenta actualmente con el shell SPA accesible (`C-01`) y el modelo core en memoria con catálogo y búsqueda reactiva (`C-02`). La consigna del Parcial 1 (Ejercicio 4) exige incorporar los formularios de alta para libros y clientes con validaciones estrictas en el cliente, prevención de recarga (`event.preventDefault()`) y sincronización inmediata con las vistas sin depender de librerías ni romper la apertura directa mediante `file://`.

## Goals / Non-Goals

**Goals:**
- Implementar un módulo desacoplado de validadores puros (`js/utils/validators.js`) testeable unitariamente.
- Construir vistas controladoras para alta de libros (`js/views/libros.view.js`) y clientes (`js/views/clientes.view.js`).
- Poblar selectores de editoriales y géneros, y selector múltiple/checkboxes de autores a partir del estado.
- Normalizar códigos ISBN (`replace(/[\s-]/g, '')`) y verificar unicidad estricta.
- Validar formato de email con expresión regular estándar y unicidad insensible a mayúsculas/minúsculas (`trim().toLowerCase()`).
- Extender `LibreriaState` con métodos `addLibro` y `addCliente` y un mecanismo simple de suscripción de eventos (`on(event, handler)`) para reactividad sin recarga.
- Proteger el DOM contra inyecciones XSS usando exclusivamente `textContent` y `createElement`.
- Mantener navegación accesible por teclado (WCAG AA), foco visible y mensajes de error con `aria-live`.

**Non-Goals:**
- Formularios o ABM para editoriales, géneros o autores (Regla dura #4: son entidades fijas de solo lectura).
- Persistencia en `localStorage` (Regla de alcance: corresponde a la Fase 5 en `C-05`).
- Lógica de carrito o registro de ventas (corresponde a la Fase 4 en `C-04`).
- Uso de `fetch`, APIs o frameworks externos (Reglas duras #1 y #3).

## Decisions

### 1. Validadores como funciones puras en `js/utils/validators.js`
- **Decisión**: Centralizar la lógica de validación en funciones puras que retornan `{ valid: boolean, error?: string, sanitizedValue?: any }`.
- **Alternativa descartada**: Validar directamente dentro de los event listeners de los formularios. La separación pura permite aplicar TDD unitario estricto sin necesidad de mockear el DOM.

### 2. Control de selección de autores mediante conjunto de Checkboxes
- **Decisión**: Renderizar la lista de autores disponibles como un conjunto semántico de checkboxes dentro de un `<fieldset>` con `<legend>`, con sus correspondientes `<label>` individuales.
- **Alternativa descartada**: `<select multiple>`. Los select múltiples estándar en HTML son notoriamente difíciles de operar en pantallas táctiles móviles y en navegación por teclado; un grupo de checkboxes es infinitamente más accesible y claro.

### 3. Patrón Observer y Retrocompatibilidad en `LibreriaState` (`js/state.js`)
- **Decisión**: Dotar a `LibreriaState` de un método conveniente `on(eventName, listener)` sobre el sistema existente `subscribe(listener)`, y proveer métodos `addLibro(libro)` y `addCliente(cliente)` como alias y extensiones directas de `addBook(book)` y `addClient(client)`. Al ejecutarse una nueva alta, se notificarán tanto los eventos preexistentes de C-02 (`'book:added'`, `'client:added'`) como los nuevos eventos semánticos (`'libros:updated'`, `'clientes:updated'`), garantizando retrocompatibilidad absoluta con los tests de C-02 y `catalogo.view.js`.
- **Alternativa descartada**: Reemplazar la API preexistente en inglés o acoplar las vistas invocando directamente métodos de renderizado. Mantener alias y emitir ambos eventos preserva el desacoplamiento y asegura cero regresiones.

### 4. Normalización y unicidad de ISBN y Email
- **Decisión**:
  - ISBN: se remueven guiones y espacios en blanco (`isbn.replace(/[\s-]/g, '')`). La comparación de unicidad en `validateISBN` compara contra los ISBN normalizados de los libros existentes.
  - Email: se remueven espacios en blanco y se convierte a minúsculas (`email.trim().toLowerCase()`). La comparación de unicidad es case-insensitive y trim-insensitive.

### 5. Sanitización y manipulación segura del DOM
- **Decisión**: Ningún mensaje de error o texto ingresado por el usuario se inserta con `.innerHTML`. Se utiliza estrictamente `textContent` y creación de nodos DOM (`document.createElement`) para respetar la Regla dura #5.

## Risks / Trade-offs

- **[Riesgo] Pérdida de datos ingresados si el usuario recarga la página por error antes de enviar**:
  → *Mitigación*: Mantener los formularios limpios e intuitivos, y notificar claramente tras el alta exitosa con mensajes accesibles (`aria-live="polite"`).
- **[Riesgo] Colisión de identificadores en altas sucesivas en memoria**:
  → *Mitigación*: Implementar un generador de IDs determinístico y secuencial basado en prefijo y longitud o timestamp (`LIB-` + número secuencial / timestamp).
- **[Riesgo] Inconsistencias al recargar mientras localStorage aún no esté activo**:
  → *Mitigación*: En esta fase (`C-03`), el estado en memoria mantiene el ciclo de vida de la sesión actual; el catálogo refleja inmediatamente los libros añadidos mediante el bus de eventos.
