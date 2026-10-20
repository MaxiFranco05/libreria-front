# Design

## Context

Con las 5 fases de código e interfaz completadas (C-01 a C-05), la aplicación cuenta con todas las funcionalidades exigidas por la consigna oficial del Parcial 1 de Programación III UTN. Sin embargo, el proyecto carece de un `README.md` canónico en la raíz que unifique la portada académica, el manual operativo, las directrices de ejecución sin npm y la matriz formal de los 8 casos de prueba manuales.

## Goals / Non-Goals

**Goals:**
- Diseñar la estructura canónica y profesional del `README.md` en la raíz del repositorio siguiendo las pautas de diseño y presentación editorial.
- Proveer instrucciones claras y detalladas de inicio rápido con doble clic (`file://`) y servidores locales (`python -m http.server`, VS Code Live Server).
- Documentar las 5 vistas de la SPA (`#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial`) con capturas/diagramas de flujo y pasos de uso.
- Estructurar la matriz tabular de los 8 casos de prueba manuales con descripción, pasos de reproducción, resultado esperado, resultado obtenido y estado.
- Documentar la suite de 89 pruebas automatizadas nativas (`tests/test-c01.js` a `test-c05.js`).
- Actualizar `CHANGES.md` para reflejar el cierre formal del 100% de los changes del roadmap.

**Non-Goals:**
- No alterar la lógica de negocio ni el código funcional de la aplicación (salvo documentación).
- No incorporar dependencias npm, herramientas de empaquetado ni frameworks de testing externos (Regla Dura #1).

## Decisions

### 1. Estructura y Jerarquía del `README.md`
- **Decisión**: Organizar el documento en 6 secciones principales:
  1. *Portada y Metadatos Académicos*: UTN FRBA, Programación III, Parcial 1, integrantes y año lectivo.
  2. *Características Principales*: Stack nativo (HTML5/CSS3/Vanilla JS/localStorage), diseño responsivo 320px–1280px y accesibilidad WCAG AA.
  3. *Guía de Inicio Rápido (Apertura Directa y Servidores Estáticos)*: Enfatizando la apertura con doble clic (`file://`) para respetar la Regla Dura #2.
  4. *Manual Operativo de la SPA*: Guía de uso de las 5 vistas.
  5. *Arquitectura del Sistema*: Patrones de diseño (State Manager, Storage Adapter, Snapshot inmutable de ventas, enrutador por hash).
  6. *Matriz de Casos de Prueba Manuales (8 Casos de Consigna)* y *Suite Automatizada*.
- **Rationale**: Proporciona a los evaluadores una experiencia de lectura fluida que responde directamente a cada rúbrica de corrección de la cátedra.

### 2. Formato de la Matriz de Pruebas
- **Decisión**: Estructurar los 8 casos en una tabla Markdown con campos unívocos:
  - `Caso #`
  - `Funcionalidad / Requisito`
  - `Pasos Ejecutados`
  - `Resultado Esperado`
  - `Resultado Obtenido`
  - `Estado` (✅ Aprobado)
- **Rationale**: Facilita la auditoría docente y aporta evidencia irrefutable de que cada flujo (en particular la prueba DevTools de inmutabilidad y la no duplicación en recargas) fue exhaustivamente validado.

## Risks / Trade-offs

- **[Riesgo de discrepancias entre la documentación y el código real]** → *Mitigación*: Cada caso de prueba se redacta a partir del comportamiento real ya verificado por los 89 tests automatizados en `tests/`.
- **[Riesgo de confusión sobre ejecución con npm]** → *Mitigación*: Declarar explícitamente en el encabezado que el proyecto es 100% libre de dependencias npm y no requiere compilación.
