/**
 * ============================================================================
 * State Manager - Almacén Centralizado de Estado en Memoria
 * Fuente única de verdad para libros, editoriales, géneros, autores, clientes y ventas
 * ============================================================================
 */

(function () {
  'use strict';

  // Soporte universal para ejecución en navegador (window) y entorno de testing (globalThis / Node)
  const root = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this);
  root.LibreriaApp = root.LibreriaApp || {};

  // Estado privado en memoria
  const _state = {
    libros: [],
    editoriales: [],
    generos: [],
    autores: [],
    clientes: [],
    ventas: []
  };

  // Suscriptores para reactividad entre módulos
  const _listeners = [];

  function notify(event, data) {
    _listeners.forEach((listener) => {
      try {
        listener(event, data);
      } catch (err) {
        console.error('[LibreriaApp.state] Error en listener:', err);
      }
    });
  }

  const state = {
    /**
     * Inicializa el estado con colecciones base
     * @param {Object} seedData - Conjunto de datos iniciales
     */
    init(seedData = {}) {
      _state.libros = Array.isArray(seedData.libros) ? [...seedData.libros] : [];
      _state.editoriales = Array.isArray(seedData.editoriales) ? [...seedData.editoriales] : [];
      _state.generos = Array.isArray(seedData.generos) ? [...seedData.generos] : [];
      _state.autores = Array.isArray(seedData.autores) ? [...seedData.autores] : [];
      _state.clientes = Array.isArray(seedData.clientes) ? [...seedData.clientes] : [];
      _state.ventas = Array.isArray(seedData.ventas) ? [...seedData.ventas] : [];
      notify('init', { ..._state });
    },

    // ------------------------------------------------------------------------
    // Libros
    // ------------------------------------------------------------------------
    getBooks() {
      return [..._state.libros];
    },
    getLibros() {
      return this.getBooks();
    },
    getBookById(id) {
      return _state.libros.find((b) => b.id === id) || null;
    },
    getBookByISBN(isbn) {
      if (!isbn) return null;
      const cleanISBN = String(isbn).replace(/[\s-]/g, '').toLowerCase();
      return _state.libros.find((b) => String(b.isbn).replace(/[\s-]/g, '').toLowerCase() === cleanISBN) || null;
    },
    addBook(book) {
      if (!book || typeof book !== 'object') return false;
      _state.libros.push({ ...book });
      notify('book:added', { book });
      notify('libros:updated', { libro: book, libros: [..._state.libros] });
      return true;
    },
    addLibro(libro) {
      return this.addBook(libro);
    },

    // ------------------------------------------------------------------------
    // Editoriales (Entidad de referencia fija)
    // ------------------------------------------------------------------------
    getEditorials() {
      return [..._state.editoriales];
    },
    getEditoriales() {
      return this.getEditorials();
    },
    getEditorialById(id) {
      return _state.editoriales.find((e) => e.id === id) || null;
    },

    // ------------------------------------------------------------------------
    // Géneros (Entidad de referencia fija)
    // ------------------------------------------------------------------------
    getGenres() {
      return [..._state.generos];
    },
    getGeneros() {
      return this.getGenres();
    },
    getGenreById(id) {
      return _state.generos.find((g) => g.id === id) || null;
    },

    // ------------------------------------------------------------------------
    // Autores (Entidad de referencia fija)
    // ------------------------------------------------------------------------
    getAuthors() {
      return [..._state.autores];
    },
    getAutores() {
      return this.getAuthors();
    },
    getAuthorById(id) {
      return _state.autores.find((a) => a.id === id) || null;
    },

    // ------------------------------------------------------------------------
    // Clientes
    // ------------------------------------------------------------------------
    getClients() {
      return [..._state.clientes];
    },
    getClientes() {
      return this.getClients();
    },
    getClientById(id) {
      return _state.clientes.find((c) => c.id === id) || null;
    },
    getClientByEmail(email) {
      if (!email) return null;
      const cleanEmail = String(email).trim().toLowerCase();
      return _state.clientes.find((c) => String(c.email).trim().toLowerCase() === cleanEmail) || null;
    },
    addClient(client) {
      if (!client || typeof client !== 'object') return false;
      _state.clientes.push({ ...client });
      notify('client:added', { client });
      notify('clientes:updated', { cliente: client, clientes: [..._state.clientes] });
      return true;
    },
    addCliente(cliente) {
      return this.addClient(cliente);
    },

    // ------------------------------------------------------------------------
    // Ventas
    // ------------------------------------------------------------------------
    getSales() {
      return [..._state.ventas];
    },
    getVentas() {
      return this.getSales();
    },
    addSale(sale) {
      if (!sale || typeof sale !== 'object') return false;
      _state.ventas.push({ ...sale });
      notify('sale:added', { sale });
      notify('ventas:updated', { sale, ventas: [..._state.ventas] });
      return true;
    },

    // ------------------------------------------------------------------------
    // Sistema de Suscripción Pub/Sub
    // ------------------------------------------------------------------------
    subscribe(listener) {
      if (typeof listener === 'function') {
        _listeners.push(listener);
        return () => {
          const index = _listeners.indexOf(listener);
          if (index !== -1) _listeners.splice(index, 1);
        };
      }
      return () => {};
    },

    /**
     * Suscripción semántica a un evento específico
     * @param {string} eventName - Nombre del evento (ej. 'libros:updated', 'clientes:updated')
     * @param {Function} handler - Callback que recibe data
     * @returns {Function} Función para desuscribir
     */
    on(eventName, handler) {
      if (typeof handler !== 'function') return () => {};
      return this.subscribe((event, data) => {
        if (event === eventName) {
          handler(data);
        }
      });
    }
  };

  root.LibreriaApp.state = state;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = state;
  }
})();
