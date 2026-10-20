# Design

## Context

El proyecto **Librería UTN** ya dispone del shell SPA con enrutamiento por hash (`C-01`), del almacén centralizado `js/state.js` y buscador de catálogo (`C-02`), y de los formularios de alta de libros y clientes con validaciones puras y reactividad (`C-03`). Actualmente, las secciones `#ventas` y `#historial` en `index.html` contienen tarjetas placeholder estáticas.

Este diseño aborda la arquitectura técnica de `C-04` (`sales-simulation-historical-price`, ver `proposal.md` para motivación), respetando las 9 Reglas Duras del proyecto:
1. Vanilla HTML5/CSS3/JS ES2020 sin dependencias externas ni npm.
2. Compatibilidad estricta con apertura directa `file://` (scripts IIFE con `defer`, sin `type="module"`).
3. Sin `fetch` ni peticiones HTTP.
4. Sin ABM de entidades de referencia (editoriales, géneros, autores).
5. Prevención absoluta de XSS: prohibido usar `.innerHTML` con datos dinámicos; uso exclusivo de `document.createElement` y `.textContent`.
6. Diseño responsivo (320px–1280px) sin scroll horizontal en la ventana; contenedores de tabla con `.table-responsive` (`overflow-x: auto`).
7. **Snapshot contable inmutable (`RN-VNT-06` / Regla Dura #7)**: jamás recalcular el precio histórico desde el catálogo al mostrar el historial de ventas.
8. Respeto del ciclo de inicialización de estado.
9. Foco de teclado visible (`:focus-visible`) y accesibilidad WCAG AA en todos los controles interactivos.

## Goals / Non-Goals

**Goals:**
- Diseñar un flujo de composición de ventas en dos etapas claramente separadas: un **borrador efímero** encapsulado dentro de `js/views/ventas.view.js` y una **transacción confirmada e inmutable** persistida en `state.ventas`.
- Garantizar por construcción que cada `RenglonVenta` confirmado almacene copias primitivas por valor de `precioUnitario`, `titulo`, `cantidad` y `subtotal`, desacopladas de cualquier referencia a objetos de `state.libros`.
- Proveer funciones puras y determinísticas en `js/utils/validators.js` y `js/utils/formatters.js` para que la lógica de validación y cálculo sea 100% testeable en Node.js bajo TDD estricto.
- Asegurar sincronización reactiva inmediata: altas en `#libros` y `#clientes` actualizan los selectores de `#ventas`, y confirmaciones en `#ventas` actualizan la tabla de `#historial`.

**Non-Goals:**
- Persistencia en `localStorage` (alcance exclusivo de `C-05`, que se conectará a los eventos de `state.js`).
- Gestión de stock físico o inventario de ejemplares (fuera del alcance del modelo de dominio según `knowledge-base/04_modelo_de_datos.md`).
- Edición, anulación o borrado de ventas ya confirmadas (`RN-VNT-07` y `SU-03`).

## Decisions

### 1. Separación entre estado de borrador local (`draft`) y estado global (`state.ventas`)
- **Decisión**: El pedido en curso (cliente seleccionado y array de renglones en borrador) se gestionará como estado privado encapsulado dentro de `js/views/ventas.view.js` (con API pública expuesta para inspección y testing automatizado), mientras que `js/state.js` solo recibirá la entidad `Venta` completa una vez superadas las validaciones y confirmada la operación.
- **Racional**: Evita contaminar `state.ventas` con transacciones incompletas y simplifica la futura persistencia en `localStorage` (`C-05`), donde solo deben grabarse ventas confirmadas al dispararse `ventas:updated`.
- **Alternativa descartada**: Guardar el carrito en borrador dentro de `state.js`. Se descartó porque acopla estado transitorio de UI al almacén de entidades de dominio.

### 2. Estrategia de Snapshot Inmutable y Clonación Profunda en `state.addSale`
- **Decisión**:
  1. Al agregar un libro al borrador en `ventas.view.js`, se extrae en ese instante `Number(libro.precio)` y `String(libro.titulo)` desde `state.getBookById(libroId)`.
  2. Al confirmar la venta, se construye el objeto `Venta` con `renglones` compuestos exclusivamente por valores primitivos (`libroId`, `titulo`, `cantidad`, `precioUnitario`, `subtotal`).
  3. En `js/state.js`, tanto `addSale(sale)` (y su alias `addVenta(venta)`) como `getSales()` / `getVentas()` realizarán una clonación profunda de la venta y de su arreglo `renglones` (`sale.renglones.map(r => ({ ...r }))`), evitando que referencias mutables externas alteren el registro histórico.
  4. En `js/views/historial.view.js`, el renderizado del desglose leerá únicamente `renglon.titulo`, `renglon.cantidad`, `renglon.precioUnitario` y `renglon.subtotal`. No tendrá siquiera dependencia ni llamada a `state.getBookById()`.
- **Racional**: Al eliminar por completo cualquier búsqueda de libros por ID dentro de `historial.view.js`, es estructuralmente imposible que un cambio posterior en `state.libros` (o en `localStorage` durante la prueba de DevTools de `Flujo 4`) modifique los importes históricos.
- **Alternativa descartada**: Guardar solo `{ libroId, cantidad }` en `RenglonVenta` y consultar el libro al renderizar. Descartado por violar directamente `RN-VNT-06` y la Regla Dura #7.

### 3. Resolución de duplicidad de libros en el borrador (`RN-VNT-03`)
- **Decisión**: Cuando el operador selecciona un libro que ya se encuentra en el borrador y presiona "Agregar al pedido" con una cantidad entera válida $q \ge 1$, el sistema sumará $q$ a la cantidad del renglón existente (`renglon.cantidad += q`), recalculará `renglon.subtotal = round2(renglon.cantidad * renglon.precioUnitario)` y mostrará un mensaje informativo accesible (`role="status"`) indicando que se incrementó la cantidad del libro existente sin duplicar la fila.
- **Racional**: `RN-VNT-03` y `US-005` habilitan explícitamente acumular la cantidad en el renglón existente e informar al usuario, ofreciendo una experiencia de uso fluida en mostrador sin perder trazabilidad.

### 4. Edición y eliminación de renglones en borrador (`RN-VNT-04`)
- **Decisión**: Cada fila de la tabla de borrador (`#tabla-borrador-venta`) incluirá:
  - Un control numérico (`<input type="number" min="1" step="1">`) accesible con `aria-label="Cantidad para <Título>"` que al cambiar (`change` / `input` válido) actualice la cantidad del renglón, recalcule su subtotal y actualice el total general. Si el usuario ingresa un valor inválido ($\le 0$, vacío o decimal), se mostrará feedback de error accesible y en `change` se restaurará el último valor entero válido ($\ge 1$).
  - Un botón `<button type="button">` accesible con `aria-label="Eliminar <Título> del pedido"` que quite el renglón del borrador y recalcule el total general.
- **Racional**: Satisface `RN-VNT-04` permitiendo tanto el ajuste directo de unidades como la baja individual del renglón con accesibilidad completa por teclado (`Tab` y `:focus-visible`).

### 5. Desglose expandible accesible en `#historial`
- **Decisión**: En `js/views/historial.view.js`, cada venta confirmada se representará en la tabla principal con una fila maestra que incluye un botón de acción `<button type="button" class="btn btn-outline btn-sm" aria-expanded="false" aria-controls="detalle-venta-VNT-XXXX">Ver detalle</button>`, seguido de una fila de detalle `<tr id="detalle-venta-VNT-XXXX" class="historial-detail-row" hidden>` con una celda `<td colspan="5">` que aloja la sub-tabla de renglones históricos.
- **Racional**: Permite mantener la semántica tabular en `#historial`, funciona nativamente con teclado (`Enter` / `Espacio` sobre el `<button>`), comunica el estado a lectores de pantalla vía `aria-expanded` y evita problemas de anidación inválida en tablas HTML5.

### 6. Aritmética decimal de moneda sin errores de punto flotante IEEE 754
- **Decisión**: Todo cálculo de `subtotal` y `total` utilizará redondeo explícito a 2 decimales mediante `Math.round((valor + Number.EPSILON) * 100) / 100` antes de almacenarse en el modelo, y se presentará en la interfaz mediante `formatters.formatCurrency(valor)` (`$0.00`).
- **Racional**: Evita artefactos clásicos de punto flotante en JavaScript (como `3 * 19.99 = 59.970000000000006`) tanto en los objetos de estado como en el DOM.

## Risks / Trade-offs

- **[Risk] Pérdida de selección actual en selectores de `#ventas` cuando ocurre un alta reactiva en `#libros` o `#clientes`** → **Mitigación**: Al repoblar los `<select>` de cliente o libro tras los eventos `clientes:updated` o `libros:updated`, `ventas.view.js` preservará el `value` previamente seleccionado si aún existe en la colección.
- **[Risk] Desborde horizontal en resoluciones móviles (320px) por tablas de canasta e historial** → **Mitigación**: Ambas tablas (`#tabla-borrador-venta` y `#tabla-historial-ventas`) estarán envueltas en contenedores `.table-responsive` con `overflow-x: auto`, y el layout de `#ventas` utilizará `.ventas-layout` (1 columna en móvil, 2 columnas en desktop $\ge 900\text{px}$).
- **[Risk] Mutación accidental de precios en memoria durante pruebas** → **Mitigación**: Se proveerá además en `state.js` un método explícito `updateBookPrice(bookId, newPrice)` (y clonación en getters/setters) para facilitar la verificación programática de inmutabilidad en `tests/test-c04.js` sin alterar jamás los registros de `_state.ventas`.
