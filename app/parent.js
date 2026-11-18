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
    document.body.dataset.area = 'pais';
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

  async function open() {
    tab = 'resumo'; await A().loadFamily().catch(() => {}); kidSel = kidSel && A().kids.find(k => k.id === kidSel) ? kidSel : (A().kids[0] || {}).id;
    // resultado de simulado novo: abre direto na criança que fez (o resultado aparece primeiro)
    try {
      const ss = await DB.sel('tentativas', { inn: { crianca_id: A().kids.map(k => k.id) }, eq: { tipo: 'simulado' }, order: 'iniciada_em.desc', limit: 10 });
      const novo = ss.find(t => t.iniciada_em > (localStorage.getItem('qk.simvisto.' + t.crianca_id) || ''));
      if (novo) kidSel = novo.crianca_id;
    } catch (e) {}
    render();
  }
  function render() {
    shell('<div class="spin" style="margin-top:20vh"></div>');
    ({ resumo, corrigir, material, criancas, conta, gestao })[tab]().catch(x => shell(`<div class="${card}"><p class="text-body-md">😕 ${esc(x.message)}</p></div>`));
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
    const fbs = await DB.sel('feedback_prova', { eq: { crianca_id: kid.id } }).catch(() => null);
    const modos = await DB.sel('progresso', { eq: { crianca_id: kid.id, chave: 'modo' } }).catch(() => []);
    const provaPassou = fbs === null ? null : lics.find(l => l.conteudo && l.conteudo.modo_prova && l.conteudo.data_prova && l.conteudo.data_prova < today() && l.conteudo.data_prova >= addDays(today(), -30) && !fbs.some(f => f.licao_id === l.id));
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
      ${provaCard(lics.map(l => Object.assign({ crianca_id: kid.id }, l)), modos)}
      ${tl !== null ? `<button id="toplan" class="w-full text-left bg-secondary-fixed text-on-secondary-fixed rounded-2xl p-3.5 flex items-center gap-3">${I('hourglass_top', 'text-[22px]')}<span class="text-label-md flex-1">${tx(`Teste grátis: faltam ${tl} dias.`, `Free trial: ${tl} days left.`)}</span><span class="text-label-md underline">${tx('Ver planos', 'See plans')}</span></button>` : ''}
      ${pend ? `<button data-go="corrigir" class="w-full text-left bg-secondary-fixed/60 text-on-secondary-fixed rounded-2xl p-3.5 flex items-center gap-3">${I('rate_review', 'text-[22px]')}<span class="text-label-md">${pend} ${pend === 1 ? tx('item esperando sua correção', 'item waiting for your review') : tx('itens esperando sua correção', 'items waiting for your review')}</span></button>` : ''}
      ${provaPassou ? `<section class="${card} space-y-3 ring-2 ring-secondary-container"><h2 class="text-headline-md text-on-surface">🎓 ${tx(`Como foi a prova de ${esc(provaPassou.titulo || '')}?`, `How did the ${esc(provaPassou.titulo || '')} test go?`)}</h2>
        <p class="text-body-sm text-on-surface-variant">${tx(`A prova foi em ${fmtD(provaPassou.conteudo.data_prova)}. Conte a nota para acompanharmos se o estudo está funcionando.`, `The test was on ${fmtD(provaPassou.conteudo.data_prova)}. Share the grade so we can see if the practice is working.`)}</p>
        <div class="grid grid-cols-3 gap-2"><label class="text-label-sm text-on-surface-variant">${tx('Nota (0 a 10)', 'Grade (0–10)')}<input id="fbn" type="number" min="0" max="10" step="0.1" inputmode="decimal" class="${inputCls} mt-1"></label><label class="col-span-2 text-label-sm text-on-surface-variant">${tx('Comentário (opcional)', 'Comment (optional)')}<input id="fbc" maxlength="600" class="${inputCls} mt-1" placeholder="${tx('Ex.: tirou a melhor nota do ano!', 'E.g. best grade of the year!')}"></label></div>
        <label class="flex items-start gap-2 text-body-sm text-on-surface"><input id="fba" type="checkbox" class="mt-0.5 w-5 h-5"> ${tx('Autorizo o Quest Kids a usar meu comentário como depoimento (sem o nome da criança).', 'I allow Quest Kids to use my comment as a testimonial (without the child’s name).')}</label>
        <div class="grid grid-cols-2 gap-2"><button id="fbsave" class="h-11 rounded-xl bg-primary-container text-on-primary text-label-md">${tx('Enviar', 'Send')}</button><button id="fbrel" class="h-11 rounded-xl bg-surface-container text-on-surface text-label-md">📊 ${tx('Relatório até a prova', 'Report up to the test')}</button></div></section>` : ''}
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
        ${sims.length ? (() => { const g = {}; sims.slice().reverse().forEach(t => { const sm = t.leitura.simulado, k = (sm.materias && sm.materias.length === 1 ? sm.materias[0] : sm.materias && sm.materias.length ? tx('Várias matérias', 'Several subjects') : tx('Todas as matérias', 'All subjects')); (g[k] = g[k] || []).push(sm.nota); });
          return `<div class="bg-surface-container-low rounded-2xl p-3 space-y-1.5"><b class="text-label-lg text-on-surface">📚 ${tx('Notas dos simulados por matéria', 'Practice test grades by subject')}</b>${Object.entries(g).map(([m, ns]) => `<div class="flex items-center justify-between gap-2 text-body-md"><span class="text-on-surface truncate">${esc(m)}</span><b class="text-on-surface whitespace-nowrap">${ns.map(fmtN1).join(' → ')}${ns.length > 1 ? (ns[ns.length - 1] > ns[0] ? ' 📈' : ns[ns.length - 1] < ns[0] ? ' 📉' : '') : ''}</b></div>`).join('')}</div>`; })() : ''}
        <button id="simhist" class="w-full h-11 rounded-xl bg-surface-container text-on-surface text-label-md">📚 ${tx('Ver todos os resultados dos simulados', 'See all practice test results')}</button>
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
    if (provaPassou) {
      $('#fbsave').onclick = async () => { const n = parseFloat(String($('#fbn').value).replace(',', '.')); if (isNaN(n) || n < 0 || n > 10) return toast(tx('Coloque a nota de 0 a 10.', 'Enter a grade from 0 to 10.')); try { await DB.ins('feedback_prova', { familia_id: A().fam.id, crianca_id: kid.id, licao_id: provaPassou.id, materia: provaPassou.titulo, nota: n, comentario: $('#fbc').value.trim() || null, autoriza_depoimento: $('#fba').checked }); toast('💛 ' + tx('Obrigada por contar!', 'Thanks for sharing!')); render(); } catch (x) { toast(x.message); } };
      $('#fbrel').onclick = () => { const dd = Math.ceil((new Date(provaPassou.conteudo.data_prova) - new Date(provaPassou.criado_em)) / 864e5) + 1; periodo = dd <= 10 ? 7 : dd <= 40 ? 30 : 90; maisGraf = true; render(); };
    }
    $('#rcopy').onclick = async () => { try { await navigator.clipboard.writeText(texto); toast('📋 ' + tx('Copiado!', 'Copied!')); } catch (e) { const r = document.createRange(); r.selectNodeContents($('#rtxt')); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); toast(tx('Texto selecionado: toque em Copiar.', 'Text selected: tap Copy.')); } };
    $('#rshare').onclick = async () => { if (navigator.share) { try { await navigator.share({ title: 'Quest Kids', text: texto }); } catch (e) {} } else window.open('https://wa.me/?text=' + encodeURIComponent(texto), '_blank'); };
    $('#rmail').onclick = () => { location.href = 'mailto:?subject=' + encodeURIComponent(tx(`Relatório Quest Kids — ${nm}`, `Quest Kids report — ${nm}`)) + '&body=' + encodeURIComponent(texto); };
    $('#rpdf').onclick = () => pdfReport(kid, texto, { M, Pv, W, ph, est, sims, ini, fim, maxWords, line });
    $('#simsave').onclick = async () => {
      const cfg = { n: +$('#sn').value, tempo: +$('#st').value || 0, licoes: $('#sl').value ? [$('#sl').value] : null, criado: new Date().toISOString(), feito: false };
      try { await DB.ins('progresso', { crianca_id: kid.id, chave: 'sim', dados: cfg, atualizado_em: new Date().toISOString() }, { upsert: true, onConflict: 'crianca_id,chave' }); toast('✅ ' + tx('Pronto! O simulado aparece na tela da criança.', "Done! The test shows on your child's screen."), 4000); render(); } catch (x) { toast(x.message); }
    };
    const visto = (() => { try { return localStorage.getItem('qk.simvisto.' + kid.id) || ''; } catch (e) { return ''; } })();
    if (sims[0] && sims[0].iniciada_em > visto) { try { localStorage.setItem('qk.simvisto.' + kid.id, sims[0].iniciada_em); } catch (e) {} setTimeout(() => simModal(sims[0], true), 300); }
    app().querySelectorAll('[data-sim]').forEach(b => b.onclick = () => simModal(sims[+b.dataset.sim]));
    function simModal(t2, novo) { simCard(kid, t2, { novo, todos: sims, onNovo: () => { const e2 = $('#simsave'); if (e2) e2.scrollIntoView({ behavior: 'smooth', block: 'center' }); } }); }
    const sh = $('#simhist'); if (sh) sh.onclick = () => simHistorico(kid);
  }
  const fmtD = d => new Date(d + 'T12:00').toLocaleDateString(pt() ? 'pt-BR' : 'en-US', { day: '2-digit', month: 'short' });
  /* ---------- resultado do simulado: cartão bonito e motivador para os pais ---------- */
  const MODO_TAG = { prova: ['📝', () => tx('Modo prova', 'Test mode'), 'bg-tertiary-container/30'], estudo: ['📘', () => tx('Estudo do dia a dia', 'Everyday study'), 'bg-primary-fixed/40'], ferias: ['🏖️', () => tx('Modo férias', 'Holiday mode'), 'bg-secondary-container/30'] };
  const nota1 = n => (Math.round((+n || 0) * 10) / 10).toLocaleString(pt() ? 'pt-BR' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  function simCard(kid, t2, o) {
    o = o || {};
    const sm = t2.leitura.simulado, nota = +sm.nota || 0, its = (t2.itens || []).filter(i => i.correct === true || i.correct === false);
    const certas = its.filter(i => i.correct).length, total = its.length || t2.total || 0, mins = Math.max(1, Math.round((t2.duracao_seg || 0) / 60));
    const ant = (o.todos || []).filter(x => x.iniciada_em < t2.iniciada_em && x.leitura && x.leitura.simulado).sort((a, b) => b.iniciada_em.localeCompare(a.iniciada_em))[0];
    const dif = ant ? Math.round((nota - ant.leitura.simulado.nota) * 10) / 10 : null;
    const por = {}; its.forEach(i => { const n = A().skillInfo(i.skill || '').name || i.skill; if (!n) return; por[n] = por[n] || [0, 0]; por[n][i.correct ? 0 : 1]++; });
    const fortes = Object.keys(por).filter(n => por[n][0] > por[n][1]), reforcar = Object.keys(por).filter(n => por[n][1] && !fortes.includes(n));
    const cor = nota >= 7 ? 'from-primary-container to-primary' : nota >= 5 ? 'from-secondary-container to-secondary' : 'from-tertiary-container to-tertiary';
    const msg = nota >= 9 ? tx(`Excelente! ${esc(kid.apelido)} domina este conteúdo. 🌟`, `Excellent! ${esc(kid.apelido)} has mastered this. 🌟`)
      : nota >= 7 ? tx('Muito bem! Está no caminho certo para a prova. 🎉', 'Well done! On the right track for the test. 🎉')
      : nota >= 5 ? tx('Bom começo! Com mais alguns dias de revisão a nota sobe. 💪', 'Good start! A few more days of review will raise the grade. 💪')
      : tx('Ótimo momento para descobrir o que revisar, antes da prova de verdade. Vamos juntos! 💙', 'A great time to find out what to review, before the real test. We’ve got this! 💙');
    const tag = MODO_TAG[sm.modo] || null, mat = (sm.materias || []).join(', ');
    const resp = i => esc(String(i.answer || '—')).replace(/ \| /g, ' → ');
    const ov = document.createElement('div'); ov.className = 'fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center';
    ov.innerHTML = `<div class="bg-surface w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl badge-pop">
      <div class="relative bg-gradient-to-br ${cor} text-white p-5 pb-6 rounded-t-3xl">
        <button data-x class="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/25 text-white text-[18px]" aria-label="${tx('Fechar', 'Close')}">✕</button>
        <p class="text-label-md opacity-90">${o.novo ? '🎉 ' + tx('Chegou o resultado!', 'The result is in!') : '📝 ' + tx('Resultado do simulado', 'Practice test result')} · ${fmtD(String(t2.iniciada_em).slice(0, 10))}</p>
        <div class="flex items-center gap-4 mt-3"><div class="w-24 h-24 rounded-full bg-white/95 flex flex-col items-center justify-center shrink-0 shadow-lg"><span class="text-[34px] font-black text-on-surface leading-none">${nota1(nota)}</span><span class="text-[11px] text-on-surface-variant">${tx('de 10', 'out of 10')}</span></div>
          <div class="min-w-0"><p class="text-headline-md leading-snug">${esc(kid.avatar || '')} ${esc(kid.apelido)}</p><p class="text-body-md opacity-95 mt-1">${msg}</p></div></div>
        <div class="flex gap-1.5 flex-wrap mt-3">${tag ? `<span class="px-2.5 py-1 rounded-full bg-white/25 text-label-sm">${tag[0]} ${tag[1]()}</span>` : ''}${mat ? `<span class="px-2.5 py-1 rounded-full bg-white/25 text-label-sm truncate max-w-full">📚 ${esc(mat.slice(0, 60))}</span>` : ''}</div></div>
      <div class="p-5 space-y-4">
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="bg-surface-container-low rounded-2xl p-2.5"><b class="text-headline-md text-on-surface block">${certas}/${total}</b><span class="text-[11px] text-on-surface-variant">${tx('acertos', 'right')}</span></div>
          <div class="bg-surface-container-low rounded-2xl p-2.5"><b class="text-headline-md text-on-surface block">${mins} min</b><span class="text-[11px] text-on-surface-variant">${sm.tempo ? tx(`de ${sm.tempo} min`, `of ${sm.tempo} min`) : tx('no total', 'total')}</span></div>
          <div class="bg-surface-container-low rounded-2xl p-2.5"><b class="text-headline-md block ${dif === null ? 'text-on-surface' : dif > 0 ? 'text-primary' : dif < 0 ? 'text-on-surface-variant' : 'text-on-surface'}">${dif === null ? '1º' : (dif > 0 ? '▲ +' : dif < 0 ? '▼ ' : '= ') + nota1(Math.abs(dif))}</b><span class="text-[11px] text-on-surface-variant">${dif === null ? tx('primeiro simulado', 'first test') : tx('vs. anterior', 'vs. last')}</span></div></div>
        ${fortes.length ? `<div><p class="text-label-lg text-on-surface mb-1.5">💪 ${tx('Pontos fortes', 'Strengths')}</p><div class="flex flex-wrap gap-1.5">${fortes.slice(0, 8).map(x => `<span class="px-3 py-1 rounded-full bg-primary-fixed/50 text-on-surface text-label-sm">✓ ${esc(x)}</span>`).join('')}</div></div>` : ''}
        ${reforcar.length ? `<div><p class="text-label-lg text-on-surface mb-1.5">🎯 ${tx('Vamos reforçar', "Let's reinforce")}</p><div class="flex flex-wrap gap-1.5">${reforcar.slice(0, 8).map(x => `<span class="px-3 py-1 rounded-full bg-secondary-fixed/60 text-on-surface text-label-sm">${esc(x)}</span>`).join('')}</div>
          <p class="text-body-sm text-on-surface-variant mt-2">✨ ${tx('O app já vai trazer mais perguntas desses assuntos nas próximas lições, sem você precisar fazer nada.', 'The app will bring more questions on these topics in the next lessons, automatically.')}</p></div>` : `<p class="text-body-md text-primary font-bold">🎉 ${tx('Acertou tudo!', 'All correct!')}</p>`}
        ${its.some(i => !i.correct) ? `<details class="bg-surface-container-low rounded-2xl p-3"><summary class="text-label-md text-primary cursor-pointer">${tx('Ver as perguntas para revisar juntos', 'See the questions to review together')}</summary><div class="space-y-2 mt-2">
          ${its.filter(i => !i.correct).map(i => `<div class="bg-surface-container-lowest rounded-xl p-3 space-y-1">${i.prompt ? `<p class="text-body-md text-on-surface">${md(i.prompt)}</p>` : `<p class="text-label-md text-on-surface">${esc(A().skillInfo(i.skill || '').name || '')}</p>`}${i.certa ? `<p class="text-body-sm text-primary font-bold">✓ ${md(String(i.certa).replace(/\n/g, ' → '))}</p>` : ''}<p class="text-body-sm text-on-surface-variant">${tx('Respondeu', 'Answered')}: ${resp(i)}</p></div>`).join('')}</div></details>` : ''}
        <div class="bg-primary-fixed/20 rounded-2xl p-3 text-body-sm text-on-surface">💬 ${tx(`Dica: elogie o esforço ("você se dedicou muito!") e revisem 1 ou 2 perguntas juntos. Errar no simulado é ótimo: é aqui que se aprende, antes da prova.`, 'Tip: praise the effort ("you worked so hard!") and review 1 or 2 questions together. Mistakes in practice are great: this is where learning happens, before the test.')}</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">${o.onNovo ? `<button data-novo class="h-12 rounded-xl bg-primary-container text-on-primary text-label-lg">🧪 ${tx('Marcar outro simulado', 'Set another test')}</button>` : ''}<button data-hist class="h-12 rounded-xl bg-surface-container text-on-surface text-label-lg">📚 ${tx('Ver todos os simulados', 'See all practice tests')}</button></div>
        <button data-x class="w-full h-11 rounded-xl text-label-md text-on-surface-variant">${tx('Fechar', 'Close')}</button>
        <p class="text-[11px] text-on-surface-variant">ℹ️ ${DISC()}</p></div></div>`;
    document.body.appendChild(ov);
    ov.onclick = e => { if (e.target === ov || e.target.closest('[data-x]')) ov.remove(); };
    const nb = ov.querySelector('[data-novo]'); if (nb) nb.onclick = () => { ov.remove(); o.onNovo(); };
    ov.querySelector('[data-hist]').onclick = () => { ov.remove(); simHistorico(kid); };
  }
  // histórico de todos os simulados, por matéria e por modo
  async function simHistorico(kid) {
    const ts = await DB.sel('tentativas', { eq: { crianca_id: kid.id, tipo: 'simulado' }, order: 'iniciada_em.desc', limit: 60 }).catch(() => []);
    const sims = ts.filter(t => t.leitura && t.leitura.simulado);
    const g = {}; sims.forEach(t => { const sm = t.leitura.simulado, k = (sm.materias || []).length === 1 ? sm.materias[0] : (sm.materias || []).length ? tx('Várias matérias', 'Several subjects') : tx('Todas as matérias', 'All subjects'); (g[k] = g[k] || []).push(t); });
    const ov = document.createElement('div'); ov.className = 'fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center';
    ov.innerHTML = `<div class="bg-surface w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-5 space-y-4 badge-pop">
      <div class="flex items-center justify-between gap-2"><h3 class="text-headline-md text-on-surface">📚 ${tx('Simulados de', 'Practice tests ·')} ${esc(kid.avatar || '')} ${esc(kid.apelido)}</h3><button data-x class="w-10 h-10 rounded-full bg-surface-container shrink-0">✕</button></div>
      ${sims.length ? Object.entries(g).map(([m, arr]) => { const ns = arr.slice().reverse().map(t => t.leitura.simulado.nota); return `<section class="bg-surface-container-low rounded-2xl p-3 space-y-2"><div class="flex items-center justify-between gap-2"><b class="text-label-lg text-on-surface truncate">${esc(m)}</b><span class="text-label-md text-on-surface whitespace-nowrap">${ns.map(nota1).join(' → ')}${ns.length > 1 ? (ns[ns.length - 1] > ns[0] ? ' 📈' : ns[ns.length - 1] < ns[0] ? ' 📉' : '') : ''}</span></div>
        ${arr.map(t => { const sm = t.leitura.simulado, tg = MODO_TAG[sm.modo]; return `<button data-sid="${esc(t.id)}" class="w-full text-left bg-surface-container-lowest rounded-xl p-2.5 flex items-center gap-3"><span class="w-12 h-12 rounded-full ${sm.nota >= 7 ? 'bg-primary-container text-on-primary' : sm.nota >= 5 ? 'bg-secondary-container text-on-secondary-container' : 'bg-tertiary-container text-on-tertiary-container'} flex items-center justify-center text-label-lg font-black shrink-0">${nota1(sm.nota)}</span><span class="flex-1 min-w-0"><b class="text-label-md text-on-surface block">${fmtD(String(t.iniciada_em).slice(0, 10))} · ${t.acertos}/${t.total} ${tx('certas', 'right')}</b>${tg ? `<span class="inline-block mt-0.5 px-2 py-0.5 rounded-full ${tg[2]} text-[11px] text-on-surface">${tg[0]} ${tg[1]()}</span>` : ''}</span>${I('chevron_right', 'text-on-surface-variant')}</button>`; }).join('')}</section>`; }).join('')
        : `<p class="text-body-md text-on-surface-variant">${tx('Ainda não tem simulado. Marque um no Resumo, em "Preparar um simulado".', 'No practice tests yet. Set one up in Summary.')}</p>`}
      <p class="text-[11px] text-on-surface-variant">ℹ️ ${DISC()}</p></div>`;
    document.body.appendChild(ov);
    ov.onclick = e => { if (e.target === ov || e.target.closest('[data-x]')) ov.remove(); };
    ov.querySelectorAll('[data-sid]').forEach(b => b.onclick = () => { const t = sims.find(x => x.id === b.dataset.sid); ov.remove(); simCard(kid, t, { todos: sims }); });
  }
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
        if (!url) throw new Error(tx('Esta gravação não ficou guardada (no modo demonstração só cabem gravações curtas).', 'This recording was not kept (demo mode only keeps short ones).'));
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

  /* ================= temas narrados (modo férias) ================= */
  const temasCat = tdb => (window.QKTemas ? QKTemas.CAT : []).concat((tdb || []).map(t => ({ id: 'DB-' + t.id, icon: t.icone || '🎧', pt: t.titulo, en: t.titulo, pacote: t.pacote || 'gratis', status: 'pronto', idiomas: [t.idioma], faixas: [t.faixa] })));
  async function comprar(codigo, btn) {
    if (btn) btn.disabled = true;
    try { const r = await DB.fn('checkout', { codigo, volta: location.origin + location.pathname }); location.href = r.url; }
    catch (x) { toast(/indispon|unavailable/i.test(x.message) ? tx('Compra ainda não liberada. Em breve!', 'Purchases not open yet. Coming soon!') : x.message, 4000); if (btn) btn.disabled = false; }
  }
  function temasHtml(own, tcfg, tdb, prodTemas) {
    const cat = temasCat(tdb), temPack = own.includes('ferias1');
    const badge = t => t.status !== 'pronto' ? `<span class="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px]">${tx('Em breve', 'Soon')}</span>` : t.pacote === 'gratis' ? `<span class="px-2 py-0.5 rounded-full bg-primary-container text-on-primary text-[11px]">${tx('Grátis', 'Free')}</span>` : t.pacote === 'ferias1' ? `<span class="px-2 py-0.5 rounded-full ${temPack ? 'bg-primary/15 text-primary' : 'bg-secondary-fixed text-on-secondary-fixed'} text-[11px]">${temPack ? tx('Seu', 'Yours') : tx('Pacote Férias', 'Holiday pack')}</span>` : `<span class="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px]">${tx('Extra', 'Extra')}</span>`;
    const pode = t => QKTemas.liberado(t, own);
    const escolhidos = new Set(); tcfg.forEach(r => ((r.dados && r.dados.ativos) || []).forEach(id => { const t = cat.find(x => x.id === id); if (t && t.pacote !== 'gratis') escolhidos.add(id); }));
    const ativo = (k, t) => { const r = tcfg.find(x => x.crianca_id === k.id); return r && r.dados && r.dados.ativos ? r.dados.ativos.includes(t.id) : t.pacote === 'gratis'; };
    return `<section class="${card} mb-6 space-y-3">
      <div class="flex items-start justify-between gap-2 flex-wrap"><div><h2 class="text-headline-md text-on-surface">🎧 ${tx('Temas narrados · modo férias', 'Narrated topics · holiday mode')}</h2>
        <p class="text-body-sm text-on-surface-variant">${tx('Histórias faladas com palavras novas e perguntas, para estudar o ano todo e nas férias. 2 vêm grátis; o Pacote Férias traz 10 temas (escolhidos de uma lista de 20+).', 'Spoken stories with new words and questions, for the whole year and holidays. 2 are free; the Holiday Pack brings 10 topics (from a list of 20+).')}</p></div>
        ${!temPack && prodTemas ? `<button id="buytemas" class="h-11 px-4 rounded-xl bg-secondary-container text-on-secondary-container text-label-md">🏖️ ${tx('Pacote Férias', 'Holiday Pack')} · ${esc(prodTemas.valor_texto)}</button>` : ''}</div>
      <div class="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">${cat.map(t => `<div class="min-w-[170px] max-w-[170px] rounded-2xl bg-surface-container-low p-3 flex flex-col gap-1.5 ${t.status !== 'pronto' ? 'opacity-60' : ''}">
        <div class="flex items-center justify-between"><span class="text-[30px]">${t.icon}</span>${badge(t)}</div>
        <b class="text-label-md text-on-surface leading-tight line-clamp-3">${esc(pt() ? t.pt : t.en)}</b>
        <span class="text-[11px] text-on-surface-variant">${(t.faixas || []).map(f => f + ' ' + tx('anos', 'yrs')).join(' · ')}${(t.idiomas || []).length ? ' · ' + t.idiomas.map(l => l === 'en' ? '🇺🇸' : '🇧🇷').join('') : ''}</span>
        ${pode(t) ? A().kids.map(k => `<button data-tat="${k.id}|${esc(t.id)}" class="mt-auto h-9 rounded-lg text-label-sm ${ativo(k, t) ? 'bg-primary-container text-on-primary' : 'bg-surface-container-lowest text-on-surface'}">${ativo(k, t) ? '✓ ' : '+ '}${esc(k.avatar)} ${esc(k.apelido)}</button>`).join('') : ''}</div>`).join('')}</div>
      <p class="text-body-sm text-on-surface-variant">${tx('Toque no nome da criança para ativar ou desativar o tema na Biblioteca dela. Cada tema terá duas versões de áudio: 6–9 e 10–14 anos.', "Tap a child's name to turn the topic on or off in their Library. Each topic will have two audio versions: ages 6–9 and 10–14.")}${temPack ? ' ' + tx(`Pacote Férias: ${escolhidos.size} de ${QKTemas.PACK_MAX} temas escolhidos.`, `Holiday Pack: ${escolhidos.size} of ${QKTemas.PACK_MAX} topics chosen.`) : ''}</p></section>`;
  }

  /* ================= modo de estudo (por criança): estudo · prova · férias ================= */
  const provasDe = (lics, kidId) => (lics || []).filter(l => l.crianca_id === kidId && !l.pausada && l.conteudo && l.conteudo.modo_prova && (!l.conteudo.data_prova || l.conteudo.data_prova >= today()));
  const modoDe = (modos, lics, kidId) => { const r = (modos || []).find(x => x.crianca_id === kidId); return (r && r.dados && r.dados.modo) || (provasDe(lics, kidId).length ? 'prova' : 'estudo'); };
  const diasAte = d => Math.round((new Date(d + 'T12:00') - new Date(today() + 'T12:00')) / 864e5);
  function provaCard(lics, modos) {
    return A().kids.map(k => {
      const pv = provasDe(lics, k.id); if (!pv.length || modoDe(modos, lics, k.id) !== 'prova') return '';
      return `<section class="mb-5 rounded-2xl p-4 border-2 border-tertiary-container bg-tertiary-container/15 space-y-2">
        <div class="flex items-center gap-2 flex-wrap"><span class="text-[26px]">📝</span><b class="text-headline-md text-on-surface flex-1">${tx('Modo prova ligado', 'Test mode on')} · ${esc(k.avatar)} ${esc(k.apelido)}</b></div>
        ${pv.map(l => { const c = l.conteudo, n = diasAte(c.data_prova || today()); return `<div class="bg-surface-container-lowest rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-2"><span class="flex-1 min-w-0"><b class="text-label-lg text-on-surface block truncate">${esc(l.titulo || c.titulo || '')}</b><span class="text-body-sm text-on-surface-variant">${c.data_prova ? tx('Prova', 'Test') + ' ' + fmtD(c.data_prova) + ' · ' + (n <= 0 ? tx('é hoje', 'today') : n === 1 ? tx('amanhã', 'tomorrow') : tx(`em ${n} dias`, `in ${n} days`)) : tx('sem data', 'no date')}</span></span>
          <span class="flex gap-1.5 flex-wrap"><button data-pdata="${k.id}|${esc(l.id)}|${c.data_prova || ''}" class="h-9 px-3 rounded-lg bg-surface-container text-label-sm text-on-surface">📅 ${tx('Mudar data', 'Change date')}</button><button data-pdesl="${k.id}|${esc(l.id)}" class="h-9 px-3 rounded-lg bg-surface-container text-label-sm text-on-surface">${tx('Desligar', 'Turn off')}</button></span></div>`; }).join('')}
        <div class="flex gap-2 flex-wrap"><button data-pir="material" class="h-10 px-4 rounded-xl bg-primary-container text-on-primary text-label-md">❓ ${tx('Ver as perguntas da prova', 'See the test questions')}</button><button data-pir="resumo|${k.id}" class="h-10 px-4 rounded-xl bg-surface-container-lowest text-on-surface text-label-md">🧪 ${tx('Fazer um simulado', 'Set up a practice test')}</button></div>
        <p class="text-body-sm text-on-surface-variant">${tx('No modo prova, a criança revisa só o material da prova até a data. O resto fica guardado e volta depois.', 'In test mode, your child reviews only the test material until the date. Everything else is kept for later.')}</p></section>`;
    }).join('');
  }
  function modoHtml(lics, modos, tcfg) {
    const opc = [['estudo', '📘', tx('Estudo do dia a dia', 'Everyday study'), tx('Usa o material que você mandou. Ligue ou pause matérias abaixo.', 'Uses the material you sent. Turn subjects on or off below.')], ['prova', '📝', tx('Modo prova', 'Test mode'), tx('Só o material "Cai na prova", até a data, com simulado.', 'Only "On the test" material until the date, with practice tests.')], ['ferias', '🏖️', tx('Modo férias', 'Holiday mode'), tx('Histórias narradas: 2 grátis; mais temas no Pacote Férias.', 'Narrated stories: 2 free; more in the Holiday Pack.')]];
    return provaCard(lics, modos) + `<section class="${card} mb-5 space-y-3"><div class="flex items-center justify-between gap-2"><h2 class="text-headline-md text-on-surface">🎛️ ${tx('Modo de estudo', 'Study mode')}</h2></div><p class="text-body-sm text-on-surface-variant -mt-2">${tx('Escolha com 1 toque o que cada criança faz agora. Dá para trocar quando quiser.', 'Pick with 1 tap what each child does now. Change it anytime.')}</p>
      ${A().kids.map(k => { const m = modoDe(modos, lics, k.id), np = provasDe(lics, k.id).length; return `<div class="space-y-2"><p class="text-label-lg text-on-surface">${esc(k.avatar)} ${esc(k.apelido)}</p><div class="grid grid-cols-1 sm:grid-cols-3 gap-2">${opc.map(([v, e, n, d2]) => `<button data-modo="${k.id}|${v}" class="text-left rounded-2xl border-2 p-3 transition active:scale-[0.99] ${m === v ? 'border-primary-container bg-primary-fixed/25' : 'border-surface-container-high bg-surface-container-lowest'}"><span class="flex items-center gap-2"><span class="text-[24px]">${e}</span><b class="text-label-lg text-on-surface flex-1">${n}</b>${m === v ? I('check_circle', 'text-primary text-[22px]', 1) : ''}</span><span class="block text-body-sm text-on-surface-variant mt-1">${d2}${v === 'prova' ? (np ? ` <b class="text-on-surface">${np} ${tx(np === 1 ? 'matéria de prova' : 'matérias de prova', np === 1 ? 'test subject' : 'test subjects')}</b>` : ` <b class="text-on-surface">${tx('Mande um material "Cai na prova" abaixo.', 'Send "On the test" material below.')}</b>`) : ''}</span></button>`).join('')}</div></div>`; }).join('')}</section>`;
  }
  function wireModo(lics, modos) {
    app().querySelectorAll('[data-modo]').forEach(b => b.onclick = async () => {
      const [kid, m] = b.dataset.modo.split('|');
      if (m === 'prova' && !provasDe(lics, kid).length) { toast(tx('Primeiro mande o material com a opção "Cai na prova" e a data. 📝', 'First send material with "On the test" and the date. 📝'), 4500); const el = $('#mat'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      try { await DB.ins('progresso', { crianca_id: kid, chave: 'modo', dados: { modo: m, em: new Date().toISOString() }, atualizado_em: new Date().toISOString() }, { upsert: true, onConflict: 'crianca_id,chave' }); toast('✅ ' + ({ estudo: tx('Estudo do dia a dia ligado', 'Everyday study on'), prova: tx('Modo prova ligado', 'Test mode on'), ferias: tx('Modo férias ligado', 'Holiday mode on') })[m]); render(); } catch (x) { toast(x.message); }
    });
    app().querySelectorAll('[data-pdata]').forEach(b => b.onclick = async () => {
      const [kid, lid, d0] = b.dataset.pdata.split('|'); const nd = prompt(tx('Nova data da prova (AAAA-MM-DD):', 'New test date (YYYY-MM-DD):'), d0 || today()); if (!nd) return;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(nd.trim())) return toast(tx('Use o formato 2026-11-25.', 'Use the format 2026-11-25.'));
      try { await DB.rpc('gerir_prova', { crianca: kid, licao: lid, data_prova: nd.trim(), ligado: true }); toast('✅'); render(); } catch (x) { toast(/gerir_prova|function|schema/i.test(x.message) ? tx('Falta rodar o SQL 09 no Supabase.', 'Run SQL 09 in Supabase.') : x.message, 4500); }
    });
    app().querySelectorAll('[data-pdesl]').forEach(b => b.onclick = async () => {
      const [kid, lid] = b.dataset.pdesl.split('|'); if (!confirm(tx('Desligar o modo prova desta matéria? As perguntas continuam no estudo do dia a dia.', 'Turn off test mode for this subject? Its questions stay in everyday study.'))) return;
      try { await DB.rpc('gerir_prova', { crianca: kid, licao: lid, data_prova: null, ligado: false }); toast('✅'); render(); } catch (x) { toast(/gerir_prova|function|schema/i.test(x.message) ? tx('Falta rodar o SQL 09 no Supabase.', 'Run SQL 09 in Supabase.') : x.message, 4500); }
    });
    app().querySelectorAll('[data-pir]').forEach(b => b.onclick = () => { const [t2, k] = b.dataset.pir.split('|'); if (k) kidSel = k; tab = t2; render(); if (t2 === 'material') setTimeout(() => { const e2 = document.querySelector('[data-perg]'); if (e2) e2.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 900); else setTimeout(() => { const e2 = $('#simsave'); if (e2) e2.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 1200); });
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
        return `<div class="space-y-3"><div class="flex items-center justify-between gap-2"><span class="text-label-lg text-on-surface">${esc(k.avatar)} ${esc(k.apelido)}</span><span class="flex gap-3"><button data-todas="${k.id}|ativar" class="text-label-sm text-primary underline">${tx('Ativar todas', 'Turn all on')}</button><button data-todas="${k.id}|pausar" class="text-label-sm text-on-surface-variant underline">${tx('Pausar todas', 'Pause all')}</button><button data-zerar="${k.id}" class="text-label-sm text-error underline">${tx('Apagar todas', 'Delete all')}</button></span></div>
        <div class="flex items-center justify-between gap-2 bg-surface-container-low rounded-xl px-3 py-2"><span class="text-body-sm text-on-surface">${tx('Divisão do tempo', 'Time split')}: 📖 ${((k.pilares || {}).leitura) || 40}% · 🔤 ${((k.pilares || {}).palavras) || 25}% · 🧮 ${((k.pilares || {}).reforco) || 35}%</span><button data-edk="${k.id}" class="text-label-sm text-primary underline">${tx('Mudar', 'Change')}</button></div>
        <p class="text-body-sm text-on-surface-variant">${tx('Use o botão <b>Ativa/Pausada</b> de cada matéria: só as ativas caem nas lições. Ex.: deixe ativa só a matéria da semana e, no fim do mês, ative todas para revisar para a prova. Chegou mais conteúdo da mesma matéria? Toque em <b>➕ Adicionar páginas</b> (as perguntas novas entram na mesma matéria).', 'Use each subject’s <b>On/Paused</b> switch: only active subjects show up in lessons. More pages of the same subject? Tap <b>➕ Add pages</b>.')}</p>
        ${ls.map(l => { const c = l.conteudo || {}, qs = (c.questions || []), lid = l.id, seen = qs.reduce((a, q) => a + (qn[q.id] || 0), 0), vistos = qs.filter(q => qn[q.id]).length;
          const its = ts.filter(t => t.crianca_id === k.id).flatMap(t => t.itens || []).filter(i => String(i.qid).replace(/^TV:/, '').startsWith(lid + '-') && i.correct !== null && i.correct !== undefined);
          const acc = its.length ? Math.round(100 * its.filter(i => i.correct).length / its.length) : null;
          const tk = tasks.find(t => t.resultado && t.resultado.licao === lid) || {}, en = tk.entrada || {};
          const rt = ritmo(k, l, pr, seen), pct = qs.length ? Math.round(100 * vistos / qs.length) : 0;
          return `<div class="${card} space-y-3 ${l.pausada ? 'opacity-70' : ''}">
            <div class="flex items-start gap-3"><span class="text-[30px] leading-none">${esc(c.icone || '📸')}</span><div class="flex-1 min-w-0">
              <button data-ltog="${k.id}|${lid}|${l.pausada ? 'ativar' : 'pausar'}" role="switch" aria-checked="${l.pausada ? 'false' : 'true'}" class="float-right ml-2 flex items-center gap-2 text-label-sm ${l.pausada ? 'text-on-surface-variant' : 'text-primary'}"><span>${l.pausada ? tx('Pausada', 'Paused') : tx('Ativa', 'On')}</span><span class="relative inline-block w-12 h-7 rounded-full transition ${l.pausada ? 'bg-surface-container-highest' : 'bg-primary-container'}"><span class="absolute top-1 ${l.pausada ? 'left-1' : 'left-6'} w-5 h-5 rounded-full bg-white shadow transition-all"></span></span></button>
              <div class="flex items-center gap-2 flex-wrap">${c.modo_prova ? `<span class="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm">📝 ${tx('Prova', 'Test')}${c.data_prova ? ' ' + new Date(c.data_prova + 'T12:00').toLocaleDateString(pt() ? 'pt-BR' : 'en-US', { day: '2-digit', month: 'short' }) : ''}</span>` : `<span class="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface text-label-sm">📘 ${tx('Estudo', 'Study')}</span>`}${l.foco ? `<span class="px-2 py-0.5 rounded-full bg-primary-container text-on-primary text-label-sm">⭐ ${tx('Prioridade', 'Priority')}</span>` : ''}${l.pausada ? `<span class="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-label-sm">⏸ ${tx('Pausada', 'Paused')}</span>` : ''}</div>
              <b class="text-label-lg text-on-surface block mt-1">${esc(l.titulo || c.titulo || '')}</b>
              <span class="text-body-sm text-on-surface-variant">${esc([en.materia, en.obs ? '“' + en.obs + '”' : '', new Date(l.criado_em).toLocaleDateString(pt() ? 'pt-BR' : 'en-US', { day: '2-digit', month: 'short' })].filter(Boolean).join(' · '))}</span></div></div>
            <div><div class="flex justify-between text-label-sm text-on-surface-variant mb-1"><span>${vistos}/${qs.length} ${tx('perguntas já vistas', 'questions seen')}</span><span>${acc === null ? '' : tx('Acertos', 'Accuracy') + ': ' + acc + '%'}</span></div><div class="h-2.5 bg-surface-container-high rounded-full overflow-hidden"><div class="h-full bg-primary-container rounded-full" style="width:${pct}%"></div></div></div>
            <p class="text-body-sm ${rt.ok ? 'text-on-surface' : 'text-error'} bg-surface-container-low rounded-xl p-3 flex gap-2">${I(rt.ok ? 'insights' : 'warning', 'text-[18px] shrink-0 ' + (rt.ok ? 'text-primary' : 'text-error'))}<span>${rt.msg}</span></p>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button data-perg="${k.id}|${lid}" class="h-11 rounded-xl bg-primary-container text-on-primary text-label-md flex items-center justify-center gap-1.5">${I('quiz', 'text-[18px]')} ${tx('Perguntas', 'Questions')} (${qs.length})</button>
              <button data-lacao="${k.id}|${lid}|${l.foco ? 'desfocar' : 'focar'}" class="h-11 rounded-xl bg-surface-container text-on-surface text-label-md">${l.foco ? tx('Tirar prioridade', 'Remove priority') : '⭐ ' + tx('Priorizar', 'Prioritize')}</button>
              <button data-addp="${k.id}|${lid}" class="h-11 rounded-xl bg-surface-container text-on-surface text-label-md">➕ ${tx('Adicionar páginas', 'Add pages')}</button>
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
        ${ex.explain ? `<p class="text-body-sm text-on-surface-variant">${md(ex.explain)}</p>` : ''}
        <div class="flex gap-3 pt-1">${q.off ? `<span class="text-label-sm text-error">⏸ ${tx('Desativada', 'Turned off')}</span><button data-qon="${esc(q.id)}" class="text-label-sm text-primary underline">${tx('Ativar de novo', 'Turn back on')}</button>` : `<button data-qoff="${esc(q.id)}" class="text-label-sm text-on-surface-variant underline">⏸ ${tx('Desativar esta pergunta', 'Turn off this question')}</button><button data-qrep="${esc(q.id)}" class="text-label-sm text-on-surface-variant underline">⚠️ ${tx('Reportar erro', 'Report a problem')}</button>`}</div></div>`; }).join('')}
      <p class="text-body-sm text-on-surface-variant">${tx('Achou uma pergunta errada ou estranha? Toque em "Reportar erro": ela sai das lições e nossa equipe confere.', 'Found a wrong or odd question? Tap "Report a problem": it leaves the lessons and our team checks it.')}</p></div>`;
    document.body.appendChild(ov);
    ov.onclick = e => { if (e.target === ov || e.target.closest('[data-x]')) ov.remove(); };
    const liga = async (qid, ativa) => { try { await DB.rpc('gerir_pergunta', { crianca: lic.crianca_id, licao: lic.id, pergunta: qid, ativa }); const q = qs.find(x => x.id === qid); if (q) q.off = !ativa; ov.remove(); perguntasSheet(lic, prog, ts); toast('✅'); } catch (x) { toast(/gerir_pergunta|function|schema/i.test(x.message) ? tx('Falta rodar o SQL 09 no Supabase.', 'Run SQL 09 in Supabase.') : x.message, 4500); } };
    ov.querySelectorAll('[data-qoff]').forEach(b => b.onclick = () => liga(b.dataset.qoff, false));
    ov.querySelectorAll('[data-qon]').forEach(b => b.onclick = () => liga(b.dataset.qon, true));
    ov.querySelectorAll('[data-qrep]').forEach(b => b.onclick = async () => {
      const q = qs.find(x => x.id === b.dataset.qrep); const mot = prompt(tx('O que está errado nesta pergunta? (opcional)', 'What is wrong with this question? (optional)'), ''); if (mot === null) return;
      DB.ins('reportes', { familia_id: A().fam.id, crianca_id: lic.crianca_id, licao_id: lic.id, pergunta_id: q.id, motivo: ('pais: ' + mot).slice(0, 60), quem: 'pais', pergunta: { prompt: q.prompt, options: q.options, answers: q.answers, type: q.type } }).catch(() => {});
      liga(q.id, false); toast('💙 ' + tx('Obrigado! A pergunta saiu das lições e nossa equipe vai conferir.', 'Thanks! The question left the lessons and our team will check it.'), 4500);
    });
  }

  /* ================= enviar material ================= */
  const MAX_ENVIO = 10; // páginas por envio
  let envioLote = null;  // mesmo lote se precisar tentar de novo
  let envioAlvo = null;  // "Adicionar páginas" numa matéria que já existe
  function mostrarAlvo() {
    const b = $('#alvo'); if (!b) return;
    b.innerHTML = envioAlvo ? `<div class="mt-3 rounded-2xl bg-primary-fixed/30 border-2 border-primary-container p-3 flex items-center gap-2"><span class="text-[22px]">➕</span><span class="flex-1 text-body-md text-on-surface">${tx('Adicionando páginas em', 'Adding pages to')} <b>${esc(envioAlvo.titulo)}</b>. ${tx('As perguntas novas entram nesta mesma matéria.', 'New questions join this same subject.')}</span><button id="alvox" class="text-label-sm text-primary underline">${tx('Criar matéria nova', 'New subject instead')}</button></div>` : '';
    const x = $('#alvox'); if (x) x.onclick = () => { envioAlvo = null; mostrarAlvo(); };
  }
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
    const moeda = A().moeda();
    const [mats, lim, est, cred, prods, compras, tcfg, tdb] = await Promise.all([DB.sel('materiais', { eq: { familia_id: fam }, order: 'criado_em.desc', limit: 80 }), DB.sel('limites_ia', { eq: { plano: (A().sub || {}).plano || 'teste' } }).catch(() => []), estudandoData(),
      DB.sel('creditos', { eq: { familia_id: fam } }).catch(() => []), DB.sel('produtos', { eq: { moeda } }).catch(() => []), DB.sel('compras', { eq: { familia_id: fam } }).catch(() => []),
      DB.sel('progresso', { inn: { crianca_id: A().kids.map(k => k.id) }, eq: { chave: 'temas' } }).catch(() => []), DB.sel('temas', {}).catch(() => [])]);
    const modos = await DB.sel('progresso', { inn: { crianca_id: A().kids.map(k => k.id) }, eq: { chave: 'modo' } }).catch(() => []);
    const creditos = (cred[0] && cred[0].paginas) || 0, prodCred = prods.find(p2 => p2.tipo === 'creditos'), prodTemas = prods.find(p2 => p2.tipo === 'temas');
    if (creditos > 0 && mats.some(m => m.status === 'sem_limite')) { DB.rpc('reprocessar_sem_limite').then(() => DB.fn('ia', {})).catch(() => {}); }
    const usado = mats.filter(m => String(m.criado_em).slice(0, 7) === mes).length; const max = (lim[0] && lim[0].paginas_mes) || 60;
    let files = [], tipo = 'estudo';
    const kidOf = id => A().kids.find(k => k.id === id);
    const status = { enviado: ['hourglass_top', tx('Na fila: a IA vai criar as lições', 'In line: AI will create the lessons'), 'text-secondary'], processando: ['auto_awesome', tx('Criando as lições…', 'Creating lessons…'), 'text-tertiary'], pronto: ['check_circle', tx('Lições prontas · fotos apagadas', 'Lessons ready · photos deleted'), 'text-primary'], sem_limite: ['block', tx('Parado: limite de páginas do mês. Compre créditos para continuar.', 'Paused: monthly page limit. Buy credits to continue.'), 'text-error'], erro: ['error', tx('Não deu certo. Fotos guardadas até 7 dias para tentar de novo.', 'Something went wrong. Photos kept up to 7 days to retry.'), 'text-error'], apagado: ['delete', tx('Fotos apagadas', 'Photos deleted'), 'text-outline'] };
    const tipoDe = m => m.tipo || (m.modo_prova ? 'prova' : 'estudo');
    const badge = m => { const t = TIPOS().find(x => x[0] === tipoDe(m)) || TIPOS()[0]; return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-sm ${t[0] === 'prova' ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container-high text-on-surface'}">${t[1]} ${t[2]}${t[0] === 'prova' && m.data_prova ? ' · ' + new Date(m.data_prova + 'T12:00').toLocaleDateString(pt() ? 'pt-BR' : 'en-US', { day: '2-digit', month: 'short' }) : ''}</span>`; };
    const grupos = lotes(mats);
    shell(`${modoHtml(est.lics, modos, tcfg)}${estudandoHtml(est)}${temasHtml(compras.map(c => c.item), tcfg, tdb, prodTemas)}<div class="grid grid-cols-1 lg:grid-cols-5 gap-5">
      <section class="lg:col-span-3 ${card} space-y-1 relative overflow-hidden">
        <div class="absolute -top-10 -right-10 w-36 h-36 bg-primary-container/10 rounded-full blur-2xl pointer-events-none"></div>
        <div class="flex items-center gap-3 relative"><div class="w-12 h-12 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center">${I('photo_camera', 'text-[26px]', 1)}</div>
          <div><h1 class="text-headline-lg-mobile text-on-surface">${tx('Enviar material', 'Send material')}</h1><p class="text-body-sm text-on-surface-variant">${tx('Fotos do caderno, do livro ou o PDF da escola.', 'Photos of the notebook, the book or the school PDF.')}</p></div></div>
        <div id="alvo"></div>
        ${lbl(tx('Para quem', 'For'))}<div class="flex flex-wrap gap-2">${A().kids.map(k => `<label class="cursor-pointer"><input type="radio" name="kid" value="${k.id}" class="peer sr-only" ${k.id === kidSel ? 'checked' : ''}><span class="flex items-center gap-2 px-4 h-12 rounded-full bg-surface-container text-label-md text-on-surface peer-checked:bg-primary-container peer-checked:text-on-primary">${esc(k.avatar)} ${esc(k.apelido)}</span></label>`).join('')}</div>
        ${lbl(tx('O que é este material?', 'What is this material?'))}
        <div class="grid grid-cols-3 gap-2" id="tipos">${TIPOS().map(([v, e, l, d]) => `<button data-tipo="${v}" class="rounded-2xl border-2 p-2.5 text-center flex flex-col items-center gap-1 ${v === tipo ? 'border-primary-container bg-primary-fixed/30' : 'border-surface-container-high bg-surface-container-lowest'}"><span class="text-[26px] leading-none">${e}</span><b class="text-label-md text-on-surface leading-tight">${l}</b><span class="text-[11px] leading-tight text-on-surface-variant hidden sm:block">${d}</span></button>`).join('')}</div>
        <div id="pv" class="hidden">${lbl(tx('Data da prova', 'Test date'))}<input class="${inputCls}" type="date" id="dp" min="${today()}"><p class="text-body-sm text-on-surface-variant mt-1">${tx('Até a prova, a revisão foca só nesta matéria, com um simulado no começo e outro no fim.', 'Until test day, review focuses only on this, with a check at the start and at the end.')}</p></div>
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
        <div class="mt-3 bg-surface-container-low rounded-2xl p-3 space-y-2"><div class="flex justify-between text-label-sm text-on-surface-variant"><span>${tx('Páginas este mês (família toda)', 'Pages this month (whole family)')}</span><span class="${usado >= max ? 'text-error' : 'text-on-surface'}">${usado} / ${max}${creditos ? ` · +${creditos} ${tx('créditos', 'credits')}` : ''}</span></div>
          <div class="h-2 bg-surface-container-high rounded-full overflow-hidden"><div class="h-full ${usado >= max ? 'bg-error' : 'bg-primary-container'} rounded-full" style="width:${Math.min(100, Math.round(100 * usado / Math.max(1, max)))}%"></div></div>
          ${prodCred ? `<button id="buycred" class="w-full h-11 rounded-xl ${usado >= max ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-on-surface'} text-label-md">➕ ${tx(`Comprar +${prodCred.paginas} páginas`, `Buy +${prodCred.paginas} pages`)} · ${esc(prodCred.valor_texto)}</button>` : ''}</div>
      </section>
      <section class="lg:col-span-2 space-y-3"><h2 class="text-headline-md text-on-surface">${tx('Enviados', 'Sent')}</h2>
        ${grupos.map((g, gi) => { const st = status[g.itens.some(m => m.status === 'erro') ? 'erro' : g.status] || ['help', g.status, 'text-outline']; const k = kidOf(g.crianca_id); return `<button data-g="${gi}" class="${card} w-full text-left space-y-1.5 hover:ring-2 hover:ring-primary-container/40">
          <div class="flex items-center gap-2 flex-wrap">${badge(g)}<span class="text-body-sm text-on-surface-variant">${k ? esc(k.avatar) + ' ' + esc(k.apelido) + ' · ' : ''}${new Date(g.criado_em).toLocaleDateString(pt() ? 'pt-BR' : 'en-US', { day: '2-digit', month: 'short' })}</span></div>
          <b class="text-label-lg text-on-surface block">${esc(g.materia || tx('Sem matéria informada', 'No subject given'))}</b>
          ${g.obs ? `<p class="text-body-sm text-on-surface-variant">“${esc(g.obs)}”</p>` : ''}
          <div class="flex items-center justify-between gap-2"><span class="text-body-sm text-on-surface-variant">${g.itens.length} ${g.itens.length === 1 ? tx('página', 'page') : tx('páginas', 'pages')}</span>
          <span class="flex items-center gap-1 text-label-sm ${st[2]} text-right">${I(st[0], 'text-[18px] shrink-0', 1)}<span>${st[1]}</span></span></div>${esperaHtml(g)}</button>`; }).join('') || `<p class="${card} text-body-md text-on-surface-variant">${tx('Nada ainda.', 'Nothing yet.')}</p>`}</section></div>`);
    vigiarEspera(mats.filter(m => ['enviado', 'processando'].includes(m.status)).length);
    wireModo(est.lics, modos);
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
    app().querySelectorAll('[data-g]').forEach(b => b.onclick = () => { const g = grupos[+b.dataset.g]; const tk = est.tasks.find(t => (t.entrada && t.entrada.materiais || []).some(id => g.itens.some(m => m.id === id))); const l = tk && tk.resultado && est.lics.find(x => x.id === tk.resultado.licao); verEnvio(g, badge, status, l ? () => perguntasSheet(l, ((est.progs.find(p2 => p2.crianca_id === l.crianca_id) || {}).dados) || {}, est.ts.filter(t => t.crianca_id === l.crianca_id)) : null); });
    const bc = $('#buycred'); if (bc) bc.onclick = () => comprar(prodCred.codigo, bc);
    const bt = $('#buytemas'); if (bt) bt.onclick = () => comprar(prodTemas.codigo, bt);
    app().querySelectorAll('[data-tat]').forEach(b => b.onclick = async () => {
      const [kidId, tid] = b.dataset.tat.split('|'); const row = tcfg.find(r => r.crianca_id === kidId); const own = compras.map(c => c.item);
      const cat = temasCat(tdb), all = cat.filter(t => QKTemas.liberado(t, own));
      let ativos = row && row.dados && row.dados.ativos ? row.dados.ativos.slice() : all.filter(t => t.pacote === 'gratis').map(t => t.id);
      if (!ativos.includes(tid)) {
        const t = cat.find(x => x.id === tid), esc2 = new Set();
        tcfg.forEach(r => ((r.dados && r.dados.ativos) || []).forEach(id => { const tt = cat.find(x => x.id === id); if (tt && tt.pacote !== 'gratis' && !own.includes(tt.id)) esc2.add(id); }));
        if (t && t.pacote !== 'gratis' && !own.includes(t.id) && !esc2.has(tid) && esc2.size >= QKTemas.PACK_MAX) return toast(tx(`O Pacote Férias tem ${QKTemas.PACK_MAX} temas. Desative um para escolher outro.`, `The Holiday Pack has ${QKTemas.PACK_MAX} topics. Turn one off to pick another.`), 4500);
      }
      ativos = ativos.includes(tid) ? ativos.filter(x => x !== tid) : ativos.concat(tid);
      try { await DB.ins('progresso', { crianca_id: kidId, chave: 'temas', dados: { ativos }, atualizado_em: new Date().toISOString() }, { upsert: true, onConflict: 'crianca_id,chave' }); material(); } catch (x) { toast(x.message); }
    });
    app().querySelectorAll('[data-perg]').forEach(b => b.onclick = () => { const [kid, lid] = b.dataset.perg.split('|'); const l = est.lics.find(x => x.id === lid && x.crianca_id === kid); perguntasSheet(l, ((est.progs.find(p => p.crianca_id === kid) || {}).dados) || {}, est.ts.filter(t => t.crianca_id === kid)); });
    const acao = async (kid, lid, ac) => { try { await DB.rpc('gerir_licao', { crianca: kid, licao: lid, acao: ac }); toast('✅'); material(); } catch (x) { toast(/gerir_licao|function|schema/i.test(x.message) ? tx('Falta rodar o SQL 06 no Supabase para usar isso.', 'Run SQL 06 in Supabase to use this.') : x.message, 4500); } };
    app().querySelectorAll('[data-ltog]').forEach(b => b.onclick = () => { const [kid, lid, ac] = b.dataset.ltog.split('|'); acao(kid, lid, ac); });
    app().querySelectorAll('[data-addp]').forEach(b => b.onclick = () => {
      const [kid, lid] = b.dataset.addp.split('|'); const l = est.lics.find(x => x.id === lid && x.crianca_id === kid); if (!l) return;
      const c = l.conteudo || {}, tk = est.tasks.find(t => t.resultado && t.resultado.licao === lid) || {}, en = tk.entrada || {};
      envioAlvo = { kid, lid, titulo: l.titulo || c.titulo || '' };
      const r = app().querySelector(`input[name=kid][value="${kid}"]`); if (r) r.checked = true;
      const tp = c.modo_prova ? 'prova' : (en.tipo || 'estudo'); const tb = app().querySelector(`[data-tipo="${tp}"]`); if (tb) tb.click();
      if (c.data_prova && $('#dp')) $('#dp').value = c.data_prova;
      $('#mat').value = en.materia || envioAlvo.titulo;
      mostrarAlvo(); $('#alvo').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    app().querySelectorAll('[data-lacao]').forEach(b => b.onclick = () => { const [kid, lid, ac] = b.dataset.lacao.split('|'); if (ac === 'apagar' && !confirm(tx('Apagar esta matéria e todas as perguntas dela? Não dá para desfazer.', 'Delete this subject and all its questions? This cannot be undone.'))) return; acao(kid, lid, ac); });
    app().querySelectorAll('[data-todas]').forEach(b => b.onclick = async () => { const [kid, ac] = b.dataset.todas.split('|'); try { for (const l of est.lics.filter(x => x.crianca_id === kid && !!x.pausada === (ac === 'ativar'))) await DB.rpc('gerir_licao', { crianca: kid, licao: l.id, acao: ac }); toast('✅'); material(); } catch (x) { toast(/gerir_licao|function|schema/i.test(x.message) ? tx('Falta rodar o SQL 06 no Supabase para usar isso.', 'Run SQL 06 in Supabase to use this.') : x.message, 4500); } });
    app().querySelectorAll('[data-edk]').forEach(b => b.onclick = () => { const k = A().kids.find(x => x.id === b.dataset.edk); if (k) { tab = 'criancas'; childForm(k); } });
    app().querySelectorAll('[data-zerar]').forEach(b => b.onclick = () => { if (!confirm(tx('Apagar TODAS as matérias e perguntas desta criança? Não dá para desfazer.', "Delete ALL of this child's subjects and questions? This cannot be undone."))) return; acao(b.dataset.zerar, '', 'zerar'); });
    $('#send').onclick = async () => {
      const err = $('#err'); err.textContent = '';
      if (usado + files.length > max + creditos) { err.innerHTML = tx(`Limite do mês: ${max} páginas (a família toda)${creditos ? ` + ${creditos} de créditos` : ''}. Compre mais créditos abaixo para continuar.`, `Monthly limit: ${max} pages (whole family)${creditos ? ` + ${creditos} credits` : ''}. Buy credits below to continue.`); return; }
      if (files.find(f => f.size > 50 * 1024 * 1024)) { err.textContent = tx('Cada arquivo pode ter até 50 MB.', 'Each file can be up to 50 MB.'); return; }
      const prova = tipo === 'prova', dp = $('#dp').value; if (prova && !dp) { err.textContent = tx('Escolha a data da prova.', 'Pick the test date.'); return; }
      const b = $('#send'); b.disabled = true; const kid = (app().querySelector('input[name=kid]:checked') || {}).value || kidSel, materia = $('#mat').value.trim(), obs = $('#obs').value.trim();
      const lote = envioLote || (envioLote = QK.uid()); const label = b.querySelector('span:last-child');
      // painel de progresso logo abaixo do botão
      let box = $('#upbox'); if (!box) { box = document.createElement('div'); box.id = 'upbox'; b.insertAdjacentElement('afterend', box); }
      const total = files.reduce((a, f) => a + f.size, 0) || 1;
      const pinta = (i, frac) => {
        const feito = files.slice(0, i).reduce((a, f) => a + f.size, 0) + (files[i] ? files[i].size * frac : 0), pct = Math.min(100, Math.round(100 * feito / total));
        box.innerHTML = `<div class="mt-3 bg-surface-container-low rounded-2xl p-4 space-y-2"><div class="flex items-center gap-2"><span class="qk-ampulheta text-[20px]">⏳</span><b class="text-label-lg text-on-surface flex-1">${i < files.length ? tx(`Enviando foto ${i + 1} de ${files.length}…`, `Uploading photo ${i + 1} of ${files.length}…`) : tx('Quase lá…', 'Almost there…')}</b><span class="text-label-md text-on-surface-variant">${pct}%</span></div>
          <div class="h-3 bg-surface-container-high rounded-full overflow-hidden"><div class="h-full bg-primary-container rounded-full transition-all duration-300" style="width:${Math.max(3, pct)}%"></div></div>
          <p class="text-body-sm text-on-surface-variant">${tx('Pode levar até 1 minuto, dependendo da sua internet. Não feche o app.', 'This can take up to a minute depending on your connection. Please keep the app open.')}</p></div>`;
      };
      label.textContent = tx('Enviando…', 'Uploading…');
      try {
        for (let i = 0; i < files.length; i++) {
          const f = files[i]; if (f._mat) { pinta(i + 1, 0); continue; }   // já foi (tentativa anterior)
          pinta(i, 0);
          const safe = f.name.replace(/[^\w.-]+/g, '_').slice(-60); const path = f._path || (f._path = `${fam}/${QK.uid()}-${safe}`);
          await DB.upload('familia-materiais', path, f, frac => pinta(i, frac));
          const r = await insMat({ familia_id: fam, crianca_id: kid, caminho: path, materia: materia || null, modo_prova: prova, data_prova: prova ? dp : null, tipo, obs: obs || null, lote });
          f._mat = (r[0] && r[0].id) || 'ok';
        }
        pinta(files.length, 0);
        const ids = files.map(f => f._mat).filter(x => x && x !== 'ok');
        const alvo = envioAlvo && envioAlvo.kid === kid ? envioAlvo.lid : null;
        await DB.ins('ia_tarefas', { familia_id: fam, crianca_id: kid, tipo: 'gerar_licao', entrada: Object.assign({ materiais: ids, materia, tipo, obs, modo_prova: prova, data_prova: prova ? dp : null }, alvo ? { adicionar_a: alvo } : {}) }).catch(e => console.warn(e));
        envioAlvo = null;
        DB.fn('ia', {}).catch(() => {});
        envioLote = null;
        toast(tx('✅ Enviado! O Quico já está criando as lições.', '✅ Sent! Quico is already creating the lessons.'), 4000); material();
      } catch (x) {
        const rede = /rede|network|failed to fetch/i.test(x.message);
        box.innerHTML = `<div class="mt-3 bg-error-container text-on-error-container rounded-2xl p-4 space-y-1"><b class="text-label-lg">${rede ? tx('A internet caiu no meio do envio.', 'The connection dropped during the upload.') : tx('Não deu para enviar.', "Couldn't upload.")}</b><p class="text-body-sm">${rede ? tx('Suas fotos continuam aqui. Toque em "Tentar de novo": o envio continua de onde parou.', 'Your photos are still here. Tap "Try again": it picks up where it stopped.') : esc(x.message)}</p></div>`;
        b.disabled = false; label.textContent = tx('Tentar de novo', 'Try again');
      }
    };
  }
  // enquanto a IA trabalha: Quico mostra as etapas, o tempo estimado e acalma o pai
  const DICAS = () => [tx('💡 Elogie o esforço, não só o acerto: "Você se esforçou muito hoje!"', '💡 Praise effort, not just right answers: "You worked really hard today!"'), tx('💡 Um horário fixo (ex.: depois do lanche) vira hábito em poucas semanas.', '💡 A fixed time (e.g. after snack) becomes a habit in a few weeks.'), tx('🧠 Curiosidade: rever um conteúdo em dias diferentes ajuda o cérebro a guardar por mais tempo.', '🧠 Fun fact: reviewing on different days helps the brain remember longer.'), tx('💡 Peça para seu filho te ensinar o que aprendeu: explicar é um dos melhores jeitos de fixar.', '💡 Ask your child to teach you what they learned: explaining helps it stick.')];
  function esperaHtml(g) {
    if (!['enviado', 'processando'].includes(g.status) || g.itens.some(m => m.status === 'erro')) return '';
    const min = Math.max(0, Math.floor((Date.now() - new Date(g.criado_em)) / 60000)), demorou = min >= 10;
    return `<div class="mt-2 rounded-2xl ${demorou ? 'bg-error-container/40' : 'bg-primary-fixed/25'} p-3 space-y-1.5" data-wait="${new Date(g.criado_em).getTime()}">
      <div class="flex items-center gap-2"><span class="qk-ampulheta text-[22px]">⏳</span><b class="text-label-md text-on-surface" data-etapa>${tx('Lendo as páginas…', 'Reading the pages…')}</b></div>
      <p class="text-body-sm text-on-surface-variant">${demorou ? tx('Está demorando mais que o normal. Toque em "Tentar de novo" ou espere mais um pouco.', 'This is taking longer than usual. Tap "Try again" or wait a little more.') : tx('Fica pronto em uns 2 a 5 minutos. Estamos caprichando para criar a melhor experiência para o seu filho. Pode fechar o app: as lições aparecem sozinhas.', "Ready in about 2–5 minutes. We're crafting the best experience for your child. You can close the app: lessons show up on their own.")}</p>
      <p class="text-body-sm text-on-surface" data-dica>${DICAS()[min % DICAS().length]}</p>
      ${demorou ? `<span role="button" data-retry class="inline-flex h-9 px-3 items-center rounded-lg bg-primary-container text-on-primary text-label-sm">🔄 ${tx('Tentar de novo', 'Try again')}</span>` : ''}</div>`;
  }
  let esperaTimer = null;
  function vigiarEspera(antes) {
    clearInterval(esperaTimer);
    const ETAPAS = [[0, tx('Lendo as páginas…', 'Reading the pages…')], [40, tx('Criando as perguntas…', 'Writing the questions…')], [110, tx('Conferindo as contas e as respostas…', 'Checking the math and answers…')], [200, tx('Quase pronto…', 'Almost ready…')]];
    const pinta = () => document.querySelectorAll('[data-wait]').forEach(w => { const sec = (Date.now() - +w.dataset.wait) / 1000; const e = ETAPAS.filter(x => sec >= x[0]).pop(); const el = w.querySelector('[data-etapa]'); if (el && e) el.textContent = e[1]; });
    pinta();
    document.querySelectorAll('[data-retry]').forEach(b => b.onclick = ev => { ev.stopPropagation(); DB.fn('ia', {}).catch(() => {}); toast('🔄 ' + tx('Pedimos para a IA tentar de novo.', 'We asked the AI to try again.')); });
    if (!document.querySelector('[data-wait]')) return;
    let n = 0;
    esperaTimer = setInterval(async () => {
      if (!document.querySelector('[data-wait]')) return clearInterval(esperaTimer);
      pinta(); if (++n % 3) return;   // confere no banco a cada ~12 s
      try {
        const ms = await DB.sel('materiais', { eq: { familia_id: A().fam.id }, order: 'criado_em.desc', limit: 40 });
        const agora = ms.filter(m => ['enviado', 'processando'].includes(m.status)).length;
        if (agora < antes) { clearInterval(esperaTimer); if (A().cheer) A().cheer(0); toast('🎉 ' + tx('Lições prontas!', 'Lessons ready!'), 4000); material(); }
      } catch (e) {}
    }, 4000);
  }
  // ver um envio: fotos (se ainda existirem) e a observação
  async function verEnvio(g, badge, status, verPerg) {
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
    if (verPerg) { const b = document.createElement('button'); b.className = 'w-full h-12 rounded-xl bg-primary-container text-on-primary text-label-lg'; b.textContent = tx('📋 Ver todas as perguntas e respostas', '📋 See all questions and answers'); b.onclick = () => { close(); verPerg(); }; ov.firstElementChild.insertBefore(b, ov.querySelector('[data-fotos]')); }
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
          if (first) { A().fecharPais(); return A().picker(); } tab = 'criancas'; render();
        } catch (x) { err.textContent = x.message; }
      };
    };
    draw();
  }

  /* ================= conta e assinatura ================= */
  async function mudarPais(p) {
    if (p === A().pais()) return;
    try { await DB.rpc('definir_pais', { p }); } catch (x) { if (/definir_pais|function|schema/i.test(x.message)) return toast(tx('Falta rodar o SQL 09 no Supabase.', 'Run SQL 09 in Supabase.'), 4500); return toast(x.message); }
    if (A().famRow) A().famRow.pais = p; toast('✅ ' + (p === 'US' ? tx('Estados Unidos: preços em dólar.', 'United States: prices in US$.') : tx('Brasil: preços em reais.', 'Brazil: prices in R$.'))); render();
  }
  async function copiar(t) { try { await navigator.clipboard.writeText(t); toast('📋 ' + tx('Copiado!', 'Copied!')); } catch (e) { const i = document.createElement('textarea'); i.value = t; document.body.appendChild(i); i.select(); try { document.execCommand('copy'); toast('📋 ' + tx('Copiado!', 'Copied!')); } catch (e2) { toast(t, 6000); } i.remove(); } }
  /* ================= parceiros: indique e ganhe / influenciadores ================= */
  const money = (c, m) => (String(m).toLowerCase() === 'usd' ? '$' : 'R$ ') + (c / 100).toFixed(2).replace('.', String(m).toLowerCase() === 'usd' ? '.' : ',');
  function parceiroHtml(d) {
    const a = d.afiliado, cfg = d.config || { pote: 30, max_desconto: 20, meses: 12 }, des = a ? a.desconto_pct : Math.min(10, cfg.max_desconto);
    const link = a ? location.origin + '/?ref=' + a.codigo : '', linkEn = a ? location.origin + '/en/?ref=' + a.codigo : '';
    return `<section class="${card} space-y-3"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('handshake', 'text-primary')} ${tx('Indique e ganhe', 'Refer and earn')}</h2>
      <p class="text-body-sm text-on-surface-variant">${tx(`Para pais e influenciadores. Você tem ${cfg.pote}% para dividir como quiser: desconto para quem assinar pelo seu link e comissão para você, por ${cfg.meses} meses de cada assinatura.`, `For parents and influencers. You get ${cfg.pote}% to split as you like: a discount for people who subscribe with your link and a commission for you, for ${cfg.meses} months of each subscription.`)}</p>
      ${lbl(tx('Seu código (aparece no link e no cupom)', 'Your code (in the link and coupon)'))}<input id="afc" class="${inputCls} uppercase tracking-widest" maxlength="16" value="${esc(a ? a.codigo : '')}" placeholder="${tx('EX.: PAULA10', 'E.G. PAULA10')}">
      ${lbl(tx('Nome que aparece', 'Display name'))}<input id="afn" class="${inputCls}" maxlength="60" value="${esc(a ? a.nome || '' : '')}">
      ${lbl(`${tx('Desconto para quem assinar', 'Discount for new subscribers')}: <b id="afdv">${des}%</b> · ${tx('sua comissão', 'your commission')}: <b id="afcv">${cfg.pote - des}%</b>`)}
      <input id="afd" type="range" min="0" max="${cfg.max_desconto}" step="5" value="${des}">
      <p class="text-body-sm text-on-surface-variant" id="afx"></p>
      ${lbl(A().pais() === 'US' ? tx('E-mail do PayPal ou Zelle para receber', 'PayPal or Zelle email to get paid') : tx('Chave PIX para receber', 'PIX key to get paid'))}<input id="afp" class="${inputCls}" maxlength="120" value="${esc(a ? a.pix || '' : '')}">
      ${btnP('afs', a ? tx('Salvar', 'Save') : tx('Quero ser parceiro', 'Become a partner'), 'check')}
      ${a ? `<div class="bg-surface-container-low rounded-2xl p-3 space-y-2"><p class="text-label-sm text-on-surface-variant">🇧🇷 ${tx('Seu link em português', 'Your link in Portuguese')}</p><p class="text-body-md text-on-surface break-all">${esc(link)}</p>
        <div class="grid grid-cols-2 gap-2"><button id="afcopy" class="h-10 rounded-xl bg-surface-container text-label-md text-on-surface">📋 ${tx('Copiar link', 'Copy link')}</button><button id="afshare" class="h-10 rounded-xl bg-surface-container text-label-md text-on-surface">💬 ${tx('Compartilhar', 'Share')}</button></div>
        <p class="text-label-sm text-on-surface-variant pt-1">🇺🇸 ${tx('Seu link em inglês', 'Your link in English')}</p><p class="text-body-md text-on-surface break-all">${esc(linkEn)}</p>
        <div class="grid grid-cols-2 gap-2"><button id="afcopyen" class="h-10 rounded-xl bg-surface-container text-label-md text-on-surface">📋 ${tx('Copiar link', 'Copy link')}</button><button id="afshareen" class="h-10 rounded-xl bg-surface-container text-label-md text-on-surface">💬 ${tx('Compartilhar', 'Share')}</button></div>
        <p class="text-[12px] text-on-surface-variant">${tx('Conta quando outra pessoa abre o link e cria uma conta NOVA no mesmo aparelho. Abrir o seu próprio link na sua conta não conta.', 'It counts when someone else opens the link and creates a NEW account on the same device. Opening your own link in your account does not count.')}</p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">${[[d.indicados, tx('cadastros', 'sign-ups')], [d.assinantes, tx('assinantes', 'subscribers')], [money(d.a_pagar, 'brl'), tx('a receber', 'to receive')], [money(d.pago, 'brl'), tx('já recebido', 'received')]].map(([v, l]) => `<div class="bg-surface-container-lowest rounded-xl p-2"><b class="text-label-lg text-on-surface block">${v}</b><span class="text-[11px] text-on-surface-variant">${l}</span></div>`).join('')}</div>
        <p class="text-[12px] text-on-surface-variant">${tx('Pagamentos uma vez por mês, por PIX, das comissões de assinaturas já pagas. Comissões são canceladas se houver reembolso.', 'Payouts once a month for subscriptions already paid. Commissions are cancelled on refunds.')}</p></div>` : ''}</section>`;
  }
  function wireParceiro(d) {
    const cfg = d.config || { pote: 30, max_desconto: 20 };
    const upd = () => { const v = +$('#afd').value; $('#afdv').textContent = v + '%'; $('#afcv').textContent = (cfg.pote - v) + '%'; $('#afx').textContent = v === 0 ? tx('Sem desconto: você fica com a comissão inteira.', 'No discount: you keep the full commission.') : v === cfg.pote ? tx('Tudo vira desconto: você divulga sem ganhar comissão.', 'All discount: you promote without commission.') : tx(`Ex.: numa assinatura de R$ 100, a família paga R$ ${100 - v} e você recebe R$ ${((100 - v) * (cfg.pote - v) / 100).toFixed(2).replace('.', ',')}.`, `E.g. on a $100 subscription, the family pays $${100 - v} and you get $${((100 - v) * (cfg.pote - v) / 100).toFixed(2)}.`); };
    $('#afd').oninput = upd; upd();
    $('#afs').onclick = async () => {
      const cod = $('#afc').value.trim().toUpperCase(); if (!/^[A-Z0-9]{3,16}$/.test(cod)) return toast(tx('Código: 3 a 16 letras ou números, sem espaço.', 'Code: 3–16 letters or numbers, no spaces.'));
      try { await DB.rpc('salvar_afiliado', { cod, desconto: +$('#afd').value, nome_pub: $('#afn').value.trim(), chave_pix: $('#afp').value.trim() }); toast('✅ ' + tx('Pronto! Seu link está ativo.', 'Done! Your link is live.')); render(); }
      catch (x) { toast(/duplicate|unique/i.test(x.message) ? tx('Esse código já está em uso. Escolha outro.', 'That code is taken. Pick another.') : x.message, 4000); }
    };
    const a = d.afiliado; if (!a) return;
    const links = { pt: location.origin + '/?ref=' + a.codigo, en: location.origin + '/en/?ref=' + a.codigo };
    const msgs = { pt: `Estou usando o Quest Kids para o reforço escolar aqui em casa. Pelo meu link você ganha ${a.desconto_pct}% de desconto: ${links.pt}`, en: `I use Quest Kids for homework practice at home. With my link you get ${a.desconto_pct}% off: ${links.en}` };
    [['pt', '#afcopy', '#afshare'], ['en', '#afcopyen', '#afshareen']].forEach(([l, c, sh]) => {
      $(c).onclick = () => copiar(links[l]);
      $(sh).onclick = async () => { if (navigator.share) { try { await navigator.share({ text: msgs[l] }); } catch (e) {} } else window.open('https://wa.me/?text=' + encodeURIComponent(msgs[l]), '_blank'); };
    });
  }

  // todos os endereços, em português e inglês, para não errar ao mandar
  function linksAdmin(d) {
    const o = location.origin;
    const L = [
      ['🛍️', tx('Site de vendas (página inicial)', 'Sales website (home page)'), o + '/', o + '/en/'],
      ['✨', tx('Criar conta (teste grátis)', 'Create account (free trial)'), o + '/app/?criar=1&lang=pt', o + '/app/?criar=1&lang=en'],
      ['🔑', tx('Entrar no app (quem já tem conta)', 'Log in to the app'), o + '/app/?lang=pt', o + '/app/?lang=en'],
      ['🧪', tx('Demonstração com dados de exemplo (senha dos pais 2026)', 'Demo with sample data (parents password 2026)'), o + '/app/?demo=gabi&lang=pt', o + '/app/?demo=gabi&lang=en'],
      ['🚪', tx('Sair da demonstração', 'Leave the demo'), o + '/app/?demo=0&lang=pt', o + '/app/?demo=0&lang=en'],
      ['📜', tx('Termos de Uso', 'Terms of Use'), o + '/termos.html', o + '/termos.html#en'],
      ['🔒', tx('Política de Privacidade', 'Privacy Policy'), o + '/privacidade.html', o + '/privacidade.html#en']
    ];
    (d.afiliados || []).forEach(a => L.push(['🤝', tx('Parceiro ', 'Partner ') + esc(a.codigo) + (a.nome ? ' · ' + esc(a.nome) : '') + ` · ${a.indicados || 0} ${tx('cadastros', 'sign-ups')}`, o + '/?ref=' + a.codigo, o + '/en/?ref=' + a.codigo]));
    const b = (u, f) => `<div class="flex items-center gap-2 min-w-0"><span class="text-[18px]">${f}</span><code class="flex-1 min-w-0 truncate text-[12px] text-on-surface-variant">${esc(u.replace(/^https?:\/\//, ''))}</code><button data-copy="${esc(u)}" class="shrink-0 h-8 px-3 rounded-lg bg-primary-container text-on-primary text-label-sm">${tx('Copiar', 'Copy')}</button></div>`;
    return `<div class="space-y-2">${L.map(([ic, t, pt2, en]) => `<div class="border-b border-surface-container-high pb-2"><p class="text-label-md text-on-surface mb-1">${ic} ${t}</p>${b(pt2, '🇧🇷')}${b(en, '🇺🇸')}</div>`).join('')}</div>
      <details class="bg-surface-container-low rounded-xl p-3"><summary class="text-label-md text-primary cursor-pointer">${tx('Como testar um link de parceiro', 'How to test a partner link')}</summary>
        <ol class="list-decimal pl-5 mt-2 space-y-1 text-body-sm text-on-surface-variant">
          <li>${tx('Abra o link do parceiro numa <b>janela anônima</b> (ou outro celular).', 'Open the partner link in a <b>private window</b> (or another phone).')}</li>
          <li>${tx('Toque em "Começar teste grátis" e crie uma conta com um <b>e-mail novo</b> (que nunca foi usado no app).', 'Tap "Start free trial" and create an account with a <b>new email</b>.')}</li>
          <li>${tx('Volte aqui: o número de cadastros do parceiro aumenta. Abrir o próprio link na própria conta não conta.', 'Come back here: the partner sign-up count goes up. Opening your own link in your own account does not count.')}</li></ol></details>`;
  }
  /* ================= painel de gestão (só administradores) ================= */
  async function gestao() {
    const d = await DB.rpc('admin_painel').catch(x => { throw new Error(/admin_painel|function|schema/i.test(x.message) ? tx('Rode o SQL 06 no Supabase para ver o painel.', 'Run SQL 06 in Supabase to see the panel.') : x.message); });
    const precos = await DB.sel('precos', {}).catch(() => []);
    const pm = p2 => { const m = String(p2.valor_texto).match(/(\d+(?:[.,]\d{2})?)/); if (!m) return 0; const v = parseFloat(m[1].replace(',', '.')); return /\/\s*(mês|month)/i.test(p2.valor_texto) ? v : /6\s*(meses|months)/i.test(p2.valor_texto) ? v / 6 : /year|ano/i.test(p2.valor_texto) ? v / 12 : v; };
    let mrrB = 0, mrrU = 0;
    Object.entries(d.por_plano || {}).forEach(([k, n]) => { const [pl, mo] = k.split('-'); const fund = pl.endsWith('*'); const p2 = precos.find(x => x.plano === pl.replace('*', '') && x.moeda === mo && !!x.fundador === fund) || precos.find(x => x.plano === pl.replace('*', '') && x.moeda === mo); if (p2) { if (mo === 'usd') mrrU += pm(p2) * n; else mrrB += pm(p2) * n; } });
    const custo = (d.ia_mes && d.ia_mes.custo_centavos) || 0;
    const ativos = (d.por_status || {}).active || 0;
    const box = (n, l, sub) => `<div class="${card}"><b class="text-headline-lg-mobile text-on-surface block">${n}</b><span class="text-label-md text-on-surface-variant">${l}</span>${sub ? `<p class="text-body-sm text-on-surface-variant mt-1">${sub}</p>` : ''}</div>`;
    shell(`<div class="space-y-5 max-w-5xl"><div class="flex items-center justify-between gap-2"><h1 class="text-headline-lg-mobile text-on-surface">🛠️ ${tx('Painel de gestão', 'Admin panel')}</h1><button id="gback" class="text-label-md text-primary underline">${tx('Voltar', 'Back')}</button></div>
      <details class="${card} space-y-3" open><summary class="list-none cursor-pointer"><h2 class="text-headline-md text-on-surface">🔗 ${tx('Links para mandar', 'Links to share')}</h2></summary>
        <p class="text-body-sm text-on-surface-variant">${tx('Toque em Copiar e cole no WhatsApp ou e-mail. O idioma já vai certo no link.', 'Tap Copy and paste into WhatsApp or email. The language is set in the link.')}</p>
        ${linksAdmin(d)}</details>
      <h2 class="text-headline-md text-on-surface">${tx('Assinaturas', 'Subscriptions')}</h2>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">${box(d.familias, tx('famílias', 'families'), `+${d.novas7} ${tx('em 7 dias', 'in 7 days')} · +${d.novas30} ${tx('em 30', 'in 30')}`)}${box(ativos, tx('assinantes ativos', 'active subscribers'), Object.entries(d.por_plano || {}).map(([k, n]) => `${k.replace('*', ' (fundador)')}: ${n}`).join(' · ') || '—')}${box((d.por_status || {}).trialing || 0, tx('em teste grátis', 'on free trial'), `${tx('conversão', 'conversion')}: ${d.familias ? Math.round(100 * ativos / d.familias) : 0}%`)}${box(d.cancel30, tx('cancelamentos (30 dias)', 'cancellations (30 days)'), `${tx('atrasados', 'past due')}: ${(d.por_status || {}).past_due || 0}`)}</div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">${box('R$ ' + mrrB.toFixed(0) + (mrrU ? ' + $' + mrrU.toFixed(0) : ''), tx('receita mensal estimada (MRR)', 'estimated MRR'))}${box('$' + (custo / 100).toFixed(2), tx('custo de IA este mês', 'AI cost this month'), `${(d.ia_mes || {}).paginas || 0} ${tx('páginas', 'pages')} · ${(d.ia_mes || {}).familias || 0} ${tx('famílias', 'families')}`)}${box(ativos ? '$' + (custo / 100 / Math.max(1, ativos)).toFixed(2) : '—', tx('custo de IA por assinante', 'AI cost per subscriber'))}${box(d.licoes30, tx('lições criadas (30 dias)', 'lessons created (30 days)'), Object.entries(d.tarefas || {}).map(([k, n]) => `${k}: ${n}`).join(' · '))}</div>
      <h2 class="text-headline-md text-on-surface">${tx('Uso', 'Usage')}</h2>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">${box(d.criancas, tx('crianças cadastradas', 'kids'))}${box(d.ativas7, tx('crianças ativas (7 dias)', 'active kids (7 days)'), d.criancas ? Math.round(100 * d.ativas7 / d.criancas) + '% ' + tx('do total', 'of total') : '')}${box(d.sessoes7, tx('sessões (7 dias)', 'sessions (7 days)'))}${box(d.minutos7 + ' min', tx('tempo de estudo (7 dias)', 'study time (7 days)'), d.ativas7 ? Math.round(d.minutos7 / d.ativas7) + ' min ' + tx('por criança', 'per kid') : '')}</div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section class="${card} space-y-2"><h2 class="text-headline-md text-on-surface">💸 ${tx('Quem mais gasta IA (mês)', 'Top AI spend (month)')}</h2>${(d.ia_top || []).map(x => `<div class="flex justify-between text-body-md border-b border-surface-container-high py-1.5"><span class="truncate">${esc(x.email || x.familia_id)}</span><span class="${x.custo_centavos > 300 ? 'text-error font-extrabold' : 'text-on-surface'}">$${(x.custo_centavos / 100).toFixed(2)} · ${x.paginas} p.</span></div>`).join('') || `<p class="text-body-sm text-on-surface-variant">—</p>`}<p class="text-body-sm text-on-surface-variant">${tx('Em vermelho: acima de US$ 3 no mês. Ajuste o limite em limites_ia ou o preço dos créditos.', 'Red: above $3 this month. Adjust limits_ia or credit prices.')}</p></section>
        <section class="${card} space-y-2"><h2 class="text-headline-md text-on-surface">⚠️ ${tx('Erros da IA', 'AI errors')}</h2>${(d.erros || []).map(x => `<p class="text-body-sm text-on-surface border-b border-surface-container-high py-1.5">${new Date(x.criado_em).toLocaleDateString()} · ${esc(String(x.erro || '').slice(0, 140))}</p>`).join('') || `<p class="text-body-sm text-on-surface-variant">${tx('Nenhum. 🎉', 'None. 🎉')}</p>`}</section>
        <section class="${card} space-y-2"><div class="flex items-center justify-between"><h2 class="text-headline-md text-on-surface">🤝 ${tx('Comissões a pagar', 'Commissions to pay')}</h2>${(d.comissoes || []).length ? `<button id="pagar" class="h-9 px-3 rounded-lg bg-primary-container text-on-primary text-label-sm">${tx('Marcar todas como pagas', 'Mark all paid')}</button>` : ''}</div>
          ${(d.comissoes || []).map(x => `<div class="flex justify-between text-body-md border-b border-surface-container-high py-1.5"><span>${esc(x.codigo)} · PIX ${esc(x.pix || '—')}</span><b>${money(x.valor_centavos, x.moeda)}</b></div>`).join('') || `<p class="text-body-sm text-on-surface-variant">—</p>`}
          <p class="text-body-sm text-on-surface-variant">${tx('Parceiros', 'Partners')}: ${(d.afiliados || []).map(a => `${esc(a.codigo)} (${a.desconto_pct}% desc · ${a.comissao_pct}% com · ${a.indicados} ${tx('cadastros', 'sign-ups')})`).join(' · ') || '—'}</p></section>
        <section class="${card} space-y-2"><h2 class="text-headline-md text-on-surface">⭐ ${tx('Notas das provas (feedback dos pais)', 'Test results (parent feedback)')}</h2>${(d.feedbacks || []).map(x => `<div class="border-b border-surface-container-high py-1.5"><b class="text-label-md">${esc(x.materia || '')} · ${x.nota ?? '—'}</b>${x.autoriza_depoimento ? ' <span class="text-primary text-label-sm">✓ ' + tx('pode usar como depoimento', 'ok to use as testimonial') + '</span>' : ''}<p class="text-body-sm text-on-surface-variant">${esc(x.comentario || '')}</p></div>`).join('') || `<p class="text-body-sm text-on-surface-variant">—</p>`}</section>
      </div>
      <section class="${card} space-y-3"><h2 class="text-headline-md text-on-surface">⚠️ ${tx('Perguntas com problema', 'Questions with problems')}</h2>
        <p class="text-body-sm text-on-surface-variant">${tx('Reportadas pela criança, pelos pais ou pela conferência automática do app. A criança já não vê mais a pergunta; aqui você decide se desativa para sempre.', 'Reported by kids, parents or the automatic check. The child no longer sees it; decide here whether to turn it off for good.')}</p>
        <div id="replist" class="space-y-2"><p class="text-body-sm text-on-surface-variant">…</p></div></section>
      <section class="${card} space-y-3"><h2 class="text-headline-md text-on-surface">💬 ${tx('Dúvidas feitas ao Quico', 'Questions asked to Quico')}</h2>
        <div id="ajlist" class="space-y-2"><p class="text-body-sm text-on-surface-variant">…</p></div></section>
      <section class="${card} space-y-3"><h2 class="text-headline-md text-on-surface">🧮 ${tx('Custo de IA por envio', 'AI cost per upload')}</h2>
        <div id="custlist" class="space-y-2"><p class="text-body-sm text-on-surface-variant">…</p></div></section>
      <section class="${card} space-y-3"><h2 class="text-headline-md text-on-surface">👪 ${tx('Contas', 'Accounts')}</h2>
        <p class="text-body-sm text-on-surface-variant">${tx('Para testar o cadastro do zero: apague a conta e entre de novo com o mesmo e-mail (ou crie a conta de novo). Logins de administrador nunca são apagados: eles ganham uma família nova vazia.', 'To test sign-up from scratch: delete the account and log in again. Admin logins are never deleted: they get a new empty family.')}</p>
        <div class="flex gap-2"><input id="cbusca" class="${inputCls}" type="search" placeholder="${tx('Buscar por e-mail', 'Search by email')}"><button id="cbtn" class="h-12 px-4 rounded-xl bg-surface-container-high text-on-surface text-label-lg">${tx('Buscar', 'Search')}</button></div>
        <div id="clist" class="space-y-2"><p class="text-body-sm text-on-surface-variant">…</p></div></section>
      <section class="${card} space-y-3"><h2 class="text-headline-md text-on-surface">🎧 ${tx('Subir um tema narrado', 'Upload a narrated topic')}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-2"><input id="tt" class="${inputCls} sm:col-span-2" placeholder="${tx('Título', 'Title')}"><input id="ti" class="${inputCls}" placeholder="🎧" maxlength="4"><select id="tf" class="${inputCls}"><option value="10-14">10–14</option><option value="6-9">6–9</option></select></div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2"><select id="tl" class="${inputCls}"><option value="pt-BR">Português</option><option value="en">English</option></select><select id="tp" class="${inputCls}"><option value="">${tx('Grátis', 'Free')}</option><option value="ferias1">${tx('Pacote Férias', 'Holiday pack')}</option><option value="extra">Extra</option></select><input id="ta" type="file" accept="audio/*" class="text-body-sm"></div>
        <textarea id="tx" rows="5" class="w-full rounded-xl bg-surface-container-lowest border-2 border-surface-container-high p-3 text-body-sm" placeholder="${tx('Texto do capítulo (resumo com [[palavra|significado]])', 'Chapter text (summary with [[word|meaning]])')}"></textarea>
        <textarea id="tq" rows="4" class="w-full rounded-xl bg-surface-container-lowest border-2 border-surface-container-high p-3 text-body-sm font-mono" placeholder='${tx('Perguntas em JSON (opcional): [{"id":"x1","type":"mc","prompt":"...","options":["certa","errada"],"answer":0}]', 'Questions JSON (optional)')}'></textarea>
        ${btnP('tsave', tx('Publicar tema (1 capítulo)', 'Publish topic (1 chapter)'), 'upload')}</section>
    </div>`);
    $('#gback').onclick = () => { tab = 'conta'; render(); };
    app().querySelectorAll('[data-copy]').forEach(b => b.onclick = () => copiar(b.dataset.copy));
    const contas = async () => {
      const box2 = $('#clist'); if (!box2) return;
      let cs = []; try { cs = await DB.rpc('admin_contas', { busca: ($('#cbusca').value || '').trim() || null }); } catch (x) { box2.innerHTML = `<p class="text-body-sm text-error">${/admin_contas|function|schema/i.test(x.message) ? tx('Rode o SQL 07 no Supabase.', 'Run SQL 07 in Supabase.') : esc(x.message)}</p>`; return; }
      box2.innerHTML = cs.map(c => `<div class="flex items-start justify-between gap-3 border-b border-surface-container-high py-2"><div class="min-w-0"><b class="text-label-md text-on-surface break-all">${esc(c.emails || '—')}</b>${c.minha ? ` <span class="text-label-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">${tx('sua conta', 'yours')}</span>` : ''}
        <p class="text-body-sm text-on-surface-variant">${esc(c.criancas || tx('sem crianças', 'no kids'))} · ${c.licoes} ${tx('lições', 'lessons')} · ${c.sessoes} ${tx('sessões', 'sessions')} · ${esc(c.plano || '')} · ${new Date(c.criado_em).toLocaleDateString(pt() ? 'pt-BR' : 'en-US')}</p></div>
        <button data-del="${esc(c.id)}" class="shrink-0 h-9 px-3 rounded-lg bg-error-container text-on-error-container text-label-sm">${tx('Apagar', 'Delete')}</button></div>`).join('') || `<p class="text-body-sm text-on-surface-variant">${tx('Nenhuma conta encontrada.', 'No accounts found.')}</p>`;
      box2.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => {
        const c = cs.find(x => x.id === b.dataset.del); if (!c) return;
        const aviso = tx(`APAGAR PARA SEMPRE a conta de ${c.emails}?\n\nCrianças: ${c.criancas || 'nenhuma'}\n${c.licoes} lições e ${c.sessoes} sessões, progresso, material, gravações, convites e assinatura serão apagados. Não dá para desfazer.${c.minha ? '\n\n⚠️ Esta é a SUA conta (onde você está agora).' : ''}\n\nPara confirmar, digite APAGAR:`, `PERMANENTLY delete the account of ${c.emails}?\n\nKids: ${c.criancas || 'none'}\n${c.licoes} lessons, ${c.sessoes} sessions, progress, materials, recordings, invites and subscription will be deleted. This cannot be undone.${c.minha ? '\n\n⚠️ This is YOUR account.' : ''}\n\nType DELETE to confirm:`);
        const r = prompt(aviso); if (!r || !/^(APAGAR|DELETE)$/i.test(r.trim())) return toast(tx('Nada foi apagado.', 'Nothing was deleted.'));
        b.disabled = true; b.textContent = '…';
        try {
          const res = await DB.fn('ia', { acao: 'apagar_conta', familia: c.id });
          if (res && res.error) throw new Error(res.error);
          toast('🗑️ ' + tx(`Conta apagada (${res.arquivos || 0} arquivos, ${res.logins || 0} logins).`, `Account deleted (${res.arquivos || 0} files, ${res.logins || 0} logins).`), 5000);
          if (c.minha) { setTimeout(() => location.reload(), 1500); return; }
          contas();
        } catch (x) { toast(/sem permissão/.test(x.message) ? tx('Só administradores podem apagar contas.', 'Admins only.') : /acao|login|família/.test(x.message) ? x.message : tx('Não deu certo. Confira se a função "ia" foi atualizada.', 'It failed. Check the "ia" function was updated.') + ' ' + x.message, 6000); b.disabled = false; b.textContent = tx('Apagar', 'Delete'); }
      });
    };
    $('#cbtn').onclick = contas; $('#cbusca').onkeydown = e => { if (e.key === 'Enter') contas(); };
    contas();
    const sql09 = x => /admin_|function|schema/i.test(x.message) ? tx('Rode o SQL 09 no Supabase.', 'Run SQL 09 in Supabase.') : esc(x.motivo || x.message);
    const reps = async () => {
      const bx = $('#replist'); if (!bx) return; let rs = [];
      try { rs = await DB.rpc('admin_reportes'); } catch (x) { bx.innerHTML = `<p class="text-body-sm text-error">${sql09(x)}</p>`; return; }
      const MOT = { texto: tx('texto estranho', 'odd text'), resposta: tx('resposta errada', 'wrong answer'), entendi: tx('não entendeu', "didn't understand"), outro: tx('outro', 'other') };
      bx.innerHTML = rs.map(r => `<div class="border-b border-surface-container-high pb-2"><p class="text-label-sm text-on-surface-variant">${new Date(r.criado_em).toLocaleString(pt() ? 'pt-BR' : 'en-US', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })} · ${r.quem === 'auto' ? '🤖 ' + tx('automático', 'automatic') : r.quem === 'pais' ? '👪 ' + tx('pais', 'parents') : '🧒 ' + tx('criança', 'child')} · ${esc(MOT[r.motivo] || String(r.motivo || '').replace(/^auto:/, ''))}${r.vezes > 1 ? ` · ${r.vezes}×` : ''}${r.licao ? ' · ' + esc(r.licao) : ''}</p>
        <p class="text-body-md text-on-surface">${esc(String((r.pergunta && r.pergunta.prompt) || r.pergunta_id).slice(0, 220))}</p>
        <div class="flex gap-2 mt-1"><button data-rres="${r.id}|1" class="h-8 px-3 rounded-lg bg-error-container text-on-error-container text-label-sm">${tx('Desativar pergunta', 'Turn off question')}</button><button data-rres="${r.id}|0" class="h-8 px-3 rounded-lg bg-surface-container-high text-on-surface text-label-sm">${tx('Está certa, manter', "It's fine, keep")}</button></div></div>`).join('') || `<p class="text-body-sm text-on-surface-variant">✅ ${tx('Nenhuma pergunta com problema.', 'No problem questions.')}</p>`;
      bx.querySelectorAll('[data-rres]').forEach(b => b.onclick = async () => { const [id, d2] = b.dataset.rres.split('|'); try { await DB.rpc('admin_resolver_reporte', { rid: +id, desativar: d2 === '1' }); toast('✅'); reps(); } catch (x) { toast(x.message); } });
    };
    reps();
    (async () => {
      const bx = $('#ajlist'); if (!bx) return; let a;
      try { a = await DB.rpc('admin_ajuda'); } catch (x) { bx.innerHTML = `<p class="text-body-sm text-error">${/admin_ajuda|function|schema/i.test(x.message) ? tx('Rode o SQL 10 no Supabase.', 'Run SQL 10 in Supabase.') : esc(x.message)}</p>`; return; }
      bx.innerHTML = `<p class="text-body-md text-on-surface">${tx('Hoje', 'Today')}: <b>${a.hoje}</b> · ${tx('7 dias', '7 days')}: <b>${a.semana}</b> · ${tx('custo 30 dias', '30-day cost')}: <b>$${(+a.custo30 || 0).toFixed(2)}</b></p>` +
        ((a.ultimas || []).map(q => `<details class="border-b border-surface-container-high py-1.5"><summary class="text-body-md text-on-surface cursor-pointer">${q.origem === 'site' ? '🛍️' : '👪'} ${esc(String(q.pergunta || '').slice(0, 140))} <span class="text-label-sm text-on-surface-variant">· ${new Date(q.criado_em).toLocaleString(pt() ? 'pt-BR' : 'en-US', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span></summary><p class="text-body-sm text-on-surface-variant mt-1 whitespace-pre-line">${esc(q.resposta || '')}</p></details>`).join('') || `<p class="text-body-sm text-on-surface-variant">${tx('Ninguém perguntou nada ainda.', 'No questions yet.')}</p>`) +
        `<p class="text-[12px] text-on-surface-variant">🛍️ ${tx('site de vendas', 'sales site')} · 👪 ${tx('Área dos pais', 'Parents area')}. ${tx('Use estas perguntas para melhorar as telas e o site.', 'Use these questions to improve the screens and site.')}</p>`;
    })();
    (async () => {
      const bx = $('#custlist'); if (!bx) return; let cs = [];
      try { cs = await DB.rpc('admin_custos'); } catch (x) { bx.innerHTML = `<p class="text-body-sm text-error">${sql09(x)}</p>`; return; }
      const tot = cs.reduce((a, c) => a + (+c.usd || 0), 0), pags = cs.reduce((a, c) => a + (+c.paginas || 0), 0);
      bx.innerHTML = cs.length ? `<p class="text-body-md text-on-surface">${tx('Últimos', 'Last')} ${cs.length} ${tx('envios', 'uploads')}: <b>$${tot.toFixed(2)}</b> · ${tx('média por envio', 'avg per upload')} <b>$${(tot / cs.length).toFixed(3)}</b> · ${tx('por página', 'per page')} <b>$${pags ? (tot / pags).toFixed(3) : '—'}</b></p>
        <div class="overflow-x-auto"><table class="w-full text-body-sm"><thead><tr class="text-left text-on-surface-variant"><th class="py-1 pr-2">${tx('Data', 'Date')}</th><th class="pr-2">${tx('Família', 'Family')}</th><th class="pr-2">${tx('Págs', 'Pages')}</th><th class="pr-2">${tx('Perg.', 'Qs')}</th><th class="pr-2">Tokens</th><th>US$</th></tr></thead><tbody>
        ${cs.map(c => `<tr class="border-t border-surface-container-high"><td class="py-1 pr-2 whitespace-nowrap">${new Date(c.feito_em).toLocaleDateString(pt() ? 'pt-BR' : 'en-US')}</td><td class="pr-2 max-w-[140px] truncate">${esc(c.email || '—')}</td><td class="pr-2">${c.paginas ?? '—'}</td><td class="pr-2">${c.perguntas ?? '—'}${c.removidas ? ` <span class="text-error">(−${c.removidas})</span>` : ''}</td><td class="pr-2 whitespace-nowrap">${c.tok_in ? Math.round(c.tok_in / 1000) + 'k / ' + Math.round((c.tok_out || 0) / 1000) + 'k' : '—'}</td><td>${c.usd != null ? (+c.usd).toFixed(3) : '—'}</td></tr>`).join('')}</tbody></table></div>
        <p class="text-[12px] text-on-surface-variant">${tx('Tokens: entrada / saída. "−N" = perguntas descartadas pela dupla conferência. Envios antigos (antes de hoje) não têm tokens.', 'Tokens: input / output. "−N" = questions discarded by the double check. Older uploads have no token data.')}</p>` : `<p class="text-body-sm text-on-surface-variant">—</p>`;
    })();
    const pg = $('#pagar'); if (pg) pg.onclick = async () => { if (!confirm(tx('Marcar todas as comissões listadas como pagas? Faça isso depois de enviar os PIX.', 'Mark all listed commissions as paid? Do this after sending payouts.'))) return; try { await DB.rpc('admin_pagar_comissao', { ids: d.comissoes.map(x => x.id) }); toast('✅'); render(); } catch (x) { toast(x.message); } };
    $('#tsave').onclick = async () => {
      const tit = $('#tt').value.trim(); if (!tit) return toast(tx('Coloque o título.', 'Add a title.'));
      let qs = []; try { qs = $('#tq').value.trim() ? JSON.parse($('#tq').value) : []; } catch (e) { return toast(tx('JSON das perguntas inválido.', 'Invalid questions JSON.')); }
      const b = $('#tsave'); b.disabled = true;
      try {
        const id = 'T' + Date.now().toString(36); let audio = '';
        const f = $('#ta').files[0]; if (f) { const path = `${id}/${f.name.replace(/[^\w.-]+/g, '_')}`; await DB.upload('temas', path, f); audio = C.SUPABASE_URL + '/storage/v1/object/public/temas/' + path; }
        await DB.ins('temas', { id, titulo: tit, icone: $('#ti').value.trim() || '🎧', faixa: $('#tf').value, idioma: $('#tl').value, pacote: $('#tp').value || null, conteudo: { chapters: [{ title: tit, audio, text: $('#tx').value, minutes: 5, questions: qs }] } });
        toast('✅ ' + tx('Tema publicado!', 'Topic published!')); render();
      } catch (x) { toast(x.message, 5000); b.disabled = false; }
    };
  }

  const inviteUrl = cod => location.origin + location.pathname.replace(/[^/]*$/, '') + '?convite=' + cod;
  async function conta() {
    const [afp, adm] = await Promise.all([DB.rpc('meu_painel_afiliado').catch(() => null), DB.rpc('sou_admin').catch(() => false)]);
    const s = A().sub || {};
    const moeda = A().moeda();
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
        ${!paying && s.plano !== 'cortesia' ? `<section class="space-y-3"><div class="flex items-center justify-between gap-2"><h2 class="text-headline-md text-on-surface">${tx('Escolha seu plano', 'Choose your plan')}</h2>${seg([['BR', '🇧🇷 Brasil'], ['US', '🇺🇸 USA']], A().pais(), 'data-pais')}</div>
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
        ${afp ? parceiroHtml(afp) : ''}
        ${adm === true ? `<button id="gest" class="w-full h-14 rounded-2xl bg-inverse-surface text-inverse-on-surface text-label-lg flex items-center justify-center gap-2">${I('admin_panel_settings', 'text-[22px]')} ${tx('Painel de gestão (só você vê)', 'Admin panel (only you see this)')}</button>` : ''}
        <section data-senha class="${card} space-y-3"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('lock', 'text-primary')} ${tx('Senha dos pais', 'Parents password')}</h2><p class="text-body-sm text-on-surface-variant">${tx('4 números para entrar nesta área. As crianças não devem saber.', '4 digits to enter this area. Keep it from the kids.')}</p>${btnS('senha', tx('Mudar a senha dos pais', 'Change parents password'), 'password')}</section>
        <section class="${card} space-y-3"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('public', 'text-primary')} ${tx('Onde a família mora', 'Where your family lives')}</h2>
          <p class="text-body-sm text-on-surface-variant">${tx('Define a moeda dos preços, as formas de pagamento (Pix só no Brasil) e o currículo das lições (BNCC ou americano).', 'Sets the price currency, payment methods (Pix only in Brazil) and the lesson curriculum (Brazilian or US).')}</p>
          ${seg([['BR', '🇧🇷 Brasil'], ['US', '🇺🇸 ' + tx('Estados Unidos', 'United States')]], A().pais(), 'data-pais')}</section>
        <section class="${card} space-y-3"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('lock_clock', 'text-primary')} ${tx('Área dos pais aberta por', 'Keep Parents area open for')}</h2>
          <p class="text-body-sm text-on-surface-variant">${tx('Sem pedir a senha de novo, mesmo se o celular bloquear ou você for para outro app. Ao tocar em "Voltar para a criança", fecha na hora.', 'No password again, even if the phone locks or you switch apps. Tapping "Back to your child" closes it right away.')}</p>
          ${seg([['5', '5 min'], ['10', '10 min'], ['30', '30 min']], String(A().paisMin()), 'data-pmin')}</section>
        <section class="${card} space-y-3"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('volume_up', 'text-primary')} ${tx('Sons do app', 'App sounds')}</h2><p class="text-body-sm text-on-surface-variant">${tx('Sons baixinhos quando a criança acerta, erra ou termina. Ajudam você a perceber que ela está fazendo a lição.', 'Soft sounds when your child gets it right, wrong or finishes. They let you hear the lesson is happening.')}</p>${seg([['1', '🔊 ' + tx('Ligado', 'On')], ['0', '🔇 ' + tx('Desligado', 'Off')]], localStorage.getItem('qk.som') === '0' ? '0' : '1', 'data-som')}</section>
        <section class="${card} space-y-3"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('language', 'text-primary')} ${tx('Idioma do painel', 'Panel language')}</h2>${seg([['pt', 'Português'], ['en', 'English']], QK.lang, 'data-l')}</section>
        <section class="${card} space-y-2"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('help', 'text-primary')} ${tx('Ajuda', 'Help')}</h2>
          <p class="text-body-sm text-on-surface-variant">${tx('Suporte', 'Support')}: <a class="text-primary underline" href="mailto:${C.SUPORTE_EMAIL}">${C.SUPORTE_EMAIL}</a></p>
          <p class="text-body-sm"><a class="text-primary underline" href="../termos.html">${tx('Termos de Uso', 'Terms')}</a> · <a class="text-primary underline" href="../privacidade.html">${tx('Política de Privacidade', 'Privacy Policy')}</a></p>
          <p class="text-body-sm text-on-surface-variant">${tx('Para apagar todos os dados da família, escreva para o suporte.', 'To delete all family data, email support.')}</p>
          <p class="text-label-sm text-outline">${esc((Auth.user && Auth.user.email) || '')}</p>${btnS('out', t('sair'), 'logout')}</section>
      </div></div>`);
    app().querySelectorAll('[data-pais]').forEach(b => b.onclick = () => mudarPais(b.dataset.pais));
    app().querySelectorAll('[data-pmin]').forEach(b => b.onclick = () => { try { localStorage.setItem('qk.paisMin', b.dataset.pmin); } catch (e) {} A().abrirPais(); render(); });
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
    const gs = $('#gest'); if (gs) gs.onclick = () => { tab = 'gestao'; render(); };
    if (afp) wireParceiro(afp);
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
    $('#out').onclick = async () => { A().fecharPais(); await Auth.signOut(); A().boot(); };
  }

  // Quico assistente: leva o pai direto para a tela (e a parte) certa
  function ir(d) {
    const M = { material: ['material'], modo: ['material', '[data-modo]'], perguntas: ['material', '[data-perg]'], temas: ['material', '[data-tat], #buytemas'], creditos: ['material', '#buycred'],
      resumo: ['resumo'], simulado: ['resumo', '#simsave'], corrigir: ['corrigir'], criancas: ['criancas'], nova_crianca: ['criancas', '#novak'], conta: ['conta'],
      planos: ['conta', '#planos, #portal, #assinar'], convite: ['conta', '#ivm'], parceiro: ['conta', '#afc'], pais: ['conta', '[data-pais]'], senha: ['conta', '[data-senha]'] };
    const m = M[d]; if (!m) return;
    if (d === 'nova_crianca') { tab = 'criancas'; newChild(false); return; }
    tab = m[0]; render();
    if (m[1]) { let n = 0; const t = setInterval(() => { const el = document.querySelector(m[1]); if (el || ++n > 25) { clearInterval(t); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('ring-4', 'ring-secondary-container', 'rounded-xl'); setTimeout(() => el.classList.remove('ring-4', 'ring-secondary-container'), 2600); } } }, 200); }
  }
  window.QKParent = { open, newChild, ir };
})();
