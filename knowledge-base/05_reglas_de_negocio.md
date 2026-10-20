# Reglas de Negocio

Cada regla posee un identificador único con nomenclatura `RN-{DOMINIO}-{NN}` para facilitar su trazabilidad en el diseño y en los tests.

## Dominio: Catálogo y Búsqueda (RN-CAT)

- **RN-CAT-01 (Filtro insensible)**: La búsqueda de libros por título debe comparar ignorando diferencias entre mayúsculas y minúsculas (case-insensitive).
- **RN-CAT-02 (Coincidencia parcial)**: La búsqueda debe encontrar libros cuyo título contenga la subcadena ingresada en cualquier posición.
- **RN-CAT-03 (Limpieza de espacios)**: Deben eliminarse espacios en blanco sobrantes al inicio y final del término de búsqueda (`trim`) antes de filtrar.
- **RN-CAT-04 (Búsqueda vacía)**: Si el campo de búsqueda está vacío o contiene solo espacios, el catálogo debe exhibir la totalidad de los libros registrados.
- **RN-CAT-05 (Sin coincidencias)**: Si ningún libro coincide con el término buscado, debe presentarse un mensaje claro y visible indicando la ausencia de resultados.
- **RN-CAT-06 (Género ausente)**: Si un libro no tiene género asignado (`null` o vacío), la interfaz debe mostrar expresamente el texto «Sin clasificar».

## Dominio: Alta de Libros (RN-LIB)

- **RN-LIB-01 (Campos obligatorios)**: Título, ISBN, precio, editorial y al menos un autor son campos estrictamente requeridos.
- **RN-LIB-02 (Normalización y unicidad de ISBN)**: El ISBN se compara sin espacios ni guiones. No puede repetirse un ISBN ya existente en el sistema. No se requiere cálculo de dígito de control.
- **RN-LIB-03 (Precio positivo)**: El precio debe ser un valor numérico estrictamente mayor que cero (`precio > 0`).
- **RN-LIB-04 (Relaciones existentes)**: La editorial seleccionada y todos los autores seleccionados deben existir en la lista de datos locales.
- **RN-LIB-05 (Género opcional y válido)**: El género puede quedar sin asignar (opción «Sin clasificar»). Si se selecciona uno, debe existir en los géneros locales.
- **RN-LIB-06 (Actualización reactiva sin recarga)**: Tras confirmar un alta exitosa con `preventDefault`, el catálogo, el listado de libros y los selectores de la vista de ventas deben actualizarse inmediatamente sin recargar la página.

## Dominio: Alta de Clientes (RN-CLI)

- **RN-CLI-01 (Campos obligatorios)**: Nombre completo y correo electrónico son requeridos y no pueden estar vacíos ni consistir solo en espacios.
- **RN-CLI-02 (Formato de email)**: El correo debe responder a una estructura de email válida (ej. `usuario@dominio.ext`).
- **RN-CLI-03 (Unicidad de email)**: No puede existir más de un cliente con el mismo email. La comparación debe realizarse sin espacios exteriores (`trim`) e insensible a mayúsculas/minúsculas.
- **RN-CLI-04 (Actualización reactiva)**: Tras un alta válida, el listado de clientes y el selector de clientes en la vista de ventas se actualizan de inmediato sin recarga.

## Dominio: Ventas e Historial (RN-VNT)

- **RN-VNT-01 (Cliente obligatorio)**: No se puede confirmar una venta sin haber seleccionado un cliente válido.
- **RN-VNT-02 (Renglones mínimos)**: La venta debe contener al menos un renglón con un libro y cantidad entera mayor a cero (`cantidad >= 1`).
- **RN-VNT-03 (No duplicidad en renglones)**: No se admiten libros repetidos en una misma venta. Si el operador intenta agregar un libro ya presente en la venta en curso, debe actualizarse la cantidad del renglón existente o advertirse con un mensaje explicativo sin crear un renglón duplicado.
- **RN-VNT-04 (Edición y eliminación de renglones en borrador)**: Antes de confirmar la venta, el operador puede modificar cantidades de los renglones o eliminarlos individualmente.
- **RN-VNT-05 (Cálculo de importes)**: El subtotal de cada renglón es `cantidad * precioUnitario`. El total de la venta es la sumatoria de los subtotales. Ambos deben formatearse y mostrarse con 2 decimales (`$0.00`).
- **RN-VNT-06 (Congelamiento de precio histórico)**: Al confirmar la venta, el precio unitario del catálogo en ese instante se copia de forma fija al renglón de la venta. Si posteriormente el catálogo modifica o actualiza dicho precio, el historial debe seguir mostrando el precio unitario pactado originalmente.
- **RN-VNT-07 (Inmutabilidad del historial)**: Las ventas confirmadas no pueden ser editadas ni eliminadas desde la interfaz.
- **RN-VNT-08 (Limpieza tras confirmación)**: Al confirmarse una venta, se registra la transacción con ID y fecha, se emite un mensaje de éxito y se restablece el formulario de venta para una nueva operación.

## Dominio: Persistencia y Almacenamiento (RN-PER)

- **RN-PER-01 (Primer inicio y semilla)**: En el primer acceso a la aplicación, se debe verificar si existen datos en `localStorage`. De estar vacío, se inicializan los datos de ejemplo (mínimo 6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes).
- **RN-PER-02 (No duplicación en recarga)**: En recargas subsiguientes de la página, los registros guardados deben recuperarse íntegramente sin reinyectar ni duplicar la semilla inicial.
- **RN-PER-03 (Persistencia de entidades)**: Libros nuevos, clientes nuevos y ventas confirmadas deben persistirse inmediatamente en `localStorage`.
