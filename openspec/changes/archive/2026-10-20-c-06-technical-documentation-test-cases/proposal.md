# Proposal

## Why

Habiendo completado e integrado con éxito las 5 fases funcionales previas (SPA Shell, Catálogo y Búsqueda, Altas de Libros y Clientes, Simulación de Ventas con Inmutabilidad Histórica y Persistencia en `localStorage`), es mandatorio elaborar la documentación técnica institucional del proyecto y formalizar el registro de evidencias de los 8 Casos de Prueba Manuales requeridos por la consigna oficial del Parcial 1 de Programación III (UTN).

Este cambio finaliza el ciclo del parcial entregando un `README.md` completo, profesional y accesible que permite a los docentes y evaluadores comprender la arquitectura, ejecutar la aplicación inmediatamente sin herramientas de compilación ni npm, y verificar la aprobación de cada criterio de evaluación.

## What Changes

- **Elaboración de `README.md` institucional en la raíz del proyecto**:
  - **Portada académica**: Institución (Universidad Tecnológica Nacional - Facultad Regional Mendoza), carrera, cátedra (Programación III), cuatrimestre y datos del equipo de desarrollo.
  - **Guía de inicio rápido sin compiladores**: Instrucciones precisas para ejecutar la aplicación mediante apertura directa con doble clic (`file://`) y alternativas con servidores estáticos locales (`python -m http.server`, VS Code Live Server).
  - **Recorrido operativo de la SPA**: Manual de uso paso a paso de las 5 vistas funcionales (Catálogo, Libros, Clientes, Ventas e Historial).
  - **Arquitectura y decisiones de diseño**: Explicación de la arquitectura SPA con hash routing, módulo centralizado de estado, adaptador de almacenamiento local tolerante a fallos y patrón de snapshot contable para inmutabilidad de precios históricos.
- **Matriz formal de los 8 Casos de Prueba Manuales**:
  - Tabla de evidencias con columnas: `Caso #`, `Funcionalidad / Requisito`, `Pasos ejecutados`, `Resultado esperado`, `Resultado obtenido` y `Estado (Aprobado)`.
  - Cobertura exhaustiva de los 8 casos de consigna (Carga inicial, Búsqueda insensible/parcial, Búsqueda vacía/sin resultados, Alta de Libros y validaciones, Alta de Clientes y unicidad, Composición de Ventas y totalizador dinámico, Prueba DevTools de inmutabilidad del precio histórico tras F5, y Persistencia en recarga sin duplicación de catálogo).
- **Consolidación de suite de tests automatizados**: Documentación de la suite nativa de 116 verificaciones unitarias y de integración (`node tests/test-c01.js` a `test-c05.js`).

## Capabilities

### New Capabilities
- `technical-documentation`: Estándares de documentación técnica institucional, manual operativo de usuario, guía de arranque sin dependencias npm y matriz de evidencias de los 8 casos de prueba manuales de la cátedra.

### Modified Capabilities
*(Ninguna. La funcionalidad de la aplicación se encuentra 100% implementada y validada).*

## Impact

- **Código y archivos afectados**:
  - Creación de `README.md` canónico en la raíz del proyecto.
  - Actualización de `CHANGES.md` para marcar la totalidad del roadmap como completado (`[x]`).
- **Dependencias**: Ninguna. Documentación en Markdown puro GitHub-flavored. Compatible con cualquier visor de Markdown o renderizado en GitHub.
