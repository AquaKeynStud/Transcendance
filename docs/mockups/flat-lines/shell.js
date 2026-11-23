/* =====================================================================
   Flat lines · comportements communs des maquettes S3-S4.
   - icônes, nav gauche, thème (?theme=light), vues par ancre, barre « Maquette » ;
   - Toast (13), Modal (14) avec piège du focus, Dropdown (15) ;
   - rendu des posts : troncature au budget de 45 % du fil, règle des médias (DESIGN_SYSTEM §4.7) ;
   - J'aime, Republier, menu « … » : Modifier / Supprimer ses posts (POST-06, POST-07) ;
   - fenêtre de rédaction (POST-01, MEDIA-01 à 05), aussi utilisée pour la modification ;
   - bouton d'abonnement (SOC-01 à 04).
   ===================================================================== */
(function () {
  var root = document.documentElement;
  var params = new URLSearchParams(location.search);
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(n) { return n >= 10000 ? (n / 1000).toFixed(0) + ' k' : n >= 1000 ? (n / 1000).toFixed(1).replace('.', ',') + ' k' : String(n); }
  var M = window.Mock = { $: $, $$: $$, esc: esc, fmt: fmt };

  // ---- Icônes (Lucide) -------------------------------------------------
  var ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    msg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/>',
    repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
    reply: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
    film: '<rect x="2" y="2" width="20" height="20" rx="2.18"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    grid: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    blocks: '<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/><path d="M17 3v8M13 7h8"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
    'arrow-left': '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    'user-plus': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
    'user-x': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m17 8 5 5M22 8l-5 5"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    'eye-off': '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    play: '<path d="M7 4v16l13-8z"/>',
    rss: '<path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    zoom: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8 11h6"/>'
  };
  var sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' + Object.keys(ICONS).map(function (k) {
    return '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>';
  }).join('') + '</svg>';
  document.body.insertAdjacentHTML('afterbegin', sprite);
  function icon(name, cls) { return '<svg class="i ' + (cls || 'sm') + '"><use href="#i-' + name + '"/></svg>'; }
  M.icon = icon;

  // ---- Données de la maquette ------------------------------------------
  M.me = { name: 'aboumall', user: 'aboumall', av: 'A', private: true };
  M.users = {
    aboumall: M.me,
    lea_n: { name: 'Léa N.', user: 'lea_n', av: 'LN', online: true, bio: 'Front et design system. Flat lines, toujours.', followsMe: true, rel: 'following' },
    mehdi: { name: 'Mehdi B.', user: 'mehdi', av: 'MB', bio: 'Backend Django, pagination par curseur et café.', followsMe: true, rel: 'none' },
    nora: { name: 'Nora', user: 'nora', av: 'N', private: true, bio: 'WebSocket, Redis, et beaucoup de logs.', rel: 'requested' },
    theok: { name: 'Théo K.', user: 'theok', av: 'TK', bio: 'DevOps · nginx · Vault', rel: 'following' },
    sami: { name: 'Sami M.', user: 'sami', av: 'SM', bio: 'MSW, TanStack Query, tests.', rel: 'none' },
    jade: { name: 'Jade', user: 'jade', av: 'J', online: true, bio: 'RGPD et pages légales.', followsMe: true, rel: 'following' },
    ines: { name: 'Inès R.', user: 'ines', av: 'IR', private: true, bio: 'Photo argentique, trains de nuit.', followsMe: true, rel: 'following' },
    yanis: { name: 'Yanis', user: 'yanis', av: 'Y', bio: 'Étudiant 42 Lyon.', rel: 'none' },
    camille: { name: 'Camille D.', user: 'camille', av: 'CD', private: true, bio: 'Je poste surtout des photos de chats.', rel: 'none' },
    hugo: { name: 'Hugo L.', user: 'hugo', av: 'HL', bio: 'Speedrun, Snake, et le plugin météo.', rel: 'none' }
  };
  M.profileUrl = function (u) { return u === 'aboumall' ? 'profile.html#me' : u === 'nora' ? 'profile.html#private' : u === 'mehdi' ? 'profile.html#user-public' : 'profile.html#user'; };

  // ---- Thème -------------------------------------------------------------
  function setTheme(t) {
    root.dataset.theme = t;
    $$('.theme-toggle').forEach(function (s) { s.setAttribute('aria-checked', String(t === 'dark')); });
  }
  if (params.get('theme') === 'light') root.dataset.theme = 'light';
  try { var av = localStorage.getItem('fl-avatar'); if (av) { root.style.setProperty('--me-img', 'url(' + av + ')'); root.dataset.meImg = '1'; } } catch (e) {}
  document.addEventListener('click', function (e) {
    var s = e.target.closest('.theme-toggle');
    if (s) setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  // ---- Nav gauche (22) ---------------------------------------------------
  M.sidebar = function () {
    var el = $('aside.sidebar');
    if (!el) return;
    var a = el.dataset.active;
    function item(href, ic, label, key, badge) {
      return '<a href="' + href + '"' + (key === a ? ' class="active" aria-current="page"' : '') + (href === '#' ? ' data-soon="' + label + '"' : '') + '>' +
        icon(ic, 'lg') + '<span class="label">' + label + '</span>' + (badge ? '<span class="badge">' + badge + '</span>' : '') + '</a>';
    }
    el.setAttribute('aria-label', 'Navigation principale');
    el.innerHTML = '<a class="brand" href="feed.html"><span class="brand-mark">t</span><span class="brand-name">transcendance</span></a>' +
      '<nav class="nav">' + item('feed.html', 'home', 'Accueil', 'home') + item('feed.html#explore', 'compass', 'Explorer', 'explore') +
      item('#', 'bell', 'Notifications', 'notif', 4) + item('#', 'msg', 'Messages', 'dm', 2) + item('profile.html#me', 'user', 'Profil', 'profile') + '</nav>' +
      '<div class="nav-sep"></div>' +
      '<nav class="nav nav-secondary">' + item('v11.html', 'blocks', 'Plugins', 'plugins') + item('design-system.html', 'grid', 'Design system', 'ds') +
      item('#', 'shield', 'Administration', 'admin') + item('settings.html', 'settings', 'Paramètres', 'settings') + '</nav>' +
      '<div class="spacer"></div>' +
      '<div class="sidebar-foot">' +
      '<button class="btn btn-primary btn-lg btn-block" data-compose>' + icon('plus') + '<span class="label">Publier</span></button>' +
      '<div class="row"><span class="label faint theme-label">' + icon('moon') + 'Thème sombre</span>' +
      '<button class="switch theme-toggle" role="switch" aria-checked="' + (root.dataset.theme === 'dark') + '" aria-label="Thème sombre"></button></div>' +
      '<a class="me" href="profile.html#me"><span class="avatar online" data-me-avatar>A</span><span class="who"><b>aboumall</b><span>@aboumall</span></span></a>' +
      '</div>';
  };
  document.addEventListener('click', function (e) {
    var s = e.target.closest('[data-soon]');
    if (s) { e.preventDefault(); M.toast(s.dataset.soon + ' : maquette prévue au S5 ou après.', 'info'); }
  });

  // ---- Toast (13) ------------------------------------------------------------
  var zone = document.createElement('div');
  zone.className = 'toast-zone';
  zone.setAttribute('role', 'status');
  zone.setAttribute('aria-live', 'polite');
  document.body.appendChild(zone);
  M.toast = function (msg, type, undo) {
    type = type || 'success';
    var t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = '<span class="ico ' + type + '">' + icon(type === 'error' ? 'x' : type === 'info' ? 'info' : 'check', 'xs') + '</span><span>' + msg + '</span>' +
      (undo ? '<button class="undo">Annuler</button>' : '') + '<button class="icon-btn" aria-label="Fermer">' + icon('x', 'xs') + '</button>';
    function close() { t.classList.add('out'); setTimeout(function () { t.remove(); }, 200); }
    t.querySelector('.icon-btn').onclick = close;
    if (undo) t.querySelector('.undo').onclick = function () { undo(); close(); };
    zone.appendChild(t);
    while (zone.children.length > 3) zone.firstChild.remove();
    setTimeout(close, 4000);
  };

  // ---- Modal (14) ------------------------------------------------------------
  var openStack = [];
  M.openModal = function (id, opener) {
    var b = typeof id === 'string' ? document.getElementById(id) : id;
    b.classList.add('show');
    b.setAttribute('aria-hidden', 'false');
    openStack.push({ el: b, opener: opener || document.activeElement });
    var f = b.querySelector('[autofocus], input:not([type=hidden]):not([disabled]), textarea, button:not(.close)');
    setTimeout(function () { if (f) f.focus(); }, 30);
  };
  M.closeModal = function (b) {
    var top = openStack[openStack.length - 1];
    if (!top) return;
    if (b && top.el !== b) return;
    if (top.el.onBeforeClose && top.el.onBeforeClose() === false) return;
    openStack.pop();
    top.el.classList.remove('show');
    top.el.setAttribute('aria-hidden', 'true');
    if (top.opener && document.contains(top.opener)) top.opener.focus({ preventScroll: true });
  };
  M.forceClose = function (b) { if (b) b.onBeforeClose = null; M.closeModal(b); };
  M.closeAll = function () { while (openStack.length) { var t = openStack[openStack.length - 1]; t.el.onBeforeCloseSaved = t.el.onBeforeClose; t.el.onBeforeClose = null; M.closeModal(); t.el.onBeforeClose = t.el.onBeforeCloseSaved; } };
  document.addEventListener('mousedown', function (e) {
    var top = openStack[openStack.length - 1];
    if (top && e.target === top.el) top.el.dataset.down = '1';
  });
  document.addEventListener('click', function (e) {
    var top = openStack[openStack.length - 1];
    if (top && e.target === top.el && top.el.dataset.down) M.closeModal();
    if (top) delete top.el.dataset.down;
    if (e.target.closest('[data-close-modal]')) M.closeModal(e.target.closest('.backdrop'));
  });
  document.addEventListener('keydown', function (e) {
    var top = openStack[openStack.length - 1];
    if (!top) return;
    if (e.key === 'Escape') { if (!$('.menu.show')) { e.preventDefault(); M.closeModal(); } }
    if (e.key === 'Tab') {
      var f = $$('button:not([disabled]), a[href], input:not([disabled]):not([type=hidden]), textarea, select, [tabindex="0"]', top.el)
        .filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Fenêtre de confirmation générique (14 : confirmation / danger)
  document.body.insertAdjacentHTML('beforeend',
    '<div class="backdrop" id="confirm" aria-hidden="true"><div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-text">' +
    '<h2 id="confirm-title" style="font-size:20px"></h2><p class="lead" id="confirm-text"></p>' +
    '<div class="actions"><button class="btn btn-lg btn-block" id="confirm-ok"></button><button class="btn btn-outline btn-lg btn-block" data-close-modal id="confirm-cancel">Annuler</button></div></div></div>');
  M.confirm = function (o) {
    $('#confirm-title').textContent = o.title;
    $('#confirm-text').innerHTML = o.text || '';
    var ok = $('#confirm-ok');
    ok.textContent = o.ok;
    ok.className = 'btn btn-lg btn-block ' + (o.danger ? 'btn-danger' : 'btn-primary');
    $('#confirm-cancel').textContent = o.cancel || 'Annuler';
    ok.onclick = function () { M.closeModal($('#confirm')); o.run(); };
    M.openModal('confirm', o.opener);
    setTimeout(function () { ok.focus(); }, 40);
  };

  // ---- Dropdown (15) -------------------------------------------------------
  var menu = document.createElement('div');
  menu.className = 'menu';
  menu.setAttribute('role', 'menu');
  document.body.appendChild(menu);
  var menuOpener = null;
  M.menu = function (btn, items) {
    if (menuOpener === btn && menu.classList.contains('show')) { closeMenu(); return; }
    menu.innerHTML = '';
    items.forEach(function (it) {
      if (it === '-') { menu.appendChild(document.createElement('hr')); return; }
      var b = document.createElement('button');
      b.setAttribute('role', 'menuitem');
      if (it.danger) b.className = 'danger';
      b.innerHTML = icon(it.icon) + esc(it.label);
      b.onclick = function () { closeMenu(true); it.run(); };
      menu.appendChild(b);
    });
    menu.classList.add('show');
    var r = btn.getBoundingClientRect(), w = menu.offsetWidth, h = menu.offsetHeight;
    var left = Math.min(Math.max(8, r.right - w), innerWidth - w - 8);
    var top = r.bottom + 4 + h > innerHeight - 8 ? r.top - h - 4 : r.bottom + 4;
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
    menuOpener = btn;
    btn.setAttribute('aria-expanded', 'true');
    menu.firstChild.focus();
  };
  function closeMenu(keep) {
    if (!menu.classList.contains('show')) return;
    menu.classList.remove('show');
    if (menuOpener) { menuOpener.setAttribute('aria-expanded', 'false'); if (!keep) menuOpener.focus({ preventScroll: true }); }
    menuOpener = null;
  }
  document.addEventListener('click', function (e) { if (menu.classList.contains('show') && !menu.contains(e.target) && !(menuOpener && menuOpener.contains(e.target))) closeMenu(true); }, true);
  document.addEventListener('keydown', function (e) {
    if (!menu.classList.contains('show')) return;
    var items = $$('button', menu), i = items.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    if (e.key === 'Tab') closeMenu(true);
  });
  window.addEventListener('scroll', function () { closeMenu(true); }, { passive: true });
  window.addEventListener('resize', function () { closeMenu(true); });

  // ---- Vues (ancre de l'URL) et barre « Maquette » -----------------------
  M.views = function (routes, fallback) {
    function show() {
      var name = location.hash.slice(1);
      var r = routes[name] ? name : fallback;
      var route = routes[r];
      M.closeAll();
      closeMenu(true);
      $$('.view').forEach(function (v) { v.classList.toggle('on', v.id === 'v-' + route.view); });
      $$('.mock-bar a[href^="#"]').forEach(function (a) { a.classList.toggle('cur', a.getAttribute('href') === '#' + r); });
      if (!route.keepScroll) window.scrollTo(0, 0);
      if (route.run) route.run();
      M.clampAll();
    }
    window.addEventListener('hashchange', show);
    M.refreshView = show;
    show();
  };
  M.bar = function (links, tip) {
    var pages = [['feed.html', 'Fil'], ['profile.html', 'Profil'], ['settings.html', 'Paramètres'], ['auth.html', 'Connexion'], ['v11.html', 'v11'], ['design-system.html', 'DS']];
    var here = location.pathname.split('/').pop();
    var h = '<b>Maquette</b>' + links.map(function (l) { return '<a href="#' + l[0] + '">' + l[1] + '</a>'; }).join('') +
      '<span class="sep"></span>' + pages.filter(function (p) { return p[0] !== here; }).map(function (p) { return '<a href="' + p[0] + '">' + p[1] + ' ↗</a>'; }).join('') +
      '<button class="hide" aria-label="Réduire la barre">–</button>' + (tip ? '<span class="tip">' + tip + '</span>' : '');
    var nav = document.createElement('nav');
    nav.className = 'mock-bar';
    nav.setAttribute('aria-label', 'Écrans de la maquette');
    nav.innerHTML = h;
    nav.querySelector('.hide').onclick = function () { var m = nav.classList.toggle('min'); this.textContent = m ? '+' : '–'; };
    if (innerWidth <= 720) { nav.classList.add('min'); nav.querySelector('.hide').textContent = '+'; }
    document.body.appendChild(nav);
  };

  // ---- Posts : rendu ---------------------------------------------------------
  M.posts = {};
  var seq = 1000;
  M.linkify = function (s) {
    return esc(s).replace(/@(\w{3,20})/g, function (all, u) {
      return M.users[u] ? '<a href="' + M.profileUrl(u) + '">@' + u + '</a>' : all;
    });
  };
  M.media = function (list) {
    if (!list || !list.length) return '';
    var allLand = list.every(function (m) { return m.o === 'h'; });
    var cls = 'mg n' + list.length + (allLand ? ' land' : '');
    var style = '';
    if (list.length === 1 && !allLand) { cls += ' solo-v'; style = ' style="--ar:' + (list[0].ar || '3:4').replace(':', '/') + '"'; }
    // Tous horizontaux : l'aperçu garde le format du média (un seul) ou 4:3 (plusieurs), sur toute la largeur.
    // Sa hauteur est plafonnée dans clampAll pour que le post tienne dans 65 % du fil.
    if (allLand) { var r = list.length === 1 ? (list[0].ar || '16:9').split(':') : [4, 3]; style = ' style="--ar:' + r[0] + '/' + r[1] + '" data-ar="' + (r[0] / r[1]) + '"'; }
    return '<div class="' + cls + '"' + style + '>' + list.map(function (m) {
      var s = m.src ? ' style="--src:url(' + m.src + ')"' : '';
      return '<div class="m' + (m.src ? ' img' : '') + '"' + s + ' role="img" aria-label="' + (m.type === 'video' ? 'Vidéo' : m.type === 'gif' ? 'GIF' : 'Image') + '">' +
        (m.type === 'video' ? '<span class="play">' + icon('play') + '</span><span class="dur">' + (m.dur || '0:42') + '</span>' :
          '<span class="ratio">' + (m.type === 'gif' ? 'GIF · ' : '') + (m.ar || (m.o === 'h' ? '16:9' : '3:4')) + '</span>') + '</div>';
    }).join('') + '</div>';
  };
  M.renderPost = function (p) {
    if (!p.id) p.id = 'p' + (seq++);
    M.posts[p.id] = p;
    if (p.deleted) return '<article class="post" data-id="' + p.id + '"><div class="post-deleted">' + (p.deleted === 'mod' ? 'Post supprimé par la modération' : 'Post supprimé') + '</div></article>';
    var a = M.users[p.author] || M.me, mine = p.author === 'aboumall';
    var ctx = p.context ? '<div class="post-context">' + icon('repeat') + esc(p.context) + '</div>' :
      p.replyTo ? '<div class="post-context reply">' + icon('reply') + 'En réponse à <a href="' + M.profileUrl(p.replyTo) + '">@' + p.replyTo + '</a></div>' : '';
    var edited = p.edited ? ' · <span class="edited" title="Modifié le ' + p.edited + '">(modifié)</span>' : '';
    var noRepost = a.private && !mine;
    return '<article class="post" data-id="' + p.id + '">' + ctx +
      '<header class="post-head"><a class="avatar' + (a.online ? ' online' : '') + '" href="' + M.profileUrl(a.user) + '" tabindex="-1" aria-hidden="true"' + (mine ? ' data-me-avatar' : '') + '>' + a.av + '</a>' +
      '<div class="who"><a href="' + M.profileUrl(a.user) + '"><b>' + esc(a.name) + '</b></a><span>@' + a.user + (a.private ? ' ' + icon('lock', 'xs') : '') + ' · ' + esc(p.time || 'à l\'instant') + edited + '</span></div>' +
      '<button class="icon-btn more" aria-label="Options du post" aria-haspopup="menu" aria-expanded="false" data-post-menu>' + icon('more') + '</button></header>' +
      (p.title ? '<h3 class="post-title">' + esc(p.title) + '</h3>' : '') +
      (p.text ? '<p class="post-text">' + M.linkify(p.text) + '</p><button class="see-more" hidden aria-expanded="false">Voir plus</button>' : '') +
      M.media(p.media) +
      '<footer class="post-actions">' +
      '<button class="action act-reply" aria-label="Commentaires : ' + (p.r || 0) + '"><span class="ico">' + icon('reply') + '</span>' + fmt(p.r || 0) + '</button>' +
      '<button class="action act-repost' + (p.reposted ? ' on' : '') + '"' + (noRepost ? ' disabled title="Impossible de republier le post d\'un compte privé" style="opacity:.45;cursor:not-allowed"' : '') + ' aria-pressed="' + !!p.reposted + '" aria-label="Republier"><span class="ico">' + icon('repeat') + '</span><span class="n">' + fmt(p.rp || 0) + '</span></button>' +
      '<button class="action act-like' + (p.liked ? ' on' : '') + '" aria-pressed="' + !!p.liked + '" aria-label="J\'aime"><span class="ico">' + icon('heart') + '</span><span class="n">' + fmt(p.l || 0) + '</span></button>' +
      '</footer></article>';
  };
  M.replacePost = function (p) {
    var el = $('.post[data-id="' + p.id + '"]');
    if (!el) return;
    el.outerHTML = M.renderPost(p);
    M.clampAll();
  };

  // Troncature (§4.7) : le post entier tient dans 45 % de la hauteur visible du fil, 3 lignes minimum.
  // Exception : si tous les médias sont horizontaux, le budget passe à 65 % ; l'aperçu prend son format
  // sur toute la largeur, plafonné pour laisser 3 lignes de texte, et le texte prend ce qui reste.
  M.BUDGET = .45; M.BUDGET_LAND = .65;
  M.clampAll = function () {
    var visible = innerHeight - 56;
    $$('.view.on .post, .backdrop.show .post').forEach(function (el) {
      var t = el.querySelector('.post-text'), sm = el.querySelector('.see-more'), mg = el.querySelector('.mg.land');
      if (t && !t.dataset.expanded) { t.classList.remove('clamped'); sm.hidden = true; }
      var lh = t ? parseFloat(getComputedStyle(t).lineHeight) || 22.5 : 22.5;
      var budget = visible * (mg ? M.BUDGET_LAND : M.BUDGET);
      if (mg) {
        mg.style.height = '';
        var natural = mg.clientWidth / parseFloat(mg.dataset.ar);
        var tFull = t && !t.dataset.expanded ? t.offsetHeight : 0;
        var others = el.offsetHeight - mg.offsetHeight - tFull;
        // place gardée pour le texte : sa hauteur réelle, 3 lignes au plus (+ « Voir plus » s'il sera coupé)
        var keep = t ? Math.min(tFull || t.offsetHeight, 3 * lh) + (t.offsetHeight > 3 * lh + 1 ? 24 : 0) : 0;
        var cap = budget - others - keep;
        mg.style.height = Math.round(Math.max(200, Math.min(natural, cap))) + 'px';
      }
      if (!t || t.dataset.expanded) return;
      var full = t.offsetHeight, fixed = el.offsetHeight - full;
      var lines = Math.max(3, Math.floor((budget - fixed - 24) / lh));
      if (full / lh > lines + .5) {
        t.style.setProperty('--lines', lines);
        t.classList.add('clamped');
        sm.hidden = false;
      }
    });
  };
  var rz;
  window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(M.clampAll, 120); });

  // ---- Posts : actions ---------------------------------------------------------
  document.addEventListener('click', function (e) {
    var el = e.target.closest('.post');
    if (!el) return;
    var p = M.posts[el.dataset.id];
    var sm = e.target.closest('.see-more');
    if (sm) { var t = el.querySelector('.post-text'); t.dataset.expanded = '1'; t.classList.remove('clamped'); sm.hidden = true; return; }
    if (!p) return;
    var like = e.target.closest('.act-like'), rep = e.target.closest('.act-repost');
    if (like) {
      p.liked = !p.liked; p.l = (p.l || 0) + (p.liked ? 1 : -1);
      like.classList.toggle('on', p.liked); like.setAttribute('aria-pressed', p.liked); like.querySelector('.n').textContent = fmt(p.l);
      return;
    }
    if (rep) {
      p.reposted = !p.reposted; p.rp = (p.rp || 0) + (p.reposted ? 1 : -1);
      rep.classList.toggle('on', p.reposted); rep.setAttribute('aria-pressed', p.reposted); rep.querySelector('.n').textContent = fmt(p.rp);
      M.toast(p.reposted ? 'Republié sur votre profil' : 'Republication annulée');
      return;
    }
    if (e.target.closest('.act-reply')) { M.toast('Commentaires : voir le panneau de la <a href="v11.html?comments" style="color:inherit">v11</a> (page d\'un post au S5).', 'info'); return; }
    if (e.target.closest('.mg .m')) { M.toast('Plein écran : maquette prévue au S5 (MEDIA-08).', 'info'); return; }
    var mb = e.target.closest('[data-post-menu]');
    if (mb) {
      var a = M.users[p.author];
      if (p.author === 'aboumall') {
        M.menu(mb, [
          { icon: 'pencil', label: 'Modifier', run: function () { M.composer.open({ mode: 'edit', post: p, opener: mb }); } },
          { icon: 'link', label: 'Copier le lien', run: function () { M.toast('Lien copié'); } },
          '-',
          { icon: 'trash', label: 'Supprimer', danger: true, run: function () { M.deletePost(p, mb); } }
        ]);
      } else {
        var following = a.rel === 'following';
        M.menu(mb, [
          { icon: 'link', label: 'Copier le lien', run: function () { M.toast('Lien copié'); } },
          { icon: following ? 'user-x' : 'user-plus', label: (following ? 'Se désabonner de @' : 'S\'abonner à @') + a.user, run: function () {
            a.rel = following ? 'none' : (a.private ? 'requested' : 'following');
            M.toast(following ? 'Vous ne suivez plus @' + a.user : a.private ? 'Demande envoyée à @' + a.user : 'Vous suivez @' + a.user);
          } }
        ]);
      }
    }
  });
  M.deletePost = function (p, opener) {
    M.confirm({
      title: 'Supprimer ce post ?', ok: 'Supprimer', danger: true, opener: opener,
      text: 'Le texte, les médias, les J\'aime et les republications seront supprimés. Les réponses restent visibles, et « Post supprimé » s\'affiche à sa place. C\'est définitif.',
      run: function () { p.deleted = true; M.replacePost(p); M.toast('Post supprimé'); }
    });
  };

  // ---- Bouton d'abonnement (SOC-01 à 04) ------------------------------------
  // data-follow="<user>" ; l'état vient de M.users[user].rel : none | following | requested
  M.followBtn = function (u, size) {
    return '<button class="btn btn-follow ' + (size || '') + '" data-follow="' + u + '"></button>';
  };
  M.paintFollow = function () {
    $$('[data-follow]').forEach(function (b) {
      var u = M.users[b.dataset.follow], r = u.rel;
      b.classList.toggle('btn-primary', r === 'none');
      b.classList.toggle('btn-outline', r !== 'none');
      b.classList.toggle('is-on', r !== 'none');
      b.innerHTML = r === 'following' ? '<span class="main-txt">Abonné</span><span class="alt">Se désabonner</span>' :
        r === 'requested' ? '<span class="main-txt">Demandé</span><span class="alt">Annuler</span>' :
        u.followsMe ? 'Suivre en retour' : 'S\'abonner';
      b.setAttribute('aria-label', r === 'following' ? 'Abonné à @' + u.user + ', cliquer pour se désabonner' : r === 'requested' ? 'Demande envoyée à @' + u.user + ', cliquer pour annuler' : 'S\'abonner à @' + u.user);
    });
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-follow]');
    if (!b) return;
    var u = M.users[b.dataset.follow], prev = u.rel;
    function done(msg) { M.paintFollow(); M.toast(msg); document.dispatchEvent(new CustomEvent('follow-change', { detail: { user: u.user, rel: u.rel, prev: prev } })); }
    if (u.rel === 'none') { u.rel = u.private ? 'requested' : 'following'; done(u.private ? 'Demande envoyée à @' + u.user : 'Vous suivez @' + u.user); }
    else if (u.rel === 'requested') { u.rel = 'none'; done('Demande annulée'); }
    else M.confirm({
      title: 'Se désabonner de @' + u.user + ' ?', ok: 'Se désabonner', danger: true, opener: b,
      text: u.private ? 'Ce compte est privé : vous ne verrez plus ses posts, et il faudra refaire une demande pour le suivre.' :
        u.followsMe ? 'Vous ne serez plus amis : @' + u.user + ' ne verra plus votre statut en ligne, et vous non plus.' : 'Ses posts n\'apparaîtront plus dans votre fil Abonnements.',
      run: function () { u.rel = 'none'; done('Vous ne suivez plus @' + u.user); }
    });
  });

  // ---- Fenêtre de rédaction (21) : nouveau post et modification ------------------
  var LIMITS = { 'image/jpeg': 5, 'image/png': 5, 'image/webp': 5, 'image/gif': 10, 'video/mp4': 50, 'video/webm': 50 };
  document.body.insertAdjacentHTML('beforeend',
    '<div class="backdrop" id="composer" aria-hidden="true"><div class="modal lg" role="dialog" aria-modal="true" aria-labelledby="cp-title">' +
    '<div class="modal-head"><h2 id="cp-title">Nouveau post</h2><button class="icon-btn close" data-close-modal aria-label="Fermer">' + icon('x') + '</button></div>' +
    '<div class="composer"><span class="avatar" data-me-avatar>A</span><div class="fields">' +
    '<label class="field c-title"><span class="sr-only">Titre</span><input id="cp-t" maxlength="120" placeholder="Titre" autocomplete="off"></label>' +
    '<label class="field c-body"><span class="sr-only">Contenu</span><textarea id="cp-b" rows="3" placeholder="Contenu (optionnel)"></textarea></label>' +
    '<div class="composer-help"><span id="cp-help">Titre obligatoire : 3 à 120 caractères.</span><span id="cp-tcount" class="counter"></span></div>' +
    '<div class="alert danger" id="cp-err" hidden>' + icon('alert') + '<div><b id="cp-err-t"></b><span id="cp-err-s"></span></div></div>' +
    '<div class="thumbs" id="cp-thumbs"></div>' +
    '<div class="composer-tools"><input type="file" id="cp-file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm" multiple hidden>' +
    '<button class="icon-btn" id="cp-add" aria-label="Ajouter des images, un GIF ou une vidéo" title="Images, GIF ou vidéo : 4 médias max, ou 1 vidéo">' + icon('image') + '</button>' +
    '<button class="icon-btn" aria-label="Emoji" disabled title="Hors périmètre">' + icon('smile') + '</button>' +
    '<span class="faint" id="cp-mcount" style="font-size:13px;margin-left:6px"></span>' +
    '<div class="end"><span class="counter" id="cp-bcount"></span><span class="ring-count" id="cp-ring" aria-hidden="true"></span>' +
    '<button class="btn btn-primary" id="cp-submit" disabled>Publier</button></div></div>' +
    '<div class="mock-bar" style="position:static;max-width:none;margin-top:var(--space-3)" id="cp-demo"><b>Exemples</b>' +
    '<a href="#" data-demo="h">+ image horizontale</a><a href="#" data-demo="v">+ image verticale</a><a href="#" data-demo="gif">+ GIF</a><a href="#" data-demo="video">+ vidéo</a>' +
    '<a href="#" data-demo="big">fichier trop lourd</a><a href="#" data-demo="type">mauvais format</a><a href="#" data-demo="long">texte long</a></div>' +
    '</div></div></div></div>');
  var cp = { el: $('#composer'), media: [], mode: 'new', post: null, touched: false };
  var T = $('#cp-t'), B = $('#cp-b');
  function autosize() { B.style.height = 'auto'; B.style.height = Math.min(B.scrollHeight, 320) + 'px'; }
  function showErr(t, s) { $('#cp-err-t').textContent = t; $('#cp-err-s').textContent = s || ''; $('#cp-err').hidden = false; }
  function hideErr() { $('#cp-err').hidden = true; }
  function update() {
    var tl = T.value.trim().length, bl = B.value.length;
    var tOk = tl >= 3, bOk = bl <= 500, up = cp.media.some(function (m) { return m.progress < 100; });
    $('#cp-tcount').textContent = T.value.length >= 100 ? T.value.length + ' / 120' : '';
    $('#cp-tcount').className = 'counter' + (T.value.length >= 115 ? ' warn' : '');
    var help = $('#cp-help');
    if (cp.touched && !tOk) { help.textContent = tl ? 'Le titre doit faire au moins 3 caractères.' : 'Le titre est obligatoire.'; help.className = 'error'; }
    else { help.textContent = cp.mode === 'edit' ? 'En modification, on peut changer le titre et le texte, et retirer des médias.' : 'Titre obligatoire : 3 à 120 caractères.'; help.className = ''; }
    var ring = $('#cp-ring'), cnt = $('#cp-bcount');
    ring.style.setProperty('--p', Math.min(100, bl / 5));
    ring.style.setProperty('--c', bl > 500 ? 'var(--danger)' : bl >= 450 ? 'var(--warning)' : 'var(--text-2)');
    cnt.textContent = bl >= 450 ? String(500 - bl) : '';
    cnt.className = 'counter' + (bl > 500 ? ' over' : bl >= 450 ? ' warn' : '');
    ring.style.visibility = bl ? 'visible' : 'hidden';
    var hasVideo = cp.media.some(function (m) { return m.type === 'video'; });
    $('#cp-add').disabled = cp.mode === 'edit' || hasVideo || cp.media.length >= 4;
    $('#cp-add').title = cp.mode === 'edit' ? 'On ne peut pas ajouter de média à un post publié (POST-06)' : hasVideo ? 'Une vidéo est toujours seule' : cp.media.length >= 4 ? '4 médias maximum' : 'Images, GIF ou vidéo : 4 médias max, ou 1 vidéo';
    $('#cp-mcount').textContent = cp.media.length ? (hasVideo ? '1 vidéo' : cp.media.length + ' / 4 médias') : '';
    var changed = cp.mode === 'new' || T.value !== cp.post.title || B.value !== (cp.post.text || '') || cp.media.length !== (cp.post.media || []).length;
    var sub = $('#cp-submit');
    sub.disabled = !tOk || !bOk || up || !changed;
    sub.innerHTML = up ? '<span class="spin sm"></span>Envoi…' : cp.mode === 'edit' ? 'Enregistrer' : 'Publier';
  }
  function thumbs() {
    $('#cp-thumbs').innerHTML = cp.media.map(function (m, i) {
      return '<div class="thumb' + (m.src ? ' img' : '') + (m.progress < 100 ? ' uploading' : '') + '"' + (m.src ? ' style="--src:url(' + m.src + ')"' : '') + '>' +
        '<span class="kind">' + (m.type === 'video' ? 'Vidéo ' + (m.dur || '') : m.type === 'gif' ? 'GIF' : m.o === 'h' ? 'Horizontale' : 'Verticale') + '</span>' +
        (m.progress < 100 ? '<div class="up"><div class="progress" role="progressbar" aria-valuenow="' + m.progress + '" aria-label="Envoi de ' + esc(m.name) + '"><i style="--p:' + m.progress + '%"></i></div></div>' : '') +
        '<button class="rm" data-rm="' + i + '" aria-label="Retirer ' + esc(m.name) + '">' + icon('x') + '</button></div>';
    }).join('');
    update();
  }
  function upload(m) {
    var step = 100 / (m.type === 'video' ? 28 : 12);
    (function tick() {
      if (cp.media.indexOf(m) < 0) return;
      m.progress = Math.min(100, m.progress + step * (0.6 + Math.random() * 0.8));
      var bar = $$('#cp-thumbs .thumb')[cp.media.indexOf(m)];
      if (m.progress >= 100) { thumbs(); return; }
      if (bar) { bar.querySelector('.progress i').style.setProperty('--p', m.progress + '%'); bar.querySelector('.progress').setAttribute('aria-valuenow', Math.round(m.progress)); }
      setTimeout(tick, 110);
    })();
  }
  function addMedia(m) {
    hideErr();
    var hasVideo = cp.media.some(function (x) { return x.type === 'video'; });
    if (m.type === 'video' && cp.media.length) return showErr('Une vidéo doit être seule', 'Retirez les autres médias pour ajouter une vidéo (MEDIA-02).');
    if (hasVideo) return showErr('Une vidéo doit être seule', 'Retirez la vidéo pour ajouter des images.');
    if (cp.media.length >= 4) return showErr('4 médias maximum', '« ' + m.name + ' » n\'a pas été ajouté.');
    m.progress = 0;
    cp.media.push(m);
    thumbs();
    upload(m);
  }
  function addFile(f) {
    var lim = LIMITS[f.type];
    if (!lim) return showErr('Format non accepté : « ' + f.name + ' »', 'Images JPG, PNG ou WEBP, GIF, vidéos MP4 ou WEBM.');
    if (f.size > lim * 1048576) return showErr('Fichier trop lourd : « ' + f.name + ' »', (f.size / 1048576).toFixed(1).replace('.', ',') + ' Mo, la limite est de ' + lim + ' Mo pour ce type de fichier.');
    var url = URL.createObjectURL(f), type = f.type === 'image/gif' ? 'gif' : f.type.indexOf('video') === 0 ? 'video' : 'img';
    if (type === 'video') {
      var v = document.createElement('video');
      v.preload = 'metadata';
      v.onloadedmetadata = function () {
        if (v.duration > 120) return showErr('Vidéo trop longue : « ' + f.name + ' »', 'La limite est de 2 minutes.');
        var s = Math.round(v.duration);
        addMedia({ type: 'video', name: f.name, o: v.videoWidth > v.videoHeight ? 'h' : 'v', ar: v.videoWidth > v.videoHeight ? '16:9' : '9:16', dur: Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') });
      };
      v.onerror = function () { showErr('Vidéo illisible : « ' + f.name + ' »'); };
      v.src = url;
      return;
    }
    var img = new Image();
    img.onload = function () {
      var w = img.naturalWidth, h = img.naturalHeight;
      addMedia({ type: type, name: f.name, src: url, o: w > h ? 'h' : 'v', ar: ratioLabel(w, h) });
    };
    img.onerror = function () { showErr('Image illisible : « ' + f.name + ' »', 'Le fichier ne correspond pas à son extension (le serveur vérifie le vrai type MIME).'); };
    img.src = url;
  }
  function ratioLabel(w, h) {
    var r = w / h, known = [[16, 9], [3, 2], [4, 3], [1, 1], [3, 4], [2, 3], [9, 16], [21, 9]];
    var best = known.reduce(function (a, k) { return Math.abs(k[0] / k[1] - r) < Math.abs(a[0] / a[1] - r) ? k : a; });
    return best[0] + ':' + best[1];
  }
  $('#cp-add').onclick = function () { $('#cp-file').click(); };
  $('#cp-file').onchange = function () { Array.prototype.forEach.call(this.files, addFile); this.value = ''; };
  $('#cp-thumbs').addEventListener('click', function (e) {
    var b = e.target.closest('[data-rm]');
    if (!b) return;
    cp.media.splice(+b.dataset.rm, 1);
    hideErr();
    thumbs();
    $('#cp-add').focus();
  });
  $('#cp-demo').addEventListener('click', function (e) {
    var a = e.target.closest('[data-demo]');
    if (!a) return;
    e.preventDefault();
    var d = a.dataset.demo, n = cp.media.length + 1;
    if (cp.mode === 'edit' && d !== 'long') return showErr('Pas d\'ajout en modification', 'POST-06 : on peut seulement retirer des médias.');
    if (d === 'h') addMedia({ type: 'img', name: 'photo-' + n + '.jpg', o: 'h', ar: '4:3' });
    if (d === 'v') addMedia({ type: 'img', name: 'portrait-' + n + '.jpg', o: 'v', ar: '3:4' });
    if (d === 'gif') addMedia({ type: 'gif', name: 'reaction.gif', o: 'h', ar: '16:9' });
    if (d === 'video') addMedia({ type: 'video', name: 'demo.mp4', o: 'h', ar: '16:9', dur: '1:24' });
    if (d === 'big') showErr('Fichier trop lourd : « vacances.png »', '7,8 Mo, la limite est de 5 Mo pour une image.');
    if (d === 'type') showErr('Format non accepté : « scan.heic »', 'Images JPG, PNG ou WEBP, GIF, vidéos MP4 ou WEBM.');
    if (d === 'long') { B.value = 'Retour d\'expérience après trois semaines de maquettes. '.repeat(9).trim(); autosize(); update(); B.focus(); }
  });
  T.addEventListener('input', update);
  T.addEventListener('blur', function () { if (T.value) { cp.touched = true; update(); } });
  B.addEventListener('input', function () { autosize(); update(); });
  B.addEventListener('keydown', function (e) { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !$('#cp-submit').disabled) $('#cp-submit').click(); });
  cp.el.onBeforeClose = function () {
    var dirty = cp.mode === 'new' ? (T.value.trim() || B.value.trim() || cp.media.length) : !$('#cp-submit').disabled;
    if (!dirty) return true;
    M.confirm({
      title: cp.mode === 'new' ? 'Abandonner ce post ?' : 'Abandonner les modifications ?', ok: 'Abandonner', danger: true, cancel: 'Continuer',
      text: cp.mode === 'new' ? 'Le titre, le texte et les médias ne seront pas gardés.' : 'Le post restera tel qu\'il était.',
      run: function () { M.forceClose(cp.el); cp.el.onBeforeClose = saved; }
    });
    return false;
  };
  var saved = cp.el.onBeforeClose;
  $('#cp-submit').onclick = function () {
    cp.touched = true;
    if (this.disabled) return;
    var now = new Date(), stamp = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) + ' à ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    var media = cp.media.map(function (m) { return { type: m.type, o: m.o, ar: m.ar, src: m.src, dur: m.dur }; });
    if (cp.mode === 'edit') {
      var p = cp.post;
      p.title = T.value.trim(); p.text = B.value.trim(); p.media = media; p.edited = stamp;
      M.forceClose(cp.el); cp.el.onBeforeClose = saved;
      M.replacePost(p);
      M.toast('Post modifié');
    } else {
      var np = { author: 'aboumall', time: 'à l\'instant', title: T.value.trim(), text: B.value.trim(), media: media, r: 0, rp: 0, l: 0 };
      M.forceClose(cp.el); cp.el.onBeforeClose = saved;
      if (M.onPublish) M.onPublish(np);
      else M.toast('Post publié · <a href="profile.html#me" style="color:inherit">voir sur le profil</a>');
    }
  };
  M.composer = {
    open: function (o) {
      o = o || {};
      cp.mode = o.mode || 'new';
      cp.post = o.post || null;
      cp.touched = false;
      hideErr();
      $('#cp-title').textContent = cp.mode === 'edit' ? 'Modifier le post' : 'Nouveau post';
      T.value = cp.post ? cp.post.title || '' : '';
      B.value = cp.post ? cp.post.text || '' : '';
      cp.media = cp.post && cp.post.media ? cp.post.media.map(function (m) { return Object.assign({ name: 'média', progress: 100 }, m); }) : [];
      (o.preset || []).forEach(function (m) { cp.media.push(Object.assign({ progress: 100 }, m)); });
      if (o.title) T.value = o.title;
      if (o.text) B.value = o.text;
      thumbs();
      M.openModal(cp.el, o.opener);
      setTimeout(function () { autosize(); T.focus(); T.setSelectionRange(T.value.length, T.value.length); }, 40);
    }
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-compose]');
    if (b) M.composer.open({ opener: b });
  });

  // ---- Démarrage ----------------------------------------------------------
  M.sidebar();
  document.addEventListener('DOMContentLoaded', function () { M.paintFollow(); });
})();
