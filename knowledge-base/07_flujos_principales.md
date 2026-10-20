# Flujos Principales

Este documento describe la secuencia paso a paso de los flujos críticos del sistema, su manejo de estados y casos de error.

---

## Flujo 1: Composición y Confirmación de Venta Simulada

**Disparador**: El operador ingresa a la vista `#ventas` para emitir una venta.  
**Actor**: Operador / Empleado.

### Pasos:
1. El operador selecciona un cliente del menú desplegable (alimentado por los clientes en memoria).
2. El operador selecciona un libro del catálogo y especifica la cantidad deseada (mínimo 1).
3. El operador presiona "Agregar al pedido".
4. El sistema valida:
   - Que haya un libro seleccionado y la cantidad sea un entero positivo.
   - Si el libro ya estaba en la venta en curso, incrementa la cantidad existente en lugar de duplicar renglón (o advierte al usuario).
5. El sistema calcula el subtotal (`precioUnitario * cantidad`) y actualiza la tabla de renglones en borrador y el total general de la venta.
6. El operador puede opcionalmente modificar cantidades o eliminar un renglón antes de confirmar.
7. El operador presiona "Confirmar Venta".
8. El sistema valida:
   - Que exista cliente seleccionado.
   - Que la venta contenga al menos un renglón.
9. El sistema genera el objeto `Venta`:
   - Copia el `precioUnitario` vigente como **valor histórico inmutable** dentro de cada renglón.
   - Asigna ID único (`VNT-XXXX`) y timestamp actual.
10. La venta se añade al store de ventas y se guarda en `localStorage`.
11. Se limpia el formulario de ventas, se vacía la canasta temporal y se notifica el éxito de la operación.

### Diagrama de secuencia:
```
Operador              UI / Form Venta         Store / State            LocalStorage
   |                        |                      |                        |
   |-- Selecciona Cliente ->|                      |                        |
   |-- Agrega Libro + Qty ->|                      |                        |
   |                        |-- Valida y calcula ->|                        |
   |                        |<-- Subtotal/Total ---|                        |
   |-- Clic "Confirmar" --->|                      |                        |
   |                        |-- Snapshot histórico>|                        |
   |                        |-- Registrar Venta -->|-- setItem("ventas") -->|
   |                        |<-- Venta guardada ---|<-- OK -----------------|
   |                        |-- Limpiar borrador   |                        |
   |<-- Mensaje de Éxito ---|                      |                        |
```

### Casos de error:
- **Intento de confirmar sin cliente**: Se bloquea el envío y se despliega un mensaje de error: "Debe seleccionar un cliente para registrar la venta".
- **Intento de confirmar sin renglones**: Se muestra el mensaje: "Debe incluir al menos un libro en la venta".
- **Cantidad menor o igual a cero o decimal**: Se rechaza la adición del renglón con advertencia inline.

---

## Flujo 2: Alta de Libros con Normalización de ISBN

**Disparador**: El operador completa el formulario en la vista `#libros` y hace clic en "Registrar Libro".  
**Actor**: Operador.

### Pasos:
1. El evento `submit` del formulario es interceptado mediante `preventDefault()`.
2. Se extraen y limpian los campos:
   - Título (trim).
   - ISBN (se eliminan espacios y guiones: `isbn.replace(/[\s-]/g, '')`).
   - Precio (convertido a `Number`).
   - Editorial seleccionada.
   - Género seleccionado (o null si es «Sin clasificar»).
   - Autores seleccionados (array de IDs).
3. Se ejecutan las validaciones:
   - ¿Título no vacío?
   - ¿ISBN no vacío y no existente previamente?
   - ¿Precio es número y `> 0`?
   - ¿Al menos un autor seleccionado?
4. Si hay errores: se muestran de forma clara y accesible junto a los campos correspondientes.
5. Si pasa las validaciones:
   - Se crea la nueva entidad `Libro` con ID único.
   - Se agrega al array de libros y se sincroniza en `localStorage`.
   - Se resetea el formulario.
   - Se re-renderiza el listado de libros, el catálogo y los selectores de la vista de ventas.
   - Se muestra mensaje de confirmación de alta.

---

## Flujo 3: Inicialización y Persistencia en `localStorage`

**Disparador**: Carga inicial o recarga de la página en el navegador (`DOMContentLoaded`).  
**Actor**: Sistema.

### Pasos:
1. El módulo de almacenamiento consulta `localStorage.getItem("libreria_inicializada")`.
2. **Caso 1: Primera vez (valor nulo o falso)**:
   - Se cargan los arrays de datos semilla (6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes, 0 ventas).
   - Se serializan y guardan en `localStorage` bajo claves específicas (`libreria_libros`, etc.).
   - Se establece `localStorage.setItem("libreria_inicializada", "true")`.
3. **Caso 2: Sesión previa existente (valor "true")**:
   - Se leen las entidades directamente desde `localStorage.getItem(...)` y se deserializan con `JSON.parse`.
   - Se preservan las altas y ventas previas **sin volver a inyectar la semilla**.
4. Se inicializa el estado global en memoria y se renderiza la vista por defecto (`#catalogo`).

---

## Flujo 4: Prueba Guiada de Inmutabilidad del Precio Histórico

**Disparador**: El docente/evaluador prueba el ejercicio 5 y 6 modificando el catálogo en `localStorage`.  
**Actor**: Docente / Evaluador.

### Pasos:
1. El evaluador confirma una venta válida (ej. 2 unidades de un libro a $1500 = subtotal $3000).
2. Se consulta el historial y se verifica el registro con total $3000.
3. El evaluador abre DevTools (F12) -> Application -> Local Storage.
4. Modifica manualmente el precio de ese libro en el array `libreria_libros` (ej. de $1500 a $9999).
5. Se recarga la página (`F5`).
6. Se ingresa nuevamente a la vista `#historial`.
7. **Resultado esperado**: La venta y sus renglones siguen exhibiendo $1500 de precio unitario y $3000 de subtotal, demostrando que el renglón no consulta reactivamente el precio actual del catálogo.
