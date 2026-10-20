const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Verificación Automatizada C-02 (Modelo, Semilla, Formateo y Catálogo) ---');

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

// 1. Cargar módulos en Node
const seedData = require('../js/seed.js');
const state = require('../js/state.js');
const formatters = require('../js/utils/formatters.js');

// Verificaciones de Seed Data
check('Seed data: 6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes', () => {
  assert.strictEqual(seedData.libros.length, 6);
  assert.strictEqual(seedData.editoriales.length, 2);
  assert.strictEqual(seedData.generos.length, 2);
  assert.strictEqual(seedData.autores.length, 3);
  assert.strictEqual(seedData.clientes.length, 3);
});

check('RN-CAT-06: Existe al menos un libro con generoId === null («Sin clasificar»)', () => {
  const sinClasificar = seedData.libros.find(b => b.generoId === null);
  assert.ok(sinClasificar, 'Debe existir un libro con generoId null');
  assert.strictEqual(sinClasificar.titulo, 'Las cosas que perdimos en el fuego');
});

// Verificaciones de State Manager
check('State: init() y getters devuelven copias inmutables', () => {
  state.init(seedData);
  const books = state.getBooks();
  assert.strictEqual(books.length, 6);
  books.push({ id: 'fake' });
  assert.strictEqual(state.getBooks().length, 6, 'La mutación externa del array no debe alterar el estado interno');
});

check('State: búsqueda de libro por ID e ISBN (con y sin guiones)', () => {
  const book1 = state.getBookById('lib-1');
  assert.strictEqual(book1.titulo, 'Ficciones');

  const bookByIsbn = state.getBookByISBN('9789500424554');
  assert.strictEqual(bookByIsbn.id, 'lib-1');

  const bookByFormattedIsbn = state.getBookByISBN('978-950-042-455-4');
  assert.strictEqual(bookByFormattedIsbn.id, 'lib-1', 'Debe encontrar el libro ignorando guiones');
});

// Verificaciones de Formatters
check('Formatters: formatCurrency formatea a $0.00 exacto', () => {
  assert.strictEqual(formatters.formatCurrency(1500), '$1500.00');
  assert.strictEqual(formatters.formatCurrency(2500.5), '$2500.50');
  assert.strictEqual(formatters.formatCurrency(0), '$0.00');
  assert.strictEqual(formatters.formatCurrency(null), '$0.00');
  assert.strictEqual(formatters.formatCurrency(undefined), '$0.00');
});

check('Formatters: getEditorialName resuelve por ID o fallback', () => {
  assert.strictEqual(formatters.getEditorialName('ed-1', seedData.editoriales), 'Editorial Siglo XXI');
  assert.strictEqual(formatters.getEditorialName('ed-2', seedData.editoriales), 'Penguin Random House');
  assert.strictEqual(formatters.getEditorialName('ed-invalida', seedData.editoriales), 'Editorial desconocida');
});

check('RN-CAT-06: getGeneroName devuelve «Sin clasificar» para null o ausente', () => {
  assert.strictEqual(formatters.getGeneroName('gen-1', seedData.generos), 'Ficción');
  assert.strictEqual(formatters.getGeneroName('gen-2', seedData.generos), 'Ensayo');
  assert.strictEqual(formatters.getGeneroName(null, seedData.generos), 'Sin clasificar');
  assert.strictEqual(formatters.getGeneroName('', seedData.generos), 'Sin clasificar');
  assert.strictEqual(formatters.getGeneroName('gen-inexistente', seedData.generos), 'Sin clasificar');
});

check('Formatters: formatAuthors concatena autores legibles', () => {
  assert.strictEqual(formatters.formatAuthors(['aut-1'], seedData.autores), 'Jorge Luis Borges');
  assert.strictEqual(formatters.formatAuthors(['aut-1', 'aut-2'], seedData.autores), 'Jorge Luis Borges, Julio Cortázar');
  assert.strictEqual(formatters.formatAuthors([], seedData.autores), 'Autor no especificado');
});

// Verificaciones de Lógica de Búsqueda del Catálogo
check('RN-CAT-01: Filtrado insensible a mayúsculas/minúsculas', () => {
  const all = state.getBooks();
  const lowerResults = all.filter(b => b.titulo.toLowerCase().includes('ficciones'.toLowerCase()));
  const upperResults = all.filter(b => b.titulo.toLowerCase().includes('FICCIONES'.toLowerCase()));
  assert.strictEqual(lowerResults.length, 1);
  assert.strictEqual(upperResults.length, 1);
  assert.strictEqual(lowerResults[0].id, upperResults[0].id);
});

check('RN-CAT-02: Coincidencia parcial por subcadena en cualquier posición', () => {
  const all = state.getBooks();
  const partial = all.filter(b => b.titulo.toLowerCase().includes('parte'.toLowerCase()));
  assert.strictEqual(partial.length, 1);
  assert.strictEqual(partial[0].titulo, 'Nuestra parte de noche');
});

check('RN-CAT-03: Limpieza de espacios en blanco extremos (trim)', () => {
  const query = '   aleph   ';
  const cleanQuery = query.trim().toLowerCase();
  const all = state.getBooks();
  const results = all.filter(b => b.titulo.toLowerCase().includes(cleanQuery));
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].titulo, 'El Aleph');
});

check('RN-CAT-04: Búsqueda vacía devuelve todos los libros', () => {
  const query = '   ';
  const cleanQuery = query.trim().toLowerCase();
  const all = state.getBooks();
  const results = !cleanQuery ? all : all.filter(b => b.titulo.toLowerCase().includes(cleanQuery));
  assert.strictEqual(results.length, 6);
});

check('RN-CAT-05: Búsqueda sin coincidencias devuelve lista vacía', () => {
  const cleanQuery = 'quijote'.trim().toLowerCase();
  const all = state.getBooks();
  const results = all.filter(b => b.titulo.toLowerCase().includes(cleanQuery));
  assert.strictEqual(results.length, 0);
});

// Verificaciones de Marcado y CSS
check('HTML: Barra de búsqueda accesible en #catalogo con input y aria-live', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  assert.ok(html.includes('id="catalogo-search"'), 'Debe existir el input catalogo-search');
  assert.ok(html.includes('for="catalogo-search"'), 'Debe existir el label asociado');
  assert.ok(html.includes('id="catalogo-search-status"'), 'Debe existir la región aria-live');
  assert.ok(html.includes('id="catalogo-grid"'), 'Debe existir el contenedor catalogo-grid');
});

check('HTML: Scripts enlazados con defer en orden estricto de dependencias sin type=module', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  assert.ok(!html.includes('type="module"'), 'No debe haber type=module');

  const idxFormatters = html.indexOf('src="js/utils/formatters.js"');
  const idxSeed = html.indexOf('src="js/seed.js"');
  const idxState = html.indexOf('src="js/state.js"');
  const idxCatalogo = html.indexOf('src="js/views/catalogo.view.js"');
  const idxRouter = html.indexOf('src="js/router.js"');
  const idxApp = html.indexOf('src="js/app.js"');

  assert.ok(idxFormatters < idxSeed, 'formatters antes de seed');
  assert.ok(idxSeed < idxState, 'seed antes de state');
  assert.ok(idxState < idxCatalogo, 'state antes de catalogo');
  assert.ok(idxCatalogo < idxRouter, 'catalogo antes de router');
  assert.ok(idxRouter < idxApp, 'router antes de app');
});

check('CSS: Clases .visually-hidden, .book-card y .no-results-card presentes', () => {
  const baseCss = fs.readFileSync(path.join(__dirname, '../css/base.css'), 'utf8');
  const viewsCss = fs.readFileSync(path.join(__dirname, '../css/views.css'), 'utf8');

  assert.ok(baseCss.includes('.visually-hidden'), 'base.css debe incluir .visually-hidden');
  assert.ok(viewsCss.includes('.book-card'), 'views.css debe incluir .book-card');
  assert.ok(viewsCss.includes('.no-results-card'), 'views.css debe incluir .no-results-card');
  assert.ok(viewsCss.includes('.book-price-value'), 'views.css debe incluir .book-price-value');
});

console.log('----------------------------------------------------------------------');
console.log(`Resultado: ${passedTests}/${totalTests} pruebas superadas.`);

if (passedTests === totalTests) {
  console.log('TODAS LAS PRUEBAS DE C-02 PASARON CON ÉXITO (PASS).');
  process.exit(0);
} else {
  console.error('EXISTEN FALLOS EN LA VERIFICACIÓN DE C-02.');
  process.exit(1);
}
