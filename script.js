(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- armazenamento seguro ---------- */
  var mem = {};
  function load(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return mem[k] !== undefined ? mem[k] : d; } }
  function save(k, v) { mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ---------- chuva de código ---------- */
  var cv = $("rain"), cx = cv.getContext("2d");
  var glyphs = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEF<>/\\{}[]=+*#$%".split("");
  var fs = 16, cols = 0, drops = [];
  function sizeRain() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(innerWidth / fs);
    drops = [];
    for (var i = 0; i < cols; i++) drops.push(Math.random() * -60);
    cx.fillStyle = "#020a04"; cx.fillRect(0, 0, innerWidth, innerHeight);
  }
  function drawRain() {
    cx.fillStyle = "rgba(2,10,4,0.085)";
    cx.fillRect(0, 0, innerWidth, innerHeight);
    cx.font = fs + "px 'Share Tech Mono', monospace";
    for (var i = 0; i < cols; i++) {
      var ch = glyphs[(Math.random() * glyphs.length) | 0];
      var x = i * fs, y = drops[i] * fs;
      cx.fillStyle = Math.random() > 0.975 ? "#eafff0" : "#00ff66";
      cx.shadowColor = "#00ff66"; cx.shadowBlur = 6;
      cx.fillText(ch, x, y);
      cx.shadowBlur = 0;
      if (y > innerHeight && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.55 + (i % 5) * 0.12;
    }
  }
  sizeRain();
  var rt; addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(sizeRain, 150); });
  if (reduce) { for (var k = 0; k < 90; k++) drawRain(); }
  else { setInterval(drawRain, 45); }

  /* ---------- utilidades ---------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function hash(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rngFrom(seed) { var a = seed; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function fmt(n) { return Number(n).toLocaleString("pt-BR"); }
  function pad(n, l) { n = String(n); while (n.length < (l || 2)) n = "0" + n; return n; }
  function slug(s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "."); }
  function dtime(ts) { var d = new Date(ts); return pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear() + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()); }

  /* ---------- gerador de perfil fictício ---------- */
  var FIRST = ["Carlos","Marina","Rafael","Beatriz","Thiago","Larissa","Gustavo","Camila","Felipe","Juliana","Bruno","Fernanda","Lucas","Patrícia","Diego","Vanessa","Henrique","Aline","Mateus","Renata","Otávio","Isabela","Leandro","Sabrina"];
  var LAST = ["Almeida","Souza","Ferreira","Ribeiro","Carvalho","Nogueira","Barros","Teixeira","Moreira","Cardoso","Azevedo","Monteiro","Pacheco","Araújo","Lacerda","Siqueira","Duarte","Fontes","Queiroz","Vasconcelos"];
  var JOBS = ["Analista de sistemas","Designer gráfico","Professor de matemática","Enfermeiro","Contador","Motorista de aplicativo","Engenheira civil","Corretor de imóveis","Fotógrafo freelancer","Gerente de logística","Desenvolvedora web","Barista"];
  var COMP = ["Nuvem Azul Ltda.","Grupo Horizonte S/A","Studio Pixelar","Clínica Vida Plena","Transportes Rota 9","Mercado Bom Preço","Instituto Aurora","Lumina Tecnologia"];
  var CITIES = [["São Paulo","SP","-23.5505","-46.6333","11"],["Rio de Janeiro","RJ","-22.9068","-43.1729","21"],["Belo Horizonte","MG","-19.9167","-43.9345","31"],["Curitiba","PR","-25.4284","-49.2733","41"],["Porto Alegre","RS","-30.0346","-51.2177","51"],["Salvador","BA","-12.9777","-38.5016","71"],["Recife","PE","-8.0476","-34.8770","81"],["Fortaleza","CE","-3.7319","-38.5267","85"],["Brasília","DF","-15.7939","-47.8828","61"],["Goiânia","GO","-16.6869","-49.2648","62"]];
  var STREETS = ["Rua das Acácias","Av. Nova Esperança","Rua do Sol Poente","Travessa dos Ipês","Rua Alfa 404","Av. Fictícia","Rua Teste da Silva","Alameda dos Pinhais"];
  var BREACH = [["ShopNova","e-mail, senha (hash), telefone"],["ClubeFit","e-mail, nome, data de nascimento"],["MegaRede Games","usuário, e-mail, IP"],["TravelNest","nome, passaporte (parcial), e-mail"],["StreamKiosk","e-mail, senha (hash), cidade"],["BancoLume (fictício)","nome, e-mail, endereço"],["FotoClique","usuário, e-mail, dispositivos"],["EduPlay","nome, e-mail, escola"]];
  var DEVICES = ["Android 14 · Galaxy-X (fictício)","iPhone 15 · iOS 18","Windows 11 · Chrome 131","macOS 15 · Safari 18","Ubuntu 24.04 · Firefox 133","iPad Air · iPadOS 18"];
  var EVENTS = ["Novo login detectado em rede pública","Perfil social atualizado","E-mail encontrado em coleção de dados","Foto de perfil alterada","Novo domínio registrado em seu nome","Check-in em local público","Senha reutilizada em 3 serviços","Conta antiga reativada","Mudança de número de telefone","Menção em fórum público"];

  function classify(q) {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(q)) return "email";
    var digits = q.replace(/\D/g, "");
    if (digits.length >= 8 && /^[\d\s()+\-.]+$/.test(q)) return "telefone";
    if (/^@/.test(q) || (!/\s/.test(q) && /[_\d.]/.test(q))) return "usuário";
    return "nome";
  }
  var TYPE_LABEL = { email: "E-mail", telefone: "Telefone", "usuário": "Usuário", nome: "Nome" };

  function generate(q) {
    var r = rngFrom(hash(q.toLowerCase().trim()));
    var pick = function (a) { return a[Math.floor(r() * a.length)]; };
    var num = function (n) { var s = ""; for (var i = 0; i < n; i++) s += Math.floor(r() * 10); return s; };
    var type = classify(q);
    var name;
    if (type === "nome") name = q.trim().replace(/\s+/g, " ").replace(/\b([a-zà-ú])/gi, function (m) { return m.toUpperCase(); });
    else name = pick(FIRST) + " " + pick(LAST) + " " + pick(LAST);
    var base = slug(name).replace(/^\.|\.$/g, "");
    var city = pick(CITIES);
    var age = 19 + Math.floor(r() * 44);
    var by = new Date().getFullYear() - age, bm = 1 + Math.floor(r() * 12), bd = 1 + Math.floor(r() * 28);
    var email = type === "email" ? q.trim() : base.split(".").slice(0, 2).join(".") + Math.floor(r() * 90 + 10) + "@" + pick(["exemplo.test", "correio.invalid", "caixa.example"]);
    var handle = type === "usuário" ? q.trim().replace(/^@/, "") : base.split(".")[0] + "_" + Math.floor(r() * 900 + 100);
    var phone;
    if (type === "telefone") phone = q.trim();
    else phone = "(" + city[4] + ") 9" + num(4) + "-" + num(4);
    var phone2 = "(" + city[4] + ") 9" + num(4) + "-" + num(4);

    var ips = [];
    var blocks = ["203.0.113.", "198.51.100.", "192.0.2."];
    for (var i = 0; i < 3; i++) ips.push({ ip: pick(blocks) + (1 + Math.floor(r() * 253)), city: pick(CITIES), when: Math.floor(r() * 40) + 1 });

    var nb = 2 + Math.floor(r() * 3), used = {}, breaches = [];
    while (breaches.length < nb) { var b = pick(BREACH); if (!used[b[0]]) { used[b[0]] = 1; breaches.push({ site: b[0], fields: b[1], year: 2017 + Math.floor(r() * 9) }); } }

    var ev = [], used2 = {};
    while (ev.length < 5) { var e = pick(EVENTS); if (!used2[e]) { used2[e] = 1; ev.push({ txt: e, days: Math.floor(r() * 300) + ev.length * 8 + 1 }); } }
    ev.sort(function (a, b) { return a.days - b.days; });

    var nets = [
      { n: "Instagram", u: "instagram.com/" + handle, f: fmt(Math.floor(r() * 18000) + 120) + " seguidores" },
      { n: "X", u: "x.com/" + handle, f: fmt(Math.floor(r() * 4000) + 40) + " seguidores" },
      { n: "LinkedIn", u: "linkedin.com/in/" + base, f: fmt(Math.floor(r() * 900) + 50) + " conexões" },
      { n: "GitHub", u: "github.com/" + handle, f: Math.floor(r() * 60) + " repositórios" }
    ].filter(function () { return r() > 0.2; });
    if (!nets.length) nets.push({ n: "Instagram", u: "instagram.com/" + handle, f: "1.204 seguidores" });

    var score = Math.min(97, Math.round(18 + breaches.length * 12 + nets.length * 6 + r() * 28));
    var risk = score >= 80 ? ["crit", "CRÍTICO"] : score >= 62 ? ["high", "ALTO"] : score >= 40 ? ["mid", "MÉDIO"] : ["low", "BAIXO"];

    return {
      q: q, type: type, name: name, id: "ALVO-" + num(5), age: age,
      birth: pad(bd) + "/" + pad(bm) + "/" + by,
      cpf: "***." + num(3) + "." + num(3) + "-**",
      mother: pick(FIRST) + " " + pick(LAST),
      job: pick(JOBS), company: pick(COMP),
      addr: pick(STREETS) + ", " + (1 + Math.floor(r() * 1900)) + " · CEP " + num(5) + "-" + num(3),
      city: city, email: email, email2: base.split(".")[0] + num(2) + "@" + pick(["exemplo.test", "caixa.example"]),
      phone: phone, phone2: phone2, handle: handle, ips: ips, breaches: breaches, events: ev, nets: nets,
      devices: [pick(DEVICES), pick(DEVICES)].filter(function (d, i, a) { return a.indexOf(d) === i; }),
      score: score, risk: risk, conf: 70 + Math.floor(r() * 28),
      coords: (parseFloat(city[2]) + (r() - 0.5) * 0.04).toFixed(4) + ", " + (parseFloat(city[3]) + (r() - 0.5) * 0.04).toFixed(4)
    };
  }

  function avatarSvg(seed) {
    var r = rngFrom(seed), w = 38 + Math.floor(r() * 10), hh = 22 + Math.floor(r() * 6);
    var lines = "";
    for (var y = 6; y < 112; y += 6) lines += '<line x1="0" y1="' + y + '" x2="112" y2="' + y + '" stroke="#00ff66" stroke-opacity=".12"/>';
    return '<svg viewBox="0 0 112 112" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Silhueta fictícia"><rect width="112" height="112" fill="#031a0a"/>' + lines +
      '<circle cx="56" cy="42" r="' + hh + '" fill="#00ff66" fill-opacity=".28" stroke="#00ff66"/>' +
      '<path d="M' + (56 - w) + ' 112 Q' + (56 - w) + ' 70 56 70 Q' + (56 + w) + ' 70 ' + (56 + w) + ' 112Z" fill="#00ff66" fill-opacity=".22" stroke="#00ff66"/>' +
      '<path d="M8 22 V8 H22 M90 8 H104 V22 M104 90 V104 H90 M22 104 H8 V90" fill="none" stroke="#00ff66" stroke-width="2"/></svg>';
  }

  function renderResult(d) {
    var rel = function (days) { return days < 1 ? "hoje" : "há " + days + (days === 1 ? " dia" : " dias"); };
    var h = '';
    h += '<div style="border-top:1px dashed var(--line);margin-top:16px;padding-top:16px">';
    h += '<div class="result-head">';
    h += '<div class="avatar">' + avatarSvg(hash(d.q)) + '</div>';
    h += '<div class="ident"><div class="meta">' + d.id + ' · ENTRADA: ' + TYPE_LABEL[d.type].toUpperCase() + ' · CONFIANÇA ' + d.conf + '%</div>';
    h += '<div class="nm">' + esc(d.name) + '</div>';
    h += '<div class="meta">' + d.age + ' anos · ' + esc(d.city[0]) + '/' + d.city[1] + ' · ' + esc(d.job) + '</div></div>';
    h += '<div class="risk ' + d.risk[0] + '"><div class="lbl">Índice de exposição digital</div><div class="val">' + d.score + '<span class="tag">' + d.risk[1] + '</span></div><div class="bar"><i style="width:' + d.score + '%"></i></div></div>';
    h += '</div>';

    h += '<div class="grid">';
    h += '<div class="card"><h3>Dados pessoais</h3><div class="body"><dl class="kv">' +
      '<dt>Nome completo</dt><dd>' + esc(d.name) + '</dd>' +
      '<dt>Nascimento</dt><dd>' + d.birth + '</dd>' +
      '<dt>Documento</dt><dd>' + d.cpf + ' (mascarado)</dd>' +
      '<dt>Mãe</dt><dd>' + esc(d.mother) + '</dd>' +
      '<dt>Profissão</dt><dd>' + esc(d.job) + '</dd>' +
      '<dt>Empresa</dt><dd>' + esc(d.company) + '</dd></dl></div></div>';

    h += '<div class="card"><h3>Contatos</h3><div class="body"><dl class="kv">' +
      '<dt>E-mail principal</dt><dd>' + esc(d.email) + '</dd>' +
      '<dt>E-mail alternativo</dt><dd>' + esc(d.email2) + '</dd>' +
      '<dt>Telefone</dt><dd>' + esc(d.phone) + '</dd>' +
      '<dt>Telefone 2</dt><dd>' + esc(d.phone2) + '</dd>' +
      '<dt>Usuário</dt><dd>@' + esc(d.handle) + '</dd></dl></div></div>';

    h += '<div class="card"><h3>Localização provável</h3><div class="body"><dl class="kv">' +
      '<dt>Endereço</dt><dd>' + esc(d.addr) + '</dd>' +
      '<dt>Cidade</dt><dd>' + esc(d.city[0]) + ' / ' + d.city[1] + '</dd>' +
      '<dt>Coordenadas</dt><dd>' + d.coords + '</dd>' +
      '<dt>Precisão</dt><dd>~' + (40 + d.conf) + ' m</dd></dl></div></div>';

    h += '<div class="card"><h3>Redes sociais (' + d.nets.length + ')</h3><div class="body"><ul class="list">';
    d.nets.forEach(function (n) { h += '<li>' + n.n + ' · ' + esc(n.u) + '<span class="sm">' + esc(n.f) + '</span></li>'; });
    h += '</ul></div></div>';

    h += '<div class="card"><h3>Endereços IP e dispositivos</h3><div class="body"><ul class="list">';
    d.ips.forEach(function (p) { h += '<li>' + p.ip + '<span class="sm">' + esc(p.city[0]) + '/' + p.city[1] + ' · visto ' + rel(p.when) + '</span></li>'; });
    d.devices.forEach(function (v) { h += '<li>' + esc(v) + '</li>'; });
    h += '</ul></div></div>';

    h += '<div class="card"><h3>Vazamentos encontrados (' + d.breaches.length + ')</h3><div class="body"><ul class="list">';
    d.breaches.forEach(function (b) { h += '<li><span class="red">' + esc(b.site) + '</span> · ' + b.year + '<span class="sm">Dados expostos: ' + esc(b.fields) + '</span></li>'; });
    h += '</ul></div></div>';

    h += '<div class="card" style="grid-column:1/-1"><h3>Linha do tempo de atividade</h3><div class="body"><ul class="list tl" style="padding-left:6px">';
    d.events.forEach(function (e) { h += '<li>' + esc(e.txt) + '<span class="sm">' + rel(e.days) + '</span></li>'; });
    h += '</ul></div></div>';
    h += '</div>';

    h += '<div class="actions"><button class="btn" type="button" id="reset">Reiniciar pesquisa</button><span class="sim-note">Perfil 100% fictício, gerado a partir do termo digitado.</span></div>';
    h += '</div>';
    $("result").innerHTML = h;
    $("reset").addEventListener("click", resetSearch);
  }

  /* ---------- varredura ---------- */
  var timers = [], scanning = false, current = null;
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function addLog(txt, cls) { var d = document.createElement("div"); if (cls) d.className = cls; d.textContent = txt; $("log").appendChild(d); $("log").scrollTop = 1e6; }

  function startScan(q) {
    if (scanning) return;
    q = q.trim();
    if (!q) { $("q").focus(); return; }
    scanning = true; clearTimers();
    $("result").innerHTML = ""; $("log").innerHTML = ""; $("scan").hidden = false;
    $("go").disabled = true; $("q").disabled = true;
    var type = classify(q);
    var steps = [
      ["> iniciando módulo de varredura [" + type + "]...", ""],
      ["> resolvendo alvo: " + q, ""],
      ["> consultando 218 fontes abertas (simulado)...", ""],
      ["[ OK ] registros públicos", "ok"],
      ["[ OK ] redes sociais", "ok"],
      ["[ OK ] coleções de vazamentos", "ok"],
      ["[AVISO] correlação cruzada de endereços IP", "warn"],
      ["> compilando relatório...", ""],
      ["[ OK ] varredura concluída", "ok"]
    ];
    var gap = reduce ? 40 : 300;
    steps.forEach(function (s, i) {
      timers.push(setTimeout(function () {
        addLog(s[0], s[1]);
        $("scan-bar").style.width = Math.round(((i + 1) / steps.length) * 100) + "%";
      }, (i + 1) * gap));
    });
    timers.push(setTimeout(function () {
      var d = generate(q); current = d;
      renderResult(d);
      scanning = false; $("q").disabled = false; $("go").disabled = false;
      $("scan").hidden = true; $("scan-bar").style.width = "0";
      addHistory(d); bumpCounters();
      $("result").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }, (steps.length + 1) * gap));
  }

  function resetSearch() {
    clearTimers(); scanning = false; current = null;
    $("result").innerHTML = ""; $("log").innerHTML = ""; $("scan").hidden = true; $("scan-bar").style.width = "0";
    $("q").value = ""; $("q").disabled = false; $("go").disabled = false;
    $("q").focus();
    scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  /* ---------- histórico ---------- */
  var hist = load("ghost_hist", []);
  function addHistory(d) {
    hist.unshift({ q: d.q, type: d.type, name: d.name, score: d.score, risk: d.risk[0], ts: Date.now() });
    hist = hist.slice(0, 50); save("ghost_hist", hist); renderHist();
  }
  function renderHist() {
    $("hist-count").textContent = hist.length;
    $("hist-meta").textContent = hist.length + (hist.length === 1 ? " registro" : " registros");
    $("hist-clear").disabled = !hist.length;
    if (!hist.length) { $("hist-body").innerHTML = '<div class="hist-empty">Nenhuma investigação ainda. Faça uma pesquisa e ela aparece aqui.</div>'; return; }
    var colors = { low: "var(--green)", mid: "var(--warn)", high: "#ff8a3d", crit: "var(--crit)" };
    var h = '<ul class="hist">';
    hist.forEach(function (it, i) {
      h += '<li><div class="q">' + esc(it.q) + '<small>' + TYPE_LABEL[it.type] + ' · alvo: ' + esc(it.name) + '</small></div>' +
        '<span class="when">' + dtime(it.ts) + '</span><span class="sc" style="color:' + colors[it.risk] + '">' + it.score + '</span>' +
        '<button class="btn ghost" type="button" data-open="' + i + '">Abrir</button></li>';
    });
    $("hist-body").innerHTML = h + '</ul>';
  }
  $("hist-body").addEventListener("click", function (e) {
    var b = e.target.closest("[data-open]"); if (!b) return;
    var it = hist[+b.getAttribute("data-open")]; if (!it) return;
    clearTimers(); scanning = false; $("scan").hidden = true;
    $("q").value = it.q; $("q").disabled = false; $("go").disabled = false;
    showTab("search"); current = generate(it.q); renderResult(current);
    $("result").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  });
  $("hist-clear").addEventListener("click", function () {
    if ($("hist-clear").getAttribute("data-armed") !== "1") {
      $("hist-clear").setAttribute("data-armed", "1"); $("hist-clear").textContent = "Confirmar limpeza";
      $("hist-note").textContent = "Clique de novo para apagar tudo.";
      setTimeout(function () { $("hist-clear").removeAttribute("data-armed"); $("hist-clear").textContent = "Limpar histórico"; $("hist-note").textContent = ""; }, 3500);
      return;
    }
    hist = []; save("ghost_hist", hist); renderHist();
    $("hist-clear").removeAttribute("data-armed"); $("hist-clear").textContent = "Limpar histórico"; $("hist-note").textContent = "Histórico apagado.";
  });

  /* ---------- abas ---------- */
  function showTab(t) {
    var s = t === "search";
    $("view-search").hidden = !s; $("view-hist").hidden = s;
    $("tab-search").setAttribute("aria-selected", s); $("tab-hist").setAttribute("aria-selected", !s);
    if (!s) renderHist();
  }
  $("tab-search").addEventListener("click", function () { showTab("search"); });
  $("tab-hist").addEventListener("click", function () { showTab("hist"); });

  $("form").addEventListener("submit", function (e) { e.preventDefault(); startScan($("q").value); });
  $("chips").addEventListener("click", function (e) { var c = e.target.closest("[data-q]"); if (!c) return; $("q").value = c.getAttribute("data-q"); $("q").focus(); });

  /* ---------- estatísticas ---------- */
  var BASE_VISITS = 184302, BASE_INV = 52871;
  var mine = load("ghost_mine", 0);
  var visitsLocal = load("ghost_visits", 0) + 1; save("ghost_visits", visitsLocal);
  var daysLive = Math.floor((Date.now() - Date.UTC(2026, 0, 1)) / 86400000);
  var visits = BASE_VISITS + daysLive * 137 + Math.floor((Date.now() % 86400000) / 4000) + visitsLocal;
  var inv = BASE_INV + daysLive * 41 + Math.floor((Date.now() % 86400000) / 9000) + mine;
  function bumpCounters() { mine++; inv++; save("ghost_mine", mine); paint(); }
  function paint() {
    $("s-visits").textContent = fmt(visits);
    $("s-inv").textContent = fmt(inv);
    $("s-mine").textContent = fmt(mine);
  }
  var online = 212 + Math.floor(Math.random() * 60), dbs = 4812907431, src = 214, lat = 142;
  var nodes = 1286, leaks = 3419, social = 91204, alerts = 37;
  function tick() {
    if (Math.random() > .55) visits += 1 + Math.floor(Math.random() * 2);
    if (Math.random() > .75) inv += 1;
    online = Math.max(150, online + Math.floor(Math.random() * 9) - 4);
    dbs += 800 + Math.floor(Math.random() * 3000);
    src = Math.random() > .93 ? 213 + Math.floor(Math.random() * 5) : src;
    lat = Math.max(80, Math.min(240, lat + Math.floor(Math.random() * 21) - 10));
    if (Math.random() > .85) alerts++;
    social += Math.floor(Math.random() * 12);
    paint();
    $("s-online").textContent = fmt(online);
    $("s-db").textContent = (dbs / 1e9).toFixed(3).replace(".", ",") + " bi";
    $("s-src").textContent = src;
    $("s-lat").textContent = lat + " ms";
    $("n-nodes").textContent = fmt(nodes + Math.floor(Math.random() * 5));
    $("n-leaks").textContent = fmt(leaks); $("n-social").textContent = fmt(social); $("n-alerts").textContent = alerts;
    $("n-sync").textContent = "há " + (1 + Math.floor(Math.random() * 4)) + " s";
  }
  function clock() { var d = new Date(); $("clock").textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()); }
  $("sess").textContent = hash(String(Date.now())).toString(16).slice(0, 4).toUpperCase();

  /* ---------- feed ao vivo ---------- */
  var FEED = [
    function () { return "<b>[IDX]</b> alvo #" + (10000 + Math.floor(Math.random() * 89999)) + " indexado em " + pick(CITIES)[0]; },
    function () { return "<b>[LEAK]</b> coleção \"" + pick(BREACH)[0] + "\" sincronizada"; },
    function () { return "<b>[NET]</b> varredura de " + (12 + Math.floor(Math.random() * 400)) + " perfis concluída"; },
    function () { return "<b>[IP]</b> 203.0.113." + Math.floor(Math.random() * 254) + " correlacionado"; },
    function () { return "<b>[SYS]</b> operador " + hash(String(Math.random())).toString(16).slice(0, 6) + " iniciou consulta"; },
    function () { return "<b>[ALERT]</b> padrão suspeito em fonte #" + (100 + Math.floor(Math.random() * 118)); }
  ];
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function feedLine() {
    var d = document.createElement("div"), t = new Date();
    d.innerHTML = pad(t.getHours()) + ":" + pad(t.getMinutes()) + ":" + pad(t.getSeconds()) + " " + pick(FEED)();
    var f = $("feed"); f.appendChild(d); while (f.children.length > 8) f.removeChild(f.firstChild);
  }
  for (var z = 0; z < 6; z++) feedLine();

  renderHist(); tick(); clock();
  setInterval(clock, 1000);
  setInterval(tick, 2200);
  setInterval(feedLine, 1700);
})();
