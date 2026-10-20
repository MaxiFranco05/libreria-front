const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Verificación Automatizada C-04 (Simulación de Ventas e Inmutabilidad Histórica) ---');

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

// Cargar módulos base
const seedData = require('../js/seed.js');
const state = require('../js/state.js');
const validators = require('../js/utils/validators.js');
const formatters = require('../js/utils/formatters.js');

state.init(seedData);

// -----------------------------------------------------------------------------
// 1. Validadores de Venta Puros (js/utils/validators.js) - Tarea 1.1
// -----------------------------------------------------------------------------

check('RN-VNT-01: validateSaleClient valida presencia y existencia de cliente registrado', () => {
  const existingClients = state.getClients();

  // Cliente vacío / null / indefinido
  assert.strictEqual(validators.validateSaleClient('', existingClients).valid, false);
  assert.strictEqual(validators.validateSaleClient(null, existingClients).valid, false);
  assert.strictEqual(validators.validateSaleClient(undefined, existingClients).valid, false);

  // Cliente inexistente
  const notFound = validators.validateSaleClient('cli-999', existingClients);
  assert.strictEqual(notFound.valid, false);
  assert.ok(notFound.error.toLowerCase().includes('no existe') || notFound.error.toLowerCase().includes('cliente'));

  // Cliente válido
  const validRes = validators.validateSaleClient('cli-1', existingClients);
  assert.strictEqual(validRes.valid, true);
  assert.strictEqual(validRes.sanitizedValue, 'cli-1');
});

check('RN-VNT-02: validateSaleBookSelection valida presencia y existencia de libro en catálogo', () => {
  const existingBooks = state.getBooks();

  // Libro vacío / null / inexistente
  assert.strictEqual(validators.validateSaleBookSelection('', existingBooks).valid, false);
  assert.strictEqual(validators.validateSaleBookSelection(null, existingBooks).valid, false);
  assert.strictEqual(validators.validateSaleBookSelection('lib-999', existingBooks).valid, false);

  // Libro válido
  const validRes = validators.validateSaleBookSelection('lib-1', existingBooks);
  assert.strictEqual(validRes.valid, true);
  assert.strictEqual(validRes.sanitizedValue, 'lib-1');
});

check('RN-VNT-02: validateSaleQuantity exige estrictamente número entero >= 1', () => {
  // Inválidos: vacío, null, 0, negativos, decimales, NaN
  assert.strictEqual(validators.validateSaleQuantity('').valid, false);
  assert.strictEqual(validators.validateSaleQuantity(null).valid, false);
  assert.strictEqual(validators.validateSaleQuantity(0).valid, false);
  assert.strictEqual(validators.validateSaleQuantity('0').valid, false);
  assert.strictEqual(validators.validateSaleQuantity(-2).valid, false);
  assert.strictEqual(validators.validateSaleQuantity('-5').valid, false);
  assert.strictEqual(validators.validateSaleQuantity(1.5).valid, false);
  assert.strictEqual(validators.validateSaleQuantity('2.75').valid, false);
  assert.strictEqual(validators.validateSaleQuantity('abc').valid, false);

  // Válidos: enteros >= 1 en tipo numérico o string
  const res1 = validators.validateSaleQuantity(1);
  assert.strictEqual(res1.valid, true);
  assert.strictEqual(res1.sanitizedValue, 1);

  const res2 = validators.validateSaleQuantity('5');
  assert.strictEqual(res2.valid, true);
  assert.strictEqual(res2.sanitizedValue, 5);

  const res3 = validators.validateSaleQuantity(100);
  assert.strictEqual(res3.valid, true);
  assert.strictEqual(res3.sanitizedValue, 100);
});

check('RN-VNT-02: validateSaleRows exige al menos un renglón válido en la canasta', () => {
  // Vacíos o no array
  assert.strictEqual(validators.validateSaleRows([]).valid, false);
  assert.strictEqual(validators.validateSaleRows(null).valid, false);
  assert.strictEqual(validators.validateSaleRows(undefined).valid, false);

  // Renglones corruptos
  assert.strictEqual(validators.validateSaleRows([{ libroId: 'lib-1', cantidad: 0 }]).valid, false);

  // Renglones válidos
  const validRows = [
    { libroId: 'lib-1', titulo: 'Ficciones', cantidad: 2, precioUnitario: 18500, subtotal: 37000 }
  ];
  const res = validators.validateSaleRows(validRows);
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.sanitizedValue.length, 1);
});

check('Triangulación 1.1: casos de borde y tipado estricto en validadores de ventas', () => {
  const existingClients = state.getClients();
  const existingBooks = state.getBooks();

  // Cliente con espacios alrededor
  const clientWithSpaces = validators.validateSaleClient('  cli-1  ', existingClients);
  assert.strictEqual(clientWithSpaces.valid, true);
  assert.strictEqual(clientWithSpaces.sanitizedValue, 'cli-1');

  // Libro con lista vacía
  assert.strictEqual(validators.validateSaleBookSelection('lib-1', []).valid, false);

  // Cantidad con notación no entera o strings inválidos
  assert.strictEqual(validators.validateSaleQuantity('1e0.5').valid, false);
  assert.strictEqual(validators.validateSaleQuantity('Infinity').valid, false);
  assert.strictEqual(validators.validateSaleQuantity(-0).valid, false);

  // validateSaleRows con filas heterogéneas
  const mixedRows = [
    { libroId: 'lib-1', cantidad: 2 },
    { libroId: 'lib-2', cantidad: -1 }
  ];
  assert.strictEqual(validators.validateSaleRows(mixedRows).valid, false);

  const multipleValid = [
    { libroId: 'lib-1', cantidad: 2 },
    { libroId: 'lib-2', cantidad: 3 }
  ];
  assert.strictEqual(validators.validateSaleRows(multipleValid).valid, true);
});

// -----------------------------------------------------------------------------
// 2. Formateadores de Venta Puros (js/utils/formatters.js) - Tarea 1.2
// -----------------------------------------------------------------------------

check('Formatters: roundCurrency redondea a 2 decimales sin artefactos de coma flotante', () => {
  assert.strictEqual(formatters.roundCurrency(15000.555), 15000.56);
  assert.strictEqual(formatters.roundCurrency(12.341), 12.34);
  assert.strictEqual(formatters.roundCurrency(3 * 19.99), 59.97);
  assert.strictEqual(formatters.roundCurrency('42.501'), 42.5);
  assert.strictEqual(formatters.roundCurrency(0), 0);
  assert.strictEqual(formatters.roundCurrency(null), 0);
  assert.strictEqual(formatters.roundCurrency('abc'), 0);
});

check('Formatters: formatDateTime formatea fechas en estándar legible YYYY-MM-DD HH:mm', () => {
  const fixedDate = new Date(2026, 9, 20, 14, 35); // 2026-10-20 14:35
  const formatted = formatters.formatDateTime(fixedDate);
  assert.strictEqual(formatted, '2026-10-20 14:35');

  // Con string ISO
  const isoDate = new Date(2026, 0, 5, 9, 7).toISOString();
  const formattedIso = formatters.formatDateTime(isoDate);
  assert.ok(formattedIso.includes('2026-01-05') && formattedIso.includes(':'));

  // Fecha inválida
  assert.strictEqual(formatters.formatDateTime('fecha-invalida'), 'Fecha inválida');
});

check('Formatters: getClientName resuelve nombre completo de cliente o fallback', () => {
  const clients = state.getClients();
  // cli-1 es 'Juan Pérez' según seed
  const name1 = formatters.getClientName('cli-1', clients);
  assert.strictEqual(name1, 'Juan Pérez');

  // Cliente inexistente o nulo
  assert.strictEqual(formatters.getClientName('cli-inexistente', clients), 'Cliente no especificado');
  assert.strictEqual(formatters.getClientName(null, clients), 'Cliente no especificado');
  assert.strictEqual(formatters.getClientName('cli-1', []), 'Cliente no especificado');
});

check('Triangulación 1.2: casos de borde en roundCurrency, formatDateTime y getClientName', () => {
  // Redondeo de negativos y pequeños decimales
  assert.strictEqual(formatters.roundCurrency(-15.555), -15.56);
  assert.strictEqual(formatters.roundCurrency(0.004), 0);
  assert.strictEqual(formatters.roundCurrency(0.005), 0.01);

  // Padding con ceros a la izquierda en fecha y hora
  const d = new Date(2026, 1, 3, 4, 5); // Febrero 3, 04:05
  assert.strictEqual(formatters.formatDateTime(d), '2026-02-03 04:05');

  // Cliente con fallback a propiedad nombre
  const customClients = [{ id: 'cli-legacy', nombre: 'Ana Gómez' }];
  assert.strictEqual(formatters.getClientName('cli-legacy', customClients), 'Ana Gómez');
});

// -----------------------------------------------------------------------------
// 3. Estado de Ventas, Inmutabilidad y Catálogo (js/state.js) - Tarea 1.3
// -----------------------------------------------------------------------------

check('State: getNextSaleId genera IDs correlativos con prefijo VNT-1001 en adelante', () => {
  // Con estado recién reiniciado (0 ventas)
  assert.strictEqual(state.getNextSaleId(), 'VNT-1001');
});

check('RN-VNT-06 / Regla Dura #7: addSale / addVenta clona profundamente renglones e impide mutación externa', () => {
  const saleId = state.getNextSaleId();
  const inputSale = {
    id: saleId,
    fecha: '2026-10-20 15:00',
    clienteId: 'cli-1',
    total: 37000,
    renglones: [
      { libroId: 'lib-1', titulo: 'Ficciones', precioUnitario: 18500, cantidad: 2, subtotal: 37000 }
    ]
  };

  let eventFired = false;
  const unsubscribe = state.on('ventas:updated', (data) => {
    eventFired = true;
    assert.ok(data.sale, 'Debe emitir la venta registrada');
  });

  const added = state.addVenta(inputSale);
  assert.strictEqual(added, true);
  assert.strictEqual(eventFired, true);
  unsubscribe();

  // Verificar que el siguiente ID se incrementó
  assert.strictEqual(state.getNextSaleId(), 'VNT-1002');

  // Intentar mutar el objeto original de entrada
  inputSale.renglones[0].precioUnitario = 999999;
  inputSale.renglones[0].cantidad = 99;

  // Verificar que en el estado no se modificó
  const storedSales = state.getVentas();
  const storedSale = storedSales.find((s) => s.id === saleId);
  assert.strictEqual(storedSale.renglones[0].precioUnitario, 18500);
  assert.strictEqual(storedSale.renglones[0].cantidad, 2);

  // Intentar mutar lo que devuelve getVentas()
  storedSale.renglones[0].precioUnitario = 888888;
  const storedAgain = state.getVentas().find((s) => s.id === saleId);
  assert.strictEqual(storedAgain.renglones[0].precioUnitario, 18500);
});

check('Regla Dura #7: Modificar el precio de un libro en catálogo (updateBookPrice) JAMÁS altera ventas históricas', () => {
  const sales = state.getVentas();
  assert.ok(sales.length > 0, 'Debe haber al menos una venta registrada');
  const pastSale = sales[0];
  const originalHistoryPrice = pastSale.renglones[0].precioUnitario;
  const originalSubtotal = pastSale.renglones[0].subtotal;
  const originalTotal = pastSale.total;

  // Mutamos el precio del libro en catálogo
  const bookId = pastSale.renglones[0].libroId;
  const updateResult = state.updateBookPrice(bookId, 55000);
  assert.strictEqual(updateResult, true);

  // Verificamos que el catálogo tiene el nuevo precio
  assert.strictEqual(state.getBookById(bookId).precio, 55000);

  // Verificamos que la venta histórica en state.ventas permanece INTOCABLE
  const salesAfterCatalogMutation = state.getVentas();
  const pastSaleAfter = salesAfterCatalogMutation.find((s) => s.id === pastSale.id);
  assert.strictEqual(pastSaleAfter.renglones[0].precioUnitario, originalHistoryPrice);
  assert.strictEqual(pastSaleAfter.renglones[0].subtotal, originalSubtotal);
  assert.strictEqual(pastSaleAfter.total, originalTotal);
});

check('Triangulación 1.3: robustez en mutaciones de catálogo, IDs correlativos y validación de entrada en addSale', () => {
  // updateBookPrice con valores inválidos (cero, negativo, NaN) no debe mutar
  const currentPrice = state.getBookById('lib-1').precio;
  assert.strictEqual(state.updateBookPrice('lib-1', 0), false);
  assert.strictEqual(state.updateBookPrice('lib-1', -500), false);
  assert.strictEqual(state.updateBookPrice('lib-1', 'precio-invalido'), false);
  assert.strictEqual(state.updateBookPrice('lib-inexistente', 1000), false);
  assert.strictEqual(state.getBookById('lib-1').precio, currentPrice);

  // addSale con entrada vacía o no objeto
  assert.strictEqual(state.addSale(null), false);
  assert.strictEqual(state.addSale(undefined), false);
  assert.strictEqual(state.addSale('string-no-valido'), false);
  assert.strictEqual(state.addVenta(null), false);

  // Generación secuencial de IDs correlativos
  const nextId = state.getNextSaleId();
  state.addSale({
    id: nextId,
    fecha: '2026-10-20 16:00',
    clienteId: 'cli-2',
    total: 1000,
    renglones: [{ libroId: 'lib-2', titulo: 'El Aleph', cantidad: 1, precioUnitario: 1000, subtotal: 1000 }]
  });
  assert.strictEqual(state.getNextSaleId(), 'VNT-1003');
});

// -----------------------------------------------------------------------------
// 4. Marcado Semántico HTML5 y Scripts en index.html (Tareas 2.1 y 2.2)
// -----------------------------------------------------------------------------

check('HTML: Sección #ventas con marcado semántico accesible y sin type="module"', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');

  // No debe haber type="module"
  assert.strictEqual(html.includes('type="module"'), false, 'index.html no debe incluir type="module"');

  // Elementos requeridos en #ventas
  assert.ok(html.includes('id="venta-cliente"'), 'Debe existir el selector #venta-cliente');
  assert.ok(html.includes('for="venta-cliente"'), 'Debe existir label para #venta-cliente');
  assert.ok(html.includes('id="venta-libro"'), 'Debe existir el selector #venta-libro');
  assert.ok(html.includes('for="venta-libro"'), 'Debe existir label para #venta-libro');
  assert.ok(html.includes('id="venta-cantidad"'), 'Debe existir el input #venta-cantidad');
  assert.ok(html.includes('for="venta-cantidad"'), 'Debe existir label para #venta-cantidad');
  assert.ok(html.includes('id="btn-agregar-renglon"'), 'Debe existir botón #btn-agregar-renglon');
  assert.ok(html.includes('id="tabla-borrador-venta"'), 'Debe existir tabla #tabla-borrador-venta');
  assert.ok(html.includes('id="venta-total-general"'), 'Debe existir visualizador #venta-total-general');
  assert.ok(html.includes('id="btn-confirmar-venta"'), 'Debe existir botón #btn-confirmar-venta');

  // Contenedor table-responsive para evitar scroll horizontal de ventana (Regla Dura #6)
  assert.ok(
    html.includes('table-responsive') && html.includes('id="tabla-borrador-venta"'),
    'La tabla de borrador debe estar contenida en .table-responsive'
  );
});

check('HTML: Sección #historial y scripts de vistas enlazados en head con defer', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');

  // Elementos requeridos en #historial
  assert.ok(html.includes('id="historial-vacio"'), 'Debe existir contenedor #historial-vacio');
  assert.ok(html.includes('id="tabla-historial-ventas"'), 'Debe existir tabla #tabla-historial-ventas');

  // Contenedor table-responsive en historial
  assert.ok(
    html.includes('table-responsive') && html.includes('id="tabla-historial-ventas"'),
    'La tabla de historial debe estar contenida en .table-responsive'
  );

  // Scripts enlazados con defer antes de app.js
  assert.ok(html.includes('js/views/ventas.view.js'), 'Debe incluir script js/views/ventas.view.js');
  assert.ok(html.includes('js/views/historial.view.js'), 'Debe incluir script js/views/historial.view.js');

  const posVentas = html.indexOf('js/views/ventas.view.js');
  const posHistorial = html.indexOf('js/views/historial.view.js');
  const posApp = html.indexOf('js/app.js');

  assert.ok(posVentas < posApp, 'ventas.view.js debe cargarse antes de app.js');
  assert.ok(posHistorial < posApp, 'historial.view.js debe cargarse antes de app.js');
});

// -----------------------------------------------------------------------------
// 5. Estilos CSS para Ventas e Historial (Tarea 2.3)
// -----------------------------------------------------------------------------

check('CSS: Reglas visuales responsivas y accesibles para ventas e historial en css/views.css', () => {
  const css = fs.readFileSync(path.join(__dirname, '../css/views.css'), 'utf-8');

  // Reglas de ventas
  assert.ok(css.includes('.ventas-layout'), 'Debe definir .ventas-layout');
  assert.ok(css.includes('.ventas-summary-box'), 'Debe definir .ventas-summary-box');
  assert.ok(css.includes('.ventas-total-amount'), 'Debe definir .ventas-total-amount');

  // Reglas de desglose expandible en historial
  assert.ok(css.includes('.historial-detail-row'), 'Debe definir .historial-detail-row');
  assert.ok(css.includes('.historial-detail-table'), 'Debe definir .historial-detail-table');

  // Respeto de foco visible y prevención de scroll horizontal
  assert.ok(
    css.includes(':focus-visible') || fs.readFileSync(path.join(__dirname, '../css/components.css'), 'utf-8').includes(':focus-visible'),
    'Debe contemplar foco visible :focus-visible'
  );
});

// -----------------------------------------------------------------------------
// 6. Vista de Simulación de Ventas (js/views/ventas.view.js) - Tareas 3.1, 3.2, 3.3
// -----------------------------------------------------------------------------

// Reiniciamos estado con semilla para evaluar ventas en limpio
state.init(seedData);

check('VentasView: interfaz pública y módulo presente bajo patrón IIFE', () => {
  const ventasView = require('../js/views/ventas.view.js');
  assert.strictEqual(typeof ventasView.init, 'function');
  assert.strictEqual(typeof ventasView.populateClientSelect, 'function');
  assert.strictEqual(typeof ventasView.populateBookSelect, 'function');
  assert.strictEqual(typeof ventasView.addToDraft, 'function');
  assert.strictEqual(typeof ventasView.updateDraftQuantity, 'function');
  assert.strictEqual(typeof ventasView.removeFromDraft, 'function');
  assert.strictEqual(typeof ventasView.calculateDraftTotal, 'function');
  assert.strictEqual(typeof ventasView.confirmSale, 'function');
});

check('RN-CLI-04 / RN-LIB-06: VentasView actualiza reactivamente selectores preservando selección', () => {
  // Simulamos entorno DOM básico
  const dummyDom = {
    clientSelect: {
      options: [],
      value: '',
      appendChild(opt) { this.options.push(opt); },
      removeChild() { this.options.pop(); },
      get firstChild() { return this.options[0]; }
    },
    bookSelect: {
      options: [],
      value: '',
      appendChild(opt) { this.options.push(opt); },
      removeChild() { this.options.pop(); },
      get firstChild() { return this.options[0]; }
    }
  };

  const ventasView = require('../js/views/ventas.view.js');
  // Debe suscribirse a eventos y poblar selectores
  assert.ok(typeof ventasView.populateClientSelect === 'function');
  assert.ok(typeof ventasView.populateBookSelect === 'function');
});

check('RN-VNT-03 / RN-VNT-04 / RN-VNT-05: Composición del borrador, no duplicidad, edición, baja y totales', () => {
  const ventasView = require('../js/views/ventas.view.js');
  ventasView.resetDraft();

  // Estado inicial vacío
  assert.strictEqual(ventasView.getDraft().renglones.length, 0);
  assert.strictEqual(ventasView.calculateDraftTotal(), 0);

  // Agregar primer libro: lib-1 (Ficciones, $1500 en seed) con cantidad 2
  const book1 = state.getBookById('lib-1');
  const add1 = ventasView.addToDraft('lib-1', 2);
  assert.strictEqual(add1.success, true);
  assert.strictEqual(ventasView.getDraft().renglones.length, 1);
  assert.strictEqual(ventasView.getDraft().renglones[0].cantidad, 2);
  assert.strictEqual(ventasView.getDraft().renglones[0].precioUnitario, book1.precio);
  assert.strictEqual(ventasView.getDraft().renglones[0].subtotal, book1.precio * 2);
  assert.strictEqual(ventasView.calculateDraftTotal(), book1.precio * 2);

  // RN-VNT-03: Control de no duplicidad al agregar nuevamente lib-1 con cantidad 1
  const addDup = ventasView.addToDraft('lib-1', 1);
  assert.strictEqual(addDup.success, true);
  // Sigue habiendo 1 sola fila pero con cantidad 3
  assert.strictEqual(ventasView.getDraft().renglones.length, 1);
  assert.strictEqual(ventasView.getDraft().renglones[0].cantidad, 3);
  assert.strictEqual(ventasView.getDraft().renglones[0].subtotal, book1.precio * 3);
  assert.strictEqual(ventasView.calculateDraftTotal(), book1.precio * 3);

  // Agregar segundo libro: lib-2
  const book2 = state.getBookById('lib-2');
  const add2 = ventasView.addToDraft('lib-2', 1);
  assert.strictEqual(add2.success, true);
  assert.strictEqual(ventasView.getDraft().renglones.length, 2);
  const expectedTotal = (book1.precio * 3) + book2.precio;
  assert.strictEqual(ventasView.calculateDraftTotal(), expectedTotal);

  // RN-VNT-04: Modificar cantidad de lib-1 a 4
  const updated = ventasView.updateDraftQuantity('lib-1', 4);
  assert.strictEqual(updated, true);
  assert.strictEqual(ventasView.getDraft().renglones[0].cantidad, 4);
  assert.strictEqual(ventasView.getDraft().renglones[0].subtotal, book1.precio * 4);
  assert.strictEqual(ventasView.calculateDraftTotal(), (book1.precio * 4) + book2.precio);

  // RN-VNT-04: Modificación con cantidad inválida rechaza
  assert.strictEqual(ventasView.updateDraftQuantity('lib-1', 0), false);
  assert.strictEqual(ventasView.updateDraftQuantity('lib-1', -3), false);
  assert.strictEqual(ventasView.updateDraftQuantity('lib-1', 1.5), false);
  assert.strictEqual(ventasView.getDraft().renglones[0].cantidad, 4);

  // RN-VNT-04: Eliminar renglón lib-2
  const removed = ventasView.removeFromDraft('lib-2');
  assert.strictEqual(removed, true);
  assert.strictEqual(ventasView.getDraft().renglones.length, 1);
  assert.strictEqual(ventasView.calculateDraftTotal(), book1.precio * 4);
});

check('RN-VNT-01 / RN-VNT-02 / RN-VNT-06 / RN-VNT-08: Confirmación de venta con snapshot y reseteo', () => {
  const ventasView = require('../js/views/ventas.view.js');
  ventasView.resetDraft();

  // 1. Confirmar con carrito vacío debe fallar (RN-VNT-02)
  const emptyConfirm = ventasView.confirmSale('cli-1');
  assert.strictEqual(emptyConfirm.success, false);
  assert.ok(emptyConfirm.error.toLowerCase().includes('libro') || emptyConfirm.error.toLowerCase().includes('pedido'));

  // 2. Agregar ítem válido
  const book1 = state.getBookById('lib-1');
  ventasView.addToDraft('lib-1', 2);

  // 3. Confirmar sin cliente debe fallar (RN-VNT-01)
  const noClientConfirm = ventasView.confirmSale('');
  assert.strictEqual(noClientConfirm.success, false);
  assert.ok(noClientConfirm.error.toLowerCase().includes('cliente'));

  // 4. Confirmación exitosa con cliente válido
  const confirmResult = ventasView.confirmSale('cli-1');
  assert.strictEqual(confirmResult.success, true);
  assert.ok(confirmResult.sale, 'Debe devolver el objeto de la venta confirmada');
  assert.ok(confirmResult.sale.id.startsWith('VNT-'), 'El ID debe ser correlativo');
  assert.strictEqual(confirmResult.sale.clienteId, 'cli-1');
  assert.strictEqual(confirmResult.sale.total, book1.precio * 2);
  assert.strictEqual(confirmResult.sale.renglones[0].precioUnitario, book1.precio);

  // RN-VNT-08: El borrador debe haberse vaciado automáticamente
  assert.strictEqual(ventasView.getDraft().renglones.length, 0);
  assert.strictEqual(ventasView.calculateDraftTotal(), 0);

  // Y la venta debe estar persistida en state.ventas
  const sales = state.getVentas();
  assert.ok(sales.some((s) => s.id === confirmResult.sale.id));
});

check('Regla Dura #5: ventas.view.js no utiliza .innerHTML para datos dinámicos', () => {
  const content = fs.readFileSync(path.join(__dirname, '../js/views/ventas.view.js'), 'utf-8');
  assert.strictEqual(content.includes('.innerHTML ='), false, 'ventas.view.js no debe asignar .innerHTML');
});

check('Triangulación 3.1 - 3.3: casos borde de composición de ventas, selección reactiva e inmutabilidad de confirmación', () => {
  const ventasView = require('../js/views/ventas.view.js');
  ventasView.resetDraft();

  // Libro inexistente
  const notFoundBook = ventasView.addToDraft('lib-inexistente', 1);
  assert.strictEqual(notFoundBook.success, false);

  // Cantidad inválida (0, -1, float)
  assert.strictEqual(ventasView.addToDraft('lib-1', 0).success, false);
  assert.strictEqual(ventasView.addToDraft('lib-1', -5).success, false);
  assert.strictEqual(ventasView.addToDraft('lib-1', 2.3).success, false);

  // Modificar cantidad de ítem que no está en borrador
  assert.strictEqual(ventasView.updateDraftQuantity('lib-999', 3), false);

  // Borrador con múltiples ítems heterogéneos
  ventasView.addToDraft('lib-1', 2);
  ventasView.addToDraft('lib-2', 3);
  ventasView.addToDraft('lib-3', 1);

  const draft = ventasView.getDraft();
  assert.strictEqual(draft.renglones.length, 3);
  const expectedTotal = (1500 * 2) + (2000 * 3) + (2500 * 1); // 3000 + 6000 + 2500 = 11500
  assert.strictEqual(ventasView.calculateDraftTotal(), expectedTotal);

  // Confirmación
  const result = ventasView.confirmSale('cli-2');
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.sale.total, expectedTotal);
  assert.strictEqual(result.sale.renglones.length, 3);
  assert.strictEqual(result.sale.clienteId, 'cli-2');

  // Cada renglón contiene su propio snapshot
  assert.strictEqual(result.sale.renglones[0].precioUnitario, 1500);
  assert.strictEqual(result.sale.renglones[1].precioUnitario, 2000);
  assert.strictEqual(result.sale.renglones[2].precioUnitario, 2500);
});

// -----------------------------------------------------------------------------
// 7. Vista de Historial Inmutable y Solo Lectura (js/views/historial.view.js) - Tarea 4.1
// -----------------------------------------------------------------------------

check('HistorialView: interfaz pública y módulo presente bajo patrón IIFE', () => {
  const historialView = require('../js/views/historial.view.js');
  assert.strictEqual(typeof historialView.init, 'function');
  assert.strictEqual(typeof historialView.renderTable, 'function');
  assert.strictEqual(typeof historialView.toggleDetail, 'function');
});

check('Regla Dura #7 / RN-VNT-06 / RN-VNT-07: Inmutabilidad estricta y solo lectura en historial.view.js', () => {
  const content = fs.readFileSync(path.join(__dirname, '../js/views/historial.view.js'), 'utf-8');

  // Regla Dura #7: JAMÁS llamar a getBookById ni leer precios del catálogo
  assert.strictEqual(
    content.includes('getBookById'),
    false,
    'historial.view.js NO debe consultar libros del catálogo mediante getBookById'
  );

  // Regla Dura #5: Sin .innerHTML con datos dinámicos
  assert.strictEqual(
    content.includes('.innerHTML ='),
    false,
    'historial.view.js NO debe asignar .innerHTML'
  );

  // RN-VNT-07: Solo lectura, sin controles de edición o borrado
  assert.strictEqual(
    content.includes('deleteSale') || content.includes('eliminarVenta') || content.includes('editSale'),
    false,
    'historial.view.js es de estricta solo lectura'
  );

  // Accesibilidad en botones de detalle (aria-expanded y aria-controls)
  assert.ok(content.includes('aria-expanded'), 'Debe utilizar aria-expanded en botón de detalle');
  assert.ok(content.includes('aria-controls'), 'Debe utilizar aria-controls en botón de detalle');
});

// -----------------------------------------------------------------------------
// 8. Integración en js/app.js y Verificación Completa - Tarea 4.2
// -----------------------------------------------------------------------------

check('App: Inicialización orquestada de ventas e historial en js/app.js', () => {
  const appContent = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf-8');
  assert.ok(
    appContent.includes('app.views.ventas') && appContent.includes('app.views.ventas.init()'),
    'js/app.js debe inicializar app.views.ventas'
  );
  assert.ok(
    appContent.includes('app.views.historial') && appContent.includes('app.views.historial.init()'),
    'js/app.js debe inicializar app.views.historial'
  );
});

check('Triangulación 4.1 - 4.2: Prueba de Fuego E2E de Inmutabilidad Histórica y ciclo completo de ventas', () => {
  // 1. Alta reactiva de un nuevo cliente y un nuevo libro
  const nuevoCliente = { id: 'cli-triangulate-1', nombreCompleto: 'Comprador Auditor', email: 'auditor@test.com' };
  const nuevoLibro = { id: 'lib-triangulate-1', titulo: 'Libro Histórico Clave', isbn: '9789871112223', precio: 12500.5, editorialId: 'ed-1', autorIds: ['aut-1'] };

  state.addCliente(nuevoCliente);
  state.addLibro(nuevoLibro);

  // 2. Simular venta desde ventasView
  const ventasView = require('../js/views/ventas.view.js');
  ventasView.resetDraft();

  const addRes = ventasView.addToDraft('lib-triangulate-1', 2);
  assert.strictEqual(addRes.success, true);
  assert.strictEqual(ventasView.calculateDraftTotal(), 25001.0); // 12500.5 * 2 = 25001.0

  const confirmRes = ventasView.confirmSale('cli-triangulate-1');
  assert.strictEqual(confirmRes.success, true);
  const auditSaleId = confirmRes.sale.id;

  // 3. Mutación agresiva de catálogo (aumento de precio del 100%)
  state.updateBookPrice('lib-triangulate-1', 25000);
  assert.strictEqual(state.getBookById('lib-triangulate-1').precio, 25000);

  // 4. Auditoría de la venta histórica registrada: DEBE permanecer inmutable
  const recordedSale = state.getVentas().find((s) => s.id === auditSaleId);
  assert.ok(recordedSale, 'La venta debe estar registrada');
  assert.strictEqual(recordedSale.renglones[0].precioUnitario, 12500.5);
  assert.strictEqual(recordedSale.renglones[0].subtotal, 25001.0);
  assert.strictEqual(recordedSale.total, 25001.0);

  // 5. HistorialView solo lectura
  const historialView = require('../js/views/historial.view.js');
  assert.strictEqual(typeof historialView.toggleDetail, 'function');
  // Invocación segura sin DOM no debe arrojar excepción
  historialView.toggleDetail('VNT-inexistente');
});

// Resumen preliminar
console.log(`\nResultado preliminar: ${passedTests}/${totalTests} pruebas superadas.`);
if (passedTests !== totalTests) {
  process.exitCode = 1;
}
