# sales-history Specification

## Purpose
Provee una vista auditable de solo lectura para consultar el historial de ventas confirmadas y su desglose de renglones, garantizando la exhibición estricta del precio unitario histórico congelado al momento de cada transacción sin verse afectado por modificaciones posteriores en el catálogo.

## Requirements

### Requirement: Listado maestro y actualización reactiva del historial de ventas
La sección de historial (`#historial`) SHALL presentar una tabla o listado semántico accesible con todas las ventas confirmadas en `state.ventas`, mostrando para cada transacción su identificador único (`id`), fecha y hora formateada (`fecha`), nombre completo del cliente asociado y total general formateado (`$0.00`), actualizándose de forma reactiva inmediata tras cada venta confirmada sin recargar la página (`US-006`).

#### Scenario: Estado vacío inicial del historial
- **WHEN** el usuario accede a la sección de historial y aún no se ha registrado ninguna venta
- **THEN** el sistema muestra un mensaje de estado vacío claro y accesible indicando que no hay ventas registradas

#### Scenario: Incorporación reactiva de una nueva venta en el historial
- **WHEN** el operador confirma una venta en la sección de ventas
- **THEN** la nueva transacción aparece inmediatamente en el listado de la sección `#historial` con su ID, fecha, nombre del cliente y total sin recargar la página

### Requirement: Desglose expandible accesible por renglones de venta
Cada transacción del historial SHALL incluir un botón accesible por teclado (`aria-expanded`, `aria-controls` y `:focus-visible`) para expandir o colapsar el detalle de sus renglones, mostrando título del libro, cantidad, precio unitario histórico congelado (`$0.00`) y subtotal (`$0.00`).

#### Scenario: Expansión y colapso del detalle de renglones de una venta
- **WHEN** el usuario activa por clic o teclado (`Enter` / `Espacio`) el botón de detalle de una venta en el historial
- **THEN** el sistema despliega la sub-tabla o panel de renglones de esa venta actualizando `aria-expanded="true"` y mostrando el título, cantidad, precio unitario histórico y subtotal de cada ítem

### Requirement: Inmutabilidad del precio histórico frente a cambios en el catálogo
La vista de historial SHALL renderizar el `precioUnitario`, el `subtotal` y el `total` leyendo exclusivamente los valores congelados dentro de cada `RenglonVenta` y `Venta`, sin consultar ni recalcular jamás los importes a partir del precio actual de `state.libros` (`RN-VNT-06`, Regla Dura #7).

#### Scenario: Preservación del precio histórico tras modificación del precio en el catálogo
- **WHEN** se confirma una venta del libro "Ficciones" con precio unitario de `$18500.00` y posteriormente el precio de "Ficciones" en el catálogo cambia a `$25000.00`
- **THEN** el historial de ventas continúa mostrando `$18500.00` como precio unitario histórico y conserva intactos el subtotal del renglón y el total de la venta original

### Requirement: Carácter de solo lectura e integridad auditable del historial
La interfaz del historial de ventas SHALL ser estrictamente de solo lectura (`RN-VNT-07`), careciendo de botones, formularios o controles que permitan editar cantidades, modificar precios o eliminar ventas ya confirmadas.

#### Scenario: Ausencia de controles de edición o baja en ventas registradas
- **WHEN** se renderiza una venta confirmada y su desglose de renglones en la vista `#historial`
- **THEN** únicamente se presentan datos informativos y el control de expansión/colapso de lectura, sin ningún botón de edición ni eliminación de la transacción
