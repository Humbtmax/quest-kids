/* =========================================================
   Learning Quest — CHAPTER STORIES (Ava Mitchell)
   Each chapter: pages (read in order), quick checks after pages 2 and 4,
   read-aloud pages (recorded), then end questions.
   Also builds window.PLAN = the order of all quests (stories + skills).
   ========================================================= */

window.SKILLS.money = { name: 'Money Smarts', icon: '💰', area: 'math' };

window.STORIES = {
  A: { title: 'Ava Mitchell and the Secret Lab Notebook', icon: '🧪' },
  B: { title: 'Ava Mitchell and the Island of Golden Coins', icon: '🏝️' }
};

function chapter(id, story, n, title, pages, checks, questions) {
  return {
    id, kind: 'story', story, chapter: n, icon: window.STORIES[story].icon,
    title: `${window.STORIES[story].title.replace('Ava Mitchell and the ', '')} · Ch. ${n}: ${title}`,
    chapterTitle: title, pages, aloud: pages.map((_, i) => i + 1), checks, questions
  };
}
function check(id, after, prompt, options) {
  return { id, after, type: 'mc', skill: 'check', prompt, options, answer: 0 };
}

window.CHAPTERS = [
/* ===================== STORY A ===================== */
chapter('SA1', 'A', 1, 'The Notebook in the Attic', [
`Ava Mitchell was eleven years old, and she had one rule: never leave a mystery unsolved. So when Grandma Rose asked her to help clean the dusty attic on a rainy Saturday, Ava said yes before Grandma even finished the question.

Her little brother, Max, who was two, wanted to help too. Mostly, he helped by sitting in a cardboard box and shouting, "Boat!"

The attic smelled like old books and cedar wood. Sunlight came through one round window and made the dust sparkle like tiny stars. Ava moved a stack of [[faded|lost its color over time]] photo albums, and that's when she saw it: a metal box with a lock shaped like a horseshoe.

"Grandma," Ava called, "what's in this box?"

Grandma Rose climbed the last step and pushed up her glasses. For a moment she didn't say anything. Then she smiled a slow, secret smile.

"Well," she said. "I wondered when you would find that."`,
`Grandma Rose had been a scientist for forty years. She had worked in a lab full of beakers, wires, and machines that beeped. Ava had seen the old photos, but Grandma never talked much about her job.

"There is no key," Grandma said. "The box opens with science. I made it that way so only a real scientist could open it."

On the lid, someone had [[engraved|cut words or designs into a hard surface]] a riddle:

*I have no glue, yet I can stick. I pull on iron, quick, quick, quick.*

Ava read it twice. Something that sticks without glue... and pulls on iron...

"A magnet!" she shouted. Max clapped, even though he had no idea why.

Ava ran downstairs and grabbed the strongest magnet on the refrigerator, the one shaped like a pineapple. She held it against the horseshoe lock. *Click.* Inside the lock, a tiny iron pin slid toward the magnet, and the lid popped open.`,
`Inside the box was a notebook with a green leather cover. Gold letters on the front said: **LAB NOTEBOOK — PROPERTY OF DR. ROSE MITCHELL.**

Ava opened it carefully. The pages were filled with drawings, numbers, and notes in Grandma's neat handwriting. There were sketches of rockets, plants, batteries, and bridges. Some pages had little puzzles in the corners.

Near the back, Ava found a drawing that made her heart beat faster. It was a small robot with round eyes, two wheels, and a light on top of its head. Next to it, Grandma had written: *Project SPARKY. A helper robot. Never finished.*

"Why didn't you finish him?" Ava asked.

"Life got busy," Grandma said softly. "Your dad was born, then work, then more work. Sparky waited and waited." She tapped the page. "Maybe Sparky was waiting for you."

At the bottom of the page was a note: *To finish Sparky, you will need patience, curiosity, and a little bit of money.*`,
`On the next page, Grandma had listed the parts Sparky still needed:

• 2 small motors — $18
• 1 battery pack — $12
• 1 LED light — $5
• Wires and switches — $10
• Wheels — $15

Ava added the numbers in her head, then on her fingers, then on the back of her hand with a pen. "Sixty dollars," she said. "Sparky needs sixty dollars of parts."

She ran to her room and opened her piggy bank, which was shaped like a pig wearing sunglasses. She counted every coin and every bill. Seven dollars and twenty-five cents.

Ava sat on her bed and stared at the money. Sixty dollars felt as far away as the moon.

Grandma leaned on the doorway. "A scientist never gives up when the numbers look too big," she said. "She makes a plan."

Ava looked at the notebook, then at her piggy bank. She needed a plan, and she needed it fast.`
], [
  check('SA1-c1', 2, 'How did Ava open the box?', ['She used a magnet to pull the iron pin in the lock', 'She found a hidden key', 'Grandma opened it for her', 'Max broke the lock']),
  check('SA1-c2', 4, 'How much money did Ava have in her piggy bank?', ['$7.25', '$60.00', '$18.00', '$5.00'])
], [
  mc('SA1-1', 'inference', 'Why did Grandma Rose make the box open "with science" instead of with a key?', ['She wanted only a real scientist to be able to open it', 'She lost the key', 'Keys are too expensive', 'She never wanted anyone to open it'], 'Grandma says: "I made it that way so only a real scientist could open it."'),
  mc('SA1-2', 'context', 'Grandma "smiled a slow, secret smile." This shows that Grandma…', ['knew something about the box that she wasn\'t saying yet', 'was angry', 'was very tired', 'was confused'], 'A secret smile means she knows something she isn\'t telling yet.'),
  mc('SA1-3', 'figurative', '"Sixty dollars felt as far away as the moon" is a simile. What does it mean?', ['The goal felt very hard to reach', 'Ava wanted to go to space', 'The money was on the moon', 'Sixty dollars is a small amount'], 'Comparing the money to the far-away moon shows how hard the goal felt.'),
  num('SA1-4', 'money', 'Sparky needs $60 of parts. Ava has $7.25. How much more money does she need? (Write it like 12.50)', ['52.75'], '$60.00 − $7.25 = $52.75.'),
  num('SA1-5', 'money', 'Two motors cost $18 in all. How much does ONE motor cost, in dollars?', '9', '$18 ÷ 2 = $9.')
]),

chapter('SA2', 'A', 2, 'Sixty Dollars', [
`At breakfast on Monday, Ava made a chart on a napkin. At the top she wrote: **HOW TO GET $60.**

"You could ask Mom and Dad," said Dad, sipping his coffee.

"That's not a plan, that's a wish," Ava said. Grandma laughed so hard she almost dropped her spoon.

Ava thought about what she was good at. She was good at drawing. She was good at science. And she was very, very good at making slime. Last summer, every kid on Maple Street had begged her for some.

"I'll start a business," Ava announced. "Ava's Amazing Slime."

Dad raised his eyebrows. "A business needs a [[budget|a plan for how to spend and save money]]. How much does it cost to make one jar of slime?"

Ava opened her mouth, then closed it. She had no idea. Making slime had always been just for fun. She had never thought about what it cost.

"Let's find out," Grandma said, pulling a pencil out of her bun.`,
`That afternoon, Grandma took Ava and Max to the store. Ava carried a notebook and wrote down every price.

• Big bottle of school glue: $4.00 (makes 4 jars)
• Contact lens solution: $3.00 (makes 6 jars)
• Baking soda: $1.00 (makes 10 jars)
• Small jars with lids: $3.00 for a pack of 6

Ava also stopped in front of a shiny pink glitter pen. "I need this," she said.

"Do you *need* it," Grandma asked, "or do you *want* it?"

Ava thought about it. The glitter pen wouldn't help make slime. It wouldn't help Sparky. "I want it," she [[admitted|agreed that something is true, even though she didn't want to]]. "But I don't need it."

"That's the most important question about money," Grandma said. "*Needs* are things you must have. *Wants* are things that would be nice to have. Smart people take care of needs first."

Ava put the pen back. It was harder than solving the magnet riddle.`,
`Back home, Ava and Grandma did the math at the kitchen table. For each jar, Ava needed some glue, a little solution, a pinch of baking soda, a drop of color, and the jar itself.

"Each jar costs about one dollar and fifty cents to make," Grandma said. "That is your [[cost|the money you spend to make or buy something]]."

"So if I sell each jar for three dollars," Ava said slowly, "I keep one dollar and fifty cents for every jar."

"Exactly. That is your [[profit|the money you earn after you pay for your costs]]."

Ava did the math. To earn $60 of profit at $1.50 per jar, she would need to sell forty jars! That was a lot of slime. But it was possible.

She bought her supplies with some of her savings, and Mom lent her the rest. Ava promised to pay the loan back. Then she put on her lab goggles, because Grandma said every real scientist protects her eyes.`,
`Making slime is chemistry. Glue is made of long, stringy molecules called [[polymers|long chains of tiny repeating parts, like a necklace of beads]]. When you add a little baking soda and contact solution, those long chains link together, and runny glue becomes stretchy slime.

At least, that's what is *supposed* to happen.

Ava poured the glue, stirred in blue coloring, and added the solution. She stirred and stirred. The mixture stayed runny. She added more solution. Still runny. She added a LOT more solution.

Suddenly the slime turned into a hard, rubbery blob that bounced off the table and landed on the floor. Max grabbed it and threw it at the wall. It bounced again.

"Ball!" Max yelled happily.

Ava stared at the blob. Her first batch was a disaster, and she had used up almost half of her solution. If every batch went like this, she would never earn sixty dollars.

Grandma picked up the blob and turned it over in her hand. "Hmm," she said. "Interesting. What did you change?"`
], [
  check('SA2-c1', 2, 'What question did Grandma ask Ava at the store?', ['Did she need the glitter pen, or just want it?', 'Which color slime was best?', 'Where was Max?', 'How much does glue weigh?']),
  check('SA2-c2', 4, 'What happened to Ava\'s first batch of slime?', ['It turned into a hard, bouncy blob', 'It was perfect slime', 'It melted on the stove', 'Max ate it'])
], [
  mc('SA2-1', 'money', 'What is **profit**?', ['The money you keep after paying your costs', 'All the money you spend', 'A kind of slime', 'Money you borrow'], 'Profit = money earned − costs.'),
  mc('SA2-2', 'money', 'Which one is a **NEED** for Ava\'s slime business?', ['Glue', 'A glitter pen', 'New sneakers', 'Candy'], 'She can\'t make slime without glue.'),
  mc('SA2-3', 'science', 'Why does glue turn into slime?', ['Its long polymer chains link together', 'It freezes', 'It melts', 'The food coloring changes it'], 'The solution links the long polymer chains, making them stretchy.'),
  txt('SA2-4', 'money', 'Ava put the glitter pen back. Was that a good choice? Explain, using the words **need** and **want**.', 'Yes: the pen was a WANT, not a NEED; it doesn\'t help the slime business or Sparky, and she needs her money for supplies/her goal. Score 2 = good choice + uses need/want correctly; 1 = good choice but doesn\'t explain with need/want; 0 = no reasonable explanation.'),
  num('SA2-5', 'money', 'Ava sells 8 jars of slime for $3 each. How many dollars does she collect?', '24', '8 × $3 = $24.'),
  num('SA2-6', 'money', 'Each jar costs $1.50 to make and sells for $3.00. What is the profit on ONE jar? (Write it like 0.75)', ['1.50'], '$3.00 − $1.50 = $1.50.')
]),

chapter('SA3', 'A', 3, 'The Fair Test', [
`The next day, Ava opened Grandma's notebook and found a page titled **THE FAIR TEST.**

*When an experiment goes wrong, don't change everything at once. Change ONE thing, keep everything else the same, and watch what happens. That is how scientists find answers.*

Ava frowned. "I changed a lot of things," she said. "I kept adding more solution without measuring."

"So what is one thing you could test?" Grandma asked.

Ava thought. "How much solution to add. Everything else stays the same: same glue, same baking soda, same stirring time."

Grandma nodded. "The thing you change is called the [[variable|the one thing you change on purpose in an experiment]]. Good scientists measure carefully and write down what happens."

Ava lined up three cups on the table. In each cup she poured exactly half a cup of glue and half a teaspoon of baking soda. Then she labeled the cups: A, B, and C.`,
`Ava measured the contact solution with a tablespoon. Cup A got 1 tablespoon. Cup B got 2 tablespoons. Cup C got 3 tablespoons.

She stirred each cup for exactly one minute, using the timer on the oven. Max watched from his high chair, banging a spoon like a drum.

Cup A was still sticky and gooey. It stuck to her fingers like melted cheese.

Cup C was stiff and rubbery, almost like the bouncy blob from before.

But Cup B... Cup B was perfect. It was smooth and stretchy. When Ava pulled it, it stretched long and thin without breaking, then [[oozed|flowed slowly, like thick honey]] back into a puddle.

"I found it!" Ava shouted. "Two tablespoons is the right amount!"

She wrote the results in her own notebook, just the way Grandma did: *Variable: amount of solution. Best result: 2 tablespoons.*

For the first time, Ava felt like a real scientist.`,
`On Saturday, Ava set up a table at the end of her driveway. She covered it with a purple cloth and drew a sign in bubble letters: **AVA'S AMAZING SLIME — $3 a jar!**

She had made twelve jars in four colors: ocean blue, lemon yellow, mint green, and galaxy purple. Each jar had a label with a tiny drawing of Sparky.

For the first twenty minutes, nobody came. Ava's stomach felt tight. Maybe nobody wanted slime after all.

Then a girl named Harper rode up on her scooter. "Is that slime?" she asked. "Can I touch it?"

Ava let her squeeze the blue one. Harper's eyes went wide. "It's SO stretchy! I'll take two!"

Harper told her friends. Her friends told *their* friends. By lunchtime, kids were lining up on the sidewalk, holding dollar bills and coins.

By three o'clock, Ava had sold eleven jars. Only one galaxy purple jar was left on the table.`,
`Ava counted her money twice. Eleven jars times three dollars was thirty-three dollars! She had never held so much money that she had earned herself.

"First," Grandma reminded her, "pay back your costs."

Ava paid Mom back for the loan. Then she divided what was left into three glass jars that Grandma had labeled: **SAVE, SPEND, SHARE.**

"Most goes into SAVE, for Sparky," Grandma explained. "A little goes into SPEND, for something fun. And a little goes into SHARE, to help someone else."

Ava liked that idea. She dropped the money in, coin by coin.

That evening, while she was folding up the table, Ava noticed something across the street. A boy was setting up a table too. He had a big, shiny sign: **TYLER'S TERRIFIC SLIME — ONLY $2!**

Ava's mouth fell open. Tyler Brooks lived three houses down. And he was selling slime for a dollar less than she was.`
], [
  check('SA3-c1', 2, 'Which cup made the best slime?', ['Cup B, with 2 tablespoons', 'Cup A, with 1 tablespoon', 'Cup C, with 3 tablespoons', 'None of them']),
  check('SA3-c2', 4, 'What were the names of Ava\'s three money jars?', ['Save, Spend, Share', 'Coins, Bills, Checks', 'Red, Blue, Green', 'Sparky, Max, Grandma'])
], [
  mc('SA3-1', 'science', 'In a fair test, how many things should you change at one time?', ['Just one', 'All of them', 'Two', 'None'], 'Change ONE thing (the variable) and keep everything else the same.'),
  mc('SA3-2', 'science', 'In Ava\'s experiment, what was the **variable**?', ['The amount of contact solution', 'The glue', 'The stirring time', 'The cups'], 'She changed only the amount of solution: 1, 2, or 3 tablespoons.'),
  mc('SA3-3', 'inference', 'Why did so many kids come to Ava\'s table after Harper?', ['Harper told her friends how great the slime was', 'Ava called them', 'The slime was free', 'They were lost'], 'Harper told her friends, and they told their friends.'),
  txt('SA3-4', 'money', 'Why do you think Grandma wants Ava to **SHARE** some of her money? Give one idea.', 'Any reasonable idea: helping others, being generous, making the community better, it feels good to help, someone may need it more. Score 2 = clear reason; 1 = vague; 0 = unrelated.'),
  num('SA3-5', 'money', 'Ava sold 11 jars at $3 each. How many dollars did she collect?', '33', '11 × $3 = $33.'),
  num('SA3-6', 'fractions', 'Ava puts **1/2** of $20 in her SAVE jar. How many dollars is that?', '10', 'Half of 20 is 10.')
]),

chapter('SA4', 'A', 4, 'Competition on Maple Street', [
`On Sunday morning, Ava watched Tyler's table from her window. Kids were buying his two-dollar slime. Lots of kids.

"It's not fair," Ava grumbled. "He copied my idea!"

Grandma sat down beside her. "In business, this is called [[competition|when two or more sellers try to win the same customers]]. It happens all the time. Two pizza places on the same street. Two shoe stores in the same mall."

"So what do they do?"

"They try to be better. Better quality, better ideas, or a better price. The customers get to choose."

Ava thought about it. She could lower her price to two dollars, but then her profit would be only fifty cents per jar. She would need to sell one hundred twenty jars to earn sixty dollars! That would take forever.

"I don't want to be cheaper," Ava said. "I want to be *better*."

Grandma smiled and opened the notebook to a drawing of a tall glass full of colorful stripes. The title said: **DENSITY TOWER.**`,
`"Every material has a [[density|how much stuff is packed into a space; heavy for its size or light for its size]]," Grandma explained. "Honey is very dense. Water is less dense. Oil is even less dense. If you pour them into the same glass, they stack in layers, and the densest one sinks to the bottom."

Ava tried it in a tall glass: first honey, then blue water, then vegetable oil. The liquids made three neat stripes, like a rainbow someone had sliced.

"What if I make slime that looks like this?" Ava said. "Layers of colors! I could call it Galaxy Layers!"

She worked all afternoon. She layered dark purple slime on the bottom, then blue, then sparkly silver on top. Each jar looked like a little piece of outer space.

She also wrote a tiny card for every jar: *Science fact: Dense things sink! Ask me how.*

"That," said Grandma, "is called adding value."`,
`The next Saturday, Ava put the Galaxy Layers jars on her table. She charged four dollars for the special jars and kept the regular jars at three.

Across the street, Tyler had a crowd again. But this time, some kids wandered over to look at Ava's shiny, layered jars.

"Whoa," said Harper. "How did you get the colors to stay apart?"

Ava explained density, the same way Grandma had explained it to her. The kids listened as if she were a real teacher. Two of them bought Galaxy Layers on the spot.

By the end of the day, Ava had sold six Galaxy Layers and seven regular jars. She did the math on her notepad: six times four dollars, plus seven times three dollars. Forty-five dollars!

Then she looked across the street. Tyler was sitting alone at his table with his chin in his hands. His sign was soaked from a water balloon, and his slime looked runny and sad.`,
`Ava should have felt happy. She was winning. But looking at Tyler made her stomach feel funny.

She walked across the street, carrying a jar of Galaxy Layers.

"Hey," she said. "What happened to your slime?"

Tyler shrugged. "It keeps turning runny. I don't know why. I just guess how much stuff to put in." He looked at her jar. "Yours is way better."

Ava remembered her own disaster: the bouncy blob. "Do you want to know the secret?" she asked. "It's called a fair test. You measure, and you change only one thing at a time."

Tyler looked [[suspicious|not trusting; thinking something might be a trick]]. "Why would you help me? We're competitors."

Ava wasn't sure how to answer. Before she could say anything, Max came running down the driveway, holding something up in both hands.

It was Grandma's green notebook. And one page was hanging out, torn halfway across: the page with the drawing of Sparky's circuit.`
], [
  check('SA4-c1', 2, 'Why does honey sink below oil?', ['Honey is more dense than oil', 'Honey is colder', 'Oil is heavier', 'Honey is sticky']),
  check('SA4-c2', 4, 'Why was Tyler\'s slime runny?', ['He guessed amounts instead of measuring', 'It rained on it', 'Ava ruined it', 'Max threw it'])
], [
  mc('SA4-1', 'money', 'What is **competition** in business?', ['When sellers try to win the same customers', 'When sellers always work together', 'When things are given away for free', 'When prices never change'], 'Competitors try to be better so customers choose them.'),
  mc('SA4-2', 'money', 'How did Ava compete with Tyler?', ['She made a special, better product', 'She lowered her price to $1', 'She took his sign', 'She stopped selling'], 'Galaxy Layers added value.'),
  mc('SA4-3', 'science', 'Which liquid is the MOST dense?', ['Honey', 'Water', 'Oil', 'Air'], 'Honey sinks to the bottom of the density tower.'),
  txt('SA4-4', 'inference', 'Why do you think Ava decided to help Tyler? Use details from the story.', 'She felt bad seeing him sad/alone; she remembered her own slime disaster; she is kind and fair. Score 2 = reason + story detail; 1 = reason without detail; 0 = unrelated.'),
  num('SA4-5', 'expressions', 'Ava sold 6 jars at $4 and 7 jars at $3. What is **(6 × 4) + (7 × 3)**?', '45', '24 + 21 = 45 dollars.')
]),

chapter('SA5', 'A', 5, 'Circuits and a Surprise', [
`Ava gasped and gently took the notebook from Max. "Oh no, Max! This is Grandma's!"

Max's lip wobbled. "Sorry," he whispered. He was only two; he didn't understand how special it was.

Ava ran inside. Grandma looked at the torn page for a long moment. Then she found a roll of clear tape in the kitchen drawer and fixed it carefully, piece by piece.

"There," she said. "Good as new. Well, almost." She hugged Max, who was still sniffling. "Things can be fixed. People matter more than paper."

Ava looked at the page they had saved. It showed a loop made of lines: a battery, a switch, a light bulb, and wires connecting them all. At the top, Grandma had written: **A circuit is a road for electricity. If the road is broken anywhere, nothing works.**

"Is this how Sparky's light turns on?" Ava asked.

"It is," said Grandma. "Let's build a small one first."`,
`Grandma brought out a shoebox of old supplies: a battery, a tiny light bulb in a holder, and some wires with metal clips on the ends.

"Electricity needs a complete path," Grandma said. "It flows out of the battery, through the wire, through the bulb, and back into the battery. That full loop is called a [[closed circuit|a complete path that lets electricity flow]]."

Ava clipped the wires together. The tiny bulb glowed yellow. "It works!"

"Now unclip one wire."

Ava did. The light went out.

"That's an [[open circuit|a path with a gap or break, so electricity cannot flow]]," Grandma said. "A switch is just a clever way to open and close the path. When you flip a light switch at home, you are opening or closing a circuit."

Ava flipped the kitchen light switch on and off, on and off, as if she were seeing it for the first time. Electricity had been running through roads in the walls her whole life, and she had never noticed.`,
`That night, Ava counted the money in her SAVE jar. Fifty-four dollars. So close!

Grandma came in with a cup of hot chocolate. "I have a surprise," she said. "When you were born, I promised myself that if you ever saved for something important, I would add ten percent. That's my [[interest|extra money you get as a reward for saving]]."

"What's ten percent?" Ava asked.

"Ten out of every hundred. For every ten dollars you save, I add one dollar."

Ava did the math. Ten percent of fifty-four dollars was five dollars and forty cents. "That makes fifty-nine dollars and forty cents!"

She was still sixty cents short. Then Ava remembered her SPEND jar. She had been saving it for a new set of markers. She looked at the jar for a long time. Then she took out sixty cents and moved it to SAVE.

"Sixty dollars," Ava whispered. "Exactly sixty dollars."`,
`On Saturday, Grandma drove Ava to the electronics store. Ava paid for the parts herself, counting the bills onto the counter. The cashier smiled. "Building something?"

"A robot," Ava said proudly. "His name is Sparky."

For the next three evenings, Ava and Grandma worked at the kitchen table. Ava attached the wheels to the motors. She connected the battery pack. She screwed the light onto Sparky's round head. Grandma read the instructions from the notebook, and Ava did the building. Even Max helped by handing her screws, one at a time, very seriously.

Finally, on Tuesday night, Sparky was finished. He was about the size of a lunchbox, with two big round eyes that Ava had painted blue.

"Ready?" Grandma asked.

Ava flipped the switch on Sparky's back.

Nothing happened. No light. No sound. No movement.

She flipped it off and on again. Still nothing. Sparky just sat there, silent, staring at the wall with his painted blue eyes.`
], [
  check('SA5-c1', 2, 'What is an **open circuit**?', ['A path with a break, so electricity can\'t flow', 'A complete loop where the light turns on', 'A new battery', 'A kind of light bulb']),
  check('SA5-c2', 4, 'What happened when Ava first turned Sparky on?', ['Nothing happened', 'He rolled across the floor', 'His light turned red', 'He started talking'])
], [
  mc('SA5-1', 'science', 'A light switch works by…', ['opening and closing a circuit', 'making new electricity', 'cooling the wires', 'changing the battery\'s color'], 'ON closes the path; OFF opens it.'),
  mc('SA5-2', 'money', 'Grandma added **10%** interest. What does 10% mean?', ['10 out of every 100', 'Always 10 dollars', 'Half of the money', '100 out of every 10'], 'Percent means "out of 100."'),
  mc('SA5-3', 'inference', 'Why did Ava move 60 cents from SPEND to SAVE?', ['To reach her $60 goal for Sparky', 'She lost her markers', 'Max asked her to', 'The SPEND jar was too full'], 'She was 60 cents short of $60.'),
  txt('SA5-4', 'inference', 'Grandma said, **"People matter more than paper."** What did she mean? Use the story to explain.', 'Max tore the notebook by accident; Grandma cared more about Max\'s feelings than the torn page; things can be fixed but people\'s feelings matter more. Score 2 = meaning + story connection (Max/torn page); 1 = meaning only; 0 = unrelated.'),
  num('SA5-5', 'money', 'What is **10% of $70**, in dollars?', '7', '10% = 1/10. $70 ÷ 10 = $7.'),
  num('SA5-6', 'money', 'Ava has $54.00. Grandma adds $5.40. How much does Ava have now? (Write it like 12.50)', ['59.40'], '$54.00 + $5.40 = $59.40.')
]),

chapter('SA6', 'A', 6, 'Sparky Wakes Up', [
`Ava's eyes stung with tears. Sixty dollars. Weeks of slime. And Sparky didn't work.

"Maybe I'm not a real scientist," she said quietly.

Grandma put down the notebook. "Ava, do you know how many of my experiments failed?" She started counting on her fingers, then stopped. "I ran out of fingers in my first week. Failing is part of the job. The question is: what do we do next?"

Ava wiped her eyes. She thought about the bouncy blob, the fair test, and Tyler's runny slime.

"We don't change everything at once," she said slowly. "We check one thing at a time."

"Exactly."

Ava picked up Sparky and turned him over. She opened the little door on his back. Inside were the battery pack, the switch, and a tangle of red and black wires. Somewhere in there, the road for electricity was broken. She just had to find where.`,
`Ava made a checklist, just like the pages in Grandma's notebook.

1. Are the batteries in the right way? Plus to plus, minus to minus. Yes.
2. Are the batteries good? She tested them in the TV remote. The TV turned on. Yes.
3. Is the switch working? She clicked it and watched the tiny metal piece move inside. Yes.
4. Are all the wires connected?

Ava leaned closer with a flashlight. She followed the red wire from the battery to the switch. Connected. From the switch to the motor. Connected. From the motor to...

There! One tiny black wire had slipped out of its clip. It was hanging loose, just a few millimeters from where it belonged.

"An open circuit," Ava breathed. "The road is broken right here."

Her hands shook a little as she pushed the wire back into the clip and pressed it closed. Then she set Sparky on the floor, took a deep breath, and flipped the switch.`,
`Sparky's head lit up with a bright blue glow. His motors hummed. His wheels turned, and he rolled across the kitchen floor, bumped gently into Max's foot, turned, and rolled the other way.

Max screamed with joy. "ROBOT! ROBOT!"

Ava jumped up and down. Grandma clapped, and her eyes were wet behind her glasses. "Forty years," she said. "Forty years Sparky waited. And you were the one who woke him up."

The next morning, Ava brought Sparky to the end of the driveway. Kids gathered around to watch him roll in circles. Tyler came over too, holding a jar of slime.

"Look," he said, a little shyly. "I tried the fair test. Two tablespoons, like you said." He stretched the slime. It was smooth and perfect.

Ava grinned. Then she had an idea, the kind that made her feel as if a light had turned on in her own head.

"Tyler," she said. "Do you want to be [[partners|people who work together and share the work and the money]]?"`,
`Ava and Tyler opened a new stand together: **A & T SCIENCE SLIME.** Tyler was great at talking to customers. Ava was great at inventing new kinds of slime. Together, they sold more than either of them had sold alone. They split the profit fifty-fifty: half for each partner.

Ava kept filling her three jars. When her SHARE jar reached twenty dollars, she knew exactly what to do with it. She gave it to the science club at her school, so they could buy goggles and supplies for kids who couldn't afford them.

At the end of the month, Grandma gave Ava a brand-new notebook with a green cover, just like hers. On the first page, Grandma had written: *LAB NOTEBOOK — PROPERTY OF AVA MITCHELL, SCIENTIST.*

Ava held it close. Then she opened it to a clean page and began to draw.

Sparky rolled over and blinked his blue light at her, as if he wanted to know what they were going to build next.

**THE END**`
], [
  check('SA6-c1', 2, 'What was wrong with Sparky?', ['A loose wire made an open circuit', 'The batteries were dead', 'The switch was broken', 'The paint was wet']),
  check('SA6-c2', 4, 'What did Ava do with the money in her SHARE jar?', ['She gave it to her school\'s science club', 'She bought new markers', 'She bought more slime', 'She gave it all to Tyler'])
], [
  mc('SA6-1', 'main_idea', 'What is the theme of the whole story?', ['Mistakes are part of learning; keep trying and solve problems step by step', 'Robots are easy to build', 'Never work with competitors', 'Money is the most important thing'], 'Ava failed many times, but she kept testing one thing at a time.'),
  mc('SA6-2', 'evidence', 'How did Ava find the problem with Sparky?', ['She checked one thing at a time with a checklist', 'She guessed', 'Tyler fixed it', 'She bought a new robot'], 'Her checklist led her to the loose wire.'),
  mc('SA6-3', 'money', 'Ava and Tyler split the profit "fifty-fifty." This means…', ['Each partner gets half', 'Ava gets everything', 'Tyler gets $50', 'They give it all away'], 'Fifty-fifty = 50% each = half.'),
  txt('SA6-4', 'main_idea', 'How did Ava change from Chapter 1 to the end of the story? Give **two** examples.', 'Examples: became a confident scientist (fair tests, circuits); learned money skills (budget, needs vs wants, saving, profit); learned patience/not giving up; learned to help and work with Tyler; shares with others. Score 2 = two clear examples; 1 = one example; 0 = none.'),
  num('SA6-5', 'money', 'Ava and Tyler earn $36 and split it fifty-fifty. How many dollars does each get?', '18', '$36 ÷ 2 = $18.')
]),

/* ===================== STORY B ===================== */
chapter('SB1', 'B', 1, 'The Map in the Lighthouse', [
`The ferry bounced over the waves, and salty spray hit Ava Mitchell right in the face. She didn't mind one bit. Her fifth-grade class was on a three-day field trip to Pelican Island, a tiny island off the coast of North Carolina, and Ava had been counting down the days for weeks.

"Group Three, stay together!" called Mr. Hayes, their science teacher, holding his hat so the wind wouldn't steal it.

Ava's group was the best group, in her opinion. There was Noah Kim, who knew a fact about everything and wore a camera around his neck. And there was Zoe Carter, who could climb anything, and who had brought four bags of gummy bears "for emergencies."

Each group had a small zippered pouch with thirty dollars for the whole trip: snacks, supplies, and anything they needed. "Spend it wisely," Mr. Hayes had said. "When it's gone, it's gone."

Ahead of them, a tall white lighthouse rose above the dunes like a giant candle.`,
`The lighthouse was also the island's tiny museum. Inside, the walls were covered with old photos of ships, fishing nets, and serious-looking people in old-fashioned clothes.

In the center of the room hung a painting of a woman in a captain's coat, standing on the deck of a ship. A sign below it said: *Captain Abigail Finch, 1781–1859. The island's first sea captain. Legend says she hid a treasure of golden coins somewhere on Pelican Island. It has never been found.*

"A treasure!" Zoe whispered. "A real one!"

"[[Legends|old stories that many people tell, which may or may not be true]] aren't facts," said Noah, but he took three photos of the painting anyway.

Ava leaned closer. In the painting, the captain was holding a rolled-up paper. A map.

As Ava stepped back, her elbow bumped the frame. It tilted, and something slid out from behind the painting and floated to the floor like a dry leaf. It was a folded piece of yellowed paper, soft and [[fragile|easily broken or damaged]] with age.`,
`Ava picked it up with two fingers. Her heart pounded. Mr. Hayes was across the room, talking to the museum guide.

Carefully, she unfolded it. It was a hand-drawn map of Pelican Island: the lighthouse, the curve of the beach, the dunes, and the marsh. Out in the water, past the beach, a small X was drawn on a tiny hill in the sea.

At the bottom of the map, in curly old handwriting, were four lines:

*When the moon pulls the sea away, the hidden path will see the day.
Then let the needle show the way, where the grass protects the sand from bay.*

"It's a riddle," Noah said, his eyes huge behind his glasses. "Captain Abigail left a riddle."

"We should tell Mr. Hayes," Ava said.

"We will," said Zoe. "Right after we figure out what it means."

Ava hesitated. Then she shook her head. "No. Now." Some things were too important to keep secret, even for a few minutes.`,
`Mr. Hayes studied the map for a long time through his reading glasses. Then he called over the museum guide, an old man named Mr. Okoro with a white beard.

Mr. Okoro's mouth fell open. "Fifty years I've worked here, and I never knew this was behind the painting!" He looked at the three kids. "You found it. Would you like to help me follow it? With your teacher's permission, of course."

Mr. Hayes smiled. "As long as you stay with me and follow every safety rule. Science and history, all in one. That's the best kind of field trip."

That night in the cabin, Ava couldn't sleep. She kept reading the first line of the riddle by flashlight. *When the moon pulls the sea away...*

How could the moon pull the sea? The moon was so far away, up in the sky.

Then Noah's voice came from the bunk above her, sleepy but certain. "Tides," he said. "Ava. It's talking about the tides."`
], [
  check('SB1-c1', 2, 'What does the legend say Captain Abigail hid?', ['A treasure of golden coins', 'A ship', 'A second lighthouse', 'A painting']),
  check('SB1-c2', 4, 'What did the kids do with the map?', ['They showed it to Mr. Hayes and the museum guide', 'They hid it in a backpack', 'They sold it', 'They threw it in the ocean'])
], [
  mc('SB1-1', 'inference', 'Noah said legends aren\'t facts, but he took photos anyway. What does this show?', ['He was curious about the treasure too', 'He wanted to sell the photos', 'Mr. Hayes told him to', 'He doesn\'t like museums'], 'His actions show he was interested, even though his words sounded doubtful.'),
  mc('SB1-2', 'context', 'The paper was **fragile** with age. Fragile means…', ['Easily damaged', 'Very new', 'Very heavy', 'Bright and colorful'], 'Old paper tears easily.'),
  mc('SB1-3', 'main_idea', 'What did Ava do that showed she was responsible?', ['She showed the map to Mr. Hayes right away', 'She kept the map a secret', 'She ran to the beach alone', 'She took the painting'], 'She decided some things are too important to keep secret.'),
  txt('SB1-4', 'inference', 'What do you think the riddle\'s first line means? Make a prediction.', 'The sea goes out at low tide (pulled by the moon) and uncovers a hidden path. Score 2 = connects to tide/water going away revealing a path; 1 = partial (mentions moon or sea without the idea of a revealed path); 0 = unrelated.'),
  num('SB1-5', 'money', 'Group Three has $30. They spend $7.50 on sunscreen. How much is left? (Write it like 12.50)', ['22.50'], '$30.00 − $7.50 = $22.50.')
]),

chapter('SB2', 'B', 2, 'When the Tide Goes Out', [
`In the morning, Mr. Hayes drew on the cabin's whiteboard: the Earth, a ring of ocean around it, and the moon off to one side.

"The moon is far away," he said, "but it's big, and it pulls on everything on Earth with [[gravity|the invisible force that pulls objects toward each other]]. Land doesn't move much, but water can. So the ocean bulges toward the moon. That bulge is a high tide."

"And when the bulge moves away?" Ava asked.

"Low tide. The water goes out, and the beach gets much wider. Most beaches have two high tides and two low tides every day, about six hours apart."

Ava looked at the riddle. *When the moon pulls the sea away, the hidden path will see the day.*

"At low tide," she said, "something hidden under the water will appear. A path!"

Mr. Okoro held up a little booklet. "This is a [[tide table|a chart that shows what time high tide and low tide will happen]]. Today, low tide is at 1:15 in the afternoon."`,
`They had a whole morning to wait, so Group Three planned their supplies. Zoe dumped the money pouch onto the table: thirty dollars.

"We need rope, a real flashlight, and water bottles," Ava said, writing a list. "Those are needs. If we're exploring, we have to be safe."

"And snacks," said Zoe. "Snacks are a need."

"Snacks are... kind of a need," said Noah. "Candy is a want."

At the island's only store, they compared prices. Rope cost $6. A flashlight cost $9. Water bottles were $1.50 each, and they needed three.

Ava added it up. "Nineteen dollars and fifty cents for the needs. That leaves ten dollars and fifty cents."

Zoe was standing in front of a basket of giant rainbow lollipops. Each one cost $3.

"One lollipop," said Ava. "To share. The rest we save, in case we need something later."

Zoe sighed dramatically, but she agreed. "Sharing a lollipop is very scientific," she said.`,
`At one o'clock, the group stood on the beach with Mr. Hayes and Mr. Okoro. Ava couldn't believe how different it looked. The water had pulled back far, far away. Wet sand stretched out in front of them, shining like glass, with little pools full of crabs and seaweed.

And there, rising out of the water, was a long, narrow line of rocks and sand, curving out toward the small hill in the sea.

"The hidden path!" Zoe shouted.

"A [[sandbar|a long, low strip of sand in the water, often covered at high tide]]," said Mr. Hayes. "It's underwater at high tide. You can only walk on it when the tide is low."

"How long do we have?" Ava asked.

Mr. Okoro checked the tide table. "High tide comes back at about 7:30 tonight, but the water starts rising long before that. We must be back by four o'clock. No exceptions."

They walked out on the sandbar, single file. The ocean whispered on both sides. Ava had never felt so small, or so excited.`,
`The sandbar ended at the little hill in the sea. It was covered with tall grass and twisted bushes. At the very top was a flat gray stone, half-buried in the sand.

Noah brushed the sand away. Carved into the stone was a circle with four letters around it: N, E, S, and W. In the middle was a small arrow, worn smooth by time.

"A compass rose," said Noah. "Like on a map."

Ava read the next line of the riddle out loud. *Then let the needle show the way...*

"A compass needle," she said. "We need a compass!"

Zoe patted her pockets. Noah checked his backpack. Mr. Hayes shook his head. "I didn't bring one. I wasn't expecting a treasure hunt."

Ava looked at the stone, then at the wide sea, then at the slowly rising water at the edge of the sandbar. They had a riddle, a stone, and less than three hours.

And no compass.`
], [
  check('SB2-c1', 2, 'What causes the tides?', ['The moon\'s gravity pulling on the ocean', 'The wind', 'Fish swimming', 'The sun setting']),
  check('SB2-c2', 4, 'What was carved into the stone?', ['A compass rose with N, E, S, and W', 'A map of the island', 'A lollipop', 'A ship'])
], [
  mc('SB2-1', 'science', 'About how many hours apart are high tide and low tide?', ['About 6 hours', 'About 1 hour', 'About 24 hours', 'About 12 minutes'], 'Two highs and two lows each day, about six hours apart.'),
  mc('SB2-2', 'money', 'Which item was a **WANT**?', ['The rainbow lollipop', 'The rope', 'The flashlight', 'The water bottles'], 'They needed the safety items; the lollipop was just nice to have.'),
  mc('SB2-3', 'inference', 'Why did Mr. Okoro say they must be back by four o\'clock?', ['The rising tide would cover the sandbar', 'The store would close', 'It would get dark', 'Lunch was at four'], 'The sandbar is underwater at high tide.'),
  txt('SB2-4', 'money', 'Do you think Group Three spent their money wisely? Explain with details from the story.', 'Yes: they bought needs first (rope, flashlight, water) for safety, shared one lollipop instead of buying more, and saved the rest for later. Score 2 = opinion + at least one detail; 1 = opinion without detail; 0 = unrelated.'),
  num('SB2-5', 'money', 'Rope $6 + flashlight $9 + 3 water bottles at $1.50 each. What is the total? (Write it like 12.50)', ['19.50'], '$6 + $9 + $4.50 = $19.50.'),
  num('SB2-6', 'money', 'They had $10.50 left and bought one $3 lollipop. How much is left now? (Write it like 2.50)', ['7.50'], '$10.50 − $3.00 = $7.50.')
]),

chapter('SB3', 'B', 3, 'North by Needle', [
`"We can make a compass," said Mr. Hayes slowly, as if an idea were growing in his head. "Sailors did it hundreds of years ago. We need three things: a needle, a magnet, and some water."

"Where do we get a magnet on a sandbar?" Zoe asked.

Ava reached into her backpack and pulled out her pencil case. On the zipper hung a tiny magnet shaped like a pineapple. Grandma Rose had given it to her for luck. "Will this work?"

Mr. Hayes grinned. "Perfectly. Now, a needle..."

Noah held up his camera strap. A small sewing needle was stuck through the fabric, holding a loose patch in place. "My mom fixed it in the car," he said. "I forgot it was there."

"And water," said Zoe, pointing at a tide pool by their feet. "Lots of water."

Mr. Hayes took the needle and stroked it with the magnet, fifty times, always in the same direction, from the eye to the point.

"Why are you doing that?" Ava asked.`,
`"Inside the needle are millions of tiny particles," Mr. Hayes explained. "Normally they point in all different directions. When I rub the magnet along the needle, the particles line up. Now the needle is a magnet too, a weak one, but enough."

"And the Earth," said Noah, "is like a giant magnet! It has a [[magnetic field|an invisible area of magnetic force around a magnet or around the Earth]] that stretches from the South Pole to the North Pole."

"Exactly," said Mr. Hayes. "So a magnetized needle that can spin freely will turn until it points north and south."

Zoe found a flat, dry leaf. Mr. Hayes laid the needle on top of it and set the leaf on the still water of the tide pool.

Everyone held their breath.

At first the leaf drifted. Then, slowly, it began to turn, as if an invisible hand were steering it. It wobbled, and stopped.

"That way is north," said Mr. Hayes, pointing where the needle's tip was aiming.

They had made a compass out of a needle, a leaf, and a puddle.`,
`Ava compared their homemade compass with the arrow carved into the stone. The stone's arrow pointed northwest, between north and west.

"So we go northwest," Ava said.

Northwest from the little hill, across a narrow strip of water that was now only ankle-deep, was the main beach of Pelican Island, and the long, grassy dunes behind it.

"Where the grass protects the sand," said Zoe, reading the riddle. "The dunes!"

But to get there, they would need to climb down a steep, slippery rock wall on the side of the hill. Mr. Hayes frowned. "That's not safe without something to hold on to."

"We have rope!" Ava said. "Six dollars well spent."

Mr. Hayes tied the rope around a thick old tree trunk and tested it with all his weight. Then, one by one, they climbed down, holding the rope tight.

Zoe went last, and of course she climbed down faster than anyone.`,
`At the bottom, Noah stopped. "Wait," he said. "We almost forgot something."

He pulled out a bag of gummy bears, one of Zoe's emergency bags. "I traded with Zoe on the ferry: my granola bar for her gummy bears. Now I'm trading these to Mr. Okoro for his walking stick, because I think we'll need it in the dunes."

Mr. Okoro laughed and took the gummy bears. "Deal. People traded like this for thousands of years, long before there was money."

"It's called [[bartering|trading things directly, without using money]]," said Noah, who knew a fact about everything.

They waded across the shallow water toward the main beach. The water was cold, and it came up past their ankles now. It was higher than before.

Ava looked at her watch. It was 2:40.

They climbed onto the beach and faced the tall dunes covered in waving grass. A wooden sign stood in the sand. In big red letters, it said: **STAY OFF THE DUNES.**`
], [
  check('SB3-c1', 2, 'How did Mr. Hayes turn the needle into a magnet?', ['He rubbed it with a magnet in one direction', 'He left it in the sun', 'He painted it', 'He bent it in half']),
  check('SB3-c2', 4, 'What is **bartering**?', ['Trading things without using money', 'Buying things with coins', 'Saving money in a jar', 'Borrowing money'])
], [
  mc('SB3-1', 'science', 'Why does a magnetized needle point north?', ['It lines up with Earth\'s magnetic field', 'The wind pushes it', 'The water pulls it', 'The moon pulls it'], 'Earth acts like a giant magnet.'),
  mc('SB3-2', 'science', 'Northwest is between…', ['North and west', 'North and east', 'South and west', 'South and east'], 'Northwest = halfway between north and west.'),
  mc('SB3-3', 'inference', 'Why did Mr. Hayes test the rope with all his weight first?', ['To make sure it was safe', 'He was tired', 'He wanted to break it', 'To show off'], 'Safety first: if it holds him, it will hold the kids.'),
  txt('SB3-4', 'money', 'Noah traded gummy bears for a walking stick. Explain why **both** people might think the trade was fair.', 'Each person got something they wanted more than what they gave: Noah needed a walking stick for the dunes; Mr. Okoro enjoyed the gummy bears (and may not need the stick right now). Score 2 = explains value for BOTH sides; 1 = only one side; 0 = unrelated.'),
  num('SB3-5', 'fractions', 'The water was **1/4** foot deep. Later it was **3/4** foot deep. How much did it rise? (Write a fraction)', ['1/2', '2/4', '0.5'], '3/4 − 1/4 = 2/4 = 1/2 foot.')
]),

chapter('SB4', 'B', 4, 'Guardians of the Dunes', [
`"We can't walk on the dunes," said Mr. Hayes firmly. "That sign is there for a reason."

"But the treasure!" said Zoe.

Mr. Okoro knelt and touched a tall stalk of grass with a feathery top. "This is sea oats," he said. "Look at its roots."

He brushed away some sand. The roots went down and down, a tangled net much longer than the grass above.

"Those roots hold the sand in place," he said. "When storms and waves hit the island, the dunes protect everything behind them: the houses, the lighthouse, the marsh, and the animals. Without sea oats, the wind and waves would wash the dunes away. That's called [[erosion|when wind or water slowly wears away land]]."

"If people walk on the dunes, they crush the sea oats," Mr. Hayes added. "Then the roots die, and the sand blows away."

Ava read the riddle again. *Where the grass protects the sand from bay.*

"Captain Abigail knew that too," she said. "She wouldn't hide treasure where people had to destroy the dunes to find it."`,
`"Then where?" asked Zoe.

Noah pointed down the beach. "There's a wooden walkway over there. People cross the dunes on it, so they don't step on the plants."

The walkway was old and gray, with steps leading up and over the dunes. At the top, they could see the whole island: the marsh, the lighthouse, and the ocean sparkling in every direction.

Ava turned in a slow circle. "The compass said northwest. But northwest from where?"

It was 3:05. The sun was in the western sky, and their shadows stretched long behind them.

"In the afternoon," said Mr. Hayes, "the sun is in the west, so your shadow points east. If you face the sun, west is in front of you, east is behind you, and north is to your right."

Ava faced the sun, then turned a little to the right. Northwest. And there, at the very edge of the dunes, where the walkway ended, was an old wooden post leaning in the sand.`,
`They hurried down the steps. The post was gray, cracked, and very old. Someone had carved a tiny ship into the wood. Below the ship were three words: *SAVE ONE EACH.*

"Save one each?" Zoe frowned. "Save one *what*?"

Next to the post, the sand was flat and bare, with no sea oats growing on it. Mr. Okoro tapped it with the walking stick. *Thunk.* Something hard was under the sand.

They dug carefully with their hands, making sure not to touch any roots. A few inches down, they found the top of a small wooden chest with iron corners. It had a metal lock with three little number wheels.

"A [[combination lock|a lock that opens with a secret set of numbers instead of a key]]," said Noah. "We need a three-digit number."

On the lid, carved in the same curly writing as the map, was another riddle:

*Save one penny on the first day, and every day the pile must double. On day ten, how many pennies? That number ends the trouble.*`,
`Zoe wanted to guess. "Let's try 123! Or 999!"

"There are a thousand possible combinations," said Noah. "Guessing could take hours."

Ava looked at the water. The tide was creeping back up the beach. Small waves were reaching places that had been dry an hour ago. It was 3:20.

"We don't have hours," she said. "We have forty minutes. Let's do the math."

Before they started, Zoe pulled out the money pouch. "Wait. There's a souvenir shop behind the dunes. I saw a captain's hat for ten dollars. We only have seven fifty, but maybe Mr. Hayes could lend us—"

"Zoe," Ava said gently. "If we spend our time shopping, we can't spend it solving the riddle. And if we spend our money on a hat, we can't use it if we need something important later."

Zoe sighed. "Choosing one thing means giving up the other."

"That's called [[opportunity cost|what you give up when you choose one thing instead of another]]," said Noah. "Okay. Day one: one penny."`
], [
  check('SB4-c1', 2, 'Why couldn\'t they walk on the dunes?', ['It would crush the sea oats and cause erosion', 'There were snakes', 'The sand was too hot', 'It was someone\'s backyard']),
  check('SB4-c2', 4, 'What does **opportunity cost** mean?', ['What you give up when you choose one thing instead of another', 'The price of a hat', 'Money you find on the beach', 'A kind of tax'])
], [
  mc('SB4-1', 'science', 'How do sea oats protect the island?', ['Their long roots hold the sand in place', 'They scare away birds', 'They make it rain', 'They float on the water'], 'Roots stop erosion.'),
  mc('SB4-2', 'science', 'In the afternoon, your shadow points…', ['East', 'West', 'North', 'South'], 'The sun is in the west, so shadows point the opposite way: east.'),
  mc('SB4-3', 'money', 'What would the **opportunity cost** of buying the hat have been?', ['Time and money they needed for the treasure hunt', 'Nothing at all', 'A lollipop', 'The rope'], 'Buying the hat meant giving up time and money for something more important.'),
  txt('SB4-4', 'inference', 'Why do you think Captain Abigail carved **"SAVE ONE EACH"** on the post? Make a prediction.', 'Prediction about saving one coin/penny each day, and that small savings grow over time (connects to the doubling riddle). Score 2 = saving a little each day/growing; 1 = mentions saving only; 0 = unrelated.'),
  num('SB4-5', 'expressions', 'One penny on day 1, and the pile doubles every day: 1, 2, 4, 8… How many pennies on **day 5**?', '16', '1, 2, 4, 8, 16.')
]),

chapter('SB5', 'B', 5, 'The Riddle Lock', [
`Ava wrote the numbers in the sand with a stick.

Day 1: 1 penny.
Day 2: 2 pennies.
Day 3: 4 pennies.
Day 4: 8 pennies.

"It doubles every day," she said. "So we multiply by two each time."

Day 5: 16. Day 6: 32. Day 7: 64.

"This is going fast," said Zoe, surprised. "It started so small!"

Day 8: 128. Day 9: 256.

Ava stopped. Her hand was shaking a little. "Day ten. Two hundred fifty-six times two."

"Five hundred twelve," said Noah and Zoe at the same time.

Ava turned the first wheel to 5, the second to 1, and the third to 2. She pulled the lock.

*Clack.* It opened.

Nobody breathed. Ava lifted the heavy lid.

Inside, wrapped in an old oiled cloth, was a glass jar. And inside the jar were coins. Hundreds of them. But they weren't golden. They were brown and green, small and worn.

"Pennies," whispered Zoe. "Old copper pennies."`,
`Under the jar was a letter, folded into a small square and sealed with wax. Mr. Okoro opened it with trembling hands and read it aloud:

*To whoever finds this,
I was born poor. I had no gold, no ship, no land. But my mother taught me one thing: save one coin each day, no matter how small. Small things grow when you are patient.
I saved for forty years. With my savings, I bought my first ship. With my ship, I built a business. With my business, I built this lighthouse, so no sailor would ever be lost on these rocks again.
These coins are the very first coins I saved, as a girl. They are my real treasure. Not because they are worth much, but because of what they grew into.
Save something every day. Share what you can. Be patient.
— Captain Abigail Finch*

For a long moment, nobody said anything. The wind moved the sea oats behind them.

Then Zoe said, very quietly, "That's better than gold."`,
`Ava counted the coins in the jar. There were exactly 1,023 pennies: one, plus two, plus four, plus eight, and so on, all the way through day ten.

"About ten dollars," said Noah. "Ten dollars that grew into a ship and a lighthouse."

Mr. Hayes looked at his watch, and his face changed. "Everyone. It's 3:50. We need to leave. Now."

Ava looked at the beach. The waves were much closer than before. The strip of water between the beach and the path back to the cabins was deeper and moving faster.

"The tide is coming in," said Ava. "Low tide was at 1:15. The water has been rising ever since."

"This beach floods quickly," said Mr. Okoro. "Hold on to your things."

Ava wrapped the jar in the oiled cloth and held it against her chest. Then, in the distance, a low rumble rolled across the sky. Dark clouds were piling up over the ocean.

A storm was coming.`,
`They hurried along the beach, single file, with Mr. Hayes in front and Mr. Okoro at the back. The wind grew stronger. Sand stung their legs. The first fat raindrops splattered on the walkway.

"Higher ground!" Mr. Hayes shouted. "Back up the walkway, over the dunes!"

They climbed the old wooden steps as waves crashed below them, white and foamy. From the top, Ava looked back. The flat sand where they had found the chest was already underwater.

Behind the dunes, the land was dry and safe. The sea oats bent in the wind, but the dunes held. The roots were gripping the sand, just as Mr. Okoro had said. The grass was protecting them.

They ran along the path toward the lighthouse as the rain poured down. Ava held the jar tightly in both arms, her heart pounding with every step.

Then, through the rain, she saw the lighthouse beam swing around, bright and steady, showing them the way home.`
], [
  check('SB5-c1', 2, 'What was inside the jar?', ['Old copper pennies', 'Gold coins', 'Jewels', 'Another map']),
  check('SB5-c2', 4, 'What protected the group from the waves behind the dunes?', ['The dunes, held together by sea oat roots', 'A stone wall', 'A boat', 'Mr. Hayes\'s umbrella'])
], [
  mc('SB5-1', 'main_idea', 'What is the main message of Captain Abigail\'s letter?', ['Saving a little every day, with patience, can grow into something big', 'Gold is the only real treasure', 'Never trust a map', 'Lighthouses are expensive'], 'She saved one coin a day for 40 years.'),
  mc('SB5-2', 'money', 'Why is **doubling** so powerful?', ['Small amounts grow very fast when they keep doubling', 'It makes money disappear', 'It only works once', 'It makes numbers smaller'], '1 penny became 512 on day 10.'),
  mc('SB5-3', 'inference', 'Why did Zoe say the pennies were "better than gold"?', ['Because of the lesson and the story behind them', 'They were shinier', 'They were worth more money', 'She doesn\'t like gold'], 'The pennies taught them about patience and saving.'),
  txt('SB5-4', 'evidence', 'Captain Abigail built the lighthouse "so no sailor would ever be lost." How did her lighthouse help Ava\'s group at the end of the chapter?', 'During the storm, the lighthouse beam showed them the way home/back to safety, just as it was built to help sailors. Score 2 = beam guided them home in the storm + connection to her purpose; 1 = mentions the light without explaining; 0 = unrelated.'),
  num('SB5-5', 'expressions', 'On day 9 there were 256 pennies. The pile doubles. How many pennies on day 10?', '512', '256 × 2 = 512.')
]),

chapter('SB6', 'B', 6, 'The Real Treasure', [
`They burst into the lighthouse museum, dripping wet and laughing with relief. Mr. Okoro locked the door against the wind, and the room smelled like rain and salt.

Mr. Hayes counted heads. "One, two, three. Everyone's here. Everyone's safe." He sat down on a bench and let out a long breath. "That," he said, "is the most exciting field trip I have ever led. And the last time I go anywhere without a compass."

Ava carefully set the jar on the table. Mr. Okoro put on white cotton gloves and lifted out one penny. He held it up to the light.

"1820," he read. "These coins are more than two hundred years old." His voice shook. "Do you understand what you found? This isn't just a jar of pennies. It's the beginning of this whole island's story."

Outside, thunder rumbled. Inside, the lighthouse beam turned slowly above them, around and around, the way it had every night for almost two hundred years.`,
`The next morning, the storm was gone. The sky was bright blue, and the beach was clean and smooth, as if the ocean had erased every footprint.

The whole class gathered in the museum. A reporter from the island newspaper came to take pictures. Ava, Noah, and Zoe stood next to the jar, a little embarrassed by all the attention.

Mr. Okoro stood up to speak. "These coins will be displayed right here, next to Captain Abigail's painting, so every visitor can learn her lesson. And the island's historical society would like to give Group Three a reward." He handed Ava an envelope. "Ninety dollars. Thirty for each of you."

Zoe squealed. Noah's mouth fell open.

Ava stared at the envelope. It was more money than she had ever held at once. She thought about all the things she could buy.

Then she thought about the jar of pennies, and about a girl who had saved one coin every day.`,
`That night, the three friends sat on the cabin porch, listening to the waves. The envelope sat on the step between them.

"I'm buying the captain's hat," said Zoe right away. Then she paused. "Maybe."

"Captain Abigail divided her money," said Ava. "Save something. Share what you can. My grandma does the same thing. She has three jars: Save, Spend, and Share."

Noah, who loved numbers, opened his notebook. "If each of us splits our thirty dollars into three equal parts, that's ten dollars to save, ten to spend, and ten to share."

"Ten dollars to spend," said Zoe, "is exactly enough for the captain's hat." She grinned.

"And the sharing part?" asked Noah.

Ava looked up at the lighthouse beam sweeping across the dark sky. "The museum needs a new glass case for the coins," she said. "What if we put our share money together? Thirty dollars, from all three of us. For Captain Abigail."

Noah and Zoe looked at each other. Then they both nodded.`,
`On the last morning of the trip, before the ferry left, Group Three gave Mr. Okoro their thirty dollars for the glass case. He was so surprised that he had to sit down.

"Captain Abigail would be proud," he said. "You three understood her letter better than anyone in two hundred years."

On the ferry home, Ava sat by the window and watched Pelican Island grow smaller and smaller. Zoe was wearing her new captain's hat. Noah was scrolling through his photos. Mr. Hayes was asleep with his mouth open.

Ava opened her notebook. On a clean page, she wrote:

*Treasure isn't always gold. Sometimes it's a lesson. Sometimes it's a friend. Sometimes it's one penny, saved every day, that grows into a lighthouse.*

She thought about her own SAVE jar at home. Tonight, she decided, she would start a new habit: one coin every day, no matter how small.

After all, every great treasure starts with just one penny.

**THE END**`
], [
  check('SB6-c1', 2, 'What did the historical society give Group Three?', ['A $90 reward', 'Some gold coins', 'A boat', 'The captain\'s hat']),
  check('SB6-c2', 4, 'What did Group Three do with their share money?', ['Gave it for a glass case for the coins', 'Bought candy', 'Bought a boat', 'Kept it all'])
], [
  mc('SB6-1', 'main_idea', 'What is the theme of the whole story?', ['Real treasure can be a lesson, a friendship, and patient saving', 'Gold is the only treasure that matters', 'Never go on field trips', 'Storms are fun'], 'Ava writes it in her notebook at the end.'),
  mc('SB6-2', 'inference', 'Why did Mr. Okoro say, "Captain Abigail would be proud"?', ['The kids saved and shared, just as she taught', 'They found gold', 'They wore her hat', 'They sold the coins'], 'They followed her advice: save, spend wisely, share.'),
  txt('SB6-3', 'money', 'If **you** got $30, how would you divide it into SAVE, SPEND, and SHARE? Explain your choices.', 'Any split that adds up to $30 with a reason for each part. Score 2 = amounts add to $30 + reasons; 1 = amounts OR reasons missing/incorrect total; 0 = no plan.'),
  num('SB6-4', 'money', 'Zoe splits $30 into 3 equal parts: Save, Spend, Share. How many dollars go in each part?', '10', '$30 ÷ 3 = $10.'),
  num('SB6-5', 'expressions', 'Each of the 3 friends got $30. How many dollars was the whole reward?', '90', '3 × $30 = $90.')
])
];

/* Extra practice for the new Money skill */
window.POOL.money = [
  num('P-money-1', 'money', 'Lily has $20.00. She buys a book for $7.50. How much is left? (Write it like 2.50)', ['12.50'], '$20.00 − $7.50 = $12.50.'),
  num('P-money-2', 'money', 'A toy costs $4. How many dollars do 6 toys cost?', '24', '6 × $4 = $24.'),
  num('P-money-3', 'money', 'What is **10% of $50**, in dollars?', '5', '$50 ÷ 10 = $5.'),
  mc('P-money-4', 'money', 'Which one is a **NEED**?', ['Drinking water', 'A video game', 'Candy', 'A new toy'], 'Needs are things you must have.'),
  mc('P-money-5', 'money', 'A lemonade stand spends $5 on supplies and earns $12. What is the **profit**?', ['$7', '$17', '$12', '$5'], 'Profit = $12 − $5 = $7.'),
  num('P-money-6', 'money', 'You save $3 every week. How many weeks until you have $27?', '9', '$27 ÷ $3 = 9 weeks.'),
  mc('P-money-7', 'money', '**Opportunity cost** is…', ['What you give up when you choose something else', 'The price on a tag', 'Money you earn', 'A coupon'], 'Every choice means giving something up.'),
  num('P-money-8', 'money', 'Max saves 1 penny on day 1 and doubles it every day. How many pennies on day 6?', '32', '1, 2, 4, 8, 16, 32.')
];

/* ---------- Quest plan: Mon story · Tue lesson · Wed story · Thu lesson · Fri story ---------- */
(function () {
  const FIRST = ['L22', 'L19', 'L21', 'L20', 'L01', 'L02', 'L16', 'L17', 'L18']; // newest school topics come early
  const sk = FIRST.map(id => window.LESSONS.find(l => l.id === id)).filter(Boolean)
    .concat(window.LESSONS.filter(l => !FIRST.includes(l.id)));
  const ch = window.CHAPTERS.slice(), plan = [];
  const pattern = ['S', 'L', 'S', 'L', 'S'];
  while (ch.length) pattern.forEach(p => { const x = p === 'S' ? ch.shift() : sk.shift(); if (x) plan.push(x); });
  plan.push(...sk);
  plan.forEach((x, i) => { x.week = Math.floor(i / 5) + 1; x.day = (i % 5) + 1; x.kind = x.kind || 'lesson'; });
  window.PLAN = plan;
})();
