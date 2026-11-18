/* Quest Kids — mensagens prontas de convite (usadas no Painel de gestão e na página secreta de endereços).
   Fonte única: mudou um texto aqui, muda nos dois lugares. */
window.QK_CONVITES = function (o) {
  o = o || 'https://quest-kids-app.pages.dev';
  return [
    {
      id: 'testador', icone: '🧪', titulo: 'Convite para testar o app', tituloEn: 'Invite to test the app',
      sobre: 'Para amigos e famílias que vão testar e dar a opinião. A pessoa cria a conta com o teste grátis de 7 dias (sem cartão).',
      links: [['🇧🇷', o + '/app/?criar=1&lang=pt'], ['🇺🇸', o + '/app/?criar=1&lang=en']],
      pt: 'Oi! 😊 Estou lançando o Quest Kids, um app que transforma a matéria da escola do seu filho em lições curtas e divertidas (leitura, palavras novas e reforço). Queria muito a sua opinião!\n\n'
        + '👉 Crie sua conta grátis (7 dias, sem cartão):\n' + o + '/app/?criar=1&lang=pt\n\n'
        + 'Como testar:\n'
        + '1. Crie a conta com seu e-mail e siga o Quico (o ajudante do app) para cadastrar sua criança. Só o apelido, nunca o nome completo.\n'
        + '2. Na Área dos pais (cadeado 🔒 no topo) → Material, tire foto de 1 a 3 páginas que seu filho está estudando agora. Em 2 a 5 minutos vira lição.\n'
        + '3. Deixe a criança fazer a lição por alguns dias, de 15 a 20 minutinhos.\n'
        + '4. Viu algo estranho numa pergunta? Toque em "Tem algo errado nesta pergunta?". Ficou com dúvida? Toque em "Ajuda" e o Quico responde.\n\n'
        + 'Depois me conta o que achou? Obrigada! 💛',
      en: "Hi! 😊 I'm launching Quest Kids, an app that turns your child's school material into short, fun lessons (reading, new words and practice). I'd love your feedback!\n\n"
        + '👉 Create your free account (7 days, no card needed):\n' + o + '/app/?criar=1&lang=en\n\n'
        + 'How to test it:\n'
        + "1. Sign up with your email and follow Quico (the app's helper) to add your child. Just a nickname, never the full name.\n"
        + "2. In the Parents area (🔒 at the top) → Material, snap 1 to 3 pages your child is studying right now. They become a lesson in 2 to 5 minutes.\n"
        + '3. Let your child do the lesson for a few days, 15 to 20 minutes each.\n'
        + '4. Something odd in a question? Tap "Something wrong with this question?". Any doubts? Tap "Help" and Quico answers.\n\n'
        + "Will you tell me what you think? Thank you! 💛"
    },
    {
      id: 'parceiro', icone: '🤝', titulo: 'Convite para ser parceiro (indique e ganhe)', tituloEn: 'Invite to become a partner',
      sobre: 'Para influenciadores, professores e mães que querem indicar. Cada parceiro cria o próprio código dentro do app. Obs.: o desconto e a comissão só passam a valer quando os pagamentos (Stripe) estiverem ligados.',
      links: [['🇧🇷', o + '/app/?criar=1&lang=pt'], ['🇺🇸', o + '/app/?criar=1&lang=en']],
      pt: 'Oi! Quer indicar o Quest Kids e ganhar comissão? 🤝\n\n'
        + '1. Crie sua conta (é grátis): ' + o + '/app/?criar=1&lang=pt\n'
        + '2. Vá em Área dos pais (cadeado 🔒) → Conta → "Indique e ganhe".\n'
        + '3. Escolha o seu código (ex.: SEUNOME10) e quanto de desconto quer dar para quem assinar. O restante vira a sua comissão, por 12 meses de cada assinatura.\n'
        + '4. Copie o seu link e compartilhe. No mesmo lugar você acompanha os cadastros e o que tem a receber.\n\n'
        + 'Qualquer dúvida, me chama! 💛',
      en: 'Hi! Want to recommend Quest Kids and earn a commission? 🤝\n\n'
        + '1. Create your account (free): ' + o + '/app/?criar=1&lang=en\n'
        + '2. Go to Parents area (🔒) → Account → "Refer and earn".\n'
        + '3. Pick your code (e.g. YOURNAME10) and how much discount to give new subscribers. The rest is your commission, for 12 months of each subscription.\n'
        + '4. Copy your link and share it. You can follow sign-ups and earnings in the same place.\n\n'
        + 'Any questions, just message me! 💛'
    },
    {
      id: 'responsavel', icone: '👪', titulo: 'Convite para o outro responsável (pai, mãe, avó…)', tituloEn: 'Invite for another parent',
      sobre: 'Cada família faz o próprio convite em Área dos pais → Conta → "Outro responsável": digita o e-mail da pessoa (ela entra sozinha na família ao criar a conta) ou manda o link pelo WhatsApp. O link tem o formato /app/?convite=CÓDIGO e vale 3 dias. Abaixo, a mensagem para explicar isso a uma família.',
      links: [['🇧🇷', o + '/app/?lang=pt'], ['🇺🇸', o + '/app/?lang=en']],
      pt: 'Para o outro responsável (pai, mãe, avó…) acompanhar a mesma criança no Quest Kids:\n\n'
        + '1. Abra o app: ' + o + '/app/?lang=pt\n'
        + '2. Área dos pais (cadeado 🔒) → Conta → "Outro responsável".\n'
        + '3. Digite o e-mail da pessoa: quando ela criar a conta com esse e-mail, entra sozinha na sua família. Ou toque em "Enviar convite" para mandar pelo WhatsApp.\n'
        + 'O convite vale 3 dias. Vocês dois veem o mesmo progresso, sem pagar a mais. 💛',
      en: 'For another parent (dad, mom, grandma…) to follow the same child on Quest Kids:\n\n'
        + '1. Open the app: ' + o + '/app/?lang=en\n'
        + '2. Parents area (🔒) → Account → "Another parent".\n'
        + "3. Type their email: when they sign up with that email, they join your family automatically. Or tap 'Send invite' to send it via WhatsApp.\n"
        + 'The invite is valid for 3 days. You both see the same progress, at no extra cost. 💛'
    }
  ];
};
