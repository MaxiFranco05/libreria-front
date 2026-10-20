/**
 * ============================================================================
 * Suite de Verificación Automatizada - Change C-05: Persistencia en LocalStorage
 * ============================================================================
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock puro en memoria de Web Storage API (localStorage)
function createMockLocalStorage() {
  let store = {};
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    _dump() {
      return { ...store };
    }
  };
}

// Configurar entorno global antes de cargar módulos
const mockStorage = createMockLocalStorage();
global.localStorage = mockStorage;
global.window = { localStorage: mockStorage };
global.document = {
  readyState: 'complete',
  addEventListener: () => {}
};

console.log('--- Verificación Automatizada C-05 (Persistencia Local y Ciclo de Vida) ---');

let passedTests = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// ----------------------------------------------------------------------------
// 1. Adaptador de Almacenamiento Local (js/storage.js)
// ----------------------------------------------------------------------------

// Carga del módulo bajo prueba
let storage;
try {
  storage = require('../js/storage.js');
} catch (e) {
  storage = null;
}

test('1.1: LibreriaApp.storage existe y expone interfaz de módulo IIFE', () => {
  assert(storage !== null, 'El archivo js/storage.js debe existir y ser requerido');
  assert(typeof storage === 'object', 'LibreriaApp.storage debe ser un objeto');
});

test('1.1: Claves canónicas estandarizadas en storage.KEYS', () => {
  assert(storage && storage.KEYS, 'storage.KEYS debe estar definido');
  assert.strictEqual(storage.KEYS.INITIALIZED, 'libreria_inicializada');
  assert.strictEqual(storage.KEYS.BOOKS, 'libreria_libros');
  assert.strictEqual(storage.KEYS.CLIENTS, 'libreria_clientes');
  assert.strictEqual(storage.KEYS.SALES, 'libreria_ventas');
  assert.strictEqual(storage.KEYS.EDITORIALS, 'libreria_editoriales');
  assert.strictEqual(storage.KEYS.GENRES, 'libreria_generos');
  assert.strictEqual(storage.KEYS.AUTHORS, 'libreria_autores');
});

test('1.1: Primitivas get/set seguras con serialización JSON', () => {
  mockStorage.clear();
  const testData = { id: 1, name: 'Borges', activo: true };
  const ok = storage.set('test_key', testData);
  assert.strictEqual(ok, true, 'set debe retornar true ante guardado exitoso');
  assert.strictEqual(mockStorage.getItem('test_key'), JSON.stringify(testData));

  const retrieved = storage.get('test_key', null);
  assert.deepStrictEqual(retrieved, testData, 'get debe deserializar correctamente los datos');

  const fallback = storage.get('non_existent', { fallback: true });
  assert.deepStrictEqual(fallback, { fallback: true }, 'get debe retornar el fallback ante clave inexistente');
});

test('1.1: Tolerancia a fallos: JSON corrupto o excepción en localStorage', () => {
  mockStorage.setItem('corrupted_key', '{ invalid json ...');
  const result = storage.get('corrupted_key', { safe: true });
  assert.deepStrictEqual(result, { safe: true }, 'get debe retornar fallback seguro ante JSON inválido sin lanzar error');

  // Simular fallo en setItem (ej. cuota excedida)
  const originalSet = mockStorage.setItem;
  mockStorage.setItem = () => {
    throw new Error('QuotaExceededError');
  };
  const setFailed = storage.set('any_key', { data: 123 });
  assert.strictEqual(setFailed, false, 'set debe retornar false y capturar excepción sin romper');
  mockStorage.setItem = originalSet;
});

test('1.1 (Triangulación): remove, has y clearAll', () => {
  mockStorage.clear();
  storage.set(storage.KEYS.INITIALIZED, 'true');
  assert.strictEqual(storage.has(storage.KEYS.INITIALIZED), true);
  storage.remove(storage.KEYS.INITIALIZED);
  assert.strictEqual(storage.has(storage.KEYS.INITIALIZED), false);

  storage.set(storage.KEYS.BOOKS, [{ id: 1 }]);
  storage.set(storage.KEYS.CLIENTS, [{ id: 2 }]);
  storage.clearAll();
  assert.strictEqual(storage.has(storage.KEYS.BOOKS), false);
  assert.strictEqual(storage.has(storage.KEYS.CLIENTS), false);
});

// ----------------------------------------------------------------------------
// 1.2 Métodos de Dominio de Almacenamiento
// ----------------------------------------------------------------------------

test('1.2: isInitialized y setInitialized gestionan la bandera canónica', () => {
  mockStorage.clear();
  assert.strictEqual(storage.isInitialized(), false, 'Inicialmente no debe estar inicializado');

  storage.setInitialized(true);
  assert.strictEqual(storage.isInitialized(), true, 'isInitialized debe retornar true tras setInitialized');
  assert.strictEqual(mockStorage.getItem(storage.KEYS.INITIALIZED), JSON.stringify('true'));

  storage.setInitialized(false);
  assert.strictEqual(storage.isInitialized(), false, 'setInitialized(false) debe desactivar la bandera');
});

test('1.2: saveInitialSeed persiste todas las colecciones iniciales', () => {
  mockStorage.clear();
  const sampleSeed = {
    libros: [{ id: 1, titulo: 'Ficciones' }],
    editoriales: [{ id: 1, nombre: 'Sur' }],
    generos: [{ id: 1, nombre: 'Ficción' }],
    autores: [{ id: 1, nombre: 'Borges' }],
    clientes: [{ id: 1, nombre: 'Carlos' }],
    ventas: []
  };

  const ok = storage.saveInitialSeed(sampleSeed);
  assert.strictEqual(ok, true, 'saveInitialSeed debe retornar true');
  assert.strictEqual(storage.isInitialized(), true, 'saveInitialSeed debe marcar libreria_inicializada');

  assert.deepStrictEqual(storage.getBooks(), sampleSeed.libros);
  assert.deepStrictEqual(storage.getEditorials(), sampleSeed.editoriales);
  assert.deepStrictEqual(storage.getGenres(), sampleSeed.generos);
  assert.deepStrictEqual(storage.getAuthors(), sampleSeed.autores);
  assert.deepStrictEqual(storage.getClients(), sampleSeed.clientes);
  assert.deepStrictEqual(storage.getSales(), []);
});

test('1.2: Métodos de dominio y aliases en español para entidades mutables', () => {
  mockStorage.clear();
  const books = [{ id: 1, titulo: 'El Aleph' }, { id: 2, titulo: 'Rayuela' }];
  storage.saveBooks(books);
  assert.deepStrictEqual(storage.getBooks(), books);
  assert.deepStrictEqual(storage.getLibros(), books, 'Alias getLibros debe coincidir');

  const clients = [{ id: 1, nombre: 'Ana' }];
  storage.saveClients(clients);
  assert.deepStrictEqual(storage.getClients(), clients);
  assert.deepStrictEqual(storage.getClientes(), clients, 'Alias getClientes debe coincidir');

  const sales = [{ id: 'VNT-1001', total: 1500, renglones: [{ libroId: 1, precioUnitario: 1500 }] }];
  storage.saveSales(sales);
  assert.deepStrictEqual(storage.getSales(), sales);
  assert.deepStrictEqual(storage.getVentas(), sales, 'Alias getVentas debe coincidir');
});

// ----------------------------------------------------------------------------
// 2. Ciclo de Vida y Sincronización Reactiva (js/app.js)
// ----------------------------------------------------------------------------

// Carga de módulos necesarios para la integración de App
const seedData = require('../js/seed.js');
const state = require('../js/state.js');
global.LibreriaApp = global.LibreriaApp || {};
global.LibreriaApp.seedData = seedData;
global.LibreriaApp.state = state;
global.LibreriaApp.storage = storage;

const appModule = require('../js/app.js');

test('2.1: Primer inicio: almacena la semilla y activa libreria_inicializada', () => {
  mockStorage.clear();
  assert.strictEqual(storage.isInitialized(), false);

  appModule.initApp();

  assert.strictEqual(storage.isInitialized(), true, 'Debe fijar libreria_inicializada');
  assert.strictEqual(state.getBooks().length, 6, 'Debe haber cargado los 6 libros iniciales');
  assert.strictEqual(storage.getBooks().length, 6, 'Debe haber persistido los 6 libros iniciales');
});

test('2.1: Recarga (F5): recupera datos persistidos sin duplicar la semilla inicial (RN-PER-01, RN-PER-02)', () => {
  // Simular que en la sesión previa se agregó un libro y un cliente
  const nuevoLibro = {
    id: 99,
    titulo: 'Libro Persistido',
    isbn: '9789870000001',
    precio: 3500,
    editorialId: 1,
    generoId: 1,
    autoresIds: [1]
  };
  state.addLibro(nuevoLibro);
  storage.saveBooks(state.getBooks());

  assert.strictEqual(storage.getBooks().length, 7, 'En storage hay 7 libros');

  // Simular recarga de página (F5): reiniciamos el estado en memoria y ejecutamos initApp
  state.init({});
  assert.strictEqual(state.getBooks().length, 0, 'Estado en memoria limpio pre-recarga');

  appModule.initApp();

  // Verificación crucial de no duplicación:
  // Si volviera a inyectar la semilla, habría 13 libros (6 semilla + 7 guardados).
  // Debe haber EXACTAMENTE 7 libros.
  assert.strictEqual(state.getBooks().length, 7, 'Debe haber exactamente 7 libros (no se duplica la semilla)');
  const encontrado = state.getBookById(99);
  assert(encontrado !== null, 'El libro agregado previamente debe haberse restaurado');
  assert.strictEqual(encontrado.titulo, 'Libro Persistido');
});

test('2.2: Sincronización reactiva automática en altas y ventas (RN-PER-03)', () => {
  mockStorage.clear();
  appModule.initApp();

  // 1. Alta de libro dispara libros:updated y persiste automáticamente
  const book = {
    id: 101,
    titulo: 'Reactivo Book',
    isbn: '9789871111111',
    precio: 2000,
    editorialId: 1,
    generoId: 1,
    autoresIds: [1]
  };
  state.addLibro(book);
  const storedBooks = storage.getBooks();
  assert(storedBooks.some((b) => b.id === 101), 'Nuevo libro debe persistirse automáticamente en storage');

  // 2. Alta de cliente dispara clientes:updated y persiste automáticamente
  const client = { id: 201, nombre: 'Cliente Reactivo', email: 'reactivo@test.com' };
  state.addCliente(client);
  const storedClients = storage.getClients();
  assert(storedClients.some((c) => c.id === 201), 'Nuevo cliente debe persistirse automáticamente en storage');

  // 3. Venta confirmada dispara ventas:updated y persiste automáticamente
  const sale = {
    id: 'VNT-9999',
    clienteId: 201,
    clienteNombre: 'Cliente Reactivo',
    fecha: '2026-10-20 15:30',
    total: 2000,
    renglones: [{ libroId: 101, titulo: 'Reactivo Book', cantidad: 1, precioUnitario: 2000, subtotal: 2000 }]
  };
  state.addSale(sale);
  const storedSales = storage.getSales();
  assert(storedSales.some((s) => s.id === 'VNT-9999'), 'Venta confirmada debe persistirse automáticamente en storage');
});

// ----------------------------------------------------------------------------
// 3. Integración en index.html y Prueba de Inmutabilidad Histórica (Flujo 4)
// ----------------------------------------------------------------------------

test('3.1: index.html enlaza js/storage.js con defer y sin type="module"', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  assert(html.includes('<script defer src="js/storage.js"></script>'), 'storage.js debe estar enlazado con defer');
  assert(!html.includes('type="module"'), 'Regla Dura #2: No debe existir type="module"');

  const storageIdx = html.indexOf('src="js/storage.js"');
  const stateIdx = html.indexOf('src="js/state.js"');
  const appIdx = html.indexOf('src="js/app.js"');

  assert(storageIdx !== -1 && stateIdx !== -1 && appIdx !== -1, 'Todos los scripts deben estar presentes');
  assert(storageIdx < stateIdx, 'storage.js debe cargarse antes que state.js');
  assert(stateIdx < appIdx, 'state.js debe cargarse antes que app.js');
});

test('3.2: Prueba Guiada de Inmutabilidad del Precio Histórico (Flujo 4 / Regla Dura #7)', () => {
  // 1. Limpiar entorno e inicializar con datos semilla (el libro 'lib-1' cuesta $1500 originalmente)
  mockStorage.clear();
  appModule.initApp();

  const libroOriginal = state.getBookById('lib-1');
  assert(libroOriginal !== null, 'El libro lib-1 debe existir');
  const precioOriginal = Number(libroOriginal.precio);
  assert.strictEqual(precioOriginal, 1500, 'El precio original de Ficciones debe ser 1500');

  // 2. Registrar venta simulada de 2 unidades a $1500 = $3000
  const ventaOriginal = {
    id: 'VNT-1001',
    clienteId: 'cli-1',
    clienteNombre: 'Juan Pérez',
    fecha: '2026-10-20 15:45',
    total: 3000,
    renglones: [
      {
        libroId: 'lib-1',
        titulo: libroOriginal.titulo,
        cantidad: 2,
        precioUnitario: precioOriginal,
        subtotal: 3000
      }
    ]
  };

  state.addSale(ventaOriginal);

  // Comprobar que la venta se guardó en storage
  const ventasPreF5 = storage.getSales();
  assert.strictEqual(ventasPreF5.length, 1);
  assert.strictEqual(ventasPreF5[0].renglones[0].precioUnitario, 1500);
  assert.strictEqual(ventasPreF5[0].renglones[0].subtotal, 3000);

  // 3. Simular que el docente/evaluador abre DevTools (F12) -> Local Storage y
  //    modifica manualmente el precio del libro lib-1 en libreria_libros de $1500 a $9999
  const rawBooks = JSON.parse(mockStorage.getItem(storage.KEYS.BOOKS));
  const bookIndex = rawBooks.findIndex((b) => b.id === 'lib-1');
  assert(bookIndex !== -1, 'El libro lib-1 debe estar en el array serializado de storage');
  rawBooks[bookIndex].precio = 9999;
  mockStorage.setItem(storage.KEYS.BOOKS, JSON.stringify(rawBooks));

  // 4. Simular recarga del navegador (F5):
  //    Se reinicia la memoria volátil y se ejecuta initApp()
  state.init({});
  assert.strictEqual(state.getBooks().length, 0, 'Memoria volátil vacía pre-recarga');

  appModule.initApp();

  // 5. Verificación de resultados post-recarga:
  // a) El catálogo muestra el nuevo precio modificado ($9999)
  const libroPostRecarga = state.getBookById('lib-1');
  assert.strictEqual(libroPostRecarga.precio, 9999, 'El catálogo debe reflejar el nuevo precio modificado');

  // b) La venta histórica en state y storage CONSERVA intactos el precio histórico ($1500) y subtotal ($3000)
  const ventasPostRecargaState = state.getSales();
  assert.strictEqual(ventasPostRecargaState.length, 1, 'Debe haber 1 venta persistida');
  assert.strictEqual(
    ventasPostRecargaState[0].renglones[0].precioUnitario,
    1500,
    'El precio unitario histórico en state debe seguir siendo 1500 a pesar de que el catálogo vale 9999'
  );
  assert.strictEqual(
    ventasPostRecargaState[0].renglones[0].subtotal,
    3000,
    'El subtotal histórico en state debe seguir siendo 3000'
  );

  const ventasPostRecargaStorage = storage.getSales();
  assert.strictEqual(
    ventasPostRecargaStorage[0].renglones[0].precioUnitario,
    1500,
    'El precio unitario histórico en storage debe seguir siendo 1500'
  );
  assert.strictEqual(
    ventasPostRecargaStorage[0].renglones[0].subtotal,
    3000,
    'El subtotal histórico en storage debe seguir siendo 3000'
  );
});

console.log(`\n----------------------------------------------------------------------`);
console.log(`Resultado: ${passedTests} pruebas superadas.`);
console.log('TODAS LAS PRUEBAS DE C-05 PASARON CON ÉXITO (PASS).');

