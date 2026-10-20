# sales-simulation Specification

## Purpose
Permite componer órdenes de venta en borrador de forma interactiva, seleccionando cliente y libros con cantidades enteras positivas, controlando la no duplicidad de libros en el pedido, calculando subtotales y total general en tiempo real con dos decimales, y confirmando la transacción con congelamiento del precio unitario histórico de cada renglón.

## Requirements

### Requirement: Selectores reactivos de clientes y libros en el panel de ventas
La sección de simulación de ventas (`#ventas`) SHALL presentar un selector de clientes poblado desde `state.clientes` y un selector de libros poblado desde `state.libros` (mostrando título y precio unitario vigente formateado), actualizándose ambos selectores de forma reactiva inmediata cuando se da de alta un nuevo cliente o un nuevo libro sin recargar la página (`RN-CLI-04`, `RN-LIB-06`).

#### Scenario: Población inicial de selectores con datos semilla
- **WHEN** se inicializa la vista de ventas con el estado cargado
- **THEN** el selector de clientes lista todos los clientes registrados y el selector de libros lista todos los libros del catálogo con su precio unitario formateado

#### Scenario: Actualización reactiva del selector de clientes tras alta
- **WHEN** se registra un nuevo cliente válido en la vista de clientes
- **THEN** el nuevo cliente aparece inmediatamente como opción seleccionable en el desplegable de clientes de la vista de ventas sin recargar la página

#### Scenario: Actualización reactiva del selector de libros tras alta
- **WHEN** se registra un nuevo libro válido en la vista de libros
- **THEN** el nuevo libro aparece inmediatamente con su título y precio formateado en el desplegable de libros de la vista de ventas sin recargar la página

### Requirement: Validación de incorporación de renglón y cantidad entera positiva
El sistema SHALL exigir que para agregar un ítem al pedido en borrador se seleccione un libro válido del catálogo y se ingrese una cantidad numérica entera estrictamente mayor o igual a 1 (`cantidad >= 1`, `RN-VNT-02`).

#### Scenario: Incorporación exitosa de un renglón válido
- **WHEN** el operador selecciona un libro válido e ingresa una cantidad entera de `2` y acciona "Agregar al pedido"
- **THEN** el sistema incorpora el renglón al borrador con el título del libro, su precio unitario vigente, cantidad `2` y subtotal calculado

#### Scenario: Rechazo de adición sin libro seleccionado
- **WHEN** el operador intenta agregar un ítem al pedido manteniendo el selector de libro vacío
- **THEN** el sistema rechaza la operación y muestra un mensaje de error accesible indicando que debe seleccionar un libro

#### Scenario: Rechazo de cantidad cero, negativa o decimal
- **WHEN** el operador ingresa `0`, `-3` o `1.5` en el campo de cantidad e intenta agregar al pedido
- **THEN** el sistema rechaza la incorporación y presenta un mensaje de error accesible indicando que la cantidad debe ser un número entero mayor o igual a 1

### Requirement: Control de no duplicidad de libros en el pedido en borrador
El sistema SHALL impedir la creación de múltiples filas para un mismo libro dentro de una misma venta en borrador (`RN-VNT-03`). Si el operador agrega un libro que ya forma parte del pedido actual, el sistema SHALL incrementar la cantidad del renglón existente sumando las unidades ingresadas, recalcular su subtotal y el total general, y mostrar un aviso informativo accesible.

#### Scenario: Acumulación de cantidad al agregar un libro ya presente en el borrador
- **WHEN** el pedido en borrador contiene el libro "El Aleph" con cantidad `1` y el operador vuelve a seleccionar "El Aleph" con cantidad `2` y presiona "Agregar al pedido"
- **THEN** el sistema no crea una segunda fila, actualiza la cantidad del renglón existente de "El Aleph" a `3`, recalcula su subtotal y muestra un aviso indicando que se sumaron las unidades al renglón existente

### Requirement: Gestión interactiva de renglones en borrador (edición y eliminación)
Antes de confirmar la venta, la tabla de borrador SHALL permitir al operador modificar la cantidad de cualquier renglón (validando que sea un entero `>= 1`) o eliminar renglones individuales, recalculando inmediatamente el subtotal de la fila y el total general de la orden (`RN-VNT-04`).

#### Scenario: Modificación de cantidad de un renglón en la canasta
- **WHEN** el operador cambia la cantidad de un renglón en la tabla de borrador de `1` a `4`
- **THEN** el sistema actualiza inmediatamente el subtotal de ese renglón a `4 * precioUnitario` y recalcula el total general de la venta

#### Scenario: Rechazo o corrección de cantidad inválida al editar renglón en canasta
- **WHEN** el operador intenta establecer una cantidad menor a `1` o no entera en un renglón del borrador
- **THEN** el sistema impide el valor inválido, restaura una cantidad entera válida (`>= 1`) o notifica el error accesible sin corromper los subtotales

#### Scenario: Eliminación individual de un renglón del borrador
- **WHEN** el operador acciona el botón de eliminar sobre un renglón de la canasta
- **THEN** el renglón se quita de la tabla de borrador y el total general se recalcula de inmediato restando dicho importe

### Requirement: Cálculo financiero en tiempo real con dos decimales fijos
El sistema SHALL calcular el subtotal de cada renglón como `cantidad * precioUnitario` y el total general de la venta como la sumatoria de todos los subtotales de los renglones activos, redondeando a 2 decimales numéricos y presentando todos los importes monetarios con formato `$0.00` (`RN-VNT-05`).

#### Scenario: Cálculo exacto de subtotales y total general
- **WHEN** el pedido contiene un renglón de `2` unidades a `$15000.50` (`$30001.00`) y otro renglón de `1` unidad a `$12500.00` (`$12500.00`)
- **THEN** la tabla exhibe los subtotales `$30001.00` y `$12500.00` y el resumen muestra el total general `$42501.00`

#### Scenario: Total general en cero cuando el borrador está vacío
- **WHEN** no se han agregado renglones o se han eliminado todos los renglones del borrador
- **THEN** el total general exhibe `$0.00` y la tabla muestra un estado vacío informativo

### Requirement: Validaciones obligatorias previas a la confirmación de venta
El sistema SHALL validar antes de confirmar una orden de venta que se haya seleccionado un cliente válido y registrado (`RN-VNT-01`) y que el borrador contenga al menos un renglón válido con `cantidad >= 1` (`RN-VNT-02`), interceptando el envío sin recargar la página.

#### Scenario: Bloqueo de confirmación sin cliente seleccionado
- **WHEN** el operador intenta confirmar una venta con renglones cargados pero sin haber seleccionado un cliente
- **THEN** el sistema bloquea la confirmación y muestra un mensaje de error accesible indicando que debe seleccionar un cliente para la venta

#### Scenario: Bloqueo de confirmación con pedido vacío
- **WHEN** el operador selecciona un cliente pero intenta confirmar la venta sin ningún renglón en la canasta
- **THEN** el sistema bloquea la confirmación e informa mediante un mensaje de error accesible que la venta debe incluir al menos un libro

### Requirement: Confirmación de venta y congelamiento de precio histórico
Al confirmarse una venta válida, el sistema SHALL registrar una entidad `Venta` con identificador único (`VNT-XXXX`), fecha y hora actual, `clienteId`, `total` a 2 decimales y la lista `renglones`, donde cada `RenglonVenta` congela como copia fija el `precioUnitario` vigente en ese instante, `titulo`, `cantidad` y `subtotal` (`RN-VNT-06`).

#### Scenario: Registro de venta con snapshot de precio unitario congelado
- **WHEN** el operador selecciona un cliente válido, agrega al menos un renglón y acciona "Confirmar venta"
- **THEN** la venta se almacena en `state.ventas` con su ID único, fecha, `precioUnitario` congelado por renglón y total general redondeado a 2 decimales

### Requirement: Limpieza del borrador y notificación tras confirmar venta
Inmediatamente después de registrar una venta confirmada, el sistema SHALL vaciar el pedido en borrador, restablecer los selectores del formulario de ventas y emitir una notificación accesible de éxito (`RN-VNT-08`).

#### Scenario: Reseteo del borrador y feedback accesible tras confirmación
- **WHEN** se completa el registro de una venta confirmada
- **THEN** la tabla de borrador se vacía volviendo el total a `$0.00`, los controles del formulario se restablecen y se muestra un mensaje de éxito accesible
