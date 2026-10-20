# Librería Front (UTN Programación III) — Instrucciones para Agentes

> Este archivo (y su copia `CLAUDE.md`) es lo PRIMERO que todo agente lee al entrar al repo.
> Generado a partir de `knowledge-base/` y `CHANGES.md`. No editar a mano sin re-sincronizar ambos archivos.

---

## Stack Tecnológico

| Capa | Tecnologías | Versión mínima | Justificación |
|---|---|---|---|
| **Estructura** | HTML5 semántico | Estándar W3C | Elementos semánticos (`header`, `nav`, `main`, `section`, `table`, etc.) y accesibilidad requerida. |
| **Estilos** | CSS3 nativo propio | CSS3 | Flexbox y CSS Grid; variables CSS (custom properties); diseño responsivo sin dependencias ni preprocesadores. |
| **Comportamiento** | JavaScript nativo | ECMAScript 2020 (ES11+) | Manejo del DOM, listeners de eventos, manipulación de arrays/objetos, delegación y módulos limpios sin dependencias. |
| **Almacenamiento** | Web Storage API (`localStorage`) | HTML5 Storage | Persistencia local en cliente sin necesidad de servidor ni motor de base de datos. |

Detalle completo: [knowledge-base/02_descripcion_general.md](knowledge-base/02_descripcion_general.md)

---

## Base de Conocimiento

La fuente de verdad del dominio vive en `knowledge-base/`. **Leé el archivo relevante ANTES de implementar.**

| Archivo | Cuándo leerlo |
|---|---|
| [01_vision_y_objetivos.md](knowledge-base/01_vision_y_objetivos.md) | Entender propósito del parcial y alcance de evaluación |
| [02_descripcion_general.md](knowledge-base/02_descripcion_general.md) | Stack y arquitectura general de la SPA |
| [03_actores_y_roles.md](knowledge-base/03_actores_y_roles.md) | Actores (operador, evaluador), permisos y vistas |
| [04_modelo_de_datos.md](knowledge-base/04_modelo_de_datos.md) | Entidades (Libro, Cliente, Venta, etc.), ERD y seed inicial |
| [05_reglas_de_negocio.md](knowledge-base/05_reglas_de_negocio.md) | Reglas codificadas por dominio (RN-CAT, RN-LIB, RN-CLI, RN-VNT, RN-PER) |
| [06_funcionalidades.md](knowledge-base/06_funcionalidades.md) | Historias de usuario por épica con criterios de aceptación |
| [07_flujos_principales.md](knowledge-base/07_flujos_principales.md) | Flujos E2E: ventas, altas, inicialización y prueba guiada |
| [08_arquitectura_propuesta.md](knowledge-base/08_arquitectura_propuesta.md) | Patrones, estructura de directorios y seguridad DOM |
| [09_decisiones_y_supuestos.md](knowledge-base/09_decisiones_y_supuestos.md) | Decisiones de diseño (SPA, apertura file://, estética editorial) |
| [10_preguntas_abiertas.md](knowledge-base/10_preguntas_abiertas.md) | Inconsistencias y puntos cerrados |

---

## Skills Disponibles

| Agente / Especialidad | Rol | Skills que carga |
|---|---|---|
| **UI & Estilos** | Maquetación semántica, CSS responsivo y estética editorial | `ui-ux-pro-max`, `impeccable`, `responsive-design`, `accessibility` |
| **Lógica & Estado** | JavaScript nativo ES6+, validaciones y cálculo de ventas | `modern-javascript-patterns`, `tdd` |
| **Orquestador / SDD** | Gestión de changes OPSX, spec-driven development | `openspec-propose`, `openspec-apply-change`, `openspec-archive-change` |

Cargá la skill correspondiente al contexto ANTES de escribir código.

> Los compact rules de cada skill los resuelve el orquestador desde `.atl/skill-registry.md` (generado por `skill-registry`; no versionado — no está en el repo). Esta tabla solo mapea skill→rol.

---

## Roadmap de Changes

El plan de implementación completo está en [CHANGES.md](CHANGES.md). Resumen:

- **Total**: 6 changes en 6 fases.
- **Camino crítico** (6): `C-01 → C-02 → C-03 → C-04 → C-05 → C-06`.
- **Primer change**: `C-01` (`spa-shell-layout-accessibility`).

**Antes de cualquier `/opsx:propose`**: leé [CHANGES.md](CHANGES.md), identificá las dependencias del change y los archivos de "Leer antes".

---

## Reglas Duras (específicas del proyecto)

> Reglas **globales** ya definidas en `~/.claude/CLAUDE.md` (orquestador, governance, TDD, engram): el proyecto las **hereda**, no se repiten acá.

Acá van las reglas específicas de este proyecto, derivadas de su stack (Vanilla HTML5/CSS3/JS + localStorage) y **confirmadas con el usuario**. Son contrato; romperlas es un defecto que invalida la evaluación:

1. **NUNCA usar librerías externas, frameworks, CDNs ni dependencias npm** (`React`, `Vue`, `Tailwind`, `Bootstrap`, `jQuery`, etc.) → Usar exclusivamente HTML5 semántico, CSS3 propio y JavaScript nativo (vanilla).
2. **NUNCA romper la apertura directa mediante `file://` (doble clic)** → Estructurar los scripts y recursos para ejecución local inmediata sin errores de CORS y sin requerir servidor HTTP ni npm.
3. **NUNCA usar `fetch` ni llamadas HTTP/APIs externas** → Los datos y operaciones se simulan en memoria y se sincronizan localmente en `localStorage`.
4. **NUNCA implementar formularios o ABM para editoriales, géneros o autores** → Son entidades de referencia fijas provistas exclusivamente por la semilla inicial (solo Libros y Clientes admiten altas).
5. **NUNCA usar `.innerHTML` con datos no sanitizados** → Usar `.textContent` o creación segura de elementos DOM (`document.createElement`) para prevenir XSS.
6. **NUNCA permitir scroll horizontal en la ventana (320px–1280px)** → Usar Flexbox/Grid y contenedores con `overflow-x: auto` específicos para tablas que superen el ancho móvil.
7. **NUNCA recalcular el precio histórico desde el catálogo al consultar el historial de ventas** → Congelar el snapshot del precio unitario y subtotales en el renglón de venta al momento de confirmar.
8. **NUNCA reinsertar o duplicar la semilla inicial al recargar la página** → Controlar la inicialización en `localStorage` con la clave bandera `libreria_inicializada`.
9. **NUNCA omitir el foco visible por teclado en controles interactivos** → Mantener `:focus-visible` accesible y navegación completa mediante tecla `Tab`.

---

## Flujo de Trabajo

```
1. Leer la KB relevante (knowledge-base/)        → entender el dominio
2. Identificar el change en CHANGES.md           → respetar dependencias
3. /opsx:propose C-NN-nombre                     → proposal + design + specs + tasks
4. Implementar las tasks (cargando skills)       → respetando las reglas duras
5. /opsx:archive C-NN-nombre + marcar [x]        → cerrar el change
```

Aplicar TODAS las reglas duras en cada paso. Ante conflicto entre la KB y este archivo, las reglas duras prevalecen.
