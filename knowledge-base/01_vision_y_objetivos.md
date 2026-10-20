# Visión y Objetivos

## Propósito del sistema
Proveer una aplicación web frontend interactiva y autónoma para la gestión y simulación comercial de una librería (catálogo, altas de libros y clientes, ventas simuladas e historial inmutable con persistencia en `localStorage`), desarrollada exclusivamente con estándares web nativos (HTML5 semántico, CSS3 propio y JavaScript ES6+) conforme a los requisitos de evaluación de Programación III (Tecnicatura Universitaria en Programación - UTN).

## Objetivos por actor

| Actor | Objetivo principal | Objetivos secundarios |
|---|---|---|
| **Operador / Empleado** | Registrar altas, consultar catálogo y procesar ventas simuladas con precisión. | Buscar libros ágilmente por título; revisar clientes existentes; visualizar subtotales y totales calculados dinámicamente; consultar ventas previas. |
| **Docente / Evaluador** | Validar exhaustivamente las consignas técnicas del Parcial 1. | Probar navegación fluida entre vistas; comprobar validación estricta de formularios y mensajes de error; verificar responsive (320px y 1280px) y foco por teclado; auditar persistencia y congelamiento de precio histórico en `localStorage`. |

## Alcance v1.0 (Parcial 1)
- Entrada única `index.html` con arquitectura SPA basada en secciones semánticas y navegación mediante JS.
- Catálogo interactivo de libros con filtro por título (búsqueda parcial, insensible a mayúsculas/minúsculas y con trim de espacios extremos).
- Formulario de alta de libros con validación de título, ISBN único (normalizado sin guiones ni espacios), precio numérico mayor a cero, selectores de editorial, género (con opción "Sin clasificar") y autores (múltiple).
- Formulario de alta de clientes con validación de nombre completo no vacío y email único y válido.
- Simulador de ventas: selección de cliente, adición de renglones con libros y cantidad entera positiva, prevención de ítems repetidos en una venta, cálculo en vivo de subtotales y total con 2 decimales.
- Historial de ventas: listado cronológico de ventas con ID, fecha, cliente, total y detalle desplegable de renglones.
- Persistencia total en `localStorage`: hidratación inicial con semilla (mínimo 6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes) sin duplicación en recargas.
- Inmutabilidad de venta: snapshot del precio unitario al momento de la venta que no se altera si cambia el catálogo.
- Documentación completa en `README.md` con pasos de ejecución directa y registro de los 8 casos de prueba manuales.

## Fuera de alcance
- Conexión con APIs externas, bases de datos remotas o servidor backend.
- Uso de frameworks o librerías externas (Bootstrap, Tailwind, React, Vue, jQuery, etc.) o paquetes npm.
- Autenticación real de usuarios, login o gestión de sesiones con contraseñas.
- Modificación o eliminación de libros, clientes o ventas confirmadas.
- ABM interactivo de editoriales, autores o géneros (se definen en la semilla inicial).
- Cobros electrónicos con pasarelas de pago, gestión física de stock de inventario o facturación fiscal real.

## Métricas de éxito
- **Cumplimiento de consigna**: 100/100 puntos en los 6 ejercicios de la rúbrica oficial.
- **Cero dependencias**: Ejecución directa en navegador abriendo `index.html` sin build ni servidores intermedios.
- **Calidad de interfaz**: Cero desbordes horizontales de página en 320px y 1280px; 100% de controles accesibles y navegables por teclado con foco visible.
