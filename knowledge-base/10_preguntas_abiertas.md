# Preguntas Abiertas e Inconsistencias

## Inconsistencias detectadas
No se detectaron inconsistencias entre la consigna oficial del Parcial 1 y la arquitectura propuesta. Todos los requerimientos del docente fueron incorporados y mapeados directamente en los requerimientos funcionales, las reglas de negocio y los flujos.

## Preguntas abiertas (priorizadas)

| Prioridad | Pregunta | Bloquea | Decisor | Estado |
|---|---|---|---|---|
| **Baja** | ¿Se prefiere un botón de "Restablecer datos de ejemplo" en la interfaz para facilitar la corrección docente? | Pruebas manuales | Desarrollador | Opcional (puede agregarse en el footer para comodidad del evaluador). |
| **Baja** | ¿El formato de fecha de venta debe ser `DD/MM/YYYY HH:mm` o ISO? | Presentación visual | Desarrollador | Resuelto: se almacenará ISO 8601 y se mostrará formateado localmente en español (`DD/MM/YYYY HH:mm`). |
| **Baja** | ¿Los datos iniciales deben incluir imágenes de portada para los libros? | Estética catálogo | Desarrollador | Opcional: la consigna indica que si hay imágenes ajenas se cite procedencia en el README; se pueden usar portadas SVG/CSS vectoriales generadas localmente para evitar enlaces rotos. |

## Resumen de definiciones cerradas
- **Navegación**: Resuelto por decisión de arquitectura SPA.
- **Diseño**: Resuelto por paleta editorial cálida y responsive 320px - 1280px.
- **Inmutabilidad**: Resuelto con copia estricta de precio unitario en renglón de venta.
- **Apertura**: Resuelto con scripts directos compatibles con doble clic y `file://`.
