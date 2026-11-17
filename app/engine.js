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
    this.licoes = (licoes || []).map(l => Object.assign({ _ai: true }, l.conteudo, { id: 'AI-' + l.id, criado_em: l.criado_em, para_dia: l.para_dia }));
    this.index();
  }
  const E = Engine.prototype;

  E.base = function (p) { return !p || /^(https?:|data:|blob:)/.test(p) ? p : `pacotes/${this.pack}/${p}`; };

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
    this.licoes.forEach(l => { add(l.questions); (l.pages || [l.passage && l.passage.text]).forEach(words); (l.palavras || []).forEach(w => defs[String(w.w).toLowerCase()] = w.def); });
    Object.entries(this.prog.wordbank).forEach(([w, x]) => { if (x && x.def) defs[w.toLowerCase()] = defs[w.toLowerCase()] || x.def; });
  };

  E.question = function (qid) {
    if (!qid) return null;
    if (this.Q[qid]) return this.Q[qid];
    if (qid.startsWith('G:') && window.QGEN) { const q = window.QGEN.genFromId(qid); if (q) return (this.Q[qid] = q); }
    if (qid.startsWith('WB:')) return this.wordQ(qid.slice(3));
    return null;
  };

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
    if (it.kind === 'module') return { id: it.id, kind: 'module', title: it.title, icon: it.icon, pages: it.pages && it.pages[0] ? it.pages : [it.text || ''], audio: this.base(it.audio), image: this.base(it.image), aloud: [1], checks: it.checks || [], questions: it.questions || [] };
    if (it.kind === 'corner') return { id: it.id, kind: 'corner', title: it.title, icon: it.icon, pages: pagesOf(it.passage.text), aloud: [1], checks: [], questions: it.questions || [] };
    return { id: it.id, kind: 'lesson', title: (it.passage && it.passage.title) || it.title, icon: it.icon, pages: pagesOf(it.passage && it.passage.text), aloud: [1], checks: [], questions: it.questions || [], wordParts: it.passage && it.passage.wordParts };
  };
  E.readingList = function () {
    const d = today(); const list = [];
    this.licoes.slice().sort((a, b) => (b.modo_prova ? 1 : 0) - (a.modo_prova ? 1 : 0) || String(a.criado_em).localeCompare(String(b.criado_em))).forEach(l => list.push(l));
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
    if (aiQs.length && k % 2) { const q = aiQs.find(q => !avoid.includes(q.id) && !(this.prog.seen[q.id] > today())) || null; if (q) return q.id; }
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
    if (window.QGEN && window.QGEN.similarMath) { const id = window.QGEN.similarMath(q); if (id) return id; }
    const pool = (window.POOL || {})[q.skill] || [];
    const alt = shuffle(pool.filter(x => x.id !== q.id && !(this.prog.seen[x.id] > today())))[0];
    if (alt) return alt.id;
    if (q.skill === 'vocab') { const w = shuffle(Object.keys(this.prog.wordbank))[0]; if (w && this.wordQ(w)) return 'WB:' + w; }
    return null;
  };

  /* ---------- correção ---------- */
  const norm = s => String(s ?? '').toLowerCase().replace(/[$€£,]|r\$|cubic|units?|unidades?|cm|m²|m³/g, '').replace(/\s+/g, ' ').trim();
  E.check = function (q, ans) {
    if (q.type === 'mc') return ans === (q.answer || 0);
    if (q.type === 'num') { const a = norm(ans); return (q.answers || [q.answer]).some(x => { const b = norm(x); return a === b || (!isNaN(parseFloat(a)) && parseFloat(a) === parseFloat(b) && /^[\d.\s-]+$/.test(a)); }); }
    if (q.type === 'order') return JSON.stringify(ans) === JSON.stringify(q.items);
    if (q.type === 'sort') return q.items.every((it, i) => ans[i] === it.b);
    if (q.type === 'match') return ans === true;
    if (q.type === 'text') return null;
    return false;
  };
  E.answerText = function (q) {
    if (q.type === 'mc') return q.options[q.answer || 0];
    if (q.type === 'num') return (q.answers || [q.answer])[0];
    if (q.type === 'order') return q.items.join(' → ');
    if (q.type === 'sort') return q.items.map(i => `${i.t} = ${i.b}`).join('; ');
    return '';
  };

  /* ---------- sessão do dia ---------- */
  E.minutesToday = function () { return Math.floor(((this.prog.dias[today()] || {}).seg || 0) / 60); };
  E.goalMin = function () { return Math.max(15, Math.min(60, +this.child.minutos || 20)); };
  E.goalDone = function () { return this.minutesToday() >= this.goalMin(); };

  E.startSession = function (opts) {
    opts = opts || {};
    const goal = this.goalMin() * 60, done = ((this.prog.dias[today()] || {}).seg || 0);
    const P = Object.assign({ leitura: 40, palavras: 25, reforco: 35 }, this.child.pilares || {});
    const tot = P.leitura + P.palavras + P.reforco || 100;
    const left = opts.more ? 10 * 60 : Math.max(5 * 60, goal - done);
    const S = this.s = {
      id: uid(), started: new Date().toISOString(), more: !!opts.more, sec: 0, earned: 0,
      targets: { leitura: left * P.leitura / tot, palavras: left * P.palavras / tot, reforco: left * P.reforco / tot },
      spent: { leitura: 0, palavras: 0, reforco: 0 }, station: opts.more ? 'palavras' : 'leitura',
      queue: [], items: [], used: [], reading: opts.more ? null : (opts.reading || this.nextReading()), readingDone: false, matched: false, pageRec: [], pagesSec: []
    };
    if (S.reading) {
      S.reading.pages.forEach((p, i) => S.queue.push({ kind: 'page', n: i + 1 }));
      const qs = S.reading.questions.filter(q => READ_SKILLS.includes(q.skill) || S.reading.kind === 'ai' && q.pilar === 'leitura');
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
      if (r) { S.queue.push({ kind: 'q', qid: r.qid, source: 'review' }); return true; }
      if (S.reading) {
        const q = S.reading.questions.find(q => !READ_SKILLS.includes(q.skill) && !S.used.includes(q.id) && !(S.reading.kind === 'ai' && q.pilar === 'leitura'));
        if (q) { S.queue.push({ kind: 'q', qid: q.id, source: 'lesson' }); return true; }
      }
      const id = this.practiceQ(S.used);
      if (id && this.question(id)) { S.queue.push({ kind: 'q', qid: id, source: 'extra' }); return true; }
      return false;
    }
    return false;
  };

  /** próximo passo da sessão (ou null = acabou) */
  E.next = function () {
    const S = this.s; const order = ['leitura', 'palavras', 'reforco'];
    for (let guard = 0; guard < 40; guard++) {
      if (S.queue.length) {
        const it = S.queue.shift();
        if (it.kind === 'q') { const q = this.question(it.qid); if (!q) continue; S.used.push(it.qid); return Object.assign({ q, station: S.station }, it); }
        return Object.assign({ station: S.station }, it);
      }
      if (S.station === 'leitura') { S.readingDone = !!S.reading; S.station = 'palavras'; continue; }
      const total = S.targets.leitura + S.targets.palavras + S.targets.reforco;
      if (S.sec >= total && S.items.length >= 3) return null;
      const stationFull = S.spent[S.station] >= S.targets[S.station] + (S.station === 'palavras' ? Math.max(0, S.targets.leitura - S.spent.leitura) : 0);
      if (S.station === 'palavras' && stationFull) { S.station = 'reforco'; continue; }
      if (this.fillStation()) continue;
      const i = order.indexOf(S.station);
      if (i < 2) { S.station = order[i + 1]; continue; }
      return null;
    }
    return null;
  };

  E.tick = function (sec, kind) {
    const S = this.s; if (!S) return; const cap = kind === 'page' ? CAP_PAGE : CAP_Q; sec = Math.min(sec, cap);
    S.sec += sec; S.spent[S.station] = (S.spent[S.station] || 0) + sec;
    const d = today(); const day = this.prog.dias[d] = this.prog.dias[d] || { seg: 0, q: 0, ok: 0 }; day.seg += sec;
    day.pil = day.pil || {}; day.pil[S.station] = (day.pil[S.station] || 0) + sec;
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
    S.items.push(item); S.earned += coins;
    const day = this.prog.dias[today()]; if (day) { day.q++; if (ok) day.ok++; }
    if (q.skill) { const sk = this.prog.skills[q.skill] = this.prog.skills[q.skill] || { run: 0, right: 0, wrong: 0 }; if (ok) { sk.right++; sk.run++; } else if (ok === false) { sk.wrong++; sk.run = 0; } sk.struggling = sk.wrong > 2 && sk.wrong > sk.right / 2; }
    this.prog.seen[q.id] = addDays(today(), 3);
    if (q.id.startsWith('WB:')) this.gradeWord(q.id.slice(3), ok);
    else if (q.id.startsWith('G:word:') && ok) { const w = q.id.slice(7); const W = (window.WORDS || []).find(x => x.w === w); this.prog.wordbank[w.toLowerCase()] = this.prog.wordbank[w.toLowerCase()] || { box: 2, due: addDays(today(), 2), how: 'wordhunt', added: today(), right: 1, wrong: 0, def: W && W.def }; }
    if (ok === false) { this.prog.review = this.prog.review.filter(r => r.qid !== q.id); this.prog.review.push({ due: addDays(today(), 1), qid: q.id }); }
    if (ok && step.source === 'review') this.prog.review = this.prog.review.filter(r => r.qid !== q.id);
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
      id: S.id, crianca_id: this.child.id, licao_id: S.reading ? S.reading.id : 'PRATICA-' + d, tipo: S.more ? 'pratica' : 'daily', pilar: 'misto',
      iniciada_em: S.started, terminada_em: new Date().toISOString(), duracao_seg: Math.round(S.sec), total: S.items.length,
      acertos: S.items.filter(i => i.correct).length, pendentes: S.items.filter(i => i.status === 'pending').length, nota_pct: pct, estrelas: stars,
      itens: S.items, leitura: S.reading ? { titulo: S.reading.title, pages: S.pagesSec, recordings: S.pageRec } : null
    };
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
