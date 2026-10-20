# Modelo de Datos

## Dominios
- **Catálogo & Publicaciones**: Gestión de libros, editoriales asociadas, géneros literarios y autores.
- **Relaciones con Clientes**: Registro y padrón de clientes compradores.
- **Ventas & Facturación Simulada**: Registro de operaciones comerciales con renglones de venta, importes calculados y preservación inmutable del precio histórico.

## ERD (Entity Relationship Diagram)

```
+--------------------+           +--------------------+
|     Editorial      |           |       Genero       |
+--------------------+           +--------------------+
| id: string         |           | id: string         |
| nombre: string     |           | nombre: string     |
+---------+----------+           +---------+----------+
          | 1                               | 0..1
          |                                 |
          | N                               | N
+---------v----------+           +----------v---------+
|       Libro        |           |       Autor        |
+--------------------+           +--------------------+
| id: string         |           | id: string         |
| titulo: string     |           | nombre: string     |
| isbn: string (PK)  |           +---------+----------+
| precio: number     |                     | 1..N
| editorialId: string|                     |
| generoId: string?  |<--------------------+ (M:N Libro-Autor)
+---------+----------+
          | 1
          |
          | N
+---------v----------+           +--------------------+
|    RenglonVenta    |           |      Cliente       |
+--------------------+           +--------------------+
| libroId: string    |           | id: string         |
| titulo: string     |           | nombreCompleto: str|
| cantidad: number   |           | email: string (UQ) |
| precioUnitario: num|           +---------+----------+
| subtotal: number   |                     | 1
+---------+----------+                     |
          | N                               |
          | 1                               | N
+---------v---------------------------------v---------+
|                       Venta                         |
+-----------------------------------------------------+
| id: string                                          |
| fecha: string (ISO 8601 o formato local YYYY-MM-DD) |
| clienteId: string                                   |
| renglones: RenglonVenta[]                           |
| total: number                                       |
+-----------------------------------------------------+
```

## Entidades

### Libro
- **id**: `string` (identificador único).
- **titulo**: `string` (requerido, no vacío).
- **isbn**: `string` (requerido, único, comparado sin espacios ni guiones).
- **precio**: `number` (numérico, estrictamente mayor a 0).
- **editorialId**: `string` (requerido, debe existir en lista de editoriales).
- **generoId**: `string | null` (opcional; si se asigna debe existir en géneros; si es `null` se interpreta como «Sin clasificar»).
- **autorIds**: `string[]` (requerido, array de al menos un autor existente).

### Editorial
- **id**: `string` (identificador único estable).
- **nombre**: `string` (nombre de la editorial, ej. "Editorial Sudamericana", "Planeta").

### Genero
- **id**: `string` (identificador único estable).
- **nombre**: `string` (ej. "Novela", "Ciencia Ficción").

### Autor
- **id**: `string` (identificador único estable).
- **nombre**: `string` (ej. "Jorge Luis Borges", "Julio Cortázar", "Gabriel García Márquez").

### Cliente
- **id**: `string` (identificador único estable).
- **nombreCompleto**: `string` (requerido, no vacío).
- **email**: `string` (requerido, formato email válido, único comparado en minúsculas y sin espacios externos).

### Venta
- **id**: `string` (identificador único, ej. `VNT-1001`).
- **fecha**: `string` (fecha y hora del momento de la confirmación).
- **clienteId**: `string` (referencia al cliente; requerido).
- **renglones**: `RenglonVenta[]` (mínimo 1 renglón).
- **total**: `number` (suma acumulada de subtotales con 2 decimales).

### RenglonVenta
- **libroId**: `string` (ID del libro vendido).
- **titulo**: `string` (copia descriptiva del libro al momento de la venta).
- **cantidad**: `number` (entero mayor a cero).
- **precioUnitario**: `number` (**snapshot histórico**: precio congelado al confirmar la venta).
- **subtotal**: `number` (resultado de `cantidad * precioUnitario`).

## Seed data inicial (Mínimos exigidos por consigna)
Al iniciar la aplicación por primera vez en un navegador vacío:
- **Editoriales (mínimo 2)**: 
  - `ed-1`: Editorial Siglo XXI
  - `ed-2`: Penguin Random House
- **Géneros (mínimo 2)**: 
  - `gen-1`: Ficción
  - `gen-2`: Ensayo
- **Autores (mínimo 3)**:
  - `aut-1`: Jorge Luis Borges
  - `aut-2`: Julio Cortázar
  - `aut-3`: Mariana Enríquez
- **Libros (mínimo 6)**:
  1. *Ficciones* (ISBN: 9789500424554, $1500, Editorial Siglo XXI, Ficción, Borges)
  2. *El Aleph* (ISBN: 9789500424561, $2000, Editorial Siglo XXI, Ficción, Borges)
  3. *Rayuela* (ISBN: 9789870407133, $2500, Penguin Random House, Ficción, Cortázar)
  4. *Bestiario* (ISBN: 9789870407140, $1800, Penguin Random House, Ficción, Cortázar)
  5. *Nuestra parte de noche* (ISBN: 9788433998859, $3200, Penguin Random House, Ficción, Enríquez)
  6. *Las cosas que perdimos en el fuego* (ISBN: 9788433998064, $1900, Editorial Siglo XXI, Sin clasificar, Enríquez)
- **Clientes (mínimo 3)**:
  1. Juan Pérez (`juan.perez@example.com`)
  2. María Gómez (`maria.gomez@example.com`)
  3. Carlos Rodríguez (`carlos.rodriguez@example.com`)
