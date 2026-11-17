/* =========================================================
   Learning Quest — SPECIAL MODULES (NotebookLM audio lessons)
   Each module = a few chapters. Each chapter = picture + audio + short text + questions.
   Module chapters are part of the plan: they take the Tue/Thu skills slots
   starting on the module's "from" date. All of them stay in "My Library".

   Example (files go in the folder modules/<ID>/ next to index.html):
   addModule({
     id: 'M1', title: 'The Rock Cycle', icon: '🪨', from: '2026-11-17',
     cover: 'modules/M1/cover.jpg',
     chapters: [
       { title: 'What is a rock?', audio: 'modules/M1/ch1.mp3', image: 'modules/M1/ch1.jpg', minutes: 4,
         text: `Short summary with [[new words|their meaning]].`,
         questions: [ mc('M1-1-1', 'science', 'Question?', ['right', 'wrong', 'wrong', 'wrong'], 'Why.') ] }
     ]
   });
   ========================================================= */
window.MODULES = window.MODULES || [];
window.SKILLS.history = window.SKILLS.history || { name: 'History & Social Studies', icon: '🏛️', area: 'social' };
function addModule(m) {
  window.MODULES.push(m);
  m.chapters.forEach((c, i) => {
    window.PLAN.push({
      id: `${m.id}-C${i + 1}`, kind: 'module', module: m.id, chapter: i + 1, icon: m.icon || '🎧',
      title: `${m.title} · Part ${i + 1}: ${c.title}`, chapterTitle: c.title, moduleTitle: m.title,
      audio: c.audio, image: c.image, minutes: c.minutes, text: c.text || '', from: m.from, explore: m.explore || '', chapters: m.chapters.length,
      briefing: c.briefing || null, teach: c.teach || '', checkpoints: c.checkpoints || [],
      pages: [c.text || ''], aloud: [], checks: (c.checkpoints || []).map(x => x.q), questions: c.questions || []
    });
  });
}

/* ===== Modules go below this line ===== */

/* ---- Food Webs: Who Eats Whom? (NotebookLM audio, Nov 2026) ---- */
addModule({
  id: 'FW', title: 'Food Webs: Who Eats Whom?', icon: '🦊', from: '2026-11-17',
  explore: 'https://notebooklm.google.com/notebook/275a261f-d49b-4857-92b6-aada8bc867ee',
  cover: 'modules/FOODWEB/foodweb.jpg',
  chapters: [
    { title: 'The Energy Detectives', audio: 'modules/FOODWEB/ch1.m4a', image: 'modules/FOODWEB/foodweb.jpg', minutes: 7,
      briefing: { mission: 'Today you are a **science detective**. Your case: where does the energy that keeps every animal alive come from?',
        predict: { q: 'Where do you think almost ALL the energy for living things comes from?', options: ['The Sun', 'Food from the store', 'The ground', 'Rain water'], explain: 'Plants catch sunlight and turn it into food. Then the energy passes to the animals that eat them.' },
        words: ['producer', 'consumer', 'predator'] },
      checkpoints: [{ at: 0.5, q: mc('FW1-c1', 'science', 'Quick check! A rabbit eats grass. The rabbit is a…', ['consumer', 'producer', 'decomposer'], 'The rabbit can\'t make its own food, so it eats (consumes) the grass.') }],
      teach: 'Teach your brother what a **producer** and a **consumer** are. Use one plant and one animal from our yard or a park!',
      text: `**Where does energy come from?**

Every living thing needs [[energy|the power to grow, move and stay alive]]. Almost all of it starts with the **Sun**.

A [[producer|a living thing that makes its own food, like a plant or algae]] uses sunlight to make food. In North Carolina, grass, oak trees, marsh grass and algae are producers.

A [[consumer|a living thing that must eat other living things to get energy]] cannot make its own food. A rabbit is a [[herbivore|an animal that eats only plants]]. A fox or a hawk is a [[carnivore|an animal that eats other animals]]. A black bear is an [[omnivore|an animal that eats plants AND animals]] — it eats berries, fish and small animals.

When a hawk hunts a rabbit, the hawk is the [[predator|an animal that hunts]] and the rabbit is the [[prey|an animal that is hunted]].

One straight path — Sun → grass → rabbit → hawk — is a **food chain**. All the living and non-living things in one place (plants, animals, air, water, soil) make an [[ecosystem|a community of living things and their environment]].`,
      questions: [
        sortQ('FW1-6', 'science', 'Sort them! Is each one a **producer** or a **consumer**?', ['🌱 Producer', '🐾 Consumer'], [['grass', 0], ['oak tree', 0], ['algae', 0], ['rabbit', 1], ['fox', 1], ['hawk', 1], ['black bear', 1]], 'Producers make food from sunlight. Consumers eat other living things.'),
        orderQ('FW1-7', 'science', 'Build the food chain! Tap in order, starting where the energy begins.', ['☀️ Sun', '🌾 Grass', '🐇 Rabbit', '🦅 Hawk'], 'Energy flows from the Sun → to the producer → to the herbivore → to the predator.'),
        mc('FW1-3', 'science', 'A black bear eats berries, fish and small animals. What is it?', ['An omnivore', 'A herbivore', 'A producer', 'A decomposer'], 'It eats plants AND animals, so it is an omnivore.'),
        mc('FW1-4', 'inference', '🔎 Detective: in the picture, the black bear is in the **Predators** box. Why is that not the whole story?', ['Bears also eat plants like berries, so they are omnivores', 'Bears only eat plants', 'Bears make their own food from sunlight', 'Bears are decomposers'], 'Good detectives check pictures too! Bears do hunt, but they also eat berries — so they are omnivores.'),
        mc('FW1-5', 'science', 'In the chain grass → rabbit → hawk, which one is the **prey**?', ['The rabbit', 'The hawk', 'The grass', 'The Sun'], 'The hawk hunts the rabbit, so the rabbit is the prey.')
      ] },
    { title: 'The Cleanup Crew', audio: 'modules/FOODWEB/ch2.m4a', image: 'modules/FOODWEB/foodweb.jpg', minutes: 8,
      briefing: { mission: 'New case: who cleans up the forest when leaves fall and animals die?',
        predict: { q: 'What would a forest look like if there were NO decomposers?', options: ['Covered with dead leaves and old logs', 'Exactly the same', 'Full of extra animals', 'Totally empty'], explain: 'Without decomposers, dead things would pile up and plants would run out of nutrients.' },
        words: ['decomposer', 'fungi', 'nutrients'] },
      checkpoints: [{ at: 0.5, q: mc('FW2-c1', 'science', 'Quick check! Mushrooms and earthworms are part of the…', ['cleanup crew (decomposers)', 'producers', 'predators'], 'They break down dead things — that\'s the decomposers\' job.') }],
      teach: 'Pretend you are a **mushroom**. Tell your brother what your job in the forest is and why the forest needs you!',
      text: `**Nature's recycling team**

What happens to fallen leaves, old logs and animals that die? Nature has a cleanup crew!

A [[decomposer|a living thing that breaks down dead plants and animals to get energy]] — like mushrooms (a kind of [[fungi|living things like mushrooms and mold, that are not plants or animals]]), earthworms, some insects and tiny bacteria — eats dead things and waste.

Decomposers break them into [[nutrients|the "food" in the soil that helps plants grow]] and put them back into the soil. Then plants use those nutrients to grow, and the whole loop starts again.

Decomposers do **not** get their energy from the Sun. They get it from dead plants and animals.

Without decomposers, dead leaves and logs would pile up everywhere, and plants would run out of nutrients.`,
      questions: [
        sortQ('FW2-5', 'science', 'Sort the forest team: **producer, consumer or decomposer**?', ['🌱 Producer', '🐾 Consumer', '🍄 Decomposer'], [['grass', 0], ['oak tree', 0], ['rabbit', 1], ['hawk', 1], ['mushroom', 2], ['mold on old bread', 2], ['bacteria', 2]], 'Decomposers break down dead things and send nutrients back to the soil.'),
        mc('FW2-1', 'science', 'What does a **decomposer** do?', ['Breaks down dead plants and animals and returns nutrients to the soil', 'Makes food from sunlight', 'Hunts other animals', 'Eats only living plants'], 'Decomposers are the cleanup crew: they recycle dead things into nutrients.'),
        mc('FW2-3', 'inference', '🔎 Detective: in the picture, the Sun\'s rays shine on the mushrooms. Where do mushrooms REALLY get their energy?', ['From dead leaves, logs and animals', 'From sunlight, like plants', 'From the rain', 'From hunting insects'], 'Mushrooms are not plants. They can\'t use sunlight — they get energy by breaking down dead things.'),
        orderQ('FW2-6', 'science', 'Put the nutrient loop in order.', ['🍂 A leaf falls', '🍄 Decomposers break it down', '🟤 Nutrients go into the soil', '🌱 A plant uses them to grow'], 'Dead things → decomposers → nutrients in the soil → new plants. Nature recycles!'),
        mc('FW2-4', 'inference', 'What would most likely happen in a forest with **no** decomposers?', ['Dead leaves would pile up and plants would run out of nutrients', 'Plants would grow faster', 'There would be more sunlight', 'Animals would never get hungry'], 'Without the cleanup crew, nutrients stay locked in dead things instead of going back to the soil.')
      ] },
    { title: 'The Missing Link Mystery', audio: 'modules/FOODWEB/ch3.m4a', image: 'modules/FOODWEB/foodweb.jpg', minutes: 6,
      briefing: { mission: 'Final case: what happens to a whole forest when ONE animal disappears?',
        predict: { q: 'If all the foxes disappeared from a forest, what would happen to the grass?', options: ['There would be less grass, because more rabbits would eat it', 'The grass would grow taller', 'Nothing would change', 'The grass would turn into trees'], explain: 'Fewer foxes → more rabbits → more grass eaten. One change ripples through the whole web!' },
        words: ['food web', 'trophic cascade', 'Yellowstone'] },
      checkpoints: [{ at: 0.5, q: mc('FW3-c1', 'science', 'Quick check! Many food chains connected together make a…', ['food web', 'food line', 'producer'], 'Animals eat more than one thing, so the chains cross and make a web.') }],
      teach: 'Explain a **trophic cascade** using the wolves of Yellowstone. Start with: "When the wolves were gone…"',
      text: `**When one animal disappears**

Most animals eat more than one thing. A fox might eat a rabbit, a mouse or a bird. When many food chains cross each other, they make a **food web**.

Because everything is connected, losing one animal can change the whole web. In Yellowstone National Park, wolves were gone by the 1920s. Without wolves, the elk grew in number and ate many young willow trees by the rivers. Wolves came back in **1995**. Scientists think this helped some willows grow again, which helps birds and beavers. This ripple effect is called a [[trophic cascade|a chain reaction in a food web that starts when one animal is added or removed]]. Scientists are **still studying** how big the effect really was — that is how science works!

The same idea can happen in North Carolina's ocean: if top predators like sharks disappear, the animals they eat can grow in number and change the rest of the web.`,
      questions: [
        orderQ('FW3-6', 'inference', 'Put the Yellowstone story in order.', ['🐺 Wolves disappear (1920s)', '🦌 The elk population grows', '🌿 Elk eat the young willow trees', '🐺 Wolves come back (1995)', '🌳 Some willows grow back'], 'Remove a predator → its prey grows → the plants get eaten. Bring it back → things start to recover.'),
        mc('FW3-1', 'science', 'What is the difference between a food chain and a food web?', ['A food web is many food chains connected together', 'A food chain is bigger than a food web', 'A food web has no animals', 'They are exactly the same'], 'One path is a chain. Many crossing chains make a web.'),
        mc('FW3-2', 'science', 'When did wolves come back to Yellowstone?', ['1995', '1920', '1850', '2020'], 'Wolves were gone by the 1920s and were brought back in 1995.'),
        mc('FW3-4', 'context', 'Scientists are "still **studying**" the Yellowstone effect. What does that tell you?', ['They are still collecting evidence to be sure', 'They already know everything', 'They stopped caring', 'The wolves left again'], 'Scientists keep testing ideas with evidence — that is what makes science trustworthy.'),
        txt('FW3-5', 'inference', 'A sickness makes all the red foxes disappear from a North Carolina forest. What do you think happens to the **rabbits** and the **grass**? Explain in 2–3 sentences.', 'Full credit (2): with no foxes (predators) the rabbit population grows; more rabbits eat more grass, so the grass decreases — explains the chain of cause and effect. Partial (1): says rabbits increase OR grass decreases without explaining why. 0: no cause-and-effect.')
      ] }
  ]
});

/* ---- Bitcoin: The Story of Money (NotebookLM, Nov 2026) ----
   Audio v2 "From Trading Cows to Mining Bitcoin" (20 min, corrected facts) cut at the "Part" breaks:
   0:00–6:37 · 6:37–9:57 · 9:57–14:57 · 14:57–end. */
addModule({
  id: 'BTC', title: 'Bitcoin: The Story of Money', icon: '💰', from: '2026-12-01',
  cover: 'modules/BITCOIN/money.jpg',
  chapters: [
    { title: 'Before Money: Cows, Salt and Trust', audio: 'modules/BITCOIN/ch1.m4a', image: 'modules/BITCOIN/money.jpg', minutes: 7,
      briefing: { mission: 'Time machine ON! ⏳ Before there was money, how did people get what they needed?',
        predict: { q: 'A $20 bill is just paper and ink. Why does the store take it?', options: ['Because everyone trusts it — we all agree it has value', 'Because paper is very expensive', 'Because it is made of gold', 'Because it is heavy'], explain: 'The hosts called it the "invisible magic trick": money works because of **trust**.' },
        words: ['barter', 'coincidence of wants', 'fiat money'] },
      checkpoints: [{ at: 0.5, q: mc('BTC1-c1', 'money', 'Quick check! Trading a fidget toy for a friend\'s snack (no money) is called…', ['bartering', 'banking', 'mining'], 'Swapping one thing directly for another is **bartering**.') }],
      teach: 'Explain to your brother why a **cow** is a bad kind of money, and why a **$20 bill** is better. Use the 3 words: divisible, portable, durable.',
      text: `**Before money**

Thousands of years ago there were no coins, no bills and no cards. People traded things directly — that is called [[barter|trading one thing straight for another thing, without money]]. Trading a fidget toy for a friend's snack at lunch is bartering!

Bartering gets messy in a big town. You must find someone who has exactly what you want, and who wants exactly what you have, at the same time and place. Economists call this the [[coincidence of wants|when both people want exactly what the other one has, at the same time]].

**The cow problem 🐄**

A farmer drags a cow into an electronics store to buy a laptop. The owner says: "I don't want a cow, I want apples!" Now the farmer has to find an apple farmer who wants a cow, trade, and carry a mountain of apples back — and some apples might rot on the way.

**Shells, beads, stones… and salt 🧂**

People started using rare things everybody agreed were special: seashells, beads, big stones and salt. Salt was one important way to keep food from spoiling before refrigerators. The word *salary* is linked to the Latin word for salt, but the story that Roman soldiers were paid in salt **isn't proven**.

**Money's 3 jobs**

1. A [[store of value|it keeps its worth — it doesn't rot like apples]]
2. A [[unit of account|a "yardstick" to measure prices, like dollars]]
3. A [[medium of exchange|something everyone accepts when they trade]]

Good money is [[durable|lasts without breaking or spoiling]], [[portable|easy to carry]] and [[divisible|can be split into smaller amounts]] — try making change for a cow!

A $20 bill is [[fiat money|money that has value because the government says so and people trust it, not because the paper itself is valuable]]. The paper itself isn't worth much. It works because we all **trust** it.`,
      questions: [
        mc('BTC1-1', 'money', 'Why does bartering get messy in a big town?', ['You must find someone who has what you want AND wants what you have, at the same time', 'There is too much money', 'Banks close on weekends', 'Cows are too small'], 'That\'s the **coincidence of wants** problem.'),
        sortQ('BTC1-2', 'money', 'Who has this problem: the **cow** or the **$20 bill**?', ['🐄 Cow money', '💵 $20 bill'], [['Can\'t be split into small change', 0], ['Might run away or get sick', 0], ['Too heavy to carry', 0], ['Splits into two 10s, or a 10 and two 5s', 1], ['Folds into your pocket', 1], ['Won\'t get sick on the way to the market', 1]], 'Good money is divisible, portable and durable — the cow is none of these!'),
        orderQ('BTC1-8', 'money', 'Put the story of money in order, from oldest to newest.', ['🤝 Bartering (trading cows and apples)', '🐚 Rare items like shells and salt', '💵 Coins and paper money', '💻 Digital code like Bitcoin'], 'The hosts\' summary: from cows → to salt → to paper bills → to lines of digital code!'),
        mc('BTC1-7', 'inference', '🔎 Detective: the hosts talked about Roman soldiers and salt. What did they say?', ['The word "salary" is linked to salt, but the "paid in salt" story isn\'t proven', 'Soldiers were definitely paid in sacks of salt', 'Soldiers were paid in cows', 'Salt was never valuable'], 'Good listening! A famous story is not always a proven story.'),
        mc('BTC1-5', 'money', 'Which is one of money\'s 3 jobs?', ['A store of value', 'A source of sugar', 'A kind of password', 'A type of rock'], 'Money\'s 3 jobs: store of value, unit of account, medium of exchange.'),
        mc('BTC1-9', 'money', 'A $20 bill is "fiat money." Why does it work?', ['The government says it is legal money and people trust it', 'The paper is made of gold', 'It is very rare paper', 'Every bill has a secret password'], 'Fiat money works because of **trust** — the "invisible magic trick".'),
        txt('BTC1-6', 'money', 'The hosts asked you: if you invented a new kind of money for your 5th-grade class, what object would you use, and **why** would your classmates trust it? Use one of the words: divisible, portable or durable.', 'Full credit (2): names an object AND explains why classmates would trust it, using divisible/portable/durable (or the idea of being hard to copy/fake). Partial (1): object with a weak reason. 0: no reason.')
      ] },
    { title: 'What Is Bitcoin? The Shared Notebook', audio: 'modules/BITCOIN/ch2.m4a', image: 'modules/BITCOIN/money.jpg', minutes: 4,
      briefing: { mission: 'Mystery: how can money live on the internet — where everything can be copied and pasted — and still be worth something?',
        predict: { q: 'If money is just a computer file, what stops someone from copying and pasting it?', options: ['A shared notebook that thousands of computers check', 'Nothing at all', 'A police officer inside the computer', 'The file is too big to copy'], explain: 'Bitcoin uses a **blockchain**: a public notebook that thousands of computers keep, so a copied coin gets caught.' },
        words: ['double spending', 'blockchain', '21 million'] },
      checkpoints: [{ at: 0.5, q: mc('BTC2-c1', 'money', 'Quick check! You text a friend a picture of a banana and you still have it too. Why is that a problem for digital money?', ['If money could be copied like that, you could spend it again and again', 'Bananas can\'t be sent', 'Your friend can\'t open pictures', 'It costs too much'], 'That\'s the **double-spending problem**.') }],
      teach: 'Explain a **blockchain** to your brother using the idea of a notebook that everyone in the class has a copy of. How would you catch a cheater?',
      text: `**Satoshi's idea**

In **2008**, someone using the made-up name **Satoshi Nakamoto** (maybe one person, maybe a group — nobody knows!) invented Bitcoin: digital money you can send straight to another person over the internet, **with no bank**.

**The copy-paste problem**

On the internet, everything can be copied. If you text a picture of a banana, you still have it. If money could be copied like that, people could spend it a million times — the [[double-spending problem|the risk of using the same digital money more than once by copying it]].

**The bank is the referee**

For a long time the only fix was a bank. The bank keeps a private [[ledger|a list of every payment — who paid whom]] and moves the money for you.

**The shared notebook**

Satoshi replaced the bank's secret list with a [[blockchain|a public, shared digital notebook of every trade, kept by thousands of computers]]. **Thousands** of computers around the world (not millions!) keep the same copy. If you try to copy a coin or spend it twice, your notebook won't match everyone else's, and the network rejects it — like trying to cheat at a board game while everyone watches your hands.

**Only 21 million**

Governments can print more dollars, which can make each dollar worth less. Bitcoin has a hard limit: only **21 million** bitcoins will ever exist. That rarity is called [[digital scarcity|when a digital thing is truly limited and can't be copied]], so some people call Bitcoin "digital gold."`,
      questions: [
        mc('BTC2-1', 'money', 'Who created Bitcoin?', ['Someone using the made-up name Satoshi Nakamoto — nobody knows who', 'The U.S. government', 'A big bank in New York', 'A famous movie star'], 'It\'s still a mystery — maybe even a group of people!'),
        mc('BTC2-2', 'money', 'What is a **blockchain**?', ['A public, shared digital notebook of trades that thousands of computers keep', 'A chain made of metal blocks', 'A secret bank vault', 'A kind of credit card'], 'Everyone has a copy, so cheating gets caught.'),
        mc('BTC2-3', 'inference', 'Someone tries to spend the same bitcoin twice. What happens?', ['Their notebook doesn\'t match the other computers, so the network rejects it', 'They get free bitcoin', 'All the bitcoins disappear', 'The bank gives it back'], 'Like cheating at a board game while everyone watches your hands!'),
        mc('BTC2-8', 'inference', '🔎 Detective: the hosts made sure to say it exactly right. How many computers keep a copy of the notebook?', ['Thousands', 'Millions', 'Just one', 'Ten'], 'Careful listening! The hosts said **thousands**, not millions.'),
        mc('BTC2-5', 'money', 'How many bitcoins can ever exist?', ['21 million', '21 thousand', 'As many as people want', '100'], 'The limit is written in Bitcoin\'s rules — you can\'t print more.'),
        mc('BTC2-7', 'inference', '🔎 Detective: look at the notebook pages in the picture. "A paid B" is written on **two** pages. If A only had money for one payment, what problem is that?', ['Double spending — using the same money twice', 'Inflation', 'Bartering', 'Mining'], 'That\'s exactly what the shared notebook catches: the computers see A already spent that money and reject the second payment.'),
        mc('BTC2-9', 'context', 'Why do some people call Bitcoin "digital gold"?', ['It is rare — only 21 million, and nobody can print more', 'It is shiny and yellow', 'It is made from real gold', 'Banks keep it in vaults'], 'Like gold, it is **scarce** (limited).')
      ] },
    { title: 'Mining and the Secret Key', audio: 'modules/BITCOIN/ch3.m4a', image: 'modules/BITCOIN/money.jpg', minutes: 5,
      briefing: { mission: 'With no boss, how do thousands of strangers agree on what goes on the next page — and how do you keep your bitcoin safe?',
        predict: { q: 'Bitcoin "mining" means…', options: ['Computers solving hard math puzzles to add a new page to the notebook', 'Digging in a cave with a pickaxe', 'Printing coins in a factory', 'Finding coins in the ocean'], explain: 'No pickaxes! Computers compete in a kind of lottery, and the winner adds the next page.' },
        words: ['mining', 'block', 'private key'] },
      checkpoints: [{ at: 0.5, q: mc('BTC3-c1', 'money', 'Quick check! A new page of recent trades waiting to be added to the notebook is called a…', ['block', 'wallet', 'coin'], 'Trades go into a **block**, and blocks are chained together — a block-chain!') }],
      teach: 'Explain what a **private key** is, using the "magical treasure chest" idea. Why can\'t anyone help you if you lose it?',
      text: `**Mining without pickaxes**

[[Mining|computers competing to solve hard math puzzles so they can add the next page (block) to the blockchain]] is like a giant lottery. Trades are packed into a [[block|a new page of trades waiting to be added to the notebook]]. Computers use LOTS of electricity to solve the puzzle. That is the **security wall**: cheating would cost a fortune in electricity.

A new block is added about **every 10 minutes**. The winning computer gets a reward: today it's **3.125 bitcoins** (not 1!), and the reward is cut in half about **every 4 years**.

**What happens in 2140?**

The last of the 21 million bitcoins should be made around the year **2140**. The network does **not** shut off: miners will keep working for small [[transaction fees|tiny payments people add when they send bitcoin]].

**Is it unhackable?**

No! It is **extremely hard** to cheat — a hacker would need more computer power than most of the rest of the network — but nothing digital is "unhackable" or "perfectly secure."

**Your secret key 🔑**

You use a [[digital wallet|an app that keeps your keys and lets you send and receive bitcoin]]. Your [[private key|a long secret code that proves you own your bitcoin — like the only key to a magical treasure chest]] is everything. There is **no "forgot password" button** and no company to call. Lose the key, and the chest stays locked forever. Being your own bank means total freedom — and total responsibility.`,
      questions: [
        mc('BTC3-1', 'money', 'What do Bitcoin miners actually do?', ['Use computers to solve hard math puzzles and add new blocks', 'Dig for gold coins', 'Print paper money', 'Fix broken phones'], 'Mining = computers competing to add the next page to the notebook.'),
        mc('BTC3-6', 'inference', 'Why are the math puzzles made so hard on purpose?', ['So cheating would cost a fortune in electricity', 'So miners stay busy', 'So bitcoin looks cool', 'To make phones faster'], 'The hard math is the **security wall**.'),
        mc('BTC3-7', 'money', 'What does the winning computer get today?', ['3.125 bitcoins, and the reward is cut in half about every 4 years', 'Exactly 1 bitcoin forever', '21 million bitcoins', 'Nothing'], 'The hosts said some people think it\'s 1 bitcoin — that\'s not true!'),
        mc('BTC3-8', 'inference', '🔎 Detective: what happens around 2140, when the last bitcoin is made?', ['The network keeps running, and miners earn transaction fees', 'The code shuts off and self-destructs', 'Everyone gets free bitcoin', 'Bitcoin turns into dollars'], 'Nothing shuts off — miners collect small fees instead.'),
        mc('BTC3-9', 'inference', '🔎 Detective: is the blockchain "unhackable"?', ['No — it is extremely hard to cheat, but nothing digital is perfectly secure', 'Yes, it is impossible to hack', 'No — it is very easy to hack', 'Only on weekends'], 'Watch out for words like "impossible" and "perfect"!'),
        sortQ('BTC3-3', 'money', 'Is this true for a **bank account** or a **Bitcoin wallet**?', ['🏦 Bank account', '🔑 Bitcoin wallet'], [['"Forgot password?" — they help you', 0], ['There is a company to call', 0], ['You are your own bank', 1], ['Lose your key = locked forever', 1], ['Thousands of computers check the notebook', 1]], 'Freedom comes with responsibility: with Bitcoin, nobody can rescue a lost key.'),
        mc('BTC3-10', 'inference', 'A new page is added about every 10 minutes. How is paying with Bitcoin different from handing cash to the cashier?', ['Cash is done right away; a Bitcoin payment waits to be written on the next page', 'Bitcoin is always faster than cash', 'There is no difference', 'Cash takes 10 minutes too'], 'The hosts asked you this one! Cash is instant — Bitcoin waits for the next block.')
      ] },
    { title: 'Be Smart and Safe', audio: 'modules/BITCOIN/ch4.m4a', image: 'modules/BITCOIN/money.jpg', minutes: 6,
      briefing: { mission: 'The most important part: how to stay **smart and safe** with money online.',
        predict: { q: 'Someone online says: "Send me some crypto and I\'ll double it — guaranteed!" What is it?', options: ['A scam — a promise of free money is always a red flag', 'A great deal', 'A bank promotion', 'A math game'], explain: 'The FTC says: guaranteed profits or free money = scam. Period.' },
        words: ['volatile', 'FDIC', 'scam'] },
      checkpoints: [{ at: 0.5, q: mc('BTC4-c1', 'money', 'Quick check! A price that zooms up and down fast, like a roller coaster, is…', ['volatile', 'durable', 'portable'], 'Bitcoin\'s price is famous for being **volatile**!') }],
      teach: 'Explain to Mom or Dad how to **spot a crypto scam**. Give 2 warning signs, and say what you would do.',
      text: `**Piggy bank or roller coaster? 🎢**

Money in a piggy bank stays the same — that is [[saving|keeping money safe so it is still there later]]. Bitcoin is more like a roller coaster: its price is very [[volatile|goes up and down a lot, fast]]. Something worth thousands today could be worth hundreds tomorrow.

**Safety nets**

Money in a regular U.S. bank has [[FDIC insurance|a government promise that protects bank deposits, up to $250,000, if the bank fails]]. It covers the bank **going out of business** — it does **not** cover bank robberies. Crypto has **no** government safety net. And if you make a typo and send bitcoin to the wrong wallet, it **can't be undone**.

**Both sides**

👍 Supporters say Bitcoin is fast to send across the world, works anywhere with internet, and lets you be your own bank.
👎 Critics worry about sudden price drops, no consumer protection, and tiny mistakes that cost everything.

**Scam alert 🚨** (from the FTC)

• Any promise of guaranteed profits or free money = **scam**.
• Scammers pretend to be celebrities, businesses or the government ("your money is at risk, send crypto!").
• Fake jobs, and new "friends" from dating sites who give crypto advice.

**The golden rule**

Kids should **never** use crypto or digital wallets without a parent's permission and supervision. Always have Mom or Dad as your co-pilot! 🧑‍✈️`,
      questions: [
        mc('BTC4-1', 'inference', 'A message says: "This is the government. Your money is at risk! Send it to us in crypto to keep it safe." What should you do?', ['Stop and tell Mom or Dad — it\'s a scam', 'Send it quickly', 'Send half the money', 'Ask for a discount'], 'Scammers pretend to be people you trust and try to make you panic.'),
        sortQ('BTC4-2', 'money', 'Piggy bank or roller coaster?', ['🐷 Saving (stays the same)', '🎢 Volatile (goes up and down)'], [['A dollar in a piggy bank', 0], ['Money in a savings account', 0], ['Bitcoin', 1], ['Something worth thousands today and hundreds tomorrow', 1]], 'Saving keeps money steady. Bitcoin\'s price is a roller coaster.'),
        mc('BTC4-7', 'inference', 'A robber steals cash from a bank. Does FDIC insurance cover it?', ['No — FDIC covers deposits if the bank fails, not robberies', 'Yes, FDIC covers everything', 'Only if it\'s bitcoin', 'Only on Mondays'], 'The hosts called it a common mix-up: FDIC is for when a bank **fails**.'),
        mc('BTC4-8', 'money', 'You type the wallet address wrong and send bitcoin to the wrong place. What happens?', ['It can\'t be undone — it\'s gone', 'The bank sends it back', 'Customer service fixes it', 'It comes back in 10 minutes'], 'No bank in the middle means no "undo" button.'),
        mc('BTC4-9', 'inference', 'What is the biggest red flag, according to the FTC?', ['A promise of guaranteed profits or free money', 'A long password', 'A slow computer', 'A price in dollars'], 'Free money = scam. Period.'),
        mc('BTC4-5', 'money', 'What is the golden rule for kids and crypto?', ['Never use it without your parents\' permission and supervision', 'Buy it when the price is low', 'Only use it for pizza', 'Share your key with friends'], 'Always have a parent as your co-pilot.'),
        txt('BTC4-6', 'money', 'Give **one reason supporters like Bitcoin** and **one worry critics have**. Then answer the hosts\' last question: what will money look like when you are a grown-up?', 'Full credit (2): one real pro (fast across the world, works anywhere with internet, be your own bank, limited supply) AND one real con (volatile, scams, can\'t undo, no FDIC/safety net), plus a prediction. Partial (1): only one side. 0: no reasons.')
      ] }
  ]
});

/* ---- Deep Sea: Glowing Creatures of the Deep (NotebookLM, Nov 2026) ----
   Audio "Glowing Creatures of the Deep Sea" (25:30) cut at the "Part" breaks:
   0:00–8:23 · 8:23–13:24 · 13:24–18:37 · 18:37–end. Picture: ocean zones infographic. */
addModule({
  id: 'SEA', title: 'Deep Sea: Glowing Creatures of the Deep', icon: '🌊', from: '2027-01-05',
  cover: 'modules/DEEPSEA/zones.jpg',
  chapters: [
    { title: 'Down Through the Ocean Zones', audio: 'modules/DEEPSEA/ch1.m4a', image: 'modules/DEEPSEA/zones.jpg', minutes: 8,
      briefing: { mission: 'Seal the hatch! 🚢 Your submarine is diving to the very bottom of the sea. What changes as you go down?',
        predict: { q: 'As you dive deeper into the ocean, what happens?', options: ['It gets darker, colder, and the water pushes harder', 'It gets brighter and warmer', 'Nothing changes', 'The water gets lighter'], explain: 'Light fades, the temperature drops and the **pressure** grows — every 10 meters adds about 1 atmosphere!' },
        words: ['abyss', 'trench', 'pressure'] },
      checkpoints: [{ at: 0.5, q: mc('SEA1-c1', 'science', 'Quick check! The top layer of the ocean, where plants can grow, is the…', ['sunlight zone', 'midnight zone', 'abyss'], 'Only the **sunlight zone** (0–200 m) has enough light for plants.') }],
      teach: 'Explain to your brother why a plastic bottle gets crushed in the deep sea but a jellyfish does not. Use the word **pressure**.',
      text: `**The ocean has layers**

Water soaks up light, like stacking pair after pair of sunglasses. The deeper you go, the darker it gets.

• **Sunlight zone** (0–200 m): warm and bright; plants can make food.
• **Twilight zone** (200–1,000 m): very dim; too dark for plants.
• **Midnight zone** (1,000–4,000 m): pitch black — no sunlight at all.
• **Abyss** (4,000–6,000 m): an [[abyss|a very deep, dark space]] with near-freezing water.
• **Hadal zone** (below 6,000 m): the deep [[trenches|long, deep, narrow valleys on the ocean floor]].

The **Mariana Trench** is about **11,000 m** deep — almost 7 miles! If you dropped Mount Everest in, its top would still be more than a mile underwater.

**Pressure** 🐘

[[Pressure|the weight of the water pushing on you]] goes up about **1 atmosphere for every 10 meters**. At the bottom of a trench, it's like a couple of elephants standing on your thumb!

So why don't deep-sea animals get squished? An empty bottle is full of **air**, and air can be squeezed. Deep-sea animals are made mostly of **water**, which hardly squeezes at all — so they push back just as hard as the ocean pushes in.`,
      questions: [
        orderQ('SEA1-1', 'science', 'Put the ocean zones in order, from the **top** to the **bottom**.', ['☀️ Sunlight zone', '🌆 Twilight zone', '🌑 Midnight zone', '🕳️ Abyss', '⛰️ Hadal zone (trenches)'], 'Top to bottom: sunlight → twilight → midnight → abyss → hadal.'),
        mc('SEA1-2', 'science', 'Why can\'t plants grow in the twilight zone?', ['There is not enough sunlight', 'The water is too salty', 'Fish eat all the seeds', 'It is too warm'], 'Plants need sunlight to make food, and the twilight zone is too dim.'),
        mc('SEA1-3', 'science', 'For every 10 meters you go down, the pressure goes up by about…', ['1 atmosphere', '100 atmospheres', 'nothing', '1 elephant'], 'The rule of thumb: **+1 atmosphere every 10 meters**.'),
        mc('SEA1-4', 'inference', 'An empty plastic bottle gets crushed in the deep sea, but a jellyfish doesn\'t. Why?', ['The bottle is full of air, which squeezes; the jellyfish is mostly water, which hardly squeezes', 'Jellyfish are made of metal', 'The jellyfish swims away from the pressure', 'Bottles are heavier than jellyfish'], 'Air can be compressed; water can\'t (much). The water inside pushes back just as hard.'),
        mc('SEA1-5', 'science', 'How deep is the Mariana Trench?', ['About 11,000 meters (almost 7 miles)', 'About 100 meters', 'About 1 mile', 'About 100 miles'], 'Mount Everest would fit inside with more than a mile of water above it!'),
        mc('SEA1-6', 'vocab', 'What is a **trench**?', ['A long, deep, narrow valley on the ocean floor', 'A tall underwater mountain', 'A kind of submarine', 'A glowing fish'], 'The Mariana Trench is the deepest one on Earth.'),
        txt('SEA1-7', 'science', 'The hosts asked: which ocean zone would you visit first in your submarine? Name the zone and give **two things** you would see or feel there.', 'Full credit (2): names a real zone and 2 correct details (light, temperature, pressure or animals of that zone). Partial (1): zone with 1 detail. 0: no zone.')
      ] },
    { title: 'Living Lights: Bioluminescence', audio: 'modules/DEEPSEA/ch2.m4a', image: 'modules/DEEPSEA/zones.jpg', minutes: 5,
      briefing: { mission: 'It\'s pitch black outside the window… but wait — something is **glowing**! ✨ Who makes light in the dark, and why?',
        predict: { q: 'Many deep-sea animals glow. Where does their light come from?', options: ['A chemical reaction inside their bodies', 'Tiny batteries', 'Sunlight they saved up', 'Lightning from storms'], explain: 'It\'s **bioluminescence**: two chemicals (luciferin + luciferase) mix with oxygen and make light.' },
        words: ['bioluminescence', 'counter-illumination', 'lure'] },
      checkpoints: [{ at: 0.5, q: mc('SEA2-c1', 'science', 'Quick check! When a living thing makes its own light, it\'s called…', ['bioluminescence', 'photosynthesis', 'pressure'], 'Like a firefly in your backyard!') }],
      teach: 'Teach Mom or Dad **two reasons** animals make light in the deep sea, using one animal for each reason.',
      text: `**Bioluminescence** ✨

[[Bioluminescence|when a living thing makes its own light]] comes from a chemical reaction: a molecule called **luciferin**, a helper called **luciferase**, and oxygen. Not every deep-sea animal glows — but **many** of them do!

Why make light? To **find food**, to **hide**, to **talk** to each other and to **scare** predators.

🐟 **Lanternfish** have light spots on their bellies. They match the faint light from above so their shadow disappears — a trick called [[counter-illumination|using belly lights to hide your shadow]].

🎣 The **anglerfish** has a glowing [[lure|a "fishing rod" bait that tricks prey]]. The light comes from **bacteria** living inside it! Only the **females** have the lure.

🧛 The **vampire squid** doesn't drink blood. Black ink is useless in the dark, so it squirts a cloud of **glowing, sticky mucus** and escapes.

🦐 A deep-sea **shrimp** "spits" glowing liquid at attackers, like a flash, and darts away.`,
      questions: [
        mc('SEA2-1', 'science', 'Bioluminescence happens when…', ['luciferin and luciferase mix with oxygen and make light', 'animals swallow light bulbs', 'sunlight bounces off scales', 'water gets very cold'], 'It\'s a chemical reaction inside the animal.'),
        sortQ('SEA2-2', 'science', 'Why is each animal using its light? **Hide** or **hunt/defend**?', ['🙈 To hide', '🎯 To hunt or defend'], [['Lanternfish belly lights match the light above', 0], ['Anglerfish lure tricks small fish', 1], ['Vampire squid squirts a glowing cloud and escapes', 1], ['Shrimp spits glowing liquid at an attacker', 1]], 'Lanternfish hide with counter-illumination; the others use light to catch food or escape.'),
        mc('SEA2-3', 'inference', '🔎 Detective: where does the light in the anglerfish\'s lure really come from?', ['Bacteria living inside the lure', 'The anglerfish makes it in its brain', 'Sunlight stored in the lure', 'A glowing rock'], 'The bacteria get a home and food; the fish gets a glowing lure. Teamwork!'),
        mc('SEA2-4', 'inference', 'Why does the vampire squid squirt **glowing** mucus instead of black ink?', ['Black ink would be invisible in the dark, so it wouldn\'t confuse anyone', 'It ran out of ink', 'Glowing mucus tastes better', 'To find food'], 'In a pitch-black place, only a glowing cloud can confuse a predator.'),
        mc('SEA2-5', 'inference', '🔎 Detective: do ALL deep-sea animals glow?', ['No — many do, but not all', 'Yes, every single one', 'None of them glow', 'Only the plants glow'], 'The hosts were careful: "many or most", not "all".'),
        mc('SEA2-6', 'vocab', 'A lanternfish turns on its belly lights so predators below can\'t see its shadow. This is called…', ['counter-illumination', 'pressure', 'photosynthesis', 'migration'], 'Counter = against, illumination = lighting: light that cancels the shadow.')
      ] },
    { title: 'Superpowers of the Deep', audio: 'modules/DEEPSEA/ch3.m4a', image: 'modules/DEEPSEA/zones.jpg', minutes: 5,
      briefing: { mission: 'Cold, dark, little food and crushing pressure… Meet the animals with **superpowers** that live there!',
        predict: { q: 'Why does a blobfish look like a sad pink blob in photos?', options: ['It was pulled up to the surface, where there is no deep-sea pressure holding it together', 'It is always sad', 'It is made of bubble gum', 'It is sick'], explain: 'In its home, the pressure holds it together and it looks like a normal fish!' },
        words: ['adaptation', 'predator', 'prey'] },
      checkpoints: [{ at: 0.5, q: mc('SEA3-c1', 'science', 'Quick check! A special body part or skill that helps an animal survive is an…', ['adaptation', 'atmosphere', 'abyss'], 'Big eyes, stretchy stomachs, flying "ears" — all adaptations!') }],
      teach: 'Pick your favorite deep-sea animal and explain its **adaptation** to your brother: what is it, and how does it help the animal survive?',
      text: `**Adaptations** 🦸‍♀️

An [[adaptation|a special body part or skill that helps an animal survive]] can be a superpower in the deep. A [[predator|an animal that hunts other animals]] hunts [[prey|an animal that is hunted and eaten]].

🩷 **Blobfish**: in photos it looks like a pink blob, but only because it was pulled up from the deep. Down there the pressure holds its jelly-like body together. Its body is lighter than the water, so it floats above the seafloor without wasting energy.

🦑 **Giant squid**: as long as a school bus, with eyes as big as **dinner plates** — some of the biggest eyes of any animal. Big eyes catch the tiniest bit of light, like the shadow of a **sperm whale** coming to hunt it. (The giant squid and the colossal squid are two different animals!)

🐙 **Dumbo octopus**: flaps fins that look like elephant ears. It has **no ink sac** — ink is useless in the dark.

🐍 **Gulper eel**: a huge mouth and a stretchy stomach, so it can swallow big meals when food is rare. Its tail tip glows to attract prey.`,
      questions: [
        mc('SEA3-1', 'inference', 'Why does a blobfish look like a "blob" in photos?', ['It was taken out of the deep-sea pressure that holds its body together', 'It eats too much', 'It is a jellyfish', 'It is always that shape'], 'At home, deep underwater, it looks like a regular fish.'),
        mc('SEA3-2', 'science', 'Why does the giant squid have eyes as big as dinner plates?', ['To catch the tiniest bit of light, like a hunting whale\'s shadow', 'To look scary', 'To see the sun', 'To read'], 'Bigger eyes let in more of the faint light.'),
        sortQ('SEA3-3', 'science', 'Match each animal to its **superpower**: sort into **eating** or **staying safe / moving**.', ['🍽️ Helps it eat', '🛡️ Helps it stay safe or move'], [['Gulper eel\'s huge mouth and stretchy stomach', 0], ['Gulper eel\'s glowing tail tip', 0], ['Giant squid\'s huge eyes spot whales', 1], ['Dumbo octopus\'s ear-like fins', 1], ['Blobfish floats without using energy', 1]], 'Adaptations help animals eat, hide, move and save energy.'),
        mc('SEA3-4', 'inference', 'The dumbo octopus has no ink sac. Why does that make sense?', ['Black ink doesn\'t help in the dark, so it isn\'t needed', 'It lost it in a fight', 'It is a baby', 'Ink is too expensive'], '"Use it or lose it": nature drops what doesn\'t help.'),
        mc('SEA3-5', 'inference', '🔎 Detective: the hosts said "giant squid, not colossal squid". What does that tell you?', ['They are two different animals', 'They are the same animal', 'Colossal squid don\'t exist', 'Giant squid are tiny'], 'Scientists are careful with names — two different species!'),
        mc('SEA3-6', 'inference', '🔎 Detective: look at the picture. It shows the blobfish in the **abyss** (4,000–6,000 m). But blobfish really live around 600–1,200 m. Which zone is closer to the truth?', ['The twilight and midnight zones', 'The sunlight zone', 'The hadal trenches', 'Outer space'], 'Pictures can have mistakes too! Real blobfish live much higher than the abyss.')
      ] },
    { title: 'Explorers and Protectors', audio: 'modules/DEEPSEA/ch4.m4a', image: 'modules/DEEPSEA/zones.jpg', minutes: 7,
      briefing: { mission: 'Time to surface! 🚢 How do scientists explore a place no light reaches — and how can **you** help protect it?',
        predict: { q: 'Deep-sea robots often use **red** lights. Why?', options: ['Most deep-sea animals can\'t see red, so they don\'t get scared', 'Red is the brightest color', 'Red lights are cheaper', 'Red scares sharks away'], explain: 'Red light disappears first in water, so most deep animals never evolved to see it. The robots film them without bothering them!' },
        words: ['submersible', 'ROV', 'conservation'] },
      checkpoints: [{ at: 0.5, q: mc('SEA4-c1', 'science', 'Quick check! A robot that scientists drive from a ship using a long cable is an…', ['ROV', 'abyss', 'lure'], 'ROV = Remotely Operated Vehicle.') }],
      teach: 'Tell Mom or Dad **one way the deep sea is in danger** and **one invention** you would make to protect it.',
      text: `**Exploring the deep** 🤖

Most of the deep ocean has **never been explored** — we have better maps of the Moon than of the ocean floor!

A [[submersible|a small underwater vehicle for exploring the ocean]] like **Alvin** can carry people down. But going deep is dangerous and expensive, so scientists also use [[ROVs|Remotely Operated Vehicles — robots driven from a ship through a long cable]], like **Jason**.

Bright white lights could scare or hurt animals with super-sensitive eyes. So robots use low-light cameras and **red lights**: red light disappears first in water, so most deep-sea animals can't see it.

**Why protect it?** 🌍

Plastic pollution sinks all the way to the trenches; oil spills, warmer and more acidic oceans, and deep-sea mining can harm homes that took millions of years to form. [[Conservation|protecting nature so it lasts]] starts with learning about it — like you're doing now!

**Bonus mystery:** some animals don't make light — they **absorb blue light and shine it back** in another color. That's **biofluorescence**, and scientists are still figuring out why.`,
      questions: [
        mc('SEA4-1', 'science', 'What is an **ROV**?', ['A robot scientists drive from a ship using a long cable', 'A kind of glowing fish', 'A deep-sea trench', 'A type of submarine sandwich'], 'Remotely Operated Vehicle — the scientists stay safe on the ship.'),
        mc('SEA4-2', 'inference', 'Why do deep-sea robots use **red** lights?', ['Most deep-sea animals can\'t see red, so they aren\'t scared away', 'Red lights go farther in water', 'Red is a lucky color', 'Red lights are warmer'], 'Red light is absorbed first, so deep animals never needed to see it.'),
        mc('SEA4-3', 'science', 'How much of the deep ocean have people explored?', ['Only a small part — most has never been explored', 'All of it', 'Exactly half', 'None, nobody has ever gone down'], 'We have better maps of the Moon than of the ocean floor!'),
        sortQ('SEA4-4', 'science', 'Sort: does it **harm** the deep sea or **help** protect it?', ['⚠️ Harms', '💚 Helps'], [['Plastic sinking into the trenches', 0], ['Oil spills', 0], ['Digging minerals from the seafloor', 0], ['Learning about ocean animals', 1], ['A robot that collects microplastics', 1]], 'Learning and caring are the first steps of conservation.'),
        mc('SEA4-5', 'inference', '🔎 Detective: what is the difference between **bioluminescence** and **biofluorescence**?', ['Bioluminescence makes its own light; biofluorescence absorbs blue light and shines it back in another color', 'They are the same thing', 'Biofluorescence happens only on land', 'Bioluminescence uses batteries'], 'One MAKES light, the other CHANGES the light it receives.'),
        txt('SEA4-6', 'science', 'The hosts asked you: what tool or robot would you invent to protect the ocean? Describe it and explain **how it helps**.', 'Full credit (2): a clear invention AND how it helps a real problem (plastic, oil, mining, pollution, studying animals gently). Partial (1): invention without a clear reason. 0: no idea.')
      ] }
  ]
});

/* ---- Ancient Egypt: Pyramids, Mummies and the Rosetta Stone (NotebookLM, Nov 2026) ----
   Audio (20:34) cut at the "Part" breaks: 0:00–5:30 · 5:30–9:25 · 9:25–14:09 · 14:09–end.
   Pictures: only the map and the timeline from the infographic (its text panels had typos). */
addModule({
  id: 'EGY', title: 'Ancient Egypt: Pyramids, Mummies and the Rosetta Stone', icon: '🏺', from: '2027-01-19',
  cover: 'modules/EGYPT/map.jpg',
  chapters: [
    { title: 'The Gift of the Nile', audio: 'modules/EGYPT/ch1.m4a', image: 'modules/EGYPT/map.jpg', minutes: 6,
      briefing: { mission: 'Time machine set to **5,000 years ago**! ⏳ Egypt is almost all desert… so how did people grow so much food?',
        predict: { q: 'What made farming possible in the Egyptian desert?', options: ['The Nile River flooded every year and left rich, dark mud', 'It rained every day', 'They bought food from other countries', 'The desert sand was perfect for plants'], explain: 'Every year the Nile flooded and left fertile black mud on the fields — the "gift of the Nile".' },
        words: ['ancient', 'civilization', 'irrigation'] },
      checkpoints: [{ at: 0.5, q: mc('EGY1-c1', 'history', 'Quick check! Moving water from a river to dry land so crops can grow is called…', ['irrigation', 'civilization', 'mummification'], 'Egyptian farmers dug canals to bring the flood water to their fields.') }],
      teach: 'Explain to your brother why the Nile was called a **gift**. Use the words **flood** and **mud**.',
      text: `**A green river in a desert** 🌴

Egypt is mostly hot, dry desert. But the **Nile River** runs right through it. Ancient Egypt was a [[civilization|a large group of people living together with their own laws, food and culture]] that lasted thousands of years — truly [[ancient|very, very old]].

**The yearly flood**

Every year, the Nile flooded its banks (the Egyptians called this season **Akhet**). The water came from heavy **summer rains in the mountains of Ethiopia**, far to the south. When the water went down, it left thick, dark, rich mud — perfect for farming. Egyptians called their land **Kemet**, "the black land", because of that mud.

Farmers used [[irrigation|moving water from a river to dry land to help crops grow]]: they dug canals to carry water to their fields. They grew wheat and barley (for bread), figs, melons, onions — and **flax**, to make linen clothes.

**The desert shield** 🛡️

The hot "red land" (the desert) on both sides protected Egypt. An army would have to cross hundreds of miles of sand with no water — almost impossible!`,
      questions: [
        mc('EGY1-1', 'science', 'Why was the Nile\'s yearly flood good for farmers?', ['It left rich, dark mud that was perfect for growing crops', 'It washed away all the plants', 'It brought fish to the desert', 'It made the desert colder'], 'The fertile black mud is why they called their land Kemet, "the black land".'),
        mc('EGY1-2', 'inference', '🔎 Detective: the hosts said the flood came from melting **snow**. Scientists say it mainly came from…', ['Heavy summer rains in the mountains of Ethiopia', 'Snow on the pyramids', 'Ocean waves', 'Underground volcanoes'], 'Good detective work! The flood came in late summer from monsoon rains far to the south. Even experts in a podcast can mix things up.'),
        mc('EGY1-3', 'inference', 'How did the desert help protect Egypt?', ['Armies would have to cross miles of sand with no water', 'The sand was poisonous', 'Pyramids blocked the roads', 'It was too cold to walk'], 'The "red land" acted like a giant natural shield.'),
        sortQ('EGY1-4', 'history', 'Sort each thing: **Black land** (by the river) or **Red land** (desert)?', ['🟫 Black land', '🟥 Red land'], [['Rich mud for farming', 0], ['Fields of wheat and barley', 0], ['Irrigation canals', 0], ['Scorching sand with no water', 1], ['A natural shield against armies', 1]], 'Kemet (black land) was the farming strip; the red land was the desert around it.'),
        mc('EGY1-5', 'vocab', 'What is a **civilization**?', ['A large group of people living together with their own laws, food and culture', 'A kind of pyramid', 'A river flood', 'A desert animal'], 'Ancient Egypt was one of the greatest civilizations in history.'),
        txt('EGY1-6', 'inference', 'The hosts asked: if you lived by a river that flooded every year, what crops would you grow? Name two and explain **why the flood would help them grow**.', 'Full credit (2): two crops AND explains the flood leaves rich/fertile mud and water. Partial (1): crops without a clear reason. 0: no answer.')
      ] },
    { title: 'Pharaohs and Pyramids', audio: 'modules/EGYPT/ch2.m4a', image: 'modules/EGYPT/map.jpg', minutes: 4,
      briefing: { mission: 'A 40-story building of solid stone — with **no cranes, no trucks, no engines**. How did they do it?',
        predict: { q: 'Who built the pyramids?', options: ['Mostly paid workers and farmers', 'Aliens', 'Magic', 'Robots'], explain: 'Historians now think the pyramids were built mostly by paid workers and farmers — pure human brainpower and teamwork!' },
        words: ['pharaoh', 'tomb', 'friction'] },
      checkpoints: [{ at: 0.5, q: mc('EGY2-c1', 'history', 'Quick check! A powerful king or queen of ancient Egypt was called a…', ['pharaoh', 'scribe', 'mummy'], 'Pharaohs were treated like living gods.') }],
      teach: 'Show Mom or Dad how the workers moved a heavy stone: explain the **sled** and why they poured **water** on the sand.',
      text: `**Pharaohs** 👑

A [[pharaoh|a powerful king or queen of ancient Egypt, treated like a living god]] made the laws and led the religion. There were about 170 of them, including Queen **Hatshepsut**, **Ramses II** and **Cleopatra**.

When a pharaoh died, they needed a giant [[tomb|a special room or building where someone is buried]]. For the early pharaohs, that was a **pyramid**.

**Who built them?**

Not aliens, not magic! Historians now think the pyramids were built mostly by **paid workers and farmers**. During the flood, fields were underwater, so farmers came to work on the pyramids. They got food and housing, and were proud of their work.

**How?** 🛷

Blocks as heavy as a car went on **wooden sleds**. A worker poured **water on the sand** in front of the sled — wet sand is slicker, so it cuts the [[friction|the rubbing force that makes things hard to slide]]. Teams pulled with ropes and used mudbrick **ramps** to go higher.

The **Great Pyramid of Giza** was built for the pharaoh **Khufu** about **4,500 years ago**. It was about 146 meters tall and took about **20 years**.`,
      questions: [
        mc('EGY2-1', 'inference', '🔎 Detective: who do historians now think built the pyramids?', ['Mostly paid workers and farmers', 'Millions of slaves', 'Aliens from space', 'Pharaohs with magic wands'], 'The myths "rob the Egyptians of their true genius" — it was human teamwork!'),
        mc('EGY2-2', 'science', 'Why did workers pour water on the sand in front of the sled?', ['Wet sand is slicker, so there is less friction and the sled slides more easily', 'To cool down the stones', 'To give the workers a drink', 'To make mud bricks'], 'Less friction = easier to pull — clever physics!'),
        mc('EGY2-3', 'inference', 'Why could farmers work on the pyramids during the flood season?', ['Their fields were underwater, so they couldn\'t farm', 'They were on vacation', 'The pharaoh closed the farms', 'Pyramids were built only in winter'], 'The flood season (Akhet) freed farmers to work — and they were paid.'),
        orderQ('EGY2-4', 'history', 'Put the steps in order to move a giant stone block.', ['Put the block on a wooden sled', 'Pour water on the sand in front', 'Pull the sled with thick ropes', 'Drag it up a mudbrick ramp'], 'Sled → wet sand → ropes → ramp!'),
        mc('EGY2-5', 'history', 'The Great Pyramid of Giza was built for which pharaoh, about how long ago?', ['Khufu, about 4,500 years ago', 'Cleopatra, about 100 years ago', 'King Tut, last year', 'Ramses II, 50 years ago'], 'Khufu\'s pyramid took about 20 years to build.'),
        txt('EGY2-6', 'inference', 'The hosts asked: if you managed thousands of workers moving heavy stones, what would be your **number one rule for teamwork**? Explain why it matters.', 'Full credit (2): a clear rule AND why it helps (safety, pulling at the same time, communication). Partial (1): rule without reason. 0: no answer.')
      ] },
    { title: 'Daily Life and the Secret Code', audio: 'modules/EGYPT/ch3.m4a', image: 'modules/EGYPT/timeline.jpg', minutes: 5,
      briefing: { mission: 'What was life like for a **kid your age** in ancient Egypt — and how did we learn to read their mysterious writing?',
        predict: { q: 'Hieroglyphs look like little pictures. What do most of them stand for?', options: ['Many stand for sounds, like our letters', 'Only for whole words', 'Nothing — they are decorations', 'Numbers only'], explain: 'Many hieroglyphs stand for sounds — a foot is a "b" sound, a horned snake is an "f"!' },
        words: ['hieroglyphs', 'papyrus', 'scribe'] },
      checkpoints: [{ at: 0.5, q: mc('EGY3-c1', 'history', 'Quick check! Egyptians made a kind of paper from a river plant called…', ['papyrus', 'flax', 'wheat'], 'Our word "paper" comes from "papyrus"!') }],
      teach: 'Explain to your brother how the **Rosetta Stone** helped people read hieroglyphs again. Use the words **Greek**, **names** and **sounds**.',
      text: `**A kid's day** 🏠

Kids lived in houses of sun-baked mud bricks. Breakfast was bread with honey and milk. They had chores, like carrying water from the river. Families loved their children, and the favorite pet was the **cat** — Egyptians believed cats protected kids from snakes and scorpions. They wore light **linen** clothes made from the flax plant.

**Paper and writing** 📜

They made [[papyrus|a paper-like material made from a river plant]] by slicing the plant into strips, crossing them and pressing them flat. Trained writers called [[scribes|people whose job was to read and write]] wrote in [[hieroglyphs|ancient Egyptian writing that uses pictures and symbols]].

Hieroglyphs are **not only pictures**: many stand for **sounds**, like our letters. A foot = "b" sound; a horned viper = "f" sound.

**The Rosetta Stone** 🗿

For centuries, nobody could read hieroglyphs. In **1799** a stone was found with the same message written in hieroglyphs and in **ancient Greek** (which scholars could read). In **1822**, **Jean-François Champollion** matched royal names like **Ptolemy** — written inside ovals called **cartouches** — to their sounds and cracked the code!`,
      questions: [
        mc('EGY3-1', 'inference', '🔎 Detective: what did people get wrong about hieroglyphs for hundreds of years?', ['They thought they were only pictures, but many stand for sounds', 'They thought they were in English', 'They thought they were numbers', 'They thought they were maps'], 'A foot is a "b" sound, a horned viper an "f" — like an alphabet!'),
        mc('EGY3-2', 'inference', 'Why was the Rosetta Stone such a big deal?', ['It had the same message in Greek and hieroglyphs, so scholars could compare them', 'It was made of gold', 'It showed where the pyramids were', 'It was the biggest stone in Egypt'], 'It was a giant "decoder ring" for a lost language.'),
        orderQ('EGY3-3', 'history', 'Put the story of cracking the code in order.', ['Nobody can read hieroglyphs for centuries', 'The Rosetta Stone is found (1799)', 'Scholars compare it with the Greek text', 'Champollion cracks the code (1822)'], 'Found in 1799, decoded in 1822!'),
        mc('EGY3-4', 'history', 'How did Champollion start cracking the code?', ['He matched royal names like Ptolemy, in cartouches, to their sounds', 'He asked an Egyptian pharaoh', 'He guessed randomly', 'He used a computer'], 'Names keep their sounds in every language — a brilliant clue!'),
        mc('EGY3-5', 'inference', 'Why did Egyptian kids often have a cat as a pet?', ['Egyptians believed cats protected children from snakes and scorpions', 'Cats could read hieroglyphs', 'Dogs were not allowed', 'Cats helped build pyramids'], 'Cats were so special that hurting one was a serious crime.'),
        mc('EGY3-6', 'vocab', 'A **scribe** was…', ['a trained writer who could read and write', 'a type of pyramid', 'a royal pet', 'a flood season'], 'Scribes wrote on papyrus — an important job!')
      ] },
    { title: 'Mummies, the Afterlife and King Tut', audio: 'modules/EGYPT/ch4.m4a', image: 'modules/EGYPT/timeline.jpg', minutes: 6,
      briefing: { mission: 'Why did Egyptians make **mummies** — and what did an archaeologist find in **1922** that changed history?',
        predict: { q: 'During mummification, which organ was usually LEFT inside the body?', options: ['The heart', 'The stomach', 'The lungs', 'The liver'], explain: 'They believed the heart held your mind and memories — it would be weighed against the feather of truth!' },
        words: ['preserve', 'afterlife', 'archaeologist'] },
      checkpoints: [{ at: 0.5, q: mc('EGY4-c1', 'history', 'Quick check! To keep something safe and in good condition for a long time is to…', ['preserve', 'erupt', 'irrigate'], 'Mummification was a way to preserve the body for the afterlife.') }],
      teach: 'Tell Mom or Dad the story of **Howard Carter** finding King Tut\'s tomb — and explain why the "curse" is a myth.',
      text: `**Loving life forever** 🌅

Egyptians weren't obsessed with death — they loved life so much they wanted it to last forever. They believed in an [[afterlife|a life after death]] that looked like a perfect Egypt. To get there, your **heart** was weighed against the **feather of truth**: a heart light with goodness passed the test.

**Mummies**

They believed the body had to be [[preserved|kept safe and in good condition for a very long time]]. Mummification took about **70 days**. Most organs were placed in **canopic jars**, but the **heart was usually left inside**. Tombs were filled with **grave goods**: food, games, chariots and little statues believed to do chores in the afterlife.

**King Tut** 🔦

Most tombs were robbed long ago. But in **1922**, the [[archaeologist|a scientist who studies the past by digging up old objects and buildings]] **Howard Carter** found the tomb of the young pharaoh **Tutankhamun** — still full of treasure, including his famous gold mask.

**The "curse"?** It's a **myth**! Newspapers made it up to sell more papers.

Egyptians believed your name had to be **remembered** to live forever — and today, we still say Khufu, Hatshepsut and Tut!`,
      questions: [
        mc('EGY4-1', 'inference', 'Why was the heart usually left inside the mummy?', ['Egyptians believed it held your mind and memories, and it would be weighed in the afterlife test', 'It was too hard to remove', 'It was used to make papyrus', 'Pharaohs had no heart'], 'The heart was weighed against the feather of truth.'),
        mc('EGY4-2', 'inference', '🔎 Detective: King Tut\'s curse is…', ['a myth made up by newspapers to sell papers', 'a proven fact', 'a real magic spell', 'the reason the pyramids fell'], 'Real history beats movie myths!'),
        mc('EGY4-3', 'history', 'Who found King Tut\'s tomb, and when?', ['Howard Carter, in 1922', 'Champollion, in 1799', 'Cleopatra, 4,500 years ago', 'Khufu, in 1822'], 'The tomb had stayed hidden for about 3,000 years.'),
        sortQ('EGY4-4', 'history', 'Was it put **inside a canopic jar** or **kept in the body / tomb**?', ['🏺 Canopic jar', '⚱️ Body or tomb'], [['Stomach', 0], ['Liver', 0], ['Lungs', 0], ['Heart', 1], ['Board games and food (grave goods)', 1]], 'Organs went into canopic jars; the heart stayed; grave goods filled the tomb.'),
        mc('EGY4-5', 'inference', 'Why were King Tut\'s treasures still there in 1922, when most tombs were empty?', ['His tomb was hidden and never robbed', 'Robbers didn\'t like gold', 'It was built in 1920', 'It was guarded by cats'], 'Most tombs were robbed thousands of years ago — Tut\'s stayed hidden.'),
        txt('EGY4-6', 'inference', 'The hosts said Egyptians believed your **name** had to be remembered to live forever. By learning about Khufu, Hatshepsut and King Tut, are we "keeping them alive"? Explain your thinking.', 'Full credit (2): a clear opinion AND a reason connected to remembering names/history. Partial (1): opinion without reason. 0: no answer.')
      ] }
  ]
});
