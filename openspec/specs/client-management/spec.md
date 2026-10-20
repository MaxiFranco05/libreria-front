# client-management Specification

## Purpose
Permite registrar nuevos clientes mediante un formulario accesible con validaciones estrictas (nombre obligatorio, formato de email y unicidad case-insensitive) e incorporación reactiva a la memoria de la aplicación.

## Requirements

### Requirement: Formulario semántico de clientes y prevención de recarga
La sección de clientes SHALL proveer un formulario semántico accesible (`#form-cliente`) que intercepte el evento `submit` bloqueando la recarga de página mediante `event.preventDefault()`.

#### Scenario: Interceptación exitosa de alta de cliente
- **WHEN** el usuario envía el formulario de clientes
- **THEN** la página no se recarga y la petición se atiende en el cliente de manera interactiva

### Requirement: Nombre completo obligatorio
El sistema SHALL validar que el nombre del cliente no esté vacío ni compuesto exclusivamente por espacios en blanco (`trim`).

#### Scenario: Rechazo de nombre en blanco
- **WHEN** el usuario intenta registrar un cliente con nombre vacío o espacios
- **THEN** el sistema rechaza el envío y presenta un mensaje indicando que el nombre es obligatorio

### Requirement: Validación de formato de correo electrónico
El sistema SHALL validar que el correo electrónico cumpla con una estructura sintáctica estándar válida conteniendo usuario, `@`, dominio y extensión.

#### Scenario: Rechazo de formato de email inválido
- **WHEN** el usuario ingresa "correo_invalido", "@dominio.com" o "cliente@"
- **THEN** el sistema rechaza el registro y solicita un formato de correo electrónico válido

#### Scenario: Rechazo de email vacío o en blanco
- **WHEN** el usuario intenta registrar un cliente sin ingresar un correo electrónico
- **THEN** el sistema rechaza el alta e informa que el correo es obligatorio

### Requirement: Unicidad de correo electrónico insensible a mayúsculas
El sistema SHALL validar que no exista otro cliente registrado con el mismo correo electrónico, comparando tras recortar espacios extremos (`trim`) e ignorando diferencias entre mayúsculas y minúsculas (`toLowerCase`).

#### Scenario: Rechazo de email duplicado con mayúsculas distintas
- **WHEN** se intenta registrar "JUAN.PEREZ@EMAIL.COM" existiendo ya "juan.perez@email.com"
- **THEN** el sistema rechaza el alta e informa que el correo ya se encuentra registrado

### Requirement: Incorporación reactiva de cliente y reseteo
Tras un registro exitoso, el sistema SHALL generar un identificador único para el cliente, agregarlo a la colección en memoria, limpiar los campos del formulario y mostrar un mensaje de confirmación visible y accesible.

#### Scenario: Confirmación de registro exitoso
- **WHEN** se ingresan datos válidos de cliente y se envía el formulario
- **THEN** el cliente queda registrado en memoria, el formulario se resetea y se notifica el éxito de la operación

### Requirement: Nómina y tabla accesible de clientes registrados
La sección de clientes SHALL presentar una tabla semántica accesible dentro de un contenedor responsive con la nómina de clientes registrados (Nombre completo, Correo electrónico e ID), actualizándose de forma reactiva inmediata tras cada alta confirmada.

#### Scenario: Visualización y actualización reactiva de la tabla de clientes
- **WHEN** se confirma el alta de un nuevo cliente válido
- **THEN** la nómina de clientes en pantalla refleja inmediatamente la nueva fila sin recargar la página
