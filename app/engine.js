/* Quest Kids — motor das lições: 3 pilares (Leitura, Palavras, Reforço), tempo, revisão e moedas */
(function () {
  'use strict';
  const { today, addDays, shuffle, uid } = QK;

  const READ_SKILLS = ['vocab', 'context', 'figurative', 'main_idea', 'evidence', 'inference', 'check', 'leitura', 'interpretacao', 'compreensao'];
  const BOX_DAYS = [0, 1, 2, 4, 7, 14, 30];
  const CAP_Q = 90, CAP_PAGE = 240;           // anti-enrolação: no máximo 90 s por pergunta e 4 min por página contam como tempo
  const PACKS = { 'gabi-en5': ['lessons.js', 'stories.js', 'corner.js', 'modules.js', 'words.js', 'gen.js'] };

  /* ---------- pacote de conteúdo pronto ---------- */
  const loaded = {};
  function loadPack(name) {
    if (!name || !PACKS[name]) return Promise.resolve(false);
    if (loaded[name]) return loaded[name];
    loaded[name] = PACKS[name].reduce((p, f) => p.then(() => new Promise((res, rej) => {
      const s = document.createElement('script'); s.src = `pacotes/${name}/${f}`; s.onload = res; s.onerror = () => rej(new Error('pacote ' + f)); document.head.appendChild(s);
    })), Promise.resolve()).then(() => true);
    return loaded[name];
  }

  function emptyProg() {
    return { v: 2, avatar: '', points: 0, completed: {}, streak: 0, bestStreak: 0, lastDailyDate: null, skills: {}, review: [], wordbank: {}, badges: [], dias: {}, seen: {}, counts: {} };
  }

  /* ---------- Engine por criança ---------- */
  function Engine(child, prog, licoes) {
    this.child = child; this.pack = child.pacote && PACKS[child.pacote] ? child.pacote : null;
    this.prog = Object.assign(emptyProg(), prog || {});
    ['completed', 'skills', 'wordbank', 'dias', 'seen', 'counts'].forEach(k => { if (!this.prog[k] || typeof this.prog[k] !== 'object') this.prog[k] = {}; });
    if (!Array.isArray(this.prog.review)) this.prog.review = [];
    if (!Array.isArray(this.prog.badges)) this.prog.badges = [];
    this.licoes = (licoes || []).filter(l => !l.pausada).map(l => Object.assign({ _ai: true }, l.conteudo, { id: 'AI-' + l.id, criado_em: l.criado_em, para_dia: l.para_dia, foco: !!l.foco }));
    this.index();
  }
  const E = Engine.prototype;

  E.base = function (p) { return !p || /^(https?:|data:|blob:|pacotes\/)/.test(p) ? p : `pacotes/${this.pack}/${p}`; };

  E.index = function () {
    const Q = this.Q = {}; const defs = this.defs = {};
    const add = qs => (qs || []).forEach(q => { if (q && q.id) Q[q.id] = q; });
    const words = txt => String(txt || '').replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (_, w, d) => { defs[w.toLowerCase()] = d; return w; });
    if (this.pack) {
      (window.PLAN || []).forEach(it => { add(it.questions); add(it.checks); (it.pages || []).forEach(words); it.passage && words(it.passage.text); words(it.text); });
      Object.values(window.POOL || {}).forEach(add);
      (window.CORNERS || []).forEach(c => { add(c.questions); words(c.passage && c.passage.text); });
      (window.WORDS || []).forEach(w => { defs[w.w.toLowerCase()] = defs[w.w.toLowerCase()] || w.def; });
    }
    this.defAlts = {};
    this.licoes.forEach(l => { Object.entries(l.defs_alt || {}).forEach(([w, arr]) => { this.defAlts[String(w).toLowerCase()] = [].concat(arr || []); }); add(l.questions); (l.pages || [l.passage && l.passage.text]).forEach(words); (l.palavras || []).forEach(w => defs[String(w.w).toLowerCase()] = w.def); });
    Object.entries(this.prog.wordbank).forEach(([w, x]) => { if (x && x.def) defs[w.toLowerCase()] = defs[w.toLowerCase()] || x.def; });
  };

  E.question = function (qid) {
    if (!qid) return null;
    if (this.Q[qid]) return this.Q[qid];
    if (qid.startsWith('G:') && window.QGEN) { const q = window.QGEN.genFromId(qid); if (q) return (this.Q[qid] = q); }
    if (qid.startsWith('WB:')) return this.wordQ(qid.slice(3));
    if (qid.startsWith('TV:')) { NUMLOC = this.child && this.child.idioma_app === 'en' ? 'en-US' : 'pt-BR'; const [, base, seed] = qid.split(':'); const q = this.Q[base]; const v = q && instantiate(q, +seed); if (v) return (this.Q[qid] = v); }
    return null;
  };

  /* ---------- variações automáticas de perguntas com números ----------
     A IA manda um "modelo": vars {"R":[2000,6000,250]} (mín, máx, passo) e textos com {R} e {=R-G}.
     Cada vez o app sorteia números novos e recalcula a resposta. */
  function rng(seed) { let x = (seed >>> 0) || 1; return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 100000) / 100000; }; }
  function calc(expr, v) {
    const e = String(expr).replace(/[A-Z]\w*/g, k => (k in v ? '(' + v[k] + ')' : 'NaN'));
    if (!/^[\d+\-*/().\s<>=!&|%]+$/.test(e)) return NaN;
    try { return Function('"use strict";return (' + e + ')')(); } catch (x) { return NaN; }
  }
  let NUMLOC = 'pt-BR';
  const fmtN = n => (Math.round(n * 100) / 100).toLocaleString(NUMLOC, { maximumFractionDigits: 2 });
  function instantiate(q, seed) {
    if (!q || !q.vars) return null;
    const r = rng(seed), v = {};
    for (const k in q.vars) { const [a, b, st] = q.vars[k]; const step = st || 1, n = Math.floor((b - a) / step) + 1; v[k] = a + step * Math.floor(r() * Math.max(1, n)); }
    if (q.cond && !calc(q.cond, v)) { const tries = (q._t = (q._t || 0) + 1); if (tries > 40) { q._t = 0; return null; } return instantiate(q, (seed * 7 + 13) % 2147483647); }
    q._t = 0;
    const fill = t => String(t).replace(/\{=([^}]+)\}/g, (_, ex) => fmtN(calc(ex, v))).replace(/\{([A-Z]\w*)\}/g, (_, k) => k in v ? fmtN(v[k]) : _);
    const out = JSON.parse(JSON.stringify(q)); out.id = 'TV:' + q.id + ':' + seed; out.base = q.id;
    out.prompt = fill(q.prompt); if (q.explain) out.explain = fill(q.explain); if (q.hint) out.hint = fill(q.hint);
    if (q.options) out.options = q.options.map(fill);
    if (q.answers) out.answers = q.answers.map(a => fill(a)).concat(q.answers.map(a => fill(a).replace(NUMLOC === 'en-US' ? /,/g : /\./g, '').replace(',', '.')));
    delete out.vars; return out;
  }
  // confere a pergunta antes de mostrar: nada de {X} sobrando, opções vazias ou resposta faltando
  const SOBRA = /\{=?[A-Za-z][^}]*\}/;
  E.problema = function (q) {
    if (!q) return 'vazia';
    const txt = [q.prompt].concat(q.options || [], q.answers || [], q.items || []).map(x => typeof x === 'string' ? x : (x && x.t) || '');
    if (!String(q.prompt || '').trim()) return 'sem_enunciado';
    if (txt.some(t => SOBRA.test(t) || /\bNaN\b|undefined|Infinity/.test(t))) return 'sobrou_variavel';
    if (q.type === 'mc') { if (!Array.isArray(q.options) || q.options.length < 2 || q.options.some(o => !String(o).trim())) return 'opcoes'; if (q.answer != null && !(q.answer >= 0 && q.answer < q.options.length)) return 'resposta'; }
    if (q.type === 'num' && !(q.answers || []).filter(a => String(a).trim()).length) return 'resposta';
    if ((q.type === 'order') && !(q.items || []).length) return 'itens';
    if (q.type === 'sort' && (!(q.items || []).length || !(q.buckets || []).length)) return 'itens';
    return null;
  };
  E.broken = function (q, motivo) { try { this.quebradas = this.quebradas || []; if (!this.quebradas.some(x => x.id === (q.base || q.id))) { this.quebradas.push({ id: q.base || q.id, motivo }); if (typeof this.onBroken === 'function') this.onBroken(q, motivo); } } catch (e) {} };
  // perguntas desativadas (pelos pais ou pela gestão) ou reportadas pela criança
  E.off = function (q) { const id = q.base || q.id; return !!(q.off || (this.Q[id] && this.Q[id].off) || ((this.prog.off || {})[id])); };
  // modo de estudo escolhido pelos pais: 'estudo' (tudo), 'prova' (só o material da prova) ou 'ferias' (temas narrados)
  E.provas = function () { const hoje = today(); return (this._todas || this.licoes).filter(l => l.modo_prova && (!l.data_prova || l.data_prova >= hoje)); };
  E.aplicarModo = function (m) {
    if (this._todas) { this.licoes = this._todas; this._todas = null; }
    const pv = this.provas();
    this.modo = m || (pv.length ? 'prova' : 'estudo');
    if (this.modo === 'prova' && pv.length) { this._todas = this.licoes; this.licoes = pv; }
    this.index();
    return this.modo;
  };
  E.variant = function (q) {
    const base = q.base ? this.Q[q.base] : q;
    if (base && base.vars) { const id = 'TV:' + base.id + ':' + (Date.now() % 1e8 + Math.floor(Math.random() * 1e4)); if (this.question(id)) return id; }
    return null;
  };
  // quantas vezes cada pergunta já apareceu (para não repetir demais)
  E.timesSeen = function (id) { const c = this.prog.qn || {}; return c[(this.Q[id] && this.Q[id].base) || id] || 0; };

  /* ---------- leituras ---------- */
  function pagesOf(text, max) {
    const paras = String(text || '').split(/\n\s*\n/).filter(Boolean); const out = []; let cur = '';
    paras.forEach(p => { const n = (cur + ' ' + p).split(/\s+/).length; if (cur && n > (max || 170)) { out.push(cur.trim()); cur = p; } else cur = cur ? cur + '\n\n' + p : p; });
    if (cur.trim()) out.push(cur.trim()); return out.length ? out : [''];
  }
  E.reading = function (it) {
    if (!it) return null;
    if (it._ai) return { id: it.id, kind: 'ai', title: it.titulo || (it.passage && it.passage.title) || 'Lição', icon: it.icone || '📸', pages: it.pages || pagesOf(it.passage && it.passage.text), aloud: 'all', questions: it.questions || [], checks: [], modoProva: !!it.modo_prova };
    if (it.kind === 'story') return { id: it.id, kind: 'story', title: it.title, icon: it.icon, pages: it.pages, aloud: it.aloud || [], checks: it.checks || [], questions: it.questions || [] };
    if (it.kind === 'module') return { id: it.id, kind: 'module', title: it.title, icon: it.icon, pages: it.pages && it.pages[0] ? it.pages : [it.text || ''], audio: this.base(it.audio), image: this.base(it.image), aloud: it.tema ? [] : [1], checks: it.checks || [], questions: it.questions || [] };
    if (it.kind === 'corner') return { id: it.id, kind: 'corner', title: it.title, icon: it.icon, pages: pagesOf(it.passage.text), aloud: [1], checks: [], questions: it.questions || [] };
    return { id: it.id, kind: 'lesson', title: (it.passage && it.passage.title) || it.title, icon: it.icon, pages: it.passage ? pagesOf(it.passage.text) : [], aloud: it.passage ? [1] : [], checks: [], questions: it.questions || [], wordParts: it.passage && it.passage.wordParts };
  };
  E.readingList = function () {
    const d = today(); const list = [];
    this.licoes.slice().sort((a, b) => (b.foco ? 1 : 0) - (a.foco ? 1 : 0) || (b.modo_prova ? 1 : 0) - (a.modo_prova ? 1 : 0) || String(a.criado_em).localeCompare(String(b.criado_em))).forEach(l => list.push(l));
    if (this.pack) {
      (window.PLAN || []).filter(x => !x.from || x.from <= d).forEach(x => list.push(x));
      (window.CORNERS || []).forEach(x => list.push(x));
    }
    return list;
  };
  E.nextReading = function (skip) {
    const done = this.prog.completed; skip = skip || [];
    return this.reading(this.readingList().find(x => !done[x.id] && !skip.includes(x.id)));
  };
  E.doneReadings = function () { return this.readingList().filter(x => this.prog.completed[x.id]).map(x => this.reading(x)); };

  /* ---------- palavras ---------- */
  E.wordQ = function (w) {
    const def = this.defs[w.toLowerCase()]; if (!def) return null;
    const others = shuffle(Object.entries(this.defs).filter(([k, v]) => k !== w.toLowerCase() && v !== def).map(([, v]) => v)).slice(0, 3);
    if (others.length < 2) return null;
    const pt = this.child.idioma_app === 'pt-BR';
    return { id: 'WB:' + w, skill: 'vocab', type: 'mc', prompt: pt ? `O que significa **${w}**?` : `What does **${w}** mean?`, options: [def].concat(others), answer: 0, explain: `**${w}**: ${def}` };
  };
  E.addWords = function (texts, how) {
    const wb = this.prog.wordbank, d = today(); let n = 0;
    texts.forEach(t => String(t || '').replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (_, w, def) => {
      const k = w.toLowerCase().trim(); if (!wb[k]) { wb[k] = { box: 1, due: addDays(d, 1), how: how || 'lesson', added: d, right: 0, wrong: 0, def }; n++; }
    }));
    return n;
  };
  E.dueWords = function (n) {
    const d = today();
    return Object.entries(this.prog.wordbank).filter(([w, x]) => x.due <= d && this.defs[w]).sort((a, b) => a[1].due.localeCompare(b[1].due)).slice(0, n).map(([w]) => w);
  };
  E.gradeWord = function (w, ok) {
    const x = this.prog.wordbank[w.toLowerCase()]; if (!x) return;
    x.last = today();
    if (ok) { x.right++; x.box = Math.min(6, (x.box || 1) + 1); if (!x.firstRight) x.firstRight = today(); }
    else { x.wrong++; x.box = 1; }
    x.due = addDays(today(), BOX_DAYS[x.box] || 1);
  };

  /* ---------- reforço ---------- */
  E.weakSkills = function () {
    return Object.entries(this.prog.skills).filter(([s]) => !READ_SKILLS.includes(s))
      .sort((a, b) => ((b[1].wrong + 1) / (b[1].right + 2)) - ((a[1].wrong + 1) / (a[1].right + 2))).map(([s]) => s);
  };
  E.practiceQ = function (avoid) {
    const pool = window.POOL || {}; avoid = avoid || [];
    let skills = this.weakSkills(); const all = Object.keys(pool).filter(s => !READ_SKILLS.includes(s));
    skills = skills.concat(all.filter(s => !skills.includes(s)));
    const aiQs = this.licoes.flatMap(l => (l.questions || []).filter(q => !READ_SKILLS.includes(q.skill)));
    const k = (this.prog.counts.practice = (this.prog.counts.practice || 0) + 1);
    if (aiQs.length && k % 2) {
      const fresh = aiQs.filter(q => !avoid.includes(q.id) && !avoid.some(a => a.startsWith('TV:' + q.id + ':')));
      if (fresh.length) { const m = Math.min(...fresh.map(q => this.timesSeen(q.id))); const q = shuffle(fresh.filter(q => this.timesSeen(q.id) === m))[0]; return (q.vars && this.timesSeen(q.id) > 0 && this.variant(q)) || q.id; }
    }
    for (let i = 0; i < skills.length; i++) {
      const s = skills[(i + k) % skills.length];
      if (window.QGEN && window.QGEN.MATH_SKILLS.includes(s) && Math.random() < 0.6) return window.QGEN.mathFor(s, s + Date.now() + Math.random(), (this.prog.skills[s] || {}).run > 3);
      const q = (pool[s] || []).find(q => !avoid.includes(q.id) && !(this.prog.seen[q.id] > today()));
      if (q) return q.id;
    }
    const rest = aiQs.filter(q => !avoid.includes(q.id));
    return rest.length ? shuffle(rest)[0].id : null;
  };
  E.similar = function (q) {
    const vid = this.variant(q); if (vid) return vid;
    if (window.QGEN && window.QGEN.similarMath) { const id = window.QGEN.similarMath(q); if (id) return id; }
    // outra pergunta da mesma matéria feita pela IA (a que apareceu menos vezes)
    const ai = this.licoes.flatMap(l => l.questions || []).filter(x => x.id !== (q.base || q.id) && x.skill === q.skill && !READ_SKILLS.includes(x.skill) && !(this.s && this.s.used.includes(x.id)));
    if (ai.length) { const m = Math.min(...ai.map(x => this.timesSeen(x.id))); const pick = shuffle(ai.filter(x => this.timesSeen(x.id) === m))[0]; return pick.vars ? this.variant(pick) || pick.id : pick.id; }
    const pool = (window.POOL || {})[q.skill] || [];
    const alt = shuffle(pool.filter(x => x.id !== q.id && !(this.prog.seen[x.id] > today())))[0];
    if (alt) return alt.id;
    if (q.skill === 'vocab') { const w = shuffle(Object.keys(this.prog.wordbank))[0]; if (w && this.wordQ(w)) return 'WB:' + w; }
    return null;
  };

  /* ---------- correção ---------- */
  const norm = s => String(s ?? '').toLowerCase().replace(/[$€£,]|r\$|cubic|units?|unidades?|cm|m²|m³/g, '').replace(/\s+/g, ' ').trim();
  // valor de "3/4", "1 3/4", "2" ou "1.5" (frações equivalentes contam como certas)
  function fracVal(x) {
    const t = String(x ?? '').trim(); let m;
    if ((m = t.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/))) return +m[3] ? +m[1] + m[2] / m[3] : null;
    if ((m = t.match(/^(\d+)\s*\/\s*(\d+)$/))) return +m[2] ? m[1] / m[2] : null;
    return null;
  }
  E.check = function (q, ans) {
    if (q.type === 'mc') return ans === (q.answer || 0);
    if (q.type === 'num' && fracVal(ans) !== null && (q.answers || [q.answer]).some(x => fracVal(x) !== null && Math.abs(fracVal(x) - fracVal(ans)) < 1e-9 && /\//.test(String(x)))) return true;
    if (q.type === 'num') { const a = norm(ans); return (q.answers || [q.answer]).some(x => { const b = norm(x); return a === b || (!isNaN(parseFloat(a)) && parseFloat(a) === parseFloat(b) && /^[\d.\s-]+$/.test(a)); }); }
    if (q.type === 'order') return JSON.stringify(ans) === JSON.stringify(q.items);
    if (q.type === 'sort') return q.items.every((it, i) => ans[i] === it.b || ans[i] === q.buckets[it.b]);
    if (q.type === 'match') return ans === true;
    if (q.type === 'text') return null;
    return false;
  };
  E.answerText = function (q) {
    if (q.type === 'mc') return q.options[q.answer || 0];
    if (q.type === 'num') return (q.answers || [q.answer])[0];
    if (q.type === 'order') return q.items.map((t, i) => `${i + 1}. ${t}`).join('\n');
    if (q.type === 'sort') return q.buckets.map((b, k) => `**${b}:** ${q.items.filter(i => i.b === k || i.b === b).map(i => i.t).join(', ')}`).join('\n');
    return '';
  };

  /* ---------- sessão do dia ---------- */
  E.minutesToday = function () { return Math.floor(((this.prog.dias[today()] || {}).seg || 0) / 60); };
  E.goalMin = function () { return Math.max(10, Math.min(60, +this.child.minutos || 15)); };
  /* meta do dia em ATIVIDADES (páginas lidas + perguntas): vale a constância, não o relógio */
  E.goalSteps = function () { return Math.min(40, Math.round(this.goalMin() * 0.6 + 4)); };
  E.stepsToday = function () { const d = this.prog.dias[today()] || {}; return (d.q || 0) + (d.pg || 0); };
  E.goalDone = function () { return this.stepsToday() >= this.goalSteps() || this.minutesToday() >= this.goalMin(); };
  E.dayPct = function () { return Math.min(1, Math.max(this.stepsToday() / this.goalSteps(), this.minutesToday() / this.goalMin())); };

  /* ---------- simulado: N perguntas, sem resposta na hora, nota no fim ---------- */
  E.simPool = function (ids) {
    let ls = this.licoes; if (ids && ids.length) ls = ls.filter(l => ids.includes(l.id) || ids.includes(l.id.replace(/^AI-/, '')));
    let qs = ls.flatMap(l => (l.questions || []).filter(q => q.pilar !== 'leitura' && q.type !== 'text'));
    if (!qs.length) qs = Object.values(window.POOL || {}).flat().filter(q => q.type !== 'text' && !READ_SKILLS.includes(q.skill));
    return qs;
  };
  E.startSim = function (cfg) {
    const pool = shuffle(this.simPool(cfg.licoes)); const n = Math.min(cfg.n || 10, Math.max(pool.length, 0) * 2 || 0);
    const pick = []; for (let i = 0; pick.length < n && i < n * 3; i++) { const q = pool[i % pool.length]; if (!q) break; const id = (q.vars && this.variant(q)) || (i < pool.length ? q.id : null); if (id && !pick.includes(id)) pick.push(id); }
    const S = this.s = { id: uid(), started: new Date().toISOString(), more: false, simulado: Object.assign({}, cfg, { n: pick.length }), sec: 0, earned: 0, cap: pick.length, units: 0, wordsEnd: 0, P: { leitura: 0, palavras: 0, reforco: 100 },
      targets: { leitura: 0, palavras: 0, reforco: 3600 }, spent: { leitura: 0, palavras: 0, reforco: 0 }, station: 'reforco', queue: pick.map(qid => ({ kind: 'q', qid, source: 'simulado' })), items: [], used: [], reading: null, readingDone: false, matched: true, pageRec: [], pagesSec: [] };
    return S;
  };
  // nota estimada (0 a 10) pelos acertos dos últimos dias — é só uma estimativa
  E.estimate = function (days, endOffset) {
    let q = 0, ok = 0; const end = endOffset || 0;
    for (let i = end; i < end + (days || 21); i++) { const x = this.prog.dias[addDays(today(), -i)]; if (x) { q += x.q || 0; ok += x.ok || 0; } }
    const sims = (this.prog.sims || []).filter(s => s.d >= addDays(today(), -(end + (days || 21))) && s.d <= addDays(today(), -end));
    if (q < 5 && !sims.length) return null;
    const base = q ? 10 * ok / q : null, simAvg = sims.length ? sims.reduce((a, s) => a + s.nota, 0) / sims.length : null;
    const v = base === null ? simAvg : simAvg === null ? base : base * 0.5 + simAvg * 0.5;
    return Math.round(v * 10) / 10;
  };
  E.startSession = function (opts) {
    opts = opts || {};
    if (opts.simulado) return this.startSim(opts.simulado);
    const goal = this.goalMin() * 60, done = ((this.prog.dias[today()] || {}).seg || 0);
    const P = Object.assign({ leitura: 40, palavras: 25, reforco: 35 }, this.child.pilares || {});
    const tot = P.leitura + P.palavras + P.reforco || 100;
    const left = opts.more ? 10 * 60 : Math.max(5 * 60, goal - done);
    const cap = opts.more ? 8 : Math.max(6, this.goalSteps() - this.stepsToday());
    const S = this.s = {
      id: uid(), started: new Date().toISOString(), more: !!opts.more, sec: 0, earned: 0, cap, units: 0, wordsEnd: null, P,
      targets: { leitura: left * P.leitura / tot, palavras: left * P.palavras / tot, reforco: left * P.reforco / tot },
      spent: { leitura: 0, palavras: 0, reforco: 0 }, station: opts.more ? 'palavras' : 'leitura',
      queue: [], items: [], used: [], reading: opts.more ? null : (opts.reading || this.nextReading()), readingDone: false, matched: false, pageRec: [], pagesSec: []
    };
    if (S.reading) {
      // temas e leituras de fora do pacote: registra perguntas e palavras
      (S.reading.questions || []).concat(S.reading.checks || []).forEach(q => { if (q && q.id && !this.Q[q.id]) this.Q[q.id] = q; });
      S.reading.pages.forEach(t => String(t || '').replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (_, w, d) => { this.defs[w.toLowerCase()] = this.defs[w.toLowerCase()] || d; }));
      S.reading.pages.forEach((p, i) => S.queue.push({ kind: 'page', n: i + 1 }));
      // lição sem texto (só exercícios de matemática/ciências): todas as perguntas entram na sessão
      const qs = !S.reading.pages.length ? S.reading.questions.slice() : S.reading.questions.filter(q => READ_SKILLS.includes(q.skill) || S.reading.kind === 'ai' && q.pilar === 'leitura');
      (S.reading.checks || []).forEach(q => { const after = Math.min(S.reading.pages.length, q.after || S.reading.pages.length); const i = S.queue.findIndex(x => x.kind === 'page' && x.n === after); S.queue.splice(i + 1, 0, { kind: 'q', qid: q.id, source: 'check' }); });
      qs.forEach(q => S.queue.push({ kind: 'q', qid: q.id, source: 'lesson' }));
      this.addWords(S.reading.pages, 'lesson');
    } else if (!opts.more) S.station = 'palavras';
    return S;
  };

  E.fillStation = function () {
    const S = this.s;
    if (S.station === 'palavras') {
      const due = this.dueWords(8).filter(w => !S.used.includes('WB:' + w));
      if (!S.matched && due.length >= 4) { S.matched = true; const ws = due.slice(0, 4); ws.forEach(w => S.used.push('WB:' + w)); S.queue.push({ kind: 'match', words: ws }); return true; }
      const w = due.find(w => !S.used.includes('WB:' + w));
      if (w && this.wordQ(w)) { S.queue.push({ kind: 'q', qid: 'WB:' + w, source: 'wordrev' }); return true; }
      if (this.pack && window.QGEN && window.WORDS) {
        const n = window.QGEN.dictFor(S.id + S.items.length, 1, Object.keys(this.prog.wordbank))[0];
        if (n && !S.used.includes(n)) { S.queue.push({ kind: 'q', qid: n, source: 'newword' }); return true; }
      }
      return false;
    }
    if (S.station === 'reforco') {
      const d = today();
      const r = this.prog.review.find(x => x.due <= d && !S.used.includes(x.qid) && this.question(x.qid));
      if (r) { const base = this.question(r.qid); S.used.push(r.qid); S.queue.push({ kind: 'q', qid: (base && base.vars && this.variant(base)) || r.qid, source: 'review' }); return true; }
      if (S.reading) {
        const cand = S.reading.questions.filter(q => !READ_SKILLS.includes(q.skill) && !S.used.includes(q.id) && !(S.reading.kind === 'ai' && q.pilar === 'leitura'));
        // perguntas que ela já viu 2+ vezes ficam para depois (ou voltam com números novos)
        const q = cand.find(q => this.timesSeen(q.id) < 2) || (S.reading.kind === 'ai' ? cand.find(q => q.vars) : cand[0]);
        if (q) { S.used.push(q.id); S.queue.push({ kind: 'q', qid: (q.vars && this.timesSeen(q.id) > 0 && this.variant(q)) || q.id, source: 'lesson' }); return true; }
      }
      const id = this.practiceQ(S.used);
      if (id && this.question(id)) { S.queue.push({ kind: 'q', qid: id, source: 'extra' }); return true; }
      return false;
    }
    return false;
  };

  /** próximo passo da sessão (ou null = acabou). A sessão tem um número fixo de atividades (S.cap). */
  E.next = function () {
    const S = this.s; const tot = S.targets.leitura + S.targets.palavras + S.targets.reforco;
    for (let guard = 0; guard < 60; guard++) {
      if (S.queue.length) {
        let it = S.queue.shift();
        // passou do limite: só termina o texto que já começou; perguntas extras ficam para outro dia
        if (S.units >= S.cap && (S.station !== 'leitura' || it.source === 'similar')) continue;
        if (it.kind === 'q') {
          let q = this.question(it.qid); if (!q) continue;
          // pergunta com números variáveis: SEMPRE sorteia (nunca mostra o molde com {X})
          if (q.vars) { const v = this.variant(q); if (!v) { this.broken(q, 'sem_sorteio'); continue; } it = Object.assign({}, it, { qid: v }); q = this.question(v); }
          const prob = this.problema(q); if (prob) { this.broken(q, prob); continue; }
          if (this.off(q)) continue;
          S.used.push(it.qid); S.units++; return Object.assign({ q, station: S.station }, it);
        }
        S.units++; return Object.assign({ station: S.station }, it);
      }
      if (S.station === 'leitura') {
        S.readingDone = !!S.reading; S.station = 'palavras';
        const rest = Math.max(0, S.cap - S.units), pw = S.P.palavras, pr = S.P.reforco;
        S.wordsEnd = S.units + Math.round(rest * (pw + pr ? pw / (pw + pr) : 0.4));
        continue;
      }
      if (S.units >= S.cap || S.simulado) return null;
      if (S.sec >= tot * 1.6 && S.items.length >= 3) return null;      // segurança: nunca muito além do tempo combinado
      if (S.wordsEnd === null) S.wordsEnd = S.units + Math.round((S.cap - S.units) * (S.P.palavras + S.P.reforco ? S.P.palavras / (S.P.palavras + S.P.reforco) : 0.4));
      if (S.station === 'palavras' && S.units >= S.wordsEnd) { S.station = 'reforco'; continue; }
      if (this.fillStation()) continue;
      if (S.station === 'palavras') { S.station = 'reforco'; continue; }
      return null;
    }
    return null;
  };

  E.tick = function (sec, kind) {
    const S = this.s; if (!S) return; const cap = kind === 'page' ? CAP_PAGE : CAP_Q; sec = Math.min(sec, cap);
    S.sec += sec; S.spent[S.station] = (S.spent[S.station] || 0) + sec;
    const d = today(); const day = this.prog.dias[d] = this.prog.dias[d] || { seg: 0, q: 0, ok: 0 }; day.seg += sec;
    day.pil = day.pil || {}; day.pil[S.station] = (day.pil[S.station] || 0) + sec;
    if (kind === 'page') day.pg = (day.pg || 0) + 1;
  };

  /** registra uma resposta; devolve {ok, coins} */
  E.record = function (step, ans, extra) {
    const S = this.s, q = step.q; extra = extra || {};
    const ok = this.check(q, ans);
    const first = !['similar', 'review', 'wordrev', 'extra', 'redo'].includes(step.source);
    const coins = ok === null ? 5 : ok ? (first && !extra.hint ? 10 : 5) : 0;
    const item = { at: new Date().toISOString(), qid: q.id, type: q.type, skill: q.skill, answer: typeof ans === 'number' && q.options ? q.options[ans] : (Array.isArray(ans) ? ans.join(' | ') : String(ans ?? '')), source: step.source, status: ok === null ? 'pending' : 'auto', correct: ok, station: step.station };
    if (extra.hint) item.hint = true;
    if (q.type === 'text') { item.prompt = q.prompt; if (q.rubric) item.rubric = q.rubric; }
    if (S.simulado) { item.prompt = String(q.prompt || '').slice(0, 300); try { item.certa = String(this.answerText(q) || '').slice(0, 200); } catch (e) {} }
    S.items.push(item); S.earned += coins;
    const day = this.prog.dias[today()]; if (day) { day.q++; if (ok) day.ok++; }
    if (q.skill) { const sk = this.prog.skills[q.skill] = this.prog.skills[q.skill] || { run: 0, right: 0, wrong: 0 }; if (ok) { sk.right++; sk.run++; } else if (ok === false) { sk.wrong++; sk.run = 0; } sk.struggling = sk.wrong > 2 && sk.wrong > sk.right / 2; }
    this.prog.seen[q.base || q.id] = addDays(today(), 3);
    const qn = this.prog.qn = this.prog.qn || {}; qn[q.base || q.id] = (qn[q.base || q.id] || 0) + 1;
    if (q.id.startsWith('WB:')) this.gradeWord(q.id.slice(3), ok);
    else if (q.id.startsWith('G:word:') && ok) { const w = q.id.slice(7); const W = (window.WORDS || []).find(x => x.w === w); this.prog.wordbank[w.toLowerCase()] = this.prog.wordbank[w.toLowerCase()] || { box: 2, due: addDays(today(), 2), how: 'wordhunt', added: today(), right: 1, wrong: 0, def: W && W.def }; }
    const rid = q.base || q.id;
    if (ok === false) { this.prog.review = this.prog.review.filter(r => r.qid !== rid); if ((qn[rid] || 0) < 6) this.prog.review.push({ due: addDays(today(), 1), qid: rid }); }
    if (ok && step.source === 'review') this.prog.review = this.prog.review.filter(r => r.qid !== rid);
    return { ok, coins };
  };
  E.recordMatch = function (step, mistakes) {
    const S = this.s; step.words.forEach(w => this.gradeWord(w, mistakes === 0));
    const coins = Math.max(4, 20 - mistakes * 4); S.earned += coins;
    S.items.push({ at: new Date().toISOString(), qid: 'MATCH:' + step.words.join(','), type: 'match', skill: 'vocab', answer: mistakes + ' erros', source: 'match', status: 'auto', correct: mistakes === 0, station: 'palavras' });
    const day = this.prog.dias[today()]; if (day) { day.q++; if (!mistakes) day.ok++; }
    return { ok: mistakes === 0, coins };
  };
  E.queueSimilar = function (q) { const id = this.similar(q); if (id && !this.s.used.includes(id)) this.s.queue.unshift({ kind: 'q', qid: id, source: 'similar' }); return !!id; };

  /** fecha a sessão: atualiza sequência, medalhas e devolve o registro da tentativa */
  E.finish = function (partial) {
    const S = this.s, p = this.prog, d = today();
    const firsts = S.items.filter(i => i.correct !== null && !['similar', 'review', 'wordrev', 'extra'].includes(i.source));
    const graded = S.items.filter(i => i.correct !== null);
    const pct = graded.length ? Math.round(100 * graded.filter(i => i.correct).length / graded.length) : 100;
    const firstPct = firsts.length ? Math.round(100 * firsts.filter(i => i.correct).length / firsts.length) : pct;
    const stars = firstPct >= 95 ? 5 : firstPct >= 85 ? 4 : firstPct >= 70 ? 3 : firstPct >= 50 ? 2 : 1;
    if (!partial && S.reading && S.readingDone && !p.completed[S.reading.id]) p.completed[S.reading.id] = { pct, date: d, stars, attemptId: S.id };
    let bonus = 0;
    if (!partial && this.goalDone() && p.lastDailyDate !== d) {
      p.streak = p.lastDailyDate === addDays(d, -1) || (p.lastDailyDate && p.lastDailyDate >= addDays(d, -3) && new Date().getDay() === 1) ? (p.streak || 0) + 1 : 1;
      p.bestStreak = Math.max(p.bestStreak || 0, p.streak); p.lastDailyDate = d; bonus = 50;
    }
    S.earned += bonus; p.points = (p.points || 0) + S.earned - (S._paid || 0); S._paid = S.earned;
    const m = d.slice(0, 7); p.month = p.month && p.month.key === m ? p.month : { key: m, coins: 0 }; p.month.coins += S.earned - (S._paidM || 0); S._paidM = S.earned;
    const newBadges = [];
    const give = (id, cond) => { if (cond && !p.badges.includes(id)) { p.badges.push(id); newBadges.push(id); } };
    give('first', Object.keys(p.completed).length >= 1); give('perfect', !partial && firstPct === 100 && firsts.length >= 5);
    give('streak3', p.streak >= 3); give('streak7', p.streak >= 7); give('pts100', p.points >= 100); give('pts500', p.points >= 500); give('pts1000', p.points >= 1000);
    give('wordwiz', Object.keys(p.wordbank).length >= 25); give('reader10', Object.keys(p.completed).length >= 10);
    p.savedAt = Date.now();
    const att = {
      id: S.id, crianca_id: this.child.id, licao_id: S.simulado ? 'SIMULADO-' + d : S.reading ? S.reading.id : 'PRATICA-' + d, tipo: S.simulado ? 'simulado' : S.more ? 'pratica' : 'daily', pilar: 'misto',
      iniciada_em: S.started, terminada_em: new Date().toISOString(), duracao_seg: Math.round(S.sec), total: S.items.length,
      acertos: S.items.filter(i => i.correct).length, pendentes: S.items.filter(i => i.status === 'pending').length, nota_pct: pct, estrelas: stars,
      itens: S.items, leitura: S.reading ? { titulo: S.reading.title, pages: S.pagesSec, recordings: S.pageRec, medidor: S.meters || null } : null
    };
    if (S.simulado && !partial) { const nota = graded.length ? Math.round(100 * graded.filter(i => i.correct).length / graded.length) / 10 : 0; att.leitura = { titulo: 'Simulado', simulado: Object.assign({}, S.simulado, { nota, seg: Math.round(S.sec) }) }; p.sims = (p.sims || []).concat({ d, nota, n: graded.length, seg: Math.round(S.sec) }).slice(-30); }
    return { att, pct, firstPct, stars, coins: S.earned, bonus, newBadges, right: graded.filter(i => i.correct).length, total: graded.length };
  };

  Engine.BADGES = {
    first: ['🚀', 'Primeira lição', 'First lesson'], perfect: ['💯', 'Lição perfeita', 'Perfect lesson'], streak3: ['🔥', '3 dias seguidos', '3-day streak'],
    streak7: ['🌟', '7 dias seguidos', '7-day streak'], pts100: ['🪙', '100 moedas', '100 coins'], pts500: ['💰', '500 moedas', '500 coins'],
    pts1000: ['👑', '1000 moedas', '1000 coins'], wordwiz: ['🔤', '25 palavras', '25 words'], reader10: ['📚', '10 leituras', '10 readings'],
    fluent: ['🎙️', 'Leitora fluente', 'Fluent reader'], explorer: ['🧭', 'Exploradora', 'Explorer'], comeback: ['💪', 'Volta por cima', 'Comeback']
  };
  Engine.READ_SKILLS = READ_SKILLS;
  Engine.loadPack = loadPack;
  Engine.emptyProg = emptyProg;
  window.QKEngine = Engine;
})();
