/**
 * ============================================================================
 * Validators - Utilidades Puras de Validación y Sanitización
 * ============================================================================
 * Provee funciones de validación desacopladas y puras para entidades de la
 * librería (Libros y Clientes) de acuerdo a las reglas de negocio RN-LIB y RN-CLI.
 */

(function () {
  'use strict';

  const root = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this);
  root.LibreriaApp = root.LibreriaApp || {};

  /**
   * Valida que un valor no sea nulo, indefinido ni esté compuesto solo por espacios
   * @param {*} value - Valor a evaluar
   * @param {string} [fieldName='Este campo'] - Nombre del campo para el mensaje de error
   * @returns {{ valid: boolean, error?: string, sanitizedValue?: string }}
   */
  function validateRequired(value, fieldName = 'Este campo') {
    if (value === null || value === undefined) {
      return { valid: false, error: `${fieldName} es obligatorio.` };
    }
    const str = String(value).trim();
    if (str.length === 0) {
      return { valid: false, error: `${fieldName} es obligatorio.` };
    }
    return { valid: true, sanitizedValue: str };
  }

  /**
   * Normaliza un código ISBN eliminando guiones y espacios en blanco
   * @param {string} isbn - Código ISBN a normalizar
   * @returns {string} Código normalizado sin guiones ni espacios
   */
  function normalizeISBN(isbn) {
    if (isbn === null || isbn === undefined) {
      return '';
    }
    return String(isbn).replace(/[\s-]/g, '').trim();
  }

  /**
   * Valida obligatoriedad, formato y unicidad de un código ISBN frente a libros existentes (RN-LIB-01 y RN-LIB-02)
   * @param {string} isbn - Código ISBN ingresado
   * @param {Array} [existingBooks=[]] - Lista actual de libros registrados
   * @returns {{ valid: boolean, error?: string, sanitizedValue?: string }}
   */
  function validateISBN(isbn, existingBooks = []) {
    const requiredCheck = validateRequired(isbn, 'El código ISBN');
    if (!requiredCheck.valid) {
      return requiredCheck;
    }

    const normalized = normalizeISBN(isbn);
    if (normalized.length === 0) {
      return { valid: false, error: 'El código ISBN es obligatorio.' };
    }

    const isDuplicate = Array.isArray(existingBooks) && existingBooks.some((book) => {
      if (!book || !book.isbn) return false;
      return normalizeISBN(book.isbn) === normalized;
    });

    if (isDuplicate) {
      return { valid: false, error: 'El código ISBN ya se encuentra registrado en el catálogo.' };
    }

    return { valid: true, sanitizedValue: normalized };
  }

  /**
   * Valida que el precio sea numérico y estrictamente mayor que cero (RN-LIB-03)
   * @param {number|string} price - Precio a evaluar
   * @returns {{ valid: boolean, error?: string, sanitizedValue?: number }}
   */
  function validatePrice(price) {
    if (price === null || price === undefined || String(price).trim() === '') {
      return { valid: false, error: 'El precio es obligatorio.' };
    }

    const num = Number(price);
    if (isNaN(num)) {
      return { valid: false, error: 'El precio debe ser un número válido.' };
    }

    if (num <= 0) {
      return { valid: false, error: 'El precio debe ser estrictamente mayor a cero.' };
    }

    return { valid: true, sanitizedValue: Math.round(num * 100) / 100 };
  }

  /**
   * Valida selección de editorial requerida y existente (RN-LIB-01 y RN-LIB-04)
   * @param {string} editorialId - ID de editorial
   * @param {Array} [availableEditorials=[]] - Lista de editoriales válidas
   * @returns {{ valid: boolean, error?: string, sanitizedValue?: string }}
   */
  function validateEditorial(editorialId, availableEditorials = []) {
    const req = validateRequired(editorialId, 'La editorial');
    if (!req.valid) {
      return { valid: false, error: 'Debe seleccionar una editorial.' };
    }

    const exists = Array.isArray(availableEditorials) && availableEditorials.some((e) => e && e.id === editorialId);
    if (!exists) {
      return { valid: false, error: 'La editorial seleccionada no existe en el sistema.' };
    }

    return { valid: true, sanitizedValue: editorialId };
  }

  /**
   * Valida selección de al menos un autor y existencia en la nómina (RN-LIB-01 y RN-LIB-04)
   * @param {Array<string>} authorIds - IDs de autores seleccionados
   * @param {Array} [availableAuthors=[]] - Lista de autores válidos
   * @returns {{ valid: boolean, error?: string, sanitizedValue?: Array<string> }}
   */
  function validateAuthorsSelection(authorIds, availableAuthors = []) {
    if (!Array.isArray(authorIds) || authorIds.length === 0) {
      return { valid: false, error: 'Debe seleccionar al menos un autor.' };
    }

    const allExist = authorIds.every((id) => {
      return Array.isArray(availableAuthors) && availableAuthors.some((a) => a && a.id === id);
    });

    if (!allExist) {
      return { valid: false, error: 'Uno o más autores seleccionados no existen en el sistema.' };
    }

    return { valid: true, sanitizedValue: [...authorIds] };
  }

  /**
   * Valida obligatoriedad, formato estándar y unicidad de correo electrónico (RN-CLI-01, RN-CLI-02 y RN-CLI-03)
   * @param {string} email - Correo a validar
   * @param {Array} [existingClients=[]] - Lista de clientes registrados
   * @returns {{ valid: boolean, error?: string, sanitizedValue?: string }}
   */
  function validateEmail(email, existingClients = []) {
    const requiredCheck = validateRequired(email, 'El correo electrónico');
    if (!requiredCheck.valid) {
      return requiredCheck;
    }

    const trimmed = String(email).trim();
    // Expresión regular estándar para formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return { valid: false, error: 'El formato del correo electrónico no es válido.' };
    }

    const normalized = trimmed.toLowerCase();
    const isDuplicate = Array.isArray(existingClients) && existingClients.some((client) => {
      if (!client || !client.email) return false;
      return String(client.email).trim().toLowerCase() === normalized;
    });

    if (isDuplicate) {
      return { valid: false, error: 'El correo electrónico ya se encuentra registrado.' };
    }

    return { valid: true, sanitizedValue: normalized };
  }

  const validators = {
    validateRequired,
    normalizeISBN,
    validateISBN,
    validatePrice,
    validateEditorial,
    validateAuthorsSelection,
    validateEmail
  };

  root.LibreriaApp.validators = validators;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = validators;
  }
})();
