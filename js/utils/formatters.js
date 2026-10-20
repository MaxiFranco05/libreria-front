/**
 * ============================================================================
 * Formatters - Utilidades Puras de Formateo y Resolución Relacional
 * ============================================================================
 */

(function () {
  'use strict';

  const root = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this);
  root.LibreriaApp = root.LibreriaApp || {};

  /**
   * Formatea un importe numérico al estándar de moneda fija con dos decimales ($0.00)
   * @param {number|string} amount - Monto a formatear
   * @returns {string} Cadena formateada ej. "$1500.00"
   */
  function formatCurrency(amount) {
    const num = Number(amount);
    if (isNaN(num) || num === null || num === undefined) {
      return '$0.00';
    }
    return `$${num.toFixed(2)}`;
  }

  /**
   * Resuelve el nombre descriptivo de una editorial a partir de su ID
   * @param {string} editorialId - ID de la editorial
   * @param {Array} editorialesList - Lista de editoriales disponibles
   * @returns {string} Nombre de la editorial
   */
  function getEditorialName(editorialId, editorialesList = []) {
    if (!editorialId || !Array.isArray(editorialesList)) {
      return 'Editorial desconocida';
    }
    const found = editorialesList.find((e) => e && e.id === editorialId);
    return found && found.nombre ? found.nombre : 'Editorial desconocida';
  }

  /**
   * Resuelve el nombre del género o devuelve «Sin clasificar» si es null o no existe (RN-CAT-06)
   * @param {string|null} generoId - ID del género
   * @param {Array} generosList - Lista de géneros disponibles
   * @returns {string} Nombre del género o «Sin clasificar»
   */
  function getGeneroName(generoId, generosList = []) {
    if (!generoId || !Array.isArray(generosList)) {
      return 'Sin clasificar';
    }
    const found = generosList.find((g) => g && g.id === generoId);
    return found && found.nombre ? found.nombre : 'Sin clasificar';
  }

  /**
   * Concatena de forma legible los nombres de los autores correspondientes a los IDs provistos
   * @param {Array<string>} authorIds - Array de IDs de autores
   * @param {Array} authorsList - Lista de autores disponibles
   * @returns {string} Nombres concatenados por coma
   */
  function formatAuthors(authorIds = [], authorsList = []) {
    if (!Array.isArray(authorIds) || authorIds.length === 0 || !Array.isArray(authorsList)) {
      return 'Autor no especificado';
    }
    const names = authorIds
      .map((id) => {
        const found = authorsList.find((a) => a && a.id === id);
        return found && found.nombre ? found.nombre : null;
      })
      .filter(Boolean);

    return names.length > 0 ? names.join(', ') : 'Autor no especificado';
  }

  const formatters = {
    formatCurrency,
    getEditorialName,
    getGeneroName,
    formatAuthors
  };

  root.LibreriaApp.formatters = formatters;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = formatters;
  }
})();
