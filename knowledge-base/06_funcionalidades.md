# Funcionalidades

Las funcionalidades del sistema se organizan por épica y siguen el formato de Historias de Usuario (US-NNN).

---

## Épica 1: Navegación y Shell de la Aplicación

### US-001 — Navegación entre vistas SPA
**Como** operador o evaluador  
**Quiero** moverme entre las vistas de Catálogo, Libros, Clientes, Ventas e Historial mediante un menú superior persistente  
**Para** acceder ágilmente a cada funcionalidad sin recargar la página  

**Criterios de aceptación**:
- [ ] La navegación utiliza etiquetas semánticas (`<header>`, `<nav>`, `<main>`).
- [ ] Al hacer clic en un enlace de navegación, se muestra la vista seleccionada y se ocultan las demás.
- [ ] La URL refleja el hash de la vista activa (ej. `#catalogo`, `#ventas`).
- [ ] Todos los enlaces y controles son navegables por teclado y mantienen foco visible.

---

## Épica 2: Catálogo y Búsqueda de Libros

### US-002 — Visualización y búsqueda en Catálogo
**Como** operador  
**Quiero** visualizar la lista de libros disponibles y filtrar por título en tiempo real  
**Para** consultar rápidamente disponibilidad, autores y precios  

**Criterios de aceptación**:
- [ ] Cada tarjeta o fila muestra: título, ISBN, editorial, género (o «Sin clasificar»), autores y precio.
- [ ] El filtro compara de manera insensible a mayúsculas/minúsculas y recorta espacios exteriores.
- [ ] Una búsqueda sin texto muestra todo el catálogo.
- [ ] Una búsqueda sin resultados exhibe un mensaje claro: "No se encontraron libros que coincidan con la búsqueda".

**Reglas relacionadas**: RN-CAT-01, RN-CAT-02, RN-CAT-03, RN-CAT-04, RN-CAT-05, RN-CAT-06.

---

## Épica 3: Gestión de Altas (Libros y Clientes)

### US-003 — Alta de Libros
**Como** operador  
**Quiero** ingresar un nuevo libro mediante un formulario validado  
**Para** incorporarlo al catálogo y habilitarlo para futuras ventas  

**Criterios de aceptación**:
- [ ] Campos disponibles: Título, ISBN, Precio, Editorial (selector), Género (selector con "Sin clasificar") y Autores (selector múltiple).
- [ ] Rechaza envío si el título está vacío, el ISBN ya existe o está vacío, o el precio es menor o igual a cero.
- [ ] Normaliza el ISBN removiendo espacios y guiones antes de validar y guardar.
- [ ] Muestra mensajes de error claros cerca del formulario y bloquea el envío con `preventDefault`.
- [ ] Tras el alta correcta, se limpia el formulario y se actualiza el listado y el catálogo sin recarga.

**Reglas relacionadas**: RN-LIB-01 a RN-LIB-06.

### US-004 — Alta de Clientes
**Como** operador  
**Quiero** registrar nuevos clientes con su nombre completo y correo electrónico  
**Para** tenerlos disponibles al momento de emitir una venta  

**Criterios de aceptación**:
- [ ] Campos disponibles: Nombre completo y Email.
- [ ] Valida que el nombre y email no estén vacíos ni contengan solo espacios.
- [ ] Valida formato de email estándar mediante expresión regular / validación nativa.
- [ ] Valida unicidad del email (comparando en minúsculas y sin espacios).
- [ ] Muestra mensajes de error o confirmación cerca del formulario sin recargar.
- [ ] Actualiza de inmediato el listado de clientes y el selector en el formulario de ventas.

**Reglas relacionadas**: RN-CLI-01 a RN-CLI-04.

---

## Épica 4: Venta Simulada e Historial Inmutable

### US-005 — Composición y confirmación de venta
**Como** operador  
**Quiero** armar una orden de venta seleccionando cliente, libros y cantidades  
**Para** calcular importes y concretar la transacción  

**Criterios de aceptación**:
- [ ] Selector para elegir cliente existente.
- [ ] Selectores para agregar libros y especificar cantidad entera positiva.
- [ ] Si se agrega un libro ya existente en la venta, incrementa la cantidad o muestra advertencia sin duplicar renglón.
- [ ] Permite modificar cantidades o quitar renglones antes de la confirmación.
- [ ] Cada renglón muestra libro, precio unitario, cantidad y subtotal (`cantidad * precio`).
- [ ] Muestra el total general de la venta con 2 decimales.
- [ ] Impide confirmar si no hay cliente seleccionado o no hay al menos un renglón válido.
- [ ] Al confirmar, copia el precio unitario del catálogo como valor histórico en el renglón.
- [ ] Genera un ID único y fecha, guarda la venta en `localStorage`, limpia el formulario y muestra mensaje de éxito.

**Reglas relacionadas**: RN-VNT-01 a RN-VNT-06, RN-VNT-08.

### US-006 — Consulta de Historial de Ventas
**Como** operador o evaluador  
**Quiero** revisar las ventas históricas y acceder al detalle de sus renglones  
**Para** auditar las operaciones y verificar la inmutabilidad de los precios  

**Criterios de aceptación**:
- [ ] Lista todas las ventas con ID, fecha, nombre del cliente y monto total.
- [ ] Permite desplegar o consultar el detalle de renglones de cada venta (libro, cantidad, precio unitario histórico y subtotal).
- [ ] Las ventas confirmadas no muestran opciones de edición ni eliminación.
- [ ] Si el precio de un libro cambia en el catálogo, el historial sigue mostrando el precio original de la venta.

**Reglas relacionadas**: RN-VNT-06, RN-VNT-07.

---

## Épica 5: Persistencia y Calidad de Interfaz

### US-007 — Persistencia en localStorage sin duplicación
**Como** usuario  
**Quiero** que mis datos permanezcan guardados al recargar el navegador  
**Para** no perder la información cargada ni que se dupliquen los libros o clientes iniciales  

**Criterios de aceptación**:
- [ ] El primer inicio carga los datos iniciales semilla.
- [ ] Recargas posteriores leen del `localStorage` sin reinsertar duplicados de la semilla.
- [ ] Libros, clientes y ventas nuevas se sincronizan inmediatamente en `localStorage`.

**Reglas relacionadas**: RN-PER-01, RN-PER-02, RN-PER-03.

### US-008 — Adaptabilidad responsive y accesibilidad
**Como** usuario o evaluador  
**Quiero** operar la interfaz de forma fluida en pantallas de 320px a 1280px y mediante teclado  
**Para** garantizar una experiencia accesible y sin desbordes  

**Criterios de aceptación**:
- [ ] La interfaz se visualiza correctamente en 320 px y 1280 px sin generar scroll horizontal global en la ventana.
- [ ] Las tablas que excedan el ancho disponible cuentan con desplazamiento propio (`overflow-x: auto`).
- [ ] Todos los botones, enlaces e inputs tienen foco visible y se recorren mediante la tecla `Tab`.
- [ ] Los mensajes de error utilizan texto descriptivo además de distinción cromática.
- [ ] Las imágenes poseen texto alternativo `alt`.
