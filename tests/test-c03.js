const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Verificación Automatizada C-03 (Validaciones, Altas Reactivas y Formularios) ---');

let passedTests = 0;
let totalTests = 0;

function check(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${name}:`, err.message);
  }
}

// 1. Cargar Módulos
const seedData = require('../js/seed.js');
const state = require('../js/state.js');
const validators = require('../js/utils/validators.js');

// Reset de estado
state.init(seedData);

// -----------------------------------------------------------------------------
// 1. Validadores Puros (js/utils/validators.js)
// -----------------------------------------------------------------------------

check('Validators: validateRequired valida presencia tras trim', () => {
  assert.strictEqual(validators.validateRequired('Rayuela').valid, true);
  assert.strictEqual(validators.validateRequired('  Ficciones  ').valid, true);
  assert.strictEqual(validators.validateRequired('').valid, false);
  assert.strictEqual(validators.validateRequired('   ').valid, false);
  assert.strictEqual(validators.validateRequired(null).valid, false);
  assert.strictEqual(validators.validateRequired(undefined).valid, false);
});

check('Validators: normalizeISBN remueve guiones y espacios', () => {
  assert.strictEqual(validators.normalizeISBN('978-987-123-4'), '9789871234');
  assert.strictEqual(validators.normalizeISBN(' 978 987 123 4 '), '9789871234');
  assert.strictEqual(validators.normalizeISBN('9789871234'), '9789871234');
  assert.strictEqual(validators.normalizeISBN(''), '');
  assert.strictEqual(validators.normalizeISBN(null), '');
});

check('RN-LIB-01 / RN-LIB-02: validateISBN valida obligatoriedad y unicidad normalizada', () => {
  const existingBooks = state.getBooks();

  // Vacío
  const emptyRes = validators.validateISBN('', existingBooks);
  assert.strictEqual(emptyRes.valid, false);
  assert.ok(emptyRes.error.toLowerCase().includes('requerido') || emptyRes.error.toLowerCase().includes('obligatorio'));

  const spacesRes = validators.validateISBN('   ', existingBooks);
  assert.strictEqual(spacesRes.valid, false);

  // Duplicado exacto
  const dupRes = validators.validateISBN('9789500424554', existingBooks);
  assert.strictEqual(dupRes.valid, false);
  assert.ok(dupRes.error.toLowerCase().includes('existe') || dupRes.error.toLowerCase().includes('registrado'));

  // Duplicado con guiones y espacios (RN-LIB-02)
  const dupFormattedRes = validators.validateISBN(' 978-950-042-455-4 ', existingBooks);
  assert.strictEqual(dupFormattedRes.valid, false);

  // Válido y único
  const validRes = validators.validateISBN('978-987-999-9', existingBooks);
  assert.strictEqual(validRes.valid, true);
  assert.strictEqual(validRes.sanitizedValue, '9789879999');
});

check('RN-LIB-03: validatePrice valida número estrictamente mayor a 0', () => {
  // Positivos válidos
  const res1 = validators.validatePrice(1500);
  assert.strictEqual(res1.valid, true);
  assert.strictEqual(res1.sanitizedValue, 1500);

  const res2 = validators.validatePrice('2500.50');
  assert.strictEqual(res2.valid, true);
  assert.strictEqual(res2.sanitizedValue, 2500.5);

  // Inválidos: cero, negativos, NaN
  assert.strictEqual(validators.validatePrice(0).valid, false);
  assert.strictEqual(validators.validatePrice('0').valid, false);
  assert.strictEqual(validators.validatePrice(-100).valid, false);
  assert.strictEqual(validators.validatePrice('-50.25').valid, false);
  assert.strictEqual(validators.validatePrice('abc').valid, false);
  assert.strictEqual(validators.validatePrice(null).valid, false);
  assert.strictEqual(validators.validatePrice('').valid, false);
});

check('RN-LIB-01 / RN-LIB-04: validateEditorial valida obligatoriedad y existencia', () => {
  const availableEditorials = state.getEditorials();
  assert.strictEqual(validators.validateEditorial('', availableEditorials).valid, false);
  assert.strictEqual(validators.validateEditorial(null, availableEditorials).valid, false);
  assert.strictEqual(validators.validateEditorial('ed-inexistente', availableEditorials).valid, false);

  const validEd = validators.validateEditorial('ed-1', availableEditorials);
  assert.strictEqual(validEd.valid, true);
  assert.strictEqual(validEd.sanitizedValue, 'ed-1');
});

check('RN-LIB-04: validateAuthorsSelection valida al menos un autor y existencia', () => {
  const availableAuthors = state.getAuthors();

  // Sin selección
  assert.strictEqual(validators.validateAuthorsSelection([], availableAuthors).valid, false);
  assert.strictEqual(validators.validateAuthorsSelection(null, availableAuthors).valid, false);

  // Selección válida
  const validRes = validators.validateAuthorsSelection(['aut-1'], availableAuthors);
  assert.strictEqual(validRes.valid, true);

  const validMulti = validators.validateAuthorsSelection(['aut-1', 'aut-2'], availableAuthors);
  assert.strictEqual(validMulti.valid, true);

  // Selección con autor inexistente
  const invalidRes = validators.validateAuthorsSelection(['aut-inexistente'], availableAuthors);
  assert.strictEqual(invalidRes.valid, false);
});

check('RN-CLI-01 / RN-CLI-02 / RN-CLI-03: validateEmail valida formato y unicidad case-insensitive', () => {
  const existingClients = state.getClients();

  // Vacío
  const emptyRes = validators.validateEmail('', existingClients);
  assert.strictEqual(emptyRes.valid, false);

  const spaceRes = validators.validateEmail('   ', existingClients);
  assert.strictEqual(spaceRes.valid, false);

  // Formato inválido
  assert.strictEqual(validators.validateEmail('invalido', existingClients).valid, false);
  assert.strictEqual(validators.validateEmail('invalido@', existingClients).valid, false);
  assert.strictEqual(validators.validateEmail('@dominio.com', existingClients).valid, false);
  assert.strictEqual(validators.validateEmail('usuario@dominio', existingClients).valid, false);

  // Duplicado exacto
  const dupRes = validators.validateEmail('juan.perez@example.com', existingClients);
  assert.strictEqual(dupRes.valid, false);

  // Duplicado con mayúsculas y espacios (RN-CLI-03)
  const dupCaseRes = validators.validateEmail('  JUAN.PEREZ@EXAMPLE.COM  ', existingClients);
  assert.strictEqual(dupCaseRes.valid, false);

  // Válido y nuevo
  const validRes = validators.validateEmail('nuevo.cliente@libreria.com', existingClients);
  assert.strictEqual(validRes.valid, true);
  assert.strictEqual(validRes.sanitizedValue, 'nuevo.cliente@libreria.com');
});

// -----------------------------------------------------------------------------
// 2. Almacén de Estado y Reactividad (js/state.js)
// -----------------------------------------------------------------------------

check('State: addLibro agrega libro, genera copia inmutable y emite eventos', () => {
  let eventFired = false;
  let receivedData = null;

  const unsubscribe = state.on('libros:updated', (data) => {
    eventFired = true;
    receivedData = data;
  });

  const nuevoLibro = {
    id: 'lib-test-1',
    titulo: 'Libro de Prueba TDD',
    isbn: '9789879998881',
    precio: 3500,
    editorialId: 'ed-1',
    generoId: 'gen-1',
    autorIds: ['aut-1']
  };

  const initialCount = state.getBooks().length;
  const result = state.addLibro(nuevoLibro);

  assert.strictEqual(result, true);
  assert.strictEqual(state.getBooks().length, initialCount + 1);
  assert.strictEqual(state.getBookById('lib-test-1').titulo, 'Libro de Prueba TDD');
  assert.strictEqual(eventFired, true, 'Debe emitir el evento libros:updated');
  assert.ok(receivedData && receivedData.libro, 'El evento debe contener los datos del libro agregado');

  unsubscribe();
});

check('State: addCliente agrega cliente, genera copia inmutable y emite eventos', () => {
  let eventFired = false;
  let receivedData = null;

  const unsubscribe = state.on('clientes:updated', (data) => {
    eventFired = true;
    receivedData = data;
  });

  const nuevoCliente = {
    id: 'cli-test-1',
    nombreCompleto: 'Cliente de Prueba TDD',
    email: 'test.tdd@example.com'
  };

  const initialCount = state.getClients().length;
  const result = state.addCliente(nuevoCliente);

  assert.strictEqual(result, true);
  assert.strictEqual(state.getClients().length, initialCount + 1);
  assert.strictEqual(state.getClientById('cli-test-1').nombreCompleto, 'Cliente de Prueba TDD');
  assert.strictEqual(eventFired, true, 'Debe emitir el evento clientes:updated');
  assert.ok(receivedData && receivedData.cliente, 'El evento debe contener los datos del cliente agregado');

  unsubscribe();
});

check('State: alias en español getLibros, getClientes, getEditoriales, getGeneros, getAutores', () => {
  assert.strictEqual(typeof state.getLibros, 'function');
  assert.strictEqual(typeof state.getClientes, 'function');
  assert.strictEqual(typeof state.getEditoriales, 'function');
  assert.strictEqual(typeof state.getGeneros, 'function');
  assert.strictEqual(typeof state.getAutores, 'function');
  assert.strictEqual(state.getLibros().length, state.getBooks().length);
});

check('CatalogoView: suscrito al evento libros:updated para refresco reactivo', () => {
  const catalogoViewContent = fs.readFileSync(path.join(__dirname, '../js/views/catalogo.view.js'), 'utf-8');
  assert.ok(
    catalogoViewContent.includes('libros:updated'),
    'catalogo.view.js debe estar suscrito a libros:updated'
  );
});

// -----------------------------------------------------------------------------
// 3. Vistas de Libros y Clientes (js/views/libros.view.js y clientes.view.js)
// -----------------------------------------------------------------------------

check('LibrosView: exportación e interfaz pública del controlador', () => {
  const librosView = require('../js/views/libros.view.js');
  assert.strictEqual(typeof librosView.init, 'function');
  assert.strictEqual(typeof librosView.populateSelects, 'function');
  assert.strictEqual(typeof librosView.handleFormSubmit, 'function');
});

check('ClientesView: exportación e interfaz pública del controlador', () => {
  const clientesView = require('../js/views/clientes.view.js');
  assert.strictEqual(typeof clientesView.init, 'function');
  assert.strictEqual(typeof clientesView.renderTable, 'function');
  assert.strictEqual(typeof clientesView.handleFormSubmit, 'function');
});

check('Regla Dura #5 (Seguridad DOM): Vistas no usan .innerHTML con datos de entrada', () => {
  const librosViewCode = fs.readFileSync(path.join(__dirname, '../js/views/libros.view.js'), 'utf-8');
  const clientesViewCode = fs.readFileSync(path.join(__dirname, '../js/views/clientes.view.js'), 'utf-8');
  
  assert.ok(!librosViewCode.includes('.innerHTML ='), 'libros.view.js no debe asignar .innerHTML');
  assert.ok(!clientesViewCode.includes('.innerHTML ='), 'clientes.view.js no debe asignar .innerHTML');
});

// -----------------------------------------------------------------------------
// 4. Integración y Marcado HTML (Task 4.1 y 4.2)
// -----------------------------------------------------------------------------

check('HTML: Formularios semánticos presentes en index.html', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');
  assert.ok(html.includes('id="form-libro"'), 'Debe existir form-libro');
  assert.ok(html.includes('id="form-cliente"'), 'Debe existir form-cliente');
  assert.ok(html.includes('id="tabla-clientes"'), 'Debe existir tabla-clientes');
  assert.ok(html.includes('id="clientes-table-body"'), 'Debe existir clientes-table-body');
  assert.ok(html.includes('id="libro-autores-group"'), 'Debe existir libro-autores-group');
  assert.ok(html.includes('id="libro-feedback"'), 'Debe existir libro-feedback');
  assert.ok(html.includes('id="cliente-feedback"'), 'Debe existir cliente-feedback');
});

check('HTML: Scripts de C-03 enlazados con defer y sin type="module"', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');
  assert.ok(html.includes('src="js/utils/validators.js"'), 'Debe enlazar validators.js');
  assert.ok(html.includes('src="js/views/libros.view.js"'), 'Debe enlazar libros.view.js');
  assert.ok(html.includes('src="js/views/clientes.view.js"'), 'Debe enlazar clientes.view.js');
  assert.ok(!html.includes('type="module"'), 'Garantía file://: No debe contener type="module"');
});

check('App: Inicialización orquestada de libros y clientes en js/app.js', () => {
  const appCode = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf-8');
  assert.ok(appCode.includes('app.views.libros.init()'), 'Debe inicializar libros view');
  assert.ok(appCode.includes('app.views.clientes.init()'), 'Debe inicializar clientes view');
});

// -----------------------------------------------------------------------------
// Resumen
// -----------------------------------------------------------------------------
console.log('----------------------------------------------------------------------');
console.log(`Resultado: ${passedTests}/${totalTests} pruebas superadas.`);

if (passedTests === totalTests) {
  console.log('TODAS LAS PRUEBAS DE C-03 PASARON CON ÉXITO (PASS).');
} else {
  console.error('EXISTEN FALLOS EN LAS PRUEBAS DE C-03 (FAIL).');
  process.exitCode = 1;
}
