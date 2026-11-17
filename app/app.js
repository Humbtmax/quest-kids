/* Quest Kids — app da criança (visual do Stitch): entrada, escolha da criança, Hoje, lição, biblioteca, prêmios, progresso */
(function () {
  'use strict';
  const { t, $, esc, md, today, addDays, shuffle, toast, Auth, DB, C } = QK;
  const A = window.QKApp = { fam: null, sub: null, kids: [], kid: null, eng: null };
  const app = () => $('#app');
  const view = html => { app().innerHTML = html; window.scrollTo(0, 0); };
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
    theme('simples', 'claro'); mode = mode || 'entrar';
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
    const m = mem.find(x => x.papel === 'dono') || mem[0];
    A.fam = { id: m.familia_id, papel: m.papel };
    const [subs, kids] = await Promise.all([DB.sel('assinaturas', { eq: { familia_id: A.fam.id } }), DB.sel('criancas', { eq: { familia_id: A.fam.id }, order: 'criado_em.asc' })]);
    A.sub = subs[0] || { plano: 'teste', status: 'trialing' };
    A.kids = kids.filter(k => !k.arquivada);
  }
  A.loadFamily = loadFamily;
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
      if (/[?&]convite=/.test(location.search) && !Auth.logged) sessionStorage.setItem('qk.convite', new URLSearchParams(location.search).get('convite'));
      if (!Auth.logged) return authScreen(/[?&]criar/.test(location.search) || sessionStorage.getItem('qk.convite') ? 'criar' : 'entrar');
      const conv = sessionStorage.getItem('qk.convite') || new URLSearchParams(location.search).get('convite');
      if (conv) { sessionStorage.removeItem('qk.convite'); try { await DB.rpc('aceitar_convite', { cod: conv }); toast('✅ ' + P('Convite aceito', 'Invite accepted')); } catch (x) { toast(x.message); } }
      await loadFamily();
      if (/[?&]pago=1/.test(location.search)) { toast(P('🎉 Assinatura confirmada! Obrigado.', '🎉 Subscription confirmed! Thank you.'), 4000); history.replaceState(null, '', location.pathname); }
      if (!A.kids.length) return QKParent.newChild(true);
      picker();
    } catch (x) {
      if (x.message === 'sessao') return authScreen('entrar');
      theme('simples');
      view(`<main class="min-h-screen flex items-center justify-center px-margin"><div class="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 soft-shadow text-center space-y-4">
        <div class="text-5xl">😕</div><p class="text-body-lg text-on-surface">${esc(traduz(x.message))}</p>${btnPrimary('r', t('continuar'))}<a href="#" id="o" class="block text-label-md text-primary underline">${t('sair')}</a></div></main>`);
      $('#r').onclick = boot; $('#o').onclick = async e => { e.preventDefault(); await Auth.signOut(); boot(); };
    }
  }
  A.boot = boot;

  /* ================= quem vai estudar ================= */
  function picker() {
    theme('simples'); A.kid = null; A.eng = null;
    const tl = A.trialLeft();
    view(`<main class="min-h-screen px-margin md:px-margin-tablet py-10 max-w-4xl mx-auto">
      <div class="flex items-center gap-3 mb-8">${logo}<span class="text-headline-md text-on-surface">Quest Kids</span></div>
      <h1 class="text-headline-xl-mobile md:text-headline-xl text-on-surface mb-2">${t('quemVaiUsar')}</h1>
      ${tl !== null ? `<div class="inline-flex items-center gap-2 bg-secondary-fixed text-on-secondary-fixed px-4 py-2 rounded-full text-label-md my-3">${I('hourglass_top', 'text-[18px]')} ${P(`Teste grátis: faltam ${tl} dias`, `Free trial: ${tl} days left`)}</div>` : ''}
      ${!A.planOk() ? `<div class="bg-secondary-fixed text-on-secondary-fixed rounded-2xl p-4 my-3 text-label-lg">💛 ${P('O teste grátis acabou. Escolha um plano na Área dos pais para continuar.', 'Your free trial ended. Pick a plan in the Parents area.')}</div>` : ''}
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        ${A.kids.map(k => `<button data-k="${k.id}" class="group bg-surface-container-lowest rounded-3xl p-5 soft-shadow flex flex-col items-center gap-3 active:scale-95 transition hover:-translate-y-0.5">
          <div class="w-24 h-24 rounded-full bg-primary-fixed/60 flex items-center justify-center text-[52px] shadow-inner">${esc(k.avatar || '⭐')}</div>
          <span class="text-headline-md text-on-surface">${esc(k.apelido)}</span>
          <span class="text-label-sm text-on-surface-variant">${k.minutos} min · ${k.idioma_app === 'en' ? 'English' : 'Português'}</span></button>`).join('')}
      </div>
      <button id="pais" class="mt-8 w-full sm:w-auto px-6 h-14 rounded-2xl bg-surface-container text-on-surface text-label-lg inline-flex items-center justify-center gap-2 hover:bg-surface-container-high">${I('shield_person', 'text-[22px] text-primary')} ${t('areaPais')}</button>
    </main>`);
    app().querySelectorAll('[data-k]').forEach(b => b.onclick = () => pinPad(A.kids.find(k => k.id === b.dataset.k)));
    $('#pais').onclick = parentGate;
  }
  A.picker = picker;

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
        ${extra || ''}<a href="#" id="v" class="block mt-5 text-label-md text-primary underline">${t('voltar')}</a></div></main>`);
      app().querySelectorAll('[data-n]').forEach(b => b.onclick = () => {
        const n = b.dataset.n;
        if (n === '←') pin = pin.slice(0, -1); else if (pin.length < 4) pin += n;
        if (pin.length === 4) { const p = pin; pin = ''; return onDone(p, draw); }
        draw();
      });
      $('#v').onclick = e => { e.preventDefault(); picker(); };
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
  async function parentGate() {
    let has;
    try { has = await DB.rpc('tem_senha_pais', {}); } catch (e) { has = null; }   // null: banco ainda sem a senha dos pais (04-senha-pais.sql)
    if (has === null) return mathGate();
    if (!has || flag('qk.novaSenha') === '1') return createParentPass(() => QKParent.open());
    padScreen(t('areaPais'), P('Digite a senha dos pais', 'Enter the parents password'), async (p, draw) => {
      const ok = await DB.rpc('conferir_senha_pais', { senha: p }).catch(() => false);
      if (ok) return QKParent.open(); draw(P('Senha errada. Tente de novo.', 'Wrong password. Try again.'));
    }, `<a href="#" id="forgot" class="block mt-5 text-label-sm text-on-surface-variant underline">${P('Esqueci a senha', 'Forgot password')}</a>`);
  }
  function mathGate() {
    const a = 6 + Math.floor(Math.random() * 4), b = 6 + Math.floor(Math.random() * 4);
    view(`<main class="min-h-screen flex items-center justify-center px-margin"><div class="w-full max-w-sm bg-surface-container-lowest rounded-3xl p-6 soft-shadow text-center space-y-4">
      <div class="w-14 h-14 mx-auto rounded-2xl bg-surface-container text-primary flex items-center justify-center">${I('lock', 'text-[30px]')}</div>
      <h2 class="text-headline-lg-mobile text-on-surface">${t('areaPais')}</h2><p class="text-body-md text-on-surface-variant">${t('paisPergunta')} <b class="text-on-surface text-headline-md">${a} × ${b} = ?</b></p>
      <input id="g" inputmode="numeric" autocomplete="off" class="${inputCls} text-center text-headline-md"><div id="e" class="text-label-md text-error min-h-[1.2em]"></div>
      ${btnPrimary('ok', t('continuar'), 'arrow_forward')}<a href="#" id="v" class="block text-label-md text-primary underline">${t('voltar')}</a></div></main>`);
    const go = () => { if (+$('#g').value === a * b) QKParent.open(); else { $('#e').textContent = t('errado'); $('#g').value = ''; } };
    $('#ok').onclick = go; $('#g').onkeydown = e => { if (e.key === 'Enter') go(); }; $('#g').focus();
    $('#v').onclick = e => { e.preventDefault(); picker(); };
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
      const [prog, lic] = await Promise.all([DB.sel('progresso', { eq: { crianca_id: kid.id, chave: 'main' } }), DB.sel('licoes', { eq: { crianca_id: kid.id }, order: 'criado_em.desc', limit: 60 })]);
      A.eng = new QKEngine(kid, prog[0] && prog[0].dados, lic);
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
        <div class="flex items-center gap-2 min-w-0">${logo}<span class="text-headline-md text-on-surface hidden sm:inline">Quest Kids</span><span class="text-label-md text-on-surface-variant truncate">${label}</span></div>
        <div class="flex items-center gap-2">
          <span class="flex items-center gap-1 bg-secondary-container/20 px-2.5 py-1 rounded-full">${I('local_fire_department', 'text-secondary text-[18px]', 1)}<span class="text-label-sm text-on-secondary-container">${p.streak || 0}</span></span>
          <span class="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full">${I('monetization_on', 'text-secondary text-[18px]', 1)}<span class="text-label-sm text-on-surface">${p.points || 0}</span></span>
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
    app().querySelectorAll('[data-nav]').forEach(b => b.onclick = () => ({ hoje: kidHome, bib: library, prem: rewards, prog: progress })[b.dataset.nav]());
    const sw = $('#sw'); if (sw) sw.onclick = () => picker();
  }
  const pageMain = inner => `<main class="pt-20 pb-32 md:pb-36 px-margin md:px-margin-tablet max-w-5xl mx-auto">${inner}</main>`;

  /* ---------- Hoje ---------- */
  function kidHome() {
    const e = A.eng, p = e.prog, goal = e.goalMin(), mins = e.minutesToday(), pct = Math.min(1, mins / goal);
    const next = e.nextReading(); const done = e.goalDone();
    const PP = Object.assign({ leitura: 40, palavras: 25, reforco: 35 }, A.kid.pilares || {}); const tot = PP.leitura + PP.palavras + PP.reforco || 100;
    const day = p.dias[today()] || {}; const pil = day.pil || {};
    const pm = k => Math.max(1, Math.round(goal * PP[k] / tot));
    const pmin = k => Math.min(pm(k), Math.round((pil[k] || 0) / 60));
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
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 bg-secondary-container/20 px-3 py-1.5 rounded-full shadow-sm">${I('local_fire_department', 'text-secondary text-[20px]', 1)}<span class="text-label-md text-on-secondary-container">${p.streak || 0} ${kt('dias')}</span></span>
            <span class="inline-flex items-center gap-1.5 bg-secondary-fixed/50 px-3 py-1.5 rounded-full shadow-sm">${I('monetization_on', 'text-secondary text-[20px]', 1)}<span class="text-label-md text-on-secondary-fixed-variant">${p.points || 0}</span></span>
          </div>
          <span class="flex items-center gap-1 bg-surface-container-high px-3 py-1 rounded-full">${I('verified', 'text-primary text-[18px]')}<span class="text-label-sm text-on-surface-variant">${kt('nivel')} ${lv.n}</span></span>
        </div>
        <div><h1 class="text-headline-xl-mobile md:text-headline-xl text-on-surface tracking-tight">${kt('ola')}, ${esc(A.kid.apelido)}! 👋</h1>
        <p class="text-body-md text-on-surface-variant">${kt('prontaMissao')}</p></div></div>`;
    const ring = `<div class="relative w-full bg-surface-container-lowest rounded-3xl p-6 soft-shadow flex flex-col items-center justify-center overflow-hidden">
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary-container/10 rounded-full blur-2xl pointer-events-none"></div>
        <div class="absolute -bottom-8 -left-8 w-28 h-28 bg-secondary-container/15 rounded-full blur-xl pointer-events-none"></div>
        <div class="relative w-52 h-52 md:w-60 md:h-60 flex items-center justify-center my-2">
          <svg class="w-full h-full -rotate-90" viewBox="0 0 160 160"><circle class="text-surface-container-high" cx="80" cy="80" r="66" fill="transparent" stroke="currentColor" stroke-width="12"></circle>
          <circle class="text-primary-container transition-all duration-700" cx="80" cy="80" r="66" fill="transparent" stroke="currentColor" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C2}" stroke-dashoffset="${(C2 * (1 - Math.max(0.03, pct))).toFixed(1)}"></circle></svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <div class="w-10 h-10 rounded-full bg-primary-container/15 flex items-center justify-center mb-1 text-primary-container">${I(done ? 'celebration' : 'school', 'text-[24px]')}</div>
            <span class="text-headline-md text-on-surface">${kt('licaoHoje')}</span>
            <span class="text-label-lg text-primary mt-0.5">${mins} ${kt('de')} ${goal} ${kt('min')}</span>
            <span class="text-label-sm text-on-surface-variant mt-1">${done ? kt('metaFeita') : mins ? L('Continue de onde parou!', 'Pick up where you left off!') : L('Falta pouco para começar!', 'Ready when you are!')}</span>
          </div></div>
        <div class="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-full">${I('timer', 'text-[16px] text-primary')}<span class="text-label-sm text-on-surface-variant">${L('Meta diária', 'Daily goal')}: ${goal} min</span></div></div>`;
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
          ${adv}
          <div class="pt-1 space-y-3">${cta}
            <div class="flex items-center justify-center gap-1.5 text-center px-4 py-1"><span class="text-body-sm text-on-surface-variant">${L(`Complete hoje para manter sua sequência de <strong class="text-on-surface">${p.streak || 0} dias</strong>!`, `Finish today to keep your <strong class="text-on-surface">${p.streak || 0}-day</strong> streak!`)}</span><span>🌟</span></div>
          </div></div></div>`)}${kidNav('hoje')}`);
    wireNav();
    const go = $('#go'); if (go) go.onclick = () => runLesson({});
    const m = $('#mais'); if (m) m.onclick = () => runLesson({ more: true });
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
          <div class="flex-1 min-w-0"><h2 class="text-headline-md text-on-surface line-clamp-2">${esc(next.title)}</h2><p class="text-body-sm text-on-surface-variant mt-0.5">${next.pages.length} ${L('página(s)', 'page(s)')} · ${next.questions.length} ${L('perguntas', 'questions')}</p></div></div>
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
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">${Object.entries(B).map(([k, v]) => { const on = p.badges.includes(k); return `<div class="rounded-2xl p-3 flex flex-col items-center text-center gap-1 ${on ? 'bg-surface-container-lowest soft-shadow' : 'bg-surface-container-low opacity-50 grayscale'}"><span class="text-3xl">${v[0]}</span><span class="text-label-sm text-on-surface leading-tight">${v[LI]}</span>${on ? '' : I('lock', 'text-[14px] text-outline')}</div>`; }).join('')}</div></section>
      ${(p.awards || []).length ? `<section><h3 class="text-headline-md text-on-surface mb-3">${kt('certificados')}</h3><div class="space-y-3">${p.awards.map(a => `<div class="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex gap-3"><span class="text-3xl">${esc(a.icon || '🏆')}</span><div class="min-w-0"><b class="text-label-lg text-on-surface block">${esc(a.title)}</b><p class="text-body-sm text-on-surface-variant">${esc(a.msg || '')}</p></div></div>`).join('')}</div></section>` : ''}
      </div></div>`)}${kidNav('prem')}`);
    wireNav();
  }

  /* ---------- Progresso ---------- */
  function progress() {
    const e = A.eng, p = e.prog, goal = e.goalMin(); const days = [];
    for (let i = 6; i >= 0; i--) { const d = addDays(today(), -i); days.push([d, Math.round(((p.dias[d] || {}).seg || 0) / 60)]); }
    const max = Math.max(goal, ...days.map(x => x[1]), 1);
    const wk = isPt() ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const sk = Object.entries(p.skills).filter(([, v]) => v.right + v.wrong > 0).sort((a, b) => (b[1].right + b[1].wrong) - (a[1].right + a[1].wrong));
    const tot = days.reduce((s, x) => s + x[1], 0);
    view(`${kidHeader(kt('progresso'))}${pageMain(`
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8 mt-2">
      <section class="bg-surface-container-lowest rounded-3xl p-5 soft-shadow space-y-4">
        <div class="flex items-start justify-between gap-2"><div><h2 class="text-headline-md text-on-surface">${kt('semanaMin')}</h2><p class="text-body-sm text-on-surface-variant">${tot} min ${L('nos últimos 7 dias', 'in the last 7 days')}</p></div>
          <span class="flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded-full text-label-sm text-on-surface"><span class="w-2.5 h-2.5 rounded-full bg-primary-container"></span>${L('Meta', 'Goal')}: ${goal} min</span></div>
        <div class="grid grid-cols-7 gap-2 items-end h-40">${days.map(([d, m]) => `<div class="flex flex-col items-center gap-1.5 h-full justify-end"><span class="text-label-sm ${m >= goal ? 'text-primary' : 'text-on-surface-variant'}">${m}</span>
          <div class="w-full max-w-[30px] rounded-t-lg ${m >= goal ? 'bg-primary-container' : 'bg-tertiary-container/70'}" style="height:${Math.max(3, Math.round(100 * m / max))}%"></div><span class="text-label-sm text-outline">${wk[new Date(d + 'T12:00').getDay()]}</span></div>`).join('')}</div>
      </section>
      <div class="space-y-5">
        <div class="grid grid-cols-3 gap-3">${[['spellcheck', Object.keys(p.wordbank).length, kt('palavras'), 'text-secondary'], ['menu_book', Object.keys(p.completed).length, L('Leituras', 'Readings'), 'text-tertiary'], ['local_fire_department', p.bestStreak || 0, L('Recorde', 'Best streak'), 'text-secondary']].map(([ic, n, l, c]) => `<div class="bg-surface-container-lowest rounded-2xl p-4 shadow-sm text-center">${I(ic, `${c} text-[24px]`, 1)}<div class="text-headline-lg-mobile text-on-surface">${n}</div><div class="text-label-sm text-on-surface-variant">${l}</div></div>`).join('')}</div>
        <section class="space-y-2"><h2 class="text-headline-md text-on-surface">${kt('habilidades')}</h2>
          ${sk.length ? sk.map(([s, v]) => { const pc = Math.round(100 * v.right / (v.right + v.wrong)); const inf = skillInfo(s); return `<div class="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-2"><div class="flex items-center justify-between gap-2"><div class="flex items-center gap-2.5 min-w-0"><div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">${I(inf.icon, 'text-[22px]')}</div><b class="text-label-lg text-on-surface truncate">${esc(inf.name)}</b></div><span class="text-label-md ${pc >= 80 ? 'text-primary' : pc >= 60 ? 'text-secondary' : 'text-error'}">${pc}%</span></div>
            <div class="w-full bg-surface-container-high rounded-full h-2 overflow-hidden"><div class="h-full rounded-full ${pc >= 80 ? 'bg-primary-container' : pc >= 60 ? 'bg-secondary-container' : 'bg-error'}" style="width:${pc}%"></div></div></div>`; }).join('') : `<p class="text-body-md text-on-surface-variant bg-surface-container-low rounded-2xl p-4">${L('Faça uma lição para ver suas habilidades aqui.', 'Do a lesson to see your skills here.')}</p>`}</section>
      </div></div>`)}${kidNav('prog')}`);
    wireNav();
  }

  /* ================= lição ================= */
  let Ls = null;
  function runLesson(opts) {
    if (!A.planOk()) return toast(kt('planoVencido'));
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
    const pct = Math.min(100, Math.round(100 * S.sec / goal));
    const totalSteps = Math.max(Ls.n + S.queue.length, Math.round(goal / 50));
    const st = { leitura: ['menu_book', kt('leitura')], palavras: ['spellcheck', kt('palavras')], reforco: ['auto_stories', kt('reforco')] }[S.station];
    return `<header class="fixed top-0 inset-x-0 z-40 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]"><div class="h-16 px-margin max-w-2xl mx-auto flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">${logo}<h1 class="text-headline-md text-on-surface truncate">${L('Sessão de estudo', 'Study session')}</h1></div>
        <div class="w-9 h-9 rounded-full bg-primary-fixed/60 flex items-center justify-center text-[20px]">${esc(A.kid.avatar || '⭐')}</div></div></header>
      <main class="pt-20 pb-36 px-margin max-w-2xl mx-auto">
      <div class="flex items-center justify-between gap-2 mb-3">
        <button id="x" aria-label="Fechar" class="w-11 h-11 flex items-center justify-center rounded-full bg-surface-container text-on-surface shadow-sm active:scale-90 shrink-0">${I('close', 'text-[20px]')}</button>
        <div class="flex items-center gap-1.5 min-w-0">
          <span class="bg-surface-container px-3 py-1.5 rounded-full text-label-sm text-on-surface shadow-sm whitespace-nowrap">${L('Passo', 'Step')} ${Ls.n} ${L('de', 'of')} ${totalSteps}</span>
          <span class="bg-surface-container-low px-3 py-1.5 rounded-full text-label-sm text-on-surface-variant flex items-center gap-1 whitespace-nowrap">${I('timer', 'text-[16px] text-tertiary')}${Math.floor(S.sec / 60)}/${Math.round(goal / 60)} min</span>
        </div>
        <span class="flex items-center gap-1 bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full text-label-sm shadow-sm whitespace-nowrap">${I('star', 'text-[16px]', 1)}+${S.earned}</span>
      </div>
      <div class="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden p-0.5 mb-4"><div class="bg-primary-container h-full rounded-full transition-all duration-500" style="width:${Math.max(3, pct)}%"></div></div>
      <div class="flex items-center gap-2 flex-wrap mb-4">
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high text-on-tertiary-fixed-variant text-label-md shadow-sm">${I(chip ? chip.icon : st[0], 'text-[16px] text-tertiary', 1)}${esc(chip ? chip.name : st[1])}</span>
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed/50 text-on-primary-fixed-variant text-label-sm">${I(st[0], 'text-[14px]')}${st[1]}</span>
      </div>`;
  }
  const lessonBottom = inner => `</main><div class="fixed bottom-0 inset-x-0 z-30 pb-safe bg-gradient-to-t from-surface via-surface to-transparent pt-6"><div class="max-w-2xl mx-auto px-margin pb-4 space-y-2">${inner}</div></div>`;
  function wireTop() {
    $('#x').onclick = () => {
      const box = document.createElement('div');
      box.className = 'fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4';
      box.innerHTML = `<div class="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 space-y-4 shadow-xl"><h3 class="text-headline-md text-on-surface">${kt('fechar')}</h3><div class="grid grid-cols-2 gap-3"><button id="no" class="h-12 rounded-2xl bg-surface-container text-on-surface text-label-lg">${kt('fecharNao')}</button><button id="yes" class="btn3d h-12 rounded-2xl bg-primary-container text-on-primary text-label-lg">${kt('fecharSim')}</button></div></div>`;
      document.body.appendChild(box); box.querySelector('#no').onclick = () => box.remove(); box.querySelector('#yes').onclick = () => { box.remove(); finish(true); };
    };
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
    const step = A.eng.next(); Ls.step = step;
    if (!step) return finish(false);
    Ls.n++;
    if (step.kind === 'page') return pageStep(step);
    if (step.kind === 'match') return matchStep(step);
    return qStep(step);
  }

  /* ---- ouvir (voz do aparelho) ---- */
  function speak(text, btn) {
    if (!('speechSynthesis' in window)) return toast(L('Seu aparelho não lê em voz alta.', "Your device can't read aloud."));
    if (speechSynthesis.speaking) { stopSpeak(); return; }
    const u = new SpeechSynthesisUtterance(String(text).replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g, '$1').replace(/[*_#>]/g, ''));
    u.lang = isPt() ? 'pt-BR' : 'en-US'; u.rate = 0.92;
    u.onend = () => btn && btn.classList.remove('ring-4');
    btn && btn.classList.add('ring-4'); speechSynthesis.speak(u);
  }
  function stopSpeak() { try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {} }

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
        <p class="text-body-md text-on-surface-variant">${aloud ? L('Toque no microfone e leia com calma, no seu ritmo.', 'Tap the mic and read calmly, at your own pace.') : L('Toque nas palavras destacadas para ver o significado.', 'Tap highlighted words to see what they mean.')}</p></div>
      <div class="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <div class="flex items-center gap-2 bg-surface-container-lowest px-3.5 py-2 rounded-xl shadow-sm min-w-0"><span class="text-[20px]">${esc(R.icon || '📖')}</span><span class="text-label-md text-on-surface truncate">${esc(R.title)}</span></div>
        <button id="ouvir" class="flex items-center gap-2 bg-tertiary-container text-on-tertiary-container px-3.5 py-2 rounded-xl text-label-md shadow-sm active:scale-95 ring-tertiary-fixed">${I('volume_up', 'text-[18px]')}<span>${L('Ouvir exemplo', 'Listen')}</span></button></div>
      <div class="bg-surface-container-lowest rounded-2xl p-5 md:p-6 soft-shadow mb-5 space-y-4">
        <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-primary-container"></span><span class="text-label-sm text-on-surface-variant uppercase tracking-wider">${kt('pagina')} ${n} ${L('de', 'of')} ${R.pages.length}</span></div>
        ${R.wordParts && n === 1 ? `<div class="flex flex-wrap gap-1.5">${R.wordParts.map(w => `<span class="bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-1 rounded-lg text-label-sm">${esc(w[0])} = ${esc(w[1])}</span>`).join('')}</div>` : ''}
        <div class="text-body-lg md:text-[20px] md:leading-[32px] text-on-surface leading-relaxed space-y-3"><p>${md(text)}</p></div>
        ${R.image && n === 1 ? `<div class="w-full h-40 rounded-xl overflow-hidden"><img class="w-full h-full object-cover" src="${esc(R.image)}" alt=""></div>` : ''}
        ${R.audio && n === 1 ? `<audio controls preload="none" src="${esc(R.audio)}" class="w-full"></audio>` : ''}
        <div class="flex items-center justify-between text-label-sm text-on-surface-variant bg-surface-container-low px-3 py-2 rounded-xl"><span>💡 ${L('Dica: faça uma pausa suave na vírgula!', 'Tip: pause gently at commas!')}</span><span class="text-primary">${words} ${L('palavras', 'words')}</span></div>
      </div>
      ${aloud ? `<div class="bg-surface-container-lowest rounded-2xl p-5 shadow-sm mb-5 flex flex-col items-center text-center">
        <div class="w-full flex items-center justify-between mb-4">
          <span id="rect" class="flex items-center gap-1.5 bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-label-sm">${I('mic', 'text-[14px]')} 00:00</span>
          <span id="sig" class="flex items-center gap-1 text-label-sm text-on-surface-variant">${I('graphic_eq', 'text-[16px] text-primary-container')} ${has ? kt('gravado') : L('Pronto para gravar', 'Ready to record')}</span></div>
        <div id="wave" class="w-full h-14 bg-surface-container-low rounded-xl flex items-center justify-center gap-1.5 px-4 mb-5 overflow-hidden">${Array.from({ length: 15 }, (x, i) => `<div class="w-1.5 rounded-full ${['bg-primary-container', 'bg-tertiary-container', 'bg-primary'][i % 3]}" style="height:6px"></div>`).join('')}</div>
        <div class="relative flex items-center justify-center my-2"><div id="ping" class="absolute w-24 h-24 rounded-full bg-error-container opacity-60 hidden animate-ping"></div>
          <button id="rec" aria-label="Microfone" class="btn3d relative z-10 w-20 h-20 rounded-full bg-primary-container text-on-primary flex items-center justify-center">${I('mic', 'text-[36px]', 1)}</button></div>
        <p id="recst" class="text-label-md text-on-surface mt-4">${has ? kt('gravado') + ' ' + L('Toque para gravar de novo.', 'Tap to record again.') : L('Toque no microfone para começar', 'Tap the mic to start')}</p>
        <p class="text-body-sm text-on-surface-variant mt-0.5">${L('Toque de novo para parar', 'Tap again to stop')}</p></div>` : ''}
      ${lessonBottom(`${btnPrimary('ok', L('Pronto! Continuar', 'Done! Continue'), 'arrow_forward')}`)}`);
    wireTop();
    $('#ouvir').onclick = ev => R.audio && n === 1 ? (app().querySelector('audio') || {}).play && app().querySelector('audio').play() : speak(text, ev.currentTarget);
    if (aloud) $('#rec').onclick = () => toggleRec(n);
    $('#ok').onclick = () => {
      if (rec && rec.state === 'recording') { rec.stop(); setTimeout(() => $('#ok') && $('#ok').click(), 700); return; }
      stopSpeak();
      const sec = stepSecs(); A.eng.tick(sec, 'page'); S.pagesSec.push({ n, sec: Math.round(sec), aloud: !!S.pageRec.find(r => r.page === n) });
      if (S.pageRec.find(r => r.page === n)) S.earned += 10;
      persist(false); nextStep();
    };
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
        if (an) { an.getByteFrequencyData(data); bars.forEach((b, i) => { b.style.height = Math.max(6, Math.min(48, (data[i + 1] || 0) / 4.5)) + 'px'; }); const avg = data.reduce((a, b) => a + b, 0) / data.length; if (sig) sig.innerHTML = `${I('graphic_eq', 'text-[16px] text-primary-container')} ${avg > 25 ? L('Sinal do microfone ótimo', 'Great mic signal') : L('Fale um pouco mais alto', 'Speak a bit louder')}`; }
        raf = requestAnimationFrame(loop);
      };
      rec.ondataavailable = ev => ev.data.size && chunks.push(ev.data);
      rec.onstop = async () => {
        cancelAnimationFrame(raf); try { ctx && ctx.close(); } catch (e) {}
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
      rec.start(); ping && ping.classList.remove('hidden'); btn.innerHTML = I('stop', 'text-[36px]', 1); btn.classList.add('bg-error');
      st.textContent = L('Gravando sua voz… Fale com clareza!', 'Recording… Speak clearly!'); loop();
    } catch (x) { st.textContent = kt('semMic'); }
  }

  /* ---- pergunta (Stitch: questão + feedback de erro) ---- */
  function qStep(step) {
    const q = step.q;
    let ans = null, hint = false, answered = false;
    const order = q.type === 'mc' ? shuffle(q.options.map((o, i) => i)) : null;
    const tiles = (q.type === 'order' || q.type === 'sort') ? shuffle(q.items.map((x, i) => i)) : null;
    const picked = [], placed = {}; let selTile = null;
    const chip = skillInfo(q.skill);
    const instr = { order: kt('ordene'), sort: kt('separe') }[q.type] || '';
    const badge = step.source === 'similar' ? `<span class="bg-secondary-fixed text-on-secondary-fixed px-2.5 py-0.5 rounded-full text-label-sm uppercase tracking-wide">${L('Parecida', 'Similar')}</span>`
      : (step.source === 'review' || step.source === 'wordrev') ? `<span class="bg-error-container text-on-error-container px-2.5 py-0.5 rounded-full text-label-sm uppercase tracking-wide">${L('Revisão', 'Review')}</span>` : '';
    const ready = () => q.type === 'mc' ? ans !== null : q.type === 'num' || q.type === 'text' ? !!String(ans || '').trim() : q.type === 'order' ? picked.length === q.items.length : q.type === 'sort' ? Object.keys(placed).length === q.items.length : false;
    const optCls = (sel) => `relative w-full flex items-center justify-between min-h-[64px] px-4 py-3.5 rounded-xl bg-surface-container-lowest text-left transition-all active:scale-[0.98] ${sel ? 'shadow-[0_4px_16px_rgba(20,163,163,0.14)] ring-2 ring-primary-container' : 'shadow-[0_2px_8px_rgba(0,0,0,0.05)]'}`;
    const body = () => {
      if (q.type === 'mc') return `<div class="grid gap-3.5 ${q.options.every(o => String(o).length < 28) ? 'md:grid-cols-2' : ''}">${order.map((i, k) => `<button data-i="${i}" class="${optCls(ans === i)}">
          <span class="flex items-center gap-3.5 flex-1 min-w-0 pr-2"><span class="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-label-lg ${ans === i ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-on-surface-variant'}">${'ABCDEF'[k]}</span><span class="text-body-md text-on-surface leading-snug ${ans === i ? 'font-bold' : ''}">${md(q.options[i])}</span></span>
          <span class="w-6 h-6 shrink-0 rounded-full flex items-center justify-center ${ans === i ? 'bg-primary-container' : 'bg-surface-container'}">${ans === i ? I('check', 'text-[16px] text-white') : ''}</span></button>`).join('')}</div>`;
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
        ${lessonBottom(`<button id="ok" type="button" ${ready() ? '' : 'disabled'} class="btn3d w-full h-14 rounded-xl bg-primary-container text-on-primary text-headline-md flex items-center justify-center gap-2"><span>${kt('conferir')}</span>${I('arrow_forward', 'text-[22px]')}</button>`)}`);
      wireTop(); wire();
    };
    const wire = () => {
      app().querySelectorAll('[data-i]').forEach(b => b.onclick = () => { if (answered) return; ans = +b.dataset.i; draw(); });
      const inp = $('#in'); if (inp) { inp.oninput = () => { ans = inp.value; $('#ok').disabled = !ready(); }; if (q.type === 'num') inp.onkeydown = e => { if (e.key === 'Enter' && ready()) $('#ok').click(); }; }
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
      if (r.ok === false) return wrongScreen(step, q, a, chip);
      app().querySelectorAll('#ans button, #ans input, #ans textarea').forEach(x => x.disabled = true);
      if (q.type === 'mc') app().querySelectorAll('[data-i]').forEach(b => { if (+b.dataset.i === (q.answer || 0)) b.classList.add('ring-2', 'ring-primary-container', 'bg-primary-container/10'); });
      const fb = $('#fb');
      const msgs = kt('acertou');
      fb.innerHTML = r.ok === null
        ? `<div class="mt-5 bg-tertiary-fixed text-on-tertiary-fixed rounded-2xl p-4 flex items-center gap-3">${I('edit_note', 'text-[28px]')}<span class="text-label-lg">${kt('enviado')}</span></div>`
        : `<div class="mt-5 bg-primary-container/15 rounded-2xl p-4 flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0">${I('check', 'text-[24px]', 1)}</div><div class="flex-1"><p class="text-headline-md text-primary">${msgs[Math.floor(Math.random() * msgs.length)]}</p>${q.explain ? `<p class="text-body-sm text-on-surface-variant mt-0.5">${md(q.explain)}</p>` : ''}</div><span class="text-label-lg text-secondary">+${r.coins} 🪙</span></div>`;
      const ok = $('#ok'); ok.innerHTML = `<span>${kt('proxima')}</span>${I('arrow_forward', 'text-[22px]')}`; ok.disabled = false; ok.onclick = () => { stepSecs(); nextStep(); };
      setTimeout(() => fb.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    };
    draw();
  }

  /* tela "Tudo bem se enganar!" (Stitch: feedback de erro) */
  function wrongScreen(step, q, a, chip) {
    const why = (window.WHY || {})[q.id];
    const chosen = q.type === 'mc' ? q.options[a] : Array.isArray(a) ? a.join(' → ') : a;
    const wrongTxt = why && why.wrong && why.wrong[chosen];
    const expl = q.explain || (why && why.school) || '';
    const similar = !['similar', 'review'].includes(step.source) && A.eng.queueSimilar(q);
    const icons = ['cloud', 'rocket', 'pets', 'eco', 'sunny'];
    view(`${lessonTop(chip)}
      <section class="bg-surface-container-lowest rounded-3xl p-5 shadow-sm mb-4">
        <div class="flex items-center justify-between gap-2 mb-2"><span class="flex items-center gap-1.5 text-primary text-label-sm uppercase tracking-wide">${I(chip.icon, 'text-[18px]')} ${esc(chip.name)}</span>${step.source === 'review' ? `<span class="bg-error-container text-on-error-container px-2.5 py-0.5 rounded-full text-label-sm uppercase">${L('Revisão', 'Review')}</span>` : ''}</div>
        <h2 class="text-headline-lg-mobile text-on-surface mb-4">${md(q.prompt)}</h2>
        ${chosen != null && chosen !== '' ? `<div class="bg-error-container/40 rounded-2xl p-3.5 flex items-start gap-3"><div class="w-7 h-7 rounded-full bg-error text-on-error flex items-center justify-center shrink-0 mt-0.5">${I('close', 'text-[18px]')}</div><div class="min-w-0"><span class="text-label-sm text-error uppercase tracking-wide">${L('Sua escolha:', 'Your answer:')}</span><p class="text-body-md text-on-surface line-through opacity-85">${md(String(chosen))}</p></div></div>` : ''}
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
      ${lessonBottom(btnPrimary('ok', L('Continuar', 'Continue'), 'arrow_forward'))}`);
    wireTop();
    const w = $('#why'); if (w) w.onclick = () => { const open = $('#whyt').classList.toggle('hidden') === false; w.setAttribute('aria-expanded', open); $('#whyi').style.transform = open ? 'rotate(180deg)' : ''; };
    $('#ok').onclick = () => { stepSecs(); nextStep(); };
  }
  function figure(f) {
    if (f.kind === 'box') return `📦 ${f.labels ? `${f.l} × ${f.w} × ${f.h} ${esc(f.unit)}` : ''}`;
    if (f.kind === 'two') return `📦 ${f.a.join(' × ')} + 📦 ${f.b.join(' × ')} ${esc(f.unit)}`;
    return '';
  }

  /* ---- Ligue os pontos (linhas curvas coloridas) ---- */
  function matchStep(step) {
    const e = A.eng; const ws = step.words; const defs = shuffle(ws.slice());
    const COLORS = ['#3e9bd0', '#feba3e', '#14a3a3', '#e84393', '#8b72f6', '#ef6c3a'];
    const icons = ['air', 'cloud', 'water_drop', 'eco', 'bolt', 'star'];
    let selL = null, done = [], mistakes = 0;
    const draw = () => {
      view(`${lessonTop({ icon: 'hub', name: L('Jogo de conexão', 'Matching game') })}
        <div class="bg-surface-container-lowest rounded-2xl p-5 shadow-sm mb-4 relative overflow-hidden">
          <div class="flex items-center gap-2 mb-1"><span class="inline-flex items-center gap-1 bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-1 rounded-full text-label-sm">${I('hub', 'text-[14px]')} ${L('Jogo de conexão', 'Matching game')}</span><span class="text-label-sm text-on-surface-variant">${L('Toque para ligar', 'Tap to connect')}</span></div>
          <h2 class="text-headline-lg-mobile md:text-headline-lg text-on-surface">${L('Ligue cada palavra ao seu significado!', 'Match each word to its meaning!')}</h2>
          <p class="text-body-sm text-on-surface-variant">${kt('toque')}</p></div>
        <div id="mw" class="match-wrap grid grid-cols-2 gap-x-8 md:gap-x-16 gap-y-3"><svg id="lines"></svg>
          <div class="space-y-3">${ws.map((w, i) => `<button data-l="${esc(w)}" class="w-full min-h-[76px] flex items-center gap-3 px-3 py-3 rounded-xl bg-surface-container-lowest text-left transition ${done.includes(w) ? 'opacity-90' : 'shadow-sm active:scale-[0.98]'} ${selL === w ? 'ring-2 ring-primary-container' : ''}">
            <span class="w-9 h-9 rounded-xl bg-tertiary-fixed/60 text-tertiary hidden sm:flex items-center justify-center shrink-0">${I(icons[i % icons.length], 'text-[20px]')}</span><span class="min-w-0"><span class="block text-label-sm text-primary">0${i + 1}</span><span class="block text-label-lg text-on-surface break-words">${esc(w)}</span></span></button>`).join('')}</div>
          <div class="space-y-3">${defs.map(w => `<button data-r="${esc(w)}" class="w-full min-h-[76px] flex items-center px-3 py-3 rounded-xl bg-surface-container-lowest text-left text-body-sm text-on-surface transition ${done.includes(w) ? 'opacity-90' : 'shadow-sm active:scale-[0.98]'}">${esc(e.defs[w.toLowerCase()] || '')}</button>`).join('')}</div>
        </div>
        <div class="mt-4 bg-surface-container-low rounded-2xl p-3 flex items-center justify-between"><span class="flex items-center gap-2 text-label-md text-on-surface">${I(done.length === ws.length ? 'check_circle' : 'link', 'text-primary text-[22px]', 1)} ${done.length} ${L('de', 'of')} ${ws.length} ${L('pares conectados', 'pairs connected')}</span>${done.length === ws.length ? `<span class="bg-primary text-on-primary text-label-sm px-3 py-1 rounded-full">${L('Tudo pronto!', 'All done!')}</span>` : ''}</div>
        <div class="mt-3 bg-surface-container-low rounded-2xl p-3 flex items-start gap-2 text-body-sm text-on-surface-variant">${I('lightbulb', 'text-secondary text-[18px]')} <span><b class="text-on-surface">${L('Dica rápida:', 'Quick tip:')}</b> ${L('leia o significado em voz baixa antes de ligar.', 'read each meaning quietly before you connect.')}</span></div>
        ${lessonBottom(`<button id="ok" ${done.length === ws.length ? '' : 'disabled'} class="btn3d w-full h-14 rounded-xl bg-primary-container text-on-primary text-headline-md flex items-center justify-center gap-2"><span>${L('Conferir conexões', 'Check matches')}</span><span>🚀</span></button>`)}`);
      wireTop(); lines();
      app().querySelectorAll('[data-l]').forEach(b => b.onclick = () => { if (done.includes(b.dataset.l)) return; selL = b.dataset.l; draw(); });
      app().querySelectorAll('[data-r]').forEach(b => b.onclick = () => {
        const r = b.dataset.r; if (done.includes(r) || !selL) { if (!selL) toast(L('Toque primeiro numa palavra 👈', 'Tap a word first 👈')); return; }
        if (selL === r) { done.push(r); selL = null; draw(); }
        else { mistakes++; b.classList.add('shake', 'ring-2', 'ring-error'); setTimeout(() => { selL = null; draw(); }, 380); }
      });
      $('#ok').onclick = () => { tickStep('q'); const rr = e.recordMatch(step, mistakes); persist(false); toast((rr.ok ? '🎉 ' : '👍 ') + '+' + rr.coins + ' 🪙'); nextStep(); };
    };
    const lines = () => {
      const wrap = $('#mw'), svg = $('#lines'); if (!wrap || !svg) return;
      const W = wrap.getBoundingClientRect(); let out = '';
      done.forEach(w => {
        const i = ws.indexOf(w);
        const a = wrap.querySelector(`[data-l="${CSS.escape(w)}"]`).getBoundingClientRect(), b = wrap.querySelector(`[data-r="${CSS.escape(w)}"]`).getBoundingClientRect();
        const x1 = a.right - W.left - 6, y1 = a.top + a.height / 2 - W.top, x2 = b.left - W.left + 6, y2 = b.top + b.height / 2 - W.top, dx = (x2 - x1) * 0.55;
        out += `<path d="M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}" stroke="${COLORS[i % COLORS.length]}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="${x1}" cy="${y1}" r="6" fill="${COLORS[i % COLORS.length]}"/><circle cx="${x2}" cy="${y2}" r="6" fill="${COLORS[i % COLORS.length]}"/>`;
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
    if (partial || !S.items.length && !S.pagesSec.length) return kidHome();
    const B = QKEngine.BADGES, p = e.prog;
    const s3 = r.stars >= 4 ? 3 : r.stars >= 3 ? 2 : 1;
    const conf = ['#feba3e', '#14a3a3', '#3e9bd0', '#ffb4a9', '#a855f7'];
    const confetti = Array.from({ length: 22 }, (x, i) => `<div class="confetti-particle ${i % 2 ? 'rounded-full' : 'rounded-sm'}" style="left:${(i * 37) % 92 + 4}%;top:-10px;width:${5 + i % 4}px;height:${6 + (i * 3) % 7}px;background:${conf[i % 5]};--sway-x:${(i % 2 ? -1 : 1) * (12 + i % 10)}px;--rot:${(i % 2 ? -1 : 1) * (160 + i * 9)}deg;animation-duration:${3.5 + (i % 6) * 0.2}s;animation-delay:${(i * 0.17).toFixed(2)}s"></div>`).join('');
    const star = (on, big) => `<div class="${big ? 'w-[72px] h-[72px] -mt-3 scale-110 bg-secondary-container shadow-md' : 'w-14 h-14 bg-secondary-fixed shadow-sm'} rounded-full flex items-center justify-center ${on ? '' : 'opacity-30 grayscale'}">${I('star', `${big ? 'text-[44px]' : 'text-[36px]'} text-on-secondary-container`, 1)}</div>`;
    const mins = Math.max(1, Math.round(S.sec / 60));
    const skills = Array.from(new Set(S.items.map(i => i.skill).filter(Boolean))).slice(0, 2).map(s => skillInfo(s).name);
    view(`<main class="pt-10 pb-10 px-margin max-w-2xl mx-auto">
      <div class="flex flex-col items-center text-center pt-6 pb-2 mb-6 relative"><div aria-hidden="true" class="absolute inset-x-0 top-6 h-72 pointer-events-none overflow-hidden">${confetti}</div>
        <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-surface-container-highest shadow-sm mb-3 relative">${I('stars', 'text-[18px] text-primary', 1)}<span class="text-label-md text-on-surface-variant uppercase tracking-wider">${L('Missão cumprida! ✨', 'Mission complete! ✨')}</span></span>
        <h2 class="text-headline-xl-mobile md:text-headline-xl text-on-surface mb-2 relative">${kt('completa')}</h2>
        <p class="text-body-md text-on-surface-variant max-w-[320px] relative">${L(`Você arrasou nos desafios de hoje, ${esc(A.kid.apelido)}!`, `You crushed today's challenges, ${esc(A.kid.apelido)}!`)}</p></div>
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
