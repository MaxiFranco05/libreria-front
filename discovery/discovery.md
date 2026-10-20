# Discovery — Frontend de Librería (Parcial 1)

**Fecha**: 2026-10-19  
**Fuente principal**: `Consigna Primer Parcial.pdf` (UTN - Tecnicatura Universitaria en Programación - Programación III)  

---

## 1. Problema que resuelve

Construir una interfaz de usuario interactiva y simulada en el navegador para una librería (catálogo, gestión de libros y clientes, registro de ventas simuladas e historial inmutable con persistencia local), cumpliendo con los estándares de evaluación de Programación III sin requerir servidor, base de datos ni librerías externas.

## 2. Usuarios / roles

- **Operador / Empleado de librería**: Navega el catálogo, busca libros, da de alta clientes y libros, compone y confirma ventas simuladas y consulta el historial.
- **Docente / Evaluador**: Verifica la navegación clara, accesibilidad por teclado, diseño responsivo (320px y 1280px), validaciones de formularios, persistencia en `localStorage` y la inmutabilidad del precio histórico de venta tras recarga.

## 3. Casos de uso

1. **Como operador**, quiero buscar libros en el catálogo por título (sin distinción de mayúsculas/minúsculas ni espacios extremos) para consultar sus datos y precio.
2. **Como operador**, quiero registrar un nuevo libro (título, ISBN único, precio > 0, editorial, género opcional y al menos un autor) para ampliar el catálogo disponible.
3. **Como operador**, quiero registrar un nuevo cliente con nombre completo y email único válido para poder asignarlo a ventas.
4. **Como operador**, quiero armar una venta seleccionando un cliente, agregando renglones de libros sin duplicar ítems, calculando subtotales y total con dos decimales, y confirmarla.
5. **Como evaluador**, quiero consultar el historial de ventas y comprobar que el precio unitario guardado en cada renglón permanezca inmutable aunque se modifique el catálogo en `localStorage`.
6. **Como usuario**, quiero cerrar o recargar la página y recuperar los datos cargados sin que se dupliquen los datos iniciales de ejemplo.

## 4. Competidores / soluciones existentes

Al tratarse de una práctica académica con alcance pedagógico simulado en el navegador, no compite con productos comerciales, aunque toma como referencia:
- **Sistemas de Punto de Venta (POS) para librerías**: Flujo de caja, catálogo de artículos con ISBN, canasta/renglones de venta y congelamiento de precio fiscal/histórico.
- **E-commerce de libros**: Catálogo con filtros y ficha de producto (editorial, autores, género).

## 5. Funcionalidades necesarias (Innegociables para el Parcial)

- **Estructura semántica HTML**: Vistas de Catálogo, Libros, Clientes, Ventas e Historial con etiquetas semánticas (`header`, `nav`, `main`, `section`, etc.), etiquetas asociadas a cada input y tablas con encabezados.
- **Arquitectura SPA**: Navegación fluida por secciones visibles/ocultas dentro de `index.html`.
- **Estilos CSS propios y responsive**: Adaptabilidad validada entre 320 px y 1280 px sin scroll horizontal de ventana (scroll interno en tablas), con foco visible y mensajes de error descriptivos.
- **Semilla de datos locales**: Carga inicial sin duplicación de al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes ficticios con IDs estables.
- **Filtro de catálogo**: Búsqueda por título insensible a mayúsculas/minúsculas, trim de espacios y mensajes para lista vacía o sin coincidencias.
- **Formularios de alta con validación**:
  - Libros: título e ISBN obligatorios, ISBN único sin guiones ni espacios, precio numérico > 0, editorial y autores existentes, género existente o "Sin clasificar".
  - Clientes: nombre completo y email obligatorios, formato de email válido y unicidad insensible a mayúsculas.
  - Manejo con `preventDefault`, mensajes de error inline y actualización de selectores sin recarga.
- **Simulador de ventas e historial**:
  - Selección de cliente, renglones con libro y cantidad entera > 0.
  - Validación de no duplicar libro en la misma venta (actualizar cantidad o alertar).
  - Cálculo de subtotal y total con dos decimales.
  - Inmutabilidad del precio histórico guardado en el renglón de venta.
  - Listado de ventas y detalle desplegable de renglones.
- **Persistencia en `localStorage`**: Guardado de libros, clientes y ventas sin recargar/duplicar datos semilla al reiniciar.
- **Documentación en `README.md`**: Guía de apertura sin `npm`, detalle de almacenamiento local y registro de los 8 casos manuales solicitados.

## 6. Funcionalidades opcionales (Fuera de alcance del Parcial 1)

- Backend con API REST y base de datos relacional/NoSQL.
- Autenticación o inicio de sesión de usuarios.
- Edición o eliminación de libros, clientes o ventas confirmadas (la consigna prohíbe o no exige estas operaciones).
- ABM de editoriales, géneros o autores (se mantienen fijos/semilla).
- Gestión de stock real, pasarelas de pago o facturación fiscal.

## 7. Reglas de negocio

- **ISBN**: Se compara sin espacios ni guiones; debe ser único y no vacío.
- **Email de cliente**: Formato válido, único (comparado en minúsculas y sin espacios externos).
- **Precios**: Mayores que cero, numéricos; importes visualizados con 2 decimales (`$XX.XX`).
- **Composición de venta**: Requiere obligatoriamente un cliente y al menos un renglón; cantidad entera > 0.
- **Congelamiento de precio histórico**: Al confirmar la venta, el precio unitario actual del libro se copia al renglón de venta; futuras modificaciones del catálogo no deben alterar las ventas pasadas.
- **Persistencia limpia**: En el primer inicio se cargan los ejemplos; en aperturas posteriores se recupera de `localStorage` sin volver a inyectar la semilla.

## 8. Integraciones

- Ninguna integración externa permitida: sin librerías, sin frameworks (React, Vue, Tailwind, Bootstrap, jQuery), sin CDNs externos y sin dependencias de `npm`.

## 9. Restricciones

- **Tecnología**: 100% HTML5, CSS3 y JavaScript nativo (vanilla).
- **Punto de entrada único**: `index.html` en la raíz.
- **Ejecución autónoma**: Debe poder abrirse directamente en el navegador sin herramientas de compilación (`vite`, `webpack`) ni servidor local obligatorio.
- **Accesibilidad y diseño**: Foco visible en todos los elementos interactivos, navegación por teclado, texto alternativo en imágenes y soporte responsive entre 320 px y 1280 px.

## 10. Riesgos

- **Inyección accidental de dependencias**: Utilizar algún paquete o CDN rompería el criterio de evaluación excluyente.
- **Duplicación en recarga**: Manejar incorrectamente la inicialización de `localStorage` provocando que los datos iniciales se reinserten cada vez que se recarga la página.
- **Desborde en 320 px**: Tablas anchas que rompan el layout móvil si no tienen un contenedor con `overflow-x: auto`.
- **Enlace reactivo de precios en ventas**: Leer el precio del catálogo en lugar de la copia histórica al renderizar el historial.

## 11. Preguntas abiertas / Decisiones cerradas en el Discovery

- **Arquitectura de vistas**: Se definió implementar arquitectura SPA (Single Page Application) con secciones semánticas en `index.html` gestionadas mediante clases/atributos de visualización con JavaScript nativo.
- **Diseño visual**: Paleta cálida, editorial y contemporánea (tonos marfil, grafito, toques terracota/madera), con tipografía legible y controles con buen contraste y foco visible.
