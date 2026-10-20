const fs = require('fs');
const path = require('path');

console.log('--- Verificación Automatizada C-01 (Post-Auditoría Frontend) ---');

// 1. Verificar existencia de archivos
const files = [
  'index.html',
  'css/base.css',
  'css/layout.css',
  'css/components.css',
  'css/views.css',
  'js/router.js',
  'js/app.js'
];

let allPassed = true;

files.forEach(f => {
  if (fs.existsSync(path.join(__dirname, '..', f))) {
    console.log(`[PASS] Archivo presente: ${f}`);
  } else {
    console.error(`[FAIL] Archivo faltante: ${f}`);
    allPassed = false;
  }
});

// 2. Verificar marcado semántico HTML5
const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const htmlChecks = [
  { name: 'Header semántico', pattern: /<header[^>]*role="banner"/ },
  { name: 'Navegación accesible', pattern: /<nav[^>]*aria-label="Navegación principal"/ },
  { name: 'Skip-link accesible', pattern: /<a[^>]*href="#main-content"[^>]*class="skip-link"/ },
  { name: 'Contenedor main con ID', pattern: /<main[^>]*id="main-content"/ },
  { name: 'Sección catálogo', pattern: /<section[^>]*id="catalogo"[^>]*class="view-section active"/ },
  { name: 'Sección libros', pattern: /<section[^>]*id="libros"[^>]*class="view-section"/ },
  { name: 'Sección clientes', pattern: /<section[^>]*id="clientes"[^>]*class="view-section"/ },
  { name: 'Sección ventas', pattern: /<section[^>]*id="ventas"[^>]*class="view-section"/ },
  { name: 'Sección historial', pattern: /<section[^>]*id="historial"[^>]*class="view-section"/ },
  { name: 'Footer semántico', pattern: /<footer[^>]*role="contentinfo"/ },
  { name: 'Carga diferida router.js', pattern: /<script[^>]*defer[^>]*src="js\/router\.js"/ },
  { name: 'Carga diferida app.js', pattern: /<script[^>]*defer[^>]*src="js\/app\.js"/ },
  { name: 'Sin script type=module (garantía file://)', test: () => !htmlContent.includes('type="module"') }
];

htmlChecks.forEach(check => {
  const passed = check.pattern ? check.pattern.test(htmlContent) : check.test();
  if (passed) {
    console.log(`[PASS] HTML: ${check.name}`);
  } else {
    console.error(`[FAIL] HTML: ${check.name}`);
    allPassed = false;
  }
});

// 3. Verificar CSS: Variables, Reset, Responsive, Focus-visible, Calibración WCAG AA
const baseCss = fs.readFileSync(path.join(__dirname, '..', 'css/base.css'), 'utf8');
const layoutCss = fs.readFileSync(path.join(__dirname, '..', 'css/layout.css'), 'utf8');
const componentsCss = fs.readFileSync(path.join(__dirname, '..', 'css/components.css'), 'utf8');

const cssChecks = [
  { name: 'Variables en :root', content: baseCss, pattern: /--bg-primary:\s*#FDFBF7/i },
  { name: 'Color primario de texto WCAG AA', content: baseCss, pattern: /--text-primary:\s*#2B2D42/i },
  { name: 'Acento calibrado WCAG AA (>4.5:1)', content: baseCss, pattern: /--accent-primary:\s*#BA4D25/i },
  { name: 'Acento hover calibrado (>5:1)', content: baseCss, pattern: /--accent-primary-hover:\s*#9E3E1A/i },
  { name: 'Compensación header sticky con scroll-margin-top (WCAG 2.2)', content: baseCss, pattern: /scroll-margin-top:\s*5\.5rem/ },
  { name: 'Reset box-sizing global', content: baseCss, pattern: /box-sizing:\s*border-box/ },
  { name: 'Prevención scroll horizontal global en body', content: baseCss, pattern: /overflow-x:\s*hidden/ },
  { name: 'Regla :focus-visible con outline', content: baseCss, pattern: /:focus-visible\s*\{[^}]*outline:\s*2px/ },
  { name: 'Ocultamiento de secciones inactivas', content: layoutCss, pattern: /\.view-section\s*\{[^}]*display:\s*none/ },
  { name: 'Visualización de sección activa', content: layoutCss, pattern: /\.view-section\.active\s*\{[^}]*display:\s*block/ },
  { name: 'Media query responsive (min-width: 768px)', content: layoutCss, pattern: /@media\s*\(\s*min-width:\s*768px\s*\)/ },
  { name: 'Media query responsive móvil (max-width: 480px)', content: layoutCss, pattern: /@media\s*\(\s*max-width:\s*480px\s*\)/ },
  { name: 'Touch target mínimo 44px en nav-link móvil (WCAG 2.2 / Touch UX)', content: layoutCss, pattern: /min-height:\s*44px/ },
  { name: 'Skip-link accesible con GPU transform (-100%)', content: componentsCss, pattern: /transform:\s*translateY\(-100%\)/ },
  { name: 'Skip-link visible en foco (translateY(0))', content: componentsCss, pattern: /transform:\s*translateY\(0\)/ },
  { name: 'Feedback táctil en botones (:active)', content: componentsCss, pattern: /\.btn:active:not\(:disabled\)\s*\{[^}]*transform:\s*translateY\(1px\)/ },
  { name: 'Contenedor table-responsive con overflow-x auto', content: componentsCss, pattern: /\.table-responsive\s*\{[^}]*overflow-x:\s*auto/ }
];

cssChecks.forEach(check => {
  if (check.pattern.test(check.content)) {
    console.log(`[PASS] CSS: ${check.name}`);
  } else {
    console.error(`[FAIL] CSS: ${check.name}`);
    allPassed = false;
  }
});

// 4. Verificar JS: Router, Skip-link setup, Scroll reset
const routerCode = fs.readFileSync(path.join(__dirname, '..', 'js/router.js'), 'utf8');
const appCode = fs.readFileSync(path.join(__dirname, '..', 'js/app.js'), 'utf8');

const jsChecks = [
  { name: 'Rutas registradas y default catalogo', test: () => routerCode.includes('VALID_ROUTES') && routerCode.includes("DEFAULT_ROUTE = 'catalogo'") },
  { name: 'Manejo aria-current="page"', test: () => routerCode.includes('aria-current') },
  { name: 'Listener hashchange', test: () => routerCode.includes('hashchange') },
  { name: 'Reset de scroll al cambiar de vista', test: () => routerCode.includes('window.scrollTo(0, 0)') },
  { name: 'Interceptación accesible del skip-link', test: () => routerCode.includes('setupSkipLink') && routerCode.includes('preventDefault') },
  { name: 'Inicializador central LibreriaApp.init', test: () => appCode.includes('window.LibreriaApp') && appCode.includes('initApp') }
];

jsChecks.forEach(check => {
  if (check.test()) {
    console.log(`[PASS] JS: ${check.name}`);
  } else {
    console.error(`[FAIL] JS: ${check.name}`);
    allPassed = false;
  }
});

console.log('--- Resumen Final ---');
if (allPassed) {
  console.log('TODAS LAS PRUEBAS DE C-01 (Y AJUSTES DE AUDITORÍA) PASARON CON ÉXITO (PASS)');
  process.exit(0);
} else {
  console.error('ALGUNAS PRUEBAS FALLARON');
  process.exit(1);
}
