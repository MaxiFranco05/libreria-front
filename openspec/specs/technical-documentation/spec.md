# technical-documentation Specification

## Purpose
Define los estándares de documentación técnica del proyecto, presentación académica institucional, guía de ejecución directa sin herramientas de compilación ni npm, manual operativo de la SPA y registro formal de evidencias para los 8 casos de prueba manuales de la cátedra de Programación III UTN.

## Requirements

### Requirement: Canonical Institutional Readme
The system SHALL provide a canonical `README.md` at the project root containing complete institutional metadata, buildless quick start guides (including direct `file://` double-click and local static servers), architectural overview, and an operational manual for all five SPA views.

#### Scenario: Guía de ejecución directa sin herramientas npm
- **WHEN** un evaluador o docente consulta el archivo `README.md` buscando instrucciones de ejecución
- **THEN** el documento provee pasos precisos para abrir `index.html` directamente mediante protocolo `file://` o servidores estáticos locales sin requerir `npm install` ni herramientas de compilación

#### Scenario: Manual operativo de las vistas SPA
- **WHEN** un operador o evaluador lee el manual de usuario en `README.md`
- **THEN** encuentra el flujo detallado de operación para las vistas de Catálogo, Alta de Libros, Alta de Clientes, Simulación de Ventas e Historial Inmutable

### Requirement: Official Evaluation Test Cases Matrix
The system SHALL provide a structured evidence matrix in `README.md` documenting the test number, functionality, executed steps, expected outcome, obtained outcome, and approval status for all 8 mandatory evaluation test cases defined by the academic assignment.

#### Scenario: Cobertura completa de los 8 casos de prueba manuales
- **WHEN** el docente examina la sección de pruebas en `README.md`
- **THEN** encuentra la matriz formal de los 8 casos de prueba (Carga inicial, Búsqueda insensible/parcial, Búsqueda sin resultados/reseteo, Alta de Libros con validaciones, Alta de Clientes con validaciones, Composición de Ventas y totalizador, Congelamiento de precio histórico en DevTools tras F5, y Persistencia en recarga sin duplicación) con estado Aprobado y evidencia verificable
