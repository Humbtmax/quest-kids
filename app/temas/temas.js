/* Quest Kids — TEMAS narrados (modo férias). Catálogo + carregador.
   - grátis: vêm com o app para experimentar
   - 'ferias1': Pacote Férias (10 temas) — compra avulsa
   - status 'pronto' = tem áudio e lição; 'em_breve' = aparece no catálogo
   Os temas prontos usam as aulas narradas (com perguntas) que já existem; os novos vêm da tabela "temas" (painel de gestão). */
(function () {
  'use strict';
  const T = (id, icon, pt, en, pacote, extra) => Object.assign({ id, icon, pt, en, pacote, status: 'em_breve', faixas: ['6-9', '10-14'] }, extra || {});
  const CAT = [
    T('EGY', '🏺', 'Egito Antigo: pirâmides, múmias e a Pedra de Roseta', 'Ancient Egypt: Pyramids, Mummies and the Rosetta Stone', 'gratis', { status: 'pronto', mod: 'EGY', idiomas: ['en'], faixas: ['10-14'] }),
    T('BTC', '💰', 'Bitcoin: a história do dinheiro', 'Bitcoin: The Story of Money', 'gratis', { status: 'pronto', mod: 'BTC', idiomas: ['en'], faixas: ['10-14'] }),
    T('FW', '🦊', 'Cadeias alimentares: quem come quem?', 'Food Webs: Who Eats Whom?', 'ferias1', { status: 'pronto', mod: 'FW', idiomas: ['en'], faixas: ['10-14'] }),
    T('SEA', '🌊', 'Fundo do mar: criaturas que brilham', 'Deep Sea: Glowing Creatures', 'ferias1', { status: 'pronto', mod: 'SEA', idiomas: ['en'], faixas: ['10-14'] }),
    T('DINO', '🦖', 'Dinossauros: gigantes do passado', 'Dinosaurs: Giants of the Past', 'ferias1'),
    T('SPACE', '🚀', 'Sistema Solar e astronautas', 'The Solar System and Astronauts', 'ferias1'),
    T('BODY', '🫀', 'Corpo humano: a máquina incrível', 'The Human Body: An Amazing Machine', 'ferias1'),
    T('VOLC', '🌋', 'Vulcões e terremotos', 'Volcanoes and Earthquakes', 'ferias1'),
    T('ROME', '🏛️', 'Roma Antiga e os gladiadores', 'Ancient Rome and the Gladiators', 'ferias1'),
    T('AMAZ', '🌳', 'Floresta Amazônica', 'The Amazon Rainforest', 'ferias1'),
    T('INV', '💡', 'Grandes invenções', 'Great Inventions', 'extra'),
    T('VIK', '⚓', 'Vikings e navegadores', 'Vikings and Explorers', 'extra'),
    T('BEES', '🐝', 'Abelhas e polinização', 'Bees and Pollination', 'extra'),
    T('WEATHER', '⛈️', 'O tempo e o clima', 'Weather and Climate', 'extra'),
    T('OLYMP', '🏅', 'A história das Olimpíadas', 'The Story of the Olympics', 'extra'),
    T('ROBOT', '🤖', 'Robôs e inteligência artificial', 'Robots and Artificial Intelligence', 'extra'),
    T('MONEY', '🐷', 'Mesada, poupança e metas', 'Allowance, Saving and Goals', 'extra'),
    T('OCEANP', '♻️', 'Plástico no oceano', 'Plastic in the Ocean', 'extra'),
    T('MAYA', '🗿', 'Maias, astecas e incas', 'Maya, Aztec and Inca', 'extra'),
    T('MUSIC', '🎻', 'Como funciona a música', 'How Music Works', 'extra'),
    T('BRAIN', '🧠', 'O cérebro e a memória', 'The Brain and Memory', 'extra'),
    T('ARCTIC', '🐧', 'Polos: gelo e animais', 'The Poles: Ice and Animals', 'extra')
  ];
  const PACK_BASE = 'pacotes/gabi-en5/';
  let mods = null;
  // carrega as aulas narradas existentes num "cercadinho" (sem misturar com o plano da criança)
  function loadMods() {
    if (mods) return mods;
    mods = new Promise(res => {
      const keep = { PLAN: window.PLAN, MODULES: window.MODULES, SKILLS: window.SKILLS };
      window.PLAN = []; window.MODULES = []; window.SKILLS = Object.assign({}, keep.SKILLS || {});
      const helpers = { mc: (id, skill, prompt, options, explain, extra) => Object.assign({ id, skill, type: 'mc', prompt, options, answer: 0, explain }, extra || {}),
        num: (id, skill, prompt, answers, explain, extra) => Object.assign({ id, skill, type: 'num', prompt, answers: [].concat(answers), explain }, extra || {}),
        txt: (id, skill, prompt, rubric, extra) => Object.assign({ id, skill, type: 'text', prompt, rubric }, extra || {}),
        sortQ: (id, skill, prompt, buckets, items, explain, extra) => Object.assign({ id, skill, type: 'sort', prompt, buckets, items: items.map(([t, b]) => ({ t, b })), explain }, extra || {}),
        orderQ: (id, skill, prompt, items, explain, extra) => Object.assign({ id, skill, type: 'order', prompt, items, explain }, extra || {}) };
      const had = {}; Object.keys(helpers).forEach(k => { had[k] = window[k]; if (typeof window[k] !== 'function') window[k] = helpers[k]; });
      const done = () => {
        const plan = window.PLAN.map(it => Object.assign({}, it, { tema: true, audio: it.audio && !/^https?:/.test(it.audio) ? PACK_BASE + it.audio : it.audio, image: it.image && !/^https?:/.test(it.image) ? PACK_BASE + it.image : it.image }));
        window.PLAN = keep.PLAN; window.MODULES = keep.MODULES; window.SKILLS = Object.assign(keep.SKILLS || {}, window.SKILLS);
        Object.keys(had).forEach(k => { if (had[k] === undefined) { try { delete window[k]; } catch (e) {} } });
        res(plan);
      };
      const s = document.createElement('script'); s.src = PACK_BASE + 'modules.js?v=2'; s.onload = done; s.onerror = () => { done(); }; document.head.appendChild(s);
    });
    return mods;
  }
  // capítulos de um tema (do pacote antigo ou da tabela "temas")
  async function chapters(tema) {
    if (tema.db) return (tema.db.conteudo.chapters || []).map((c, i) => ({ id: `T-${tema.id}-C${i + 1}`, kind: 'module', tema: true, icon: tema.icon, title: `${tema.titulo || tema.pt} · ${i + 1}: ${c.title}`, chapterTitle: c.title, moduleTitle: tema.titulo || tema.pt, audio: c.audio, image: c.image, minutes: c.minutes, text: c.text || '', pages: [c.text || ''], aloud: [], checks: [], questions: c.questions || [] }));
    const plan = await loadMods(); return plan.filter(x => x.module === tema.mod);
  }
  window.QKTemas = { CAT, chapters, loadMods };
})();
