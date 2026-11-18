/* Quest Kids — cadastro passo a passo (uma pergunta por tela), termos, nova criança e página de planos */
(function () {
  'use strict';
  const { $, esc, toast, DB } = QK;
  const A = () => window.QKApp;
  const pt = () => QK.lang === 'pt';
  const tx = (p, e) => pt() ? p : e;
  const I = (n, c, f) => A().I(n, c, f);
  const app = () => $('#app');
  const TERMOS_V = '2026-11-17';
  const AVATARES = ['🦄', '🐱', '🐶', '🦊', '🐼', '🐯', '🐸', '🦁', '🐧', '🐙', '🦖', '🚀', '⚽', '🎨', '🌸', '⭐', '🌈', '🐬', '🦋', '🤖'];
  const AVN = { '🦄': ['Unicórnio', 'Unicorn'], '🐱': ['Gatinho', 'Kitty'], '🐶': ['Cachorrinho', 'Puppy'], '🦊': ['Raposinha', 'Fox'], '🐼': ['Panda', 'Panda'], '🐯': ['Tigrinho', 'Tiger'], '🐸': ['Sapinho', 'Froggy'], '🦁': ['Leãozinho', 'Lion'], '🐧': ['Pinguim', 'Penguin'], '🐙': ['Polvinho', 'Octopus'], '🦖': ['Dino', 'Dino'], '🚀': ['Foguete', 'Rocket'], '⚽': ['Craque', 'Champ'], '🎨': ['Artista', 'Artist'], '🌸': ['Florzinha', 'Blossom'], '⭐': ['Estrela', 'Star'], '🌈': ['Arco-íris', 'Rainbow'], '🐬': ['Golfinho', 'Dolphin'], '🦋': ['Borboleta', 'Butterfly'], '🤖': ['Robô', 'Robot'] };
  const avName = a => (AVN[a] || ['Explorador', 'Explorer'])[pt() ? 0 : 1];
  const MESES = () => pt() ? ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'] : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DIAS = () => pt() ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const atividades = min => Math.min(40, Math.round(min * 0.6 + 4));
  const inputCls = 'w-full h-16 px-5 rounded-2xl bg-surface-container-lowest border-2 border-surface-container-high focus:border-primary-container focus:outline-none text-headline-md text-on-surface placeholder:text-outline text-center';

  /* ---------- mascote próprio: "Quico", uma bolinha-livro com estrela ---------- */
  function mascot(size, mood) {
    const s = size || 96, happy = mood !== 'think';
    return `<svg width="${s}" height="${s}" viewBox="0 0 120 120" aria-hidden="true" class="shrink-0 drop-shadow-sm">
      <path d="M60 6 l5 10 11 1.6-8 7.7 1.9 11L60 31l-9.9 5.3 1.9-11-8-7.7 11-1.6z" fill="#ffc83d" stroke="#e8a400" stroke-width="2" stroke-linejoin="round"/>
      <line x1="60" y1="31" x2="60" y2="40" stroke="#0f7f7f" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="60" cy="78" rx="44" ry="38" fill="#14a3a3"/>
      <ellipse cx="60" cy="88" rx="30" ry="22" fill="#d9f6f2"/>
      <circle cx="44" cy="70" r="11" fill="#fff"/><circle cx="76" cy="70" r="11" fill="#fff"/>
      <circle cx="${happy ? 46 : 42}" cy="${happy ? 71 : 68}" r="5.5" fill="#10302f"/><circle cx="${happy ? 78 : 74}" cy="${happy ? 71 : 68}" r="5.5" fill="#10302f"/>
      <circle cx="48" cy="69" r="1.8" fill="#fff"/><circle cx="80" cy="69" r="1.8" fill="#fff"/>
      ${happy ? '<path d="M50 88 q10 9 20 0" fill="none" stroke="#10302f" stroke-width="4" stroke-linecap="round"/>' : '<path d="M52 90 h16" fill="none" stroke="#10302f" stroke-width="4" stroke-linecap="round"/>'}
      <circle cx="33" cy="84" r="5" fill="#ff8fab" opacity=".55"/><circle cx="87" cy="84" r="5" fill="#ff8fab" opacity=".55"/>
      <path d="M18 92 q-8 6-4 14 q10-2 14-10z" fill="#14a3a3"/><path d="M102 92 q8 6 4 14 q-10-2-14-10z" fill="#14a3a3"/>
    </svg>`;
  }
  // Quico "conversa": as mensagens aparecem uma por uma, com "digitando…" antes (só na 1ª vez que a tela aparece)
  const vistos = new Set();
  const bubble = (txt, mood) => {
    const msgs = [].concat(txt);
    return `<div class="qk-chat flex items-start gap-2.5 mb-5" data-msgs="${esc(JSON.stringify(msgs))}">${mood === 'none' ? '' : mascot(52, mood)}<div class="qk-msgs flex-1 min-w-0 space-y-2 pt-1">${msgs.map((m, k) => `<div class="qk-m w-fit max-w-full bg-surface-container-lowest border-2 border-surface-container-high rounded-2xl ${k ? '' : 'rounded-tl-md'} px-4 py-2.5 ${k === msgs.length - 1 ? 'text-headline-md' : 'text-body-lg'} text-on-surface soft-shadow">${m}</div>`).join('')}</div></div>`;
  };
  let chatTimer = null;
  function animarConversa() {
    clearTimeout(chatTimer);
    const c = app().querySelector('.qk-chat'); if (!c) return;
    const key = c.dataset.msgs; const ms = Array.from(c.querySelectorAll('.qk-m'));
    // tudo que vem depois da conversa espera ela terminar
    const depois = []; let el = c.nextElementSibling; while (el) { depois.push(el); el = el.nextElementSibling; }
    const ft = app().querySelector('footer'); if (ft) depois.push(ft);
    const reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (vistos.has(key) || reduz || !ms.length) { vistos.add(key); return; }
    vistos.add(key);
    depois.forEach(x => x.classList.add('qk-hold'));
    ms.forEach(m => { m.dataset.html = m.innerHTML; m.style.display = 'none'; });
    const box = c.querySelector('.qk-msgs');
    const typing = document.createElement('div'); typing.className = 'w-fit bg-surface-container-lowest border-2 border-surface-container-high rounded-2xl px-4 py-3'; typing.innerHTML = '<span class="qk-typing" aria-label="digitando"><i></i><i></i><i></i></span>';
    let k = 0;
    const fim = () => { clearTimeout(chatTimer); typing.remove(); ms.forEach(m => { m.style.display = ''; }); depois.forEach(x => { x.classList.remove('qk-hold'); x.classList.add('qk-show'); }); c.onclick = null; };
    const passo = () => {
      if (k >= ms.length || !c.isConnected) return fim();
      box.appendChild(typing);
      const txt = ms[k].textContent || ''; const espera = Math.min(1300, 450 + txt.length * 14);
      chatTimer = setTimeout(() => { typing.remove(); ms[k].style.display = ''; ms[k].classList.add('qk-msg'); box.appendChild(ms[k]); k++; chatTimer = setTimeout(passo, k >= ms.length ? 150 : 250); }, espera);
    };
    c.onclick = fim; // tocar na conversa pula a animação
    passo();
  }

  /* ---------- moldura: barra de progresso no topo, botão grande embaixo ---------- */
  function frame({ step, total, back, body, btn, btnOff, foot, inlineBtn }) {
    A().theme('simples', A().adultTema());
    const pct = total ? Math.round(100 * step / total) : 0;
    const button = btn ? `<button id="nx" type="button" ${btnOff ? 'disabled' : ''} class="btn3d w-full h-14 rounded-2xl bg-primary-container text-on-primary text-headline-md disabled:opacity-40 disabled:shadow-none">${btn}</button>` : '';
    app().innerHTML = `<div class="min-h-[100dvh] flex flex-col max-w-xl mx-auto px-margin">
      <header class="pt-safe"><div class="h-16 flex items-center gap-3">
        ${back ? `<button id="bk" aria-label="${tx('Voltar', 'Back')}" class="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container">${I('arrow_back', 'text-[26px]')}</button>` : '<span class="w-8"></span>'}
        ${total ? `<div class="flex-1 h-4 bg-surface-container-high rounded-full overflow-hidden"><div class="h-full bg-primary-container rounded-full transition-all duration-500" style="width:${Math.max(4, pct)}%"></div></div>` : '<div class="flex-1"></div>'}
      </div></header>
      <main class="flex-1 pt-4 pb-6">${body}${inlineBtn ? `<div class="mt-6">${button}</div>${foot || ''}` : ''}</main>
      ${inlineBtn ? '' : `<footer class="sticky bottom-0 pb-safe bg-surface/95 backdrop-blur pt-3 pb-5 space-y-2 border-t border-surface-container-high">${button}${foot || ''}</footer>`}
    </div>`;
    window.scrollTo(0, 0);
    const bk = $('#bk'); if (bk && back) bk.onclick = back;
    animarConversa();
  }
  const bigCard = (attr, val, on, inner, extra) => `<button ${attr}="${val}" class="w-full text-left rounded-2xl border-2 px-4 py-3.5 flex items-center gap-3 transition active:scale-[0.99] ${on ? 'border-primary-container bg-primary-fixed/30' : 'border-surface-container-high bg-surface-container-lowest'} ${extra || ''}">${inner}</button>`;

  /* ---------- planos: anual marcado, preço por mês, mensal discreto ---------- */
  function perMonth(p) {
    const m = String(p.valor_texto).match(/(\d+(?:[.,]\d{2})?)/); if (!m) return null;
    const v = parseFloat(m[1].replace(',', '.'));
    if (/\/\s*(mês|month)/i.test(p.valor_texto)) return v;
    if (/6\s*(meses|months)/i.test(p.valor_texto)) return v / 6;
    if (/year|ano/i.test(p.valor_texto)) return v / 12;
    return v;
  }
  const money = (v, moeda) => moeda === 'brl' ? 'R$ ' + v.toFixed(2).replace('.', ',') : '$' + v.toFixed(2);
  function plansHtml(precos, moeda, fund, sel) {
    const pick = pl => precos.find(p => p.plano === pl && !!p.fundador === fund) || precos.find(p => p.plano === pl);
    const mens = pick('mensal'); const base = mens ? perMonth(mens) : null;
    const nome = { anual: tx('Anual', 'Yearly'), semestral: tx('Semestral', '6 months'), mensal: tx('Mensal', 'Monthly') };
    const desc = { anual: tx('✨ A IA corrige tudo para você', '✨ AI grades everything for you'), semestral: tx('✨ A IA corrige tudo para você', '✨ AI grades everything for you'), mensal: tx('Você corrige as respostas', 'You review the answers') };
    const cards = ['anual', 'semestral', 'mensal'].map(pl => {
      const p = pick(pl); if (!p) return '';
      const pm = perMonth(p), on = sel === pl, eco = base && pm && pl !== 'mensal' ? Math.round(100 * (1 - pm / base)) : 0;
      if (pl === 'mensal') return `<label class="block cursor-pointer"><input type="radio" name="plano" value="${pl}" data-cod="${p.codigo}" class="peer sr-only" ${on ? 'checked' : ''}>
        <div class="rounded-2xl border-2 px-4 py-3 flex items-center justify-between gap-3 border-surface-container-high bg-surface-container-lowest peer-checked:border-primary-container peer-checked:bg-primary-fixed/20">
          <div><b class="text-label-lg text-on-surface">${nome[pl]}</b><p class="text-body-sm text-on-surface-variant">${desc[pl]}</p></div><span class="text-label-lg text-on-surface-variant whitespace-nowrap">${esc(p.valor_texto)}</span></div></label>`;
      return `<label class="block cursor-pointer relative ${pl === 'anual' ? 'mt-3' : ''}"><input type="radio" name="plano" value="${pl}" data-cod="${p.codigo}" class="peer sr-only" ${on ? 'checked' : ''}>
        ${pl === 'anual' ? `<span class="absolute -top-3 left-4 z-10 bg-secondary-container text-on-secondary-container text-label-sm px-3 py-1 rounded-full uppercase tracking-wide">⭐ ${tx('Mais popular', 'Most popular')}</span>` : ''}
        <div class="rounded-2xl border-[3px] px-4 pt-4 pb-3.5 flex items-center justify-between gap-3 border-surface-container-high bg-surface-container-lowest peer-checked:border-primary-container peer-checked:bg-primary-fixed/25">
          <div class="min-w-0"><div class="flex items-center gap-2 flex-wrap"><b class="text-headline-md text-on-surface">${nome[pl]}</b>${eco > 0 ? `<span class="bg-primary/10 text-primary text-label-sm px-2 py-0.5 rounded-full">${tx('Economize', 'Save')} ${eco}%</span>` : ''}</div>
            <p class="text-body-sm text-on-surface-variant">${esc(p.valor_texto)}</p><p class="text-body-sm text-on-surface-variant">${desc[pl]}</p></div>
          <div class="text-right shrink-0">${pm ? `<b class="text-headline-md text-on-surface block">${money(pm, moeda)}</b><span class="text-label-sm text-on-surface-variant">${tx('por mês', 'per month')}</span>` : ''}</div></div></label>`;
    }).join('');
    return `<div class="space-y-3" id="planos">${cards}</div>
      <div class="mt-3 bg-surface-container-low rounded-2xl p-3 flex items-center gap-3"><span class="text-[26px]">👨‍👩‍👧</span><p class="text-body-sm text-on-surface"><b>${tx('Plano família incluso:', 'Family plan included:')}</b> ${tx('até 3 crianças em qualquer plano, sem pagar a mais. Cada uma com o seu PIN.', 'up to 3 kids on any plan at no extra cost. Each with their own PIN.')}</p></div>`;
  }
  const planSel = () => { const r = app().querySelector('input[name=plano]:checked'); return r ? { plano: r.value, codigo: r.dataset.cod } : null; };

  /* ---------- termos ("contrato" para ler e marcar) ---------- */
  function termsBody() {
    const it = (ic, b, s) => `<li class="flex gap-3"><span class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">${I(ic, 'text-[20px]')}</span><span class="text-body-md text-on-surface"><b>${b}</b> ${s}</span></li>`;
    return `${bubble(tx('Antes de começar, leia o nosso combinado. É curtinho!', 'Before we start, read our agreement. It’s short!'), 'think')}
      <div class="bg-surface-container-lowest border-2 border-surface-container-high rounded-2xl p-4 max-h-[46vh] overflow-y-auto space-y-3" id="contrato">
        <h2 class="text-headline-md text-on-surface">${tx('Termos de Uso e Privacidade — resumo', 'Terms and Privacy — summary')}</h2>
        <ul class="space-y-3">
          ${it('person', tx('Você é o responsável.', 'You are the parent.'), tx('Só maiores de 18 anos criam conta. A criança usa o app dentro da sua conta.', 'Only adults (18+) create accounts. Your child uses the app inside your account.'))}
          ${it('badge', tx('Só o apelido.', 'Nickname only.'), tx('Não pedimos nome completo, data de nascimento, escola, endereço nem foto do rosto. Só idade e mês de aniversário.', 'We never ask for full name, date of birth, school, address or face photos. Only age and birth month.'))}
          ${it('photo_camera', tx('Fotos do material:', 'Material photos:'), tx('usadas só para criar as lições e apagadas assim que elas ficam prontas (no máximo 7 dias, se der erro). Cubra o nome da criança antes da foto.', 'used only to create lessons and deleted as soon as they are ready (at most 7 days on error). Cover your child’s name before the photo.'))}
          ${it('menu_book', tx('Direitos autorais:', 'Copyright:'), tx('envie só as páginas que seu filho está estudando agora, para uso da família. Não envie livros inteiros. O app cria perguntas e textos novos, não copia.', 'send only the pages your child is studying now, for family use. No whole books. The app creates new questions and texts; it does not copy.'))}
          ${it('mic', tx('Gravações de voz:', 'Voice recordings:'), tx('privadas, só a família ouve, apagadas em até 30 dias. O medidor de leitura é uma estimativa.', 'private, only your family hears them, deleted within 30 days. The reading meter is an estimate.'))}
          ${it('block', tx('Sem anúncios.', 'No ads.'), tx('Não vendemos dados e não usamos os dados da criança para propaganda.', 'We never sell data or use your child’s data for advertising.'))}
          ${it('credit_card_off', tx('7 dias grátis, sem cartão.', '7 days free, no card.'), tx('Depois você escolhe um plano. Assinaturas renovam até você cancelar.', 'Then you pick a plan. Subscriptions renew until you cancel.'))}
          ${it('delete', tx('Seus direitos:', 'Your rights:'), tx('você pode pedir cópia, correção ou apagamento dos dados a qualquer momento.', 'you can request a copy, correction or deletion of your data at any time.'))}
        </ul>
        <p class="text-body-sm text-on-surface-variant">${tx('Leia completos:', 'Read in full:')} <a class="text-primary underline" href="../termos.html" target="_blank" rel="noopener">${tx('Termos de Uso', 'Terms of Use')}</a> · <a class="text-primary underline" href="../privacidade.html" target="_blank" rel="noopener">${tx('Política de Privacidade', 'Privacy Policy')}</a> · ${tx('versão', 'version')} ${TERMOS_V}</p>
      </div>
      <label class="mt-4 flex items-start gap-3 cursor-pointer bg-surface-container-low rounded-2xl p-4"><input type="checkbox" id="ok1" class="mt-0.5 w-6 h-6 shrink-0 accent-[rgb(var(--c-primary-container))]">
        <span class="text-body-md text-on-surface">${tx('Li e aceito os <b>Termos de Uso</b> e a <b>Política de Privacidade</b>. Sou maior de 18 anos e responsável pela criança.', 'I have read and accept the <b>Terms of Use</b> and the <b>Privacy Policy</b>. I am 18+ and the child’s parent or guardian.')}</span></label>`;
  }
  async function aceitar() {
    try { localStorage.setItem('qk.termos', TERMOS_V); } catch (e) {}
    try { await DB.rpc('aceitar_termos', { versao: TERMOS_V }); } catch (e) { console.warn('termos', e.message); }
    if (A().famRow) { A().famRow.termos_versao = TERMOS_V; A().famRow.termos_aceitos_em = new Date().toISOString(); }
  }
  // famílias que já existiam: aceitar a versão nova uma vez
  function needTerms() {
    const f = A().famRow; if (!f || !('termos_versao' in f)) return false;
    return f.termos_versao !== TERMOS_V;
  }
  function terms(then) {
    frame({ body: termsBody(), btn: tx('Aceitar e continuar', 'Accept and continue'), btnOff: true });
    $('#ok1').onchange = e => { $('#nx').disabled = !e.target.checked; };
    $('#nx').onclick = async () => { $('#nx').disabled = true; await aceitar(); then(); };
  }

  /* ---------- depoimentos de EXEMPLO (nomes fictícios, marcados como ilustrativos) ---------- */
  const DEPO = () => pt() ? [
    ['Carla', 'mãe da Laura, 9 anos', '🦄', 'Antes era briga para estudar. Agora são 15 minutinhos depois do lanche e ela mesma me mostra o cartão “FEITO”.'],
    ['Rafael', 'pai do Theo, 10 anos', '🦖', 'Mando as fotos da matéria no domingo e durante a semana ele treina exatamente o que vai cair na prova.'],
    ['Juliana', 'mãe da Sofia e do Pedro', '🐼', 'Cada um tem o seu PIN e o seu ritmo. Eu vejo no resumo quem precisa de mais ajuda em quê.'],
    ['Marcos', 'pai da Helena, 8 anos', '🐬', 'Ela adora as histórias narradas. Aprendeu um monte de palavras novas nas férias sem perceber.']
  ] : [
    ['Jessica', 'mom of Emma, 9', '🦄', 'Homework used to be a fight. Now it’s 15 minutes after snack time and she shows me the “DONE” card herself.'],
    ['David', 'dad of Noah, 10', '🦖', 'I snap the study guide on Sunday and all week he practices exactly what will be on the test.'],
    ['Priya', 'mom of Aria and Leo', '🐼', 'Each kid has their own PIN and pace. The summary shows me who needs help with what.'],
    ['Mike', 'dad of Lily, 8', '🐬', 'She loves the narrated stories. She picked up so many new words over the break without noticing.']
  ];
  const depoHtml = () => `<div class="mt-5"><p class="text-label-lg text-on-surface mb-2">${tx('Como as famílias usam', 'How families use it')}</p>
    <div class="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1 snap-x">${DEPO().map(([n, q, av, t]) => `<div class="snap-start min-w-[250px] max-w-[250px] bg-surface-container-lowest border-2 border-surface-container-high rounded-2xl p-4 flex flex-col gap-2">
      <span class="text-[11px] uppercase tracking-wide text-on-surface-variant">${tx('Exemplo ilustrativo', 'Illustrative example')}</span>
      <p class="text-body-md text-on-surface">“${esc(t)}”</p>
      <div class="flex items-center gap-2 mt-auto"><span class="w-9 h-9 rounded-full bg-primary-fixed/50 flex items-center justify-center text-[20px]">${av}</span><span class="text-label-sm text-on-surface-variant"><b class="text-on-surface">${esc(n)}</b> · ${esc(q)}</span></div></div>`).join('')}</div>
    <p class="text-[11px] text-on-surface-variant mt-1">${tx('Depoimentos ilustrativos, com nomes fictícios, para mostrar como o app pode ser usado.', 'Illustrative testimonials with fictional names, to show how the app can be used.')}</p></div>`;
  const infoCard = (ic, t, b, open) => `<details class="group bg-surface-container-lowest border-2 border-surface-container-high rounded-2xl" ${open ? 'open' : ''}><summary class="list-none cursor-pointer px-4 py-3.5 flex items-center gap-3"><span class="text-[26px]">${ic}</span><b class="text-label-lg text-on-surface flex-1">${t}</b>${I('expand_more', 'text-on-surface-variant transition group-open:rotate-180')}</summary><div class="px-4 pb-4 -mt-1 text-body-md text-on-surface-variant space-y-1.5">${b}</div></details>`;
  const saibaCards = () => [
    infoCard('📚', tx('Como funciona', 'How it works'), tx('<p>Uma lição curta por dia com 3 partes: <b>leitura</b>, <b>palavras novas</b> e <b>reforço das matérias da escola</b>.</p><p>As perguntas são criadas a partir do material que você envia e mudam a cada vez (números, jeitos de perguntar), para a criança aprender de verdade e não decorar.</p>', '<p>One short lesson a day in 3 parts: <b>reading</b>, <b>new words</b> and <b>school subject practice</b>.</p><p>Questions are created from the material you send and change every time, so your child really learns instead of memorizing.</p>'), true),
    infoCard('📸', tx('Onde você coloca o material', 'Where you add material'), tx('<p>Toque no <b>cadeado 🔒</b> no topo → <b>Área dos pais</b> → <b>Material</b>. Tire foto das páginas (ou mande PDF) e escolha <b>“Estudo do dia a dia”</b> ou <b>“Cai na prova”</b> com a data.</p><p>Em poucos minutos vira lição. As fotos são apagadas assim que a lição fica pronta.</p>', '<p>Tap the <b>lock 🔒</b> at the top → <b>Parents</b> → <b>Material</b>. Snap the pages (or send a PDF) and choose <b>“Everyday study”</b> or <b>“On the test”</b> with the date.</p><p>It becomes a lesson in a few minutes. Photos are deleted as soon as it’s ready.</p>')),
    infoCard('▶️', tx('Onde a criança faz a lição', 'Where your child does the lesson'), tx('<p>Na tela <b>Hoje</b>, botão <b>Começar</b>. Quando termina, aparece o cartão <b>FEITO ✅</b> com dia e hora, para ela mostrar para você.</p>', '<p>On the <b>Today</b> screen, tap <b>Start</b>. When done, a <b>DONE ✅</b> card shows the day and time, so your child can show you.</p>')),
    infoCard('📊', tx('Como você acompanha', 'How you follow along'), tx('<p>No <b>Resumo</b>: dias estudados, acertos, palavras aprendidas, nota estimada e simulado antes da prova. Dá para copiar, mandar por WhatsApp ou baixar em PDF.</p>', '<p>In the <b>Summary</b>: study days, accuracy, words learned, estimated grade and a practice test before the exam. Copy, share or download as PDF.</p>')),
    infoCard('🏖️', tx('Modo férias: temas narrados', 'Holiday mode: narrated topics'), tx('<p>Histórias faladas, com palavras novas e perguntas, para manter o hábito nas férias e o ano todo.</p><p>O app já vem com <b>2 temas grátis</b> para experimentar. O <b>Pacote Férias</b> traz <b>10 temas à sua escolha</b> de uma lista com mais de 20 (dinossauros, espaço, corpo humano, Roma Antiga…), e dá para comprar mais.</p>', '<p>Spoken stories with new words and questions, to keep the habit over holidays and all year.</p><p>The app comes with <b>2 free topics</b> to try. The <b>Holiday Pack</b> brings <b>10 topics of your choice</b> from a list of 20+ (dinosaurs, space, the human body, Ancient Rome…), and you can buy more.</p>')),
    infoCard('🛡️', tx('Segurança da criança', 'Child safety'), tx('<p>Só apelido (nunca nome completo), sem anúncios, sem venda de dados. Gravações e fotos são privadas da família.</p>', '<p>Nickname only (never full name), no ads, no data selling. Recordings and photos stay private to your family.</p>'))
  ].join('');

  /* ---------- fluxo da criança (primeira ou nova) ---------- */
  function start(opts) {
    opts = opts || {};
    const first = !!opts.first;
    const others = A().kids.slice();
    const d = { apelido: '', idade: null, mes_nasc: null, idioma_app: QK.lang === 'en' ? 'en' : 'pt-BR', avatar: AVATARES[others.length % AVATARES.length] || '🦄', foco: [], minutos: 15, dias: [1, 2, 3, 4, 5], pin: '' };
    const steps = (first ? ['oi', 'parabens', 'saiba', 'termos'] : []).concat(['apelido', 'idade', 'mes', 'idioma', 'foco', 'meta', 'dias', 'constancia', 'pin', 'promessa'], first ? ['casa', 'planos'] : []);
    const N = steps.length; let i = 0, saved = null, dir = 1;
    const idx = n => steps.indexOf(n);
    const go = k => { dir = k < i ? -1 : 1; i = Math.max(0, Math.min(N - 1, k)); draw(); };
    // "saiba mais" só aparece se o pai pedir; voltar pula ele se não foi visto
    const next = () => go(steps[i + 1] === 'saiba' && !d.querSaber ? i + 2 : i + 1);
    const prev = () => (i === 0 ? (first ? null : A().picker()) : go(steps[i - 1] === 'saiba' && !d.querSaber ? i - 2 : i - 1));
    const back = i => i > 0 ? prev : (!first ? () => A().picker() : null);
    const nome = () => esc(d.apelido || tx('sua criança', 'your child'));

    function draw() {
      const s = steps[i], bk = back(i), common = { step: i + 1, total: N, back: bk };
      if (s === 'oi') {
        frame(Object.assign(common, { back: null, btn: tx('Oi, Quico! 👋', 'Hi, Quico! 👋'), foot: `<button id="tenho" class="w-full h-11 text-label-md text-primary">${tx('Recebi um convite de outro responsável', 'I got an invite from another parent')}</button>`, body: `<div class="text-center pt-4 mb-6 [&>svg]:mx-auto">${mascot(130)}</div>
          ${bubble([tx('Oi! Eu sou o Quico 👋', "Hi! I'm Quico 👋"), tx('Sou o ajudante do Quest Kids. Vou montar o estudo do seu filho junto com você, em 1 minutinho.', "I'm the Quest Kids helper. I'll set up your child's study with you in about a minute."), tx('É só responder umas perguntas rápidas. Vamos?', 'Just a few quick questions. Ready?')], 'none')}
          <div id="cv" class="hidden mt-2 bg-surface-container-low rounded-2xl p-4 space-y-2"><p class="text-body-md text-on-surface">${tx('Digite o código que você recebeu:', 'Type the code you received:')}</p><div class="flex gap-2"><input id="cod" class="${inputCls} !h-12 !text-label-lg uppercase tracking-widest" maxlength="8" autocapitalize="characters" autocomplete="off"><button id="acc" class="h-12 px-5 rounded-xl bg-primary-container text-on-primary text-label-lg">OK</button></div></div>` }));
        $('#tenho').onclick = () => { $('#cv').classList.remove('hidden'); $('#cod').focus(); };
        $('#acc').onclick = async () => { const c = $('#cod').value.trim(); if (!c) return; try { await DB.rpc('aceitar_convite', { cod: c }); toast('✅ ' + tx('Você entrou na família!', 'You joined the family!')); await A().loadFamily(); A().picker(); } catch (x) { toast(A().inviteErr(x), 4500); } };
        return ($('#nx').onclick = next);
      }
      if (s === 'parabens') {
        const item = (e, t, b) => `<div class="flex gap-3 items-start bg-surface-container-lowest border-2 border-surface-container-high rounded-2xl p-3.5"><span class="text-[28px] leading-none">${e}</span><span class="text-body-md text-on-surface"><b>${t}</b><br><span class="text-on-surface-variant">${b}</span></span></div>`;
        frame(Object.assign(common, { btn: tx('Vamos começar', "Let's start"), foot: `<button id="saber" class="w-full h-11 text-label-md text-primary">${tx('Quero entender melhor como funciona', 'Tell me more about how it works')}</button>`, body: `${bubble([tx('Antes de tudo: parabéns! 🎉', 'First of all: congratulations! 🎉'), tx('Você está dando ao seu filho um estudo de qualidade, todos os dias, feito com o material da própria escola dele.', "You're giving your child quality study every day, built from their own school material."), tx('E o seu trabalho é bem simples:', 'And your part is really simple:')])}
          <div class="space-y-2.5">${item('📸', tx('1. Enviar o material', '1. Send the material'), tx('Fotos das páginas que ele está estudando, uma vez por semana (ou quando tiver prova).', "Photos of the pages they're studying, once a week (or before a test)."))}
          ${item('💬', tx('2. Incentivar a lição', '2. Encourage the lesson'), tx('Nos dias que vocês combinarem. São só 15 a 20 minutinhos.', 'On the days you agree on. Just 15 to 20 minutes.'))}
          ${item('✨', tx('O resto é comigo', 'I handle the rest'), tx('Eu crio as lições, corrijo, mostro o progresso e aviso quando precisar de atenção.', 'I create the lessons, check answers, show progress and let you know when something needs attention.'))}</div>` }));
        $('#saber').onclick = () => { d.querSaber = true; go(idx('saiba')); };
        return ($('#nx').onclick = () => { d.querSaber = false; go(idx('termos')); });
      }
      if (s === 'saiba') {
        frame(Object.assign(common, { btn: tx('Entendi, vamos lá!', "Got it, let's go!"), body: `${bubble([tx('Claro! Aqui está o principal.', "Sure! Here's what matters most."), tx('Toque em cada cartão para ver mais:', 'Tap each card to see more:')])}
          <div class="space-y-2.5">${saibaCards()}</div>${depoHtml()}` }));
        return ($('#nx').onclick = next);
      }
      if (s === 'termos') {
        frame(Object.assign(common, { body: termsBody(), btn: tx('Aceitar e continuar', 'Accept and continue'), btnOff: !d.ok }));
        $('#ok1').checked = !!d.ok; $('#ok1').onchange = e => { d.ok = e.target.checked; $('#nx').disabled = !d.ok; };
        return ($('#nx').onclick = async () => { $('#nx').disabled = true; await aceitar(); next(); });
      }
      if (s === 'apelido') {
        frame(Object.assign(common, { inlineBtn: true, btn: tx('Continuar', 'Continue'), body: `${bubble(first ? tx('Como vamos chamar a criança no app?', 'What should we call your child in the app?') : tx('Que legal, mais uma criança! Como vamos chamar no app?', 'Great, one more kid! What should we call them?'))}
          <div class="text-center mb-3"><span class="inline-flex w-20 h-20 rounded-full bg-primary-fixed/60 items-center justify-center text-[46px]">${d.avatar}</span></div>
          <p class="text-label-md text-on-surface mb-2">${tx('1. Escolha um avatar', '1. Pick an avatar')}</p>
          <div class="grid grid-cols-5 gap-2 mb-4">${AVATARES.map(a => `<button data-av="${a}" class="h-12 rounded-2xl text-[26px] border-2 ${d.avatar === a ? 'border-primary-container bg-primary-fixed/30' : 'border-transparent bg-surface-container-low'}">${a}</button>`).join('')}</div>
          <p class="text-label-md text-on-surface mb-2">${tx('2. Apelido (opcional)', '2. Nickname (optional)')}</p>
          <input id="ap" class="${inputCls} !h-14 !text-headline-md" maxlength="20" autocomplete="off" autocapitalize="words" value="${esc(d.apelido)}" placeholder="${tx('Ex.: Bia — ou deixe em branco', 'E.g. Bea — or leave blank')}">
          <p class="text-body-sm text-on-surface-variant mt-3 flex gap-2 justify-center text-center">${I('shield', 'text-[18px] text-primary shrink-0')} ${tx('Pode ser só o avatar ou só um apelido. Nunca o nome completo.', 'Just the avatar or a nickname is enough. Never the full name.')}</p>
          ${!first ? `<p class="text-body-sm text-on-surface-variant mt-2 text-center">${tx('Adicionar crianças é grátis (até 3 por conta).', 'Adding kids is free (up to 3 per account).')}</p>` : ''}` }));
        const ap = $('#ap'); ap.oninput = () => { d.apelido = ap.value; };
        ap.onkeydown = e => { if (e.key === 'Enter') $('#nx').click(); };
        app().querySelectorAll('[data-av]').forEach(b => b.onclick = () => { d.apelido = ap.value; d.avatar = b.dataset.av; draw(); });
        return ($('#nx').onclick = () => {
          d.apelido = ap.value.trim().slice(0, 20) || avName(d.avatar);
          if (others.some(k => k.apelido.toLowerCase() === d.apelido.toLowerCase())) { if (!ap.value.trim()) d.apelido += ' ' + (others.length + 1); else return toast(tx('Já existe uma criança com esse apelido.', 'There is already a child with that nickname.')); }
          next();
        });
      }
      if (s === 'idade') {
        frame(Object.assign(common, { btn: tx('Continuar', 'Continue'), btnOff: !d.idade, body: `${bubble(tx(`Quantos anos ${nome()} tem?`, `How old is ${nome()}?`))}
          <div class="grid grid-cols-5 gap-2">${[5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(n => `<button data-v="${n}" class="h-16 rounded-2xl border-2 text-headline-md ${d.idade === n ? 'border-primary-container bg-primary-fixed/30 text-on-surface' : 'border-surface-container-high bg-surface-container-lowest text-on-surface'}">${n}</button>`).join('')}</div>
          <p class="text-body-sm text-on-surface-variant mt-3 text-center">${tx('Usamos a idade para ajustar o nível das lições.', 'We use the age to adjust the lesson level.')}</p>` }));
        app().querySelectorAll('[data-v]').forEach(b => b.onclick = () => { d.idade = +b.dataset.v; draw(); });
        return ($('#nx').onclick = next);
      }
      if (s === 'mes') {
        frame(Object.assign(common, { btn: tx('Continuar', 'Continue'), btnOff: d.mes_nasc === null, body: `${bubble(tx(`Em que mês é o aniversário de ${nome()}? 🎂`, `Which month is ${nome()}'s birthday? 🎂`))}
          <div class="grid grid-cols-3 gap-2">${MESES().map((m, k) => `<button data-v="${k + 1}" class="h-14 rounded-2xl border-2 text-label-lg ${d.mes_nasc === k + 1 ? 'border-primary-container bg-primary-fixed/30' : 'border-surface-container-high bg-surface-container-lowest'} text-on-surface">${m}</button>`).join('')}</div>
          <button data-v="0" class="mt-3 w-full h-12 rounded-2xl text-label-md ${d.mes_nasc === 0 ? 'bg-primary-fixed/30 text-on-surface' : 'text-on-surface-variant'}">${tx('Prefiro não dizer', 'Prefer not to say')}</button>
          <p class="text-body-sm text-on-surface-variant mt-2 text-center">${tx('Só o mês, para uma surpresa no app. Sem dia e sem ano.', 'Month only, for a surprise in the app. No day, no year.')}</p>` }));
        app().querySelectorAll('[data-v]').forEach(b => b.onclick = () => { d.mes_nasc = +b.dataset.v; draw(); });
        return ($('#nx').onclick = next);
      }
      if (s === 'idioma') {
        frame(Object.assign(common, { btn: tx('Continuar', 'Continue'), body: `${bubble(tx('Em que idioma são as lições da escola?', 'What language is the school material in?'))}
          <div class="space-y-3">${[['pt-BR', '🇧🇷', 'Português', tx('Escola em português', 'School in Portuguese')], ['en', '🇺🇸', 'English', tx('Escola em inglês (escola americana ou bilíngue)', 'School in English')]].map(([v, f, n, s2]) => bigCard('data-v', v, d.idioma_app === v, `<span class="text-[34px]">${f}</span><span><b class="text-headline-md text-on-surface block">${n}</b><span class="text-body-sm text-on-surface-variant">${s2}</span></span>`)).join('')}</div>` }));
        app().querySelectorAll('[data-v]').forEach(b => b.onclick = () => { d.idioma_app = b.dataset.v; draw(); });
        return ($('#nx').onclick = next);
      }
      if (s === 'avatar') {
        frame(Object.assign(common, { btn: tx('Continuar', 'Continue'), body: `${bubble(tx(`Escolha o avatar de ${nome()}`, `Pick ${nome()}'s avatar`))}
          <div class="text-center mb-4"><span class="inline-flex w-24 h-24 rounded-full bg-primary-fixed/60 items-center justify-center text-[54px]">${d.avatar}</span></div>
          <div class="grid grid-cols-5 gap-2">${AVATARES.map(a => `<button data-v="${a}" class="h-14 rounded-2xl text-[28px] border-2 ${d.avatar === a ? 'border-primary-container bg-primary-fixed/30' : 'border-transparent bg-surface-container-low'}">${a}</button>`).join('')}</div>` }));
        app().querySelectorAll('[data-v]').forEach(b => b.onclick = () => { d.avatar = b.dataset.v; draw(); });
        return ($('#nx').onclick = next);
      }
      if (s === 'foco') {
        const ops = [['leitura', '📖', tx('Leitura e interpretação', 'Reading and comprehension')], ['palavras', '🔤', tx('Vocabulário e palavras novas', 'Vocabulary and new words')], ['reforco', '🧮', tx('Matemática e reforço das matérias', 'Math and subject practice')], ['prova', '📝', tx('Ir bem nas provas', 'Doing well on tests')]];
        frame(Object.assign(common, { btn: tx('Continuar', 'Continue'), btnOff: !d.foco.length, body: `${bubble(tx('No que você quer que o app mais ajude?', 'What do you want the app to help with most?'))}
          <p class="text-body-sm text-on-surface-variant -mt-3 mb-3">${tx('Pode escolher mais de um.', 'You can pick more than one.')}</p>
          <div class="space-y-3">${ops.map(([v, e, n]) => bigCard('data-v', v, d.foco.includes(v), `<span class="text-[28px]">${e}</span><b class="text-label-lg text-on-surface flex-1">${n}</b>${d.foco.includes(v) ? I('check_circle', 'text-primary text-[24px]', 1) : I('radio_button_unchecked', 'text-outline text-[24px]')}`)).join('')}</div>` }));
        app().querySelectorAll('[data-v]').forEach(b => b.onclick = () => { const v = b.dataset.v; d.foco = d.foco.includes(v) ? d.foco.filter(x => x !== v) : d.foco.concat(v); draw(); });
        return ($('#nx').onclick = next);
      }
      if (s === 'meta') {
        const ops = [[15, tx('Leve', 'Light'), '🌱'], [20, tx('Normal', 'Regular'), '🙂'], [30, tx('Puxado', 'Serious'), '💪'], [45, tx('Intenso', 'Intense'), '🔥']];
        frame(Object.assign(common, { btn: tx('Continuar', 'Continue'), body: `${bubble(tx('Qual a meta diária?', "What's the daily goal?"))}
          <div class="space-y-3">${ops.map(([m, n, e]) => bigCard('data-v', m, d.minutos === m, `<span class="text-[28px]">${e}</span><span class="flex-1"><b class="text-headline-md text-on-surface">${n}</b> <span class="text-body-sm text-on-surface-variant">· ${tx('cerca de', 'about')} ${atividades(m)} ${tx('atividades', 'activities')}</span></span><span class="text-label-lg text-on-surface-variant">${m} min</span>${m === 15 ? `<span class="absolute -top-2.5 right-4 bg-primary-container text-on-primary text-[11px] font-extrabold px-2 py-0.5 rounded-full uppercase">${tx('Recomendado', 'Recommended')}</span>` : ''}`, 'relative')).join('')}</div>
          <p class="text-body-md text-on-surface mt-4 flex gap-2 bg-surface-container-low rounded-2xl p-3">${I('tips_and_updates', 'text-[20px] text-primary shrink-0')} <span>${tx('Comece de leve, <b>todos os dias</b>, e aumente só se precisar. O que mais ajuda é a constância, não o tempo.', 'Start light, <b>every day</b>, and increase only if needed. Consistency helps more than time.')}</span></p>` }));
        app().querySelectorAll('[data-v]').forEach(b => b.onclick = () => { d.minutos = +b.dataset.v; draw(); });
        return ($('#nx').onclick = next);
      }
      if (s === 'dias') {
        frame(Object.assign(common, { btn: tx('Continuar', 'Continue'), btnOff: !d.dias.length, body: `${bubble(tx('Em quais dias vai estudar?', 'Which days will they study?'))}
          <div class="grid grid-cols-7 gap-1.5">${DIAS().map((n, k) => `<button data-v="${k}" class="h-16 rounded-2xl border-2 text-label-md ${d.dias.includes(k) ? 'border-primary-container bg-primary-container text-on-primary' : 'border-surface-container-high bg-surface-container-lowest text-on-surface-variant'}">${n}</button>`).join('')}</div>
          <div class="flex gap-2 mt-3 justify-center"><button data-p="15" class="px-4 h-10 rounded-full bg-surface-container text-label-md text-on-surface">${tx('Seg a sex', 'Mon–Fri')}</button><button data-p="all" class="px-4 h-10 rounded-full bg-surface-container text-label-md text-on-surface">${tx('Todos os dias', 'Every day')}</button></div>
          <p class="text-body-sm text-on-surface-variant mt-4 text-center">${tx('Pouquinho por dia rende mais do que muito de vez em quando.', 'A little every day beats a lot once in a while.')}</p>` }));
        app().querySelectorAll('[data-v]').forEach(b => b.onclick = () => { const k = +b.dataset.v; d.dias = d.dias.includes(k) ? d.dias.filter(x => x !== k) : d.dias.concat(k).sort(); draw(); });
        app().querySelectorAll('[data-p]').forEach(b => b.onclick = () => { d.dias = b.dataset.p === 'all' ? [0, 1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5]; draw(); });
        return ($('#nx').onclick = next);
      }
      if (s === 'constancia') {
        const w = d.dias.length || 5;
        const semana = (on, lbl, sub) => `<div class="bg-surface-container-lowest border-2 ${on ? 'border-primary-container' : 'border-surface-container-high'} rounded-2xl p-3.5"><div class="flex items-center justify-between mb-2"><b class="text-label-lg text-on-surface">${lbl}</b><span class="text-label-sm ${on ? 'text-primary' : 'text-on-surface-variant'}">${sub}</span></div>
          <div class="grid grid-cols-7 gap-1.5">${DIAS().map((n, k) => { const x = on ? d.dias.includes(k) : k === 6; return `<div class="flex flex-col items-center gap-1"><span class="w-full ${on ? 'h-6' : (x ? 'h-16' : 'h-1.5')} rounded-lg ${x ? (on ? 'bg-primary-container' : 'bg-secondary-container') : 'bg-surface-container-high'}"></span><span class="text-[11px] text-on-surface-variant">${n}</span></div>`; }).join('')}</div></div>`;
        frame(Object.assign(common, { btn: tx('Combinado!', 'Deal!'), body: `${bubble([tx('Um segredo que faz toda a diferença: <b>constância</b>.', 'A secret that makes all the difference: <b>consistency</b>.'), tx('Um pouquinho todo dia vale mais do que muito de uma vez. O cérebro guarda melhor quando revê o conteúdo aos poucos, em dias diferentes.', 'A little every day beats a lot at once. The brain remembers better when it reviews in small pieces, on different days.'), tx(`Por isso a lição é curta: ${d.minutos} min, ${w} ${w === 1 ? tx('dia', 'day') : tx('dias', 'days')} por semana.`, `That's why lessons are short: ${d.minutos} min, ${w} day${w === 1 ? '' : 's'} a week.`)])}
          <div class="space-y-3">${semana(true, tx('✅ Assim funciona', '✅ This works'), tx(`${d.minutos} min nos dias combinados`, `${d.minutos} min on set days`))}${semana(false, tx('😓 Assim cansa e esquece', '😓 This tires and forgets'), tx('tudo de uma vez no fim de semana', 'all at once on the weekend'))}</div>
          <div class="mt-4 bg-surface-container-low rounded-2xl p-4 space-y-2 text-body-md text-on-surface">
            <p class="flex gap-2"><span>⏰</span><span>${tx('Escolha um <b>horário fixo</b> (ex.: depois do lanche). Vira hábito em poucas semanas.', 'Pick a <b>fixed time</b> (e.g. after snack). It becomes a habit in a few weeks.')}</span></p>
            <p class="flex gap-2"><span>🎉</span><span>${tx('Comemore o <b>FEITO ✅</b> com seu filho. Elogiar o esforço mantém a vontade.', 'Celebrate the <b>DONE ✅</b> with your child. Praising effort keeps them motivated.')}</span></p>
            <p class="flex gap-2"><span>🔥</span><span>${tx('A sequência de dias aparece no app e motiva a não parar.', 'The day streak shows in the app and motivates them to keep going.')}</span></p></div>` }));
        return ($('#nx').onclick = next);
      }
      if (s === 'pin') {
        const multi = others.length >= 1;
        frame(Object.assign(common, { inlineBtn: true, btn: tx('Salvar e continuar', 'Save and continue'), body: `${bubble(multi ? tx(`Cada criança tem o seu PIN. Crie um para ${nome()}:`, `Each child has their own PIN. Create one for ${nome()}:`) : tx(`Quer um PIN para ${nome()}? É opcional.`, `Want a PIN for ${nome()}? It's optional.`))}
          <input id="pin" class="${inputCls} tracking-[0.6em]" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" value="${esc(d.pin)}" placeholder="••••">
          <button id="sug" class="mt-3 w-full h-12 rounded-2xl bg-surface-container text-primary text-label-md flex items-center justify-center gap-2">${I('casino', 'text-[20px]')} ${tx('Sugerir um PIN', 'Suggest a PIN')}</button>
          <p class="text-body-sm text-on-surface-variant mt-3 text-center">${multi ? tx('Com mais de uma criança, o PIN evita que um entre no perfil do outro.', 'With more than one child, a PIN keeps each one in their own profile.') : tx('O PIN evita que irmãos ou amigos mexam no progresso.', 'A PIN keeps siblings and friends out of the progress.')}</p>
          ${multi && others.length ? `<p class="text-body-sm text-on-surface-variant mt-1 text-center">${tx(`Dica: crie um PIN também para ${others.map(k => esc(k.apelido)).join(', ')} em Área dos pais → Crianças → Editar.`, `Tip: also set a PIN for ${others.map(k => esc(k.apelido)).join(', ')} in Parents → Kids → Edit.`)}</p>` : ''}
          <div id="err" class="text-label-md text-error min-h-[1.2em] mt-2 text-center"></div>`,
          foot: multi ? '' : `<button id="skip" class="w-full h-12 mt-2 text-label-md text-on-surface-variant">${tx('Agora não', 'Not now')}</button>` }));
        const pin = $('#pin'); pin.oninput = () => { pin.value = pin.value.replace(/\D/g, '').slice(0, 4); d.pin = pin.value; };
        $('#sug').onclick = () => { let p; do { p = String(Math.floor(1000 + Math.random() * 9000)); } while (/(\d)\1\1/.test(p) || '0123456789'.includes(p) || '9876543210'.includes(p)); pin.value = d.pin = p; toast(tx(`PIN sugerido: ${p}. Anote para ${d.apelido}!`, `Suggested PIN: ${p}. Write it down for ${d.apelido}!`), 4000); };
        const sk = $('#skip'); if (sk) sk.onclick = () => { d.pin = ''; save(); };
        return ($('#nx').onclick = () => { if (d.pin && !/^\d{4}$/.test(d.pin)) return ($('#err').textContent = tx('O PIN tem 4 números.', 'The PIN has 4 digits.')); if (multi && !d.pin) return ($('#err').textContent = tx('Crie um PIN (ou toque em "Sugerir um PIN").', 'Create a PIN (or tap "Suggest a PIN").')); save(); });
      }
      if (s === 'promessa') {
        const w = d.dias.length, atv = atividades(d.minutos) * w * 13, pal = Math.round(w * 13 * 4), horas = Math.round(d.minutos * w * 13 / 60);
        const bars = [1, 2, 3].map(m => Math.round(atv * m / 3));
        frame(Object.assign(common, { btn: tx('Continuar', 'Continue'), body: `${bubble([tx(`Prontinho! ${nome()} já está no app. 🎉`, `All set! ${nome()} is in the app. 🎉`), tx(`Este é o plano de ${nome()} para os próximos 3 meses:`, `Here is ${nome()}'s plan for the next 3 months:`)])}
          <div class="bg-surface-container-lowest border-2 border-surface-container-high rounded-2xl p-4 space-y-4">
            <div class="flex items-end justify-around h-36 gap-4 px-2">${bars.map((v, k) => `<div class="flex-1 flex flex-col items-center justify-end h-full gap-1"><b class="text-label-md text-on-surface">${v}</b><div class="w-full max-w-[56px] rounded-t-xl ${k === 2 ? 'bg-primary-container' : 'bg-primary-container/45'}" style="height:${Math.round(100 * (k + 1) / 3)}%"></div><span class="text-label-sm text-on-surface-variant">${tx('Mês', 'Month')} ${k + 1}</span></div>`).join('')}</div>
            <div class="grid grid-cols-3 gap-2 text-center">
              <div class="bg-surface-container-low rounded-xl p-2"><b class="text-headline-md text-on-surface block">~${atv}</b><span class="text-label-sm text-on-surface-variant">${tx('atividades', 'activities')}</span></div>
              <div class="bg-surface-container-low rounded-xl p-2"><b class="text-headline-md text-on-surface block">~${pal}</b><span class="text-label-sm text-on-surface-variant">${tx('palavras novas', 'new words')}</span></div>
              <div class="bg-surface-container-low rounded-xl p-2"><b class="text-headline-md text-on-surface block">~${horas} h</b><span class="text-label-sm text-on-surface-variant">${tx('de estudo', 'of study')}</span></div></div>
            <p class="text-body-sm text-on-surface-variant">${tx(`Com ${d.minutos} min por dia, ${w} ${w === 1 ? 'dia' : 'dias'} por semana. É uma estimativa: cada criança tem o seu ritmo, e o que faz a diferença é estudar um pouco todo dia.`, `With ${d.minutos} min a day, ${w} day${w === 1 ? '' : 's'} a week. This is an estimate: every child has their own pace, and what makes the difference is a little every day.`)}</p>
          </div>
          <p class="text-body-sm text-on-surface-variant mt-3 text-center">${tx('Quer mudar alguma resposta? Toque na seta ← lá em cima. Depois dá para mudar tudo em Área dos pais → Crianças.', 'Want to change an answer? Tap the ← arrow at the top. You can change everything later in Parents → Kids.')}</p>` }));
        return ($('#nx').onclick = () => first ? next() : A().picker());
      }
      if (s === 'casa') {
        const ios = /iphone|ipad|ipod/i.test(navigator.userAgent), standalone = navigator.standalone || (window.matchMedia && matchMedia('(display-mode: standalone)').matches);
        if (standalone) return dir < 0 ? prev() : next();
        const step = (n, t) => `<li class="flex items-start gap-3"><span class="w-8 h-8 rounded-full bg-primary-container text-on-primary text-label-lg flex items-center justify-center shrink-0">${n}</span><span class="text-body-md text-on-surface pt-1">${t}</span></li>`;
        frame(Object.assign(common, { btn: tx('Feito!', 'Done!'), foot: `<button id="skip" class="w-full h-12 text-label-md text-on-surface-variant">${tx('Faço depois', "I'll do it later")}</button>`, body: `${bubble(tx('Coloque o Quest Kids na tela de início, como um app. Assim fica fácil todo dia!', 'Add Quest Kids to your home screen, like an app. Easy every day!'))}
          <div class="bg-surface-container-lowest border-2 border-surface-container-high rounded-2xl p-4">
            <h3 class="text-label-lg text-on-surface mb-3">${ios ? 'iPhone / iPad (Safari)' : 'Android (Chrome)'}</h3>
            <ol class="space-y-3">${ios
              ? step(1, tx('Toque no botão <b>Compartilhar</b> (o quadrado com a seta para cima ⬆️), embaixo da tela.', 'Tap the <b>Share</b> button (square with an up arrow ⬆️) at the bottom.')) + step(2, tx('Role e toque em <b>"Adicionar à Tela de Início"</b>.', 'Scroll and tap <b>"Add to Home Screen"</b>.')) + step(3, tx('Toque em <b>Adicionar</b>. Pronto: aparece o ícone 🚀 Quest Kids.', 'Tap <b>Add</b>. Done: the 🚀 Quest Kids icon appears.'))
              : step(1, tx('Toque nos <b>três pontinhos ⋮</b> no canto de cima.', 'Tap the <b>three dots ⋮</b> at the top.')) + step(2, tx('Toque em <b>"Instalar app"</b> ou <b>"Adicionar à tela inicial"</b>.', 'Tap <b>"Install app"</b> or <b>"Add to Home screen"</b>.')) + step(3, tx('Confirme. Pronto: aparece o ícone 🚀 Quest Kids.', 'Confirm. Done: the 🚀 Quest Kids icon appears.'))}</ol>
            <p class="text-body-sm text-on-surface-variant mt-3">${tx('Tem ícones antigos (como "Gabi\'s Quest" ou "Parents")? Aperte e segure o ícone antigo → <b>Remover app</b>. Deixe só um Quest Kids.', 'Old icons? Press and hold the old icon → <b>Remove app</b>. Keep just one Quest Kids.')}</p>
          </div>` }));
        $('#skip').onclick = next; return ($('#nx').onclick = next);
      }
      if (s === 'planos') {
        frame(Object.assign(common, { body: '<div class="spin" style="margin-top:20vh"></div>' }));
        const moeda = localStorage.getItem('qk.moeda') || (pt() ? 'brl' : 'usd');
        Promise.all([DB.sel('precos', { eq: { moeda } }).catch(() => []), DB.rpc('vagas_fundador').catch(() => 0)]).then(([precos, vagas]) => {
          const fund = moeda === 'brl' && vagas > 0;
          const fim = new Date(Date.now() + 7 * 864e5).toLocaleDateString(pt() ? 'pt-BR' : 'en-US', { day: 'numeric', month: 'long' });
          frame(Object.assign(common, { btn: tx('Começar 7 dias grátis', 'Start 7 days free'),
            foot: `<p class="text-center text-label-sm text-on-surface-variant">${tx('Cancele quando quiser · Sem cartão agora', 'Cancel anytime · No card now')}</p>`,
            body: `<div class="text-center mb-4 [&>svg]:mx-auto">${mascot(88)}<h1 class="text-headline-xl-mobile text-on-surface mt-2">${tx('Experimente tudo grátis por 7 dias', 'Try everything free for 7 days')}</h1></div>
              ${precos.length ? plansHtml(precos, moeda, fund, 'anual') : ''}
              <div class="mt-4 bg-surface-container-low rounded-2xl p-4 space-y-2 text-body-sm text-on-surface-variant">
                <p class="flex gap-2">${I('event_available', 'text-[18px] text-primary shrink-0')}<span>${tx(`<b class="text-on-surface">Hoje:</b> acesso completo, sem cartão e sem cobrança.`, `<b class="text-on-surface">Today:</b> full access, no card, no charge.`)}</span></p>
                <p class="flex gap-2">${I('notifications', 'text-[18px] text-primary shrink-0')}<span>${tx(`<b class="text-on-surface">${fim}:</b> o teste acaba e o app pede para escolher um plano. Nada é cobrado sem você assinar.`, `<b class="text-on-surface">${fim}:</b> the trial ends and the app asks you to pick a plan. Nothing is charged unless you subscribe.`)}</span></p>
                <p class="flex gap-2">${I('autorenew', 'text-[18px] text-primary shrink-0')}<span>${tx('Se assinar, o plano renova automaticamente até você cancelar, na Área dos pais → Conta.', 'If you subscribe, the plan renews automatically until you cancel in Parents → Account.')}</span></p></div>
              <div class="mt-3 bg-surface-container-low rounded-2xl p-3 flex items-center gap-3"><span class="text-[26px]">🏖️</span><p class="text-body-sm text-on-surface"><b>${tx('Modo férias:', 'Holiday mode:')}</b> ${tx('2 temas narrados grátis para experimentar. Pacote Férias opcional, com 10 temas à sua escolha.', '2 free narrated topics to try. Optional Holiday Pack with 10 topics of your choice.')}</p></div>
              ${depoHtml()}
              ${fund ? `<p class="mt-3 text-center text-label-md text-secondary">🎁 ${tx(`Preço de fundador: restam ${vagas} vagas.`, `Founder price: ${vagas} spots left.`)}</p>` : ''}` }));
          app().querySelectorAll('input[name=plano]').forEach(r => r.onchange = () => { try { localStorage.setItem('qk.planoEscolhido', r.value); } catch (e) {} });
          $('#nx').onclick = () => { toast(tx('🎉 Bons estudos! Você escolhe o plano quando quiser.', '🎉 Happy studying! Pick a plan whenever you like.'), 3500); A().picker(); };
        });
        return;
      }
    }

    async function save() {
      const b = $('#nx'); if (b) b.disabled = true;
      const pil = { leitura: 1, palavras: 1, reforco: 1 };
      d.foco.forEach(f => { if (f === 'prova') pil.reforco += 1; else pil[f] += 1.5; });
      const tot = pil.leitura + pil.palavras + pil.reforco;
      const pilares = { leitura: Math.round(20 * pil.leitura / tot) * 5, palavras: Math.round(20 * pil.palavras / tot) * 5 }; pilares.reforco = 100 - pilares.leitura - pilares.palavras;
      const row = { familia_id: A().fam.id, apelido: d.apelido, avatar: d.avatar, idade: d.idade, mes_nasc: d.mes_nasc || null, idioma_app: d.idioma_app, idiomas: [d.idioma_app], estilo: 'simples', tema: 'claro', minutos: d.minutos, dias: d.dias, pilares };
      try {
        if (saved) {
          const up = Object.assign({}, row); delete up.familia_id;
          await DB.upd('criancas', { eq: { id: saved } }, up).catch(async e => { if (!/mes_nasc|column|schema/i.test(e.message)) throw e; delete up.mes_nasc; await DB.upd('criancas', { eq: { id: saved } }, up); });
          if (d.pin) await DB.rpc('definir_pin', { crianca: saved, pin: d.pin }).catch(e => toast(e.message));
          await A().loadFamily(); toast('✅ ' + tx('Atualizado', 'Updated')); return next();
        }
        let r;
        try { r = await DB.ins('criancas', row); }
        catch (e) { if (!/mes_nasc|column|schema/i.test(e.message)) throw e; const r2 = Object.assign({}, row); delete r2.mes_nasc; r = await DB.ins('criancas', r2); }
        const id = r[0].id; saved = id;
        if (d.pin) await DB.rpc('definir_pin', { crianca: id, pin: d.pin }).catch(e => toast(e.message));
        await A().loadFamily(); toast('✅ ' + tx(`Pronto! ${d.apelido} já está no app.`, `Done! ${d.apelido} is in the app.`));
        next();
      } catch (x) { if (b) b.disabled = false; toast(x.message, 4000); }
    }
    draw();
  }

  window.QKOnboard = { start, terms, needTerms, plansHtml, planSel, mascot, TERMOS_V };
})();
