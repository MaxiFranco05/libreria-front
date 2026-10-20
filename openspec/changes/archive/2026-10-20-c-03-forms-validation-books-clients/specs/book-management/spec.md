# Spec Delta: book-management

## Purpose

Permite gestionar el alta de nuevos libros mediante formularios accesibles con validación estricta en el cliente (unicidad, normalización, precio positivo y relaciones) y actualización reactiva inmediata en la aplicación.

## ADDED Requirements

### Requirement: Formulario semántico y prevención de recarga
La sección de libros SHALL proveer un formulario semántico accesible (`#form-libro`) que intercepte el evento `submit` bloqueando la recarga de la página mediante `event.preventDefault()`.

#### Scenario: Interceptación exitosa sin recarga
- **WHEN** el usuario envía el formulario de libros
- **THEN** la página no se recarga y la ejecución se procesa de forma asíncrona/reactiva en el cliente

### Requirement: Validación de campos obligatorios en libros
El sistema SHALL validar que el título del libro no esté vacío tras eliminar espacios en blanco extremos (`trim`), y que se haya seleccionado una editorial válida y al menos un autor registrado.

#### Scenario: Rechazo de título vacío o con solo espacios
- **WHEN** el usuario intenta registrar un libro sin título o solo con espacios
- **THEN** el sistema rechaza el envío y presenta un mensaje de error accesible indicando que el título es requerido

#### Scenario: Rechazo sin autores seleccionados
- **WHEN** el usuario no selecciona ningún autor para el libro
- **THEN** el sistema rechaza el alta e informa que debe asignarse al menos un autor

#### Scenario: Rechazo sin editorial seleccionada
- **WHEN** el usuario intenta enviar el formulario manteniendo el selector de editorial en blanco o valor por defecto
- **THEN** el sistema rechaza el alta e informa que la editorial es obligatoria

### Requirement: Normalización y unicidad de ISBN
El sistema SHALL normalizar el código ISBN eliminando guiones y espacios en blanco antes de validar y almacenar, rechazando cualquier ISBN que ya exista registrado en el catálogo.

#### Scenario: Normalización de guiones y espacios
- **WHEN** el usuario ingresa un ISBN con formato "978-987-123-4" o "978 987 123 4"
- **THEN** el sistema normaliza el código a "9789871234" antes de verificar unicidad y persistir

#### Scenario: Rechazo de ISBN vacío o en blanco
- **WHEN** el usuario intenta registrar un libro sin código ISBN o con solo espacios
- **THEN** el sistema rechaza el registro y notifica que el ISBN es requerido

#### Scenario: Rechazo de ISBN duplicado
- **WHEN** el usuario intenta dar de alta un libro cuyo ISBN normalizado coincide con uno existente
- **THEN** el sistema rechaza el alta y muestra un mensaje de error específico sobre la duplicidad del ISBN

### Requirement: Validación de precio numérico positivo
El sistema SHALL requerir que el precio del libro sea un valor numérico estrictamente mayor a cero (`precio > 0`), admitiendo hasta dos posiciones decimales.

#### Scenario: Aceptación de precio positivo válido
- **WHEN** el usuario ingresa un precio de `2500` o `2500.50`
- **THEN** el sistema considera válido el importe para el registro

#### Scenario: Rechazo de precio cero o negativo
- **WHEN** el usuario ingresa `0` o `-500` como precio del libro
- **THEN** el sistema rechaza el registro y notifica que el precio debe ser estrictamente mayor a cero

### Requirement: Gestión de género opcional
El sistema SHALL permitir la selección de un género existente o la opción explícita «Sin clasificar», guardando en este último caso un valor `null` o cadena vacía.

#### Scenario: Alta con opción «Sin clasificar»
- **WHEN** el usuario selecciona la opción «Sin clasificar» en el desplegable de género
- **THEN** el libro se registra con `generoId: null` manteniendo la compatibilidad con el catálogo

### Requirement: Incorporación reactiva y reseteo del formulario
Tras un alta válida, el sistema SHALL generar un identificador único para el libro, incorporarlo a la colección en memoria, limpiar todos los campos del formulario, emitir un mensaje de confirmación accesible y refrescar la vista del catálogo.

#### Scenario: Actualización reactiva tras alta exitosa
- **WHEN** se confirma el alta de un libro con datos válidos
- **THEN** el libro aparece inmediatamente en el catálogo sin recargar la página y los campos del formulario quedan limpios
