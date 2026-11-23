/* =====================================================================
   Panneau de réglages des maquettes flat lines (outil de debug, pas un composant).
   À inclure en fin de page : <script src="debug-panel.js"></script>
   - Contraste global : rapproche ou éloigne toutes les couleurs du fond.
   - Un curseur de luminosité par token, avec les ratios WCAG sur le fond et sur la carte.
   - Rayons, simulation de daltonisme, copie des tokens modifiés en CSS.
   Les réglages sont gardés par thème dans localStorage (clé « fl-debug »).
   Paramètre d'URL : ?debug ouvre le panneau au chargement.
   ===================================================================== */
(function () {
  var root = document.documentElement;
  var KEY = 'fl-debug';

  // Tokens réglables. min = ratio minimal attendu sur le fond et sur la carte (0 = information seulement).
  var GROUPS = [
    { name: 'Surfaces', tokens: [
      { t: '--bg', label: 'Fond de page', min: 0 },
      { t: '--card', label: 'Carte', min: 0 }
    ] },
    { name: 'Lignes', tokens: [
      { t: '--line', label: 'Ligne', min: 0 },
      { t: '--card-line', label: 'Bord de carte', min: 0 },
      { t: '--line-strong', label: 'Bord de champ', min: 3 }
    ] },
    { name: 'Texte', tokens: [
      { t: '--text', label: 'Texte', min: 4.5 },
      { t: '--text-2', label: 'Texte secondaire', min: 4.5 },
      { t: '--text-3', label: 'Texte tertiaire', min: 4.5 }
    ] },
    { name: 'Couleurs', tokens: [
      { t: '--link', label: 'Lien', min: 4.5 },
      { t: '--like', label: "J'aime", min: 4.5 },
      { t: '--repost', label: 'Republier', min: 4.5 },
      { t: '--success', label: 'Succès', min: 4.5 },
      { t: '--danger', label: 'Danger', min: 4.5 },
      { t: '--warning', label: 'Avertissement', min: 4.5 }
    ] }
  ];
  var ALL = [];
  GROUPS.forEach(function (g) { g.tokens.forEach(function (x) { ALL.push(x); }); });

  // ---- Couleurs ----
  function hexToRgb(h) {
    h = h.trim().replace('#', '');
    if (h.length === 3) h = h.replace(/./g, '$&$&');
    var n = parseInt(h.slice(0, 6), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  }
  function rgbToHex(c) { return '#' + c.map(function (v) { return Math.round(v).toString(16).padStart(2, '0'); }).join(''); }
  function rgbToHsl(c) {
    var r = c[0] / 255, g = c[1] / 255, b = c[2] / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, h = 0, s = 0, d = max - min;
    if (d) {
      s = l > .5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h /= 6;
    }
    return [h, s, l * 100];
  }
  function hslToRgb(h, s, l) {
    l /= 100;
    if (!s) return [l * 255, l * 255, l * 255];
    var q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    function f(t) { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < .5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; }
    return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
  }
  function lum(c) {
    var a = c.map(function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
    return .2126 * a[0] + .7152 * a[1] + .0722 * a[2];
  }
  function ratio(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // ---- État : un jeu de réglages par thème ----
  var store = {};
  try { store = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { store = {}; }
  function theme() { return root.dataset.theme || 'dark'; }
  function state() {
    var s = store[theme()] || (store[theme()] = {});
    s.tokens = s.tokens || {};
    if (s.k == null) s.k = 100;
    if (s.radius == null) s.radius = 100;
    return s;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }
  var vision = store.vision || 'none';

  // Valeurs par défaut lues dans la feuille de style (sans les surcharges du panneau).
  var defaults = {}, defRadius = {};
  function readDefaults() {
    ALL.forEach(function (x) { root.style.removeProperty(x.t); });
    ['--well', '--r-sm', '--r-md'].forEach(function (t) { root.style.removeProperty(t); });
    var cs = getComputedStyle(root);
    ALL.forEach(function (x) { defaults[x.t] = rgbToHsl(hexToRgb(cs.getPropertyValue(x.t))); });
    defRadius.sm = parseFloat(cs.getPropertyValue('--r-sm')) || 8;
    defRadius.md = parseFloat(cs.getPropertyValue('--r-md')) || 16;
  }

  // Couleur effective d'un token : sa luminosité (réglée ou d'origine), puis l'écart au fond multiplié par le contraste global.
  function baseL(t) { var s = state(); return s.tokens[t] != null ? s.tokens[t] : defaults[t][2]; }
  function effective(t) {
    var d = defaults[t], bgL = baseL('--bg'), l = baseL(t);
    if (t !== '--bg') l = clamp(bgL + (l - bgL) * state().k / 100, 0, 100);
    return hslToRgb(d[0], d[1], l);
  }
  function changed() {
    var s = state();
    return s.k !== 100 || s.radius !== 100 || Object.keys(s.tokens).length > 0;
  }

  function apply() {
    var s = state(), mod = changed();
    ALL.forEach(function (x) {
      if (mod) root.style.setProperty(x.t, rgbToHex(effective(x.t)));
      else root.style.removeProperty(x.t);
    });
    if (mod) root.style.setProperty('--well', rgbToHex(effective('--bg'))); else root.style.removeProperty('--well');
    if (s.radius !== 100) {
      root.style.setProperty('--r-sm', defRadius.sm * s.radius / 100 + 'px');
      root.style.setProperty('--r-md', defRadius.md * s.radius / 100 + 'px');
    } else { root.style.removeProperty('--r-sm'); root.style.removeProperty('--r-md'); }
    root.style.filter = vision === 'none' ? '' : 'url(#fl-debug-' + vision + ')';
    render();
  }

  // ---- Interface ----
  var css = '' +
    '.fld-toggle{position:fixed;right:16px;bottom:16px;z-index:60;height:32px;padding:0 12px;border-radius:8px;border:1px dashed var(--line-strong);background:var(--bg);color:var(--text-2);font:600 12px/1 var(--font);cursor:pointer;display:flex;align-items:center;gap:6px}' +
    '.fld-toggle:hover{color:var(--text)} .fld-toggle .dot{width:6px;height:6px;border-radius:50%;background:var(--link);display:none} .fld-toggle.mod .dot{display:block}' +
    '.fld{position:fixed;right:16px;bottom:56px;z-index:60;width:360px;max-height:calc(100vh - 80px);overflow:auto;display:none;flex-direction:column;gap:14px;padding:14px 14px 16px;border-radius:12px;border:1px dashed var(--line-strong);background:var(--bg);color:var(--text);font:13px/1.35 var(--font);box-shadow:0 12px 40px rgba(0,0,0,.25);scrollbar-width:thin}' +
    '.fld.open{display:flex} .fld>*{flex-shrink:0}' +
    '.fld h4{margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3)}' +
    '.fld .hd{display:flex;align-items:center;gap:8px} .fld .hd b{font-size:13px;flex:1}' +
    '.fld .row{display:grid;grid-template-columns:16px 1fr auto;align-items:center;gap:4px 8px}' +
    '.fld .sw{width:16px;height:16px;border-radius:4px;border:1px solid var(--line-strong)}' +
    '.fld .nm{display:flex;justify-content:space-between;gap:6px;min-width:0} .fld .nm span:first-child{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.fld .nm code{font:11px ui-monospace,monospace;color:var(--text-3)}' +
    '.fld .rt{font:11px ui-monospace,monospace;color:var(--text-3);white-space:nowrap;text-align:right}' +
    '.fld .rt .ko{color:var(--danger);font-weight:700} .fld .rt .ok{color:var(--text-2)}' +
    '.fld input[type=range]{grid-column:2/4;width:100%;margin:0;accent-color:var(--text)}' +
    '.fld .row.edited .nm span:first-child::after{content:" •";color:var(--link)}' +
    '.fld .ctl{display:grid;grid-template-columns:1fr auto;gap:4px 8px;align-items:center} .fld .ctl input{grid-column:1/3}' +
    '.fld .ctl output{font:11px ui-monospace,monospace;color:var(--text-3)}' +
    '.fld select,.fld button.b{height:30px;border-radius:8px;border:1px solid var(--line-strong);background:transparent;color:var(--text);font:600 12px var(--font);padding:0 10px;cursor:pointer}' +
    '.fld select{width:100%;font-weight:400} .fld select option{background:var(--card);color:var(--text)}' +
    '.fld button.b:hover{background:var(--hover)} .fld .btns{display:flex;gap:8px;flex-wrap:wrap}' +
    '.fld .seg{display:flex;border:1px solid var(--line-strong);border-radius:8px;overflow:hidden} .fld .seg button{flex:1;height:28px;border:0;background:transparent;color:var(--text-2);font:600 12px var(--font);cursor:pointer} .fld .seg button.on{background:var(--text);color:var(--bg)}' +
    '.fld .note{font-size:11px;color:var(--text-3)}' +
    '.fld .x{width:26px;height:26px;border:0;border-radius:50%;background:transparent;color:var(--text-2);cursor:pointer;font-size:16px;line-height:1} .fld .x:hover{background:var(--hover)}' +
    'body.is-guest .fld-toggle{bottom:92px} body.is-guest .fld{bottom:132px;max-height:calc(100vh - 156px)}' +
    '@media (max-width:720px){.fld-toggle,body.is-guest .fld-toggle{top:45%;right:0;bottom:auto;border-radius:8px 0 0 8px;border-right:0}.fld,body.is-guest .fld{top:72px;left:8px;right:8px;bottom:auto;width:auto;max-height:calc(100vh - 184px)}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Filtres de simulation (matrices de Machado et al., 2009, sévérité 1).
  var M = {
    protanopia: '0.152 1.053 -0.205 0 0  0.115 0.786 0.099 0 0  -0.004 -0.048 1.052 0 0  0 0 0 1 0',
    deuteranopia: '0.367 0.861 -0.228 0 0  0.280 0.673 0.047 0 0  -0.012 0.043 0.969 0 0  0 0 0 1 0',
    tritanopia: '1.256 -0.077 -0.179 0 0  -0.078 0.931 0.148 0 0  0.005 0.691 0.304 0 0  0 0 0 1 0',
    grayscale: '0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0'
  };
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.setAttribute('aria-hidden', 'true');
  svg.style.position = 'absolute';
  svg.innerHTML = Object.keys(M).map(function (k) {
    return '<filter id="fl-debug-' + k + '" color-interpolation-filters="linearRGB"><feColorMatrix type="matrix" values="' + M[k] + '"/></filter>';
  }).join('');
  document.body.appendChild(svg);

  var btn = document.createElement('button');
  btn.className = 'fld-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span class="dot"></span>Réglages';
  var panel = document.createElement('aside');
  panel.className = 'fld';
  panel.setAttribute('aria-label', 'Réglages de la maquette');
  document.body.appendChild(panel);
  document.body.appendChild(btn);

  function setOpen(o) {
    panel.classList.toggle('open', o);
    btn.setAttribute('aria-expanded', String(o));
    store.open = o; save();
  }
  btn.addEventListener('click', function () { setOpen(!panel.classList.contains('open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open') && panel.contains(document.activeElement)) { setOpen(false); btn.focus(); } });

  function setTheme(t) {
    if (theme() === t) return;
    var sw = document.querySelector('.theme-toggle');
    if (sw) sw.click(); // garde les interrupteurs de la page synchronisés
    if (theme() !== t) root.dataset.theme = t;
    sync();
  }

  function build() {
    var s = state();
    var h = '<div class="hd"><b>Réglages</b><button class="x" data-close aria-label="Fermer">×</button></div>' +
      '<div class="seg" role="group" aria-label="Thème"><button data-theme-set="dark">Sombre</button><button data-theme-set="light">Clair</button></div>' +
      '<div class="ctl"><label for="fld-k">Contraste global</label><output id="fld-k-out"></output>' +
      '<input id="fld-k" type="range" min="40" max="180" step="1" value="' + s.k + '"></div>' +
      '<p class="note">Écart de chaque couleur avec le fond, en % de l\'écart d\'origine. Le fond lui-même ne bouge pas.</p>';
    GROUPS.forEach(function (g) {
      h += '<h4>' + g.name + '</h4>';
      g.tokens.forEach(function (x) {
        h += '<div class="row" data-row="' + x.t + '"><span class="sw"></span>' +
          '<span class="nm"><span>' + x.label + '</span><code></code></span><span class="rt"></span>' +
          '<input type="range" min="0" max="100" step="0.5" data-tok="' + x.t + '" aria-label="Luminosité : ' + x.label + '"></div>';
      });
    });
    h += '<h4>Autres</h4>' +
      '<div class="ctl"><label for="fld-r">Rayons</label><output id="fld-r-out"></output>' +
      '<input id="fld-r" type="range" min="0" max="200" step="5" value="' + s.radius + '"></div>' +
      '<label for="fld-v">Vision</label><select id="fld-v">' +
      '<option value="none">Normale</option><option value="protanopia">Protanopie (rouge)</option>' +
      '<option value="deuteranopia">Deutéranopie (vert)</option><option value="tritanopia">Tritanopie (bleu)</option>' +
      '<option value="grayscale">Niveaux de gris</option></select>' +
      '<div class="btns"><button class="b" data-reset>Réinitialiser ce thème</button><button class="b" data-copy>Copier le CSS</button></div>' +
      '<p class="note">Ratios : sur le fond · sur la carte. En rouge : sous le minimum attendu (4,5:1 pour le texte et les couleurs, 3:1 pour le bord des champs). Les réglages sont gardés par thème dans ce navigateur.</p>';
    panel.innerHTML = h;

    panel.querySelector('[data-close]').addEventListener('click', function () { setOpen(false); btn.focus(); });
    panel.querySelectorAll('[data-theme-set]').forEach(function (b) {
      b.addEventListener('click', function () { setTheme(b.dataset.themeSet); });
    });
    panel.querySelector('#fld-k').addEventListener('input', function () { state().k = +this.value; save(); apply(); });
    panel.querySelector('#fld-r').addEventListener('input', function () { state().radius = +this.value; save(); apply(); });
    panel.querySelectorAll('[data-tok]').forEach(function (r) {
      r.addEventListener('input', function () {
        var t = r.dataset.tok, v = +r.value;
        if (Math.abs(v - defaults[t][2]) < .25) delete state().tokens[t]; else state().tokens[t] = v;
        save(); apply();
      });
      r.addEventListener('dblclick', function () { delete state().tokens[r.dataset.tok]; save(); apply(); });
    });
    var sel = panel.querySelector('#fld-v');
    sel.value = vision;
    sel.addEventListener('change', function () { vision = store.vision = sel.value; save(); apply(); });
    panel.querySelector('[data-reset]').addEventListener('click', function () { delete store[theme()]; save(); sync(); });
    panel.querySelector('[data-copy]').addEventListener('click', copy);
  }

  function fmt(r) { return r.toFixed(1).replace('.', ','); }
  function render() {
    var s = state(), bg = effective('--bg'), card = effective('--card');
    panel.querySelectorAll('[data-theme-set]').forEach(function (b) { b.classList.toggle('on', b.dataset.themeSet === theme()); });
    panel.querySelector('#fld-k').value = s.k;
    panel.querySelector('#fld-k-out').textContent = s.k + ' %';
    panel.querySelector('#fld-r').value = s.radius;
    panel.querySelector('#fld-r-out').textContent = s.radius + ' % (' + Math.round(defRadius.sm * s.radius / 100) + ' / ' + Math.round(defRadius.md * s.radius / 100) + ' px)';
    ALL.forEach(function (x) {
      var row = panel.querySelector('[data-row="' + x.t + '"]'), c = effective(x.t), hex = rgbToHex(c);
      row.querySelector('.sw').style.background = hex;
      row.querySelector('code').textContent = hex;
      row.querySelector('input').value = baseL(x.t);
      row.classList.toggle('edited', s.tokens[x.t] != null);
      var out;
      if (x.t === '--bg') out = '';
      else if (x.t === '--card') out = 'écart ' + fmt(ratio(c, bg));
      else {
        var a = ratio(c, bg), b = ratio(c, card);
        var cls = function (r) { return x.min && r < x.min ? 'ko' : 'ok'; };
        out = '<span class="' + cls(a) + '">' + fmt(a) + '</span> · <span class="' + cls(b) + '">' + fmt(b) + '</span>';
      }
      row.querySelector('.rt').innerHTML = out;
    });
    btn.classList.toggle('mod', changed() || vision !== 'none');
  }

  function copy() {
    var s = state(), lines = ['[data-theme="' + theme() + '"] {'];
    ALL.forEach(function (x) {
      var hex = rgbToHex(effective(x.t)), orig = rgbToHex(hslToRgb(defaults[x.t][0], defaults[x.t][1], defaults[x.t][2]));
      if (hex !== orig) lines.push('  ' + x.t + ': ' + hex + ';   /* avant ' + orig + ' */');
    });
    if (s.radius !== 100) lines.push('  --r-sm: ' + defRadius.sm * s.radius / 100 + 'px; --r-md: ' + defRadius.md * s.radius / 100 + 'px;');
    lines.push('}');
    var txt = lines.length > 2 ? lines.join('\n') : '/* Aucun token modifié pour le thème ' + theme() + ' */';
    var b = panel.querySelector('[data-copy]');
    function done() { b.textContent = 'Copié'; setTimeout(function () { b.textContent = 'Copier le CSS'; }, 1500); }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(done, fallback); else fallback();
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = txt; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { window.prompt('CSS des tokens modifiés :', txt); }
      ta.remove();
    }
  }

  function sync() { readDefaults(); apply(); }
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  build();
  sync();
  if (store.open || new URLSearchParams(location.search).has('debug')) setOpen(true);
})();
