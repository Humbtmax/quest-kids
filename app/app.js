/* Quest Kids — app da criança (visual do Stitch): entrada, escolha da criança, Hoje, lição, biblioteca, prêmios, progresso */
(function () {
  'use strict';
  const { t, $, esc, md, today, addDays, shuffle, toast, Auth, DB, C } = QK;
  const A = window.QKApp = { fam: null, sub: null, kids: [], kid: null, eng: null };
  const app = () => $('#app');
  const view = (html, keep) => { const y = window.scrollY; app().innerHTML = html; window.scrollTo(0, keep ? y : 0); };
  const isPt = () => !(A.kid && A.kid.idioma_app === 'en');
  const kt = k => t(k, isPt() ? 'pt' : 'en');
  const L = (pt, en) => isPt() ? pt : en;                 // textos no idioma da criança
  const P = (pt, en) => QK.lang === 'pt' ? pt : en;       // textos no idioma do adulto
  const I = (name, cls, fill) => `<span class="material-symbols-outlined ${cls || ''} ${fill ? 'fill' : ''}">${name}</span>`;

  function theme(estilo, tema) {
    const r = document.documentElement;
    r.dataset.estilo = estilo || 'simples';
    r.dataset.tema = tema || (matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro');
  }
  A.theme = theme;
  // tema da área dos pais e das telas de entrada (fica salvo neste aparelho)
  const adultTema = () => { try { return localStorage.getItem('qk.temaPais') || ''; } catch (e) { return ''; } };
  A.adultTema = adultTema;
  A.setAdultTema = tm => { try { localStorage.setItem('qk.temaPais', tm); } catch (e) {} theme('simples', tm); };
  A.temaAtual = () => document.documentElement.dataset.tema;
  A.I = I;

  /* matéria de cada habilidade (chip da lição) */
  const SKILL = {
    science: ['science', 'Ciências', 'Science'], volume: ['calculate', 'Matemática · Volume', 'Math · Volume'], fractions: ['calculate', 'Matemática · Frações', 'Math · Fractions'],
    expressions: ['calculate', 'Matemática · Expressões', 'Math · Expressions'], money: ['payments', 'Matemática · Dinheiro', 'Math · Money'], math: ['calculate', 'Matemática', 'Math'],
    vocab: ['spellcheck', 'Vocabulário', 'Vocabulary'], context: ['menu_book', 'Leitura · Contexto', 'Reading · Context clues'], inference: ['menu_book', 'Leitura · Inferência', 'Reading · Inference'],
    main_idea: ['menu_book', 'Leitura · Ideia principal', 'Reading · Main idea'], figurative: ['menu_book', 'Leitura · Linguagem figurada', 'Reading · Figurative language'],
    evidence: ['menu_book', 'Leitura · Evidências', 'Reading · Evidence'], check: ['menu_book', 'Leitura', 'Reading'], leitura: ['menu_book', 'Leitura', 'Reading'],
    history: ['account_balance', 'História', 'History'], geography: ['public', 'Geografia', 'Geography']
  };
  const skillInfo = s => { const k = SKILL[s]; if (k) return { icon: k[0], name: L(k[1], k[2]) }; return { icon: 'school', name: s ? String(s).charAt(0).toUpperCase() + String(s).slice(1) : L('Reforço', 'Practice') }; };
  A.skillInfo = skillInfo;

  /* ================= peças comuns ================= */
  const logo = `<div class="w-9 h-9 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-sm">${I('rocket_launch', 'text-[20px]', 1)}</div>`;
  const btnPrimary = (id, label, icon, extra) => `<button id="${id}" type="button" class="btn3d w-full min-h-[56px] py-3 px-6 rounded-2xl bg-primary-container text-on-primary text-headline-md flex items-center justify-center gap-2.5 select-none ${extra || ''}">${icon && icon.startsWith('<') ? icon : ''}<span>${label}</span>${icon && !icon.startsWith('<') ? I(icon, 'text-[24px]') : ''}</button>`;
  const btnSoft = (id, label, icon) => `<button id="${id}" type="button" class="w-full h-12 bg-surface-container text-on-surface rounded-2xl text-label-md flex items-center justify-center gap-2 hover:bg-surface-container-high active:scale-[0.99] transition">${icon ? I(icon, 'text-[20px]') : ''}<span>${label}</span></button>`;
  const field = (lbl, inner) => `<label class="block"><span class="block text-label-md text-on-surface mb-1.5">${lbl}</span>${inner}</label>`;
  const inputCls = 'w-full h-14 px-4 rounded-2xl bg-surface-container-lowest border-2 border-surface-container-high focus:border-primary-container focus:outline-none text-body-lg text-on-surface placeholder:text-outline';

  /* ================= entrada (login) ================= */
  function authScreen(mode, msg) {
    theme('simples', adultTema() || 'claro'); mode = mode || 'entrar';
    const title = mode === 'criar' ? t('criarConta') : mode === 'recuperar' ? t('esqueci') : mode === 'nova' ? t('novaSenha') : t('entrar');
    view(`<main class="min-h-screen flex items-center justify-center px-margin py-10">
      <div class="w-full max-w-md">
        <div class="flex flex-col items-center text-center mb-6">
          <div class="w-16 h-16 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shadow-md mb-3">${I('rocket_launch', 'text-[36px]', 1)}</div>
          <h1 class="text-headline-xl-mobile text-on-surface">Quest Kids</h1>
          <p class="text-body-md text-on-surface-variant">${P('A lição de casa vira um jogo.', 'Homework becomes a game.')}</p>
          <div class="mt-3 inline-flex bg-surface-container rounded-full p-1">${['pt', 'en'].map(l => `<button data-l="${l}" class="px-4 py-1.5 rounded-full text-label-md ${QK.lang === l ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant'}">${l.toUpperCase()}</button>`).join('')}</div>
        </div>
        <div class="bg-surface-container-lowest rounded-3xl p-6 soft-shadow space-y-4">
          <h2 class="text-headline-lg-mobile text-on-surface">${title}</h2>
          ${C.GOOGLE_LOGIN && (mode === 'entrar' || mode === 'criar') ? `<button id="g" type="button" class="w-full h-14 rounded-2xl bg-white border border-outline-variant text-[#1f1f1f] text-label-lg flex items-center justify-center gap-3 shadow-sm active:scale-[0.99]"><svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>${t('google')}</button>
          <div class="flex items-center gap-3 text-label-sm text-outline"><span class="flex-1 h-px bg-outline-variant"></span>${t('ou')}<span class="flex-1 h-px bg-outline-variant"></span></div>` : ''}
          <form id="f" class="space-y-4">
            ${mode !== 'nova' ? field(t('email'), `<input class="${inputCls}" type="email" name="email" autocomplete="email" required>`) : ''}
            ${mode !== 'recuperar' ? field(mode === 'nova' ? t('novaSenha') : t('senha'), `<input class="${inputCls}" type="password" name="pw" minlength="6" autocomplete="${mode === 'entrar' ? 'current-password' : 'new-password'}" required>`) : ''}
            <div id="err" class="text-label-md ${/link|enviamos|sent/i.test(msg || '') ? 'text-primary' : 'text-error'} min-h-[1.2em]">${esc(msg || '')}</div>
            <button class="btn3d w-full h-14 rounded-2xl bg-primary-container text-on-primary text-headline-md" type="submit">${mode === 'criar' ? t('criarConta') : mode === 'recuperar' || mode === 'nova' ? t('continuar') : t('entrar')}</button>
          </form>
          <p class="text-center text-label-md text-primary space-x-2">
            ${mode === 'entrar' ? `<a href="#" data-m="criar" class="underline">${t('naoTenho')}</a><span class="text-outline">·</span><a href="#" data-m="recuperar" class="underline">${t('esqueci')}</a>` : mode !== 'nova' ? `<a href="#" data-m="entrar" class="underline">${t('jaTenho')}</a>` : ''}
          </p>
        </div>
        ${mode === 'criar' ? `<p class="text-center text-body-sm text-on-surface-variant mt-4">${P('Ao criar a conta você concorda com os', 'By creating an account you agree to the')} <a class="underline text-primary" href="../termos.html">${P('Termos de Uso', 'Terms')}</a> ${P('e a', 'and')} <a class="underline text-primary" href="../privacidade.html">${P('Política de Privacidade', 'Privacy Policy')}</a>.</p>` : ''}
        ${QK.DEMO ? `<p class="text-center text-body-sm text-on-surface-variant mt-3">${P('Modo demonstração: os dados ficam só neste aparelho.', 'Demo mode: data stays on this device.')}</p>` : ''}
        <p class="text-center mt-6"><a href="../" class="text-label-md text-on-surface-variant underline">${P('← Voltar para o site', '← Back to the website')}</a></p>
      </div></main>`);
    app().querySelectorAll('[data-l]').forEach(b => b.onclick = () => { QK.setLang(b.dataset.l); authScreen(mode); });
    app().querySelectorAll('[data-m]').forEach(a => a.onclick = e => { e.preventDefault(); authScreen(a.dataset.m); });
    const g = $('#g'); if (g) g.onclick = () => QK.DEMO ? toast(P('Google não funciona no modo demonstração.', 'Google sign-in is off in demo mode.')) : Auth.google();
    $('#f').onsubmit = async e => {
      e.preventDefault(); const f = e.target, err = $('#err'); err.textContent = ''; err.className = 'text-label-md text-error min-h-[1.2em]'; const b = f.querySelector('button'); b.disabled = true;
      try {
        if (mode === 'entrar') { await Auth.signIn(f.email.value.trim(), f.pw.value); return boot(); }
        if (mode === 'criar') { const r = await Auth.signUp(f.email.value.trim(), f.pw.value); if (r === 'ok') return boot(); return authScreen('entrar', t('confiraEmail')); }
        if (mode === 'recuperar') { await Auth.recover(f.email.value.trim()); return authScreen('entrar', t('recuperarEnviado')); }
        if (mode === 'nova') { await Auth.newPassword(f.pw.value); toast('✅'); return boot(); }
      } catch (x) { err.textContent = traduz(x.message); b.disabled = false; }
    };
  }
  function traduz(m) {
    if (QK.lang !== 'pt') return m;
    if (/invalid login/i.test(m)) return 'E-mail ou senha incorretos.';
    if (/already registered|already exists/i.test(m)) return 'Este e-mail já tem conta. Toque em "Já tenho conta".';
    if (/not confirmed/i.test(m)) return 'Confirme seu e-mail primeiro (veja sua caixa de entrada).';
    if (/at least 6|password should/i.test(m)) return 'A senha precisa ter pelo menos 6 caracteres.';
    if (/rate limit|too many/i.test(m)) return 'Muitas tentativas. Espere um minuto e tente de novo.';
    if (/failed to fetch|network/i.test(m)) return 'Sem internet ou servidor dormindo. Tente de novo em instantes.';
    return m;
  }
  A.traduz = traduz;

  /* ================= família ================= */
  async function loadFamily() {
    const uidv = Auth.user && Auth.user.id;
    const mem = await DB.sel('membros', { eq: { user_id: uidv } });
    if (!mem.length) throw new Error(P('Sua conta ainda não tem família. Saia e entre de novo; se continuar, fale com o suporte.', 'Your account has no family yet. Sign out and in again.'));
    let m = mem.find(x => x.papel === 'dono') || mem[0];
    if (mem.length > 1) {
      // em mais de uma família (ex.: aceitou convite): usa a que tem crianças, de preferência a do convite
      const cs = await DB.sel('criancas', { inn: { familia_id: mem.map(x => x.familia_id) } }).catch(() => []);
      const comKids = mem.filter(x => cs.some(c => c.familia_id === x.familia_id && !c.arquivada));
      if (comKids.length) m = comKids.find(x => x.papel !== 'dono') || comKids[0];
    }
    A.fam = { id: m.familia_id, papel: m.papel };
    const [subs, kids] = await Promise.all([DB.sel('assinaturas', { eq: { familia_id: A.fam.id } }), DB.sel('criancas', { eq: { familia_id: A.fam.id }, order: 'criado_em.asc' })]);
    A.sub = subs[0] || { plano: 'teste', status: 'trialing' };
    A.famRow = await DB.sel('familias', { eq: { id: A.fam.id } }).then(r => r[0] || null).catch(() => null);
    A.kids = kids.filter(k => !k.arquivada);
  }
  A.loadFamily = loadFamily;
  function inviteErr(x) { const m = String((x && x.message) || x); return /inválido|vencido|invalid|expired/i.test(m) ? P('Esse código não vale mais (vence em 3 dias) ou foi digitado errado. Peça um convite novo.', 'This code is no longer valid (3 days) or was mistyped. Ask for a new invite.') : /demo/i.test(m) ? P('No modo demonstração não há convites. Toque em "Sair da demo".', 'No invites in demo mode. Tap "Exit demo".') : m; }
  A.inviteErr = inviteErr;
  A.planOk = () => {
    const s = A.sub || {}; if (s.plano === 'cortesia') return true;
    if (!['active', 'trialing', 'past_due'].includes(s.status)) return false;
    return !s.valido_ate || new Date(s.valido_ate) > new Date();
  };
  A.trialLeft = () => { const s = A.sub || {}; if (s.plano !== 'teste' || !s.valido_ate) return null; return Math.max(0, Math.ceil((new Date(s.valido_ate) - Date.now()) / 864e5)); };

  async function boot() {
    view('<div class="spin"></div>');
    try {
      const r = await Auth.handleRedirect();
      if (r === 'recovery') return authScreen('nova');
      // convite: guarda o código mesmo se a pessoa precisar confirmar o e-mail em outra aba
      const qconv = new URLSearchParams(location.search).get('convite');
      if (qconv) { try { localStorage.setItem('qk.convite', qconv.trim().toUpperCase()); } catch (e) {} }
      const savedConv = (() => { try { return localStorage.getItem('qk.convite'); } catch (e) { return null; } })();
      if (!Auth.logged) return authScreen(/[?&]criar/.test(location.search) || savedConv ? 'criar' : 'entrar');
      if (savedConv && !QK.DEMO) { try { localStorage.removeItem('qk.convite'); } catch (e) {} try { await DB.rpc('aceitar_convite', { cod: savedConv }); toast('✅ ' + P('Convite aceito! Você entrou na família.', 'Invite accepted! You joined the family.'), 4000); } catch (x) { toast(inviteErr(x), 5000); } }
      // convite por e-mail: se alguém convidou este e-mail, entra sozinho na família
      if (!QK.DEMO) await DB.rpc('aceitar_convite_email').then(f => { if (f) toast('✅ ' + P('Você entrou na família que te convidou!', 'You joined the family that invited you!'), 4000); }).catch(() => {});
      await loadFamily();
      if (/[?&]pago=1/.test(location.search)) { toast(P('🎉 Assinatura confirmada! Obrigado.', '🎉 Subscription confirmed! Thank you.'), 4000); history.replaceState(null, '', location.pathname); }
      if (!A.kids.length) return QKOnboard.start({ first: true });
      if (QKOnboard.needTerms()) return QKOnboard.terms(picker);
      picker();
    } catch (x) {
      if (x.message === 'sessao') return authScreen('entrar');
      theme('simples', adultTema());
      view(`<main class="min-h-screen flex items-center justify-center px-margin"><div class="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 soft-shadow text-center space-y-4">
        <div class="text-5xl">😕</div><p class="text-body-lg text-on-surface">${esc(traduz(x.message))}</p>${btnPrimary('r', t('continuar'))}<a href="#" id="o" class="block text-label-md text-primary underline">${t('sair')}</a></div></main>`);
      $('#r').onclick = boot; $('#o').onclick = async e => { e.preventDefault(); await Auth.signOut(); boot(); };
    }
  }
  A.boot = boot;

  /* ================= quem vai estudar ================= */
  function picker() {
    theme('simples', adultTema()); A.kid = null; A.eng = null; A.ret = null;
    const tl = A.trialLeft();
    view(`<main class="min-h-screen px-margin md:px-margin-tablet py-10 max-w-4xl mx-auto">
      <div class="flex items-center gap-3 mb-8">${logo}<span class="text-headline-md text-on-surface">Quest Kids</span></div>
      ${QK.DEMO ? demoBar() : ''}
      <h1 class="text-headline-xl-mobile md:text-headline-xl text-on-surface mb-2">${t('quemVaiUsar')}</h1>
      ${tl !== null ? `<div class="inline-flex items-center gap-2 bg-secondary-fixed text-on-secondary-fixed px-4 py-2 rounded-full text-label-md my-3">${I('hourglass_top', 'text-[18px]')} ${P(`Teste grátis: faltam ${tl} dias`, `Free trial: ${tl} days left`)}</div>` : ''}
      ${!A.planOk() ? `<div class="bg-secondary-fixed text-on-secondary-fixed rounded-2xl p-4 my-3 text-label-lg">💛 ${P('O teste grátis acabou. Escolha um plano na Área dos pais para continuar.', 'Your free trial ended. Pick a plan in the Parents area.')}</div>` : ''}
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        ${A.kids.map(k => `<button data-k="${k.id}" class="group bg-surface-container-lowest rounded-3xl p-5 soft-shadow flex flex-col items-center gap-3 active:scale-95 transition hover:-translate-y-0.5">
          <div class="w-24 h-24 rounded-full bg-primary-fixed/60 flex items-center justify-center text-[52px] shadow-inner">${esc(k.avatar || '⭐')}</div>
          <span class="text-headline-md text-on-surface">${esc(k.apelido)}</span>
          <span class="text-label-sm text-on-surface-variant">${k.minutos} min · ${k.idioma_app === 'en' ? 'English' : 'Português'}</span></button>`).join('')}
        ${A.kids.length < 3 ? `<button id="addk" class="rounded-3xl p-5 border-2 border-dashed border-primary-container/60 flex flex-col items-center justify-center gap-3 text-primary active:scale-95 transition hover:bg-primary-fixed/20 min-h-[200px]">
          <div class="w-24 h-24 rounded-full bg-primary-fixed/40 flex items-center justify-center">${I('person_add', 'text-[44px]')}</div>
          <span class="text-headline-md">${P('Adicionar criança', 'Add a child')}</span><span class="text-label-sm text-on-surface-variant">${P('Grátis · cada uma com seu PIN', 'Free · each with their own PIN')}</span></button>` : ''}
      </div>
      <button id="pais" class="mt-8 w-full sm:w-auto px-6 h-14 rounded-2xl bg-surface-container text-on-surface text-label-lg inline-flex items-center justify-center gap-2 hover:bg-surface-container-high">${I('shield_person', 'text-[22px] text-primary')} ${t('areaPais')}</button>
    </main>`);
    app().querySelectorAll('[data-k]').forEach(b => b.onclick = () => pinPad(A.kids.find(k => k.id === b.dataset.k)));
    $('#pais').onclick = () => parentGate();
    const ak = $('#addk'); if (ak) ak.onclick = () => parentGate(() => QKOnboard.start({ first: false }));
  }
  A.picker = picker;
  // modo demonstração: aviso claro + botão para voltar à conta de verdade
  function demoBar() { return `<div class="mb-5 bg-secondary-fixed text-on-secondary-fixed rounded-2xl p-3.5 flex items-center gap-3"><span class="text-[22px]">🧪</span><span class="text-label-md flex-1">${P('Modo demonstração: nada aqui vai para a sua conta de verdade.', 'Demo mode: nothing here goes to your real account.')}</span><a href="./?demo=0" class="shrink-0 px-3 h-10 inline-flex items-center rounded-full bg-on-secondary-fixed text-secondary-fixed text-label-md">${P('Sair da demo', 'Exit demo')}</a></div>`; }
  A.demoBar = demoBar;
  // interruptor claro/escuro visível (☀️ —● 🌙)
  function themeSwitch(id, dark) {
    return `<button id="${id}" role="switch" aria-checked="${dark}" aria-label="${P('Modo escuro', 'Dark mode')}" class="relative w-[58px] h-8 rounded-full shrink-0 border border-outline-variant ${dark ? 'bg-inverse-surface/40' : 'bg-secondary-fixed/60'} transition-colors">
      <span class="absolute left-1.5 top-1/2 -translate-y-1/2 text-[13px] leading-none ${dark ? 'opacity-40' : ''}">☀️</span><span class="absolute right-1.5 top-1/2 -translate-y-1/2 text-[13px] leading-none ${dark ? '' : 'opacity-40'}">🌙</span>
      <span class="absolute top-[3px] ${dark ? 'left-[29px]' : 'left-[3px]'} w-6 h-6 rounded-full bg-surface-container-lowest shadow transition-all"></span></button>`;
  }
  A.themeSwitch = themeSwitch;

  /* ---------- atalho 🔒 da criança direto para a senha dos pais ---------- */
  function toParents(resume) {
    const kid = A.kid;
    A.ret = { kid, go: () => { A.ret = null; A.kid = kid; theme(kid.estilo, kid.tema); document.documentElement.lang = kid.idioma_app === 'en' ? 'en' : 'pt-BR'; resume(); } };
    parentGate();
  }
  A.backFromParents = () => { if (A.ret && A.ret.kid && A.eng) return A.ret.go(); A.ret = null; picker(); };
  const gateBack = () => A.backFromParents();

  /* ---------- senha dos pais (4 números) ---------- */
  const flag = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } };
  function padScreen(title, sub, onDone, extra) {
    let pin = '';
    const draw = msg => {
      view(`<main class="min-h-screen flex items-center justify-center px-margin py-8"><div class="w-full max-w-sm text-center">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-surface-container text-primary flex items-center justify-center mb-3">${I('lock', 'text-[34px]')}</div>
        <h2 class="text-headline-lg-mobile text-on-surface">${title}</h2><p class="text-body-md text-on-surface-variant mb-4">${sub}</p>
        <div class="flex justify-center gap-4 mb-2">${[0, 1, 2, 3].map(i => `<span class="w-5 h-5 rounded-full border-[3px] border-primary-container ${i < pin.length ? 'bg-primary-container' : ''}"></span>`).join('')}</div>
        <div class="text-label-md text-error min-h-[1.4em] mb-2">${msg || ''}</div>
        <div class="grid grid-cols-3 gap-3 justify-items-center max-w-[280px] mx-auto">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '←', 0, ''].map(n => n === '' ? '<span></span>' : `<button data-n="${n}" class="w-20 h-20 rounded-full bg-surface-container-lowest soft-shadow text-headline-lg text-on-surface active:scale-90 transition">${n === '←' ? I('backspace', 'text-[26px]') : n}</button>`).join('')}</div>
        ${extra || ''}<a href="#" id="v" class="block mt-5 text-label-md text-primary underline">${A.ret ? P('Voltar para ', 'Back to ') + esc(A.ret.kid.apelido) : t('voltar')}</a></div></main>`);
      app().querySelectorAll('[data-n]').forEach(b => b.onclick = () => {
        const n = b.dataset.n;
        if (n === '←') pin = pin.slice(0, -1); else if (pin.length < 4) pin += n;
        if (pin.length === 4) { const p = pin; pin = ''; return onDone(p, draw); }
        draw();
      });
      $('#v').onclick = e => { e.preventDefault(); gateBack(); };
      document.onkeydown = e => { if (document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return; const k = e.key === 'Backspace' ? '←' : e.key; const b = /^[0-9]$|^←$/.test(k) && app().querySelector(`[data-n="${k}"]`); if (b) b.click(); };
      const fg = $('#forgot'); if (fg) fg.onclick = async e => {
        e.preventDefault();
        if (!confirm(P('Para criar uma senha nova, você vai sair e entrar de novo com o e-mail da conta. Continuar?', 'To create a new password, you will sign out and sign in again with the account e-mail. Continue?'))) return;
        flag('qk.novaSenha', '1'); await Auth.signOut().catch(() => {}); boot();
      };
    };
    draw();
  }
  function createParentPass(then) {
    padScreen(P('Crie a senha dos pais', 'Create a parents password'), P('4 números que só os adultos sabem.', '4 digits only grown-ups know.'), (p1, draw1) => {
      padScreen(P('Repita a senha', 'Repeat the password'), P('Digite os mesmos 4 números.', 'Type the same 4 digits.'), async (p2, draw2) => {
        if (p1 !== p2) return draw2(P('As senhas não são iguais. Tente de novo.', "Passwords don't match. Try again."));
        try { await DB.rpc('definir_senha_pais', { senha: p1 }); flag('qk.novaSenha', null); toast('✅ ' + P('Senha dos pais salva', 'Parents password saved')); then(); }
        catch (e) { draw2(e.message); }
      });
    });
  }
  A.createParentPass = createParentPass;
  async function parentGate(then) {
    const ok = then || (() => QKParent.open());
    let has;
    try { has = await DB.rpc('tem_senha_pais', {}); } catch (e) { has = null; }   // null: banco ainda sem a senha dos pais (04-senha-pais.sql)
    if (has === null) return mathGate(ok);
    if (!has || flag('qk.novaSenha') === '1') return createParentPass(ok);
    padScreen(t('areaPais'), P('Digite a senha dos pais', 'Enter the parents password'), async (p, draw) => {
      const ok2 = await DB.rpc('conferir_senha_pais', { senha: p }).catch(() => false);
      if (ok2) return ok(); draw(P('Senha errada. Tente de novo.', 'Wrong password. Try again.'));
    }, `<a href="#" id="forgot" class="block mt-5 text-label-sm text-on-surface-variant underline">${P('Esqueci a senha', 'Forgot password')}</a>`);
  }
  function mathGate(then) {
    const a = 6 + Math.floor(Math.random() * 4), b = 6 + Math.floor(Math.random() * 4);
    view(`<main class="min-h-screen flex items-center justify-center px-margin"><div class="w-full max-w-sm bg-surface-container-lowest rounded-3xl p-6 soft-shadow text-center space-y-4">
      <div class="w-14 h-14 mx-auto rounded-2xl bg-surface-container text-primary flex items-center justify-center">${I('lock', 'text-[30px]')}</div>
      <h2 class="text-headline-lg-mobile text-on-surface">${t('areaPais')}</h2><p class="text-body-md text-on-surface-variant">${t('paisPergunta')} <b class="text-on-surface text-headline-md">${a} × ${b} = ?</b></p>
      <input id="g" inputmode="numeric" autocomplete="off" class="${inputCls} text-center text-headline-md"><div id="e" class="text-label-md text-error min-h-[1.2em]"></div>
      ${btnPrimary('ok', t('continuar'), 'arrow_forward')}<a href="#" id="v" class="block text-label-md text-primary underline">${t('voltar')}</a></div></main>`);
    const go = () => { if (+$('#g').value === a * b) (then || (() => QKParent.open()))(); else { $('#e').textContent = t('errado'); $('#g').value = ''; } };
    $('#ok').onclick = go; $('#g').onkeydown = e => { if (e.key === 'Enter') go(); }; $('#g').focus();
    $('#v').onclick = e => { e.preventDefault(); gateBack(); };
  }

  async function pinPad(kid) {
    theme(kid.estilo, kid.tema);
    let has = true; try { has = await DB.rpc('tem_pin', { crianca: kid.id }); } catch (e) { has = true; }
    if (!has) return openKid(kid);
    let pin = ''; const LL = kid.idioma_app === 'en' ? 'en' : 'pt';
    const draw = msg => {
      view(`<main class="min-h-screen flex items-center justify-center px-margin"><div class="w-full max-w-sm text-center">
        <div class="w-24 h-24 mx-auto rounded-full bg-primary-fixed/60 flex items-center justify-center text-[52px] mb-3">${esc(kid.avatar || '⭐')}</div>
        <h2 class="text-headline-lg-mobile text-on-surface">${esc(kid.apelido)}</h2><p class="text-body-md text-on-surface-variant mb-4">${t('pinTitulo', LL)}</p>
        <div class="flex justify-center gap-4 mb-2">${[0, 1, 2, 3].map(i => `<span class="w-5 h-5 rounded-full border-[3px] border-primary-container ${i < pin.length ? 'bg-primary-container' : ''}"></span>`).join('')}</div>
        <div class="text-label-md text-error min-h-[1.4em] mb-2">${msg || ''}</div>
        <div class="grid grid-cols-3 gap-3 justify-items-center max-w-[280px] mx-auto">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '←', 0, '✓'].map(n => `<button data-n="${n}" class="w-20 h-20 rounded-full bg-surface-container-lowest soft-shadow text-headline-lg text-on-surface active:scale-90 transition">${n === '←' ? I('backspace', 'text-[26px]') : n === '✓' ? I('check', 'text-[28px] text-primary') : n}</button>`).join('')}</div>
        <a href="#" id="v" class="inline-block mt-6 text-label-md text-primary underline">${t('voltar', LL)}</a></div></main>`);
      app().querySelectorAll('[data-n]').forEach(b => b.onclick = async () => {
        const n = b.dataset.n;
        if (n === '←') pin = pin.slice(0, -1); else if (n !== '✓' && pin.length < 4) pin += n;
        if (pin.length === 4) {
          const ok = await DB.rpc('conferir_pin', { crianca: kid.id, pin }).catch(() => false);
          if (ok) return openKid(kid); pin = ''; return draw(t('pinErrado', LL));
        }
        draw();
      });
      $('#v').onclick = e => { e.preventDefault(); picker(); };
    };
    draw();
  }

  /* ================= app da criança ================= */
  let saveT = null;
  A.saveProg = function (now) {
    clearTimeout(saveT);
    const run = () => DB.ins('progresso', { crianca_id: A.kid.id, chave: 'main', dados: A.eng.prog, atualizado_em: new Date().toISOString() }, { upsert: true, onConflict: 'crianca_id,chave' })
      .catch(e => { console.warn(e); toast(L('⚠️ Sem internet: vou tentar salvar de novo.', '⚠️ Offline: will retry saving.')); saveT = setTimeout(run, 8000); });
    if (now) return run(); saveT = setTimeout(run, 1500);
  };
  async function openKid(kid) {
    view('<div class="spin"></div>');
    A.kid = kid; theme(kid.estilo, kid.tema); document.documentElement.lang = kid.idioma_app === 'en' ? 'en' : 'pt-BR';
    try {
      await QKEngine.loadPack(kid.pacote).catch(e => console.warn(e));
      const [prog, lic, sim] = await Promise.all([DB.sel('progresso', { eq: { crianca_id: kid.id, chave: 'main' } }), DB.sel('licoes', { eq: { crianca_id: kid.id }, order: 'criado_em.desc', limit: 60 }), DB.sel('progresso', { eq: { crianca_id: kid.id, chave: 'sim' } }).catch(() => [])]);
      A.eng = new QKEngine(kid, prog[0] && prog[0].dados, lic);
      A.simReq = sim[0] && sim[0].dados && !sim[0].dados.feito ? sim[0].dados : null;
      if (!prog[0]) A.saveProg(true);
      kidHome();
    } catch (x) { toast(x.message); picker(); }
  }
  A.openKid = openKid;

  const level = p => { const pts = p.points || 0; const n = Math.floor(pts / 500) + 1; return { n, into: pts % 500, need: 500 }; };

  function kidHeader(label) {
    const p = A.eng.prog;
    return `<header class="fixed top-0 inset-x-0 z-40 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div class="h-16 px-margin md:px-margin-tablet max-w-5xl mx-auto flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">${logo}<span class="text-headline-md text-on-surface hidden sm:inline">Quest Kids</span><span class="text-label-md text-on-surface-variant truncate hidden sm:inline">${label}</span></div>
        <div class="flex items-center gap-2">
          <span class="flex items-center gap-1 bg-secondary-container/20 px-2.5 py-1 rounded-full">${I('local_fire_department', 'text-secondary text-[18px]', 1)}<span class="text-label-sm text-on-surface font-extrabold">${p.streak || 0}</span></span>
          <span class="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full">${I('monetization_on', 'text-secondary text-[18px]', 1)}<span class="text-label-sm text-on-surface">${p.points || 0}</span></span>
          <button id="lk" title="${L('Área dos pais', 'Parents area')}" aria-label="${L('Área dos pais', 'Parents area')}" class="w-8 h-8 rounded-full flex items-center justify-center text-outline opacity-70">${I('lock', 'text-[18px]')}</button>
          ${themeSwitch('tm', A.kid.tema === 'escuro')}
          <button id="sw" title="${kt('trocar')}" class="w-9 h-9 rounded-full bg-primary-fixed/60 flex items-center justify-center text-[20px] shadow-sm">${esc(A.kid.avatar || '⭐')}</button>
        </div></div></header>`;
  }
  function kidNav(on) {
    const items = [['hoje', 'wb_sunny', kt('hoje')], ['bib', 'auto_stories', kt('biblioteca')], ['prem', 'military_tech', kt('premios')], ['prog', 'insights', kt('progresso')]];
    return `<nav class="fixed bottom-0 inset-x-0 z-40 pb-safe md:bottom-4 md:px-4">
      <div class="bg-surface/90 backdrop-blur-xl shadow-[0_-4px_16px_rgba(20,163,163,0.06)] md:shadow-lg md:rounded-3xl md:max-w-lg md:mx-auto flex justify-around items-center h-20 px-1">
      ${items.map(([k, i, l]) => `<button data-nav="${k}" class="flex flex-col items-center justify-center min-w-[64px] min-h-[56px] gap-1 rounded-2xl transition ${on === k ? 'text-primary' : 'text-on-surface-variant'}">${I(i, 'text-[26px]', on === k)}<span class="text-label-sm">${l}</span></button>`).join('')}
      </div></nav>`;
  }
  function wireNav() {
    app().querySelectorAll('[data-nav]').forEach(b => b.onclick = async () => { if (b.dataset.nav === 'hoje') await refreshKid(); ({ hoje: kidHome, bib: library, prem: rewards, prog: progress })[b.dataset.nav](); });
    const sw = $('#sw'); if (sw) sw.onclick = () => picker();
    const lk = $('#lk'); if (lk) lk.onclick = () => { const cur = (app().querySelector('[data-nav].text-primary') || {}).dataset; const fn = ({ hoje: kidHome, bib: library, prem: rewards, prog: progress })[(cur && cur.nav) || 'hoje']; toParents(async () => { await refreshKid(); fn(); }); };
    const tm = $('#tm'); if (tm) tm.onclick = () => {
      const k = A.kid; k.tema = k.tema === 'escuro' ? 'claro' : 'escuro'; theme(k.estilo, k.tema);
      const cur = (app().querySelector('[data-nav].text-primary') || {}).dataset; ({ hoje: kidHome, bib: library, prem: rewards, prog: progress })[(cur && cur.nav) || 'hoje']();
      DB.upd('criancas', { eq: { id: k.id } }, { tema: k.tema }).catch(e => console.warn(e));
      const kk = A.kids.find(x => x.id === k.id); if (kk) kk.tema = k.tema;
    };
  }
  const pageMain = inner => `<main class="pt-20 pb-32 md:pb-36 px-margin md:px-margin-tablet max-w-5xl mx-auto">${inner}</main>`;

  /* ---------- Hoje ---------- */
  const dayStamp = () => { const d = new Date(); return d.toLocaleDateString(isPt() ? 'pt-BR' : 'en-US', { weekday: 'long', day: '2-digit', month: '2-digit' }) + ' · ' + d.toLocaleTimeString(isPt() ? 'pt-BR' : 'en-US', { hour: '2-digit', minute: '2-digit' }); };
  function kidHome() {
    const e = A.eng, p = e.prog, goal = e.goalMin(), mins = e.minutesToday(), pct = e.dayPct(), stepsN = e.stepsToday(), stepsG = e.goalSteps();
    const next = e.nextReading(); const done = e.goalDone();
    const PP = Object.assign({ leitura: 40, palavras: 25, reforco: 35 }, A.kid.pilares || {}); const tot = PP.leitura + PP.palavras + PP.reforco || 100;
    const day = p.dias[today()] || {}; const pil = day.pil || {};
    const pm = k => Math.max(1, Math.round(goal * PP[k] / tot));
    const pmin = k => Math.min(pm(k), (pil[k] || 0) > 0 ? Math.max(1, Math.round((pil[k] || 0) / 60)) : 0);
    const pp = k => Math.min(100, Math.round(100 * (pil[k] || 0) / Math.max(60, pm(k) * 60)));
    const canPlay = A.planOk();
    const hasAny = next || Object.keys(p.wordbank).length || e.pack || e.licoes.length;
    const lv = level(p);
    const C2 = 414.69;
    const pillar = (k, icon, bg, fg, bar) => `<div class="bg-surface-container-lowest rounded-2xl p-3 md:p-4 shadow-sm flex flex-col items-center text-center">
        <div class="w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-2">${I(icon, `${fg} text-[22px]`, 1)}</div>
        <span class="text-label-md text-on-surface truncate w-full">${kt(k)}</span>
        <span class="text-label-sm text-on-surface-variant mt-0.5 mb-2">${pmin(k)}/${pm(k)} min</span>
        <div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden"><div class="${bar} h-full rounded-full" style="width:${pp(k)}%"></div></div></div>`;
    const greet = `<div class="space-y-3">
        <div class="flex items-center justify-between flex-wrap gap-2">
          ${(() => { const est = e.estimate(21), prev = e.estimate(7, 7), now7 = e.estimate(7); return est === null ? '<span></span>' : `<button id="nota" class="flex items-center gap-1 bg-surface-container-high px-3 py-1 rounded-full text-label-sm text-on-surface">📝 ${L('Nota estimada', 'Est. grade')} <b>${fmtNota(est)}</b>${now7 !== null && prev !== null ? (now7 > prev ? ' <span class="text-primary">↑</span>' : now7 < prev ? ' <span class="text-error">↓</span>' : '') : ''}</button>`; })()}
          <span class="flex items-center gap-1 bg-surface-container-high px-3 py-1 rounded-full">${I('verified', 'text-primary text-[18px]')}<span class="text-label-sm text-on-surface-variant">${kt('nivel')} ${lv.n}</span></span>
        </div>
        <div><h1 class="text-headline-xl-mobile md:text-headline-xl text-on-surface tracking-tight">${kt('ola')}, ${esc(A.kid.apelido)}! 👋</h1>
        <p class="text-body-md text-on-surface-variant">${kt('prontaMissao')}</p></div></div>`;
    const extra = Math.max(0, mins - goal);
    const ring = `<div class="relative w-full bg-surface-container-lowest rounded-3xl p-5 soft-shadow flex flex-col items-center justify-center overflow-hidden">
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary-container/10 rounded-full blur-2xl pointer-events-none"></div>
        <div class="relative flex items-center gap-2 text-on-surface">${I(done ? 'celebration' : 'school', 'text-[22px] text-primary', 1)}<span class="text-headline-md">${kt('licaoHoje')}</span></div>
        <div class="relative w-56 h-56 md:w-60 md:h-60 flex items-center justify-center my-1">
          <svg class="w-full h-full -rotate-90" viewBox="0 0 160 160"><circle class="text-surface-container-high" cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" stroke-width="10"></circle>
          <circle class="text-primary-container transition-all duration-700" cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-dasharray="439.8" stroke-dashoffset="${(439.8 * (1 - Math.max(0.03, pct))).toFixed(1)}"></circle></svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-10">
            ${done ? `<span class="done-stamp">${L('FEITO', 'DONE')} ✅</span><span class="text-label-sm text-on-surface-variant mt-2">${dayStamp()}</span>`
              : `<span class="text-[44px] leading-none font-black text-on-surface">${Math.min(stepsN, stepsG)}<span class="text-[24px] text-on-surface-variant font-extrabold">/${stepsG}</span></span>
            <span class="text-label-md text-primary mt-1">${L('atividades', 'activities')}</span>
            <span class="text-label-sm text-on-surface-variant mt-1 leading-tight">${mins ? L('Continue de onde parou!', 'Pick up where you left off!') : L('Vamos começar?', 'Ready to start?')}</span>`}
          </div></div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-full">${I('timer', 'text-[16px] text-primary')}<span class="text-label-sm text-on-surface">${L('Hoje', 'Today')}: ${mins} min · ${L('meta', 'goal')} ${goal} min${extra ? ` · <b class="text-primary">+${extra} min ${L('extra', 'extra')} ⭐</b>` : ''}</span></div></div>`;
    const adv = next ? `<div class="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex items-center gap-3">
        <div class="w-14 h-14 rounded-xl bg-secondary-fixed/60 overflow-hidden shrink-0 flex items-center justify-center text-3xl">${next.image ? `<img class="w-full h-full object-cover" src="${esc(next.image)}" alt="">` : esc(next.icon || '📖')}</div>
        <div class="flex-1 min-w-0"><div class="flex items-center gap-1.5">${I('stars', 'text-secondary text-[16px]', 1)}<span class="text-label-sm text-secondary uppercase tracking-wider">${L('Aventura do dia', "Today's adventure")}</span></div>
        <h3 class="text-label-lg text-on-surface truncate">${esc(next.title)}</h3>
        <p class="text-body-sm text-on-surface-variant line-clamp-1">${next.kind === 'ai' ? L('Feita com a matéria da sua escola ✨', 'Made from your school material ✨') : L('Leitura, palavras novas e desafios', 'Reading, new words and challenges')}</p></div></div>` : '';
    const cta = !canPlay ? `<div class="bg-secondary-fixed text-on-secondary-fixed rounded-2xl p-4 text-label-lg">${kt('planoVencido')}</div>`
      : !hasAny ? `<div class="bg-surface-container-low rounded-2xl p-4 text-label-lg text-on-surface flex gap-3 items-center">${I('photo_camera', 'text-primary text-[28px]')}<span>${kt('semConteudo')}</span></div>`
      : done ? `${btnPrimary('mais', kt('praticarMais').replace('🔁 ', ''), `<span class="material-symbols-outlined text-[28px] fill">replay</span>`)}${next ? `<div class="h-3"></div>${btnSoft('go', `${kt('comecar')}: ${esc(next.title).slice(0, 40)}`, 'menu_book')}` : ''}`
      : btnPrimary('go', mins ? kt('continuarLicao') : kt('comecar'), `<span class="material-symbols-outlined text-[28px] fill">play_arrow</span>`, 'h-16');
    view(`${kidHeader(kt('hoje'))}${pageMain(`
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8 lg:items-start">
        <div class="space-y-5">${greet}${ring}</div>
        <div class="space-y-5 lg:pt-24">
          <div class="grid grid-cols-3 gap-2.5">${pillar('leitura', 'menu_book', 'bg-tertiary-container/15', 'text-tertiary', 'bg-tertiary-container')}${pillar('palavras', 'spellcheck', 'bg-secondary-container/20', 'text-secondary', 'bg-secondary-container')}${pillar('reforco', 'auto_stories', 'bg-primary-container/15', 'text-primary', 'bg-primary-container')}</div>
          ${A.simReq ? `<button id="simgo" class="w-full text-left bg-tertiary-fixed text-on-tertiary-fixed rounded-2xl p-4 flex items-center gap-3 shadow-sm"><span class="text-[30px]">📝</span><span class="flex-1"><b class="text-label-lg block">${L('Simulado dos seus pais', 'Practice test from your parents')}</b><span class="text-body-sm">${A.simReq.n} ${L('perguntas', 'questions')}${A.simReq.tempo ? ` · ${A.simReq.tempo} min` : ''}</span></span>${I('chevron_right', 'text-[24px]')}</button>` : ''}
          ${adv}
          <div class="pt-1 space-y-3">${cta}
            <div class="flex items-center justify-center gap-1.5 text-center px-4 py-1"><span class="text-body-sm text-on-surface-variant">${done ? L(`Sequência de <strong class="text-on-surface">${p.streak || 0} ${(p.streak || 0) === 1 ? 'dia' : 'dias'}</strong>! Volte amanhã 🔥`, `<strong class="text-on-surface">${p.streak || 0}-day</strong> streak! Come back tomorrow 🔥`) : L(`Complete hoje para manter sua sequência de <strong class="text-on-surface">${p.streak || 0} ${(p.streak || 0) === 1 ? 'dia' : 'dias'}</strong>!`, `Finish today to keep your <strong class="text-on-surface">${p.streak || 0}-day</strong> streak!`)}</span><span>🌟</span></div>
          </div></div></div>`)}${kidNav('hoje')}`);
    wireNav();
    const go = $('#go'); if (go) go.onclick = () => runLesson({});
    const m = $('#mais'); if (m) m.onclick = () => runLesson({ more: true });
    const nb = $('#nota'); if (nb) nb.onclick = notaScreen;
    const sg = $('#simgo'); if (sg) sg.onclick = () => runSim({ n: A.simReq.n, tempo: A.simReq.tempo, licoes: A.simReq.licoes, pais: true });
  }
  A.kidHome = kidHome;

  /* ---------- Biblioteca ---------- */
  function library(q) {
    const e = A.eng; q = (q || '').toLowerCase();
    const reads = e.doneReadings().reverse().filter(r => !q || r.title.toLowerCase().includes(q));
    const next = e.nextReading();
    const words = Object.entries(e.prog.wordbank).sort((a, b) => String(b[1].added).localeCompare(String(a[1].added))).filter(([w]) => !q || w.includes(q));
    const grads = ['from-primary-container to-primary', 'from-tertiary-container to-tertiary', 'from-secondary-container to-secondary'];
    view(`${kidHeader(kt('biblioteca'))}${pageMain(`
      <div class="relative flex items-center w-full mt-2"><div class="absolute left-4 text-primary">${I('search', 'text-[24px]')}</div>
        <input id="busca" type="search" value="${esc(q)}" placeholder="${L('Buscar leituras e palavras…', 'Search readings and words…')}" class="w-full h-14 pl-12 pr-4 bg-surface-container-lowest rounded-full text-body-md text-on-surface placeholder:text-outline shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-fixed"></div>
      ${next ? `<section class="mt-5"><div class="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-4 md:p-5 shadow-sm">
        <div class="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-primary-fixed/20 pointer-events-none"></div>
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm mb-3">${I('auto_stories', 'text-[16px]')} ${L('Próxima leitura', 'Up next')}</span>
        <div class="flex gap-3.5 items-center"><div class="w-20 h-24 rounded-xl bg-gradient-to-br from-primary-container to-primary flex-shrink-0 flex items-center justify-center text-on-primary shadow-sm text-4xl overflow-hidden">${next.image ? `<img class="w-full h-full object-cover" src="${esc(next.image)}">` : esc(next.icon || '📖')}</div>
          <div class="flex-1 min-w-0"><h2 class="text-headline-md text-on-surface line-clamp-2">${esc(next.title)}</h2><p class="text-body-sm text-on-surface-variant mt-0.5">${next.pages.length ? `${next.pages.length} ${L('página(s)', 'page(s)')} · ` : ''}${next.questions.length} ${L('perguntas', 'questions')}</p></div></div>
        <button id="ler" class="btn3d-sm w-full mt-4 h-12 rounded-xl bg-primary-container text-on-primary text-label-lg flex items-center justify-center gap-2"><span>${L('Começar a ler', 'Start reading')}</span>${I('arrow_forward', 'text-[20px]')}</button></div></section>` : ''}
      <section class="mt-7"><div class="flex items-end justify-between mb-3"><div><h2 class="text-headline-lg-mobile text-on-surface">${kt('minhasLeituras')}</h2><p class="text-body-sm text-on-surface-variant">${L('Leia de novo quando quiser', 'Read again anytime')}</p></div></div>
        ${reads.length ? `<div class="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-margin px-margin md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible">${reads.map((r, i) => { const c = e.prog.completed[r.id] || {}; return `<div class="w-60 md:w-auto flex-shrink-0 bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm flex flex-col justify-between">
            <div class="w-full h-32 rounded-xl bg-gradient-to-br ${grads[i % 3]} flex items-center justify-center relative overflow-hidden">${r.image ? `<img class="w-full h-full object-cover" src="${esc(r.image)}">` : `<span class="text-5xl -rotate-12 drop-shadow-md">${esc(r.icon || '📖')}</span>`}
              <div class="absolute top-2.5 left-2.5 bg-surface-container-lowest/90 px-2.5 py-0.5 rounded-full text-label-sm text-on-surface">${'⭐'.repeat(Math.min(3, Math.ceil((c.stars || 0) * 3 / 5))) || '—'}</div></div>
            <h3 class="text-label-lg text-on-surface mt-3 line-clamp-2">${esc(r.title)}</h3>
            <div class="flex items-center justify-between mt-3 bg-surface-container-low rounded-xl px-3 py-2"><span class="text-body-sm text-on-surface-variant">${c.pct != null ? c.pct + '%' : ''}</span>
              <button data-r="${esc(r.id)}" class="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center active:scale-90 shadow-sm" aria-label="${kt('lerDeNovo')}">${I('replay', 'text-[20px]')}</button></div></div>`; }).join('')}</div>`
        : `<p class="text-body-md text-on-surface-variant bg-surface-container-low rounded-2xl p-4">${L('As leituras que você terminar aparecem aqui.', 'Readings you finish show up here.')}</p>`}</section>
      <section class="mt-7"><h2 class="text-headline-lg-mobile text-on-surface mb-3">${kt('minhasPalavras')} <span class="text-label-md text-on-surface-variant">(${words.length})</span></h2>
        ${words.length ? `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">${words.map(([w, x]) => `<div class="bg-surface-container-lowest rounded-2xl p-4 shadow-sm"><div class="flex items-center justify-between gap-2"><b class="text-label-lg text-on-surface">${esc(w)}</b><span class="flex gap-0.5">${[1, 2, 3, 4, 5, 6].map(i => `<span class="w-1.5 h-1.5 rounded-full ${i <= (x.box || 1) ? 'bg-primary-container' : 'bg-surface-container-high'}"></span>`).join('')}</span></div><p class="text-body-sm text-on-surface-variant mt-1">${esc(e.defs[w] || x.def || '')}</p></div>`).join('')}</div>`
        : `<p class="text-body-md text-on-surface-variant bg-surface-container-low rounded-2xl p-4">${kt('semPalavras')}</p>`}</section>`)}${kidNav('bib')}`);
    wireNav();
    const bs = $('#busca'); bs.onchange = () => library(bs.value); bs.onkeydown = ev => { if (ev.key === 'Enter') library(bs.value); };
    const ler = $('#ler'); if (ler) ler.onclick = () => runLesson({});
    app().querySelectorAll('[data-r]').forEach(b => b.onclick = () => { if (!A.planOk()) return toast(kt('planoVencido')); const it = e.readingList().find(x => x.id === b.dataset.r); runLesson({ reading: e.reading(it), redo: true }); });
  }

  /* ---------- Prêmios ---------- */
  /* ---------- simulado e nota estimada ---------- */
  const DISC_KID = () => L('É só uma estimativa, feita com as perguntas do app 😊', "It's just an estimate, based on the app's questions 😊");
  const fmtNota = n => n === null || n === undefined ? '—' : (Math.round(n * 10) / 10).toFixed(1).replace('.', isPt() ? ',' : '.');
  async function runSim(cfg) {
    if (!A.planOk()) return toast(kt('planoVencido'));
    const e = A.eng; const S = e.startSession({ simulado: cfg });
    if (!S.cap) { toast(L('Ainda não há perguntas para um simulado. Faça algumas lições primeiro!', 'No questions for a practice test yet. Do some lessons first!')); return kidHome(); }
    Ls = { t0: Date.now(), hidden: 0, hidAt: null, step: null, n: 0 };
    view(`<main class="min-h-[100dvh] flex flex-col items-center justify-center text-center px-margin max-w-md mx-auto gap-4"><div class="text-[64px]">📝</div>
      <h1 class="text-headline-xl-mobile text-on-surface">${L('Simulado', 'Practice test')}</h1>
      <p class="text-body-lg text-on-surface-variant">${S.cap} ${L('perguntas', 'questions')}${cfg.tempo ? ` · ${cfg.tempo} min` : ''}. ${L('Como numa prova: você só vê o resultado no final.', 'Like a real test: you see the result at the end.')}</p>
      <p class="text-body-sm text-on-surface-variant">${DISC_KID()}</p>
      <button id="bora" class="btn3d w-full h-14 rounded-2xl bg-primary-container text-on-primary text-headline-md">${L('Começar', 'Start')} 🚀</button>
      <button id="nao" class="text-label-md text-on-surface-variant underline">${L('Agora não', 'Not now')}</button></main>`);
    $('#bora').onclick = () => { Ls.t0 = Date.now(); nextStep(); };
    $('#nao').onclick = () => { e.s = null; Ls = null; kidHome(); };
  }
  function simResult(S, r) {
    const e = A.eng, nota = r.total ? Math.round(100 * r.right / r.total) / 10 : 0, mins = Math.max(1, Math.round(S.sec / 60));
    const sims = e.prog.sims || [], prev = sims.length > 1 ? sims[sims.length - 2] : null;
    const wrong = S.items.filter(i => i.correct === false).map(i => e.question(i.qid)).filter(Boolean).slice(0, 8);
    if (A.simReq) { DB.ins('progresso', { crianca_id: A.kid.id, chave: 'sim', dados: Object.assign({}, A.simReq, { feito: true, nota, em: new Date().toISOString() }), atualizado_em: new Date().toISOString() }, { upsert: true, onConflict: 'crianca_id,chave' }).catch(() => {}); A.simReq = null; }
    sfx(nota >= 7 ? 'done' : 'ok');
    view(`<main class="pt-10 pb-10 px-margin max-w-2xl mx-auto space-y-5">
      <div class="text-center"><span class="text-label-md text-on-surface-variant uppercase tracking-wider">📝 ${L('Resultado do simulado', 'Practice test result')}</span>
        <div class="mx-auto mt-3 w-36 h-36 rounded-full ${nota >= 7 ? 'bg-primary-container text-on-primary' : nota >= 5 ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'} flex flex-col items-center justify-center shadow-lg"><span class="text-[46px] font-black leading-none">${fmtNota(nota)}</span><span class="text-label-sm">${L('de 10', 'out of 10')}</span></div>
        <p class="text-headline-md text-on-surface mt-3">${nota >= 9 ? L('Incrível! 🌟', 'Amazing! 🌟') : nota >= 7 ? L('Muito bem! 🎉', 'Well done! 🎉') : nota >= 5 ? L('Bom começo! 💪', 'Good start! 💪') : L('Vamos treinar mais! 💪', "Let's practice more! 💪")}</p>
        <p class="text-body-md text-on-surface-variant">${r.right} ${L('de', 'of')} ${r.total} ${L('certas', 'right')} · ⏱️ ${mins} min${prev ? ` · ${L('antes', 'before')}: ${fmtNota(prev.nota)} ${nota > prev.nota ? '↑' : nota < prev.nota ? '↓' : '='}` : ''}</p>
        <p class="text-body-sm text-on-surface-variant mt-1">${DISC_KID()}</p></div>
      ${wrong.length ? `<section class="space-y-2"><h2 class="text-headline-md text-on-surface">${L('Para revisar', 'To review')}</h2>${wrong.map(q => `<div class="bg-surface-container-lowest rounded-2xl p-4 shadow-sm"><p class="text-label-lg text-on-surface">${md(q.prompt)}</p><p class="text-body-md text-primary mt-1">✓ ${md(e.answerText(q))}</p>${q.explain ? `<p class="text-body-sm text-on-surface-variant mt-1">${md(q.explain)}</p>` : ''}</div>`).join('')}</section>` : ''}
      ${btnPrimary('home', L('Voltar', 'Back'), `<span class="material-symbols-outlined text-[26px]">home</span>`)}</main>`);
    $('#home').onclick = () => kidHome();
  }
  function notaScreen() {
    const e = A.eng, p = e.prog, est = e.estimate(21);
    const weeks = []; for (let w = 5; w >= 0; w--) weeks.push(e.estimate(7, w * 7));
    const sims = (p.sims || []).slice(-6);
    const pts = weeks.map((v, i) => v === null ? null : [20 + i * 52, 110 - v * 9]).filter(Boolean);
    view(`${kidHeader(L('Minha nota', 'My grade'))}${pageMain(`<div class="max-w-xl mx-auto space-y-5 mt-2">
      <button id="bk" class="inline-flex items-center gap-1 text-label-md text-primary">${I('arrow_back', 'text-[20px]')} ${kt('progresso')}</button>
      <section class="bg-surface-container-lowest rounded-3xl p-5 soft-shadow text-center">
        <p class="text-label-md text-on-surface-variant uppercase tracking-wider">${L('Nota estimada', 'Estimated grade')}</p>
        <p class="text-[56px] font-black text-on-surface leading-tight">${fmtNota(est)}<span class="text-headline-md text-on-surface-variant">/10</span></p>
        <p class="text-body-sm text-on-surface-variant">${est === null ? L('Faça algumas lições ou um simulado para ver sua nota.', 'Do some lessons or a practice test to see your grade.') : DISC_KID()}</p>
        ${pts.length > 1 ? `<svg viewBox="0 0 300 120" class="w-full h-28 mt-3"><polyline fill="none" stroke="rgb(var(--c-primary-container))" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="${pts.map(x => x.join(',')).join(' ')}"/>${pts.map(x => `<circle cx="${x[0]}" cy="${x[1]}" r="5" fill="rgb(var(--c-primary))"/>`).join('')}</svg><p class="text-label-sm text-on-surface-variant">${L('Sua nota nas últimas semanas', 'Your grade in recent weeks')}</p>` : ''}
      </section>
      ${A.simReq ? `<div class="bg-tertiary-fixed text-on-tertiary-fixed rounded-2xl p-4 flex items-center gap-3"><span class="text-[28px]">📝</span><span class="flex-1 text-label-lg">${L('Seus pais prepararam um simulado!', 'Your parents set up a practice test!')}</span></div>` : ''}
      <section class="bg-surface-container-lowest rounded-3xl p-5 soft-shadow space-y-3"><h2 class="text-headline-md text-on-surface">${L('Fazer um simulado', 'Take a practice test')}</h2>
        <p class="text-body-sm text-on-surface-variant">${L('Quantas perguntas?', 'How many questions?')}</p>
        <div class="grid grid-cols-3 gap-2">${[5, 10, 15].map(n => `<button data-sn="${n}" class="h-14 rounded-2xl bg-surface-container text-headline-md text-on-surface">${n}</button>`).join('')}</div>
        ${A.simReq ? `<button id="simreq" class="btn3d w-full h-14 rounded-2xl bg-primary-container text-on-primary text-label-lg">${L('Fazer o simulado dos meus pais', "Take my parents' test")} (${A.simReq.n} · ${A.simReq.tempo ? A.simReq.tempo + ' min' : L('sem tempo', 'no timer')})</button>` : ''}</section>
      ${sims.length ? `<section class="bg-surface-container-lowest rounded-3xl p-5 soft-shadow"><h2 class="text-headline-md text-on-surface mb-2">${L('Meus simulados', 'My practice tests')}</h2>${sims.slice().reverse().map(x => `<div class="flex items-center justify-between py-2 border-b border-surface-container-high last:border-0"><span class="text-body-md text-on-surface">${new Date(x.d + 'T12:00').toLocaleDateString(isPt() ? 'pt-BR' : 'en-US', { day: '2-digit', month: 'short' })} · ${x.n} ${L('perguntas', 'questions')}</span><b class="text-label-lg ${x.nota >= 7 ? 'text-primary' : 'text-secondary'}">${fmtNota(x.nota)}</b></div>`).join('')}</section>` : ''}
    </div>`)}${kidNav('prog')}`);
    wireNav(); $('#bk').onclick = progress;
    app().querySelectorAll('[data-sn]').forEach(b => b.onclick = () => runSim({ n: +b.dataset.sn }));
    const sr = $('#simreq'); if (sr) sr.onclick = () => runSim({ n: A.simReq.n, tempo: A.simReq.tempo, licoes: A.simReq.licoes, pais: true });
  }

  // como ganhar cada medalha e quanto falta [atual, meta]
  function badgeGoal(k, p) {
    const n = { first: [Object.keys(p.completed).length, 1], streak3: [p.streak || 0, 3], streak7: [p.streak || 0, 7], pts100: [p.points || 0, 100], pts500: [p.points || 0, 500], pts1000: [p.points || 0, 1000], wordwiz: [Object.keys(p.wordbank).length, 25], reader10: [Object.keys(p.completed).length, 10] }[k];
    return n ? [Math.min(n[0], n[1]), n[1]] : null;
  }
  const BADGE_HOW = {
    first: ['Termine sua primeira lição.', 'Finish your first lesson.'], perfect: ['Acerte tudo de primeira numa lição (5 perguntas ou mais).', 'Get everything right on the first try in a lesson (5+ questions).'],
    streak3: ['Estude 3 dias seguidos.', 'Study 3 days in a row.'], streak7: ['Estude 7 dias seguidos.', 'Study 7 days in a row.'],
    pts100: ['Junte 100 moedas.', 'Collect 100 coins.'], pts500: ['Junte 500 moedas.', 'Collect 500 coins.'], pts1000: ['Junte 1000 moedas. Você é realeza! 👑', 'Collect 1000 coins. Royalty! 👑'],
    wordwiz: ['Aprenda 25 palavras novas.', 'Learn 25 new words.'], reader10: ['Leia 10 textos até o fim.', 'Read 10 texts to the end.'],
    fluent: ['Leia em voz alta com muita fluência.', 'Read aloud very fluently.'], explorer: ['Experimente todos os tipos de atividade.', 'Try every kind of activity.'], comeback: ['Volte a estudar depois de uns dias sem estudar. Recomeçar é coragem!', 'Come back after a few days off. Starting again takes courage!']
  };
  function badgeSheet(k) {
    const p = A.eng.prog, v = QKEngine.BADGES[k], on = p.badges.includes(k), g = badgeGoal(k, p), how = BADGE_HOW[k] || ['', ''];
    const box = document.createElement('div');
    box.className = 'fixed inset-0 z-50 bg-black/45 flex items-end sm:items-center justify-center p-4';
    box.innerHTML = `<div class="w-full max-w-sm bg-surface-container-lowest rounded-3xl p-6 text-center shadow-xl badge-pop">
      <div class="mx-auto w-24 h-24 rounded-full ${on ? 'bg-secondary-fixed badge-glow' : 'bg-surface-container'} flex items-center justify-center text-[54px] ${on ? '' : 'grayscale opacity-60'}">${v[0]}</div>
      <h3 class="text-headline-md text-on-surface mt-3">${v[isPt() ? 1 : 2]}</h3>
      <p class="text-label-lg ${on ? 'text-primary' : 'text-on-surface-variant'} mt-1">${on ? L('Você já ganhou esta medalha! 🎉', 'You earned this badge! 🎉') : L('Ainda não ganhou', 'Not earned yet')}</p>
      <p class="text-body-md text-on-surface mt-3 bg-surface-container-low rounded-2xl p-3"><b>${L('Como ganhar:', 'How to earn:')}</b> ${how[isPt() ? 0 : 1]}</p>
      ${!on && g ? `<div class="mt-3"><div class="flex justify-between text-label-sm text-on-surface-variant mb-1"><span>${L('Seu progresso', 'Your progress')}</span><span class="text-primary">${g[0]} / ${g[1]}</span></div><div class="h-3 bg-surface-container rounded-full overflow-hidden"><div class="h-full bg-primary-container rounded-full" style="width:${Math.round(100 * g[0] / g[1])}%"></div></div><p class="text-label-sm text-on-surface-variant mt-1.5">${L(`Faltam ${g[1] - g[0]}!`, `${g[1] - g[0]} to go!`)}</p></div>` : ''}
      <button class="btn3d mt-5 w-full h-12 rounded-2xl bg-primary-container text-on-primary text-label-lg" data-close>${on ? L('Legal!', 'Cool!') : L('Vou conseguir! 💪', "I'll get it! 💪")}</button></div>`;
    document.body.appendChild(box); sfx(on ? 'badge' : 'tap');
    box.onclick = e => { if (e.target === box || e.target.closest('[data-close]')) box.remove(); };
  }
  function rewards() {
    const p = A.eng.prog, B = QKEngine.BADGES, LI = isPt() ? 1 : 2, lv = level(p);
    const got = Object.keys(B).filter(k => p.badges.includes(k)).length;
    const nextBadges = [
      ['streak7', 'local_fire_department', L('7 dias seguidos', '7-day streak'), p.streak || 0, 7],
      ['wordwiz', 'spellcheck', L('25 palavras', '25 words'), Object.keys(p.wordbank).length, 25],
      ['reader10', 'menu_book', L('10 leituras', '10 readings'), Object.keys(p.completed).length, 10],
      ['pts1000', 'monetization_on', L('1000 moedas', '1000 coins'), p.points || 0, 1000]
    ].filter(x => !p.badges.includes(x[0])).slice(0, 2);
    view(`${kidHeader(kt('premios'))}${pageMain(`
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8 mt-2">
      <div class="space-y-5">
      <section class="bg-surface-container-lowest rounded-3xl p-5 soft-shadow flex flex-col gap-4 relative overflow-hidden">
        <div class="absolute -top-12 -right-12 w-36 h-36 bg-secondary-fixed-dim/20 rounded-full blur-2xl pointer-events-none"></div>
        <div class="flex items-center gap-3 relative"><div class="relative flex-shrink-0"><div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-fixed to-secondary-fixed-dim flex items-center justify-center text-3xl shadow-md">🧭</div>
          <div class="absolute -bottom-1 -right-1 bg-primary text-on-primary text-label-sm px-1.5 py-0.5 rounded-full">${lv.n}</div></div>
          <div class="min-w-0"><span class="text-label-sm uppercase tracking-wider text-primary">${L('Nível atual', 'Current level')} · ${L('faltam', '')} ${lv.need - lv.into} ${L('moedas', 'coins to go')}</span>
          <h2 class="text-headline-md text-on-surface truncate">${[L('Explorador iniciante', 'Rookie explorer'), L('Pequeno desbravador', 'Little trailblazer'), L('Aventureiro', 'Adventurer'), L('Mestre explorador', 'Master explorer')][Math.min(3, Math.floor((lv.n - 1) / 3))]}</h2></div></div>
        <div class="relative"><div class="flex justify-between text-label-sm text-on-surface-variant mb-1.5"><span>${L('Progresso para o nível', 'Progress to level')} ${lv.n + 1}</span><span class="text-primary">${lv.into} / ${lv.need}</span></div>
          <div class="w-full h-3.5 bg-surface-container rounded-full overflow-hidden p-0.5"><div class="h-full bg-gradient-to-r from-primary-container to-primary rounded-full" style="width:${Math.round(100 * lv.into / lv.need)}%"></div></div></div>
        <div class="grid grid-cols-3 gap-2 relative">
          ${[['🏆', `${got}<span class="text-label-sm text-on-surface-variant">/${Object.keys(B).length}</span>`, L('Medalhas', 'Badges')], ['🔥', p.streak || 0, L('Dias seguidos', 'Day streak')], ['⭐', p.points || 0, kt('moedas')]].map(([e2, n, l]) => `<div class="bg-surface-container-low rounded-2xl p-2.5 flex flex-col items-center text-center gap-1"><div class="w-9 h-9 rounded-xl bg-secondary-fixed/50 flex items-center justify-center text-lg">${e2}</div><span class="text-headline-md text-on-surface leading-none">${n}</span><span class="text-label-sm text-on-surface-variant">${l}</span></div>`).join('')}</div>
      </section>
      ${nextBadges.length ? `<section class="space-y-3"><div class="flex items-center gap-2"><span class="text-xl">🏃</span><h3 class="text-headline-md text-on-surface">${L('Quase lá!', 'Almost there!')}</h3></div>
        ${nextBadges.map(([k, ic, name, v, max]) => `<div class="bg-surface-container-lowest rounded-3xl p-4 soft-shadow space-y-3"><div class="flex items-start gap-3"><div class="w-12 h-12 rounded-2xl bg-tertiary-container/20 text-tertiary flex items-center justify-center flex-shrink-0">${I(ic, 'text-[28px]', 1)}</div>
          <div class="flex-1 min-w-0"><div class="flex items-center justify-between gap-2"><h4 class="text-label-lg text-on-surface truncate">${B[k][0]} ${name}</h4><span class="text-label-sm text-primary bg-primary-fixed/40 px-2 py-0.5 rounded-full">${Math.min(v, max)} / ${max}</span></div></div></div>
          <div class="w-full h-2.5 bg-surface-container rounded-full overflow-hidden"><div class="h-full bg-primary-container rounded-full" style="width:${Math.min(100, Math.round(100 * v / max))}%"></div></div></div>`).join('')}</section>` : ''}
      </div>
      <div class="space-y-5">
      <section><h3 class="text-headline-md text-on-surface mb-3">${kt('medalhas')}</h3>
        <p class="text-body-sm text-on-surface-variant -mt-2 mb-3">${L('Toque numa medalha para ver como ganhar 👆', 'Tap a badge to see how to earn it 👆')}</p>
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">${Object.entries(B).map(([k, v]) => { const on = p.badges.includes(k), g = badgeGoal(k, p); return `<button data-bd="${k}" class="badge-card rounded-2xl p-3 flex flex-col items-center text-center gap-1 active:scale-95 transition ${on ? 'bg-surface-container-lowest soft-shadow ring-2 ring-secondary-container/60' : 'bg-surface-container-low'}"><span class="text-3xl ${on ? 'badge-shine' : 'opacity-40 grayscale'}">${v[0]}</span><span class="text-label-sm text-on-surface leading-tight ${on ? '' : 'opacity-70'}">${v[LI]}</span>${on ? `<span class="text-[11px] text-primary font-extrabold">✓ ${L('Ganhou!', 'Earned!')}</span>` : g ? `<span class="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-0.5"><span class="block h-full bg-primary-container rounded-full" style="width:${Math.min(100, Math.round(100 * g[0] / g[1]))}%"></span></span>` : I('lock', 'text-[14px] text-outline')}</button>`; }).join('')}</div></section>
      ${(p.awards || []).length ? `<section><h3 class="text-headline-md text-on-surface mb-3">${kt('certificados')}</h3><div class="space-y-3">${p.awards.map(a => `<div class="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex gap-3"><span class="text-3xl">${esc(a.icon || '🏆')}</span><div class="min-w-0"><b class="text-label-lg text-on-surface block">${esc(a.title)}</b><p class="text-body-sm text-on-surface-variant">${esc(a.msg || '')}</p></div></div>`).join('')}</div></section>` : ''}
      </div></div>`)}${kidNav('prem')}`);
    app().querySelectorAll('[data-bd]').forEach(b => b.onclick = () => badgeSheet(b.dataset.bd));
    wireNav();
  }

  /* ---------- Progresso ---------- */
  // palavras por fase: começando (caixa 1-2), desenvolvendo (3-4), dominadas (5-6)
  const wordPhases = p => { const ph = { comecando: [], desenvolvendo: [], dominadas: [] }; Object.entries(p.wordbank || {}).forEach(([w, x]) => { const b = (x && x.box) || 1; (b >= 5 ? ph.dominadas : b >= 3 ? ph.desenvolvendo : ph.comecando).push([w, x]); }); return ph; };
  A.wordPhases = wordPhases;
  function sheet(html) {
    const box = document.createElement('div');
    box.className = 'fixed inset-0 z-50 bg-black/45 flex items-end sm:items-center justify-center p-0 sm:p-4';
    box.innerHTML = `<div class="w-full sm:max-w-lg max-h-[85vh] overflow-y-auto bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl p-5 pb-8 shadow-xl badge-pop"><div class="flex justify-end -mt-1 -mr-1"><button data-close class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">${I('close', 'text-[22px]')}</button></div>${html}</div>`;
    document.body.appendChild(box); box.onclick = e => { if (e.target === box || e.target.closest('[data-close]')) box.remove(); };
    return box;
  }
  function progress() {
    const e = A.eng, p = e.prog, goal = e.goalMin(); const days = [];
    for (let i = 6; i >= 0; i--) { const d = addDays(today(), -i); days.push([d, Math.round(((p.dias[d] || {}).seg || 0) / 60)]); }
    const max = Math.max(goal, ...days.map(x => x[1]), 1);
    const wk = isPt() ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const sk = Object.entries(p.skills).filter(([, v]) => v.right + v.wrong > 0).sort((a, b) => (b[1].right + b[1].wrong) - (a[1].right + a[1].wrong));
    const tot = days.reduce((s, x) => s + x[1], 0);
    const ph = wordPhases(p), est = e.estimate(21);
    // acertos dos últimos 14 dias
    const acc = []; for (let i = 13; i >= 0; i--) { const x = p.dias[addDays(today(), -i)]; acc.push(x && x.q ? Math.round(100 * (x.ok || 0) / x.q) : null); }
    const ap = acc.map((v, i) => v === null ? null : [10 + i * 21.5, 95 - v * 0.85]).filter(Boolean);
    // calendário: últimos 28 dias
    const cal = []; for (let i = 27; i >= 0; i--) { const d = addDays(today(), -i), x = p.dias[d] || {}; cal.push([d, x.seg ? ((x.seg / 60 >= goal) || ((x.q || 0) + (x.pg || 0)) >= e.goalSteps() ? 2 : 1) : 0]); }
    const cur = e.licoes.find(l => l.foco) || e.licoes.find(l => l.modo_prova) || e.licoes[0];
    const sample = cur ? shuffle((cur.questions || []).filter(q => q.pilar !== 'leitura')).slice(0, 3).map(q => (q.vars ? e.question(e.variant(q)) : q)).filter(Boolean) : [];
    view(`${kidHeader(kt('progresso'))}${pageMain(`
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8 mt-2">
      <div class="space-y-5">
      <button id="minhanota" class="w-full text-left bg-surface-container-lowest rounded-3xl p-5 soft-shadow flex items-center gap-4">
        <div class="w-16 h-16 rounded-2xl bg-primary-container text-on-primary flex flex-col items-center justify-center shrink-0"><span class="text-headline-md font-black leading-none">${fmtNota(est)}</span><span class="text-[10px]">/10</span></div>
        <div class="flex-1 min-w-0"><b class="text-headline-md text-on-surface block">📝 ${L('Minha nota', 'My grade')}</b><span class="text-body-sm text-on-surface-variant">${L('Ver evolução e fazer um simulado', 'See progress and take a practice test')}</span></div>${I('chevron_right', 'text-[26px] text-outline')}</button>
      ${cur ? `<section class="bg-surface-container-lowest rounded-3xl p-5 soft-shadow space-y-3">
        <div class="flex items-center gap-2 flex-wrap"><span class="text-[26px]">${esc(cur.icone || '📸')}</span><h2 class="text-headline-md text-on-surface flex-1 min-w-0">${L('O que estou estudando', "What I'm studying")}</h2>${cur.modo_prova ? `<span class="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm">📝 ${L('Prova', 'Test')}${cur.data_prova ? ' ' + new Date(cur.data_prova + 'T12:00').toLocaleDateString(isPt() ? 'pt-BR' : 'en-US', { day: '2-digit', month: 'short' }) : ''}</span>` : ''}</div>
        <p class="text-label-lg text-primary">${esc(cur.titulo || (cur.passage && cur.passage.title) || '')}</p>
        ${sample.length ? `<p class="text-label-sm text-on-surface-variant uppercase tracking-wider">${L('Algumas perguntas que estão caindo', 'Some questions you are getting')}</p><ul class="space-y-2">${sample.map(q => `<li class="bg-surface-container-low rounded-xl p-3 text-body-md text-on-surface">${md(q.prompt)}</li>`).join('')}</ul>` : ''}
        <p class="text-body-sm text-on-surface-variant flex gap-2">${I('family_restroom', 'text-[18px] text-primary shrink-0')} ${L('Achou algo estranho? Seus pais têm todas as perguntas e respostas para revisar com você.', 'Something looks off? Your parents have all questions and answers to review with you.')}</p></section>` : ''}
      <section class="bg-surface-container-lowest rounded-3xl p-5 soft-shadow space-y-4">
        <div class="flex items-start justify-between gap-2"><div><h2 class="text-headline-md text-on-surface">${kt('semanaMin')}</h2><p class="text-body-sm text-on-surface-variant">${tot} min ${L('nos últimos 7 dias', 'in the last 7 days')}</p></div>
          <span class="flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded-full text-label-sm text-on-surface"><span class="w-2.5 h-2.5 rounded-full bg-primary-container"></span>${L('Meta', 'Goal')}: ${goal} min</span></div>
        <div class="grid grid-cols-7 gap-2">${days.map(([d, m]) => `<div class="flex flex-col items-center gap-1"><span class="text-label-sm ${m >= goal ? 'text-primary' : 'text-on-surface-variant'}">${m}</span>
          <div class="h-28 w-full flex items-end justify-center"><div class="w-full max-w-[30px] rounded-t-lg ${m >= goal ? 'bg-primary-container' : 'bg-tertiary-container/70'}" style="height:${Math.max(3, Math.round(100 * m / max))}%"></div></div><span class="text-label-sm text-outline">${wk[new Date(d + 'T12:00').getDay()]}</span></div>`).join('')}</div>
      </section>
      <section class="bg-surface-container-lowest rounded-3xl p-5 soft-shadow space-y-3"><h2 class="text-headline-md text-on-surface">🔥 ${L('Meus dias de estudo', 'My study days')}</h2>
        <div class="grid grid-cols-7 gap-1.5">${cal.map(([d, v]) => `<div title="${d}" class="aspect-square rounded-lg flex items-center justify-center text-[11px] font-bold ${v === 2 ? 'bg-primary-container text-on-primary' : v === 1 ? 'bg-primary-container/35 text-on-surface' : 'bg-surface-container text-outline'} ${d === today() ? 'ring-2 ring-secondary-container' : ''}">${+d.slice(8)}</div>`).join('')}</div>
        <p class="text-label-sm text-on-surface-variant flex gap-3 flex-wrap"><span><span class="inline-block w-3 h-3 rounded bg-primary-container align-middle"></span> ${L('meta feita', 'goal done')}</span><span><span class="inline-block w-3 h-3 rounded bg-primary-container/35 align-middle"></span> ${L('estudou um pouco', 'studied a bit')}</span></p></section>
      </div>
      <div class="space-y-5">
        <div class="grid grid-cols-3 gap-3">${[['words', 'spellcheck', Object.keys(p.wordbank).length, kt('palavras'), 'text-secondary'], ['reads', 'menu_book', Object.keys(p.completed).length, L('Leituras', 'Readings'), 'text-tertiary'], ['streak', 'local_fire_department', p.bestStreak || 0, L('Recorde', 'Best streak'), 'text-secondary']].map(([k, ic, n, l, c]) => `<button data-pk="${k}" class="bg-surface-container-lowest rounded-2xl p-4 shadow-sm text-center active:scale-95 transition">${I(ic, `${c} text-[24px]`, 1)}<div class="text-headline-lg-mobile text-on-surface">${n}</div><div class="text-label-sm text-on-surface-variant">${l}</div></button>`).join('')}</div>
        <section class="bg-surface-container-lowest rounded-3xl p-5 soft-shadow space-y-3"><h2 class="text-headline-md text-on-surface">🔤 ${L('Minhas palavras', 'My words')}</h2>
          <div class="grid grid-cols-3 gap-2">${[['comecando', '🌱', L('Começando', 'Starting')], ['desenvolvendo', '🌿', L('Treinando', 'Practicing')], ['dominadas', '🌳', L('Dominadas', 'Mastered')]].map(([k, em, n]) => `<button data-wp="${k}" class="rounded-2xl bg-surface-container-low p-3 text-center active:scale-95 transition"><div class="text-[26px]">${em}</div><div class="text-headline-md text-on-surface">${ph[k].length}</div><div class="text-label-sm text-on-surface-variant">${n}</div></button>`).join('')}</div>
          <p class="text-body-sm text-on-surface-variant">${L('Toque para ver as palavras. Elas sobem de fase quando você acerta em dias diferentes.', 'Tap to see the words. They level up when you get them right on different days.')}</p></section>
        ${ap.length > 1 ? `<section class="bg-surface-container-lowest rounded-3xl p-5 soft-shadow"><h2 class="text-headline-md text-on-surface">🎯 ${L('Meus acertos', 'My accuracy')}</h2><p class="text-body-sm text-on-surface-variant">${L('Últimos 14 dias', 'Last 14 days')}</p>
          <svg viewBox="0 0 300 100" class="w-full h-28 mt-2"><line x1="0" y1="10" x2="300" y2="10" stroke="rgb(var(--c-outline-variant))" stroke-dasharray="4 4"/><polyline fill="none" stroke="rgb(var(--c-tertiary-container))" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="${ap.map(x => x.join(',')).join(' ')}"/>${ap.map(x => `<circle cx="${x[0]}" cy="${x[1]}" r="4" fill="rgb(var(--c-tertiary))"/>`).join('')}</svg></section>` : ''}
        <section class="space-y-2"><h2 class="text-headline-md text-on-surface">${kt('habilidades')}</h2>
          ${sk.length ? sk.map(([s2, v]) => { const pc = Math.round(100 * v.right / (v.right + v.wrong)); const inf = skillInfo(s2); return `<button data-sk="${esc(s2)}" class="w-full text-left bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-2 active:scale-[0.99] transition"><div class="flex items-center justify-between gap-2"><div class="flex items-center gap-2.5 min-w-0"><div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">${I(inf.icon, 'text-[22px]')}</div><b class="text-label-lg text-on-surface truncate">${esc(inf.name)}</b></div><span class="flex items-center gap-1 text-label-md ${pc >= 80 ? 'text-primary' : pc >= 60 ? 'text-secondary' : 'text-error'}">${pc}% ${I('chevron_right', 'text-[18px] text-outline')}</span></div>
            <div class="w-full bg-surface-container-high rounded-full h-2 overflow-hidden"><div class="h-full rounded-full ${pc >= 80 ? 'bg-primary-container' : pc >= 60 ? 'bg-secondary-container' : 'bg-error'}" style="width:${pc}%"></div></div></button>`; }).join('') : `<p class="text-body-md text-on-surface-variant bg-surface-container-low rounded-2xl p-4">${L('Faça uma lição para ver suas habilidades aqui.', 'Do a lesson to see your skills here.')}</p>`}</section>
      </div></div>`)}${kidNav('prog')}`);
    wireNav();
    $('#minhanota').onclick = notaScreen;
    app().querySelectorAll('[data-wp]').forEach(b => b.onclick = () => {
      const k = b.dataset.wp, list = ph[k].sort((a, b2) => String(b2[1].last || b2[1].added).localeCompare(String(a[1].last || a[1].added)));
      sheet(`<h3 class="text-headline-md text-on-surface mb-1">${{ comecando: '🌱 ' + L('Começando', 'Starting'), desenvolvendo: '🌿 ' + L('Treinando', 'Practicing'), dominadas: '🌳 ' + L('Dominadas', 'Mastered') }[k]}</h3>
        <p class="text-body-sm text-on-surface-variant mb-3">${{ comecando: L('Palavras que você acabou de conhecer.', 'Words you just met.'), desenvolvendo: L('Você já acertou algumas vezes. Continue!', "You've got these right a few times. Keep going!"), dominadas: L('Estas você já sabe! 🎉', 'You know these! 🎉') }[k]}</p>
        ${list.length ? `<ul class="space-y-2">${list.slice(0, 60).map(([w, x]) => `<li class="bg-surface-container-low rounded-xl p-3"><b class="text-label-lg text-on-surface">${esc(w)}</b><span class="block text-body-sm text-on-surface-variant">${esc(e.defs[w] || (x && x.def) || '')}</span></li>`).join('')}</ul>` : `<p class="text-body-md text-on-surface-variant">${L('Nenhuma ainda.', 'None yet.')}</p>`}`);
    });
    app().querySelectorAll('[data-pk]').forEach(b => b.onclick = () => {
      const k = b.dataset.pk;
      if (k === 'words') return app().querySelector('[data-wp="desenvolvendo"]').click();
      if (k === 'reads') { const done = e.doneReadings(); return sheet(`<h3 class="text-headline-md text-on-surface mb-3">📚 ${L('Leituras que terminei', 'Readings I finished')}</h3>${done.length ? `<ul class="space-y-2">${done.map(r => `<li class="bg-surface-container-low rounded-xl p-3 flex items-center gap-3"><span class="text-[24px]">${esc(r.icon || '📖')}</span><span class="flex-1 text-label-lg text-on-surface">${esc(r.title)}</span><span>${'⭐'.repeat(Math.min(3, Math.ceil(((p.completed[r.id] || {}).stars || 0) * 3 / 5)))}</span></li>`).join('')}</ul>` : `<p class="text-body-md text-on-surface-variant">${L('Nenhuma ainda.', 'None yet.')}</p>`}`); }
      sheet(`<div class="text-center"><div class="text-[56px]">🔥</div><h3 class="text-headline-md text-on-surface">${L('Recorde', 'Best streak')}: ${p.bestStreak || 0} ${(p.bestStreak || 0) === 1 ? L('dia', 'day') : L('dias', 'days')}</h3><p class="text-body-md text-on-surface-variant mt-2">${L(`Agora: ${p.streak || 0} ${(p.streak || 0) === 1 ? 'dia' : 'dias'} seguidos. Estude todo dia para bater o recorde!`, `Now: ${p.streak || 0}-day streak. Study every day to beat your record!`)}</p></div>`);
    });
    app().querySelectorAll('[data-sk]').forEach(b => b.onclick = () => {
      const k = b.dataset.sk, v = p.skills[k] || { right: 0, wrong: 0 }, inf = skillInfo(k), pc = Math.round(100 * v.right / Math.max(1, v.right + v.wrong));
      const exs = shuffle(e.licoes.flatMap(l => l.questions || []).concat(((window.POOL || {})[k]) || []).filter(q => q.skill === k && q.type !== 'text')).slice(0, 3).map(q => q.vars ? e.question(e.variant(q)) : q).filter(Boolean);
      sheet(`<div class="flex items-center gap-3 mb-3"><div class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">${I(inf.icon, 'text-[26px]')}</div><div><h3 class="text-headline-md text-on-surface">${esc(inf.name)}</h3><p class="text-body-sm text-on-surface-variant">${v.right} ${L('certas', 'right')} · ${v.wrong} ${L('para treinar', 'to practice')} · ${pc}%</p></div></div>
        <p class="text-body-md text-on-surface bg-surface-container-low rounded-2xl p-3 mb-3">${pc >= 80 ? L('Você está mandando muito bem nisso! 🌟', "You're doing great at this! 🌟") : pc >= 60 ? L('Está quase lá. Mais um pouco de treino! 💪', 'Almost there. A bit more practice! 💪') : L('Essa é uma das que mais vão te ajudar a treinar. Errar faz parte! 💪', "This is a great one to practice. Mistakes are part of learning! 💪")}</p>
        ${exs.length ? `<p class="text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">${L('Exemplos de perguntas', 'Example questions')}</p><ul class="space-y-2">${exs.map(q => `<li class="bg-surface-container-low rounded-xl p-3 text-body-md text-on-surface">${md(q.prompt)}</li>`).join('')}</ul>` : ''}`);
    });
  }

  /* ================= lição ================= */
  let Ls = null;
  /* pega as configurações mais novas da criança (os pais podem ter mudado agora no painel deles) */
  async function refreshKid() {
    try {
      const r = await Promise.race([DB.sel('criancas', { eq: { id: A.kid.id } }), new Promise((_, no) => setTimeout(() => no(new Error('t')), 2500))]);
      if (r && r[0]) { ['minutos', 'pilares', 'dias', 'tema', 'estilo', 'idioma_app'].forEach(k => { if (r[0][k] !== undefined) A.kid[k] = r[0][k]; }); A.eng.child = A.kid; theme(A.kid.estilo, A.kid.tema); }
    } catch (e) { /* sem internet: usa o que já tem */ }
  }
  async function runLesson(opts) {
    if (!A.planOk()) return toast(kt('planoVencido'));
    await refreshKid();
    const e = A.eng; const S = e.startSession(opts);
    Ls = { t0: Date.now(), hidden: 0, hidAt: null, step: null, n: 0 };
    if (!S.reading && !opts.more && !e.dueWords(1).length && !e.pack && !e.licoes.length) { toast(kt('semConteudo')); return kidHome(); }
    nextStep();
  }
  document.addEventListener('visibilitychange', () => { if (!Ls) return; if (document.hidden) Ls.hidAt = Date.now(); else if (Ls.hidAt) { Ls.hidden += Date.now() - Ls.hidAt; Ls.hidAt = null; } });
  function stepSecs() { const s = (Date.now() - Ls.t0 - Ls.hidden) / 1000; Ls.t0 = Date.now(); Ls.hidden = 0; return Math.max(0, s); }
  function tickStep(kind) { A.eng.tick(stepSecs(), kind); }

  /* topo da lição: fechar, passo, tempo, moedas, barra e matéria */
  function lessonTop(chip) {
    const S = A.eng.s; const goal = S.targets.leitura + S.targets.palavras + S.targets.reforco;
    const totalSteps = Math.max(S.cap, Ls.n, S.station === 'leitura' ? S.units + S.queue.length : 0);
    const pct = Math.min(100, Math.round(100 * Math.max(0, Ls.n - 1) / totalSteps));
    const st = { leitura: ['menu_book', kt('leitura')], palavras: ['spellcheck', kt('palavras')], reforco: ['auto_stories', kt('reforco')] }[S.station];
    return `<header class="fixed top-0 inset-x-0 z-40 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]"><div class="h-16 px-margin max-w-2xl mx-auto flex items-center justify-between gap-2">
        <button data-exit class="flex items-center gap-2 min-w-0 text-left">${logo}<h1 class="text-headline-md text-on-surface truncate">${L('Sessão de estudo', 'Study session')}</h1></button>
        <div class="flex items-center gap-1.5"><button id="lk" title="${L('Área dos pais', 'Parents area')}" aria-label="${L('Área dos pais', 'Parents area')}" class="w-8 h-8 rounded-full flex items-center justify-center text-outline opacity-70">${I('lock', 'text-[18px]')}</button><button data-exit aria-label="${L('Parar a lição', 'Stop lesson')}" class="w-9 h-9 rounded-full bg-primary-fixed/60 flex items-center justify-center text-[20px]">${esc(A.kid.avatar || '⭐')}</button></div></div></header>
      <main class="pt-20 pb-36 px-margin max-w-2xl mx-auto">
      <div class="flex items-center justify-between gap-2 mb-3">
        <button id="x" aria-label="Fechar" class="w-11 h-11 flex items-center justify-center rounded-full bg-surface-container text-on-surface shadow-sm active:scale-90 shrink-0">${I('close', 'text-[20px]')}</button>
        <div class="flex items-center gap-1.5 min-w-0">
          ${S.simulado ? `<span class="bg-tertiary-container text-on-tertiary-container px-3 py-1.5 rounded-full text-label-sm shadow-sm whitespace-nowrap">📝 ${L('Simulado', 'Practice test')} ${Ls.n}/${S.cap}</span>` : S.more ? `<span class="bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full text-label-sm shadow-sm whitespace-nowrap">⭐ ${L('Extra', 'Extra')} +${Math.max(0, A.eng.minutesToday() - A.eng.goalMin())} min</span>` : `<span class="bg-surface-container px-3 py-1.5 rounded-full text-label-sm text-on-surface shadow-sm whitespace-nowrap">${L('Passo', 'Step')} ${Ls.n} ${L('de', 'of')} ${totalSteps}</span>`}
          <span class="bg-surface-container-low px-3 py-1.5 rounded-full text-label-sm text-on-surface-variant flex items-center gap-1 whitespace-nowrap">${I('timer', 'text-[16px] text-tertiary')}${Math.max(1, Math.round(S.sec / 60))} min</span>
        </div>
        <span class="flex items-center gap-1 bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full text-label-sm shadow-sm whitespace-nowrap">${I('star', 'text-[16px]', 1)}+${S.earned}</span>
      </div>
      <div class="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden p-0.5 mb-4"><div class="bg-primary-container h-full rounded-full transition-all duration-500" style="width:${Math.max(3, pct)}%"></div></div>
      <div class="flex items-center gap-2 flex-wrap mb-4">
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high text-on-tertiary-fixed-variant text-label-md shadow-sm">${I(chip ? chip.icon : st[0], 'text-[16px] text-tertiary', 1)}${esc(chip ? chip.name : st[1])}</span>
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed/50 text-on-primary-fixed-variant text-label-sm">${I(st[0], 'text-[14px]')}${st[1]}</span>
      </div>`;
  }
  // botão logo abaixo da resposta (perto de onde a criança está olhando)
  const nearBottom = inner => `<div class="mt-5 mb-4 space-y-2" id="near">${inner}</div></main>`;
  const lessonBottom = inner => `</main><div class="fixed bottom-0 inset-x-0 z-30 pb-safe bg-gradient-to-t from-surface via-surface to-transparent pt-6"><div class="max-w-2xl mx-auto px-margin pb-4 space-y-2">${inner}</div></div>`;
  function wireTop() {
    const lk = $('#lk'); if (lk) lk.onclick = () => {
      // pausa o tempo da lição enquanto os pais mexem; depois volta para o mesmo passo
      stopSpeak(); if (rec && rec.state === 'recording') try { rec.stop(); } catch (e) {}
      const st = Ls && Ls.step; if (Ls) Ls.hidAt = Date.now();
      toParents(async () => {
        await refreshKid(); if (!Ls || !A.eng || !A.eng.s) return kidHome();
        if (Ls.hidAt) { Ls.hidden += Date.now() - Ls.hidAt; Ls.hidAt = null; }
        if (!st) return nextStep();
        return st.kind === 'page' ? pageStep(st) : st.kind === 'match' ? matchStep(st) : qStep(st);
      });
    };
    const askExit = () => {
      if (document.querySelector('.qk-exit')) return;
      const S = A.eng.s, left = S ? Math.max(0, A.eng.goalSteps() - A.eng.stepsToday()) : 0;
      const box = document.createElement('div');
      box.className = 'qk-exit fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4';
      box.innerHTML = `<div class="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 space-y-4 shadow-xl text-center"><div class="text-[44px]">⏸️</div><h3 class="text-headline-md text-on-surface">${L('Quer parar agora?', 'Stop for now?')}</h3>
        <p class="text-body-md text-on-surface-variant">${left ? L(`Faltam só ${left} atividades para a meta de hoje. O que você já fez fica salvo.`, `Only ${left} activities left for today's goal. What you did is saved.`) : L('O que você já fez fica salvo.', 'What you did is saved.')}</p>
        <div class="grid grid-cols-2 gap-3"><button id="no" class="btn3d h-12 rounded-2xl bg-primary-container text-on-primary text-label-lg">${L('Continuar', 'Keep going')}</button><button id="yes" class="h-12 rounded-2xl bg-surface-container text-on-surface text-label-lg">${L('Parar', 'Stop')}</button></div></div>`;
      document.body.appendChild(box); box.querySelector('#no').onclick = () => box.remove(); box.onclick = ev => { if (ev.target === box) box.remove(); }; box.querySelector('#yes').onclick = () => { box.remove(); finish(true); };
    };
    $('#x').onclick = askExit;
    app().querySelectorAll('[data-exit]').forEach(b => b.onclick = askExit);
    app().querySelectorAll('.word').forEach(w => w.onclick = () => {
      document.querySelectorAll('.defpop').forEach(x => x.remove());
      const box = document.createElement('div'); box.className = 'defpop fixed left-4 right-4 bottom-28 z-50 max-w-md mx-auto bg-surface-container-lowest rounded-2xl p-4 shadow-xl flex gap-3 items-start';
      box.innerHTML = `${I('menu_book', 'text-primary text-[24px]')}<div class="flex-1"><b class="text-label-lg text-on-surface">${esc(w.textContent)}</b><p class="text-body-md text-on-surface-variant">${esc(w.dataset.def)}</p></div><button class="text-on-surface-variant">${I('close')}</button>`;
      document.body.appendChild(box); box.querySelector('button').onclick = () => box.remove(); setTimeout(() => box.remove(), 8000);
    });
  }
  let lastSave = 0;
  function persist(final) {
    const e = A.eng; if (!e.s || !e.s.items.length && !final) return;
    const r = e.finish(!final);
    if (final || Date.now() - lastSave > 15000) { lastSave = Date.now(); DB.ins('tentativas', r.att, { upsert: true, onConflict: 'id' }).catch(x => console.warn('tentativa', x)); }
    A.saveProg(final);
    return r;
  }
  function nextStep() {
    document.querySelectorAll('.defpop').forEach(x => x.remove());
    stopSpeak();
    const SS = A.eng.s;
    if (SS && SS.simulado && SS.simulado.tempo && SS.sec >= SS.simulado.tempo * 60) { toast(L('⏰ O tempo acabou!', "⏰ Time's up!")); return finish(false); }
    const step = A.eng.next(); Ls.step = step;
    if (!step) return finish(false);
    Ls.n++;
    if (step.kind === 'page') return pageStep(step);
    if (step.kind === 'match') return matchStep(step);
    return qStep(step);
  }

  /* ---- ouvir (voz do aparelho) ---- */
  let speakOn = false;
  function speak(text, btn) {
    const sy = window.speechSynthesis;
    if (!sy || !window.SpeechSynthesisUtterance) return toast(L('Seu aparelho não lê em voz alta.', "Your device can't read aloud."));
    if (speakOn) { stopSpeak(); btn && btn.classList.remove('ring-4'); return; }
    const lang = isPt() ? 'pt-BR' : 'en-US';
    const clean = String(text).replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g, '$1').replace(/[*_#>]/g, '');
    // frases curtas: o Safari do iPhone corta textos longos
    const parts = clean.match(/[^.!?\n]+[.!?]*\s*/g) || [clean];
    const voices = sy.getVoices(); const voice = voices.find(v => v.lang === lang) || voices.find(v => v.lang && v.lang.slice(0, 2) === lang.slice(0, 2));
    try { sy.cancel(); } catch (e) {}
    let started = false; speakOn = true; btn && btn.classList.add('ring-4');
    parts.filter(t => t.trim()).forEach((t, i, all) => {
      const u = new SpeechSynthesisUtterance(t.trim()); u.lang = lang; u.rate = 0.92; if (voice) u.voice = voice;
      u.onstart = () => { started = true; };
      if (i === all.length - 1) u.onend = () => { speakOn = false; btn && btn.classList.remove('ring-4'); };
      u.onerror = () => { speakOn = false; btn && btn.classList.remove('ring-4'); };
      sy.speak(u);
    });
    try { sy.resume(); } catch (e) {}
    setTimeout(() => { if (!started && speakOn) toast(L('Não ouviu? Tire o celular do modo silencioso (botão na lateral do iPhone) e aumente o volume.', "Can't hear it? Turn off silent mode (the switch on the side of the iPhone) and turn up the volume."), 5000); }, 1800);
  }
  function stopSpeak() { speakOn = false; try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {} }

  /* ---- página de leitura (Ler em voz alta) ---- */
  let rec = null, raf = null;
  function pageStep(step) {
    const S = A.eng.s, R = S.reading, n = step.n, text = R.pages[n - 1] || '';
    const aloud = R.aloud === 'all' || (R.aloud || []).includes(n);
    const has = S.pageRec.find(r => r.page === n);
    const words = String(text).replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g, '$1').split(/\s+/).filter(Boolean).length;
    view(`${lessonTop({ icon: 'menu_book', name: L('Leitura guiada', 'Guided reading') })}
      <div class="space-y-1 mb-4">
        <span class="inline-flex items-center gap-1.5 bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-label-sm shadow-sm">${I('auto_stories', 'text-[14px]')} ${aloud ? L('Desafio de leitura · Fluência e entonação', 'Reading challenge · Fluency') : L('Hora da leitura', 'Reading time')}</span>
        <h2 class="text-headline-lg-mobile md:text-headline-lg text-on-surface pt-1">${aloud ? L('Leia o trecho em voz alta!', 'Read this part out loud!') : L('Leia com atenção', 'Read carefully')}</h2>
        <p class="text-body-md text-on-surface-variant">${aloud ? L('Toque no microfone 🎤 lá embaixo e leia com calma, no seu ritmo.', 'Tap the mic 🎤 at the bottom and read calmly, at your own pace.') : L('Toque nas palavras destacadas para ver o significado.', 'Tap highlighted words to see what they mean.')}</p></div>
      <div class="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <div class="flex items-center gap-2 bg-surface-container-lowest px-3.5 py-2 rounded-xl shadow-sm min-w-0"><span class="text-[20px]">${esc(R.icon || '📖')}</span><span class="text-label-md text-on-surface truncate">${esc(R.title)}</span></div>
        <button id="ouvir" class="flex items-center gap-2 bg-tertiary-container text-on-tertiary-container px-3.5 py-2 rounded-xl text-label-md shadow-sm active:scale-95 ring-tertiary-fixed">${I('volume_up', 'text-[18px]')}<span>${L('Ouvir exemplo', 'Listen')}</span></button></div>
      <div class="bg-surface-container-lowest rounded-2xl p-5 md:p-6 soft-shadow mb-5 space-y-4">
        <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-primary-container"></span><span class="text-label-sm text-on-surface-variant uppercase tracking-wider">${kt('pagina')} ${n} ${L('de', 'of')} ${R.pages.length}</span></div>
        ${R.wordParts && n === 1 ? `<div class="flex flex-wrap gap-1.5">${R.wordParts.map(w => `<span class="bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-1 rounded-lg text-label-sm">${esc(w[0])} = ${esc(w[1])}</span>`).join('')}</div>` : ''}
        <div id="psg" class="text-body-lg md:text-[20px] md:leading-[32px] text-on-surface leading-relaxed space-y-3"><p>${md(text)}</p></div>
        <div id="meter"></div>
        ${R.image && n === 1 ? `<div class="w-full h-40 rounded-xl overflow-hidden"><img class="w-full h-full object-cover" src="${esc(R.image)}" alt=""></div>` : ''}
        ${R.audio && n === 1 ? `<audio controls preload="none" src="${esc(R.audio)}" class="w-full"></audio>` : ''}
        <div class="flex items-center justify-between text-label-sm text-on-surface-variant bg-surface-container-low px-3 py-2 rounded-xl"><span>💡 ${L('Dica: faça uma pausa suave na vírgula!', 'Tip: pause gently at commas!')}</span><span class="text-primary">${words} ${L('palavras', 'words')}</span></div>
      </div>
      ${aloud ? '<div class="h-28"></div>' : ''}
      ${lessonBottom(`${aloud ? `<div class="bg-surface-container-lowest rounded-2xl p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center gap-3">
          <div class="relative flex items-center justify-center shrink-0"><div id="ping" class="absolute w-16 h-16 rounded-full bg-error-container opacity-60 hidden animate-ping"></div>
            <button id="rec" aria-label="${L('Gravar leitura', 'Record reading')}" class="btn3d relative z-10 w-16 h-16 rounded-full bg-primary-container text-on-primary flex items-center justify-center">${I('mic', 'text-[32px]', 1)}</button></div>
          <div class="flex-1 min-w-0">
            <p id="recst" class="text-label-md text-on-surface leading-tight">${has ? kt('gravado') + ' ' + L('Toque para gravar de novo.', 'Tap to record again.') : L('Toque no microfone e leia em voz alta', 'Tap the mic and read out loud')}</p>
            <div class="flex items-center gap-2 mt-1"><span id="rect" class="flex items-center gap-1 bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full text-label-sm">${I('mic', 'text-[12px]')} 00:00</span><span id="sig" class="flex items-center gap-1 text-label-sm text-on-surface-variant truncate">${has ? kt('gravado') : L('Toque de novo para parar', 'Tap again to stop')}</span></div>
            <div id="wave" class="w-full h-7 mt-1 flex items-center gap-1 overflow-hidden">${Array.from({ length: 18 }, (x, i) => `<div class="w-1.5 rounded-full ${['bg-primary-container', 'bg-tertiary-container', 'bg-primary'][i % 3]}" style="height:4px"></div>`).join('')}</div>
          </div></div>` : ''}${btnPrimary('ok', L('Pronto! Continuar', 'Done! Continue'), 'arrow_forward')}`)}`);
    wireTop();
    $('#ouvir').onclick = ev => R.audio && n === 1 ? (app().querySelector('audio') || {}).play && app().querySelector('audio').play() : speak(text, ev.currentTarget);
    if (aloud) { $('#rec').onclick = () => toggleRec(n); const m = (S.meters || {})[n]; if (m) showMeter(m); }
    $('#ok').onclick = () => {
      if (rec && rec.state === 'recording') { rec.stop(); setTimeout(() => $('#ok') && $('#ok').click(), 700); return; }
      stopSpeak();
      const sec = stepSecs(); A.eng.tick(sec, 'page'); S.pagesSec.push({ n, sec: Math.round(sec), aloud: !!S.pageRec.find(r => r.page === n) });
      if (S.pageRec.find(r => r.page === n)) S.earned += 10;
      persist(false); nextStep();
    };
  }
  /* ---- medidor de leitura (reconhecimento de voz grátis do navegador; é uma ESTIMATIVA) ---- */
  const meterOn = () => { try { return localStorage.getItem('qk.medidor') === '1'; } catch (e) { return false; } };   // desligado: a leitura será avaliada pela IA
  const normW = w => String(w).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9']/g, '').replace(/'/g, '');
  function near(a, b) {
    if (a === b) return true; if (!a || !b) return false;
    if (a.length < 4 || b.length < 4) return false;
    if (Math.abs(a.length - b.length) > 1) return a.startsWith(b) || b.startsWith(a);
    let d = 0, i = 0, j = 0; while (i < a.length && j < b.length) { if (a[i] === b[j]) { i++; j++; continue; } if (++d > 1) return false; if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; } }
    return d + (a.length - i) + (b.length - j) <= 1;
  }
  let MT = null;
  function wrapWords() {
    const box = $('#psg'); if (!box) return [];
    if (!box.querySelector('.rw')) {
      const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT); const nodes = []; let x; while ((x = walker.nextNode())) nodes.push(x);
      let k = 0;
      nodes.forEach(t => { if (!t.textContent.trim()) return; const frag = document.createDocumentFragment(); t.textContent.split(/(\s+)/).forEach(part => { if (!part) return; if (/^\s+$/.test(part) || !normW(part)) frag.appendChild(document.createTextNode(part)); else { const sp = document.createElement('span'); sp.className = 'rw rounded transition-colors'; sp.dataset.w = k++; sp.textContent = part; frag.appendChild(sp); } }); t.parentNode.replaceChild(frag, t); });
    }
    return [...box.querySelectorAll('.rw')];
  }
  function align(words, heard) {
    let i = 0; const got = new Set();
    heard.forEach(h => { if (!h) return; for (let j = i; j < Math.min(words.length, i + 4); j++) if (near(words[j], h)) { got.add(j); i = j + 1; return; } });
    return { pos: i, got };
  }
  function meterStart(n) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR || !meterOn()) { MT = null; return; }
    const spans = wrapWords(); if (spans.length < 5) { MT = null; return; }
    spans.forEach(s => s.classList.remove('bg-tertiary-fixed', 'bg-primary-fixed', 'meter-miss'));
    MT = { n, spans, words: spans.map(s => normW(s.textContent)), base: [], cur: [], t0: Date.now(), live: true, res: { pos: 0, got: new Set() } };
    const st = MT;
    const go = () => {
      let r; try { r = new SR(); } catch (e) { return; }
      r.lang = isPt() ? 'pt-BR' : 'en-US'; r.continuous = true; r.interimResults = true; r.maxAlternatives = 1;
      r.onresult = ev => {
        const all = []; for (let k = 0; k < ev.results.length; k++) all.push(ev.results[k][0].transcript);
        st.cur = all.join(' ').split(/\s+/).map(normW).filter(Boolean);
        st.res = align(st.words, st.base.concat(st.cur));
        st.spans.forEach((s, k) => { s.classList.toggle('bg-primary-fixed', st.res.got.has(k)); s.classList.toggle('bg-tertiary-fixed', k === st.res.pos); });
        const cw = st.spans[st.res.pos]; if (cw && cw.getBoundingClientRect().bottom > innerHeight - 170) cw.scrollIntoView({ block: 'center', behavior: 'smooth' });
      };
      r.onerror = () => {};
      r.onend = () => { st.base = st.base.concat(st.cur); st.cur = []; if (st.live && MT === st) setTimeout(go, 150); };
      try { r.start(); st.r = r; } catch (e) {}
    };
    go();
  }
  function meterStop(n) {
    const st = MT; if (!st || st.n !== n) return; st.live = false; try { st.r && st.r.stop(); } catch (e) {}
    setTimeout(() => {
      const res = st.res, att = res.pos, ok = res.got.size, min = Math.max(0.1, (Date.now() - st.t0) / 60000);
      st.spans.forEach(s => s.classList.remove('bg-tertiary-fixed'));
      if (att < 5) { showMeter({ vazio: true }); return; }
      const pulou = []; for (let k = 0; k < att; k++) if (!res.got.has(k)) { st.spans[k].classList.add('meter-miss'); if (pulou.length < 8) pulou.push(st.spans[k].textContent.replace(/[^\p{L}\p{N}'-]/gu, '')); }
      const m = { wpm: Math.round(att / min), wcpm: Math.round(ok / min), acc: Math.round(100 * ok / att), palavras: att, pulou };
      const S = A.eng && A.eng.s; if (S) { S.meters = S.meters || {}; S.meters[n] = m; }
      showMeter(m);
    }, 600);
  }
  function showMeter(m) {
    const box = $('#meter'); if (!box) return;
    box.innerHTML = m.vazio ? `<p class="text-body-sm text-on-surface-variant bg-surface-container-low rounded-xl p-3">📏 ${L('Não deu para medir desta vez (o microfone não ouviu bem). Tudo bem, a gravação vale!', "Couldn't measure this time (the mic didn't hear well). That's ok, the recording counts!")}</p>`
      : `<div class="bg-primary-fixed/30 rounded-2xl p-3.5 space-y-2"><p class="text-label-md text-on-surface flex items-center gap-1.5">📏 ${L('Medidor de leitura', 'Reading meter')} <span class="text-label-sm text-on-surface-variant font-normal">(${L('estimativa', 'estimate')})</span></p>
        <div class="grid grid-cols-3 gap-2 text-center"><div class="bg-surface-container-lowest rounded-xl p-2"><b class="text-headline-md text-on-surface block">${m.wpm}</b><span class="text-label-sm text-on-surface-variant">${L('palavras/min', 'words/min')}</span></div>
        <div class="bg-surface-container-lowest rounded-xl p-2"><b class="text-headline-md text-on-surface block">${m.wcpm}</b><span class="text-label-sm text-on-surface-variant">${L('certas/min', 'correct/min')}</span></div>
        <div class="bg-surface-container-lowest rounded-xl p-2"><b class="text-headline-md text-on-surface block">${m.acc}%</b><span class="text-label-sm text-on-surface-variant">${L('acerto', 'accuracy')}</span></div></div>
        ${m.pulou && m.pulou.length ? `<p class="text-body-sm text-on-surface-variant">${L('Palavras para treinar (puladas ou trocadas):', 'Words to practice (skipped or changed):')} <b class="text-on-surface">${m.pulou.map(esc).join(', ')}</b></p>` : `<p class="text-body-sm text-on-surface-variant">${L('Nenhuma palavra pulada. Parabéns! 🌟', 'No skipped words. Great job! 🌟')}</p>`}</div>`;
  }

  async function toggleRec(n) {
    const S = A.eng.s, btn = $('#rec'), st = $('#recst'), timer = $('#rect'), ping = $('#ping'), sig = $('#sig');
    if (rec && rec.state === 'recording') { rec.stop(); return; }
    if (!navigator.mediaDevices || !window.MediaRecorder) { st.textContent = kt('semMic'); return; }
    try {
      stopSpeak();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'].find(m => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) || '';
      rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined); const chunks = []; const t0 = Date.now();
      // onda de áudio de verdade (nível do microfone)
      let ctx = null, an = null, data = null;
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); an = ctx.createAnalyser(); an.fftSize = 64; ctx.createMediaStreamSource(stream).connect(an); data = new Uint8Array(an.frequencyBinCount); } catch (e) {}
      const bars = [...app().querySelectorAll('#wave > div')];
      const loop = () => {
        const s = Math.floor((Date.now() - t0) / 1000); if (timer) timer.innerHTML = `<span class="w-2 h-2 rounded-full bg-error animate-ping"></span> 🔴 ${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
        if (an) { an.getByteFrequencyData(data); bars.forEach((b, i) => { b.style.height = Math.max(4, Math.min(26, (data[i + 1] || 0) / 8)) + 'px'; }); const avg = data.reduce((a, b) => a + b, 0) / data.length; if (sig) sig.innerHTML = `${I('graphic_eq', 'text-[16px] text-primary-container')} ${avg > 25 ? L('Sinal do microfone ótimo', 'Great mic signal') : L('Fale um pouco mais alto', 'Speak a bit louder')}`; }
        raf = requestAnimationFrame(loop);
      };
      rec.ondataavailable = ev => ev.data.size && chunks.push(ev.data);
      rec.onstop = async () => {
        meterStop(n); cancelAnimationFrame(raf); try { ctx && ctx.close(); } catch (e) {}
        stream.getTracks().forEach(x => x.stop()); ping && ping.classList.add('hidden'); btn.innerHTML = I('mic', 'text-[36px]', 1); btn.classList.remove('bg-error');
        bars.forEach(b => b.style.height = '6px');
        const blob = new Blob(chunks, { type: rec.mimeType || 'audio/mp4' }); const dur = Math.round((Date.now() - t0) / 1000);
        if (dur < 2) { st.textContent = L('Muito curto. Tente de novo!', 'Too short. Try again!'); return; }
        st.textContent = '⏳ ' + L('Salvando…', 'Saving…');
        const ext = /mp4|m4a/.test(blob.type) ? 'm4a' : 'webm';
        const path = `${A.fam.id}/${A.kid.id}/${S.id}-p${n}-${Date.now()}.${ext}`;
        try { await DB.upload('familia-gravacoes', path, blob); S.pageRec = S.pageRec.filter(r => r.page !== n); S.pageRec.push({ at: new Date().toISOString(), dur, mime: blob.type, page: n, path, bucket: 'familia-gravacoes' }); st.textContent = kt('gravado') + ' ' + L('Muito bem! 🌟', 'Great job! 🌟'); }
        catch (x) { st.textContent = '⚠️ ' + x.message; }
      };
      rec.start(); meterStart(n); ping && ping.classList.remove('hidden'); btn.innerHTML = I('stop', 'text-[36px]', 1); btn.classList.add('bg-error');
      st.textContent = L('Gravando sua voz… Fale com clareza!', 'Recording… Speak clearly!'); loop();
    } catch (x) { st.textContent = kt('semMic'); }
  }

  /* ---- pergunta (Stitch: questão + feedback de erro) ---- */
  function qStep(step) {
    const q = step.q;
    let ans = null, hint = false, answered = false;
    const order = q.type === 'mc' ? shuffle(q.options.map((o, i) => i)) : null;
    const tiles = (q.type === 'order' || q.type === 'sort') ? shuffle(q.items.map((x, i) => i)) : null;
    const picked = [], placed = {}; let selTile = null, drawnQ = false;
    const chip = skillInfo(q.skill);
    const instr = { order: kt('ordene'), sort: kt('separe') }[q.type] || '';
    const badge = step.source === 'similar' ? `<span class="bg-secondary-fixed text-on-secondary-fixed px-2.5 py-0.5 rounded-full text-label-sm uppercase tracking-wide">${L('Parecida', 'Similar')}</span>`
      : (step.source === 'review' || step.source === 'wordrev') ? `<span class="bg-error-container text-on-error-container px-2.5 py-0.5 rounded-full text-label-sm uppercase tracking-wide">${L('Revisão', 'Review')}</span>` : '';
    const fracQ = q.type === 'num' && (q.answers || [q.answer]).some(x => /\d\s*\/\s*\d/.test(String(x)));
    const mixedQ = fracQ && (q.answers || [q.answer]).some(x => /^\s*\d+\s+\d+\s*\/\s*\d+/.test(String(x)));
    const ready = () => q.type === 'mc' ? ans !== null : q.type === 'num' || q.type === 'text' ? !!String(ans || '').trim() : q.type === 'order' ? picked.length === q.items.length : q.type === 'sort' ? Object.keys(placed).length === q.items.length : false;
    const optCls = (sel) => `relative w-full flex items-center justify-between min-h-[64px] px-4 py-3.5 rounded-xl bg-surface-container-lowest text-left transition-all active:scale-[0.98] ${sel ? 'shadow-[0_4px_16px_rgba(20,163,163,0.14)] ring-2 ring-primary-container' : 'shadow-[0_2px_8px_rgba(0,0,0,0.05)]'}`;
    const body = () => {
      if (q.type === 'mc') return `<div class="grid gap-3.5 ${q.options.every(o => String(o).length < 28) ? 'md:grid-cols-2' : ''}">${order.map((i, k) => `<button data-i="${i}" class="${optCls(ans === i)}">
          <span class="flex items-center gap-3.5 flex-1 min-w-0 pr-2"><span class="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-label-lg ${ans === i ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-on-surface-variant'}">${'ABCDEF'[k]}</span><span class="text-body-md text-on-surface leading-snug ${ans === i ? 'font-bold' : ''}">${md(q.options[i])}</span></span>
          <span class="w-6 h-6 shrink-0 rounded-full flex items-center justify-center ${ans === i ? 'bg-primary-container' : 'bg-surface-container'}">${ans === i ? I('check', 'text-[16px] text-white') : ''}</span></button>`).join('')}</div>`;
      if (q.type === 'num' && fracQ) {
        const box = (id, ph) => `<input id="${id}" data-fr inputmode="numeric" pattern="[0-9]*" autocomplete="off" maxlength="4" placeholder="${ph}" class="w-20 h-16 rounded-2xl bg-surface-container-lowest border-2 border-surface-container-high focus:border-primary-container focus:outline-none text-headline-lg text-center text-on-surface">`;
        return `<div class="flex items-center justify-center gap-4 py-2">
          ${mixedQ ? `<div class="flex flex-col items-center gap-1">${box('fw', '')}<span class="text-label-sm text-on-surface-variant">${L('inteiros', 'wholes')}</span></div>` : ''}
          <div class="flex flex-col items-center gap-2">${box('fn', '')}<div class="w-24 h-1.5 rounded-full bg-on-surface"></div>${box('fd', '')}</div></div>
          <p class="text-center text-body-sm text-on-surface-variant">${mixedQ ? L('Número misto? Use a caixa da esquerda para os inteiros (deixe vazia se não tiver).', 'Mixed number? Use the left box for the wholes (leave it empty if none).') : L('Número de cima e número de baixo da fração.', 'Top number and bottom number of the fraction.')}</p>`;
      }
      if (q.type === 'num') return `<input id="in" inputmode="decimal" autocomplete="off" placeholder="${kt('digite')}" value="${esc(ans || '')}" class="${inputCls} h-16 text-headline-lg text-center">`;
      if (q.type === 'text') return `<textarea id="in" rows="4" placeholder="${kt('escreva')}" class="w-full p-4 rounded-2xl bg-surface-container-lowest border-2 border-surface-container-high focus:border-primary-container focus:outline-none text-body-lg text-on-surface">${esc(ans || '')}</textarea>`;
      if (q.type === 'order') return `<div class="bg-surface-container-lowest rounded-2xl p-3 min-h-[70px] space-y-2 shadow-sm">${picked.map((i, k) => `<div class="flex items-center gap-2 bg-primary-fixed/40 rounded-xl px-3 py-2"><span class="w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-label-md">${k + 1}</span><span class="text-body-md text-on-surface">${md(q.items[i])}</span></div>`).join('') || `<span class="text-body-sm text-outline px-2">…</span>`}</div>
        <div class="flex flex-wrap gap-2 mt-3">${tiles.map(i => `<button data-t="${i}" class="px-4 py-2.5 rounded-xl text-label-md ${picked.includes(i) ? 'bg-surface-container text-outline line-through' : 'bg-surface-container-lowest text-on-surface shadow-sm active:scale-95'}">${md(q.items[i])}</button>`).join('')}</div>${picked.length ? `<button id="undo" class="mt-2 text-label-md text-primary flex items-center gap-1">${I('undo', 'text-[18px]')} ${L('Desfazer', 'Undo')}</button>` : ''}`;
      if (q.type === 'sort') return `<div class="flex flex-wrap gap-2 mb-3">${tiles.filter(i => !(i in placed)).map(i => `<button data-t="${i}" class="px-4 py-2.5 rounded-xl text-label-md shadow-sm ${selTile === i ? 'bg-primary-container text-on-primary' : 'bg-surface-container-lowest text-on-surface'}">${md(q.items[i].t)}</button>`).join('')}</div>
        <div class="grid gap-3 sm:grid-cols-${Math.min(3, q.buckets.length)}">${q.buckets.map(b => `<button data-b="${esc(b)}" class="text-left rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low p-3 min-h-[80px]"><h4 class="text-label-lg text-on-surface mb-2">${md(b)}</h4><div class="flex flex-wrap gap-1.5">${Object.entries(placed).filter(([, v]) => v === b).map(([i]) => `<span data-un="${i}" class="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-label-sm text-on-surface shadow-sm">${md(q.items[i].t)} ✕</span>`).join('')}</div></button>`).join('')}</div>`;
      return '';
    };
    const draw = () => {
      view(`${lessonTop(chip)}
        <div class="bg-surface-container-lowest p-5 md:p-6 rounded-xl soft-shadow relative overflow-hidden mb-5">
          <div class="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-surface-container-low pointer-events-none opacity-60"></div>
          <div class="flex items-center gap-2 mb-2 relative"><span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-label-sm uppercase tracking-wide">${L('Pergunta', 'Question')} ${Ls.n}</span>${badge}</div>
          ${q.figure ? `<div class="relative text-body-sm text-on-surface-variant mb-2">${figure(q.figure)}</div>` : ''}
          <h2 class="relative text-headline-lg-mobile md:text-headline-lg text-on-surface leading-snug">${md(q.prompt)}</h2>
          ${instr ? `<p class="relative text-body-sm text-on-surface-variant mt-2">${instr}</p>` : ''}</div>
        <div id="ans">${body()}</div>
        ${q.hint ? (hint ? `<div class="flex items-center gap-3 p-3.5 mt-5 rounded-xl bg-surface-container-low shadow-sm"><div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shrink-0 text-on-secondary-container">${I('lightbulb', 'text-[18px]')}</div><p class="text-body-sm text-on-surface-variant leading-snug">${md(q.hint)}</p></div>`
          : `<button id="hint" class="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low text-label-md text-on-surface-variant">${I('lightbulb', 'text-[18px] text-secondary')} ${L('Ver dica', 'Show hint')}</button>`) : ''}
        <div id="fb"></div>
        ${nearBottom(`<button id="ok" type="button" ${ready() ? '' : 'disabled'} class="btn3d w-full h-14 rounded-xl bg-primary-container text-on-primary text-headline-md flex items-center justify-center gap-2"><span>${kt('conferir')}</span>${I('arrow_forward', 'text-[22px]')}</button>`)}`, drawnQ); drawnQ = true;
      wireTop(); wire();
    };
    const wire = () => {
      app().querySelectorAll('[data-i]').forEach(b => b.onclick = () => { if (answered) return; ans = +b.dataset.i; draw(); });
      if (fracQ) {
        const frs = [...app().querySelectorAll('[data-fr]')];
        const upd = () => { const w = ($('#fw') || {}).value || '', n = $('#fn').value.trim(), dd = $('#fd').value.trim(); ans = n && dd ? (w.trim() ? w.trim() + ' ' : '') + n + '/' + dd : ''; $('#ok').disabled = !ready(); };
        frs.forEach(f => { f.oninput = () => { f.value = f.value.replace(/\D/g, ''); upd(); }; f.onfocus = () => setTimeout(() => { const nb = $('#near'); nb && nb.scrollIntoView({ block: 'end', behavior: 'smooth' }); }, 350); });
        ($('#fw') || $('#fn')).focus();
      }
      const inp = $('#in'); if (inp) { inp.onfocus = () => setTimeout(() => { const nb = $('#near'); nb && nb.scrollIntoView({ block: 'end', behavior: 'smooth' }); }, 350); inp.oninput = () => { ans = inp.value; $('#ok').disabled = !ready(); }; if (q.type === 'num') inp.onkeydown = e => { if (e.key === 'Enter' && ready()) $('#ok').click(); }; }
      app().querySelectorAll('[data-t]').forEach(b => b.onclick = () => { const i = +b.dataset.t; if (q.type === 'order') { if (!picked.includes(i)) picked.push(i); } else selTile = i; draw(); });
      app().querySelectorAll('[data-b]').forEach(b => b.onclick = e => { const un = e.target.closest('[data-un]'); if (un) { delete placed[un.dataset.un]; draw(); return; } if (selTile !== null) { placed[selTile] = b.dataset.b; selTile = null; draw(); } });
      const u = $('#undo'); if (u) u.onclick = () => { picked.pop(); draw(); };
      const h = $('#hint'); if (h) h.onclick = () => { hint = true; draw(); };
      $('#ok').onclick = submit;
    };
    const submit = () => {
      answered = true; tickStep('q');
      const a = q.type === 'order' ? picked.map(i => q.items[i]) : q.type === 'sort' ? q.items.map((x, i) => placed[i]) : ans;
      const r = A.eng.record(step, a, { hint });
      persist(false);
      if (A.eng.s && A.eng.s.simulado) { sfx('tap'); return nextStep(); }      // simulado: sem resposta na hora, como numa prova
      if (r.ok === false) return wrongScreen(step, q, a, chip);
      app().querySelectorAll('#ans button, #ans input, #ans textarea').forEach(x => x.disabled = true);
      if (q.type === 'mc') app().querySelectorAll('[data-i]').forEach(b => { if (+b.dataset.i === (q.answer || 0)) b.classList.add('ring-2', 'ring-primary-container', 'bg-primary-container/10'); });
      const fb = $('#fb');
      const msgs = kt('acertou');
      fb.innerHTML = r.ok === null
        ? `<div class="mt-5 bg-tertiary-fixed text-on-tertiary-fixed rounded-2xl p-4 flex items-center gap-3">${I('edit_note', 'text-[28px]')}<span class="text-label-lg">${kt('enviado')}</span></div>`
        : `<div class="mt-5 bg-primary-container/15 rounded-2xl p-4 flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0">${I('check', 'text-[24px]', 1)}</div><div class="flex-1"><p class="text-headline-md text-primary">${msgs[Math.floor(Math.random() * msgs.length)]}</p>${q.explain ? `<p class="text-body-sm text-on-surface-variant mt-0.5">${md(q.explain)}</p>` : ''}</div><span class="text-label-lg text-secondary">+${r.coins} 🪙</span></div>`;
      if (r.ok) cheer(r.coins, true); else sfx('tap');
      const ok = $('#ok'); ok.innerHTML = `<span>${kt('proxima')}</span>${I('arrow_forward', 'text-[22px]')}`; ok.disabled = false; ok.onclick = () => { tickStep('q'); nextStep(); };
      setTimeout(() => fb.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    };
    draw();
  }

  /* tela "Tudo bem se enganar!" (Stitch: feedback de erro) */
  function wrongScreen(step, q, a, chip) {
    sfx('no');
    const why = (window.WHY || {})[q.id];
    const chosen = q.type === 'mc' ? q.options[a]
      : q.type === 'sort' ? q.items.map((it, i) => ({ it, put: a[i] })).filter(x => x.put !== q.buckets[x.it.b] && x.put !== x.it.b).map(x => `${x.it.t} → ${x.put || '?'}`).join('\n')
      : q.type === 'order' && Array.isArray(a) ? a.map((t, i) => `${i + 1}. ${t}`).join('\n')
      : Array.isArray(a) ? a.join(', ') : a;
    const wrongTxt = why && why.wrong && why.wrong[chosen];
    const expl = q.explain || (why && why.school) || (q.after ? L(`A resposta está no texto, na página ${q.after}. Volte lá e procure as palavras da pergunta: "${A.eng.answerText(q)}".`, `The answer is in the story, on page ${q.after}. Go back and look for the words from the question: "${A.eng.answerText(q)}".`)
      : L('A resposta certa está em verde acima. Leia de novo com calma e veja por que ela combina com a pergunta.', 'The right answer is in green above. Read it again calmly and see why it fits the question.'));
    const similar = !['similar', 'review'].includes(step.source) && A.eng.queueSimilar(q);
    const icons = ['cloud', 'rocket', 'pets', 'eco', 'sunny'];
    view(`${lessonTop(chip)}
      <section class="bg-surface-container-lowest rounded-3xl p-5 shadow-sm mb-4">
        <div class="flex items-center justify-between gap-2 mb-2"><span class="flex items-center gap-1.5 text-primary text-label-sm uppercase tracking-wide">${I(chip.icon, 'text-[18px]')} ${esc(chip.name)}</span>${step.source === 'review' ? `<span class="bg-error-container text-on-error-container px-2.5 py-0.5 rounded-full text-label-sm uppercase">${L('Revisão', 'Review')}</span>` : ''}</div>
        <h2 class="text-headline-lg-mobile text-on-surface mb-4">${md(q.prompt)}</h2>
        ${chosen != null && chosen !== '' ? `<div class="bg-error-container/40 rounded-2xl p-3.5 flex items-start gap-3"><div class="w-7 h-7 rounded-full bg-error text-on-error flex items-center justify-center shrink-0 mt-0.5">${I('close', 'text-[18px]')}</div><div class="min-w-0"><span class="text-label-sm text-error uppercase tracking-wide">${q.type === 'sort' ? L('Ficou no grupo errado:', 'In the wrong group:') : q.type === 'order' ? L('Sua ordem:', 'Your order:') : L('Sua escolha:', 'Your answer:')}</span><p class="text-body-md text-on-surface ${['sort', 'order'].includes(q.type) ? '' : 'line-through'} opacity-85">${md(String(chosen))}</p></div></div>` : ''}
      </section>
      <section class="bg-surface-container-lowest rounded-3xl p-6 shadow-md mb-4 relative overflow-hidden">
        <div class="absolute -right-6 -top-6 w-32 h-32 bg-secondary-container/15 rounded-full blur-2xl pointer-events-none"></div>
        <div class="flex items-center gap-3 mb-3 relative"><div class="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-sm -rotate-3">${I(icons[Math.floor(Math.random() * icons.length)], 'text-[36px]', 1)}</div>
          <div><h3 class="text-headline-lg-mobile text-secondary font-extrabold leading-tight uppercase">${L('Tudo bem se enganar!', "It's okay to make mistakes!")}</h3><p class="text-body-sm text-on-surface-variant font-semibold">${L('Quase lá! A resposta certa é:', 'Almost! The right answer is:')}</p></div></div>
        <div class="bg-primary-container/15 rounded-2xl p-4 flex items-start gap-3 mb-4 relative"><div class="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0">${I('check', 'text-[20px]', 1)}</div><p class="text-body-lg text-primary font-extrabold leading-snug">${md(A.eng.answerText(q))}</p></div>
        ${expl || wrongTxt ? `<div class="bg-surface-container-low rounded-2xl overflow-hidden mb-4 relative">
          <button id="why" type="button" aria-expanded="false" class="w-full p-4 flex items-center justify-between text-left"><span class="flex items-center gap-2 text-tertiary">${I('lightbulb', 'text-[24px]', 1)}<span class="text-headline-md">${L('Por que isso acontece?', 'Why is that?')}</span></span>${I('expand_more', 'text-tertiary transition-transform', 0).replace('class="', 'id="whyi" class="')}</button>
          <div id="whyt" class="px-4 pb-4 pt-1 space-y-2 hidden">${wrongTxt ? `<p class="text-body-md text-on-surface leading-relaxed">${md(wrongTxt)}</p>` : ''}${expl ? `<p class="text-body-md text-on-surface leading-relaxed">${md(expl)}</p>` : ''}
            ${q.hint ? `<div class="bg-secondary-fixed/50 rounded-xl p-3 flex items-start gap-2.5">${I('travel_explore', 'text-on-secondary-fixed text-[20px] shrink-0')}<p class="text-body-sm text-on-secondary-fixed font-bold">${L('Dica do explorador', "Explorer's tip")}: ${md(q.hint)}</p></div>` : ''}</div></div>` : ''}
        <div class="flex items-center justify-center text-center p-3 rounded-2xl bg-surface-container text-on-surface-variant gap-2 relative">${I('auto_awesome', 'text-[20px] text-secondary-container', 1)}<span class="text-label-md">${similar ? L('Agora você vai tentar uma parecida. Você consegue!', "Next, you'll try a similar one. You've got this!") : L('Errar faz parte de aprender!', 'Mistakes are part of learning!')}</span></div>
      </section>
      ${nearBottom(btnPrimary('ok', L('Continuar', 'Continue'), 'arrow_forward'))}`);
    wireTop();
    const w = $('#why'); if (w) w.onclick = () => { const open = $('#whyt').classList.toggle('hidden') === false; w.setAttribute('aria-expanded', open); $('#whyi').style.transform = open ? 'rotate(180deg)' : ''; };
    $('#ok').onclick = () => { tickStep('q'); nextStep(); };
  }
  /* desenho do prisma (caixa) para as perguntas de volume */
  function boxSVG(bx, tag) {
    const { l, w, h } = bx;
    const s = Math.max(10, Math.min(36, 260 / (l + w * 0.6), 170 / (h + w * 0.35)));
    const Lw = l * s, Hh = h * s, D = w * s * 0.6, dx = D * 0.866, dy = D * 0.5;
    const padL = bx.labels ? 46 : 12, padT = 14 + (tag ? 20 : 0), x0 = padL, y0 = padT + dy + Hh;
    const W = padL + Lw + dx + (bx.labels ? 70 : 14), Ht = y0 + (bx.labels ? 30 : 12);
    const pt = q => q.map(v => v.toFixed(1)).join(',');
    const ST = 'rgb(var(--c-primary))';
    const poly = (pts, fill) => `<polygon points="${pts.map(pt).join(' ')}" fill="${fill}" stroke="${ST}" stroke-width="2" stroke-linejoin="round"/>`;
    let g = '';
    g += poly([[x0, y0], [x0 + Lw, y0], [x0 + Lw, y0 - Hh], [x0, y0 - Hh]], 'rgb(var(--c-primary-fixed))');
    g += poly([[x0, y0 - Hh], [x0 + Lw, y0 - Hh], [x0 + Lw + dx, y0 - Hh - dy], [x0 + dx, y0 - Hh - dy]], 'rgb(var(--c-surface-container-high))');
    g += poly([[x0 + Lw, y0], [x0 + Lw + dx, y0 - dy], [x0 + Lw + dx, y0 - Hh - dy], [x0 + Lw, y0 - Hh]], 'rgb(var(--c-primary-fixed-dim))');
    if (bx.cubes) {
      const ln = (p1, p2) => `<line x1="${p1[0].toFixed(1)}" y1="${p1[1].toFixed(1)}" x2="${p2[0].toFixed(1)}" y2="${p2[1].toFixed(1)}" stroke="${ST}" stroke-width="1" opacity=".55"/>`;
      for (let i = 1; i < l; i++) { const x = x0 + i * s; g += ln([x, y0], [x, y0 - Hh]) + ln([x, y0 - Hh], [x + dx, y0 - Hh - dy]); }
      for (let j = 1; j < h; j++) { const y = y0 - j * s; g += ln([x0, y], [x0 + Lw, y]) + ln([x0 + Lw, y], [x0 + Lw + dx, y - dy]); }
      for (let k = 1; k < w; k++) { const ox = dx * k / w, oy = dy * k / w; g += ln([x0 + ox, y0 - Hh - oy], [x0 + Lw + ox, y0 - Hh - oy]) + ln([x0 + Lw + ox, y0 - oy], [x0 + Lw + ox, y0 - Hh - oy]); }
    }
    if (bx.labels) {
      const u = bx.unit && bx.unit !== 'units' ? ' ' + esc(bx.unit) : '';
      const t = (x, y, tx, anchor) => `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" font-size="15" font-weight="800" fill="rgb(var(--c-on-surface))" font-family="Nunito Sans, sans-serif">${tx}</text>`;
      g += t(x0 + Lw / 2, y0 + 22, l + u, 'middle');
      g += t(x0 - 8, y0 - Hh / 2 + 5, h + u, 'end');
      g += t(x0 + Lw + dx / 2 + 8, y0 - dy / 2 + 14, w + u, 'start');
    }
    if (tag) g += `<text x="${(x0 + Lw / 2).toFixed(1)}" y="16" text-anchor="middle" font-size="16" font-weight="800" fill="rgb(var(--c-secondary))" font-family="Nunito Sans, sans-serif">${tag}</text>`;
    return `<svg viewBox="0 0 ${W.toFixed(0)} ${Ht.toFixed(0)}" class="max-w-full h-auto" style="width:${Math.min(W, 380).toFixed(0)}px;max-height:${tag ? 150 : 200}px" role="img" aria-label="${l} × ${w} × ${h}">${g}</svg>`;
  }
  function figure(f) {
    if (!f) return '';
    if (f.kind === 'box') return `<div class="flex justify-center bg-surface-container-low rounded-2xl p-3">${boxSVG(f)}</div>`;
    if (f.kind === 'two') {
      const a = Object.assign({}, f.a, f.unit ? { unit: f.unit } : {}), b = Object.assign({}, f.b, f.unit ? { unit: f.unit } : {});
      return `<div class="flex flex-wrap items-center justify-center gap-2 bg-surface-container-low rounded-2xl p-3">${boxSVG(a, L('Figura A', 'Figure A'))}<span class="text-headline-lg text-primary">+</span>${boxSVG(b, L('Figura B', 'Figure B'))}</div>`;
    }
    return '';
  }

  /* ---- Ligue os pontos (linhas curvas coloridas) ---- */
  /* ---- sons baixinhos (gerados no próprio app) e comemoração curta ---- */
  const somOn = () => { try { return localStorage.getItem('qk.som') !== '0'; } catch (e) { return true; } };
  let AC = null;
  function sfx(kind) {
    if (!somOn()) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume();
      const notes = { ok: [[660, 0], [880, 0.09]], no: [[330, 0], [262, 0.12]], tap: [[520, 0]], coin: [[988, 0], [1319, 0.07]], done: [[523, 0], [659, 0.12], [784, 0.24], [1047, 0.38]], badge: [[784, 0], [988, 0.1], [1175, 0.2], [1568, 0.32]] }[kind] || [[600, 0]];
      notes.forEach(([f, t0]) => {
        const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + t0;
        o.type = kind === 'no' ? 'triangle' : 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(kind === 'no' ? 0.05 : 0.07, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + (kind === 'done' || kind === 'badge' ? 0.35 : 0.22));
        o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + 0.4);
      });
    } catch (e) {}
  }
  A.sfx = sfx;
  A._steps = { match: st => { Ls = Ls || { t0: Date.now(), hidden: 0, step: st, n: 1 }; Ls.step = st; matchStep(st); } };
  // acertou: som + confete pequeno + moedinhas subindo (curto, sem exagero)
  function cheer(coins, quiet) {
    sfx('ok'); setTimeout(() => sfx('coin'), 180);
    const box = document.createElement('div'); box.className = 'cheer-burst'; box.setAttribute('aria-hidden', 'true');
    const conf = ['#feba3e', '#14a3a3', '#3e9bd0', '#e84393', '#8b72f6'];
    box.innerHTML = Array.from({ length: 14 }, (x, i) => `<i style="--a:${i * 25.7}deg;--d:${50 + (i % 4) * 14}px;background:${conf[i % 5]}"></i>`).join('') + (coins ? `<b>+${coins} 🪙</b>` : '');
    document.body.appendChild(box); setTimeout(() => box.remove(), 1100);
    if (!quiet && coins) toast('🎉 +' + coins + ' 🪙');
  }

  function matchStep(step) {
    const e = A.eng; const ws = step.words;
    const COLORS = ['#3e9bd0', '#feba3e', '#14a3a3', '#e84393', '#8b72f6', '#ef6c3a'];
    let pairs = {}, selL = null, selR = null, mistakes = 0, round = 0, checked = false;
    // variações quando erra: troca a ordem, inverte os lados e usa outra explicação da palavra (se houver)
    const defOf = w => { const alts = (e.defAlts && e.defAlts[w.toLowerCase()]) || []; const all = [e.defs[w.toLowerCase()] || ''].concat(alts).filter(Boolean); return all[round % all.length] || ''; };
    let order = { L: ws.slice(), R: shuffle(ws.slice()) }, flip = false;
    const colorOf = w => COLORS[ws.indexOf(w) % COLORS.length];
    const card = (side, w, i) => {
      const isWord = (side === 'L') !== flip;
      return `<button data-${side.toLowerCase()}="${esc(w)}" class="mt-card w-full min-h-[76px] flex items-center gap-3 px-3 py-3 rounded-xl bg-surface-container-lowest text-left border-2 border-transparent shadow-sm transition">
        ${side === 'L' ? `<span class="text-label-sm text-primary shrink-0">0${i + 1}</span>` : '<span data-badge class="hidden shrink-0 w-7 h-7 rounded-full text-white text-label-sm items-center justify-center"></span>'}
        <span class="min-w-0 ${isWord ? 'text-label-lg' : 'text-body-sm'} text-on-surface break-words">${esc(isWord ? w : defOf(w))}</span></button>`;
    };
    const draw = () => {
      view(`${lessonTop({ icon: 'hub', name: L('Jogo de conexão', 'Matching game') })}
        <div class="bg-surface-container-lowest rounded-2xl p-5 shadow-sm mb-4">
          <div class="flex items-center gap-2 mb-1"><span class="inline-flex items-center gap-1 bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-1 rounded-full text-label-sm">${I('hub', 'text-[14px]')} ${L('Jogo de conexão', 'Matching game')}</span>${round ? `<span class="text-label-sm text-secondary">${L('Nova rodada', 'New round')} ${round + 1} 🔄</span>` : ''}</div>
          <h2 class="text-headline-lg-mobile md:text-headline-lg text-on-surface">${flip ? L('Ligue cada significado à sua palavra!', 'Match each meaning to its word!') : L('Ligue cada palavra ao seu significado!', 'Match each word to its meaning!')}</h2>
          <p class="text-body-sm text-on-surface-variant">${L('Toque num cartão e depois no outro. Mudou de ideia? Toque de novo para desfazer.', 'Tap one card, then the other. Changed your mind? Tap again to undo.')}</p></div>
        <div id="mw" class="match-wrap grid grid-cols-2 gap-x-8 md:gap-x-16 gap-y-3"><svg id="lines"></svg>
          <div class="space-y-3">${order.L.map((w, i) => card('L', w, i)).join('')}</div>
          <div class="space-y-3">${order.R.map((w, i) => card('R', w, i)).join('')}</div></div>
        <div class="mt-4 bg-surface-container-low rounded-2xl p-3 flex items-center justify-between gap-2"><span id="mcount" class="flex items-center gap-2 text-label-md text-on-surface"></span><button id="mclr" class="text-label-sm text-primary underline">${L('Limpar', 'Clear')}</button></div>
        ${nearBottom(`<button id="ok" disabled class="btn3d w-full h-14 rounded-xl bg-primary-container text-on-primary text-headline-md flex items-center justify-center gap-2"><span>${L('Conferir conexões', 'Check matches')}</span><span>🚀</span></button>`)}`);
      wireTop(); update();
      app().querySelectorAll('[data-l]').forEach(b => b.onclick = () => tap('L', b.dataset.l));
      app().querySelectorAll('[data-r]').forEach(b => b.onclick = () => tap('R', b.dataset.r));
      $('#mclr').onclick = () => { if (checked) return; pairs = {}; selL = selR = null; update(); };
      $('#ok').onclick = check;
    };
    const rightOf = r => Object.keys(pairs).find(l => pairs[l] === r);
    function tap(side, w) {
      if (checked) return;
      if (side === 'L') {
        if (pairs[w] !== undefined) { delete pairs[w]; selL = w; }            // desfaz e deixa selecionado para ligar de novo
        else if (selR) { const old = rightOf(selR); if (old) delete pairs[old]; pairs[w] = selR; selR = selL = null; }
        else selL = selL === w ? null : w;
      } else {
        const owner = rightOf(w);
        if (selL) { if (owner) delete pairs[owner]; pairs[selL] = w; selL = null; }
        else if (owner) { delete pairs[owner]; selR = w; }
        else selR = selR === w ? null : w;
      }
      update();
    }
    function update() {
      const n = Object.keys(pairs).length;
      app().querySelectorAll('[data-l]').forEach(b => { const w = b.dataset.l, on = pairs[w] !== undefined; b.style.borderColor = selL === w ? 'rgb(var(--c-primary-container,20 163 163))' : on ? colorOf(w) : 'transparent'; b.classList.toggle('ring-2', selL === w); b.classList.toggle('ring-primary-container', selL === w); });
      app().querySelectorAll('[data-r]').forEach(b => { const w = b.dataset.r, owner = rightOf(w), bd = b.querySelector('[data-badge]'); b.style.borderColor = selR === w ? 'rgb(var(--c-primary-container,20 163 163))' : owner ? colorOf(owner) : 'transparent'; b.classList.toggle('ring-2', selR === w); b.classList.toggle('ring-primary-container', selR === w); if (bd) { bd.classList.toggle('hidden', !owner); bd.classList.toggle('flex', !!owner); if (owner) { bd.style.background = colorOf(owner); bd.textContent = '0' + (order.L.indexOf(owner) + 1); } } });
      $('#mcount').innerHTML = `${I(n === ws.length ? 'check_circle' : 'link', 'text-primary text-[22px]', 1)} ${n} ${L('de', 'of')} ${ws.length} ${L('ligados', 'connected')}`;
      $('#ok').disabled = n !== ws.length; lines();
    }
    function check() {
      checked = true; const wrong = ws.filter(w => pairs[w] !== w);
      lines(true);
      app().querySelectorAll('[data-l]').forEach(b => { const ok = pairs[b.dataset.l] === b.dataset.l; b.style.borderColor = ok ? '#22a06b' : '#e5484d'; b.classList.toggle('shake', !ok); });
      if (!wrong.length) { tickStep('q'); sfx('ok'); const rr = e.recordMatch(step, mistakes); persist(false); cheer(rr.coins); setTimeout(nextStep, 900); return; }
      mistakes += wrong.length; sfx('no');
      $('#mcount').innerHTML = `${I('refresh', 'text-error text-[22px]')} ${wrong.length} ${wrong.length === 1 ? L('ligação errada', 'wrong match') : L('ligações erradas', 'wrong matches')}. ${L('Vamos de novo, de outro jeito!', "Let's try again, a new way!")}`;
      $('#ok').disabled = true;
      setTimeout(() => { round++; flip = !flip; pairs = {}; selL = selR = null; checked = false; order = { L: shuffle(ws.slice()), R: shuffle(ws.slice()) }; if (flip) order = { L: order.R, R: order.L }; draw(); }, 1800);
    }
    const lines = showResult => {
      const wrap = $('#mw'), svg = $('#lines'); if (!wrap || !svg) return;
      const W = wrap.getBoundingClientRect(); let out = '';
      Object.keys(pairs).forEach(l => {
        const r = pairs[l], ea = wrap.querySelector(`[data-l="${CSS.escape(l)}"]`), eb = wrap.querySelector(`[data-r="${CSS.escape(r)}"]`); if (!ea || !eb) return;
        const a = ea.getBoundingClientRect(), b = eb.getBoundingClientRect();
        const col = showResult ? (l === r ? '#22a06b' : '#e5484d') : colorOf(l);
        const x1 = a.right - W.left - 6, y1 = a.top + a.height / 2 - W.top, x2 = b.left - W.left + 6, y2 = b.top + b.height / 2 - W.top, dx = (x2 - x1) * 0.55;
        out += `<path d="M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}" stroke="${col}" stroke-width="5" fill="none" stroke-linecap="round" ${showResult && l !== r ? 'stroke-dasharray="8 6"' : ''}/><circle cx="${x1}" cy="${y1}" r="6" fill="${col}"/><circle cx="${x2}" cy="${y2}" r="6" fill="${col}"/>`;
      });
      svg.innerHTML = out;
    };
    window.onresize = () => { if (Ls && Ls.step === step) lines(); };
    draw();
  }

  /* ---- lição completa ---- */
  function finish(partial) {
    const e = A.eng; if (!e.s) return kidHome();
    if (rec && rec.state === 'recording') try { rec.stop(); } catch (x) {}
    stopSpeak();
    const r = persist(true); const S = e.s; e.s = null; Ls = null; window.onresize = null;
    if (S.simulado && !partial) return simResult(S, r);
    if (partial || !S.items.length && !S.pagesSec.length) return kidHome();
    const B = QKEngine.BADGES, p = e.prog;
    const s3 = r.stars >= 4 ? 3 : r.stars >= 3 ? 2 : 1;
    const conf = ['#feba3e', '#14a3a3', '#3e9bd0', '#ffb4a9', '#a855f7'];
    const confetti = Array.from({ length: 22 }, (x, i) => `<div class="confetti-particle ${i % 2 ? 'rounded-full' : 'rounded-sm'}" style="left:${(i * 37) % 92 + 4}%;top:-10px;width:${5 + i % 4}px;height:${6 + (i * 3) % 7}px;background:${conf[i % 5]};--sway-x:${(i % 2 ? -1 : 1) * (12 + i % 10)}px;--rot:${(i % 2 ? -1 : 1) * (160 + i * 9)}deg;animation-duration:${3.5 + (i % 6) * 0.2}s;animation-delay:${(i * 0.17).toFixed(2)}s"></div>`).join('');
    const star = (on, big) => `<div class="${big ? 'w-[72px] h-[72px] -mt-3 scale-110 bg-secondary-container shadow-md' : 'w-14 h-14 bg-secondary-fixed shadow-sm'} rounded-full flex items-center justify-center ${on ? '' : 'opacity-30 grayscale'}">${I('star', `${big ? 'text-[44px]' : 'text-[36px]'} text-on-secondary-container`, 1)}</div>`;
    const mins = Math.max(1, Math.round(S.sec / 60));
    setTimeout(() => sfx(e.goalDone() ? 'done' : 'ok'), 250); if (r.newBadges.length) setTimeout(() => sfx('badge'), 900);
    const skills = Array.from(new Set(S.items.map(i => i.skill).filter(Boolean))).slice(0, 2).map(s => skillInfo(s).name);
    view(`<main class="pt-10 pb-10 px-margin max-w-2xl mx-auto">
      <div class="flex flex-col items-center text-center pt-6 pb-2 mb-6 relative"><div aria-hidden="true" class="absolute inset-x-0 top-6 h-72 pointer-events-none overflow-hidden">${confetti}</div>
        <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-surface-container-highest shadow-sm mb-3 relative">${I('stars', 'text-[18px] text-primary', 1)}<span class="text-label-md text-on-surface-variant uppercase tracking-wider">${L('Missão cumprida! ✨', 'Mission complete! ✨')}</span></span>
        <h2 class="text-headline-xl-mobile md:text-headline-xl text-on-surface mb-2 relative">${kt('completa')}</h2>
        <p class="text-body-md text-on-surface-variant max-w-[320px] relative">${L(`Você arrasou nos desafios de hoje, ${esc(A.kid.apelido)}!`, `You crushed today's challenges, ${esc(A.kid.apelido)}!`)}</p></div>
      ${e.goalDone() ? (() => { const gm = e.goalMin(), tm = e.minutesToday(), ex = Math.max(0, tm - gm); return `<div class="done-card rounded-3xl p-5 mb-5 text-center relative overflow-hidden">
        <div class="flex items-center justify-center gap-3 mb-2"><span class="w-12 h-12 rounded-full bg-primary-fixed/70 flex items-center justify-center text-[26px]">${esc(A.kid.avatar || '⭐')}</span><span class="done-stamp">${L('FEITO', 'DONE')} ✅</span></div>
        <p class="text-headline-md text-on-surface">${L(`Lição de hoje completa, ${esc(A.kid.apelido)}!`, `Today's lesson done, ${esc(A.kid.apelido)}!`)}</p>
        <p class="text-label-lg text-on-surface-variant capitalize mt-1">${dayStamp()}</p>
        <div class="flex justify-center gap-2 mt-3 flex-wrap"><span class="px-3 py-1 rounded-full bg-surface-container-lowest text-label-md text-on-surface">⏱️ ${tm} min</span><span class="px-3 py-1 rounded-full bg-surface-container-lowest text-label-md text-on-surface">✏️ ${e.stepsToday()} ${L('atividades', 'activities')}</span>${ex ? `<span class="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-md">⭐ +${ex} min ${L('extra', 'extra')}</span>` : ''}</div>
        <p class="text-body-sm text-on-surface-variant mt-3">${L('Mostre esta tela para seus pais! 📱', 'Show this screen to your parents! 📱')}</p></div>`; })() : ''}
      <div class="bg-surface-container-lowest rounded-xl p-5 mb-5 soft-shadow flex flex-col items-center"><div class="flex items-end justify-center gap-3 mb-3">${star(s3 >= 1)}${star(s3 >= 2, true)}${star(s3 >= 3)}</div>
        <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-full">${I('verified', 'text-[16px] text-primary', 1)}<span class="text-label-md text-primary">${s3} ${L('de 3 estrelas conquistadas!', 'of 3 stars earned!')}</span></span></div>
      ${r.newBadges.map(b => `<div class="bg-surface-container-highest rounded-xl p-4 mb-5 shadow-sm flex items-center gap-4"><div class="w-14 h-14 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 text-3xl">${B[b] ? B[b][0] : '🏅'}</div>
        <div class="flex-1 min-w-0"><div class="flex items-center gap-1.5 mb-0.5"><span class="w-2 h-2 rounded-full bg-primary-container"></span><span class="text-label-sm text-on-surface-variant uppercase tracking-wide">${L('Novo desbloqueio', 'New unlock')}</span></div><h3 class="text-label-lg text-on-surface truncate">${L('Medalha', 'Badge')} "${B[b] ? B[b][isPt() ? 1 : 2] : b}"</h3></div></div>`).join('')}
      <div class="mb-5"><div class="flex items-center gap-2 mb-3">${I('card_giftcard', 'text-[20px] text-secondary', 1)}<h3 class="text-headline-md text-on-surface">${L('Recompensas da missão', 'Mission rewards')}</h3></div>
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div class="bg-surface-container-lowest rounded-xl p-4 shadow-sm"><div class="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center mb-2">${I('monetization_on', 'text-[24px] text-on-secondary-fixed-variant', 1)}</div><span class="text-headline-lg-mobile text-on-secondary-container block">+${r.coins}</span><span class="text-body-sm text-on-surface-variant">${kt('moedas')}</span></div>
          <div class="bg-surface-container-lowest rounded-xl p-4 shadow-sm"><div class="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center mb-2">${I('bolt', 'text-[24px] text-tertiary', 1)}</div><span class="text-headline-lg-mobile text-tertiary block">${p.points}</span><span class="text-body-sm text-on-surface-variant">${L('moedas no total', 'total coins')}</span></div></div>
        <div class="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex items-center justify-between"><div class="flex items-center gap-3 min-w-0"><div class="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">${I('local_fire_department', 'text-[28px] text-secondary', 1)}</div>
          <div class="min-w-0"><h4 class="text-label-lg text-on-surface">${p.streak || 0} ${(p.streak || 0) === 1 ? L('dia seguido!', 'day in a row!') : L('dias seguidos!', 'days in a row!')}</h4><p class="text-body-sm text-on-surface-variant truncate">${e.goalDone() ? L('Meta de hoje cumprida 🎯', "Today's goal done 🎯") : L('Volte amanhã para continuar a sequência', 'Come back tomorrow to keep it going')}</p></div></div>
          ${(p.streak || 0) >= 3 ? `<span class="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-label-sm shrink-0 ml-2">${L('Em chamas 🔥', 'On fire 🔥')}</span>` : ''}</div></div>
      <div class="bg-surface-container-lowest rounded-xl p-4 mb-6 shadow-sm">
        <div class="flex items-center justify-between mb-4"><div class="flex items-center gap-2"><div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">${I('insights', 'text-[20px]', 1)}</div><h4 class="text-label-lg text-on-surface">${L('Resumo do dia', "Today's summary")}</h4></div>
          <span class="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-primary text-label-sm">${r.pct >= 85 ? L('Excelente!', 'Excellent!') : r.pct >= 60 ? L('Muito bem!', 'Well done!') : L('Continue treinando!', 'Keep practicing!')}</span></div>
        <div class="mb-4"><div class="flex justify-between items-center mb-1.5"><span class="text-label-md text-on-surface">${L('Precisão de acertos', 'Accuracy')}</span><span class="text-label-md text-primary">${r.right} ${L('de', 'of')} ${r.total} (${r.pct}%)</span></div>
          <div class="w-full h-3 bg-surface-container-high rounded-full overflow-hidden"><div class="h-full bg-primary-container rounded-full" style="width:${r.pct}%"></div></div></div>
        <div class="grid grid-cols-2 gap-2"><div class="bg-surface-container-low rounded-lg p-3"><div class="flex items-center gap-1.5 mb-1 text-on-surface-variant">${I('schedule', 'text-[16px]')}<span class="text-label-sm">${L('Tempo', 'Time')}</span></div><p class="text-label-md text-on-surface">${mins} min</p></div>
          <div class="bg-surface-container-low rounded-lg p-3"><div class="flex items-center gap-1.5 mb-1 text-on-surface-variant">${I('psychology', 'text-[16px]')}<span class="text-label-sm">${L('Habilidades', 'Skills')}</span></div><p class="text-label-md text-on-surface truncate">${esc(skills[0] || '—')}</p><p class="text-body-sm text-on-surface-variant truncate">${esc(skills[1] || '')}</p></div></div></div>
      <div class="flex flex-col gap-3">${btnPrimary('home', kt('voltarHoje'), `<span class="material-symbols-outlined text-[22px] fill">home</span>`)}${btnSoft('more', kt('praticarMais').replace('🔁 ', ''), 'replay')}</div>
    </main>`);
    $('#home').onclick = kidHome; $('#more').onclick = () => runLesson({ more: true });
  }

  window.addEventListener('pagehide', () => { if (A.eng && A.eng.s && A.eng.s.items.length) { const r = A.eng.finish(true); DB.ins('tentativas', r.att, { upsert: true, onConflict: 'id' }).catch(() => {}); A.saveProg(true); } });
  document.addEventListener('DOMContentLoaded', boot);
})();
