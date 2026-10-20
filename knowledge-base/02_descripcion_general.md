# Descripción General

## Stack tecnológico

| Capa | Tecnologías | Versión mínima | Justificación |
|---|---|---|---|
| **Estructura** | HTML5 semántico | Estándar W3C | Elementos semánticos (`header`, `nav`, `main`, `section`, `table`, etc.) y accesibilidad requerida. |
| **Estilos** | CSS3 nativo propio | CSS3 | Flexbox y CSS Grid; variables CSS (custom properties); diseño responsivo sin dependencias ni preprocesadores. |
| **Comportamiento** | JavaScript nativo | ECMAScript 2020 (ES11+) | Manejo del DOM, listeners de eventos, manipulación de arrays/objetos, delegación y módulos limpios sin dependencias. |
| **Almacenamiento** | Web Storage API (`localStorage`) | HTML5 Storage | Persistencia local en cliente sin necesidad de servidor ni motor de base de datos. |

## Arquitectura general
La aplicación adopta una arquitectura SPA (Single Page Application) ligera y modular en el navegador:

```
+-----------------------------------------------------------------------+
|                              Navegador                                |
|                                                                       |
|   index.html (Contenedor raíz con vistas semánticas)                  |
|   +---------------------------------------------------------------+   |
|   | Header & Nav (SPA Router por hash o dataset)                  |   |
|   +---------------------------------------------------------------+   |
|   | Secciones de Vista (Catálogo | Libros | Clientes | Ventas | Hist)|   |
|   +---------------------------------------------------------------+   |
|                               |                                       |
|                               v                                       |
|   Módulos JavaScript (Vanilla JS / Separación de responsabilidades)   |
|   +---------------------------------------------------------------+   |
|   | State Manager / Store: Libros, Clientes, Ventas, Auxiliares   |   |
|   +---------------------------------------------------------------+   |
|   | Storage Service: Carga de semilla / Sync localStorage         |   |
|   +---------------------------------------------------------------+   |
|   | UI Renderers: renderCatálogo(), renderVentas(), renderForms() |   |
|   +---------------------------------------------------------------+   |
|                               |                                       |
|                               v                                       |
|   Storage Engine (window.localStorage)                                |
|   ["libreria_libros", "libreria_clientes", "libreria_ventas", ...]    |
+-----------------------------------------------------------------------+
```

## Integraciones externas

| Servicio | Propósito | Tipo | Estado |
|---|---|---|---|
| Ninguno | No se permiten CDNs, APIs externas ni servicios de terceros | N/A | Excluido por consigna del parcial |

## API REST (si aplica)
No aplica. La totalidad del ciclo de vida de los datos, validaciones y cálculos opera de manera síncrona en memoria y se sincroniza en el `localStorage` del navegador.
