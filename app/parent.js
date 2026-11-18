/* Quest Kids — área dos pais (visual do Stitch "Painel dos pais"): resumo, correções, material, crianças e conta */
(function () {
  'use strict';
  const { t, $, esc, md, today, addDays, toast, Auth, DB, C } = QK;
  const A = () => window.QKApp;
  const pt = () => QK.lang === 'pt';
  const tx = (p, e) => pt() ? p : e;
  const I = (n, c, f) => window.QKApp.I(n, c, f);
  const app = () => $('#app');
  const view = (html, stay) => { const y = window.scrollY; app().innerHTML = html; window.scrollTo(0, stay ? y : 0); };
  let tab = 'resumo', kidSel = null;

  const AVATARES = ['🦄', '🐱', '🐶', '🦊', '🐼', '🐯', '🐸', '🦁', '🐧', '🐙', '🦖', '🚀', '⚽', '🎨', '🌸', '⭐', '🌈', '🐬', '🦋', '🤖'];
  const ESTILOS = () => [['simples', 'Simples', '#14a3a3', '#f7f9ff', '#0f1d29'], ['rosa', 'Rosa', '#e84393', '#fff4f8', '#3d1029'], ['explorador', tx('Explorador', 'Explorer'), '#0f8b7d', '#f7f0e1', '#2d2210'], ['espaco', tx('Espaço', 'Space'), '#8b72f6', '#070b1f', '#e6ebff']];
  const DIAS = () => pt() ? ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const card = 'bg-surface-container-lowest rounded-2xl p-4 md:p-5 shadow-sm';
  const inputCls = 'w-full h-12 px-4 rounded-xl bg-surface-container-lowest border-2 border-surface-container-high focus:border-primary-container focus:outline-none text-body-md text-on-surface placeholder:text-outline';
  const lbl = s => `<span class="block text-label-md text-on-surface mb-1.5 mt-4">${s}</span>`;
  const seg = (items, cur, attr) => `<div class="inline-flex bg-surface-container rounded-full p-1">${items.map(([v, l]) => `<button ${attr}="${v}" class="px-4 py-2 rounded-full text-label-md ${cur === v ? 'bg-primary-container text-on-primary shadow-sm' : 'text-on-surface-variant'}">${l}</button>`).join('')}</div>`;
  const btnP = (id, label, icon, extra) => `<button id="${id}" class="btn3d w-full h-14 rounded-2xl bg-primary-container text-on-primary text-label-lg flex items-center justify-center gap-2 ${extra || ''}">${icon ? I(icon, 'text-[22px]') : ''}<span>${label}</span></button>`;
  const btnS = (id, label, icon) => `<button id="${id}" class="w-full h-12 rounded-2xl bg-surface-container text-on-surface text-label-md flex items-center justify-center gap-2 hover:bg-surface-container-high">${icon ? I(icon, 'text-[20px]') : ''}<span>${label}</span></button>`;

  function shell(inner, bare, stay) {
    A().theme('simples', A().adultTema());
    const tabs = [['resumo', 'dashboard', tx('Resumo', 'Summary')], ['corrigir', 'rate_review', tx('Corrigir', 'Review')], ['material', 'photo_camera', tx('Material', 'Material')], ['criancas', 'face', tx('Crianças', 'Kids')], ['conta', 'settings', tx('Conta', 'Account')]];
    view(`<header class="fixed top-0 inset-x-0 z-40 bg-surface/80 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div class="h-16 px-margin md:px-margin-tablet max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <button id="back" class="${bare ? 'hidden' : ''} flex items-center gap-1 min-h-[44px] px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-primary">${I('arrow_back', 'text-[20px]')}<span class="text-label-sm whitespace-nowrap">${A().ret && A().ret.kid ? tx('Voltar para ', 'Back to ') + esc(A().ret.kid.apelido) : tx('Voltar ao app', 'Back to app')}</span></button>
            <span class="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full">${I('lock', 'text-primary text-[16px]')}<span class="text-label-sm text-primary uppercase">${tx('Pais', 'Parents')}</span></span>
          </div>
          <nav class="hidden lg:flex items-center gap-1">${tabs.map(([k, i, l]) => `<button data-tab="${k}" class="flex items-center gap-1.5 px-3 py-2 rounded-full text-label-md ${tab === k ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'}">${I(i, 'text-[18px]', tab === k)}${l}</button>`).join('')}</nav>
          <div class="flex items-center gap-2 shrink-0">${A().themeSwitch('ptm', A().temaAtual() === 'escuro')}
          <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center">${I('person', 'text-on-primary text-[20px]')}</div></div>
        </div></header>
      <main class="pt-20 pb-32 lg:pb-12 px-margin md:px-margin-tablet max-w-6xl mx-auto">${QK.DEMO ? A().demoBar() : ''}${inner}</main>
      ${bare ? '' : `<nav class="lg:hidden fixed bottom-0 inset-x-0 z-40 pb-safe md:bottom-4 md:px-4"><div class="bg-surface/90 backdrop-blur-xl shadow-[0_-4px_16px_rgba(20,163,163,0.06)] md:shadow-lg md:rounded-3xl md:max-w-xl md:mx-auto grid grid-cols-5 h-20 px-1">
        ${tabs.map(([k, i, l]) => `<button data-tab="${k}" class="flex flex-col items-center justify-center gap-1 ${tab === k ? 'text-primary' : 'text-on-surface-variant'}">${I(i, 'text-[24px]', tab === k)}<span class="text-label-sm">${l}</span></button>`).join('')}</div></nav>`}`, stay);
    $('#back').onclick = () => A().backFromParents();
    $('#ptm').onclick = () => { A().setAdultTema(A().temaAtual() === 'escuro' ? 'claro' : 'escuro'); render(); };
    app().querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { tab = b.dataset.tab; render(); });
  }
  function kidSwitcher(kid) {
    const others = A().kids.filter(k => k.id !== kid.id);
    return `<div class="bg-surface-container-low rounded-xl p-3 flex items-center justify-between gap-3">
      <div class="flex items-center gap-3 min-w-0"><div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-[26px] shadow-sm shrink-0">${esc(kid.avatar)}</div>
        <div class="min-w-0"><span class="text-headline-md text-on-surface truncate block">${esc(kid.apelido)}</span><p class="text-body-sm text-on-surface-variant leading-snug">${[kid.serie, kid.idade ? kid.idade + ' ' + tx('anos', 'yrs') : '', kid.minutos + ' min/' + tx('dia', 'day')].filter(Boolean).join(' • ')}</p></div></div>
      ${others.length ? `<div class="flex gap-1.5">${others.map(k => `<button data-kid="${k.id}" class="w-10 h-10 rounded-full bg-surface-container-lowest shadow-sm text-[22px]" title="${esc(k.apelido)}">${esc(k.avatar)}</button>`).join('')}</div>` : ''}</div>`;
  }
  const wireKidSwitch = () => app().querySelectorAll('[data-kid]').forEach(b => b.onclick = () => { kidSel = b.dataset.kid; render(); });

  async function open() { tab = 'resumo'; await A().loadFamily().catch(() => {}); kidSel = kidSel && A().kids.find(k => k.id === kidSel) ? kidSel : (A().kids[0] || {}).id; render(); }
  function render() {
    shell('<div class="spin" style="margin-top:20vh"></div>');
    ({ resumo, corrigir, material, criancas, conta })[tab]().catch(x => shell(`<div class="${card}"><p class="text-body-md">😕 ${esc(x.message)}</p></div>`));
  }

  /* ================= resumo ================= */
  let periodo = 7, maisGraf = false;
  const DISC = () => tx('Isto é uma estimativa, calculada só com as perguntas que o app criou a partir do material que vocês enviaram. Não é garantia de nota na prova da escola, que pode cobrar outros conteúdos e formatos.', 'This is an estimate, based only on the questions the app created from the material you sent. It does not guarantee a school grade; real tests may cover other content and formats.');
  const fmtN1 = n => n === null || n === undefined ? '—' : (Math.round(n * 10) / 10).toFixed(1).replace('.', pt() ? ',' : '.');
  // métricas de um período [ini, fim]
  function metr(p, ts, ini, fim, goal, steps) {
    const dias = p.dias || {}; let seg = 0, q = 0, ok = 0, pg = 0, studied = 0, goalDays = 0;
    for (let d = ini; d <= fim; d = addDays(d, 1)) { const x = dias[d]; if (!x) continue; seg += x.seg || 0; q += x.q || 0; ok += x.ok || 0; pg += x.pg || 0; if (x.seg) studied++; if ((x.seg || 0) >= goal * 60 || ((x.q || 0) + (x.pg || 0)) >= steps) goalDays++; }
    const words = Object.values(p.wordbank || {}).filter(x => x.added >= ini && x.added <= fim).length;
    const tt = ts.filter(t => String(t.iniciada_em).slice(0, 10) >= ini && String(t.iniciada_em).slice(0, 10) <= fim);
    const recs = tt.flatMap(x => (x.leitura && x.leitura.recordings) || []).filter(r => r.rating);
    const sims = tt.filter(t => t.tipo === 'simulado' && t.leitura && t.leitura.simulado);
    return { min: Math.round(seg / 60), q, ok, acc: q ? Math.round(100 * ok / q) : null, pg, studied, goalDays, words, read: recs.length ? recs.reduce((a, r) => a + r.rating, 0) / recs.length : null, sims: sims.length ? sims.reduce((a, t) => a + t.leitura.simulado.nota, 0) / sims.length : null };
  }
  async function resumo() {
    const kid = A().kids.find(k => k.id === kidSel); if (!kid) return newChild(true);
    const N = periodo, fim = today(), ini = addDays(fim, -(N - 1)), pfim = addDays(ini, -1), pini = addDays(pfim, -(N - 1));
    const [pr, ts, lics, simR] = await Promise.all([DB.sel('progresso', { eq: { crianca_id: kid.id, chave: 'main' } }), DB.sel('tentativas', { eq: { crianca_id: kid.id }, gte: { iniciada_em: addDays(today(), -Math.max(2 * N, 60)) }, order: 'iniciada_em.desc', limit: 500 }), DB.sel('licoes', { eq: { crianca_id: kid.id }, order: 'criado_em.desc', limit: 60 }).catch(() => []), DB.sel('progresso', { eq: { crianca_id: kid.id, chave: 'sim' } }).catch(() => [])]);
    const p = (pr[0] && pr[0].dados) || {}; const dias = p.dias || {}; const goal = kid.minutos || 15, steps = Math.min(40, Math.round(goal * 0.6 + 4));
    const plan = []; for (let d = ini; d <= fim; d = addDays(d, 1)) if ((kid.dias || [1, 2, 3, 4, 5]).includes(new Date(d + 'T12:00').getDay())) plan.push(d);
    const M = metr(p, ts, ini, fim, goal, steps), Pv = metr(p, ts, pini, pfim, goal, steps);
    const E = Object.create(QKEngine.prototype); E.prog = Object.assign({ dias: {}, sims: [] }, p); E.Q = {}; E.child = kid;
    const est = E.estimate(Math.max(14, N)), estPrev = E.estimate(Math.max(14, N), N);
    const sims = ts.filter(t => t.tipo === 'simulado' && t.leitura && t.leitura.simulado).slice(0, 10);
    const pronta = sims.length >= 2 && sims[0].leitura.simulado.nota >= 7 && sims[1].leitura.simulado.nota >= 7;
    const ph = A().wordPhases(p);
    const pend = ts.reduce((s2, x) => s2 + (x.pendentes || 0), 0) + ts.flatMap(x => (x.leitura && x.leitura.recordings) || []).filter(r => !r.rating && !r.apagada).length;
    const skills = Object.entries(p.skills || {}).filter(([, v]) => v.right + v.wrong >= 3).map(([s2, v]) => [s2, Math.round(100 * v.right / (v.right + v.wrong)), v.right + v.wrong]).sort((a, b) => a[1] - b[1]);
    const weak = skills[0], strong = skills.slice().sort((a, b) => b[1] - a[1])[0];
    const nomeP = { 7: tx('semana', 'week'), 30: tx('mês', 'month'), 90: tx('trimestre', 'quarter') }[N];
    const arrow = (a, b2, inv) => a === null || b2 === null || a === b2 ? '' : (a > b2) !== !!inv ? `<span class="text-primary">▲</span>` : `<span class="text-error">▼</span>`;
    const delta = (a, b2, suf) => a === null || b2 === null ? '' : `${a - b2 >= 0 ? '+' : ''}${Math.round((a - b2) * 10) / 10}${suf || ''}`;
    // texto do relatório
    const nm = kid.apelido;
    const texto = [
      tx(`📊 Relatório de ${nm} — ${nomeP} (${fmtD(ini)} a ${fmtD(fim)})`, `📊 ${nm}'s report — ${nomeP} (${fmtD(ini)} to ${fmtD(fim)})`),
      tx(`• Estudou ${M.studied} ${M.studied === 1 ? 'dia' : 'dias'} (${M.goalDays} com a meta completa), ${M.min} min no total${Pv.studied || Pv.min ? ` — antes: ${Pv.studied} dias, ${Pv.min} min` : ''}.`, `• Studied ${M.studied} days (${M.goalDays} with the goal done), ${M.min} min in total${Pv.studied || Pv.min ? ` — before: ${Pv.studied} days, ${Pv.min} min` : ''}.`),
      M.acc !== null ? tx(`• Acertou ${M.acc}% das ${M.q} atividades${Pv.acc !== null ? ` (antes ${Pv.acc}%)` : ''}.`, `• Got ${M.acc}% of ${M.q} activities right${Pv.acc !== null ? ` (before ${Pv.acc}%)` : ''}.`) : '',
      tx(`• Palavras novas: ${M.words}. No total: ${ph.dominadas.length} dominadas, ${ph.desenvolvendo.length} em treino e ${ph.comecando.length} começando.`, `• New words: ${M.words}. Overall: ${ph.dominadas.length} mastered, ${ph.desenvolvendo.length} practicing, ${ph.comecando.length} starting.`),
      M.read !== null ? tx(`• Leitura em voz alta: nota média ${fmtN1(M.read)} de 5.`, `• Reading aloud: average ${fmtN1(M.read)} out of 5.`) : '',
      strong ? tx(`• Indo bem em: ${A().skillInfo(strong[0]).name} (${strong[1]}%).`, `• Doing well in: ${A().skillInfo(strong[0]).name} (${strong[1]}%).`) : '',
      weak && (!strong || weak[0] !== strong[0]) ? tx(`• Para reforçar: ${A().skillInfo(weak[0]).name} (${weak[1]}%).`, `• To reinforce: ${A().skillInfo(weak[0]).name} (${weak[1]}%).`) : '',
      est !== null ? tx(`• Nota estimada: ${fmtN1(est)}/10${estPrev !== null ? ` (antes ${fmtN1(estPrev)})` : ''}. É uma estimativa, não garantia.`, `• Estimated grade: ${fmtN1(est)}/10${estPrev !== null ? ` (before ${fmtN1(estPrev)})` : ''}. An estimate, not a guarantee.`) : '',
      M.studied < plan.length ? tx(`💡 Dica: o que mais ajuda é a constância — um pouco todos os dias combinados.`, `💡 Tip: consistency helps most — a little on every planned day.`) : tx(`🎉 Estudou em todos os dias combinados. Parabéns!`, `🎉 Studied on every planned day. Congrats!`)
    ].filter(Boolean).join('\n');
    // gráficos: palavras acumuladas e acertos por semana (12 semanas)
    const W = []; for (let w = 11; w >= 0; w--) { const we = addDays(today(), -7 * w), ws = addDays(we, -6); const m2 = metr(p, [], ws, we, goal, steps); W.push({ ws, acc: m2.acc, words: Object.values(p.wordbank || {}).filter(x => x.added <= we).length, min: m2.min }); }
    const line = (vals, maxV, color) => { const pts = vals.map((v, i) => v === null ? null : [12 + i * 25, 92 - (v / Math.max(1, maxV)) * 80]).filter(Boolean); return pts.length > 1 ? `<polyline fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" points="${pts.map(x => x.join(',')).join(' ')}"/>${pts.map(x => `<circle cx="${x[0]}" cy="${x[1]}" r="3.5" fill="${color}"/>`).join('')}` : ''; };
    const maxWords = Math.max(5, ...W.map(x => x.words));
    const wl = ['', ...W.map(x => fmtD(x.ws))].slice(1);
    const info = (id, txt) => `<button data-info="${id}" class="w-6 h-6 rounded-full bg-surface-container text-on-surface-variant text-[13px] font-black inline-flex items-center justify-center shrink-0" aria-label="info">i</button><p data-infotxt="${id}" class="hidden col-span-full text-body-sm text-on-surface-variant bg-surface-container-low rounded-xl p-2.5 mt-1">${txt}</p>`;
    const kpi = (id, icon, cls, big, small, cmp, tip) => `<div class="${card} space-y-1.5"><div class="flex items-center justify-between gap-2"><span class="w-9 h-9 rounded-full ${cls} flex items-center justify-center">${I(icon, 'text-[20px]', 1)}</span>${info(id, tip)}</div><div class="flex items-baseline gap-2 flex-wrap"><span class="text-headline-xl-mobile text-on-surface">${big}</span><span class="text-label-sm">${cmp || ''}</span></div><p class="text-body-sm text-on-surface-variant">${small}</p></div>`;
    const tl = A().trialLeft();
    shell(`<div class="space-y-5 max-w-5xl">
      <section class="${card} space-y-3">
        <div class="flex items-center justify-between"><div><p class="text-label-sm text-outline flex items-center gap-1 uppercase tracking-wide">${I('verified_user', 'text-[14px] text-primary')} ${tx('Área dos pais', 'Parents area')}</p><h1 class="text-headline-lg-mobile md:text-headline-lg text-on-surface mt-0.5">${tx('Olá, família', 'Hi, family')} 👋</h1></div></div>
        ${kidSwitcher(kid)}</section>
      ${tl !== null ? `<button id="toplan" class="w-full text-left bg-secondary-fixed text-on-secondary-fixed rounded-2xl p-3.5 flex items-center gap-3">${I('hourglass_top', 'text-[22px]')}<span class="text-label-md flex-1">${tx(`Teste grátis: faltam ${tl} dias.`, `Free trial: ${tl} days left.`)}</span><span class="text-label-md underline">${tx('Ver planos', 'See plans')}</span></button>` : ''}
      ${pend ? `<button data-go="corrigir" class="w-full text-left bg-secondary-fixed/60 text-on-secondary-fixed rounded-2xl p-3.5 flex items-center gap-3">${I('rate_review', 'text-[22px]')}<span class="text-label-md">${pend} ${pend === 1 ? tx('item esperando sua correção', 'item waiting for your review') : tx('itens esperando sua correção', 'items waiting for your review')}</span></button>` : ''}
      <div class="flex items-center justify-between gap-2 flex-wrap"><h2 class="text-headline-md text-on-surface">${tx('Como está indo', 'How it is going')}</h2>${seg([['7', tx('Semana', 'Week')], ['30', tx('Mês', 'Month')], ['90', tx('Trimestre', 'Quarter')]], String(N), 'data-per')}</div>
      <p class="text-body-sm text-on-surface-variant -mt-3">${tx(`Comparando ${fmtD(ini)}–${fmtD(fim)} com o período anterior (${fmtD(pini)}–${fmtD(pfim)}).`, `Comparing ${fmtD(ini)}–${fmtD(fim)} with the previous period (${fmtD(pini)}–${fmtD(pfim)}).`)}</p>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        ${kpi('d', 'calendar_month', 'bg-primary-fixed-dim/20 text-primary', `${M.studied}<span class="text-headline-md text-on-surface-variant">/${plan.length}</span>`, tx('Dias que estudou', 'Days studied'), `${arrow(M.studied, Pv.studied)} ${delta(M.studied, Pv.studied)}`, tx(`Dias com qualquer estudo, de ${plan.length} dias combinados. ${M.goalDays} tiveram a meta completa (${goal} min ou ${steps} atividades).`, `Days with any study, out of ${plan.length} planned. ${M.goalDays} hit the goal (${goal} min or ${steps} activities).`))}
        ${kpi('a', 'target', 'bg-primary/10 text-primary', M.acc === null ? '—' : M.acc + '%', tx('Acertos', 'Accuracy'), `${arrow(M.acc, Pv.acc)} ${delta(M.acc, Pv.acc, ' pts')}`, tx('Porcentagem de atividades certas no período (perguntas, palavras e exercícios).', 'Share of activities answered correctly in the period.'))}
        ${kpi('w', 'spellcheck', 'bg-secondary-container/40 text-on-secondary-container', M.words, tx('Palavras novas', 'New words'), `${arrow(M.words, Pv.words)} ${delta(M.words, Pv.words)}`, tx('Palavras que apareceram pela primeira vez no período. Elas viram "dominadas" quando a criança acerta em dias diferentes.', 'Words met for the first time. They become "mastered" after correct answers on different days.'))}
        ${kpi('n', 'grade', 'bg-tertiary-fixed/40 text-tertiary', fmtN1(est), tx('Nota estimada', 'Estimated grade'), `${arrow(est, estPrev)} ${delta(est, estPrev)}`, DISC())}
      </div>
      <section class="${card} space-y-3"><div class="flex items-center justify-between gap-2 flex-wrap"><h2 class="text-headline-md text-on-surface">📝 ${tx('Resumo para compartilhar', 'Shareable summary')}</h2></div>
        <pre id="rtxt" class="whitespace-pre-wrap font-sans text-body-md text-on-surface bg-surface-container-low rounded-xl p-3">${esc(texto)}</pre>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2"><button id="rcopy" class="h-11 rounded-xl bg-primary-container text-on-primary text-label-md">📋 ${tx('Copiar', 'Copy')}</button><button id="rshare" class="h-11 rounded-xl bg-surface-container text-on-surface text-label-md">💬 ${tx('Compartilhar', 'Share')}</button><button id="rmail" class="h-11 rounded-xl bg-surface-container text-on-surface text-label-md">✉️ E-mail</button><button id="rpdf" class="h-11 rounded-xl bg-surface-container text-on-surface text-label-md">📄 PDF</button></div></section>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section class="${card} space-y-3"><div class="flex items-center justify-between gap-2"><h2 class="text-headline-md text-on-surface">🔤 ${tx('Palavras', 'Words')}</h2>${info('pw', tx('🌱 Começando: viu há pouco. 🌿 Em treino: já acertou algumas vezes. 🌳 Dominadas: acertou em vários dias diferentes (repetição espaçada).', '🌱 Starting: just met. 🌿 Practicing: right a few times. 🌳 Mastered: right on several different days (spaced repetition).'))}</div>
          <div class="grid grid-cols-3 gap-2">${[['comecando', '🌱', tx('Começando', 'Starting')], ['desenvolvendo', '🌿', tx('Em treino', 'Practicing')], ['dominadas', '🌳', tx('Dominadas', 'Mastered')]].map(([k, em, n]) => `<div class="rounded-xl bg-surface-container-low p-3 text-center"><div class="text-[22px]">${em}</div><div class="text-headline-md text-on-surface">${ph[k].length}</div><div class="text-label-sm text-on-surface-variant">${n}</div></div>`).join('')}</div>
          ${[['dominadas', '🌳'], ['desenvolvendo', '🌿'], ['comecando', '🌱']].map(([k, em]) => ph[k].length ? `<p class="text-body-sm text-on-surface"><b>${em}</b> ${ph[k].slice(0, 14).map(([w]) => esc(w)).join(', ')}${ph[k].length > 14 ? '…' : ''}</p>` : '').join('')}
          <svg viewBox="0 0 300 100" class="w-full h-28"><text x="2" y="10" font-size="9" fill="rgb(var(--c-on-surface-variant))">${tx('palavras no total (12 semanas)', 'total words (12 weeks)')}</text>${line(W.map(x => x.words), maxWords, 'rgb(var(--c-secondary-container))')}</svg></section>
        <section class="${card} space-y-3"><div class="flex items-center justify-between gap-2"><h2 class="text-headline-md text-on-surface">🎯 ${tx('Acertos por semana', 'Weekly accuracy')}</h2>${info('ac', tx('Cada ponto é uma semana. A linha subindo mostra que ela está aprendendo.', 'Each point is a week. A rising line shows learning.'))}</div>
          <svg viewBox="0 0 300 100" class="w-full h-32"><line x1="0" y1="12" x2="300" y2="12" stroke="rgb(var(--c-outline-variant))" stroke-dasharray="4 4"/><text x="2" y="9" font-size="8" fill="rgb(var(--c-on-surface-variant))">100%</text>${line(W.map(x => x.acc), 100, 'rgb(var(--c-primary-container))')}</svg>
          <p class="text-label-sm text-on-surface-variant">${wl[0]} → ${wl[wl.length - 1]}</p></section>
      </div>
      <section class="${card} space-y-3"><div class="flex items-center justify-between gap-2 flex-wrap"><h2 class="text-headline-md text-on-surface">📝 ${tx('Nota estimada e simulado', 'Estimated grade & practice test')}</h2>${pronta ? `<span class="px-3 py-1 rounded-full bg-primary-container text-on-primary text-label-md">${tx('Pronta para a prova ✅', 'Ready for the test ✅')}</span>` : ''}</div>
        <div class="flex items-center gap-4"><div class="w-20 h-20 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed flex flex-col items-center justify-center shrink-0"><span class="text-headline-lg-mobile font-black leading-none">${fmtN1(est)}</span><span class="text-label-sm">/10</span></div><p class="text-body-sm text-on-surface-variant">ℹ️ ${DISC()}${pronta ? ' ' + tx('"Pronta para a prova" aparece quando ela tira 7 ou mais em dois simulados seguidos.', '"Ready" shows after 7+ on two practice tests in a row.') : ''}</p></div>
        ${est !== null && est < 7 ? `<p class="text-body-sm text-on-surface bg-secondary-fixed/50 rounded-xl p-3">💡 ${tx(`Sugestão: com a nota abaixo de 7, o ideal é estudar todos os dias até a prova. Suba para ${Math.min(60, (kid.minutos || 15) + 5)} min por dia e dê prioridade à matéria da prova em Material.`, `Tip: with a grade under 7, study every day until the test. Go up to ${Math.min(60, (kid.minutos || 15) + 5)} min a day and prioritize the test subject in Material.`)}</p>` : ''}
        <div class="bg-surface-container-low rounded-2xl p-3 space-y-2"><b class="text-label-lg text-on-surface">${tx('Preparar um simulado para a criança', 'Set up a practice test for your child')}</b>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label class="text-label-sm text-on-surface-variant">${tx('Perguntas', 'Questions')}<select id="sn" class="${inputCls} !h-11 mt-1">${[5, 10, 15, 20].map(n => `<option ${n === 10 ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
            <label class="text-label-sm text-on-surface-variant">${tx('Tempo', 'Time')}<select id="st" class="${inputCls} !h-11 mt-1"><option value="0">${tx('Sem limite', 'No limit')}</option>${[10, 15, 20, 30, 45].map(n => `<option value="${n}">${n} min</option>`).join('')}</select></label>
            <label class="text-label-sm text-on-surface-variant">${tx('Matéria', 'Subject')}<select id="sl" class="${inputCls} !h-11 mt-1"><option value="">${tx('Todas', 'All')}</option>${lics.filter(l => !l.pausada).map(l => `<option value="${esc(l.id)}">${esc((l.titulo || '').slice(0, 40))}</option>`).join('')}</select></label></div>
          ${simR[0] && simR[0].dados && !simR[0].dados.feito ? `<p class="text-body-sm text-on-surface">⏳ ${tx('Já tem um simulado esperando a criança fazer', 'A practice test is waiting for your child')} (${simR[0].dados.n} ${tx('perguntas', 'questions')}).</p>` : ''}
          <button id="simsave" class="btn3d w-full h-12 rounded-xl bg-primary-container text-on-primary text-label-lg">📝 ${tx('Deixar o simulado para a criança fazer', 'Leave the practice test for your child')}</button>
          <p class="text-body-sm text-on-surface-variant">${tx('Aparece na tela Hoje dela. Como numa prova, ela só vê a nota no final.', 'It shows on her Today screen. Like a real test, she only sees the grade at the end.')}</p></div>
        ${sims.length ? `<div><b class="text-label-lg text-on-surface">${tx('Simulados feitos', 'Practice tests taken')}</b><div class="divide-y divide-surface-container-high mt-1">${sims.map((t, i) => { const sm = t.leitura.simulado, prev = sims[i + 1]; return `<button data-sim="${i}" class="w-full text-left py-2.5 flex items-center gap-3"><span class="flex-1 text-body-md text-on-surface">${fmtD(String(t.iniciada_em).slice(0, 10))} · ${t.total} ${tx('perguntas', 'questions')} · ⏱️ ${Math.max(1, Math.round((t.duracao_seg || 0) / 60))} min</span><b class="text-label-lg ${sm.nota >= 7 ? 'text-primary' : 'text-secondary'}">${fmtN1(sm.nota)}</b>${prev ? arrow(sm.nota, prev.leitura.simulado.nota) : ''}</button>`; }).join('')}</div></div>` : ''}
      </section>
      <button id="mais" class="w-full h-12 rounded-2xl bg-surface-container text-on-surface text-label-lg">${maisGraf ? tx('Esconder gráficos extras ▲', 'Hide extra charts ▲') : tx('📈 Ver mais gráficos', '📈 See more charts')}</button>
      ${maisGraf ? (() => { const D = []; for (let d = ini; d <= fim; d = addDays(d, 1)) D.push([d, Math.round(((dias[d] || {}).seg || 0) / 60)]); const B = N > 31 ? W.slice(-13).map(x => [x.ws, x.min, true]) : D; const mx = Math.max(goal * (N > 31 ? 5 : 1), ...B.map(x => x[1]), 1);
        return `<div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section class="${card} space-y-3"><div class="flex items-center justify-between"><h2 class="text-headline-md text-on-surface">⏱️ ${N > 31 ? tx('Minutos por semana', 'Minutes per week') : tx('Minutos por dia', 'Minutes per day')}</h2>${info('tm', tx(`Barra verde = meta do dia (${goal} min) cumprida.`, `Green bar = daily goal (${goal} min) met.`))}</div>
          <div class="flex items-end gap-1 h-36">${B.map(([d, m, wkk]) => `<div class="flex-1 flex flex-col items-center justify-end h-full" title="${d}: ${m} min"><div class="w-full rounded-t ${m >= goal * (wkk ? 5 : 1) ? 'bg-primary-container' : 'bg-tertiary-container/70'}" style="height:${Math.max(2, Math.round(100 * m / mx))}%"></div></div>`).join('')}</div>
          <p class="text-label-sm text-on-surface-variant">${fmtD(B[0][0])} → ${fmtD(B[B.length - 1][0])} · ${tx('média', 'avg')} ${Math.round(M.min / Math.max(1, M.studied))} min ${tx('por dia de estudo', 'per study day')}</p></section>
        <section class="${card} space-y-2"><div class="flex items-center justify-between"><h2 class="text-headline-md text-on-surface">${tx('Domínio por assunto', 'Mastery by topic')}</h2>${info('sk', tx('Porcentagem de acertos em cada assunto desde o começo.', 'Accuracy per topic since the start.'))}</div>
          ${skills.length ? skills.slice().sort((a, b) => b[2] - a[2]).slice(0, 10).map(([s2, pc, n]) => `<div><div class="flex justify-between text-label-md text-on-surface"><span class="truncate">${esc(A().skillInfo(s2).name)} <span class="text-on-surface-variant font-normal">(${n})</span></span><span class="${pc >= 80 ? 'text-primary' : pc >= 60 ? 'text-secondary' : 'text-error'}">${pc}%</span></div><div class="h-2 bg-surface-container-high rounded-full overflow-hidden mt-1"><div class="h-full rounded-full ${pc >= 80 ? 'bg-primary-container' : pc >= 60 ? 'bg-secondary-container' : 'bg-error'}" style="width:${pc}%"></div></div></div>`).join('') : `<p class="text-body-sm text-on-surface-variant">${tx('Aparece depois das primeiras lições.', 'Shows after the first lessons.')}</p>`}</section>
        <section class="${card}"><h2 class="text-headline-md text-on-surface mb-2">${tx('Sessões do período', 'Sessions in period')}</h2><div class="divide-y divide-surface-container-high max-h-80 overflow-y-auto">
          ${ts.filter(x => String(x.iniciada_em).slice(0, 10) >= ini).slice(0, 40).map(x => `<div class="py-2.5 flex items-center gap-3"><div class="flex-1 min-w-0"><b class="text-label-md text-on-surface truncate block">${esc(x.tipo === 'simulado' ? '📝 ' + tx('Simulado', 'Practice test') : (x.leitura && x.leitura.titulo) || (x.tipo === 'pratica' ? tx('Prática extra', 'Extra practice') : tx('Lição do dia', 'Daily lesson')))}</b><span class="text-body-sm text-on-surface-variant">${fmtD(String(x.iniciada_em).slice(0, 10))} · ${Math.round((x.duracao_seg || 0) / 60)} min · ${x.acertos || 0}/${x.total || 0}</span></div></div>`).join('') || `<p class="text-body-md text-on-surface-variant py-2">${tx('Nenhuma.', 'None.')}</p>`}</div></section>
        <section class="${card} space-y-2"><h2 class="text-headline-md text-on-surface">${tx('Comparação com o período anterior', 'Compared to the previous period')}</h2>
          ${[[tx('Dias de estudo', 'Study days'), M.studied, Pv.studied], [tx('Minutos', 'Minutes'), M.min, Pv.min], [tx('Atividades', 'Activities'), M.q, Pv.q], [tx('Acertos (%)', 'Accuracy (%)'), M.acc, Pv.acc], [tx('Palavras novas', 'New words'), M.words, Pv.words], [tx('Páginas lidas', 'Pages read'), M.pg, Pv.pg]].map(([n, a, b2]) => `<div class="flex items-center justify-between text-body-md py-1 border-b border-surface-container-high last:border-0"><span class="text-on-surface">${n}</span><span class="text-on-surface-variant">${b2 ?? '—'} → <b class="text-on-surface">${a ?? '—'}</b> ${arrow(a, b2)}</span></div>`).join('')}</section>
      </div>`; })() : ''}
    </div>`);
    wireKidSwitch();
    const tp = $('#toplan'); if (tp) tp.onclick = () => { tab = 'conta'; render(); };
    app().querySelectorAll('[data-go]').forEach(b => b.onclick = () => { tab = b.dataset.go; render(); });
    app().querySelectorAll('[data-per]').forEach(b => b.onclick = () => { periodo = +b.dataset.per; render(); });
    app().querySelectorAll('[data-info]').forEach(b => b.onclick = () => { const t2 = app().querySelector(`[data-infotxt="${b.dataset.info}"]`); if (t2) t2.classList.toggle('hidden'); });
    $('#mais').onclick = () => { maisGraf = !maisGraf; render(); };
    $('#rcopy').onclick = async () => { try { await navigator.clipboard.writeText(texto); toast('📋 ' + tx('Copiado!', 'Copied!')); } catch (e) { const r = document.createRange(); r.selectNodeContents($('#rtxt')); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); toast(tx('Texto selecionado: toque em Copiar.', 'Text selected: tap Copy.')); } };
    $('#rshare').onclick = async () => { if (navigator.share) { try { await navigator.share({ title: 'Quest Kids', text: texto }); } catch (e) {} } else window.open('https://wa.me/?text=' + encodeURIComponent(texto), '_blank'); };
    $('#rmail').onclick = () => { location.href = 'mailto:?subject=' + encodeURIComponent(tx(`Relatório Quest Kids — ${nm}`, `Quest Kids report — ${nm}`)) + '&body=' + encodeURIComponent(texto); };
    $('#rpdf').onclick = () => pdfReport(kid, texto, { M, Pv, W, ph, est, sims, ini, fim, maxWords, line });
    $('#simsave').onclick = async () => {
      const cfg = { n: +$('#sn').value, tempo: +$('#st').value || 0, licoes: $('#sl').value ? [$('#sl').value] : null, criado: new Date().toISOString(), feito: false };
      try { await DB.ins('progresso', { crianca_id: kid.id, chave: 'sim', dados: cfg, atualizado_em: new Date().toISOString() }, { upsert: true, onConflict: 'crianca_id,chave' }); toast('✅ ' + tx('Pronto! O simulado aparece na tela da criança.', "Done! The test shows on your child's screen."), 4000); render(); } catch (x) { toast(x.message); }
    };
    app().querySelectorAll('[data-sim]').forEach(b => b.onclick = () => {
      const t2 = sims[+b.dataset.sim], wrong = (t2.itens || []).filter(i => i.correct === false);
      const ov = document.createElement('div'); ov.className = 'fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center';
      ov.innerHTML = `<div class="bg-surface w-full sm:max-w-lg max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-5 space-y-3"><div class="flex justify-between items-center"><h3 class="text-headline-md text-on-surface">📝 ${tx('Simulado', 'Practice test')} · ${fmtN1(t2.leitura.simulado.nota)}</h3><button data-x class="w-10 h-10 rounded-full bg-surface-container">✕</button></div>
        <p class="text-body-md text-on-surface">${t2.acertos}/${t2.total} ${tx('certas', 'right')} · ⏱️ ${Math.max(1, Math.round((t2.duracao_seg || 0) / 60))} min${t2.leitura.simulado.tempo ? ' / ' + t2.leitura.simulado.tempo + ' min' : ''} · ${tx('média', 'avg')} ${Math.round((t2.duracao_seg || 0) / Math.max(1, t2.total))}s ${tx('por pergunta', 'per question')}</p>
        ${wrong.length ? `<b class="text-label-lg text-on-surface">${tx('Errou', 'Missed')}</b>${wrong.map(i => `<div class="bg-surface-container-low rounded-xl p-3 text-body-sm"><span class="text-on-surface-variant">${tx('Resposta dela', 'Her answer')}:</span> <b class="text-error">${esc(i.answer)}</b><br><span class="text-on-surface-variant">${esc(A().skillInfo(i.skill || '').name)}</span></div>`).join('')}` : `<p class="text-body-md text-primary">${tx('Acertou tudo! 🎉', 'All right! 🎉')}</p>`}
        <p class="text-body-sm text-on-surface-variant">ℹ️ ${DISC()}</p></div>`;
      document.body.appendChild(ov); ov.onclick = e => { if (e.target === ov || e.target.closest('[data-x]')) ov.remove(); };
    });
  }
  const fmtD = d => new Date(d + 'T12:00').toLocaleDateString(pt() ? 'pt-BR' : 'en-US', { day: '2-digit', month: 'short' });
  // relatório em PDF simples (abre a versão para imprimir / salvar em PDF)
  function pdfReport(kid, texto, d) {
    const w = window.open('', '_blank'); if (!w) return toast(tx('Libere os pop-ups para gerar o PDF.', 'Allow pop-ups to create the PDF.'));
    const bar = (n, a, b2, suf) => `<tr><td>${n}</td><td>${b2 ?? '—'}${suf || ''}</td><td><b>${a ?? '—'}${suf || ''}</b></td></tr>`;
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Quest Kids — ${esc(kid.apelido)}</title><style>body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#10302f;max-width:720px;margin:24px auto;padding:0 16px}h1{font-size:22px;margin:0}h2{font-size:16px;margin:22px 0 8px}.s{color:#566}pre{white-space:pre-wrap;font-family:inherit;background:#f1f7f7;padding:12px;border-radius:10px}table{width:100%;border-collapse:collapse}td{padding:6px;border-bottom:1px solid #dde}.g{display:grid;grid-template-columns:1fr 1fr;gap:14px}.c{border:1px solid #dde;border-radius:10px;padding:10px}.d{font-size:11px;color:#677;margin-top:24px}@media print{button{display:none}}</style></head><body>
      <h1>🚀 Quest Kids — ${esc(kid.avatar)} ${esc(kid.apelido)}</h1><p class="s">${fmtD(d.ini)} – ${fmtD(d.fim)}</p>
      <h2>${tx('Resumo', 'Summary')}</h2><pre>${esc(texto)}</pre>
      <h2>${tx('Comparação', 'Comparison')}</h2><table><tr><td></td><td class="s">${tx('Período anterior', 'Previous')}</td><td class="s">${tx('Este período', 'This period')}</td></tr>${bar(tx('Dias de estudo', 'Study days'), d.M.studied, d.Pv.studied)}${bar(tx('Minutos', 'Minutes'), d.M.min, d.Pv.min)}${bar(tx('Atividades', 'Activities'), d.M.q, d.Pv.q)}${bar(tx('Acertos', 'Accuracy'), d.M.acc, d.Pv.acc, '%')}${bar(tx('Palavras novas', 'New words'), d.M.words, d.Pv.words)}</table>
      <div class="g"><div class="c"><h2>${tx('Palavras no total', 'Total words')}</h2><svg viewBox="0 0 300 100" width="100%">${d.line(d.W.map(x => x.words), d.maxWords, '#e8a400')}</svg><p class="s">${tx('Cada ponto é uma semana (12 semanas).', 'Each point is a week (12 weeks).')}</p></div>
        <div class="c"><h2>${tx('Acertos por semana', 'Weekly accuracy')}</h2><svg viewBox="0 0 300 100" width="100%">${d.line(d.W.map(x => x.acc), 100, '#14a3a3')}</svg><p class="s">${tx('Linha subindo = aprendendo.', 'Rising line = learning.')}</p></div></div>
      <h2>${tx('Palavras', 'Words')}</h2><p>🌳 ${d.ph.dominadas.map(x => esc(x[0])).slice(0, 30).join(', ') || '—'}</p><p>🌿 ${d.ph.desenvolvendo.map(x => esc(x[0])).slice(0, 30).join(', ') || '—'}</p><p>🌱 ${d.ph.comecando.map(x => esc(x[0])).slice(0, 30).join(', ') || '—'}</p>
      ${d.sims.length ? `<h2>${tx('Simulados', 'Practice tests')}</h2><table>${d.sims.map(t => `<tr><td>${fmtD(String(t.iniciada_em).slice(0, 10))}</td><td>${t.total} ${tx('perguntas', 'questions')}</td><td><b>${fmtN1(t.leitura.simulado.nota)}</b></td></tr>`).join('')}</table>` : ''}
      <p class="d">${DISC()}</p><button onclick="print()">🖨️ ${tx('Salvar em PDF / imprimir', 'Save as PDF / print')}</button><script>setTimeout(()=>print(),400)<\/script></body></html>`);
    w.document.close();
  }

  /* ================= corrigir ================= */
  async function corrigir() {
    const ids = A().kids.map(k => k.id); if (!ids.length) return newChild(true);
    const ts = await DB.sel('tentativas', { inn: { crianca_id: ids }, gte: { iniciada_em: addDays(today(), -30) }, order: 'iniciada_em.desc', limit: 80 });
    const kname = id => { const k = A().kids.find(k => k.id === id); return k ? `${k.avatar} ${k.apelido}` : ''; };
    const texts = [], audios = [];
    ts.forEach(x => {
      (x.itens || []).forEach((it, i) => { if (it.status === 'pending') texts.push({ x, it, i }); });
      ((x.leitura && x.leitura.recordings) || []).forEach((r, i) => { if (!r.rating && !r.apagada) audios.push({ x, r, i }); });
    });
    const ia = A().sub && A().sub.com_ia && A().sub.plano !== 'mensal';
    shell(`<h1 class="text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1">${tx('Corrigir', 'Review')}</h1><p class="text-body-md text-on-surface-variant mb-4">${tx('Respostas escritas e leituras gravadas da semana.', 'Written answers and recorded reading.')}</p>
      ${ia ? `<div class="bg-tertiary-fixed text-on-tertiary-fixed rounded-2xl p-3.5 flex items-center gap-3 mb-4">${I('auto_awesome', 'text-[22px]', 1)}<span class="text-label-md">${tx('No seu plano a IA vai corrigir sozinha assim que for ligada. Enquanto isso, você pode corrigir aqui.', 'On your plan the AI will grade automatically once it is turned on. Meanwhile you can review here.')}</span></div>` : ''}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <section class="space-y-3"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('edit_note', 'text-primary')} ${tx('Respostas escritas', 'Written answers')} <span id="ctT" class="text-label-md text-on-surface-variant">(${texts.length})</span></h2>
        ${texts.map(({ x, it, i }) => `<div class="${card} space-y-3" data-tid="${x.id}" data-i="${i}"><div class="text-label-sm text-on-surface-variant">${esc(kname(x.crianca_id))} · ${new Date(it.at).toLocaleDateString(pt() ? 'pt-BR' : 'en-US')}</div>
          <p class="text-label-lg text-on-surface">${md(it.prompt || it.qid)}</p><div class="bg-surface-container-low rounded-xl p-3 text-body-md text-on-surface">${esc(it.answer)}</div>
          ${it.rubric ? `<details class="text-body-sm text-on-surface-variant"><summary class="cursor-pointer text-primary">${tx('Como corrigir', 'How to grade')}</summary>${md(it.rubric)}</details>` : ''}
          <input class="${inputCls}" placeholder="${tx('Recado para a criança (opcional)', 'Note for your child (optional)')}" data-fb>
          <div class="grid grid-cols-3 gap-2">${[['0', 'close', 'bg-error-container text-on-error-container'], ['1', 'remove', 'bg-secondary-fixed text-on-secondary-fixed'], ['2', 'check', 'bg-primary-container text-on-primary']].map(([s, ic, c]) => `<button data-score="${s}" class="h-12 rounded-xl ${c} text-label-lg flex items-center justify-center gap-1">${I(ic, 'text-[20px]')} ${s}</button>`).join('')}</div></div>`).join('') || ''}<p id="emT" class="${card} text-body-md text-on-surface-variant ${texts.length ? 'hidden' : ''}">${tx('Nada para corrigir. 🎉', 'Nothing to review. 🎉')}</p></section>
      <section class="space-y-3"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('record_voice_over', 'text-primary')} ${tx('Leituras gravadas', 'Recorded reading')} <span id="ctA" class="text-label-md text-on-surface-variant">(${audios.length})</span></h2>
        ${audios.map(({ x, r, i }) => `<div class="${card} space-y-3" data-aid="${x.id}" data-i="${i}"><div class="text-label-sm text-on-surface-variant">${esc(kname(x.crianca_id))} · ${esc((x.leitura && x.leitura.titulo) || '')} · ${tx('pág.', 'p.')} ${r.page} · ${r.dur}s</div>
          ${((x.leitura && x.leitura.medidor) || {})[r.page] && !((x.leitura.medidor[r.page]) || {}).vazio ? (m => `<p class="text-body-sm text-on-surface bg-primary-fixed/30 rounded-xl px-3 py-2">📏 ${m.wpm} ${tx('palavras/min', 'words/min')} · ${m.wcpm} ${tx('certas/min', 'correct/min')} · ${m.acc}% <span class="text-on-surface-variant">(${tx('estimativa', 'estimate')})</span>${m.pulou && m.pulou.length ? `<br><span class="text-on-surface-variant">${tx('Treinar', 'Practice')}: ${m.pulou.map(esc).join(', ')}</span>` : ''}</p>`)(x.leitura.medidor[r.page]) : ''}
          <button data-play class="h-11 px-4 rounded-xl bg-tertiary-container text-on-tertiary-container text-label-md inline-flex items-center gap-2">${I('play_arrow', 'text-[20px]', 1)} ${tx('Ouvir', 'Listen')}</button><div data-player></div>
          <input class="${inputCls}" placeholder="${tx('Comentário (opcional)', 'Comment (optional)')}" data-fb>
          <div class="flex gap-2">${[1, 2, 3, 4, 5].map(s => `<button data-star="${s}" class="flex-1 h-12 rounded-xl bg-secondary-fixed/60 text-on-secondary-fixed text-label-lg">${s}⭐</button>`).join('')}</div></div>`).join('') || ''}<p id="emA" class="${card} text-body-md text-on-surface-variant ${audios.length ? 'hidden' : ''}">${tx('Nenhuma gravação nova.', 'No new recordings.')}</p></section>
      </div>`);
    const byId = id => ts.find(x => x.id === id);
    // card avaliado: fica verde com ✓, desliza para o lado e o de baixo sobe; contador atualiza
    const done = (box, sel, ct, em, label) => {
      box.querySelectorAll('button,input').forEach(e => e.disabled = true);
      const h = box.offsetHeight;
      box.style.cssText += `;position:relative;overflow:hidden;max-height:${h}px;transition:background-color .2s,transform .4s ease .35s,opacity .4s ease .35s,max-height .35s ease .7s,margin .35s ease .7s,padding .35s ease .7s`;
      box.insertAdjacentHTML('beforeend', `<div class="absolute inset-0 rounded-2xl bg-primary-container/95 text-on-primary flex items-center justify-center gap-2 text-headline-md" style="animation:qkpop .25s ease">${I('check_circle', 'text-[34px]', 1)} ${label}</div>`);
      requestAnimationFrame(() => { box.style.transform = 'translateX(24px) scale(.96)'; box.style.opacity = '0'; box.style.maxHeight = '0px'; box.style.marginTop = '0'; box.style.paddingTop = box.style.paddingBottom = '0'; });
      setTimeout(() => { box.remove(); const n = app().querySelectorAll(sel).length; const c = $(ct); if (c) c.textContent = `(${n})`; if (!n) { const e = $(em); e && e.classList.remove('hidden'); } }, 1100);
    };
    app().querySelectorAll('[data-score]').forEach(b => b.onclick = async () => {
      const box = b.closest('[data-tid]'); const x = byId(box.dataset.tid); const it = x.itens[+box.dataset.i];
      Object.assign(it, { status: 'graded', score: +b.dataset.score, feedback: box.querySelector('[data-fb]').value, gradedAt: new Date().toISOString() });
      await DB.upd('tentativas', { eq: { id: x.id } }, { itens: x.itens, pendentes: Math.max(0, (x.pendentes || 1) - 1) }).then(() => done(box, '[data-tid]', '#ctT', '#emT', tx('Corrigida', 'Graded'))).catch(e => toast(e.message));
    });
    app().querySelectorAll('[data-play]').forEach(b => b.onclick = async () => {
      const box = b.closest('[data-aid]'); const r = byId(box.dataset.aid).leitura.recordings[+box.dataset.i];
      if (r.apagada) return toast(tx('Gravação apagada (mais de 30 dias).', 'Recording deleted (older than 30 days).'));
      if (!r.bucket) return toast(tx('Gravação do app antigo.', 'Old app recording.'));
      const pl = box.querySelector('[data-player]'); b.disabled = true;
      try {
        const url = await DB.signed(r.bucket, r.path, 600);
        if (!url) throw new Error(tx('Esta gravação não ficou guardada (no modo teste só cabem gravações curtas).', 'This recording was not kept (demo mode only keeps short ones).'));
        // baixa o arquivo e toca com o tipo certo (o iPhone grava em mp4/aac; o Chrome em webm)
        const isMp4 = /mp4|m4a|aac/.test(r.mime || r.path), type = isMp4 ? 'audio/mp4' : 'audio/webm';
        let src = url;
        try { const res = await fetch(url); if (res.ok) src = URL.createObjectURL(new Blob([await res.arrayBuffer()], { type })); } catch (e) {}
        pl.innerHTML = `<audio controls playsinline preload="auto" class="w-full"><source src="${esc(src)}" type="${type}"></audio><p data-aerr class="hidden text-body-sm text-error mt-1"></p>`;
        const au = pl.querySelector('audio');
        au.addEventListener('error', () => { const m = pl.querySelector('[data-aerr]'); m.classList.remove('hidden'); m.innerHTML = (isMp4 ? tx('Não foi possível tocar aqui.', "Couldn't play here.") : tx('Gravação feita no computador (formato webm): o iPhone antigo não toca. Abra no computador ou no Android.', 'Recorded on a computer (webm): older iPhones cannot play it. Open on a computer or Android.')) + ` <a href="${esc(url)}" target="_blank" rel="noopener" class="underline">${tx('Abrir o arquivo', 'Open file')}</a>`; }, true);
        au.play().catch(() => {}); b.remove();
      } catch (e) { b.disabled = false; toast(e.message, 4000); }
    });
    app().querySelectorAll('[data-star]').forEach(b => b.onclick = async () => {
      const box = b.closest('[data-aid]'); const x = byId(box.dataset.aid); const r = x.leitura.recordings[+box.dataset.i];
      Object.assign(r, { rating: +b.dataset.star, comment: box.querySelector('[data-fb]').value, ratedAt: new Date().toISOString() });
      await DB.upd('tentativas', { eq: { id: x.id } }, { leitura: x.leitura }).then(() => done(box, '[data-aid]', '#ctA', '#emA', '⭐'.repeat(r.rating))).catch(e => toast(e.message));
    });
  }

  /* ================= o que está sendo estudado agora ================= */
  const AT = q => QKEngine.prototype.answerText.call({}, q);
  // instancia um exemplo de pergunta com números variáveis (para os pais verem)
  function exemplo(q, lang) { if (!q.vars) return q; try { const E = Object.create(QKEngine.prototype); E.Q = { [q.id]: q }; E.child = { idioma_app: lang === 'en' ? 'en' : 'pt-BR' }; const v = E.question('TV:' + q.id + ':' + (Date.now() % 99991)); return v || q; } catch (e) { return q; } }
  async function estudandoData() {
    const ids = A().kids.map(k => k.id);
    const [lics, progs, ts, tasks] = await Promise.all([
      DB.sel('licoes', { inn: { crianca_id: ids }, order: 'criado_em.desc', limit: 120 }).catch(() => []),
      DB.sel('progresso', { inn: { crianca_id: ids }, eq: { chave: 'main' } }).catch(() => []),
      DB.sel('tentativas', { inn: { crianca_id: ids }, gte: { iniciada_em: addDays(today(), -60) }, order: 'iniciada_em.desc', limit: 200 }).catch(() => []),
      DB.sel('ia_tarefas', { eq: { familia_id: A().fam.id }, order: 'criado_em.desc', limit: 120 }).catch(() => [])]);
    return { lics, progs, ts, tasks };
  }
  // ritmo até a prova: dá tempo de ver todas as perguntas (2 vezes cada)?
  function ritmo(kid, lic, prog, seenTotal) {
    const c = lic.conteudo || {}, qs = (c.questions || []).filter(q => q.pilar !== 'leitura'), N = qs.length;
    const steps = Math.min(40, Math.round((kid.minutos || 15) * 0.6 + 4)), perDay = Math.max(2, Math.round(steps * ((kid.pilares || {}).reforco || 35) / 100));
    const need = Math.max(0, 2 * N - seenTotal);
    if (!c.data_prova) return { N, need, perDay, msg: need ? tx(`Faltam ~${need} respostas para ela ver todas as perguntas 2 vezes. Com ${kid.minutos} min por dia, leva uns ${Math.ceil(need / perDay)} dias.`, `About ${need} answers left to see every question twice. At ${kid.minutos} min a day, about ${Math.ceil(need / perDay)} days.`) : tx('Todas as perguntas já foram vistas pelo menos 2 vezes. 👏', 'Every question has been seen at least twice. 👏'), ok: true };
    const dias = kid.dias || [1, 2, 3, 4, 5]; let D = 0; for (let d = today(); d < c.data_prova; d = addDays(d, 1)) if (dias.includes(new Date(d + 'T12:00').getDay())) D++;
    if (c.data_prova < today()) return { N, need, perDay, past: true, msg: tx('A data da prova já passou.', 'The test date has passed.'), ok: true };
    const pd = D ? Math.ceil(need / D) : need, ok = pd <= perDay;
    const minNeed = Math.min(60, Math.ceil(((pd / (((kid.pilares || {}).reforco || 35) / 100)) - 4) / 0.6 / 5) * 5);
    return { N, need, perDay, D, pd, ok, msg: !need ? tx('Ela já viu todas as perguntas 2 vezes. Agora é revisar e fazer um simulado. ✅', 'She has seen every question twice. Now review and take a practice test. ✅')
      : ok ? tx(`Dá tempo ✅ Faltam ${D} dias de estudo até a prova; ~${pd} perguntas por dia cobrem tudo 2 vezes.`, `On track ✅ ${D} study days left; ~${pd} questions a day cover everything twice.`)
      : tx(`Não dá tempo com ${kid.minutos} min por dia ⚠️ Faltam ${D} dias de estudo e ~${pd} perguntas por dia. Sugestão: subir para ${Math.max(minNeed, (kid.minutos || 15) + 5)} min por dia, estudar também no fim de semana, ou dar prioridade a esta matéria.`, `Not enough time at ${kid.minutos} min a day ⚠️ ${D} study days left, ~${pd} questions a day. Try ${Math.max(minNeed, (kid.minutos || 15) + 5)} min a day, add weekend days, or prioritize this subject.`) };
  }
  function estudandoHtml(data) {
    const { lics, progs, ts, tasks } = data;
    if (!lics.length) return `<section class="${card} mb-5 flex items-center gap-3">${I('auto_awesome', 'text-[26px] text-primary')}<div><h2 class="text-headline-md text-on-surface">${tx('O que está sendo estudado', 'What is being studied')}</h2><p class="text-body-sm text-on-surface-variant">${tx('Quando a IA criar as lições a partir do material enviado, elas aparecem aqui com todas as perguntas e o ritmo até a prova.', 'When the AI creates lessons from your material, they show up here with every question and the pace until the test.')}</p></div></section>`;
    const byKid = A().kids.map(k => ({ k, ls: lics.filter(l => l.crianca_id === k.id) })).filter(x => x.ls.length);
    return `<section class="mb-6 space-y-3"><div class="flex items-center justify-between gap-2"><h2 class="text-headline-md text-on-surface">${I('auto_awesome', 'text-[22px] text-primary align-middle')} ${tx('O que está sendo estudado', 'What is being studied')}</h2></div>
      ${byKid.map(({ k, ls }) => { const pr = ((progs.find(p => p.crianca_id === k.id) || {}).dados) || {}, qn = pr.qn || {};
        return `<div class="space-y-3"><div class="flex items-center justify-between gap-2"><span class="text-label-lg text-on-surface">${esc(k.avatar)} ${esc(k.apelido)}</span><button data-zerar="${k.id}" class="text-label-sm text-error underline">${tx('Zerar todas as matérias', 'Clear all subjects')}</button></div>
        ${ls.map(l => { const c = l.conteudo || {}, qs = (c.questions || []), lid = l.id, seen = qs.reduce((a, q) => a + (qn[q.id] || 0), 0), vistos = qs.filter(q => qn[q.id]).length;
          const its = ts.filter(t => t.crianca_id === k.id).flatMap(t => t.itens || []).filter(i => String(i.qid).replace(/^TV:/, '').startsWith(lid + '-') && i.correct !== null && i.correct !== undefined);
          const acc = its.length ? Math.round(100 * its.filter(i => i.correct).length / its.length) : null;
          const tk = tasks.find(t => t.resultado && t.resultado.licao === lid) || {}, en = tk.entrada || {};
          const rt = ritmo(k, l, pr, seen), pct = qs.length ? Math.round(100 * vistos / qs.length) : 0;
          return `<div class="${card} space-y-3 ${l.pausada ? 'opacity-60' : ''}">
            <div class="flex items-start gap-3"><span class="text-[30px] leading-none">${esc(c.icone || '📸')}</span><div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">${c.modo_prova ? `<span class="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm">📝 ${tx('Prova', 'Test')}${c.data_prova ? ' ' + new Date(c.data_prova + 'T12:00').toLocaleDateString(pt() ? 'pt-BR' : 'en-US', { day: '2-digit', month: 'short' }) : ''}</span>` : `<span class="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface text-label-sm">📘 ${tx('Estudo', 'Study')}</span>`}${l.foco ? `<span class="px-2 py-0.5 rounded-full bg-primary-container text-on-primary text-label-sm">⭐ ${tx('Prioridade', 'Priority')}</span>` : ''}${l.pausada ? `<span class="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-label-sm">⏸ ${tx('Pausada', 'Paused')}</span>` : ''}</div>
              <b class="text-label-lg text-on-surface block mt-1">${esc(l.titulo || c.titulo || '')}</b>
              <span class="text-body-sm text-on-surface-variant">${esc([en.materia, en.obs ? '“' + en.obs + '”' : '', new Date(l.criado_em).toLocaleDateString(pt() ? 'pt-BR' : 'en-US', { day: '2-digit', month: 'short' })].filter(Boolean).join(' · '))}</span></div></div>
            <div><div class="flex justify-between text-label-sm text-on-surface-variant mb-1"><span>${vistos}/${qs.length} ${tx('perguntas já vistas', 'questions seen')}</span><span>${acc === null ? '' : tx('Acertos', 'Accuracy') + ': ' + acc + '%'}</span></div><div class="h-2.5 bg-surface-container-high rounded-full overflow-hidden"><div class="h-full bg-primary-container rounded-full" style="width:${pct}%"></div></div></div>
            <p class="text-body-sm ${rt.ok ? 'text-on-surface' : 'text-error'} bg-surface-container-low rounded-xl p-3 flex gap-2">${I(rt.ok ? 'insights' : 'warning', 'text-[18px] shrink-0 ' + (rt.ok ? 'text-primary' : 'text-error'))}<span>${rt.msg}</span></p>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button data-perg="${k.id}|${lid}" class="h-11 rounded-xl bg-primary-container text-on-primary text-label-md flex items-center justify-center gap-1.5">${I('quiz', 'text-[18px]')} ${tx('Perguntas', 'Questions')} (${qs.length})</button>
              <button data-lacao="${k.id}|${lid}|${l.foco ? 'desfocar' : 'focar'}" class="h-11 rounded-xl bg-surface-container text-on-surface text-label-md">${l.foco ? tx('Tirar prioridade', 'Remove priority') : '⭐ ' + tx('Priorizar', 'Prioritize')}</button>
              <button data-lacao="${k.id}|${lid}|${l.pausada ? 'ativar' : 'pausar'}" class="h-11 rounded-xl bg-surface-container text-on-surface text-label-md">${l.pausada ? '▶ ' + tx('Ativar', 'Resume') : '⏸ ' + tx('Pausar', 'Pause')}</button>
              <button data-lacao="${k.id}|${lid}|apagar" class="h-11 rounded-xl bg-surface-container text-error text-label-md">🗑 ${tx('Apagar', 'Delete')}</button></div></div>`; }).join('')}</div>`; }).join('')}</section>`;
  }
  function perguntasSheet(lic, prog, ts) {
    const c = lic.conteudo || {}, qs = c.questions || [], qn = (prog && prog.qn) || {};
    const its = ts.flatMap(t => t.itens || []);
    const st = q => { const xs = its.filter(i => String(i.qid).replace(/^TV:/, '').split(':')[0] === q.id && i.correct !== null && i.correct !== undefined); return xs.length ? `${xs.filter(i => i.correct).length}/${xs.length} ${tx('certas', 'right')}` : tx('ainda não apareceu', 'not shown yet'); };
    const ov = document.createElement('div');
    ov.className = 'fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-6';
    ov.innerHTML = `<div class="bg-surface w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-5 space-y-3">
      <div class="flex items-center justify-between gap-2"><h2 class="text-headline-md text-on-surface">${esc(lic.titulo || c.titulo || '')}</h2><button data-x class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">${I('close', 'text-[22px]')}</button></div>
      <p class="text-body-sm text-on-surface-variant">${qs.length} ${tx('perguntas criadas', 'questions created')} · ${qs.filter(q => q.vars).length} ${tx('com números que mudam a cada vez (variações sem fim)', 'with numbers that change every time (endless variations)')} · ${Object.keys(c.defs_alt || {}).length} ${tx('palavras com explicações alternativas', 'words with alternative explanations')}. ${tx('Respostas certas em verde.', 'Correct answers in green.')}</p>
      ${c.passage && c.passage.text ? `<details class="bg-surface-container-low rounded-2xl p-3"><summary class="text-label-md text-on-surface cursor-pointer">📖 ${tx('Texto de leitura', 'Reading text')}: ${esc(c.passage.title || '')}</summary><div class="text-body-md text-on-surface mt-2 space-y-2">${String(c.passage.text).split(/\n\s*\n/).map(p => `<p>${md(p.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '**$1**'))}</p>`).join('')}</div></details>` : ''}
      ${qs.map((q, i) => { const ex = exemplo(q, lic.idioma); return `<div class="${card} space-y-1.5"><div class="flex items-center gap-2 flex-wrap"><span class="text-label-sm text-on-surface-variant">${i + 1}.</span><span class="px-2 py-0.5 rounded-full bg-surface-container-high text-label-sm text-on-surface">${esc(q.pilar === 'leitura' ? tx('Leitura', 'Reading') : A().skillInfo(q.skill || '').name)}</span>${q.vars ? `<span class="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-label-sm">🔀 ${tx('números variam', 'numbers vary')}</span>` : ''}<span class="text-label-sm text-on-surface-variant ml-auto">${tx('Vista', 'Seen')} ${qn[q.id] || 0}x · ${st(q)}</span></div>
        <p class="text-label-lg text-on-surface">${md(ex.prompt)}</p>
        ${q.type === 'mc' ? `<ul class="text-body-sm space-y-0.5">${ex.options.map((o, j) => `<li class="${j === (q.answer || 0) ? 'text-primary font-extrabold' : 'text-on-surface-variant'}">${j === (q.answer || 0) ? '✓' : '·'} ${md(o)}</li>`).join('')}</ul>` : `<p class="text-body-md text-primary font-extrabold whitespace-pre-line">✓ ${md(AT(ex))}</p>`}
        ${ex.explain ? `<p class="text-body-sm text-on-surface-variant">${md(ex.explain)}</p>` : ''}</div>`; }).join('')}
      <p class="text-body-sm text-on-surface-variant">${tx('Achou uma pergunta errada ou estranha? Pause esta matéria e nos avise pelo e-mail de suporte.', 'Found a wrong or odd question? Pause this subject and let us know by support email.')}</p></div>`;
    document.body.appendChild(ov);
    ov.onclick = e => { if (e.target === ov || e.target.closest('[data-x]')) ov.remove(); };
  }

  /* ================= enviar material ================= */
  const MAX_ENVIO = 10; // páginas por envio
  const TIPOS = () => [['estudo', '📘', tx('Estudo do dia a dia', 'Everyday study'), tx('Guia de estudo, lição de casa', 'Study guide, homework')], ['prova', '📝', tx('Cai na prova', 'On the test'), tx('Com a data da prova', 'With the test date')], ['outro', '➕', tx('Outro', 'Other'), tx('Qualquer outro material', 'Anything else')]];
  // insere aceitando banco sem as colunas novas (antes do SQL 05)
  async function insMat(row) {
    try { return await DB.ins('materiais', row); }
    catch (e) { if (!/tipo|obs|lote|column|schema/i.test(e.message)) throw e; const r = Object.assign({}, row); delete r.tipo; delete r.obs; delete r.lote; return DB.ins('materiais', r); }
  }
  // junta as fotos do mesmo envio
  function lotes(mats) {
    const out = [];
    mats.forEach(m => {
      const k = m.lote || null;
      const g = out.find(g => k ? g.lote === k : (!g.lote && g.crianca_id === m.crianca_id && (g.materia || '') === (m.materia || '') && Math.abs(new Date(g.criado_em) - new Date(m.criado_em)) < 180000));
      if (g) g.itens.push(m); else out.push(Object.assign({}, m, { itens: [m] }));
    });
    return out;
  }
  async function material() {
    if (!A().kids.length) return newChild(true);
    const fam = A().fam.id; const mes = today().slice(0, 7);
    const [mats, lim, est] = await Promise.all([DB.sel('materiais', { eq: { familia_id: fam }, order: 'criado_em.desc', limit: 80 }), DB.sel('limites_ia', { eq: { plano: (A().sub || {}).plano || 'teste' } }).catch(() => []), estudandoData()]);
    const usado = mats.filter(m => String(m.criado_em).slice(0, 7) === mes).length; const max = (lim[0] && lim[0].paginas_mes) || 60;
    let files = [], tipo = 'estudo';
    const kidOf = id => A().kids.find(k => k.id === id);
    const status = { enviado: ['hourglass_top', tx('Na fila: a IA vai criar as lições', 'In line: AI will create the lessons'), 'text-secondary'], processando: ['auto_awesome', tx('Criando as lições…', 'Creating lessons…'), 'text-tertiary'], pronto: ['check_circle', tx('Lições prontas · fotos apagadas', 'Lessons ready · photos deleted'), 'text-primary'], erro: ['error', tx('Não deu certo. Fotos guardadas até 7 dias para tentar de novo.', 'Something went wrong. Photos kept up to 7 days to retry.'), 'text-error'], apagado: ['delete', tx('Fotos apagadas', 'Photos deleted'), 'text-outline'] };
    const tipoDe = m => m.tipo || (m.modo_prova ? 'prova' : 'estudo');
    const badge = m => { const t = TIPOS().find(x => x[0] === tipoDe(m)) || TIPOS()[0]; return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-sm ${t[0] === 'prova' ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container-high text-on-surface'}">${t[1]} ${t[2]}${t[0] === 'prova' && m.data_prova ? ' · ' + new Date(m.data_prova + 'T12:00').toLocaleDateString(pt() ? 'pt-BR' : 'en-US', { day: '2-digit', month: 'short' }) : ''}</span>`; };
    const grupos = lotes(mats);
    shell(`${estudandoHtml(est)}<div class="grid grid-cols-1 lg:grid-cols-5 gap-5">
      <section class="lg:col-span-3 ${card} space-y-1 relative overflow-hidden">
        <div class="absolute -top-10 -right-10 w-36 h-36 bg-primary-container/10 rounded-full blur-2xl pointer-events-none"></div>
        <div class="flex items-center gap-3 relative"><div class="w-12 h-12 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center">${I('photo_camera', 'text-[26px]', 1)}</div>
          <div><h1 class="text-headline-lg-mobile text-on-surface">${tx('Enviar material', 'Send material')}</h1><p class="text-body-sm text-on-surface-variant">${tx('Fotos do caderno, do livro ou o PDF da escola.', 'Photos of the notebook, the book or the school PDF.')}</p></div></div>
        ${lbl(tx('Para quem', 'For'))}<div class="flex flex-wrap gap-2">${A().kids.map(k => `<label class="cursor-pointer"><input type="radio" name="kid" value="${k.id}" class="peer sr-only" ${k.id === kidSel ? 'checked' : ''}><span class="flex items-center gap-2 px-4 h-12 rounded-full bg-surface-container text-label-md text-on-surface peer-checked:bg-primary-container peer-checked:text-on-primary">${esc(k.avatar)} ${esc(k.apelido)}</span></label>`).join('')}</div>
        ${lbl(tx('O que é este material?', 'What is this material?'))}
        <div class="grid grid-cols-3 gap-2" id="tipos">${TIPOS().map(([v, e, l, d]) => `<button data-tipo="${v}" class="rounded-2xl border-2 p-2.5 text-center flex flex-col items-center gap-1 ${v === tipo ? 'border-primary-container bg-primary-fixed/30' : 'border-surface-container-high bg-surface-container-lowest'}"><span class="text-[26px] leading-none">${e}</span><b class="text-label-md text-on-surface leading-tight">${l}</b><span class="text-[11px] leading-tight text-on-surface-variant hidden sm:block">${d}</span></button>`).join('')}</div>
        <div id="pv" class="hidden">${lbl(tx('Data da prova', 'Test date'))}<input class="${inputCls}" type="date" id="dp" min="${today()}"><p class="text-body-sm text-on-surface-variant mt-1">${tx('Até a prova, a revisão foca só nesta matéria, com um teste no começo e outro no fim.', 'Until test day, review focuses only on this, with a check at the start and at the end.')}</p></div>
        ${lbl(tx('Matéria', 'Subject'))}<input class="${inputCls}" id="mat" maxlength="40" placeholder="${tx('Ex.: Ciências — ciclo da água', 'E.g. Science — water cycle')}">
        ${lbl(tx('Observação (opcional)', 'Note (optional)'))}<input class="${inputCls}" id="obs" maxlength="140" placeholder="${tx('Ex.: capítulo 4, páginas 30–35', 'E.g. chapter 4, pages 30–35')}">
        ${lbl(tx('Arquivos', 'Files') + ` <span class="text-on-surface-variant font-normal">· ${tx(`até ${MAX_ENVIO} páginas por envio`, `up to ${MAX_ENVIO} pages per send`)}</span>`)}
        <div class="grid grid-cols-2 gap-3">
          <label class="cursor-pointer h-24 rounded-2xl border-2 border-dashed border-primary-container/60 bg-primary-fixed/20 flex flex-col items-center justify-center gap-1 text-primary">${I('photo_camera', 'text-[30px]')}<span class="text-label-md">${tx('Tirar foto', 'Take photo')}</span><input type="file" accept="image/*" capture="environment" id="cam" class="hidden"></label>
          <label class="cursor-pointer h-24 rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low flex flex-col items-center justify-center gap-1 text-on-surface-variant">${I('upload_file', 'text-[30px]')}<span class="text-label-md">${tx('Fotos ou PDF', 'Photos or PDF')}</span><input type="file" accept="image/*,application/pdf" multiple id="fs" class="hidden"></label></div>
        <div id="th" class="flex flex-wrap gap-2 mt-3"></div><div id="cnt" class="text-label-sm text-on-surface-variant mt-1"></div>
        <div class="bg-surface-container-low rounded-2xl p-3.5 mt-4 space-y-2 text-body-sm text-on-surface-variant">
          <p class="flex items-start gap-2">${I('visibility_off', 'text-[18px] text-primary shrink-0')}<span>${tx('Cubra o nome da criança antes da foto. As fotos são usadas só para criar as lições e apagadas assim que elas ficam prontas.', "Cover your child's name before taking the photo. Photos are used only to create the lessons and are deleted as soon as they are ready.")}</span></p>
          <p class="flex items-start gap-2">${I('menu_book', 'text-[18px] text-primary shrink-0')}<span>${tx('Envie só as páginas que seu filho está estudando agora, para uso da sua família. Não envie livros inteiros. O Quest Kids não copia o texto: cria perguntas e textos novos a partir do conteúdo.', 'Send only the pages your child is studying now, for your family’s use. Do not send whole books. Quest Kids does not copy the text: it creates new questions and texts from the content.')}</span></p></div>
        <div id="err" class="text-label-md text-error min-h-[1.2em] mt-2"></div>
        ${btnP('send', tx('Enviar', 'Send'), 'send')}
        <p class="text-label-sm text-on-surface-variant text-center mt-2">${tx(`Este mês: ${usado} de ${max} páginas.`, `This month: ${usado} of ${max} pages.`)}</p>
      </section>
      <section class="lg:col-span-2 space-y-3"><h2 class="text-headline-md text-on-surface">${tx('Enviados', 'Sent')}</h2>
        ${grupos.map((g, gi) => { const st = status[g.itens.some(m => m.status === 'erro') ? 'erro' : g.status] || ['help', g.status, 'text-outline']; const k = kidOf(g.crianca_id); return `<button data-g="${gi}" class="${card} w-full text-left space-y-1.5 hover:ring-2 hover:ring-primary-container/40">
          <div class="flex items-center gap-2 flex-wrap">${badge(g)}<span class="text-body-sm text-on-surface-variant">${k ? esc(k.avatar) + ' ' + esc(k.apelido) + ' · ' : ''}${new Date(g.criado_em).toLocaleDateString(pt() ? 'pt-BR' : 'en-US', { day: '2-digit', month: 'short' })}</span></div>
          <b class="text-label-lg text-on-surface block">${esc(g.materia || tx('Sem matéria informada', 'No subject given'))}</b>
          ${g.obs ? `<p class="text-body-sm text-on-surface-variant">“${esc(g.obs)}”</p>` : ''}
          <div class="flex items-center justify-between gap-2"><span class="text-body-sm text-on-surface-variant">${g.itens.length} ${g.itens.length === 1 ? tx('página', 'page') : tx('páginas', 'pages')}</span>
          <span class="flex items-center gap-1 text-label-sm ${st[2]} text-right">${I(st[0], 'text-[18px] shrink-0', 1)}<span>${st[1]}</span></span></div></button>`; }).join('') || `<p class="${card} text-body-md text-on-surface-variant">${tx('Nada ainda.', 'Nothing yet.')}</p>`}</section></div>`);
    const upd = () => {
      $('#th').innerHTML = files.map((f, i) => `<div class="relative w-16 h-20 rounded-lg bg-surface-container bg-cover bg-center flex items-center justify-center border border-outline-variant" style="${/^image/.test(f.type) ? `background-image:url(${URL.createObjectURL(f)})` : ''}">${/pdf/.test(f.type) ? I('picture_as_pdf', 'text-error text-[28px]') : ''}<button data-rm="${i}" class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-on-surface text-surface text-[14px] leading-none">×</button></div>`).join('');
      $('#th').querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { files.splice(+b.dataset.rm, 1); upd(); });
      $('#cnt').textContent = files.length ? tx(`${files.length} de ${MAX_ENVIO} páginas`, `${files.length} of ${MAX_ENVIO} pages`) : ''; $('#send').disabled = !files.length;
    };
    const add = ev => { const all = files.concat([...ev.target.files]); if (all.length > MAX_ENVIO) toast(tx(`Até ${MAX_ENVIO} páginas por envio. Mande só o que está estudando agora.`, `Up to ${MAX_ENVIO} pages per send.`), 3500); files = all.slice(0, MAX_ENVIO); ev.target.value = ''; upd(); };
    $('#cam').onchange = add; $('#fs').onchange = add; $('#send').disabled = true;
    app().querySelectorAll('[data-tipo]').forEach(b => b.onclick = () => {
      tipo = b.dataset.tipo; $('#pv').classList.toggle('hidden', tipo !== 'prova');
      app().querySelectorAll('[data-tipo]').forEach(x => { const on = x.dataset.tipo === tipo; x.classList.toggle('border-primary-container', on); x.classList.toggle('bg-primary-fixed/30', on); x.classList.toggle('border-surface-container-high', !on); x.classList.toggle('bg-surface-container-lowest', !on); });
    });
    app().querySelectorAll('[data-g]').forEach(b => b.onclick = () => verEnvio(grupos[+b.dataset.g], badge, status));
    app().querySelectorAll('[data-perg]').forEach(b => b.onclick = () => { const [kid, lid] = b.dataset.perg.split('|'); const l = est.lics.find(x => x.id === lid && x.crianca_id === kid); perguntasSheet(l, ((est.progs.find(p => p.crianca_id === kid) || {}).dados) || {}, est.ts.filter(t => t.crianca_id === kid)); });
    const acao = async (kid, lid, ac) => { try { await DB.rpc('gerir_licao', { crianca: kid, licao: lid, acao: ac }); toast('✅'); material(); } catch (x) { toast(/gerir_licao|function|schema/i.test(x.message) ? tx('Falta rodar o SQL 06 no Supabase para usar isso.', 'Run SQL 06 in Supabase to use this.') : x.message, 4500); } };
    app().querySelectorAll('[data-lacao]').forEach(b => b.onclick = () => { const [kid, lid, ac] = b.dataset.lacao.split('|'); if (ac === 'apagar' && !confirm(tx('Apagar esta matéria e todas as perguntas dela? Não dá para desfazer.', 'Delete this subject and all its questions? This cannot be undone.'))) return; acao(kid, lid, ac); });
    app().querySelectorAll('[data-zerar]').forEach(b => b.onclick = () => { if (!confirm(tx('Apagar TODAS as matérias e perguntas desta criança? Não dá para desfazer.', "Delete ALL of this child's subjects and questions? This cannot be undone."))) return; acao(b.dataset.zerar, '', 'zerar'); });
    $('#send').onclick = async () => {
      const err = $('#err'); err.textContent = '';
      if (usado + files.length > max) { err.textContent = tx(`Limite do mês: ${max} páginas.`, `Monthly limit: ${max} pages.`); return; }
      if (files.find(f => f.size > 50 * 1024 * 1024)) { err.textContent = tx('Cada arquivo pode ter até 50 MB.', 'Each file can be up to 50 MB.'); return; }
      const prova = tipo === 'prova', dp = $('#dp').value; if (prova && !dp) { err.textContent = tx('Escolha a data da prova.', 'Pick the test date.'); return; }
      const b = $('#send'); b.disabled = true; const kid = (app().querySelector('input[name=kid]:checked') || {}).value || kidSel, materia = $('#mat').value.trim(), obs = $('#obs').value.trim(); const ids = []; const lote = QK.uid();
      try {
        for (let i = 0; i < files.length; i++) {
          b.querySelector('span:last-child').textContent = `⏳ ${i + 1}/${files.length}`;
          const f = files[i]; const safe = f.name.replace(/[^\w.-]+/g, '_').slice(-60); const path = `${fam}/${QK.uid()}-${safe}`;
          await DB.upload('familia-materiais', path, f);
          const r = await insMat({ familia_id: fam, crianca_id: kid, caminho: path, materia: materia || null, modo_prova: prova, data_prova: prova ? dp : null, tipo, obs: obs || null, lote });
          ids.push(r[0] && r[0].id);
        }
        await DB.ins('ia_tarefas', { familia_id: fam, crianca_id: kid, tipo: 'gerar_licao', entrada: { materiais: ids, materia, tipo, obs, modo_prova: prova, data_prova: prova ? dp : null } }).catch(e => console.warn(e));
        DB.fn('ia', {}).catch(() => {});
        toast(tx('✅ Enviado! As lições aparecem para a criança quando ficarem prontas.', '✅ Sent! Lessons show up for your child when ready.'), 4000); material();
      } catch (x) { err.textContent = x.message; b.disabled = false; b.querySelector('span:last-child').textContent = tx('Enviar', 'Send'); }
    };
  }
  // ver um envio: fotos (se ainda existirem) e a observação
  async function verEnvio(g, badge, status) {
    const k = A().kids.find(k => k.id === g.crianca_id);
    const ov = document.createElement('div');
    ov.className = 'fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-6';
    ov.innerHTML = `<div class="bg-surface w-full sm:max-w-lg max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-5 space-y-3 pb-safe">
      <div class="flex items-center justify-between gap-2"><div class="flex items-center gap-2 flex-wrap">${badge(g)}</div><button data-x class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">${I('close', 'text-[22px]')}</button></div>
      <h2 class="text-headline-md text-on-surface">${esc(g.materia || tx('Sem matéria informada', 'No subject given'))}</h2>
      <p class="text-body-sm text-on-surface-variant">${k ? esc(k.avatar) + ' ' + esc(k.apelido) + ' · ' : ''}${new Date(g.criado_em).toLocaleString(pt() ? 'pt-BR' : 'en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })} · ${g.itens.length} ${g.itens.length === 1 ? tx('página', 'page') : tx('páginas', 'pages')}</p>
      ${g.obs ? `<div class="bg-surface-container-low rounded-xl p-3 text-body-md text-on-surface">${I('sticky_note_2', 'text-[18px] text-primary align-middle')} ${esc(g.obs)}</div>` : ''}
      <p class="text-label-md ${(status[g.status] || [])[2] || ''}">${(status[g.status] || [, g.status])[1]}</p>
      <div data-fotos class="grid grid-cols-2 gap-2"><div class="spin col-span-2"></div></div></div>`;
    document.body.appendChild(ov);
    const close = () => ov.remove();
    ov.onclick = e => { if (e.target === ov || e.target.closest('[data-x]')) close(); };
    const box = ov.querySelector('[data-fotos]');
    const vivos = g.itens.filter(m => !['pronto', 'apagado'].includes(m.status));
    if (!vivos.length) { box.innerHTML = `<p class="col-span-2 text-body-sm text-on-surface-variant">${I('delete', 'text-[18px] align-middle')} ${tx('As fotos já foram apagadas, como prometido. As lições continuam no app.', 'Photos were already deleted, as promised. The lessons stay in the app.')}</p>`; return; }
    const urls = await Promise.all(vivos.map(m => DB.signed('familia-materiais', m.caminho, 600).catch(() => '')));
    box.innerHTML = vivos.map((m, i) => !urls[i] ? `<div class="aspect-[3/4] rounded-xl bg-surface-container flex items-center justify-center text-body-sm text-on-surface-variant p-2 text-center">${tx('Prévia indisponível', 'Preview unavailable')}</div>` : /\.pdf$/i.test(m.caminho) ? `<a href="${esc(urls[i])}" target="_blank" rel="noopener" class="aspect-[3/4] rounded-xl bg-surface-container flex flex-col items-center justify-center gap-1 text-primary">${I('picture_as_pdf', 'text-[36px] text-error')}<span class="text-label-sm underline">${tx('Abrir PDF', 'Open PDF')}</span></a>` : `<a href="${esc(urls[i])}" target="_blank" rel="noopener"><img src="${esc(urls[i])}" alt="" class="w-full aspect-[3/4] object-cover rounded-xl bg-surface-container"></a>`).join('');
  }

  /* ================= crianças ================= */
  async function criancas() {
    shell(`<div class="flex items-center justify-between mb-4"><h1 class="text-headline-lg-mobile md:text-headline-lg text-on-surface">${tx('Crianças', 'Kids')}</h1></div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      ${A().kids.map(k => { const e = ESTILOS().find(x => x[0] === k.estilo) || ESTILOS()[0]; return `<div class="${card} flex flex-col gap-3"><div class="flex items-center gap-3"><div class="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-[36px]">${esc(k.avatar)}</div>
        <div class="min-w-0"><b class="text-headline-md text-on-surface truncate block">${esc(k.apelido)}</b><span class="text-body-sm text-on-surface-variant">${k.idioma_app === 'en' ? 'English' : 'Português'} · ${k.minutos} min</span></div></div>
        <div class="flex items-center gap-2 text-label-sm text-on-surface-variant"><span class="w-4 h-4 rounded-full" style="background:${e[2]}"></span>${e[1]} · ${k.tema === 'escuro' ? '🌙 ' + tx('Escuro', 'Dark') : '☀️ ' + tx('Claro', 'Light')}</div>
        <button data-ed="${k.id}" class="h-11 rounded-xl bg-surface-container text-primary text-label-md flex items-center justify-center gap-1.5">${I('edit', 'text-[18px]')} ${tx('Editar', 'Edit')}</button></div>`; }).join('')}
      ${A().kids.length < 3 ? `<button id="add" class="min-h-[180px] rounded-2xl border-2 border-dashed border-primary-container/60 text-primary flex flex-col items-center justify-center gap-2 hover:bg-primary-fixed/20">${I('add_circle', 'text-[36px]')}<span class="text-label-lg">${tx('Adicionar criança', 'Add a child')}</span></button>` : ''}</div>
      ${A().kids.length >= 3 ? `<p class="text-body-sm text-on-surface-variant mt-3">${tx('Até 3 crianças por conta.', 'Up to 3 kids per account.')}</p>` : ''}`);
    app().querySelectorAll('[data-ed]').forEach(b => b.onclick = () => childForm(A().kids.find(k => k.id === b.dataset.ed)));
    const a = $('#add'); if (a) a.onclick = () => QKOnboard.start({ first: false });
  }
  function newChild(first) { if (first) { QKOnboard.start({ first: true }); return Promise.resolve(); } tab = 'criancas'; childForm(null, first); return Promise.resolve(); }

  function childForm(k, first) {
    const d = k ? JSON.parse(JSON.stringify(k)) : { apelido: '', avatar: '🦄', idade: 9, serie: '', idioma_app: QK.lang === 'en' ? 'en' : 'pt-BR', estilo: 'simples', tema: 'claro', minutos: 15, dias: [1, 2, 3, 4, 5], pilares: { leitura: 40, palavras: 25, reforco: 35 } };
    d.pilares = Object.assign({ leitura: 40, palavras: 25, reforco: 35 }, d.pilares || {});
    let drawn = false;
    const draw = () => {
      const tot = d.pilares.leitura + d.pilares.palavras + d.pilares.reforco || 1;
      shell(`<div class="max-w-2xl mx-auto">
        ${first ? `<div class="${card} text-center mb-4"><div class="text-5xl mb-2">👋</div><h1 class="text-headline-lg-mobile text-on-surface">${tx('Bem-vindo ao Quest Kids!', 'Welcome to Quest Kids!')}</h1><p class="text-body-md text-on-surface-variant">${tx('Vamos cadastrar a primeira criança. Leva 1 minuto.', "Let's add your first child. It takes 1 minute.")}</p></div>`
          : `<h1 class="text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">${k ? tx('Editar', 'Edit') + ' ' + esc(k.apelido) : tx('Nova criança', 'New child')}</h1>`}
        <div class="${card}">
          ${lbl(tx('Apelido (sem nome completo)', 'Nickname (no full name)')).replace('mt-4', 'mt-0')}<input class="${inputCls}" id="ap" maxlength="30" value="${esc(d.apelido)}" placeholder="${tx('Ex.: Bia', 'E.g. Bea')}">
          ${lbl('Avatar')}<div class="flex flex-wrap gap-2">${AVATARES.map(a => `<button data-av="${a}" class="w-11 h-11 rounded-full text-[24px] flex items-center justify-center ${d.avatar === a ? 'bg-primary-fixed ring-[3px] ring-primary-container' : 'bg-surface-container'}">${a}</button>`).join('')}</div>
          <div class="grid grid-cols-3 gap-3"><div>${lbl(tx('Idade', 'Age'))}<input class="${inputCls}" id="id" type="number" min="5" max="14" value="${d.idade || ''}"></div><div>${lbl(tx('Mês do aniversário', 'Birth month'))}<select class="${inputCls}" id="mes"><option value="">—</option>${(pt() ? ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']).map((m, i) => `<option value="${i + 1}" ${+d.mes_nasc === i + 1 ? 'selected' : ''}>${m}</option>`).join('')}</select></div><div>${lbl(tx('Série / ano', 'Grade'))}<input class="${inputCls}" id="se" maxlength="20" value="${esc(d.serie || '')}" placeholder="${tx('Ex.: 4º ano', 'E.g. 4th')}"></div></div>
          ${lbl(tx('Idioma das lições', 'Lesson language'))}${seg([['pt-BR', 'Português'], ['en', 'English']], d.idioma_app, 'data-lg')}
          ${lbl(tx('Estilo da tela', 'Screen style'))}<div class="grid grid-cols-2 sm:grid-cols-4 gap-2">${ESTILOS().map(([v, n, c, bg, fg]) => `<button data-es="${v}" class="rounded-2xl p-3 border-[3px] ${d.estilo === v ? 'border-primary-container' : 'border-transparent'} shadow-sm" style="background:${bg};color:${fg}"><div class="flex justify-center gap-1 mb-1.5"><span class="w-6 h-6 rounded-full" style="background:${c}"></span><span class="w-6 h-6 rounded-full opacity-50" style="background:${c}"></span></div><span class="text-label-md">${n}</span></button>`).join('')}</div>
          <div class="mt-3">${seg([['claro', '☀️ ' + tx('Claro', 'Light')], ['escuro', '🌙 ' + tx('Escuro', 'Dark')]], d.tema, 'data-tm')}</div>
          ${lbl(`${tx('Tempo por dia', 'Time per day')}: <b id="mv">${d.minutos}</b> min ${d.minutos <= 20 ? `<span class="ml-1 text-label-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">${tx('recomendado', 'recommended')}</span>` : ''}`)}
          <input type="range" min="15" max="60" step="5" value="${d.minutos}" id="mn"><div class="flex justify-between text-label-sm text-on-surface-variant"><span>15 min</span><span>1 h</span></div>
          <p class="text-body-sm text-on-surface-variant mt-2 flex gap-2">${I('tips_and_updates', 'text-[18px] text-primary shrink-0')}<span>${tx(`Cerca de <b id="atv">${Math.min(40, Math.round(d.minutos * 0.6 + 4))} atividades</b> por dia. Comece de leve, todos os dias, e aumente só se precisar: o que mais ajuda é a constância, não o tempo.`, `About <b id="atv">${Math.min(40, Math.round(d.minutos * 0.6 + 4))} activities</b> a day. Start light, every day, and increase only if needed: consistency helps more than time.`)}</span></p>
          ${lbl(tx('Divisão do tempo', 'Time split'))}
          <div class="space-y-2">${[['leitura', 'menu_book', tx('Leitura', 'Reading')], ['palavras', 'spellcheck', tx('Palavras', 'Words')], ['reforco', 'auto_stories', tx('Reforço', 'Practice')]].map(([key, i, n]) => `<div class="flex items-center gap-3"><span class="w-28 flex items-center gap-1.5 text-label-md text-on-surface">${I(i, 'text-[18px] text-primary')} ${n}</span><input type="range" min="10" max="80" step="5" value="${d.pilares[key]}" data-pil="${key}" class="flex-1"><b data-pv="${key}" class="w-14 text-right text-label-md text-on-surface">${Math.round(d.minutos * d.pilares[key] / tot)} min</b></div>`).join('')}</div>
          <p class="text-body-sm text-on-surface-variant mt-1">${tx('As três partes somam sempre o tempo do dia: ao mexer uma, as outras se ajustam.', 'The three parts always add up to the daily time: move one and the others adjust.')}</p>
          ${lbl(tx('Dias de estudo', 'Study days'))}<div class="flex gap-1.5">${DIAS().map((n, i) => `<button data-dia="${i}" class="w-10 h-10 rounded-full text-label-md ${d.dias.includes(i) ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-on-surface-variant'}">${n}</button>`).join('')}</div>
          ${lbl(A().kids.length > 1 ? tx('PIN da criança (4 números) · recomendado com mais de uma criança', "Child's PIN (4 digits) · recommended with more than one child") : tx('PIN da criança (4 números, opcional)', "Child's PIN (4 digits, optional)"))}<input class="${inputCls} max-w-[180px] tracking-[0.4em] text-center" id="pin" inputmode="numeric" maxlength="4" placeholder="••••">
          ${k ? `<a href="#" id="nopin" class="inline-block mt-2 text-label-sm text-primary underline">${tx('Tirar o PIN', 'Remove PIN')}</a>` : ''}
          <div id="err" class="text-label-md text-error min-h-[1.2em] mt-3"></div>
          <div class="space-y-3 mt-1">${btnP('save', tx('Salvar', 'Save'), 'check')}${!first ? btnS('cancel', tx('Cancelar', 'Cancel')) : ''}</div>
          ${k ? `<p class="text-center mt-5"><a href="#" id="arch" class="text-label-md text-error underline">${tx('Remover esta criança', 'Remove this child')}</a></p>` : ''}
        </div></div>`, first, drawn); drawn = true;
      const keep = () => { d.apelido = $('#ap').value; d.idade = +$('#id').value || null; d.serie = $('#se').value; d.mes_nasc = +$('#mes').value || null; };
      app().querySelectorAll('[data-av]').forEach(b => b.onclick = () => { keep(); d.avatar = b.dataset.av; draw(); });
      app().querySelectorAll('[data-lg]').forEach(b => b.onclick = () => { keep(); d.idioma_app = b.dataset.lg; draw(); });
      app().querySelectorAll('[data-es]').forEach(b => b.onclick = () => { keep(); d.estilo = b.dataset.es; draw(); });
      app().querySelectorAll('[data-tm]').forEach(b => b.onclick = () => { keep(); d.tema = b.dataset.tm; draw(); });
      app().querySelectorAll('[data-dia]').forEach(b => b.onclick = () => { keep(); const i = +b.dataset.dia; d.dias = d.dias.includes(i) ? d.dias.filter(x => x !== i) : d.dias.concat(i).sort(); draw(); });
      // tudo atualiza AO VIVO enquanto arrasta (sem redesenhar a tela)
      const PK = ['leitura', 'palavras', 'reforco'];
      const showPil = () => { PK.forEach(k => { const b = app().querySelector(`[data-pv="${k}"]`); if (b) b.textContent = Math.round(d.minutos * d.pilares[k] / 100) + ' min'; const r = app().querySelector(`[data-pil="${k}"]`); if (r && +r.value !== d.pilares[k]) r.value = d.pilares[k]; }); };
      const norm = () => { const t = PK.reduce((a, k) => a + d.pilares[k], 0) || 1; PK.forEach(k => d.pilares[k] = Math.round(d.pilares[k] * 100 / t)); d.pilares.reforco = 100 - d.pilares.leitura - d.pilares.palavras; };
      norm(); showPil();
      $('#mn').oninput = e => { d.minutos = +e.target.value; $('#mv').textContent = d.minutos; const a = $('#atv'); if (a) a.textContent = Math.min(40, Math.round(d.minutos * 0.6 + 4)) + ' ' + tx('atividades', 'activities'); showPil(); };
      $('#mn').onchange = () => { keep(); draw(); };
      app().querySelectorAll('[data-pil]').forEach(r => r.oninput = () => {
        const k = r.dataset.pil, v = Math.max(10, Math.min(80, +r.value)), others = PK.filter(x => x !== k);
        const rest = 100 - v, ot = others.reduce((a, x) => a + d.pilares[x], 0) || 1;
        d.pilares[k] = v; let left = rest;
        others.forEach((x, i) => { let nv = i === others.length - 1 ? left : Math.round(rest * d.pilares[x] / ot); nv = Math.max(10, nv); d.pilares[x] = nv; left -= nv; });
        const sum = PK.reduce((a, x) => a + d.pilares[x], 0); if (sum !== 100) { const big = others.sort((a, b) => d.pilares[b] - d.pilares[a])[0]; d.pilares[big] += 100 - sum; }
        showPil();
      });
      const c = $('#cancel'); if (c) c.onclick = () => { tab = 'criancas'; render(); };
      const np = $('#nopin'); if (np) np.onclick = async e => { e.preventDefault(); await DB.rpc('tirar_pin', { crianca: k.id }).then(() => toast('✅')).catch(x => toast(x.message)); };
      const ar = $('#arch'); if (ar) ar.onclick = async e => { e.preventDefault(); if (!confirm(tx(`Remover ${k.apelido}? O progresso fica guardado e pode ser recuperado pelo suporte.`, `Remove ${k.apelido}? Progress is kept and support can restore it.`))) return; await DB.upd('criancas', { eq: { id: k.id } }, { arquivada: true }); await A().loadFamily(); tab = 'criancas'; render(); };
      $('#save').onclick = async () => {
        keep(); const err = $('#err'); err.textContent = '';
        if (!d.apelido.trim()) { err.textContent = tx('Escreva o apelido.', 'Write a nickname.'); return; }
        const pin = $('#pin').value.trim(); if (pin && !/^\d{4}$/.test(pin)) { err.textContent = tx('O PIN tem 4 números.', 'PIN must be 4 digits.'); return; }
        const row = { apelido: d.apelido.trim().slice(0, 30), avatar: d.avatar, idade: d.idade, serie: d.serie || null, idioma_app: d.idioma_app,
          idiomas: Array.from(new Set([d.idioma_app].concat(d.idiomas || []))), estilo: d.estilo, tema: d.tema, minutos: d.minutos, dias: d.dias, pilares: d.pilares };
        try {
          let id = k && k.id;
          const semMes = e => { if (!/mes_nasc|column|schema/i.test(e.message)) throw e; delete row.mes_nasc; };
          row.mes_nasc = d.mes_nasc || null;
          if (k) await DB.upd('criancas', { eq: { id } }, row).catch(async e => { semMes(e); await DB.upd('criancas', { eq: { id } }, row); });
          else { const ins = () => DB.ins('criancas', Object.assign({ familia_id: A().fam.id }, row)); const r = await ins().catch(e => { semMes(e); return ins(); }); id = r[0].id; }
          if (pin) await DB.rpc('definir_pin', { crianca: id, pin });
          await A().loadFamily(); kidSel = id; toast('✅ ' + tx('Salvo', 'Saved'));
          if (first) return A().picker(); tab = 'criancas'; render();
        } catch (x) { err.textContent = x.message; }
      };
    };
    draw();
  }

  /* ================= conta e assinatura ================= */
  const inviteUrl = cod => location.origin + location.pathname.replace(/[^/]*$/, '') + '?convite=' + cod;
  async function conta() {
    const s = A().sub || {};
    const moeda = localStorage.getItem('qk.moeda') || (pt() ? 'brl' : 'usd');
    const [precos, vagas, conv] = await Promise.all([DB.sel('precos', { eq: { moeda } }).catch(() => []), DB.rpc('vagas_fundador').catch(() => 0), DB.sel('convites', { eq: { familia_id: A().fam.id } }).catch(() => [])]);
    const fund = moeda === 'brl' && vagas > 0;
    const pick = pl => precos.find(p => p.plano === pl && !!p.fundador === fund) || precos.find(p => p.plano === pl);
    const pnome = { teste: tx('Teste grátis', 'Free trial'), mensal: tx('Mensal · Básico', 'Monthly · Basic'), semestral: tx('Semestral ✨ Com IA', '6 months ✨ with AI'), anual: tx('Anual ✨ Com IA', 'Yearly ✨ with AI'), cortesia: tx('Cortesia', 'Complimentary') };
    const paying = ['mensal', 'semestral', 'anual'].includes(s.plano) && s.status !== 'canceled';
    const stTxt = ({ trialing: tx('em teste', 'trial'), active: tx('ativo', 'active'), past_due: tx('pagamento pendente', 'payment due'), canceled: tx('cancelado', 'canceled') })[s.status] || s.status || '';
    shell(`<h1 class="text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">${tx('Conta', 'Account')}</h1>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div class="lg:col-span-2 space-y-5">
        <section class="${card} space-y-2"><div class="flex items-center justify-between gap-2"><div><p class="text-label-sm text-on-surface-variant uppercase">${tx('Seu plano', 'Your plan')}</p><b class="text-headline-md text-on-surface">${pnome[s.plano] || s.plano}</b></div><span class="text-label-sm bg-primary/10 text-primary px-2.5 py-1 rounded-full">${esc(stTxt)}</span></div>
          ${A().trialLeft() !== null ? `<p class="text-body-md text-on-surface-variant">${tx(`Faltam <b class="text-on-surface">${A().trialLeft()} dias</b> de teste grátis. Sem cartão: escolha um plano quando quiser.`, `<b class="text-on-surface">${A().trialLeft()} days</b> of free trial left. No card needed until you pick a plan.`)}</p>` : ''}
          ${s.valido_ate && paying ? `<p class="text-body-sm text-on-surface-variant">${tx('Renova em', 'Renews on')} ${new Date(s.valido_ate).toLocaleDateString(pt() ? 'pt-BR' : 'en-US')}</p>` : ''}
          ${paying ? btnS('portal', tx('Gerenciar assinatura (cartão, trocar ou cancelar)', 'Manage subscription (card, switch or cancel)'), 'credit_card') : ''}</section>
        ${!paying && s.plano !== 'cortesia' ? `<section class="space-y-3"><div class="flex items-center justify-between gap-2"><h2 class="text-headline-md text-on-surface">${tx('Escolha seu plano', 'Choose your plan')}</h2>${seg([['brl', 'R$'], ['usd', 'US$']], moeda, 'data-m')}</div>
          ${fund ? `<div class="bg-secondary-fixed text-on-secondary-fixed rounded-2xl p-3.5 flex items-center gap-3">${I('redeem', 'text-[22px]')}<span class="text-label-md">${tx(`Preço de fundador: restam ${vagas} vagas. O preço fica com você enquanto mantiver a assinatura.`, `Founder price: ${vagas} spots left.`)}</span></div>` : ''}
          <div class="max-w-xl">${QKOnboard.plansHtml(precos, moeda, fund, localStorage.getItem('qk.planoEscolhido') || 'anual')}
          <div class="mt-4">${btnP('assinar', tx('Assinar o plano escolhido', 'Subscribe to the selected plan'), 'workspace_premium')}</div>
          <p class="text-body-sm text-on-surface-variant mt-3">${tx('A assinatura renova automaticamente no fim de cada período até você cancelar aqui em Conta → Gerenciar assinatura. Você vê o valor e a data da primeira cobrança antes de confirmar o pagamento.', 'The subscription renews automatically at the end of each period until you cancel here in Account → Manage subscription. You see the amount and the first charge date before confirming payment.')}</p></div>
          <p class="text-label-sm text-on-surface-variant text-center">${moeda === 'brl' ? 'Cartão de crédito ou Pix · Cancele quando quiser' : 'Credit card · Cancel anytime'}</p></section>` : ''}
      </div>
      <div class="space-y-5">
        <section class="${card} space-y-3"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('group_add', 'text-primary')} ${tx('Outro responsável', 'Another parent')}</h2>
          <p class="text-body-sm text-on-surface-variant">${tx('Convide o pai, a mãe ou outro responsável para acompanhar as mesmas crianças. É grátis.', 'Invite another parent to follow the same kids. It’s free.')}</p>
          ${lbl(tx('E-mail do outro responsável (opcional)', "Other parent's email (optional)"))}
          <input class="${inputCls}" id="ivm" type="email" autocomplete="off" inputmode="email" placeholder="${tx('ex.: nome@gmail.com', 'e.g. name@gmail.com')}" value="${esc((conv[0] && conv[0].email) || '')}">
          <p class="text-body-sm text-on-surface-variant -mt-1">${tx('Quando essa pessoa criar a conta ou entrar com este e-mail, ela já entra na sua família, sem código.', 'When this person signs up or logs in with this email, they join your family automatically.')}</p>
          ${btnP('inv', tx('Enviar convite (WhatsApp, mensagem…)', 'Send invite (WhatsApp, text…)'), 'share')}
          ${conv.length ? `<details class="bg-surface-container-low rounded-xl p-3"><summary class="text-label-md text-on-surface-variant cursor-pointer">${tx('Ver código e link', 'See code and link')}</summary><b class="block text-headline-md tracking-[0.2em] text-on-surface mt-2">${esc(conv[0].codigo)}</b><span class="text-body-sm text-on-surface-variant break-all">${esc(inviteUrl(conv[0].codigo))}</span><p class="text-body-sm text-on-surface-variant mt-1">${tx('Vale por 3 dias.', 'Valid for 3 days.')}</p></details>` : ''}
          <details class="pt-1"><summary class="text-label-md text-primary cursor-pointer">${tx('Recebeu um código de outra família?', 'Got a code from another family?')}</summary>
          <div class="flex gap-2 mt-2"><input class="${inputCls} uppercase" id="cod" maxlength="8" autocapitalize="characters" placeholder="${tx('Código', 'Code')}"><button id="acc" class="h-12 px-5 rounded-xl bg-primary-container text-on-primary text-label-lg">OK</button></div></details></section>
        <section class="${card} space-y-3"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('lock', 'text-primary')} ${tx('Senha dos pais', 'Parents password')}</h2><p class="text-body-sm text-on-surface-variant">${tx('4 números para entrar nesta área. As crianças não devem saber.', '4 digits to enter this area. Keep it from the kids.')}</p>${btnS('senha', tx('Mudar a senha dos pais', 'Change parents password'), 'password')}</section>
        <section class="${card} space-y-3"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('volume_up', 'text-primary')} ${tx('Sons do app', 'App sounds')}</h2><p class="text-body-sm text-on-surface-variant">${tx('Sons baixinhos quando a criança acerta, erra ou termina. Ajudam você a perceber que ela está fazendo a lição.', 'Soft sounds when your child gets it right, wrong or finishes. They let you hear the lesson is happening.')}</p>${seg([['1', '🔊 ' + tx('Ligado', 'On')], ['0', '🔇 ' + tx('Desligado', 'Off')]], localStorage.getItem('qk.som') === '0' ? '0' : '1', 'data-som')}</section>
        <section class="${card} space-y-3"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('language', 'text-primary')} ${tx('Idioma do painel', 'Panel language')}</h2>${seg([['pt', 'Português'], ['en', 'English']], QK.lang, 'data-l')}</section>
        <section class="${card} space-y-2"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('help', 'text-primary')} ${tx('Ajuda', 'Help')}</h2>
          <p class="text-body-sm text-on-surface-variant">${tx('Suporte', 'Support')}: <a class="text-primary underline" href="mailto:${C.SUPORTE_EMAIL}">${C.SUPORTE_EMAIL}</a></p>
          <p class="text-body-sm"><a class="text-primary underline" href="../termos.html">${tx('Termos de Uso', 'Terms')}</a> · <a class="text-primary underline" href="../privacidade.html">${tx('Política de Privacidade', 'Privacy Policy')}</a></p>
          <p class="text-body-sm text-on-surface-variant">${tx('Para apagar todos os dados da família, escreva para o suporte.', 'To delete all family data, email support.')}</p>
          <p class="text-label-sm text-outline">${esc((Auth.user && Auth.user.email) || '')}</p>${btnS('out', t('sair'), 'logout')}</section>
      </div></div>`);
    app().querySelectorAll('[data-m]').forEach(b => b.onclick = () => { localStorage.setItem('qk.moeda', b.dataset.m); render(); });
    app().querySelectorAll('[data-som]').forEach(b => b.onclick = () => { try { localStorage.setItem('qk.som', b.dataset.som); } catch (e) {} if (b.dataset.som === '1') A().sfx('ok'); render(); });
    app().querySelectorAll('[data-at]').forEach(b => b.onclick = () => { A().setAdultTema(b.dataset.at); render(); });
    app().querySelectorAll('[data-l]').forEach(b => b.onclick = () => { QK.setLang(b.dataset.l); render(); });
    const as = $('#assinar'); if (as) as.onclick = async () => {
      const sel = QKOnboard.planSel(); if (!sel) return toast(tx('Escolha um plano.', 'Pick a plan.'));
      const p = precos.find(x => x.codigo === sel.codigo); if (p && !p.stripe_price_id && !QK.DEMO) return toast(tx('Pagamento ainda não liberado. Em breve!', 'Payments not open yet. Coming soon!'), 3500);
      as.disabled = true;
      try { const r = await DB.fn('checkout', { codigo: sel.codigo, volta: location.origin + location.pathname }); location.href = r.url; }
      catch (x) { toast(x.message); as.disabled = false; }
    };
    app().querySelectorAll('input[name=plano]').forEach(r => r.onchange = () => { try { localStorage.setItem('qk.planoEscolhido', r.value); } catch (e) {} });
    const po = $('#portal'); if (po) po.onclick = async () => { try { const r = await DB.fn('portal', { volta: location.origin + location.pathname }); location.href = r.url; } catch (x) { toast(x.message); } };
    $('#inv').onclick = async () => {
      const email = $('#ivm').value.trim().toLowerCase();
      if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return toast(tx('Confira o e-mail.', 'Check the email.'));
      let c = conv[0];
      try {
        if (!c || (email && c.email !== email) || new Date(c.expira_em) < new Date()) {
          await DB.del('convites', { eq: { familia_id: A().fam.id } }).catch(() => {});
          const row = { familia_id: A().fam.id }; if (email) { row.email = email; row.expira_em = new Date(Date.now() + 30 * 864e5).toISOString(); }
          const r = await DB.ins('convites', row).catch(e => { if (email && /email|column|schema/i.test(e.message)) return DB.ins('convites', { familia_id: A().fam.id }); throw e; });
          c = r[0];
        }
        const url = inviteUrl(c.codigo), kids = A().kids.map(k => k.apelido).join(', ');
        const msg = tx(`Oi! Entra no Quest Kids para acompanhar ${kids || 'as crianças'} comigo. É só abrir o link e criar sua conta${email ? ' com este e-mail: ' + email : ''}: ${url} (código ${c.codigo}, vale ${email ? '30' : '3'} dias)`, `Hi! Join me on Quest Kids to follow ${kids || 'the kids'}. Open the link and create your account${email ? ' with this email: ' + email : ''}: ${url} (code ${c.codigo}, valid ${email ? 30 : 3} days)`);
        if (navigator.share) { try { await navigator.share({ title: 'Quest Kids', text: msg }); } catch (e) {} }
        else window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
        render();
      } catch (x) { toast(x.message); }
    };
    $('#acc').onclick = async () => { const c = $('#cod').value.trim(); if (!c) return; try { await DB.rpc('aceitar_convite', { cod: c }); toast('✅ ' + tx('Você entrou na família!', 'You joined the family!')); await A().loadFamily(); A().picker(); } catch (x) { toast(A().inviteErr(x), 4500); } };
    $('#senha').onclick = () => A().createParentPass(() => { tab = 'conta'; open().then(() => { tab = 'conta'; render(); }); });
    $('#out').onclick = async () => { await Auth.signOut(); A().boot(); };
  }

  window.QKParent = { open, newChild };
})();
