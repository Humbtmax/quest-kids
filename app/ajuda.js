/* Quest Kids — Quico assistente: chat de dúvidas que responde e leva para a tela certa.
   Funciona no site de vendas (visitantes) e na Área dos pais (app). Não aparece nas telas da criança.
   As respostas vêm da função "ia" (acao: 'ajuda'), que só usa o manual do app — não vê dados das contas. */
(function () {
  'use strict';
  const CFG = window.QK_CONFIG || { SUPABASE_URL: 'https://wqpujoymslyajknpkdpe.supabase.co', SUPABASE_ANON_KEY: 'sb_publishable_YkSW55PojAbLpr8hCcLb5Q_5PKgBbSL', SUPORTE_EMAIL: 'rodrigok4455@gmail.com' };
  const script = document.currentScript;
  const ORIGEM = (script && script.dataset.origem) || (window.QK ? 'app' : 'site');
  // no Painel de gestão (só administradores) o Quico vira assistente da administração
  const modo = () => ORIGEM === 'app' && document.body.dataset.painel === 'gestao' ? 'admin' : ORIGEM;
  const lang = () => (window.QK ? QK.lang : (document.documentElement.lang || 'pt').slice(0, 2)) === 'en' ? 'en' : 'pt';
  const T = (p, e) => lang() === 'en' ? e : p;
  const base = (script && script.dataset.base) || '';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const fmt = s => esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');

  // para onde cada botão leva
  const DEST = {
    material: ['📸', 'Ir para Material', 'Go to Material'], modo: ['🎛️', 'Modo de estudo', 'Study mode'], perguntas: ['❓', 'Ver as perguntas', 'See the questions'],
    temas: ['🎧', 'Temas narrados', 'Narrated topics'], creditos: ['➕', 'Comprar mais páginas', 'Buy more pages'], resumo: ['📊', 'Abrir o Resumo', 'Open Summary'],
    simulado: ['🧪', 'Preparar um simulado', 'Set up a practice test'], corrigir: ['✍️', 'Abrir Corrigir', 'Open Review'], criancas: ['🧒', 'Abrir Crianças', 'Open Kids'],
    nova_crianca: ['➕', 'Adicionar criança', 'Add a child'], conta: ['⚙️', 'Abrir Conta', 'Open Account'], planos: ['⭐', 'Ver planos', 'See plans'],
    convite: ['👪', 'Convidar responsável', 'Invite a parent'], parceiro: ['🤝', 'Indique e ganhe', 'Refer and earn'], pais: ['🌎', 'País da família', 'Family country'],
    senha: ['🔒', 'Senha dos pais', 'Parents password'], suporte: ['✉️', 'Falar com o suporte', 'Contact support'],
    criar_conta: ['✨', 'Criar conta grátis', 'Create a free account'], entrar: ['🔑', 'Entrar no app', 'Log in'], planos_site: ['⭐', 'Ver planos', 'See plans'],
    painel: ['🛠️', 'Abrir o Painel de gestão', 'Open admin panel'], g_links: ['🔗', 'Links para mandar', 'Links to share'], g_convites: ['📨', 'Convites com mensagem pronta', 'Invites with messages'], g_assin: ['📈', 'Assinaturas', 'Subscriptions'], g_uso: ['📊', 'Uso', 'Usage'],
    g_iatop: ['💸', 'Quem mais gasta IA', 'Top AI spend'], g_erros: ['⚠️', 'Erros da IA', 'AI errors'], g_comis: ['🤝', 'Comissões a pagar', 'Commissions'], g_feed: ['⭐', 'Notas das provas', 'Test results'],
    g_rep: ['🚩', 'Perguntas com problema', 'Reported questions'], g_quico: ['💬', 'Dúvidas feitas ao Quico', 'Questions to Quico'], g_custo: ['🧮', 'Custo por envio', 'Cost per upload'], g_contas: ['👪', 'Contas', 'Accounts'], g_tema: ['🎧', 'Subir tema narrado', 'Upload a topic'],
    demo: ['🧪', 'Ver a demonstração', 'Try the demo'], como_funciona: ['💡', 'Como funciona', 'How it works'], termos: ['📜', 'Termos de Uso', 'Terms of Use'], privacidade: ['🔒', 'Privacidade', 'Privacy']
  };
  function ir(d) {
    const L = lang() === 'en' ? 'en' : 'pt', app = base + 'app/';
    if (d === 'suporte') return (location.href = 'mailto:' + CFG.SUPORTE_EMAIL + '?subject=' + encodeURIComponent('Quest Kids'));
    const site = { criar_conta: app + '?criar=1&lang=' + L, entrar: app + '?lang=' + L, demo: app + '?demo=gabi&lang=' + L, termos: base + 'termos.html' + (L === 'en' ? '#en' : ''), privacidade: base + 'privacidade.html' + (L === 'en' ? '#en' : ''), planos_site: '#planos', como_funciona: '#como-funciona' };
    if (ORIGEM === 'app' && window.QKParent && QKParent.ir && /^(g_|painel$)/.test(d)) { fechar(); return QKParent.ir(d); }
    if (ORIGEM === 'app' && window.QKParent && QKParent.ir) { fechar(); return QKParent.ir(d); }
    const u = site[d]; if (!u) return;
    if (u[0] === '#') { fechar(); const el = document.querySelector(u) || document.querySelector('#m-' + u.slice(1)); if (el) el.scrollIntoView({ behavior: 'smooth' }); else location.hash = u; return; }
    location.href = u;
  }

  const SUGEST = () => modo() === 'admin'
    ? [T('Quais links mando para um cliente?', 'Which links do I send a customer?'), T('Quanto estou gastando de IA?', 'How much am I spending on AI?'), T('Como apago uma conta de teste?', 'How do I delete a test account?'), T('Como pago as comissões?', 'How do I pay commissions?'), T('O que faço com pergunta reportada?', 'What do I do with a reported question?'), T('Como subo um tema narrado?', 'How do I upload a narrated topic?')]
    : ORIGEM === 'app'
    ? [T('Como mando o material da escola?', 'How do I send school material?'), T('Como marco um simulado?', 'How do I set up a practice test?'), T('O que é o modo prova?', 'What is test mode?'), T('Como convido o outro responsável?', 'How do I invite the other parent?')]
    : [T('Como funciona?', 'How does it work?'), T('Quanto custa?', 'How much is it?'), T('Para qual idade é?', 'What ages is it for?'), T('É seguro para meu filho?', 'Is it safe for my child?')];

  const quico = `<svg width="34" height="34" viewBox="0 0 120 120" aria-hidden="true"><path d="M60 6 l5 10 11 1.6-8 7.7 1.9 11L60 31l-9.9 5.3 1.9-11-8-7.7 11-1.6z" fill="#ffc83d"/><ellipse cx="60" cy="78" rx="44" ry="38" fill="#14a3a3"/><ellipse cx="60" cy="88" rx="30" ry="22" fill="#d9f6f2"/><circle cx="44" cy="70" r="11" fill="#fff"/><circle cx="76" cy="70" r="11" fill="#fff"/><circle cx="46" cy="71" r="5.5" fill="#10302f"/><circle cx="78" cy="71" r="5.5" fill="#10302f"/><path d="M50 88 q10 9 20 0" fill="none" stroke="#10302f" stroke-width="4" stroke-linecap="round"/></svg>`;
  const css = `#qka-btn{position:fixed;right:16px;bottom:calc(env(safe-area-inset-bottom,0px) + 96px);z-index:60;display:flex;align-items:center;gap:6px;border:0;border-radius:999px;background:#14a3a3;color:#fff;font:700 14px/1 system-ui,-apple-system,sans-serif;padding:8px 14px 8px 8px;box-shadow:0 6px 20px rgba(0,0,0,.2);cursor:pointer}
  #qka-btn svg{background:#fff;border-radius:50%}
  @media (min-width:1024px){#qka-btn{bottom:24px}}
  body[data-area="app"] #qka-btn,body[data-area="app"] #qka-box{display:none!important}
  #qka-box{position:fixed;right:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 12px);z-index:61;width:min(380px,calc(100vw - 24px));height:min(560px,calc(100dvh - 90px));display:none;flex-direction:column;background:#f7f9ff;color:#0f1d29;border-radius:22px;box-shadow:0 12px 40px rgba(0,0,0,.28);overflow:hidden;font:15px/1.45 system-ui,-apple-system,sans-serif}
  #qka-box.on{display:flex}
  @media (prefers-color-scheme:dark){#qka-box{background:#121a2e;color:#dae2fd}#qka-box .qka-m{background:#1c2540;border-color:#2a3350}#qka-box textarea{background:#0b1326;color:#dae2fd;border-color:#2a3350}#qka-box .qka-chip{background:#1c2540;color:#dae2fd}}
  .qka-top{display:flex;align-items:center;gap:8px;padding:10px 12px;background:#14a3a3;color:#fff}.qka-top b{flex:1;font-size:16px}.qka-top small{display:block;font-weight:400;opacity:.9;font-size:12px}
  .qka-top button{border:0;background:rgba(255,255,255,.22);color:#fff;width:34px;height:34px;border-radius:50%;font-size:16px;cursor:pointer}
  .qka-list{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}
  .qka-m{max-width:88%;padding:9px 12px;border-radius:16px;background:#fff;border:1px solid #dbe8f6;word-wrap:break-word}
  .qka-m.eu{align-self:flex-end;background:#14a3a3;color:#fff;border-color:#14a3a3;border-bottom-right-radius:6px}.qka-m.ele{align-self:flex-start;border-bottom-left-radius:6px}
  .qka-acts{display:flex;flex-wrap:wrap;gap:6px;align-self:flex-start}.qka-act{border:0;border-radius:12px;background:#14a3a3;color:#fff;font-weight:700;font-size:13px;padding:8px 12px;cursor:pointer}
  .qka-chips{display:flex;flex-wrap:wrap;gap:6px}.qka-chip{border:1px solid #bfe9e4;background:#e9fbf8;color:#0f1d29;border-radius:999px;padding:6px 10px;font-size:13px;cursor:pointer;text-align:left}.qka-chips .qka-outra{background:transparent;border-style:dashed}
  .qka-form{display:flex;gap:6px;padding:10px;border-top:1px solid #dbe8f6}.qka-form textarea{flex:1;resize:none;border:1px solid #cdd9e6;border-radius:14px;padding:9px 10px;font:inherit;height:42px;max-height:100px}
  .qka-form button{border:0;border-radius:14px;background:#14a3a3;color:#fff;font-weight:800;padding:0 14px;cursor:pointer}.qka-form button:disabled{opacity:.5}
  .qka-dots{display:inline-flex;gap:4px}.qka-dots i{width:7px;height:7px;border-radius:50%;background:#6d7a79;animation:qkad 1s infinite}.qka-dots i:nth-child(2){animation-delay:.15s}.qka-dots i:nth-child(3){animation-delay:.3s}
  @keyframes qkad{0%,80%,100%{opacity:.3;transform:none}40%{opacity:1;transform:translateY(-4px)}}
  .qka-nota{font-size:11px;opacity:.7;padding:0 12px 8px;text-align:center}`;

  let box, list, hist = [], ocupado = false, modoConversa = null;
  function montar() {
    if (document.getElementById('qka-btn')) return;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    const b = document.createElement('button'); b.id = 'qka-btn'; b.type = 'button'; b.innerHTML = quico + '<span>' + (ORIGEM === 'app' ? T('Ajuda', 'Help') : T('Dúvidas? Pergunte ao Quico', 'Questions? Ask Quico')) + '</span>'; b.setAttribute('aria-label', T('Pergunte ao Quico', 'Ask Quico')); b.onclick = abrir; document.body.appendChild(b);
    box = document.createElement('div'); box.id = 'qka-box'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Quico');
    box.innerHTML = `<div class="qka-top">${quico}<b>Quico<small>${T('Assistente do Quest Kids · IA', 'Quest Kids assistant · AI')}</small></b><button type="button" data-f aria-label="${T('Fechar', 'Close')}">✕</button></div>
      <div class="qka-list"></div>
      <form class="qka-form"><textarea maxlength="500" placeholder="${T('Escreva sua dúvida…', 'Type your question…')}"></textarea><button type="submit">➤</button></form>
      <div class="qka-nota">${T('Respostas geradas por IA sobre o app. Não compartilhe dados pessoais.', 'AI-generated answers about the app. Do not share personal data.')}</div>`;
    document.body.appendChild(box);
    list = box.querySelector('.qka-list');
    box.querySelector('[data-f]').onclick = fechar;
    const ta = box.querySelector('textarea'), form = box.querySelector('form');
    form.onsubmit = e => { e.preventDefault(); enviar(ta.value); ta.value = ''; };
    ta.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : form.onsubmit(e); } };
  }
  function abrir() {
    box.classList.add('on'); document.getElementById('qka-btn').style.display = 'none';
    if (modoConversa !== modo()) { list.innerHTML = ''; hist = []; modoConversa = modo(); box.querySelector('.qka-top small').textContent = modo() === 'admin' ? T('Assistente da gestão · IA', 'Admin assistant · AI') : T('Assistente do Quest Kids · IA', 'Quest Kids assistant · AI'); }
    if (!list.children.length && modo() === 'admin') { add('ele', T('Oi, Paula! 🛠️ Sou o Quico da gestão. Pergunte sobre o painel, contas, custos, parceiros ou o Supabase, e eu te levo à seção certa.', "Hi! 🛠️ I'm the admin Quico. Ask about the panel, accounts, costs, partners or Supabase, and I'll take you to the right section.")); chips(SUGEST().slice(0, 4), false); }
    else if (!list.children.length) {
      add('ele', T('Oi! Eu sou o Quico 👋 Posso tirar suas dúvidas sobre o Quest Kids e te levar até a tela certa. O que você quer saber?', "Hi! I'm Quico 👋 I can answer your questions about Quest Kids and take you to the right screen. What would you like to know?"));
      chips(SUGEST(), false);
    }
    setTimeout(() => box.querySelector('textarea').focus(), 50);
  }
  // botões para continuar a conversa sem digitar (depois de cada resposta)
  const feitas = () => hist.filter(h => h.quem === 'pessoa').map(h => h.texto.toLowerCase());
  function chips(lista, outra) {
    list.querySelectorAll('.qka-chips').forEach(c => c.remove());
    const ja = feitas();
    lista = (lista || []).map(x => String(x).trim()).filter(x => x && x.length <= 80 && !ja.includes(x.toLowerCase())).slice(0, 3);
    if (outra && lista.length < 2) lista = lista.concat(SUGEST().filter(x => !ja.includes(x.toLowerCase()) && !lista.includes(x))).slice(0, 3);
    const c = document.createElement('div'); c.className = 'qka-chips';
    c.innerHTML = lista.map(x => `<button type="button" class="qka-chip">${esc(x)}</button>`).join('') + (outra ? `<button type="button" class="qka-chip qka-outra" data-outra>✏️ ${T('Tenho outra pergunta', 'I have another question')}</button>` : '');
    list.appendChild(c);
    c.querySelectorAll('button').forEach(x => x.onclick = () => {
      if (x.hasAttribute('data-outra')) { c.remove(); const ta = box.querySelector('textarea'); ta.focus(); ta.placeholder = T('Escreva sua pergunta aqui…', 'Type your question here…'); return; }
      c.remove(); enviar(x.textContent);
    });
    list.scrollTop = list.scrollHeight;
  }
  function fechar() { if (!box) return; box.classList.remove('on'); const b = document.getElementById('qka-btn'); if (b) b.style.display = ''; }
  function add(quem, texto, destinos) {
    const m = document.createElement('div'); m.className = 'qka-m ' + quem; m.innerHTML = fmt(texto); list.appendChild(m);
    if (destinos && destinos.length) {
      const a = document.createElement('div'); a.className = 'qka-acts';
      a.innerHTML = destinos.filter(d => DEST[d]).map(d => `<button type="button" class="qka-act" data-d="${d}">${DEST[d][0]} ${esc(lang() === 'en' ? DEST[d][2] : DEST[d][1])}</button>`).join('');
      a.querySelectorAll('[data-d]').forEach(x => x.onclick = () => ir(x.dataset.d)); list.appendChild(a);
    }
    list.scrollTop = list.scrollHeight; return m;
  }
  // modo demonstração do app: respostas prontas (sem gastar IA)
  function demo(p) {
    const t = p.toLowerCase();
    if (modo() === 'admin') return { resposta: T('Na demonstração eu só mostro o caminho: as **Contas** ficam mais para baixo no Painel de gestão. Busque pelo e-mail e toque em Apagar.', 'In the demo I only show the way: **Accounts** are further down the admin panel.'), destinos: ['g_contas'], sugestoes: [T('Quanto estou gastando de IA?', 'How much am I spending on AI?')] };
    if (/material|foto|lição|lesson|photo|send/.test(t)) return { resposta: T('Na **Área dos pais → Material**, tire foto das páginas (ou mande PDF), escolha "Estudo do dia a dia" ou "Cai na prova" e toque em Enviar. Em 2 a 5 minutos vira lição. 📸 O envio fica **mais para baixo** na aba Material: o botão abaixo já te leva lá.', 'In **Parents → Material**, snap the pages (or send a PDF), pick "Everyday study" or "On the test" and tap Send. It becomes a lesson in 2–5 minutes. 📸 Sending is **further down** the Material tab: the button below takes you there.'), destinos: ['material'], sugestoes: [T('Posso mandar PDF?', 'Can I send a PDF?'), T('Quantas páginas por vez?', 'How many pages at a time?')] };
    if (/simulad|practice|test/.test(t)) return { resposta: T('No **Resumo**, em "Preparar um simulado", escolha quantas perguntas e o tempo. Ele vira a primeira atividade da próxima lição, e o resultado aparece para você primeiro. 🧪', 'In **Summary**, under "Set up a practice test", pick the number of questions and time. It becomes the first activity of the next lesson. 🧪'), destinos: ['simulado'] };
    if (/convid|invite|pai|mãe|parent/.test(t)) return { resposta: T('Em **Conta → Outro responsável**, digite o e-mail dele ou mande o convite pelo WhatsApp. Ele entra na mesma família. 👪', 'In **Account → Another parent**, type their email or send the invite by WhatsApp. 👪'), destinos: ['convite'] };
    return { resposta: T('Esta é a demonstração: no app de verdade eu respondo qualquer dúvida sobre o Quest Kids. 😊', 'This is the demo: in the real app I answer any question about Quest Kids. 😊'), destinos: ['material'] };
  }
  async function enviar(txt) {
    txt = String(txt || '').trim(); if (!txt || ocupado) return;
    ocupado = true; box.querySelector('.qka-form button').disabled = true;
    list.querySelectorAll('.qka-chips').forEach(c => c.remove());
    add('eu', txt); hist.push({ quem: 'pessoa', texto: txt });
    const dots = add('ele', ''); dots.innerHTML = '<span class="qka-dots"><i></i><i></i><i></i></span>';
    let r;
    try {
      const corpo = { acao: 'ajuda', origem: modo(), lang: lang(), mensagens: hist.slice(-8) };
      if (window.QK && QK.DEMO) { await new Promise(x => setTimeout(x, 700)); r = demo(txt); }
      else if (window.QK && QK.DB && QK.Auth && QK.Auth.logged) r = await QK.DB.fn('ia', corpo);
      else { const res = await fetch(CFG.SUPABASE_URL + '/functions/v1/ia', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: CFG.SUPABASE_ANON_KEY }, body: JSON.stringify(corpo) }); r = await res.json(); if (!res.ok) throw new Error(r.error || 'erro'); }
    } catch (e) { r = { resposta: T('Não consegui responder agora (sem internet?). Tente de novo ou fale com a gente: ', "I couldn't answer right now (offline?). Try again or contact us: ") + CFG.SUPORTE_EMAIL, destinos: ['suporte'] }; }
    dots.remove();
    if (!r || !r.resposta) r = { resposta: T('Hmm, não entendi. Pode perguntar de outro jeito?', "Hmm, I didn't get that. Could you ask another way?"), destinos: [] };
    add('ele', r.resposta, r.destinos); hist.push({ quem: 'quico', texto: r.resposta });
    chips(r.sugestoes, true);
    ocupado = false; box.querySelector('.qka-form button').disabled = false;
  }
  window.QKAjuda = { abrir: () => { montar(); abrir(); }, fechar };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar); else montar();
})();
