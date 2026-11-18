/* Quest Kids — núcleo: idioma, banco (Supabase ou modo demo), login, utilidades */
(function () {
  'use strict';
  const C = window.QK_CONFIG || {};
  try {
    if (/[?&]demo=0/.test(location.search)) { localStorage.removeItem('qk.demo'); localStorage.removeItem('qk.sess'); history.replaceState(null, '', location.pathname); }
    if (/[?&]demo=1/.test(location.search)) localStorage.setItem('qk.demo', '1');
  } catch (e) {}
  const DEMO = !C.SUPABASE_URL || /[?&]demo=(1|gabi)/.test(location.search) || (() => { try { return localStorage.getItem('qk.demo') === '1'; } catch (e) { return false; } })();
  // ?demo=gabi → demonstração completa com a Gabi e todas as lições dela (recomeça do zero a cada vez que abrir esse link)
  if (/[?&]demo=gabi/.test(location.search)) {
    const iso = d => new Date(Date.now() - d * 864e5).toISOString(), f = 'fam-demo', k = 'kid-gabi';
    const sess = (d, min, ok, tot, extra) => Object.assign({ id: 'demo-t' + d, crianca_id: k, familia_id: f, tipo: 'licao', licao_id: 'L0' + d, iniciada_em: iso(d), duracao_seg: min * 60, acertos: ok, total: tot, estrelas: Math.round(5 * ok / tot), itens: [], pendentes: 0 }, extra || {});
    const db = {
      familias: [{ id: f, nome: 'Família Demo', termos_aceitos_em: iso(10), termos_versao: '2026-11-17' }], membros: [{ familia_id: f, user_id: 'demo-user', papel: 'dono' }],
      assinaturas: [{ familia_id: f, plano: 'teste', status: 'trialing', com_ia: true, valido_ate: new Date(Date.now() + 7 * 864e5).toISOString() }],
      criancas: [{ id: k, familia_id: f, apelido: 'Gabi', avatar: '🦄', idade: 10, serie: '5th grade', idioma_app: 'en', idiomas: ['en', 'pt-BR'], estilo: 'rosa', tema: 'claro', minutos: 20, pacote: 'gabi-en5', dias: [1, 2, 3, 4, 5], pilares: { leitura: 40, palavras: 25, reforco: 35 }, criado_em: iso(10) }],
      progresso: [], convites: [], pins: [], senha_pais: '2026',
      licoes: [{ id: 'AIdemo1', crianca_id: k, pilar: 'misto', idioma: 'en', titulo: 'Family Budget Boss', pausada: false, foco: false, criado_em: iso(1), conteudo: {
        titulo: 'Family Budget Boss', icone: '💵', modo_prova: true, data_prova: iso(-3).slice(0, 10),
        passage: { title: 'Where does the money go?', text: 'Every month a family gets [[income|the money that comes in, like a paycheck]]. Then they pay [[expenses|the things money is spent on, like rent and food]].\n\nA [[budget|a plan that says where each dollar will go]] helps the family decide before the month starts. In a zero-based budget, every dollar gets a job, so income minus planned spending equals zero.\n\nSmart families also keep an [[emergency fund|money saved for surprises, like a broken car]].' },
        defs_alt: { income: ['what you earn', 'money you receive'], expenses: ['what you spend', 'costs you pay'], budget: ['a money plan', 'a spending plan'], 'emergency fund': ['savings for surprises', 'a rainy-day fund'] },
        questions: [
          { id: 'AIdemo1-1', pilar: 'leitura', skill: 'main idea', type: 'mc', prompt: 'What is the main idea of the text?', options: ['A budget helps a family plan where money goes', 'Families should never spend money', 'Cars break a lot', 'Income is always the same'], answer: 0, explain: 'The text explains how a budget gives every dollar a job.' },
          { id: 'AIdemo1-2', pilar: 'reforco', skill: 'budget', type: 'num', prompt: 'A family earns ${R} a month and has planned ${G} of spending. How many dollars still need a job?', vars: { R: [2000, 6000, 250], G: [1000, 5000, 250] }, cond: 'R>G', answers: ['{=R-G}'], explain: '${R} − ${G} = ${=R-G}.' },
          { id: 'AIdemo1-3', pilar: 'reforco', skill: 'budget', type: 'mc', prompt: 'True or false: in a zero-based budget, income minus planned spending equals zero.', options: ['True', 'False'], answer: 0, explain: 'Every dollar gets a job, so nothing is left without a plan.' },
          { id: 'AIdemo1-4', pilar: 'reforco', skill: 'saving', type: 'mc', prompt: 'Complete the sentence: Money saved for surprises is called an ____.', options: ['emergency fund', 'expense', 'income', 'allowance'], answer: 0, explain: 'An emergency fund is ready for surprises.' },
          { id: 'AIdemo1-5', pilar: 'reforco', skill: 'saving', type: 'num', prompt: 'Lia saves ${A} every week. How much does she save in {W} weeks?', vars: { A: [3, 12, 1], W: [3, 8, 1] }, answers: ['{=A*W}'], explain: '{A} × {W} = {=A*W}.' },
          { id: 'AIdemo1-6', pilar: 'reforco', skill: 'budget', type: 'order', prompt: 'Build the sentence', items: ['A budget', 'gives', 'every dollar', 'a job'], explain: 'A budget gives every dollar a job.' }
        ] } }],
      ia_tarefas: [{ id: 't1', familia_id: f, crianca_id: k, tipo: 'gerar_licao', status: 'pronto', entrada: { materia: 'Math — family budget', tipo: 'prova', obs: 'chapter 5', modo_prova: true, data_prova: iso(-3).slice(0, 10) }, resultado: { licao: 'AIdemo1', paginas: 2 }, criado_em: iso(1) }],
      materiais: [['m1', 'pronto', 3, 'estudo', 'Science — states of matter', 'chapter 4, pages 30–35', null], ['m2', 'pronto', 3, 'estudo', 'Science — states of matter', 'chapter 4, pages 30–35', null], ['m3', 'enviado', 0.1, 'prova', 'Math — fractions', 'the teacher said mixed numbers will be on it', iso(-3).slice(0, 10)]].map(([id, status, d, tipo, materia, obs, dp]) => ({ id, familia_id: f, crianca_id: k, caminho: f + '/' + id + '.jpg', materia, obs, tipo, lote: 'lote-' + tipo, modo_prova: tipo === 'prova', data_prova: dp, status, criado_em: iso(d), apagar_em: iso(d - 7) })),
      tentativas: [sess(1, 21, 8, 10, { itens: [{ qid: 'demo-txt', station: 'reforco', status: 'pending', at: iso(1), prompt: 'Describe a real situation at school where someone could be **magnanimous**.', rubric: '2 = a clear situation where someone forgives or is generous; 1 = vague; 0 = off-topic.', answer: 'When my friend broke my pencil and said sorry, I said it was ok and gave her another one.' }], pendentes: 1 }), sess(2, 18, 6, 9), sess(4, 24, 9, 10)]
    };
    try {
      localStorage.setItem('qk.demo', '1'); localStorage.setItem('qk.demo.db', JSON.stringify(db));
      localStorage.setItem('qk.sess', JSON.stringify({ demo: true, user: { id: 'demo-user', email: 'demo@questkids' } }));
      history.replaceState(null, '', location.pathname + '?demo=1');
    } catch (e) { console.warn(e); }
  }

  /* ---------------- idioma ---------------- */
  const T = {
    pt: {
      entrar: 'Entrar', criarConta: 'Criar conta', email: 'E-mail', senha: 'Senha', google: 'Entrar com Google',
      ou: 'ou', esqueci: 'Esqueci minha senha', jaTenho: 'Já tenho conta', naoTenho: 'Ainda não tenho conta',
      confiraEmail: 'Enviamos um link para o seu e-mail. Abra e volte aqui.', recuperarEnviado: 'Se o e-mail existir, enviamos um link para criar uma nova senha.',
      novaSenha: 'Nova senha', salvar: 'Salvar', cancelar: 'Cancelar', voltar: 'Voltar', continuar: 'Continuar', pronto: 'Pronto',
      quemVaiUsar: 'Quem vai estudar agora?', areaPais: 'Área dos pais', pinTitulo: 'Digite seu PIN', pinErrado: 'PIN errado. Tente de novo.',
      paisPergunta: 'Pergunta para adultos:', errado: 'Não foi dessa vez.',
      hoje: 'Hoje', biblioteca: 'Biblioteca', premios: 'Prêmios', progresso: 'Progresso',
      ola: 'Olá', prontaMissao: 'Pronta para a missão de hoje?', prontoMissao: 'Pronto para a missão de hoje?',
      licaoHoje: 'Lição de hoje', de: 'de', min: 'min', dias: 'dias', comecar: 'Começar', continuarLicao: 'Continuar',
      leitura: 'Leitura', palavras: 'Palavras', reforco: 'Reforço', aventura: 'AVENTURA DO DIA',
      metaFeita: 'Meta de hoje cumprida! 🎉', praticarMais: '🔁 Praticar mais', repetir: 'Repetir a lição',
      semConteudo: 'Ainda não tem lição. Peça para seus pais enviarem a matéria da escola 📸',
      conferir: 'Conferir', porque: '🤔 Por quê?', proxima: 'Continuar', quase: 'Quase!', certa: 'A resposta certa é:',
      acertou: ['Isso aí! 🎉', 'Mandou bem! ⭐', 'Perfeito! 🌟', 'Arrasou! 💪'], tenteOutra: 'Agora tente esta parecida:',
      digite: 'Digite sua resposta', escreva: 'Escreva com suas palavras…', enviado: 'Resposta enviada! Um adulto vai corrigir. ✍️',
      ligue: 'Ligue cada palavra ao significado', toque: 'Toque em um cartão e depois no outro.', ordene: 'Toque na ordem certa',
      separe: 'Toque no cartão e depois na caixa certa', lerVoz: '🎙️ Ler em voz alta', parar: '⏹ Parar', gravado: 'Gravado! ✅',
      regravar: 'Gravar de novo', pagina: 'Página', lidoPronto: 'Pronto, li!', semMic: 'Sem microfone? Sem problema, leia em voz alta mesmo assim.',
      completa: 'Lição completa! 🎉', acertos: 'acertos', voltarHoje: 'Voltar para Hoje', moedas: 'moedas',
      sequencia: 'Complete hoje para manter sua sequência!', nivel: 'Nível',
      minhasLeituras: 'Minhas leituras', minhasPalavras: 'Minhas palavras', lerDeNovo: 'Ler de novo',
      medalhas: 'Medalhas', certificados: 'Certificados da escola', semanaMin: 'Minutos nesta semana', habilidades: 'Habilidades',
      sair: 'Sair', trocar: 'Trocar', claro: 'Modo claro', escuro: 'Modo escuro', planoVencido: 'O período de teste acabou. Peça para seus pais escolherem um plano 💛',
      tempoAcabou: 'Tempo de hoje completo!', pausa: 'Pausado', fechar: 'Sair da lição?', fecharSim: 'Sim, sair', fecharNao: 'Continuar estudando',
      wordNew: 'Palavra nova', significado: 'O que significa', semPalavras: 'Suas palavras aparecem aqui quando você ler.',
      dica: '💡 Dica'
    },
    en: {
      entrar: 'Sign in', criarConta: 'Create account', email: 'Email', senha: 'Password', google: 'Continue with Google',
      ou: 'or', esqueci: 'Forgot password', jaTenho: 'I already have an account', naoTenho: "I don't have an account",
      confiraEmail: 'We sent a link to your email. Open it and come back here.', recuperarEnviado: 'If that email exists, we sent a link to set a new password.',
      novaSenha: 'New password', salvar: 'Save', cancelar: 'Cancel', voltar: 'Back', continuar: 'Continue', pronto: 'Done',
      quemVaiUsar: 'Who is studying now?', areaPais: 'Parents', pinTitulo: 'Enter your PIN', pinErrado: 'Wrong PIN. Try again.',
      paisPergunta: 'Grown-ups only:', errado: 'Not quite.',
      hoje: 'Today', biblioteca: 'Library', premios: 'Rewards', progresso: 'Progress',
      ola: 'Hi', prontaMissao: 'Ready for today’s mission?', prontoMissao: 'Ready for today’s mission?',
      licaoHoje: "Today's lesson", de: 'of', min: 'min', dias: 'days', comecar: 'Start', continuarLicao: 'Continue',
      leitura: 'Reading', palavras: 'Words', reforco: 'Practice', aventura: "TODAY'S ADVENTURE",
      metaFeita: "Today's goal done! 🎉", praticarMais: '🔁 Practice more', repetir: 'Repeat the lesson',
      semConteudo: 'No lesson yet. Ask your parents to send your school material 📸',
      conferir: 'Check', porque: '🤔 Why?', proxima: 'Continue', quase: 'Almost!', certa: 'The right answer is:',
      acertou: ['Yes! 🎉', 'Nice job! ⭐', 'Perfect! 🌟', 'Awesome! 💪'], tenteOutra: 'Now try this similar one:',
      digite: 'Type your answer', escreva: 'Write it in your own words…', enviado: 'Answer sent! A grown-up will check it. ✍️',
      ligue: 'Match each word to its meaning', toque: 'Tap one card, then its match.', ordene: 'Tap in the right order',
      separe: 'Tap a card, then the right box', lerVoz: '🎙️ Read aloud', parar: '⏹ Stop', gravado: 'Recorded! ✅',
      regravar: 'Record again', pagina: 'Page', lidoPronto: 'Done reading!', semMic: 'No microphone? No problem, read it aloud anyway.',
      completa: 'Lesson complete! 🎉', acertos: 'correct', voltarHoje: 'Back to Today', moedas: 'coins',
      sequencia: 'Finish today to keep your streak!', nivel: 'Level',
      minhasLeituras: 'My readings', minhasPalavras: 'My words', lerDeNovo: 'Read again',
      medalhas: 'Badges', certificados: 'School awards', semanaMin: 'Minutes this week', habilidades: 'Skills',
      sair: 'Sign out', trocar: 'Switch', claro: 'Light mode', escuro: 'Dark mode', planoVencido: 'The free trial ended. Ask your parents to pick a plan 💛',
      tempoAcabou: "Today's time is complete!", pausa: 'Paused', fechar: 'Leave the lesson?', fecharSim: 'Yes, leave', fecharNao: 'Keep studying',
      wordNew: 'New word', significado: 'What does it mean', semPalavras: 'Your words show up here when you read.',
      dica: '💡 Hint'
    }
  };
  const qsLang = new URLSearchParams(location.search).get('lang');
  if (qsLang === 'en' || qsLang === 'pt') localStorage.setItem('qk.lang', qsLang);
  let LANG = localStorage.getItem('qk.lang') || ((navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en');
  function t(k, lang) { const L = T[lang || LANG] || T.pt; return k in L ? L[k] : (T.pt[k] ?? k); }
  function setLang(l) { LANG = l; localStorage.setItem('qk.lang', l); }

  /* ---------------- utilidades ---------------- */
  const $ = (s, el) => (el || document).querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  /* **negrito**, *itálico*, [[palavra|significado]] → botão de palavra */
  function md(s) {
    return esc(s)
      .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (_, w, d) => `<button class="word" data-def="${d}">${w}</button>`)
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>')
      .replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>');
  }
  const today = (d) => { d = d || new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return today(d); };
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function toast(msg, ms) {
    let el = $('#toast'); if (!el) { el = document.createElement('div'); el.id = 'toast'; document.body.appendChild(el); }
    el.textContent = msg; el.className = 'show'; clearTimeout(el._t); el._t = setTimeout(() => el.className = '', ms || 2600);
  }

  /* ---------------- sessão (login) ---------------- */
  const SK = 'qk.sess';
  let sess = null; try { sess = JSON.parse(localStorage.getItem(SK)); } catch (e) { sess = null; }
  const saveSess = s => { sess = s; if (s) localStorage.setItem(SK, JSON.stringify(s)); else localStorage.removeItem(SK); };
  const H = (json) => Object.assign({ apikey: C.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + ((sess && sess.access_token) || C.SUPABASE_ANON_KEY) }, json ? { 'Content-Type': 'application/json' } : {});
  async function authCall(path, body) {
    const r = await fetch(C.SUPABASE_URL + '/auth/v1/' + path, { method: 'POST', headers: { apikey: C.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.msg || j.error_description || j.message || 'Erro ' + r.status);
    return j;
  }
  function fromToken(j) { return { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Math.floor(Date.now() / 1000) + (+j.expires_in || 3600), user: j.user || null }; }
  async function fresh() {
    if (DEMO || !sess) return;
    if (sess.expires_at - 60 > Date.now() / 1000) return;
    try { saveSess(fromToken(await authCall('token?grant_type=refresh_token', { refresh_token: sess.refresh_token }))); }
    catch (e) { saveSess(null); throw new Error('sessao'); }
  }

  const Auth = {
    get user() { return sess && sess.user; },
    get logged() { return !!sess; },
    async handleRedirect() {
      if (DEMO) return;
      const h = new URLSearchParams(location.hash.slice(1));
      if (h.get('access_token')) {
        const s = fromToken({ access_token: h.get('access_token'), refresh_token: h.get('refresh_token'), expires_in: h.get('expires_in') });
        saveSess(s); history.replaceState(null, '', location.pathname + location.search);
        try { const r = await fetch(C.SUPABASE_URL + '/auth/v1/user', { headers: H() }); s.user = await r.json(); saveSess(s); } catch (e) {}
        return h.get('type') || 'login';
      }
      if (h.get('error_description')) { history.replaceState(null, '', location.pathname); throw new Error(h.get('error_description')); }
    },
    async signIn(email, password) {
      if (DEMO) { saveSess({ demo: true, user: { id: 'demo-user', email } }); return; }
      saveSess(fromToken(await authCall('token?grant_type=password', { email, password })));
    },
    async signUp(email, password) {
      if (DEMO) { saveSess({ demo: true, user: { id: 'demo-user', email } }); return 'ok'; }
      const j = await authCall('signup', { email, password, data: { idioma: LANG } });
      if (j.access_token) { saveSess(fromToken(j)); return 'ok'; }
      return 'confirmar';
    },
    google() {
      const back = location.origin + location.pathname;
      location.href = `${C.SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(back)}`;
    },
    async recover(email) { if (!DEMO) await authCall('recover', { email, redirect_to: location.origin + location.pathname }); },
    async newPassword(password) {
      await fresh();
      const r = await fetch(C.SUPABASE_URL + '/auth/v1/user', { method: 'PUT', headers: H(true), body: JSON.stringify({ password }) });
      if (!r.ok) throw new Error('Não foi possível trocar a senha.');
    },
    async signOut() {
      if (!DEMO && sess) fetch(C.SUPABASE_URL + '/auth/v1/logout', { method: 'POST', headers: H() }).catch(() => {});
      saveSess(null); localStorage.removeItem('qk.kid');
    }
  };

  /* ---------------- banco: Supabase REST ---------------- */
  function qs(f) {
    const p = [];
    if (f && f.eq) for (const k in f.eq) p.push(`${k}=eq.${encodeURIComponent(f.eq[k])}`);
    if (f && f.gte) for (const k in f.gte) p.push(`${k}=gte.${encodeURIComponent(f.gte[k])}`);
    if (f && f.inn) for (const k in f.inn) p.push(`${k}=in.(${f.inn[k].map(encodeURIComponent).join(',')})`);
    if (f && f.order) p.push('order=' + f.order);
    if (f && f.limit) p.push('limit=' + f.limit);
    p.push('select=' + ((f && f.select) || '*'));
    return p.join('&');
  }
  async function rest(method, path, body, prefer) {
    await fresh();
    const h = H(!!body); if (prefer) h.Prefer = prefer;
    const r = await fetch(C.SUPABASE_URL + '/rest/v1/' + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
    if (r.status === 401) { saveSess(null); throw new Error('sessao'); }
    const txt = await r.text(); const j = txt ? JSON.parse(txt) : null;
    if (!r.ok) throw new Error((j && (j.message || j.hint)) || 'Erro ' + r.status);
    return j;
  }
  const Live = {
    sel: (t, f) => rest('GET', `${t}?${qs(f)}`),
    ins: (t, rows, opt) => rest('POST', `${t}${opt && opt.onConflict ? '?on_conflict=' + opt.onConflict : ''}`, rows,
      'return=representation' + (opt && opt.upsert ? ',resolution=merge-duplicates' : '')),
    upd: (t, f, patch) => rest('PATCH', `${t}?${qs(f)}`, patch, 'return=representation'),
    del: (t, f) => rest('DELETE', `${t}?${qs(f)}`),
    rpc: (fn, args) => rest('POST', 'rpc/' + fn, args || {}),
    async upload(bucket, path, blob) {
      await fresh();
      const r = await fetch(`${C.SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, { method: 'POST', headers: Object.assign(H(), { 'Content-Type': blob.type || 'application/octet-stream', 'x-upsert': 'true' }), body: blob });
      if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.message || 'Falha no envio'); }
      return path;
    },
    async signed(bucket, path, sec) {
      await fresh();
      const r = await fetch(`${C.SUPABASE_URL}/storage/v1/object/sign/${bucket}/${path}`, { method: 'POST', headers: H(true), body: JSON.stringify({ expiresIn: sec || 3600 }) });
      const j = await r.json(); if (!r.ok) throw new Error(j.message || 'arquivo'); return C.SUPABASE_URL + '/storage/v1' + j.signedURL;
    },
    async fn(name, body) {
      await fresh();
      const r = await fetch(`${C.SUPABASE_URL}/functions/v1/${name}`, { method: 'POST', headers: H(true), body: JSON.stringify(body || {}) });
      const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'Função indisponível'); return j;
    }
  };

  /* ---------------- banco: modo demo (fica só neste aparelho) ---------------- */
  const DK = 'qk.demo.db';
  const dload = () => { try { return JSON.parse(localStorage.getItem(DK)) || {}; } catch (e) { return {}; } };
  const dsave = db => { try { localStorage.setItem(DK, JSON.stringify(db)); } catch (e) { console.warn('demo cheio', e); } };
  const match = (row, f) => {
    if (f && f.eq) for (const k in f.eq) if (String(row[k]) !== String(f.eq[k])) return false;
    if (f && f.gte) for (const k in f.gte) if (!(row[k] >= f.gte[k])) return false;
    if (f && f.inn) for (const k in f.inn) if (!f.inn[k].map(String).includes(String(row[k]))) return false;
    return true;
  };
  const KEYS = { progresso: ['crianca_id', 'chave'], assinaturas: ['familia_id'], membros: ['familia_id', 'user_id'], pins: ['crianca_id'] };
  function demoSeed(db) {
    if (db.familias && db.precos && db.precos.length && db.produtos) return db;
    if (!db.familias) {
    const f = 'fam-demo';
    db.familias = [{ id: f, nome: 'Família Demo', termos_aceitos_em: null, termos_versao: null }];
    db.membros = [{ familia_id: f, user_id: 'demo-user', papel: 'dono' }];
    db.assinaturas = [{ familia_id: f, plano: 'teste', status: 'trialing', com_ia: true, valido_ate: new Date(Date.now() + 7 * 864e5).toISOString() }];
    db.criancas = []; db.progresso = []; db.tentativas = []; db.materiais = []; db.licoes = []; db.convites = []; db.ia_tarefas = []; db.pins = [];
    }
    db.precos = [
      ['brl-mensal', 'brl', 'mensal', false, 'R$ 79,90/mês'], ['brl-semestral', 'brl', 'semestral', false, 'R$ 419,40 a cada 6 meses'], ['brl-anual', 'brl', 'anual', false, 'R$ 49,90/mês por 12 meses'],
      ['brl-mensal-fundador', 'brl', 'mensal', true, 'R$ 59,90/mês'], ['brl-semestral-fundador', 'brl', 'semestral', true, 'R$ 299,40 a cada 6 meses'], ['brl-anual-fundador', 'brl', 'anual', true, 'R$ 34,90/mês por 12 meses'],
      ['usd-mensal', 'usd', 'mensal', false, '$19.99/month'], ['usd-semestral', 'usd', 'semestral', false, '$89.94 every 6 months'], ['usd-anual', 'usd', 'anual', false, '$119.88/year']
    ].map(([codigo, moeda, plano, fundador, valor_texto]) => ({ codigo, moeda, plano, fundador, valor_texto, ativo: true }));
    db.produtos = [['cred20-brl', 'creditos', 'brl', 'R$ 14,90', 20, null], ['cred20-usd', 'creditos', 'usd', '$4.99', 20, null], ['ferias1-brl', 'temas', 'brl', 'R$ 39,90', null, 'ferias1'], ['ferias1-usd', 'temas', 'usd', '$12.99', null, 'ferias1']].map(([codigo, tipo, moeda, valor_texto, paginas, pacote]) => ({ codigo, tipo, moeda, valor_texto, paginas, pacote, ativo: true }));
    return db;
  }
  const Demo = {
    async sel(t, f) {
      const db = demoSeed(dload()); let rows = (db[t] || []).filter(r => match(r, f));
      if (f && f.order) { const [c, dir] = f.order.split('.'); rows.sort((a, b) => (a[c] > b[c] ? 1 : -1) * (dir === 'desc' ? -1 : 1)); }
      if (f && f.limit) rows = rows.slice(0, f.limit);
      return JSON.parse(JSON.stringify(rows));
    },
    async ins(t, rows, opt) {
      const db = demoSeed(dload()); db[t] = db[t] || []; const out = [];
      for (let r of [].concat(rows)) {
        r = Object.assign({}, r);
        if (!r.id && !KEYS[t]) r.id = uid();
        if (t === 'criancas') r = Object.assign({ estilo: 'simples', tema: 'claro', minutos: 20, idiomas: ['pt-BR'], idioma_app: 'pt-BR', avatar: '⭐', pilares: { leitura: 40, palavras: 25, reforco: 35 }, criado_em: new Date().toISOString() }, r);
        if (t === 'convites') r = Object.assign({ codigo: Math.random().toString(36).slice(2, 10).toUpperCase() }, r);
        if (t === 'materiais') r = Object.assign({ status: 'enviado', criado_em: new Date().toISOString(), apagar_em: new Date(Date.now() + 7 * 864e5).toISOString() }, r);
        const keys = KEYS[t] || ['id'];
        const i = db[t].findIndex(x => keys.every(k => x[k] === r[k]));
        if (i >= 0) { if (opt && opt.upsert) db[t][i] = Object.assign(db[t][i], r); else continue; } else db[t].push(r);
        out.push(r);
      }
      dsave(db); return out;
    },
    async upd(t, f, patch) { const db = demoSeed(dload()); const out = []; (db[t] || []).forEach(r => { if (match(r, f)) { Object.assign(r, patch); out.push(r); } }); dsave(db); return out; },
    async del(t, f) { const db = demoSeed(dload()); db[t] = (db[t] || []).filter(r => !match(r, f)); dsave(db); },
    async rpc(fn, a) {
      const db = demoSeed(dload());
      if (fn === 'definir_pin') { db.pins = db.pins.filter(p => p.crianca_id !== a.crianca); db.pins.push({ crianca_id: a.crianca, pin: a.pin }); dsave(db); return null; }
      if (fn === 'conferir_pin') { const p = db.pins.find(p => p.crianca_id === a.crianca); return !p || p.pin === a.pin; }
      if (fn === 'tem_pin') return !!db.pins.find(p => p.crianca_id === a.crianca);
      if (fn === 'tem_senha_pais') return !!db.senha_pais;
      if (fn === 'sou_admin') return true;
      if (fn === 'admin_contas') return [{ id: 'demo-fam', criado_em: new Date().toISOString(), emails: 'demo@questkids (esta demonstração)', criancas: '🦊 Gabi, 🐱 Bia', licoes: 3, sessoes: 5, plano: 'teste · trialing', minha: true }, { id: 'demo-2', criado_em: new Date(Date.now() - 864e5 * 3).toISOString(), emails: 'exemplo3@demo', criancas: '🐼 Leo', licoes: 1, sessoes: 2, plano: 'anual · active', minha: false }];
      if (fn === 'minha_familia_nova') return 'demo-fam';
      if (fn === 'meu_painel_afiliado') return { afiliado: db.afiliado || null, indicados: db.afiliado ? 3 : 0, assinantes: db.afiliado ? 1 : 0, a_pagar: db.afiliado ? 1197 : 0, pago: 0, config: { pote: 30, max_desconto: 20, meses: 12 } };
      if (fn === 'salvar_afiliado') { const d = Math.max(0, Math.min(20, +a.desconto || 0)); db.afiliado = { codigo: String(a.cod).toUpperCase(), nome: a.nome_pub, desconto_pct: d, comissao_pct: 30 - d, pix: a.chave_pix }; dsave(db); return db.afiliado; }
      if (fn === 'admin_painel') return { familias: 42, novas7: 6, novas30: 19, por_status: { active: 17, trialing: 21, canceled: 4 }, por_plano: { 'anual*-brl': 9, 'semestral-brl': 3, 'mensal-brl': 4, 'anual-usd': 1 }, cancel30: 2, criancas: 55, ativas7: 38, sessoes7: 214, minutos7: 3120, licoes30: 61, ia_mes: { custo_centavos: 1840, paginas: 233, familias: 29 }, ia_top: [{ familia_id: 'x', email: 'exemplo1@demo', custo_centavos: 410, paginas: 41 }, { familia_id: 'y', email: 'exemplo2@demo', custo_centavos: 190, paginas: 22 }], tarefas: { pronto: 58, erro: 2, sem_limite: 1 }, erros: [{ criado_em: new Date().toISOString(), erro: 'nenhum arquivo legível (use JPG, PNG ou PDF)' }], comissoes: [{ id: 1, codigo: 'ANA10', pix: 'ana@pix', valor_centavos: 1197, moeda: 'brl', criado_em: new Date().toISOString() }], afiliados: [{ codigo: 'ANA10', nome: 'Ana', desconto_pct: 10, comissao_pct: 20, indicados: 5 }], feedbacks: [{ materia: 'Frações', nota: 9.5, comentario: '(exemplo de demonstração) Tirou a melhor nota da turma!', autoriza_depoimento: true, criado_em: new Date().toISOString() }] };
      if (fn === 'gerir_licao') { const L = (db.licoes || []).filter(l => l.crianca_id === a.crianca); const one = L.find(l => l.id === a.licao);
        if (a.acao === 'pausar' && one) one.pausada = true; if (a.acao === 'ativar' && one) one.pausada = false;
        if (a.acao === 'focar') L.forEach(l => { l.foco = l.id === a.licao; }); if (a.acao === 'desfocar') L.forEach(l => { l.foco = false; });
        if (a.acao === 'apagar') db.licoes = db.licoes.filter(l => !(l.crianca_id === a.crianca && l.id === a.licao)); if (a.acao === 'zerar') db.licoes = db.licoes.filter(l => l.crianca_id !== a.crianca);
        dsave(db); return null; }
      if (fn === 'aceitar_termos') { (db.familias || []).forEach(x => { x.termos_aceitos_em = new Date().toISOString(); x.termos_versao = a.versao; }); dsave(db); return null; }
      if (fn === 'definir_senha_pais') { if (!/^\d{4}$/.test(a.senha)) throw new Error('A senha precisa ter 4 números'); db.senha_pais = a.senha; dsave(db); return null; }
      if (fn === 'conferir_senha_pais') return !!db.senha_pais && db.senha_pais === a.senha;
      if (fn === 'vagas_fundador') return 100;
      if (fn === 'aceitar_convite') throw new Error('No modo demo não há convites.');
      return null;
    },
    async upload(bucket, path, blob) {
      const db = demoSeed(dload()); db._files = db._files || {};
      if (blob.size < 400000) db._files[bucket + '/' + path] = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); });
      dsave(db); return path;
    },
    async signed(bucket, path) { const db = dload(); return (db._files || {})[bucket + '/' + path] || ''; },
    async fn(name, body) { if (name === 'ia' && body && body.acao === 'apagar_conta') { if (body.familia === 'demo-fam') { localStorage.removeItem('qk.demo'); setTimeout(() => { location.href = location.pathname + '?demo=0'; }, 1200); } return { status: 'apagada', arquivos: 0, logins: 0, mantidos: 1 }; } if (name === 'checkout' || name === 'portal') throw new Error('No modo demo não há pagamento.'); throw new Error('Função indisponível no modo demo.'); }
  };

  window.QK = { DEMO, t, setLang, get lang() { return LANG; }, T, $, esc, md, today, addDays, uid, shuffle, toast, Auth, DB: DEMO ? Demo : Live, C };
})();
