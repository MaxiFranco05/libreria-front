/**
 * ============================================================================
 * App - Inicializador Central de la SPA Librería Central
 * Orquestación de módulos y ciclo de vida de la aplicación
 * ============================================================================
 */

(function () {
  'use strict';

  // Espacio de nombres global
  const root = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this);
  window.LibreriaApp = window.LibreriaApp || {};
  root.LibreriaApp = window.LibreriaApp;

  /**
   * Inicializa los subsistemas de la SPA cuando el DOM está completamente cargado
   */
  function initApp() {
    const app = root.LibreriaApp;

    // 1. Inicializar el almacén central de estado con datos semilla
    if (app.state && app.seedData) {
      app.state.init(app.seedData);
      console.info(`[LibreriaApp] Estado inicializado: ${app.state.getBooks().length} libros, ${app.state.getClients().length} clientes.`);
    } else {
      console.warn('[LibreriaApp] Advertencia: state o seedData no se encuentran disponibles.');
    }

    // 2. Inicializar las vistas disponibles
    if (app.views) {
      if (app.views.catalogo && typeof app.views.catalogo.init === 'function') {
        app.views.catalogo.init();
      }
      if (app.views.libros && typeof app.views.libros.init === 'function') {
        app.views.libros.init();
      }
      if (app.views.clientes && typeof app.views.clientes.init === 'function') {
        app.views.clientes.init();
      }
      if (app.views.ventas && typeof app.views.ventas.init === 'function') {
        app.views.ventas.init();
      }
      if (app.views.historial && typeof app.views.historial.init === 'function') {
        app.views.historial.init();
      }
    }

    // 3. Inicializar el enrutador por hash
    if (app.router && typeof app.router.init === 'function') {
      app.router.init();
    } else {
      console.error('[LibreriaApp] Error crítico: el módulo router no se encuentra disponible.');
      return;
    }

    console.info('[LibreriaApp] SPA Shell, Catálogo, Libros, Clientes, Ventas e Historial inicializados correctamente (v1.3.0).');
  }

  // Esperar a que el DOM esté disponible para iniciar
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initApp);
    } else {
      // Si el DOM ya cargó previamente (ej. script diferido ejecutado tras parseo)
      initApp();
    }
  }

  // Exposición de la función de arranque
  root.LibreriaApp.init = initApp;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initApp };
  }
})();
