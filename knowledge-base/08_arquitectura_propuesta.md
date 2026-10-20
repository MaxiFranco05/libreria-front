# Arquitectura Propuesta

## Patrones aplicados

| Patrón | Dónde se usa | Por qué |
|---|---|---|
| **SPA por secciones con Hash Routing** | Enrutamiento en `index.html` y listener `hashchange` | Permite navegación limpia y fluida sin recargas de página y sin dependencias de enrutadores externos. |
| **Store centralizado / State Manager** | Módulo de estado en memoria (`app.state`) | Unifica la verdad de los datos (libros, clientes, ventas) y simplifica la sincronización con `localStorage`. |
| **Repository / Storage Adapter** | Módulo `storage.js` | Aísla todas las llamadas a `window.localStorage` en un solo punto, facilitando el manejo de errores y serialización segura. |
| **Inmutabilidad / Snapshot en ventas** | Generación de `RenglonVenta` | Congela los valores de catálogo al momento de la venta para cumplir la estricta regla de precio histórico inmutable. |
| **Separación de responsabilidades (SoC)** | Estructura modular de carpetas (`css/`, `js/`) | Mantiene el código ordenado y legible conforme a los criterios de evaluación de la cátedra. |

## Estructura de directorios

```
libreria-front/
├── index.html                  # Punto de entrada único de la aplicación SPA
├── README.md                   # Documentación, guía de uso sin npm y casos de prueba
├── css/
│   ├── base.css                # Reset, variables (colores, fuentes), tipografía base
│   ├── layout.css              # Contenedores, grid/flexbox, nav, footer, responsive
│   ├── components.css          # Tarjetas, botones, inputs, tablas y badges
│   └── views.css               # Estilos específicos de cada vista (catálogo, ventas, etc.)
├── js/
│   ├── app.js                  # Inicialización de la aplicación y ciclo de vida
│   ├── router.js               # Control de navegación SPA (mostrar/ocultar secciones)
│   ├── state.js                # Estado en memoria (libros, clientes, ventas, etc.)
│   ├── storage.js              # Adaptador para localStorage y carga de semilla
│   ├── seed.js                 # Datos semilla iniciales (mínimos exigidos por consigna)
│   ├── views/
│   │   ├── catalogo.view.js    # Lógica de renderizado y filtrado de catálogo
│   │   ├── libros.view.js      # Lógica de formulario y listado de libros
│   │   ├── clientes.view.js    # Lógica de formulario y listado de clientes
│   │   ├── ventas.view.js      # Lógica de composición de venta y cálculo dinámico
│   │   └── historial.view.js   # Lógica de visualización y detalle de ventas
│   └── utils/
│       ├── formatters.js       # Formateo de precios ($XX.XX), fechas y textos
│       └── validators.js       # Funciones puras de validación (email, ISBN, precio)
└── assets/
    └── icons/                  # Recursos gráficos o SVG locales (si aplica)
```

## Seguridad y Validación
- **Prevención de XSS**: Toda inserción de datos ingresados por el usuario o leídos de `localStorage` en el DOM se realiza mediante `.textContent` o creación segura de nodos DOM (`document.createElement`), evitando `.innerHTML` con cadenas concatenadas no sanitizadas.
- **Validación robusta en cliente**: Control de tipos, números positivos, emails válidos y unicidad antes de persistir o confirmar.
- **Tolerancia a fallos en LocalStorage**: Bloques `try/catch` envolviendo `JSON.parse` y `setItem` para prevenir excepciones si el almacenamiento está deshabilitado o lleno.

## Variables de entorno
No aplica. La aplicación no interactúa con servidores, API keys ni entornos remotos. Toda configuración se maneja mediante constantes internas en JavaScript.
