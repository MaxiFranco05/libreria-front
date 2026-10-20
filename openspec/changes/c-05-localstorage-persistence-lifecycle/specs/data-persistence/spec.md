# Spec Delta

## Purpose

Provee persistencia en almacenamiento local del navegador (`localStorage`) para libros, clientes, ventas y entidades de referencia, gobernando el ciclo de vida de inicialización para evitar la duplicación de datos semilla en recargas y asegurando la inmutabilidad de los precios históricos de ventas frente a mutaciones externas del catálogo.

## ADDED Requirements

### Requirement: Storage Initialization Lifecycle
The system SHALL verify the existence of the `libreria_inicializada` key in `localStorage` during application startup. If absent or false, it MUST persist the complete initial seed data (books, editorials, genres, authors, clients, empty sales) and mark `libreria_inicializada` as `"true"`. If the key is already `"true"`, it MUST restore entities directly from local storage without reinserting or duplicating seed items.

#### Scenario: Primer inicio de la aplicación
- **WHEN** la aplicación carga por primera vez en el navegador y `localStorage.getItem("libreria_inicializada")` es nulo o falso
- **THEN** se serializan y guardan todas las colecciones de la semilla en sus respectivas claves de `localStorage` y se fija `libreria_inicializada` en `"true"`

#### Scenario: Recargas posteriores de la página (F5)
- **WHEN** se recarga la página (`F5`) y `localStorage.getItem("libreria_inicializada")` es igual a `"true"`
- **THEN** el estado de la aplicación se restaura a partir de los datos almacenados en `localStorage` sin volver a inyectar ni duplicar los libros, clientes o colecciones iniciales

### Requirement: Canonical Key Structure and Safe Serialization
The system SHALL use standardized canonical keys (`libreria_inicializada`, `libreria_libros`, `libreria_clientes`, `libreria_editoriales`, `libreria_generos`, `libreria_autores`, `libreria_ventas`) and MUST wrap all reads and writes in `try/catch` error-handling blocks to safely tolerate exceeded storage quotas, private browsing restrictions, or corrupted JSON without interrupting application execution.

#### Scenario: Serialización y guardado seguro de colecciones
- **WHEN** el adaptador de persistencia guarda una colección en `localStorage`
- **THEN** la colección se serializa a JSON válido y se almacena bajo su clave canónica correspondiente de manera segura

#### Scenario: Tolerancia a fallos de almacenamiento o datos corruptos
- **WHEN** se intenta acceder a `localStorage` en un entorno restringido o se detecta un payload JSON malformado
- **THEN** el sistema captura el error mediante `try/catch`, emite una advertencia controlada en consola y retorna una estructura de datos segura sin lanzar excepciones no controladas

### Requirement: Reactive Entity Synchronization
The system SHALL immediately and reactively synchronize collections in `localStorage` upon state modification events, and MUST update storage whenever a new book is created, a new client is added, or a sale transaction is confirmed.

#### Scenario: Sincronización automática de nuevo libro
- **WHEN** se confirma exitosamente el alta de un nuevo libro
- **THEN** la clave `libreria_libros` en `localStorage` se actualiza inmediatamente incorporando el nuevo libro registrado

#### Scenario: Sincronización automática de nuevo cliente
- **WHEN** se confirma exitosamente el alta de un nuevo cliente
- **THEN** la clave `libreria_clientes` en `localStorage` se actualiza inmediatamente incorporando el nuevo cliente registrado

#### Scenario: Sincronización automática de nueva venta confirmada
- **WHEN** se confirma exitosamente una nueva orden de venta
- **THEN** la clave `libreria_ventas` en `localStorage` se actualiza inmediatamente guardando la nueva transacción con sus renglones y snapshots históricos

### Requirement: Historical Price Invariance on External Catalog Mutation
The system SHALL preserve historical sales records and their frozen unit price snapshots in `libreria_ventas` as immutable entities, and MUST NOT modify historical sales even if catalog items in `libreria_libros` are mutated externally in `localStorage`.

#### Scenario: Mutación de precio en catálogo desde DevTools y recarga
- **WHEN** un evaluador edita manualmente el precio de un libro en `libreria_libros` desde las herramientas de desarrollo del navegador (DevTools) y presiona `F5`
- **THEN** el catálogo muestra el nuevo precio modificado tras la recarga, pero las ventas previas en `libreria_ventas` y en la vista de historial conservan intactos sus precios unitarios históricos originales y sus subtotales
