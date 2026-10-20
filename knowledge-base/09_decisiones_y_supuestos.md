# Decisiones y Supuestos

## Decisiones documentadas

### DD-01 — Arquitectura SPA en lugar de multi-página
- **Decisión**: Implementar una Single Page Application con secciones semánticas dentro de `index.html` activadas mediante JavaScript (hash routing / clases de visibilidad).
- **Contexto**: La consigna permitía elegir entre varias páginas HTML o secciones de una misma página.
- **Alternativas consideradas**: Crear 5 archivos `.html` independientes (`catalogo.html`, `libros.html`, etc.).
- **Justificación**: Mantiene el estado en memoria compartido entre vistas de manera mucho más fluida (ej. actualizar selectores de venta inmediatamente al crear un cliente), reduce duplicación de headers/navs y ofrece una UX ágil y moderna.
- **Trade-offs aceptados**: Requiere una lógica de enrutamiento frontend en JavaScript para mostrar y ocultar las secciones correspondientes.

### DD-02 — Compatibilidad de apertura directa (`file://`) sin CORS
- **Decisión**: Estructurar los scripts JavaScript mediante inclusión secuencial clásica o encapsulamiento en espacio de nombres (`window.LibreriaApp`) asegurando compatibilidad total al hacer doble clic sobre `index.html` mediante protocolo `file://`.
- **Contexto**: El uso de `<script type="module">` nativo suele ser bloqueado por las políticas CORS de navegadores modernos al abrirse directamente desde el sistema de archivos (`file://`).
- **Alternativas consideradas**: Obligar al usuario a levantar un servidor HTTP local (`python -m http.server` o `npx serve`).
- **Justificación**: La consigna exige expresamente: *"El README identifica a quienes realizan el trabajo y contiene: pasos para abrir index.html en el navegador sin npm"*. Permitir que funcione tanto con doble clic directo (`file://`) como con un servidor local garantiza máxima compatibilidad y evita penalizaciones docentes.
- **Trade-offs aceptados**: Uso de módulos IIFE o un namespace global en lugar de `import/export` ES Modules nativos para no romper `file://`.

### DD-03 — Identidad visual editorial cálida
- **Decisión**: Adoptar una estética editorial contemporánea con tonos cálidos: marfil/crema para fondos, grafito para textos y acentos en terracota/madera y azul noche.
- **Contexto**: El ejercicio 2 exige identidad visual propia y coherente con tipografía, tarjetas, formularios y botones.
- **Alternativas consideradas**: Estilo corporativo azul plano o minimalismo frío blanco/negro.
- **Justificación**: Evoca la atmósfera de una librería física de calidad y logra un contraste excelente para accesibilidad visual y legibilidad en pantallas de 320px a 1280px.
- **Trade-offs aceptados**: Requiere diseño y armonización cuidadosa de variables CSS.

### DD-04 — Estrategia de snapshot para inmutabilidad del historial de ventas
- **Decisión**: Cada renglón de una venta confirmada almacenará un snapshot completo de los valores al momento de la venta (`libroId`, `titulo`, `precioUnitario`, `cantidad`, `subtotal`).
- **Contexto**: El docente verifica expresamente que al modificar el precio en `localStorage` del catálogo, las ventas anteriores no modifiquen sus montos.
- **Alternativas consideradas**: Guardar solo `libroId` y buscar el precio en el catálogo al renderizar el historial.
- **Justificación**: Cumple estrictamente con la consigna del Ejercicio 5 y refleja las mejores prácticas comerciales de auditoría e inmutabilidad contable.

---

## Supuestos inferidos

### SU-01 — Entidades secundarias fijas (Editoriales, Géneros, Autores)
- **Supuesto**: No se requiere una pantalla de gestión (ABM) para dar de alta o eliminar editoriales, géneros o autores; alcanzan los provistos en la semilla inicial.
- **Origen**: Consigna Ejercicio 3: *"No se requiere traer datos con fetch ni administrar altas, bajas y modificaciones de editoriales, géneros o autores"*.
- **Riesgo si es falso**: Nulo, está explícitamente descartado en la consigna.

### SU-02 — No persistencia de contraseñas ni roles de usuario
- **Supuesto**: La aplicación opera como un punto de venta local abierto sin login.
- **Origen**: Consigna Página 1: *"Tampoco se requiere un inicio de sesión real"*.

### SU-03 — Edición o baja de ventas no permitida
- **Supuesto**: Una vez confirmada una venta, no puede modificarse ni borrarse desde la interfaz.
- **Origen**: Consigna Ejercicio 5: *"Las ventas confirmadas no se editan ni eliminan desde la interfaz"*.
