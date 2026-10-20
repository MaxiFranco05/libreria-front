# Tasks

## 1. Estructuración y Redacción del README.md Institucional

- [x] 1.1 Redactar la portada académica institucional (UTN FRBA, Programación III, datos del equipo), características del stack nativo, y la guía de inicio rápido libre de herramientas de compilación destacando apertura directa mediante doble clic (`file://`) y servidores locales estáticos. Verificar existencia del archivo `README.md` en la raíz.
- [x] 1.2 Elaborar el manual operativo completo de las 5 vistas de la SPA (Catálogo, Libros, Clientes, Ventas e Historial) y el resumen de arquitectura de software (patrón IIFE, State Manager centralizado, adaptador de LocalStorage tolerante a fallos y snapshot inmutable de precios). Verificar exhaustividad de las secciones en `README.md`.

## 2. Registro de la Matriz de Pruebas y Cierre de Roadmap

- [x] 2.1 Formalizar e integrar la tabla de los 8 Casos de Prueba Manuales exigidos por la consigna oficial en `README.md`, documentando para cada caso los pasos reproducibles, el resultado esperado, el resultado obtenido y el estado Aprobado (Casos 1 al 8, incluyendo la prueba de DevTools y recarga F5).
- [x] 2.2 Documentar el procedimiento para ejecutar la suite completa de 116 verificaciones automatizadas nativas (`tests/test-c01.js` a `test-c05.js`) sin dependencias npm, y actualizar el roadmap canónico [`CHANGES.md`](CHANGES.md) marcando la totalidad de los changes (C-01 a C-06) como completados.

## Workflow follow-up

- Ejecutar `/opsx:apply c-06-technical-documentation-test-cases` para aplicar la documentación y matriz de pruebas.
- Finalizada la aplicación, archivar formalmente con `/opsx:archive c-06-technical-documentation-test-cases`.
