# Actores y Roles

## Actores del sistema

| Actor | Descripción | Cómo interactúa |
|---|---|---|
| **Operador / Empleado** | Usuario final encargado de la administración cotidiana de la librería. | Interactúa mediante mouse y teclado con las 5 vistas de la SPA para filtrar libros, cargar altas, componer ventas y revisar ventas pasadas. |
| **Docente / Evaluador** | Usuario evaluador académico que audita el código, los estándares y los casos de prueba. | Ejecuta la batería de pruebas manuales especificadas en la consigna, modifica el `localStorage` en DevTools para comprobar inmutabilidad de precios históricos y verifica la accesibilidad. |

## RBAC — Matriz de permisos
Dado que el proyecto es una aplicación frontend sin autenticación real de usuarios ni servidor, todos los accesos se consideran con privilegios de operador local:

| Recurso | Crear | Leer | Actualizar | Eliminar | Notas |
|---|---|---|---|---|---|
| **Catálogo / Libros** | Sí | Sí | No | No | Alta permitida; edición/baja fuera de consigna. |
| **Clientes** | Sí | Sí | No | No | Alta permitida; edición/baja fuera de consigna. |
| **Ventas (en borrador)**| Sí | Sí | Sí | Sí | Durante el armado de la venta se pueden modificar cantidades o quitar renglones. |
| **Ventas (confirmadas)**| No | Sí | No | No | Las ventas confirmadas son inmutables; no se pueden alterar ni borrar desde la UI. |
| **Editoriales / Géneros / Autores** | No | Sí | No | No | Solo lectura (provistos por semilla inicial). |

## Rutas públicas
Al ser una SPA en un único archivo `index.html`, todas las secciones son accesibles sin restricción:
- `#catalogo`: Catálogo con buscador.
- `#libros`: Formulario de alta y listado de libros.
- `#clientes`: Formulario de alta y listado de clientes.
- `#ventas`: Formulario de composición de venta actual.
- `#historial`: Listado de ventas confirmadas y consulta de detalles de renglones.
