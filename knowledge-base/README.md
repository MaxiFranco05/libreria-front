# Frontend de Librería — Base de Conocimiento (Knowledge Base)

Base de conocimiento canónica generada para el desarrollo del **Parcial 1: Frontend de una Librería** (Programación III - UTN Tecnicatura Universitaria en Programación).

---

## Índice de Archivos Canónicos

| Archivo | Temas Cubiertos |
|---|---|
| [01_vision_y_objetivos.md](01_vision_y_objetivos.md) | Propósito del sistema, objetivos por actor, alcance v1.0, exclusiones y métricas de éxito. |
| [02_descripcion_general.md](02_descripcion_general.md) | Stack técnico (HTML5, CSS3, JS Vanilla, LocalStorage), arquitectura general y justificación. |
| [03_actores_y_roles.md](03_actores_y_roles.md) | Actores (operador, docente evaluador), matriz RBAC de permisos y rutas públicas SPA. |
| [04_modelo_de_datos.md](04_modelo_de_datos.md) | Entidades (Libro, Editorial, Género, Autor, Cliente, Venta, RenglonVenta), ERD y datos semilla. |
| [05_reglas_de_negocio.md](05_reglas_de_negocio.md) | Reglas codificadas por dominio: RN-CAT, RN-LIB, RN-CLI, RN-VNT y RN-PER. |
| [06_funcionalidades.md](06_funcionalidades.md) | Historias de usuario organizadas por épica con criterios de aceptación detallados. |
| [07_flujos_principales.md](07_flujos_principales.md) | Flujos paso a paso: venta simulada, alta de libro con ISBN, inicialización y prueba guiada. |
| [08_arquitectura_propuesta.md](08_arquitectura_propuesta.md) | Patrones de diseño aplicados, estructura de directorios, seguridad DOM y manejo de errores. |
| [09_decisiones_y_supuestos.md](09_decisiones_y_supuestos.md) | Decisiones de diseño (SPA, compatibilidad `file://`, estilo editorial) y supuestos. |
| [10_preguntas_abiertas.md](10_preguntas_abiertas.md) | Registro de inconsistencias, acuerdos cerrados y detalles menores de presentación. |

---

## Quick Start para Desarrolladores

1. **Entender el alcance y actores**: Consultar [01_vision_y_objetivos.md](01_vision_y_objetivos.md) y [03_actores_y_roles.md](03_actores_y_roles.md).
2. **Entender las entidades y datos semilla**: Consultar [04_modelo_de_datos.md](04_modelo_de_datos.md).
3. **Revisar las reglas de negocio**: Consultar [05_reglas_de_negocio.md](05_reglas_de_negocio.md).
4. **Comprender la estructura de código**: Consultar [08_arquitectura_propuesta.md](08_arquitectura_propuesta.md).
5. **Implementar los flujos y features**: Consultar [07_flujos_principales.md](07_flujos_principales.md) y [06_funcionalidades.md](06_funcionalidades.md).

---

## Resumen Ejecutivo

Este proyecto implementa de manera pura y nativa (sin frameworks, librerías externas ni herramientas de compilación npm) el frontend completo para una librería simulada. Ofrece navegación fluida en una SPA accesible y adaptable (320px a 1280px), gestión de catálogo con filtro dinámico, formularios de alta con validación estricta, simulación de ventas con cálculo automático y congelamiento de precio histórico en `localStorage`.
