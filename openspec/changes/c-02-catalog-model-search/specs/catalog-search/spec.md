# Spec Delta

## Purpose

Define el modelado de datos en memoria para el catálogo de la librería, la carga de la semilla inicial obligatoria, las utilidades de formateo y el renderizado interactivo de libros con filtrado por título en tiempo real.

## ADDED Requirements

### Requirement: Almacén de estado en memoria y semilla inicial
El sistema SHALL inicializar un almacén de datos centralizado en memoria conteniendo colecciones relacionales para `libros`, `editoriales`, `generos`, `autores`, `clientes` y `ventas`, poblando como semilla mínima 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes iniciales, incluyendo al menos un libro con `generoId: null`.

#### Scenario: Carga inicial de colecciones semilla
- **WHEN** la aplicación inicializa el estado central
- **THEN** la colección de libros contiene 6 ejemplares, existen 2 editoriales, 2 géneros, 3 autores y 3 clientes registrados en memoria

#### Scenario: Presencia de libro sin género asignado
- **WHEN** se consulta el libro "Las cosas que perdimos en el fuego" en el estado
- **THEN** su campo `generoId` es `null`, representando una obra pendiente de clasificación

### Requirement: Formateo monetario y resolución relacional
El sistema SHALL proveer utilidades puras para formatear cualquier valor monetario numérico como una cadena con prefijo `$` y dos decimales fijos (`$0.00`), resolver el nombre de la editorial a partir de su ID, concatenar legibles los nombres de autores y retornar la leyenda «Sin clasificar» cuando el identificador de género sea nulo o vacío.

#### Scenario: Formateo monetario estándar
- **WHEN** se formatea el precio numérico `1500`
- **THEN** la función devuelve exactamente `$1500.00`

#### Scenario: Resolución de género ausente
- **WHEN** se resuelve el nombre de género para un valor `null` o vacío
- **THEN** la función devuelve exactamente «Sin clasificar»

#### Scenario: Concatenación de autores
- **WHEN** un libro tiene asignado el autor Jorge Luis Borges
- **THEN** la función de autores devuelve "Jorge Luis Borges" sin comas sobrantes

### Requirement: Renderizado semántico de tarjetas de catálogo
La vista `#catalogo` SHALL renderizar cada libro disponible dentro de un elemento semántico de tarjeta exhibiendo: título, código ISBN, editorial resuelta, lista de autores, género asignado (o «Sin clasificar») y precio unitario formateado.

#### Scenario: Renderizado completo de ejemplar
- **WHEN** el catálogo se renderiza con los libros iniciales
- **THEN** cada tarjeta de libro presenta título, ISBN, autores, editorial, badge de género o «Sin clasificar», y el precio formateado con dos decimales

### Requirement: Filtrado interactivo en tiempo real por título
El campo de búsqueda de catálogo SHALL escuchar el evento `input` y filtrar los libros del estado comparando de forma insensible a mayúsculas/minúsculas (`toLowerCase`), permitiendo coincidencias parciales por subcadena en cualquier posición del título y recortando espacios en blanco extremos (`trim`).

#### Scenario: Búsqueda con mayúsculas y minúsculas mixtas
- **WHEN** el usuario ingresa "ficciones" o "FICCIONES" en el buscador
- **THEN** el catálogo muestra únicamente el libro "Ficciones"

#### Scenario: Búsqueda con espacios extremos y coincidencia parcial
- **WHEN** el usuario ingresa "   aleph   " o "cosas" en el buscador
- **THEN** el catálogo filtra con éxito mostrando las obras que contienen dichas palabras en el título

### Requirement: Estados del catálogo ante términos vacíos y sin resultados
El catálogo SHALL exhibir la lista completa de libros cuando el campo de búsqueda se encuentre vacío o contenga únicamente espacios en blanco, y presentar un mensaje informativo claro ("No se encontraron libros que coincidan con la búsqueda") cuando ningún título contenga el texto buscado.

#### Scenario: Restauración total ante búsqueda vacía
- **WHEN** el usuario borra el texto de búsqueda dejando el campo vacío
- **THEN** el catálogo vuelve a mostrar de inmediato los 6 libros disponibles

#### Scenario: Mensaje visible sin resultados
- **WHEN** el usuario busca un término inexistente como "Quijote"
- **THEN** las tarjetas de libros se ocultan y se exhibe en el contenedor el mensaje "No se encontraron libros que coincidan con la búsqueda"
