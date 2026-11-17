/* Quest Kids — área dos pais (visual do Stitch "Painel dos pais"): resumo, correções, material, crianças e conta */
(function () {
  'use strict';
  const { t, $, esc, md, today, addDays, toast, Auth, DB, C } = QK;
  const A = () => window.QKApp;
  const pt = () => QK.lang === 'pt';
  const tx = (p, e) => pt() ? p : e;
  const I = (n, c, f) => window.QKApp.I(n, c, f);
  const app = () => $('#app');
  const view = html => { app().innerHTML = html; window.scrollTo(0, 0); };
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

  function shell(inner, bare) {
    A().theme('simples', A().adultTema());
    const tabs = [['resumo', 'dashboard', tx('Resumo', 'Summary')], ['corrigir', 'rate_review', tx('Corrigir', 'Review')], ['material', 'photo_camera', tx('Material', 'Material')], ['criancas', 'face', tx('Crianças', 'Kids')], ['conta', 'settings', tx('Conta', 'Account')]];
    view(`<header class="fixed top-0 inset-x-0 z-40 bg-surface/80 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div class="h-16 px-margin md:px-margin-tablet max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <button id="back" class="${bare ? 'hidden' : ''} flex items-center gap-1 min-h-[44px] px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-primary">${I('arrow_back', 'text-[20px]')}<span class="text-label-sm whitespace-nowrap">${tx('Voltar ao app', 'Back to app')}</span></button>
            <span class="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full">${I('lock', 'text-primary text-[16px]')}<span class="text-label-sm text-primary uppercase">${tx('Pais', 'Parents')}</span></span>
          </div>
          <nav class="hidden lg:flex items-center gap-1">${tabs.map(([k, i, l]) => `<button data-tab="${k}" class="flex items-center gap-1.5 px-3 py-2 rounded-full text-label-md ${tab === k ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'}">${I(i, 'text-[18px]', tab === k)}${l}</button>`).join('')}</nav>
          <div class="flex items-center gap-2 shrink-0"><button id="ptm" title="${A().temaAtual() === 'escuro' ? tx('Modo claro', 'Light mode') : tx('Modo escuro', 'Dark mode')}" class="w-9 h-9 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center">${I(A().temaAtual() === 'escuro' ? 'light_mode' : 'dark_mode', 'text-[20px]', 1)}</button>
          <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center">${I('person', 'text-on-primary text-[20px]')}</div></div>
        </div></header>
      <main class="pt-20 pb-32 lg:pb-12 px-margin md:px-margin-tablet max-w-6xl mx-auto">${inner}</main>
      ${bare ? '' : `<nav class="lg:hidden fixed bottom-0 inset-x-0 z-40 pb-safe md:bottom-4 md:px-4"><div class="bg-surface/90 backdrop-blur-xl shadow-[0_-4px_16px_rgba(20,163,163,0.06)] md:shadow-lg md:rounded-3xl md:max-w-xl md:mx-auto grid grid-cols-5 h-20 px-1">
        ${tabs.map(([k, i, l]) => `<button data-tab="${k}" class="flex flex-col items-center justify-center gap-1 ${tab === k ? 'text-primary' : 'text-on-surface-variant'}">${I(i, 'text-[24px]', tab === k)}<span class="text-label-sm">${l}</span></button>`).join('')}</div></nav>`}`);
    $('#back').onclick = () => A().picker();
    $('#ptm').onclick = () => { A().setAdultTema(A().temaAtual() === 'escuro' ? 'claro' : 'escuro'); render(); };
    app().querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { tab = b.dataset.tab; render(); });
  }
  function kidSwitcher(kid) {
    const others = A().kids.filter(k => k.id !== kid.id);
    return `<div class="bg-surface-container-low rounded-xl p-3 flex items-center justify-between gap-3">
      <div class="flex items-center gap-3 min-w-0"><div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-[26px] shadow-sm shrink-0">${esc(kid.avatar)}</div>
        <div class="min-w-0"><span class="text-headline-md text-on-surface truncate block">${esc(kid.apelido)}</span><p class="text-body-sm text-on-surface-variant truncate">${[kid.serie, kid.idade ? kid.idade + ' ' + tx('anos', 'yrs') : '', kid.minutos + ' min/' + tx('dia', 'day')].filter(Boolean).join(' • ')}</p></div></div>
      ${others.length ? `<div class="flex gap-1.5">${others.map(k => `<button data-kid="${k.id}" class="w-10 h-10 rounded-full bg-surface-container-lowest shadow-sm text-[22px]" title="${esc(k.apelido)}">${esc(k.avatar)}</button>`).join('')}</div>` : ''}</div>`;
  }
  const wireKidSwitch = () => app().querySelectorAll('[data-kid]').forEach(b => b.onclick = () => { kidSel = b.dataset.kid; render(); });

  async function open() { tab = 'resumo'; await A().loadFamily().catch(() => {}); kidSel = kidSel && A().kids.find(k => k.id === kidSel) ? kidSel : (A().kids[0] || {}).id; render(); }
  function render() {
    shell('<div class="spin" style="margin-top:20vh"></div>');
    ({ resumo, corrigir, material, criancas, conta })[tab]().catch(x => shell(`<div class="${card}"><p class="text-body-md">😕 ${esc(x.message)}</p></div>`));
  }

  /* ================= resumo ================= */
  async function resumo() {
    const kid = A().kids.find(k => k.id === kidSel); if (!kid) return newChild(true);
    const since = addDays(today(), -14);
    const [pr, ts] = await Promise.all([DB.sel('progresso', { eq: { crianca_id: kid.id, chave: 'main' } }), DB.sel('tentativas', { eq: { crianca_id: kid.id }, gte: { iniciada_em: since }, order: 'iniciada_em.desc', limit: 60 })]);
    const p = (pr[0] && pr[0].dados) || {}; const dias = p.dias || {}; const goal = kid.minutos || 20;
    const wk = []; for (let i = 6; i >= 0; i--) wk.push(addDays(today(), -i));
    const plan = wk.filter(d => (kid.dias || [1, 2, 3, 4, 5]).includes(new Date(d + 'T12:00').getDay()));
    const studied = wk.filter(d => ((dias[d] || {}).seg || 0) >= goal * 60);
    const newWords = Object.values(p.wordbank || {}).filter(x => x.added >= addDays(today(), -6)).length;
    const t7 = ts.filter(x => x.iniciada_em >= addDays(today(), -6));
    const recs = t7.flatMap(x => (x.leitura && x.leitura.recordings) || []); const rated = recs.filter(r => r.rating);
    const pages = t7.reduce((s, x) => s + ((x.leitura && x.leitura.pages) || []).length, 0);
    const items = t7.flatMap(x => x.itens || []).filter(i => i.correct !== null && i.correct !== undefined && i.station !== 'palavras');
    const firsts = items.filter(i => !['similar', 'review', 'wordrev', 'extra'].includes(i.source));
    const acc = firsts.length ? Math.round(100 * firsts.filter(i => i.correct).length / firsts.length) : null;
    const skills = Object.entries(p.skills || {}).filter(([, v]) => v.right + v.wrong >= 3).map(([s, v]) => [s, Math.round(100 * v.right / (v.right + v.wrong)), v.right + v.wrong]).sort((a, b) => a[1] - b[1]);
    const weak = skills[0];
    const alerts = [];
    wk.forEach(d => { const x = dias[d]; if (x && x.seg >= 600 && (x.q || 0) < 4) alerts.push(['warning', `${new Date(d + 'T12:00').toLocaleDateString(pt() ? 'pt-BR' : 'en-US', { weekday: 'long' })}: ${Math.round(x.seg / 60)} min ${tx('e só', 'and only')} ${x.q || 0} ${tx('perguntas', 'questions')}`]); });
    const pend = ts.reduce((s, x) => s + (x.pendentes || 0), 0) + recs.filter(r => !r.rating).length;
    if (pend) alerts.push(['rate_review', `${pend} ${pend === 1 ? tx('item esperando sua correção', 'item waiting for your review') : tx('itens esperando sua correção', 'items waiting for your review')}`, 'corrigir']);
    const mins = wk.map(d => Math.round(((dias[d] || {}).seg || 0) / 60)); const maxM = Math.max(goal, ...mins, 1);
    const avg = Math.round(mins.reduce((a, b) => a + b, 0) / 7);
    const wkd = pt() ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const kpi = (icon, iconCls, tag, tagCls, big, small, bar) => `<div class="${card} flex flex-col justify-between gap-2"><div class="flex items-center justify-between"><span class="w-9 h-9 rounded-full ${iconCls} flex items-center justify-center">${I(icon, 'text-[20px]', 1)}</span>${tag ? `<span class="text-label-sm ${tagCls} px-2 py-0.5 rounded-full">${tag}</span>` : ''}</div>
      <div><span class="text-headline-xl-mobile text-on-surface">${big}</span><p class="text-body-sm text-on-surface-variant">${small}</p></div>${bar != null ? `<div class="w-full bg-surface-container-high rounded-full h-2 overflow-hidden"><div class="bg-primary-container h-full rounded-full" style="width:${bar}%"></div></div>` : ''}</div>`;
    const tl = A().trialLeft();
    shell(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div class="lg:col-span-3 space-y-3">
        <section class="${card} space-y-3">
          <div class="flex items-center justify-between"><div><p class="text-label-sm text-outline flex items-center gap-1 uppercase tracking-wide">${I('verified_user', 'text-[14px] text-primary')} ${tx('Área dos pais', 'Parents area')}</p>
            <h1 class="text-headline-lg-mobile md:text-headline-lg text-on-surface mt-0.5">${tx('Olá, família', 'Hi, family')} 👋</h1></div>
            <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">${I('shield_person', 'text-[24px]')}</div></div>
          ${kidSwitcher(kid)}</section>
        ${tl !== null ? `<button id="toplan" class="w-full text-left bg-secondary-fixed text-on-secondary-fixed rounded-2xl p-3.5 flex items-center gap-3">${I('hourglass_top', 'text-[22px]')}<span class="text-label-md flex-1">${tx(`Teste grátis: faltam ${tl} dias.`, `Free trial: ${tl} days left.`)}</span><span class="text-label-md underline">${tx('Ver planos', 'See plans')}</span></button>` : ''}
        ${alerts.map(([ic, msg, go]) => `<${go ? `button data-go="${go}"` : 'div'} class="w-full text-left bg-secondary-fixed/60 text-on-secondary-fixed rounded-2xl p-3.5 flex items-center gap-3">${I(ic, 'text-[22px]')}<span class="text-label-md">${esc(msg)}</span></${go ? 'button' : 'div'}>`).join('')}
      </div>
      <section class="lg:col-span-2 space-y-2">
        <div class="flex items-center justify-between px-1"><h2 class="text-headline-md text-on-surface">${tx('Resumo da semana', 'This week')}</h2><span class="text-label-sm text-outline">${tx('Últimos 7 dias', 'Last 7 days')}</span></div>
        <div class="grid grid-cols-2 gap-3">
          ${kpi('calendar_month', 'bg-primary-fixed-dim/20 text-primary', `${tx('meta', 'goal')} ${goal} min`, 'text-primary bg-primary/10', `${studied.length} <span class="text-headline-md text-on-surface-variant">/ ${plan.length}</span>`, tx('Dias de estudo', 'Study days'), plan.length ? Math.round(100 * Math.min(studied.length, plan.length) / plan.length) : 0)}
          ${kpi('spellcheck', 'bg-secondary-container/40 text-on-secondary-container', `${Object.keys(p.wordbank || {}).length} ${tx('no total', 'total')}`, 'text-secondary bg-secondary-container/30', newWords, tx('Palavras novas', 'New words'))}
          ${kpi('record_voice_over', 'bg-tertiary-fixed/40 text-tertiary', rated.length ? `${rated.length} ${tx('avaliadas', 'rated')}` : '', 'text-tertiary bg-tertiary/10', rated.length ? '⭐ ' + (rated.reduce((s, r) => s + r.rating, 0) / rated.length).toFixed(1).replace('.', pt() ? ',' : '.') : pages, rated.length ? tx('Nota da leitura', 'Reading score') : tx('Páginas lidas', 'Pages read'))}
          ${kpi('target', 'bg-primary/10 text-primary', acc === null ? '' : acc >= 85 ? tx('Excelente 🎯', 'Excellent 🎯') : acc >= 65 ? tx('Bom', 'Good') : tx('Atenção', 'Watch'), 'text-primary bg-primary/10', acc === null ? '—' : acc + '%', weak ? tx('Reforçar: ', 'Needs work: ') + esc(A().skillInfo(weak[0]).name) : tx('Acertos na 1ª tentativa', 'Right on 1st try'))}
        </div></section>
      <section class="${card} space-y-4">
        <div class="flex items-start justify-between gap-2"><div><h2 class="text-headline-md text-on-surface">${tx('Tempo diário', 'Daily time')}</h2><p class="text-body-sm text-on-surface-variant">${tx('Média de', 'Average')} ${avg} min/${tx('dia', 'day')}</p></div>
          <span class="flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded-full text-label-sm text-on-surface"><span class="w-2.5 h-2.5 rounded-full bg-primary-container"></span>${tx('Meta', 'Goal')}: ${goal} min</span></div>
        <div class="grid grid-cols-7 gap-2 items-end h-36">${wk.map((d, i) => `<div class="flex flex-col items-center gap-1.5 h-full justify-end"><span class="text-label-sm ${mins[i] >= goal ? 'text-primary' : 'text-on-surface-variant'}">${mins[i]}m</span><div class="w-full max-w-[28px] rounded-t-lg ${mins[i] >= goal ? 'bg-primary-container' : 'bg-tertiary-container/80'}" style="height:${Math.max(3, Math.round(100 * mins[i] / maxM))}%"></div><span class="text-label-sm text-outline">${wkd[new Date(d + 'T12:00').getDay()]}</span></div>`).join('')}</div>
      </section>
      <section class="lg:col-span-2 space-y-2"><div class="flex items-center justify-between px-1"><h2 class="text-headline-md text-on-surface">${tx('Domínio por assunto', 'Mastery by topic')}</h2></div>
        ${skills.length ? `<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${skills.slice().sort((a, b) => b[2] - a[2]).slice(0, 8).map(([s, pc, n]) => { const inf = A().skillInfo(s); return `<div class="${card} space-y-2"><div class="flex items-center justify-between gap-2"><div class="flex items-center gap-2.5 min-w-0"><div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">${I(inf.icon, 'text-[22px]')}</div><div class="min-w-0"><b class="text-label-lg text-on-surface truncate block">${esc(inf.name)}</b><span class="text-body-sm text-on-surface-variant">${n} ${tx('respostas', 'answers')}</span></div></div><span class="text-label-lg ${pc >= 80 ? 'text-primary' : pc >= 60 ? 'text-secondary' : 'text-error'}">${pc}%</span></div>
          <div class="w-full bg-surface-container-high rounded-full h-2 overflow-hidden"><div class="h-full rounded-full ${pc >= 80 ? 'bg-primary-container' : pc >= 60 ? 'bg-secondary-container' : 'bg-error'}" style="width:${pc}%"></div></div></div>`; }).join('')}</div>`
        : `<p class="${card} text-body-md text-on-surface-variant">${tx('Aparece depois das primeiras lições.', 'Shows up after the first lessons.')}</p>`}</section>
      <section class="${card}"><h2 class="text-headline-md text-on-surface mb-3">${tx('Últimas sessões', 'Recent sessions')}</h2><div class="divide-y divide-surface-container-high">
        ${ts.slice(0, 6).map(x => `<div class="py-2.5 flex items-center gap-3"><div class="flex-1 min-w-0"><b class="text-label-md text-on-surface truncate block">${esc((x.leitura && x.leitura.titulo) || (x.tipo === 'pratica' ? tx('Prática', 'Practice') : x.licao_id))}</b><span class="text-body-sm text-on-surface-variant">${new Date(x.iniciada_em).toLocaleDateString(pt() ? 'pt-BR' : 'en-US', { day: '2-digit', month: 'short' })} · ${Math.round((x.duracao_seg || 0) / 60)} min · ${x.acertos || 0}/${x.total || 0}</span></div><span class="text-label-sm">${'⭐'.repeat(Math.min(3, Math.ceil((x.estrelas || 0) * 3 / 5)))}</span></div>`).join('') || `<p class="text-body-md text-on-surface-variant py-2">${tx('Nenhuma ainda.', 'None yet.')}</p>`}</div></section>
    </div>`);
    wireKidSwitch();
    const tp = $('#toplan'); if (tp) tp.onclick = () => { tab = 'conta'; render(); };
    app().querySelectorAll('[data-go]').forEach(b => b.onclick = () => { tab = b.dataset.go; render(); });
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
      <section class="space-y-3"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('edit_note', 'text-primary')} ${tx('Respostas escritas', 'Written answers')} <span class="text-label-md text-on-surface-variant">(${texts.length})</span></h2>
        ${texts.map(({ x, it, i }) => `<div class="${card} space-y-3" data-tid="${x.id}" data-i="${i}"><div class="text-label-sm text-on-surface-variant">${esc(kname(x.crianca_id))} · ${new Date(it.at).toLocaleDateString(pt() ? 'pt-BR' : 'en-US')}</div>
          <p class="text-label-lg text-on-surface">${md(it.prompt || it.qid)}</p><div class="bg-surface-container-low rounded-xl p-3 text-body-md text-on-surface">${esc(it.answer)}</div>
          ${it.rubric ? `<details class="text-body-sm text-on-surface-variant"><summary class="cursor-pointer text-primary">${tx('Como corrigir', 'How to grade')}</summary>${md(it.rubric)}</details>` : ''}
          <input class="${inputCls}" placeholder="${tx('Recado para a criança (opcional)', 'Note for your child (optional)')}" data-fb>
          <div class="grid grid-cols-3 gap-2">${[['0', 'close', 'bg-error-container text-on-error-container'], ['1', 'remove', 'bg-secondary-fixed text-on-secondary-fixed'], ['2', 'check', 'bg-primary-container text-on-primary']].map(([s, ic, c]) => `<button data-score="${s}" class="h-12 rounded-xl ${c} text-label-lg flex items-center justify-center gap-1">${I(ic, 'text-[20px]')} ${s}</button>`).join('')}</div></div>`).join('') || `<p class="${card} text-body-md text-on-surface-variant">${tx('Nada para corrigir. 🎉', 'Nothing to review. 🎉')}</p>`}</section>
      <section class="space-y-3"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('record_voice_over', 'text-primary')} ${tx('Leituras gravadas', 'Recorded reading')} <span class="text-label-md text-on-surface-variant">(${audios.length})</span></h2>
        ${audios.map(({ x, r, i }) => `<div class="${card} space-y-3" data-aid="${x.id}" data-i="${i}"><div class="text-label-sm text-on-surface-variant">${esc(kname(x.crianca_id))} · ${esc((x.leitura && x.leitura.titulo) || '')} · ${tx('pág.', 'p.')} ${r.page} · ${r.dur}s</div>
          <button data-play class="h-11 px-4 rounded-xl bg-tertiary-container text-on-tertiary-container text-label-md inline-flex items-center gap-2">${I('play_arrow', 'text-[20px]', 1)} ${tx('Ouvir', 'Listen')}</button><div data-player></div>
          <input class="${inputCls}" placeholder="${tx('Comentário (opcional)', 'Comment (optional)')}" data-fb>
          <div class="flex gap-2">${[1, 2, 3, 4, 5].map(s => `<button data-star="${s}" class="flex-1 h-12 rounded-xl bg-secondary-fixed/60 text-on-secondary-fixed text-label-lg">${s}⭐</button>`).join('')}</div></div>`).join('') || `<p class="${card} text-body-md text-on-surface-variant">${tx('Nenhuma gravação nova.', 'No new recordings.')}</p>`}</section>
      </div>`);
    const byId = id => ts.find(x => x.id === id);
    app().querySelectorAll('[data-score]').forEach(b => b.onclick = async () => {
      const box = b.closest('[data-tid]'); const x = byId(box.dataset.tid); const it = x.itens[+box.dataset.i];
      Object.assign(it, { status: 'graded', score: +b.dataset.score, feedback: box.querySelector('[data-fb]').value, gradedAt: new Date().toISOString() });
      await DB.upd('tentativas', { eq: { id: x.id } }, { itens: x.itens, pendentes: Math.max(0, (x.pendentes || 1) - 1) }).then(() => { box.remove(); toast('✅'); }).catch(e => toast(e.message));
    });
    app().querySelectorAll('[data-play]').forEach(b => b.onclick = async () => {
      const box = b.closest('[data-aid]'); const r = byId(box.dataset.aid).leitura.recordings[+box.dataset.i];
      if (r.apagada) return toast(tx('Gravação apagada (mais de 30 dias).', 'Recording deleted (older than 30 days).'));
      if (!r.bucket) return toast(tx('Gravação do app antigo.', 'Old app recording.'));
      try { const url = await DB.signed(r.bucket, r.path, 600); box.querySelector('[data-player]').innerHTML = `<audio controls autoplay src="${esc(url)}" class="w-full"></audio>`; b.remove(); } catch (e) { toast(e.message); }
    });
    app().querySelectorAll('[data-star]').forEach(b => b.onclick = async () => {
      const box = b.closest('[data-aid]'); const x = byId(box.dataset.aid); const r = x.leitura.recordings[+box.dataset.i];
      Object.assign(r, { rating: +b.dataset.star, comment: box.querySelector('[data-fb]').value, ratedAt: new Date().toISOString() });
      await DB.upd('tentativas', { eq: { id: x.id } }, { leitura: x.leitura }).then(() => { box.remove(); toast('⭐'); }).catch(e => toast(e.message));
    });
  }

  /* ================= enviar material ================= */
  async function material() {
    if (!A().kids.length) return newChild(true);
    const fam = A().fam.id; const mes = today().slice(0, 7);
    const [mats, lim] = await Promise.all([DB.sel('materiais', { eq: { familia_id: fam }, order: 'criado_em.desc', limit: 40 }), DB.sel('limites_ia', { eq: { plano: (A().sub || {}).plano || 'teste' } }).catch(() => [])]);
    const usado = mats.filter(m => String(m.criado_em).slice(0, 7) === mes).length; const max = (lim[0] && lim[0].paginas_mes) || 60;
    let files = [];
    const status = { enviado: ['hourglass_top', tx('Aguardando a IA', 'Waiting for AI'), 'text-secondary'], processando: ['auto_awesome', tx('Criando lições', 'Creating lessons'), 'text-tertiary'], pronto: ['check_circle', tx('Lições prontas', 'Lessons ready'), 'text-primary'], erro: ['error', tx('Erro', 'Error'), 'text-error'], apagado: ['delete', tx('Apagado (7 dias)', 'Deleted (7 days)'), 'text-outline'] };
    shell(`<div class="grid grid-cols-1 lg:grid-cols-5 gap-5">
      <section class="lg:col-span-3 ${card} space-y-1 relative overflow-hidden">
        <div class="absolute -top-10 -right-10 w-36 h-36 bg-primary-container/10 rounded-full blur-2xl pointer-events-none"></div>
        <div class="flex items-center gap-3 relative"><div class="w-12 h-12 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center">${I('photo_camera', 'text-[26px]', 1)}</div>
          <div><h1 class="text-headline-lg-mobile text-on-surface">${tx('Enviar material da semana', "Send this week's material")}</h1><p class="text-body-sm text-on-surface-variant">${tx('Fotos do caderno, do livro ou o PDF da escola.', 'Photos of the notebook, the book or the school PDF.')}</p></div></div>
        ${lbl(tx('Para quem', 'For'))}<div class="flex flex-wrap gap-2">${A().kids.map(k => `<label class="cursor-pointer"><input type="radio" name="kid" value="${k.id}" class="peer sr-only" ${k.id === kidSel ? 'checked' : ''}><span class="flex items-center gap-2 px-4 h-12 rounded-full bg-surface-container text-label-md text-on-surface peer-checked:bg-primary-container peer-checked:text-on-primary">${esc(k.avatar)} ${esc(k.apelido)}</span></label>`).join('')}</div>
        ${lbl(tx('Matéria', 'Subject'))}<input class="${inputCls}" id="mat" maxlength="40" placeholder="${tx('Ex.: Ciências — ciclo da água', 'E.g. Science — water cycle')}">
        ${lbl(tx('Arquivos', 'Files'))}
        <div class="grid grid-cols-2 gap-3">
          <label class="cursor-pointer h-24 rounded-2xl border-2 border-dashed border-primary-container/60 bg-primary-fixed/20 flex flex-col items-center justify-center gap-1 text-primary">${I('photo_camera', 'text-[30px]')}<span class="text-label-md">${tx('Tirar foto', 'Take photo')}</span><input type="file" accept="image/*" capture="environment" id="cam" class="hidden"></label>
          <label class="cursor-pointer h-24 rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low flex flex-col items-center justify-center gap-1 text-on-surface-variant">${I('upload_file', 'text-[30px]')}<span class="text-label-md">${tx('Fotos ou PDF', 'Photos or PDF')}</span><input type="file" accept="image/*,application/pdf" multiple id="fs" class="hidden"></label></div>
        <div id="th" class="flex flex-wrap gap-2 mt-3"></div><div id="cnt" class="text-label-sm text-on-surface-variant mt-1"></div>
        <div class="bg-surface-container-low rounded-2xl p-4 mt-4 space-y-2">
          <label class="flex items-center justify-between gap-3 cursor-pointer"><span class="flex items-center gap-2 text-label-lg text-on-surface">${I('event_note', 'text-secondary', 1)} ${tx('Modo Prova', 'Test Mode')}</span><input type="checkbox" id="prova" class="w-6 h-6 accent-[rgb(var(--c-primary-container))]"></label>
          <p class="text-body-sm text-on-surface-variant">${tx('A revisão fica focada só nesta matéria até o dia da prova, com um teste no começo e outro no fim.', 'Review focuses only on this until test day, with a check at the start and at the end.')}</p>
          <div id="pv" class="hidden">${lbl(tx('Data da prova', 'Test date'))}<input class="${inputCls}" type="date" id="dp" min="${today()}"></div></div>
        <div class="bg-surface-container-low rounded-xl p-3 flex items-start gap-2 mt-3 text-body-sm text-on-surface-variant">${I('visibility_off', 'text-[18px] text-primary')}<span>${tx('Antes de fotografar, cubra o nome da criança na folha. Os arquivos ficam em pasta privada e são apagados em até 7 dias.', "Cover your child's name on the page before taking the photo. Files are kept private and deleted within 7 days.")}</span></div>
        <div id="err" class="text-label-md text-error min-h-[1.2em] mt-2"></div>
        ${btnP('send', tx('Enviar', 'Send'), 'send')}
        <p class="text-label-sm text-on-surface-variant text-center mt-2">${tx(`Este mês: ${usado} de ${max} páginas.`, `This month: ${usado} of ${max} pages.`)}</p>
      </section>
      <section class="lg:col-span-2 space-y-3"><h2 class="text-headline-md text-on-surface">${tx('Enviados', 'Sent')}</h2>
        ${mats.map(m => { const st = status[m.status] || ['help', m.status, 'text-outline']; return `<div class="${card} flex items-center gap-3"><div class="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center shrink-0">${I(/\.pdf$/i.test(m.caminho) ? 'picture_as_pdf' : 'image', 'text-[22px] text-on-surface-variant')}</div>
          <div class="flex-1 min-w-0"><b class="text-label-md text-on-surface truncate block">${esc(m.materia || tx('Material', 'Material'))}${m.modo_prova ? ` · 📝 ${esc(m.data_prova || '')}` : ''}</b><span class="text-body-sm text-on-surface-variant">${new Date(m.criado_em).toLocaleDateString(pt() ? 'pt-BR' : 'en-US')}</span></div>
          <span class="flex items-center gap-1 text-label-sm ${st[2]} shrink-0">${I(st[0], 'text-[18px]', 1)}<span class="hidden sm:inline">${st[1]}</span></span></div>`; }).join('') || `<p class="${card} text-body-md text-on-surface-variant">${tx('Nada ainda.', 'Nothing yet.')}</p>`}</section></div>`);
    const upd = () => {
      $('#th').innerHTML = files.map(f => `<div class="w-16 h-20 rounded-lg bg-surface-container bg-cover bg-center flex items-center justify-center border border-outline-variant" style="${/^image/.test(f.type) ? `background-image:url(${URL.createObjectURL(f)})` : ''}">${/pdf/.test(f.type) ? I('picture_as_pdf', 'text-error text-[28px]') : ''}</div>`).join('');
      $('#cnt').textContent = files.length ? tx(`${files.length} arquivo(s)`, `${files.length} file(s)`) : ''; $('#send').disabled = !files.length;
    };
    const add = ev => { files = files.concat([...ev.target.files]).slice(0, 30); ev.target.value = ''; upd(); };
    $('#cam').onchange = add; $('#fs').onchange = add; $('#send').disabled = true;
    $('#prova').onchange = e => $('#pv').classList.toggle('hidden', !e.target.checked);
    $('#send').onclick = async () => {
      const err = $('#err'); err.textContent = '';
      if (usado + files.length > max) { err.textContent = tx(`Limite do mês: ${max} páginas.`, `Monthly limit: ${max} pages.`); return; }
      if (files.find(f => f.size > 50 * 1024 * 1024)) { err.textContent = tx('Cada arquivo pode ter até 50 MB.', 'Each file can be up to 50 MB.'); return; }
      const prova = $('#prova').checked, dp = $('#dp').value; if (prova && !dp) { err.textContent = tx('Escolha a data da prova.', 'Pick the test date.'); return; }
      const b = $('#send'); b.disabled = true; const kid = (app().querySelector('input[name=kid]:checked') || {}).value || kidSel, materia = $('#mat').value.trim(); const ids = [];
      try {
        for (let i = 0; i < files.length; i++) {
          b.querySelector('span:last-child').textContent = `⏳ ${i + 1}/${files.length}`;
          const f = files[i]; const safe = f.name.replace(/[^\w.-]+/g, '_').slice(-60); const path = `${fam}/${QK.uid()}-${safe}`;
          await DB.upload('familia-materiais', path, f);
          const r = await DB.ins('materiais', { familia_id: fam, crianca_id: kid, caminho: path, materia: materia || null, modo_prova: prova, data_prova: prova ? dp : null });
          ids.push(r[0] && r[0].id);
        }
        await DB.ins('ia_tarefas', { familia_id: fam, crianca_id: kid, tipo: 'gerar_licao', entrada: { materiais: ids, materia, modo_prova: prova, data_prova: prova ? dp : null } }).catch(e => console.warn(e));
        DB.fn('ia', {}).catch(() => {});
        toast(tx('✅ Enviado! As lições aparecem para a criança quando ficarem prontas.', '✅ Sent! Lessons show up for your child when ready.'), 4000); material();
      } catch (x) { err.textContent = x.message; b.disabled = false; b.querySelector('span:last-child').textContent = tx('Enviar', 'Send'); }
    };
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
    const a = $('#add'); if (a) a.onclick = () => childForm(null);
  }
  function newChild(first) { tab = 'criancas'; childForm(null, first); return Promise.resolve(); }

  function childForm(k, first) {
    const d = k ? JSON.parse(JSON.stringify(k)) : { apelido: '', avatar: '🦄', idade: 9, serie: '', idioma_app: QK.lang === 'en' ? 'en' : 'pt-BR', estilo: 'simples', tema: 'claro', minutos: 20, dias: [1, 2, 3, 4, 5], pilares: { leitura: 40, palavras: 25, reforco: 35 } };
    d.pilares = Object.assign({ leitura: 40, palavras: 25, reforco: 35 }, d.pilares || {});
    const draw = () => {
      const tot = d.pilares.leitura + d.pilares.palavras + d.pilares.reforco || 1;
      shell(`<div class="max-w-2xl mx-auto">
        ${first ? `<div class="${card} text-center mb-4"><div class="text-5xl mb-2">👋</div><h1 class="text-headline-lg-mobile text-on-surface">${tx('Bem-vindo ao Quest Kids!', 'Welcome to Quest Kids!')}</h1><p class="text-body-md text-on-surface-variant">${tx('Vamos cadastrar a primeira criança. Leva 1 minuto.', "Let's add your first child. It takes 1 minute.")}</p></div>`
          : `<h1 class="text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">${k ? tx('Editar', 'Edit') + ' ' + esc(k.apelido) : tx('Nova criança', 'New child')}</h1>`}
        <div class="${card}">
          ${lbl(tx('Apelido (sem nome completo)', 'Nickname (no full name)')).replace('mt-4', 'mt-0')}<input class="${inputCls}" id="ap" maxlength="30" value="${esc(d.apelido)}" placeholder="${tx('Ex.: Bia', 'E.g. Bea')}">
          ${lbl('Avatar')}<div class="flex flex-wrap gap-2">${AVATARES.map(a => `<button data-av="${a}" class="w-11 h-11 rounded-full text-[24px] flex items-center justify-center ${d.avatar === a ? 'bg-primary-fixed ring-[3px] ring-primary-container' : 'bg-surface-container'}">${a}</button>`).join('')}</div>
          <div class="grid grid-cols-2 gap-3"><div>${lbl(tx('Idade', 'Age'))}<input class="${inputCls}" id="id" type="number" min="5" max="14" value="${d.idade || ''}"></div><div>${lbl(tx('Série / ano', 'Grade'))}<input class="${inputCls}" id="se" maxlength="20" value="${esc(d.serie || '')}" placeholder="${tx('Ex.: 4º ano', 'E.g. 4th grade')}"></div></div>
          ${lbl(tx('Idioma das lições', 'Lesson language'))}${seg([['pt-BR', 'Português'], ['en', 'English']], d.idioma_app, 'data-lg')}
          ${lbl(tx('Estilo da tela', 'Screen style'))}<div class="grid grid-cols-2 sm:grid-cols-4 gap-2">${ESTILOS().map(([v, n, c, bg, fg]) => `<button data-es="${v}" class="rounded-2xl p-3 border-[3px] ${d.estilo === v ? 'border-primary-container' : 'border-transparent'} shadow-sm" style="background:${bg};color:${fg}"><div class="flex justify-center gap-1 mb-1.5"><span class="w-6 h-6 rounded-full" style="background:${c}"></span><span class="w-6 h-6 rounded-full opacity-50" style="background:${c}"></span></div><span class="text-label-md">${n}</span></button>`).join('')}</div>
          <div class="mt-3">${seg([['claro', '☀️ ' + tx('Claro', 'Light')], ['escuro', '🌙 ' + tx('Escuro', 'Dark')]], d.tema, 'data-tm')}</div>
          ${lbl(`${tx('Tempo por dia', 'Time per day')}: <b id="mv">${d.minutos}</b> min ${d.minutos >= 15 && d.minutos <= 25 ? `<span class="ml-1 text-label-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">${tx('recomendado', 'recommended')}</span>` : ''}`)}
          <input type="range" min="15" max="60" step="5" value="${d.minutos}" id="mn"><div class="flex justify-between text-label-sm text-on-surface-variant"><span>15 min</span><span>1 h</span></div>
          ${lbl(tx('Divisão do tempo', 'Time split'))}
          <div class="space-y-2">${[['leitura', 'menu_book', tx('Leitura', 'Reading')], ['palavras', 'spellcheck', tx('Palavras', 'Words')], ['reforco', 'auto_stories', tx('Reforço', 'Practice')]].map(([key, i, n]) => `<div class="flex items-center gap-3"><span class="w-28 flex items-center gap-1.5 text-label-md text-on-surface">${I(i, 'text-[18px] text-primary')} ${n}</span><input type="range" min="0" max="100" step="5" value="${d.pilares[key]}" data-pil="${key}" class="flex-1"><b class="w-14 text-right text-label-md text-on-surface">${Math.round(d.minutos * d.pilares[key] / tot)} min</b></div>`).join('')}</div>
          ${lbl(tx('Dias de estudo', 'Study days'))}<div class="flex gap-1.5">${DIAS().map((n, i) => `<button data-dia="${i}" class="w-10 h-10 rounded-full text-label-md ${d.dias.includes(i) ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-on-surface-variant'}">${n}</button>`).join('')}</div>
          ${lbl(tx('PIN da criança (4 números, opcional)', "Child's PIN (4 digits, optional)"))}<input class="${inputCls} max-w-[180px] tracking-[0.4em] text-center" id="pin" inputmode="numeric" maxlength="4" placeholder="••••">
          ${k ? `<a href="#" id="nopin" class="inline-block mt-2 text-label-sm text-primary underline">${tx('Tirar o PIN', 'Remove PIN')}</a>` : ''}
          <div id="err" class="text-label-md text-error min-h-[1.2em] mt-3"></div>
          <div class="space-y-3 mt-1">${btnP('save', tx('Salvar', 'Save'), 'check')}${!first ? btnS('cancel', tx('Cancelar', 'Cancel')) : ''}</div>
          ${k ? `<p class="text-center mt-5"><a href="#" id="arch" class="text-label-md text-error underline">${tx('Remover esta criança', 'Remove this child')}</a></p>` : ''}
        </div></div>`, first);
      const keep = () => { d.apelido = $('#ap').value; d.idade = +$('#id').value || null; d.serie = $('#se').value; };
      app().querySelectorAll('[data-av]').forEach(b => b.onclick = () => { keep(); d.avatar = b.dataset.av; draw(); });
      app().querySelectorAll('[data-lg]').forEach(b => b.onclick = () => { keep(); d.idioma_app = b.dataset.lg; draw(); });
      app().querySelectorAll('[data-es]').forEach(b => b.onclick = () => { keep(); d.estilo = b.dataset.es; draw(); });
      app().querySelectorAll('[data-tm]').forEach(b => b.onclick = () => { keep(); d.tema = b.dataset.tm; draw(); });
      app().querySelectorAll('[data-dia]').forEach(b => b.onclick = () => { keep(); const i = +b.dataset.dia; d.dias = d.dias.includes(i) ? d.dias.filter(x => x !== i) : d.dias.concat(i).sort(); draw(); });
      $('#mn').onchange = e => { keep(); d.minutos = +e.target.value; draw(); }; $('#mn').oninput = e => $('#mv').textContent = e.target.value;
      app().querySelectorAll('[data-pil]').forEach(r => r.onchange = () => { keep(); d.pilares[r.dataset.pil] = +r.value; draw(); });
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
          if (k) await DB.upd('criancas', { eq: { id } }, row);
          else { const r = await DB.ins('criancas', Object.assign({ familia_id: A().fam.id }, row)); id = r[0].id; }
          if (pin) await DB.rpc('definir_pin', { crianca: id, pin });
          await A().loadFamily(); kidSel = id; toast('✅ ' + tx('Salvo', 'Saved'));
          if (first) return A().picker(); tab = 'criancas'; render();
        } catch (x) { err.textContent = x.message; }
      };
    };
    draw();
  }

  /* ================= conta e assinatura ================= */
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
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">${[['anual', true], ['semestral', false], ['mensal', false]].map(([pl, best]) => { const p = pick(pl); if (!p) return ''; return `<div class="relative bg-surface-container-lowest rounded-3xl p-5 flex flex-col gap-3 ${best ? 'border-2 border-primary-container shadow-md' : 'shadow-sm'}">
            ${best ? `<span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary text-label-sm px-3 py-1 rounded-full whitespace-nowrap">⭐ ${tx('Melhor preço', 'Best value')}</span>` : ''}
            <span class="text-label-sm uppercase ${best ? 'text-primary' : 'text-outline'} pt-1">${pnome[pl]}</span><b class="text-headline-md text-on-surface">${esc(p.valor_texto)}</b>
            <p class="text-body-sm text-on-surface-variant flex-1">${pl === 'mensal' ? tx('Você corrige as respostas e ouve as leituras.', 'You review answers and listen to reading.') : tx('A IA corrige tudo para você.', 'The AI grades everything for you.')}${pl === 'anual' && moeda === 'brl' ? ' ' + tx('Compromisso de 12 meses.', '12-month commitment.') : ''}</p>
            <button data-buy="${p.codigo}" ${p.stripe_price_id || QK.DEMO ? '' : 'disabled'} class="${best ? 'btn3d bg-primary-container text-on-primary' : 'bg-surface-container text-primary'} h-12 rounded-xl text-label-lg">${p.stripe_price_id || QK.DEMO ? tx('Assinar', 'Subscribe') : tx('Em breve', 'Coming soon')}</button></div>`; }).join('')}</div>
          <p class="text-label-sm text-on-surface-variant text-center">${moeda === 'brl' ? 'Cartão de crédito ou Pix · Cancele quando quiser' : 'Credit card · Cancel anytime'}</p></section>` : ''}
      </div>
      <div class="space-y-5">
        <section class="${card} space-y-3"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('group_add', 'text-primary')} ${tx('Outro responsável', 'Another parent')}</h2><p class="text-body-sm text-on-surface-variant">${tx('Convide o pai, a mãe ou outro responsável para ver as mesmas crianças.', 'Invite another parent to see the same kids.')}</p>
          ${conv.length ? `<div class="bg-surface-container-low rounded-xl p-3"><span class="text-label-sm text-on-surface-variant">${tx('Código', 'Code')}</span><b class="block text-headline-md tracking-[0.2em] text-on-surface">${esc(conv[0].codigo)}</b><span class="text-body-sm text-on-surface-variant break-all">${esc(location.origin + location.pathname + '?convite=' + conv[0].codigo)}</span></div>` : ''}
          ${btnS('inv', tx('Gerar convite', 'Create invite'), 'link')}
          <div class="flex gap-2"><input class="${inputCls} uppercase" id="cod" maxlength="8" placeholder="${tx('Recebeu um código?', 'Got a code?')}"><button id="acc" class="h-12 px-5 rounded-xl bg-primary-container text-on-primary text-label-lg">OK</button></div></section>
        <section class="${card} space-y-3"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('lock', 'text-primary')} ${tx('Senha dos pais', 'Parents password')}</h2><p class="text-body-sm text-on-surface-variant">${tx('4 números para entrar nesta área. As crianças não devem saber.', '4 digits to enter this area. Keep it from the kids.')}</p>${btnS('senha', tx('Mudar a senha dos pais', 'Change parents password'), 'password')}</section>
        <section class="${card} space-y-3"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('contrast', 'text-primary')} ${tx('Aparência do painel', 'Panel appearance')}</h2>${seg([['claro', '☀️ ' + tx('Claro', 'Light')], ['escuro', '🌙 ' + tx('Escuro', 'Dark')]], A().temaAtual(), 'data-at')}<p class="text-body-sm text-on-surface-variant">${tx('O tema de cada criança se escolhe em Crianças → Editar, ou no botão ☀️/🌙 da tela dela.', "Each child's theme is set in Kids → Edit, or with the ☀️/🌙 button on their screen.")}</p></section>
        <section class="${card} space-y-3"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('language', 'text-primary')} ${tx('Idioma do painel', 'Panel language')}</h2>${seg([['pt', 'Português'], ['en', 'English']], QK.lang, 'data-l')}</section>
        <section class="${card} space-y-2"><h2 class="text-headline-md text-on-surface flex items-center gap-2">${I('help', 'text-primary')} ${tx('Ajuda', 'Help')}</h2>
          <p class="text-body-sm text-on-surface-variant">${tx('Suporte', 'Support')}: <a class="text-primary underline" href="mailto:${C.SUPORTE_EMAIL}">${C.SUPORTE_EMAIL}</a></p>
          <p class="text-body-sm"><a class="text-primary underline" href="../termos.html">${tx('Termos de Uso', 'Terms')}</a> · <a class="text-primary underline" href="../privacidade.html">${tx('Política de Privacidade', 'Privacy Policy')}</a></p>
          <p class="text-body-sm text-on-surface-variant">${tx('Para apagar todos os dados da família, escreva para o suporte.', 'To delete all family data, email support.')}</p>
          <p class="text-label-sm text-outline">${esc((Auth.user && Auth.user.email) || '')}</p>${btnS('out', t('sair'), 'logout')}</section>
      </div></div>`);
    app().querySelectorAll('[data-m]').forEach(b => b.onclick = () => { localStorage.setItem('qk.moeda', b.dataset.m); render(); });
    app().querySelectorAll('[data-at]').forEach(b => b.onclick = () => { A().setAdultTema(b.dataset.at); render(); });
    app().querySelectorAll('[data-l]').forEach(b => b.onclick = () => { QK.setLang(b.dataset.l); render(); });
    app().querySelectorAll('[data-buy]').forEach(b => b.onclick = async () => {
      b.disabled = true; b.textContent = '⏳';
      try { const r = await DB.fn('checkout', { codigo: b.dataset.buy, volta: location.origin + location.pathname }); location.href = r.url; }
      catch (x) { toast(x.message); b.disabled = false; b.textContent = tx('Assinar', 'Subscribe'); }
    });
    const po = $('#portal'); if (po) po.onclick = async () => { try { const r = await DB.fn('portal', { volta: location.origin + location.pathname }); location.href = r.url; } catch (x) { toast(x.message); } };
    $('#inv').onclick = async () => { try { await DB.del('convites', { eq: { familia_id: A().fam.id } }).catch(() => {}); await DB.ins('convites', { familia_id: A().fam.id }); render(); } catch (x) { toast(x.message); } };
    $('#acc').onclick = async () => { const c = $('#cod').value.trim(); if (!c) return; try { await DB.rpc('aceitar_convite', { cod: c }); toast('✅'); await A().loadFamily(); A().picker(); } catch (x) { toast(x.message); } };
    $('#senha').onclick = () => A().createParentPass(() => { tab = 'conta'; open().then(() => { tab = 'conta'; render(); }); });
    $('#out').onclick = async () => { await Auth.signOut(); A().boot(); };
  }

  window.QKParent = { open, newChild };
})();
