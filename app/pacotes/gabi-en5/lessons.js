/* =========================================================
   Gabi's Learning Quest — LESSON BANK
   - LESSONS: the daily quests, in order (3 weeks x 5 days)
   - POOL: extra practice questions per skill (used for review)
   To add lessons later, add new objects at the end of LESSONS.
   ========================================================= */

// Helpers: the correct answer is ALWAYS written first in mc(); the app shuffles options.
function mc(id, skill, prompt, options, explain, extra) {
  return Object.assign({ id, skill, type: 'mc', prompt, options, answer: 0, explain }, extra || {});
}
function num(id, skill, prompt, answers, explain, extra) {
  return Object.assign({ id, skill, type: 'num', prompt, answers: [].concat(answers), explain }, extra || {});
}
function txt(id, skill, prompt, rubric, extra) {
  return Object.assign({ id, skill, type: 'text', prompt, rubric }, extra || {});
}
// Tap-and-place questions. sortQ: put each card in the right box. orderQ: items are given in the CORRECT order (the app shuffles).
function sortQ(id, skill, prompt, buckets, items, explain, extra) {
  return Object.assign({ id, skill, type: 'sort', prompt, buckets, items: items.map(([t, b]) => ({ t, b })), explain }, extra || {});
}
function orderQ(id, skill, prompt, items, explain, extra) {
  return Object.assign({ id, skill, type: 'order', prompt, items, explain }, extra || {});
}
function box(l, w, h, unit, cubes, labels) {
  return { kind: 'box', l, w, h, unit: unit || 'units', cubes: !!cubes, labels: labels !== false };
}
function two(a, b, unit) {
  return { kind: 'two', a, b, unit: unit || 'units' };
}

window.SKILLS = {
  vocab:      { name: 'Word Roots',          icon: '🔤', area: 'reading' },
  context:    { name: 'Context Clues',       icon: '🔎', area: 'reading' },
  figurative: { name: 'Figurative Language', icon: '🎨', area: 'reading' },
  main_idea:  { name: 'Main Idea & Theme',   icon: '💡', area: 'reading' },
  evidence:   { name: 'Text Evidence',       icon: '📌', area: 'reading' },
  inference:  { name: 'Inference',           icon: '🕵️', area: 'reading' },
  science:    { name: 'Science',             icon: '🌿', area: 'science' },
  volume:     { name: 'Volume',              icon: '📦', area: 'math' },
  expressions:{ name: 'Expressions',         icon: '🧮', area: 'math' },
  fractions:  { name: 'Fractions',           icon: '🍕', area: 'math' }
};

window.LESSONS = [
/* ======================= WEEK 1 ======================= */
{
  id: 'L01', week: 1, day: 1, icon: '🧭', title: 'Word Quest: CIRCUMNAVIGATE',
  passage: {
    title: 'Captain Rosa and the Long Way Around',
    wordParts: [
      ['circum-', 'a prefix meaning "around"'],
      ['navigare', 'a Latin root meaning "to sail"'],
      ['-ate', 'a suffix that makes a verb, "to do"']
    ],
    text: `Captain Rosa Delgado had sailed her little boat, the *Pelican*, for twenty years, but she had never done the one thing she dreamed about: sailing all the way around Coral Island without stopping.

"Impossible," grumbled the old fisherman on the dock. "The [[currents|strong, steady movements of water in one direction]] on the north side will push you onto the rocks."

Rosa only smiled. She studied maps every night, marking each [[reef|a ridge of rock or coral just under the surface of the sea]] with a red pencil. She packed oranges, crackers, and a [[compass|a tool with a needle that always points north]].

At sunrise, the *Pelican* left the harbor heading east. By noon Rosa had passed the lighthouse. In the afternoon the north currents grabbed the boat, just as the fisherman had warned, but Rosa turned the sail and slipped through a narrow gap between two reefs. When the sky turned orange, she saw the harbor again, but this time it was on her left side. She had gone all the way around!

The whole town cheered. Even the old fisherman took off his hat. "Well," he said, "the circle is complete."

So whenever someone sails, flies, or travels all the way around something, think of Captain Rosa going in a circle, *circum*, around Coral Island, and you will remember the word **CIRCUMNAVIGATE**.`
  },
  questions: [
    mc('L01-1', 'vocab', 'What does **circumnavigate** mean?',
      ['To sail or travel all the way around something', 'To sail very fast', 'To get lost at sea', 'To draw a map'],
      'Circum- means around and navigare means to sail, so circumnavigate means to sail all the way around.'),
    mc('L01-2', 'vocab', 'The prefix **circum-** means "around." Which word also uses circum-?',
      ['circumference', 'curious', 'cereal', 'calendar'],
      'Circumference is the distance around a circle.'),
    mc('L01-3', 'context', 'The fisherman **grumbled**. Which meaning fits best?',
      ['Complained in a low, unhappy voice', 'Laughed loudly', 'Whispered a secret', 'Sang happily'],
      'He thought Rosa would fail, so he was complaining.'),
    mc('L01-4', 'inference', 'Why did the old fisherman take off his hat at the end?',
      ['To show respect, because Rosa proved him wrong', 'His head was too hot', 'He was going to sleep', 'He wanted to wave at a boat'],
      'Taking off a hat is a sign of respect. He said it was impossible, but she did it.'),
    txt('L01-5', 'vocab', 'In your own words, explain what **circumnavigate** means. Then give one example of something a person could circumnavigate.',
      'Meaning: to travel/sail/fly all the way around something. Example: an island, a lake, the Earth, a track, a park. Score 2 = correct meaning + reasonable example; 1 = only one of the two; 0 = neither.'),
    mc('L01-6', 'expressions', 'What is the value of **18 − 3 × 4**?',
      ['6', '60', '3', '30'],
      'Multiply first: 3 × 4 = 12. Then 18 − 12 = 6.'),
    num('L01-7', 'expressions', 'What is the value of **(15 − 5) × 3 + 2**?', '32',
      'Parentheses first: 15 − 5 = 10. Then 10 × 3 = 30. Then 30 + 2 = 32.'),
    num('L01-8', 'volume', 'Captain Rosa packs crackers in this box made of unit cubes. What is its volume in cubic units?', '30',
      'Volume = length × width × height = 5 × 3 × 2 = 30 cubic units.', { figure: box(5, 3, 2, 'units', true) })
  ]
},
{
  id: 'L02', week: 1, day: 2, icon: '📦', title: 'Volume Workshop',
  questions: [
    num('L02-1', 'volume', 'How many unit cubes make this prism? (Count or multiply!)', '24',
      '4 cubes long × 3 cubes wide × 2 cubes tall = 24 cubes.', { figure: box(4, 3, 2, 'units', true, false) }),
    mc('L02-2', 'volume', 'Which equation shows the volume of a box that is 6 in long, 2 in wide, and 5 in tall?',
      ['6 × 2 × 5 = 60', '6 + 2 + 5 = 13', '6 × 2 = 12', '6 × 5 = 30'],
      'Volume = length × width × height. We multiply all three.'),
    num('L02-3', 'volume', 'A cube has sides of **7 cm**. What is its volume in cubic centimeters?', '343',
      '7 × 7 × 7 = 49 × 7 = 343 cubic centimeters.'),
    num('L02-4', 'volume', 'A fish tank has a base of 8 ft by 2 ft. Its volume is 48 cubic feet. How tall is the tank, in feet?', '3',
      'Base area = 8 × 2 = 16. Then 48 ÷ 16 = 3 feet.'),
    mc('L02-5', 'volume', 'Prism A is 4 × 3 × 5. Prism B is 6 × 2 × 5. Which is true?',
      ['They have the same volume', 'Prism A is bigger', 'Prism B is bigger', 'You can\'t tell'],
      'A: 4 × 3 × 5 = 60. B: 6 × 2 × 5 = 60. Same volume!', { figure: two(box(4, 3, 5), box(6, 2, 5)) }),
    num('L02-6', 'volume', 'The bottom layer of a box has 12 cubes. The box has 5 layers. How many cubes fill the box?', '60',
      '12 cubes per layer × 5 layers = 60 cubes.'),
    num('L02-7', 'volume', 'Figure A and Figure B are joined together. What is the total volume in cubic inches?', '72',
      'A: 3 × 2 × 4 = 24. B: 8 × 2 × 3 = 48. Total: 24 + 48 = 72 cubic inches.',
      { figure: two(box(3, 2, 4, 'in'), box(8, 2, 3, 'in'), 'in') }),
    txt('L02-8', 'volume', 'Maya says a box that is 2 × 3 × 4 has the same volume as a box that is 4 × 3 × 2. Is she right? Explain why.',
      'Yes, she is right. Both are 24 cubic units; changing the order of multiplication does not change the product. Score 2 = says yes + explains (both 24 or order doesn\'t matter); 1 = says yes without reason, or correct math but unclear; 0 = says no.')
  ]
},
{
  id: 'L03', week: 1, day: 3, icon: '🐝', title: 'Reading: Inside a Beehive', long: true,
  passage: {
    title: 'The Busy World Inside a Beehive',
    text: `Have you ever watched a honeybee land on a flower? That tiny insect is part of one of the most organized communities in nature. A single [[hive|the home where a group of bees lives]] can hold between 20,000 and 60,000 bees, and every one of them has a job.

**The Queen**

At the center of the hive is the queen. She is the only bee that lays eggs, up to 2,000 in a single day during summer! Because she is so important, worker bees feed her, clean her, and protect her. Without a queen, the [[colony|a large group of animals of the same kind that live together]] cannot survive for long.

**The Workers**

Most of the bees in a hive are workers, and they are all female. A worker's job changes as she grows older. Young workers stay inside, cleaning cells and feeding baby bees, called [[larvae|the young, worm-like stage of an insect after it hatches from an egg]]. Older workers build wax, guard the entrance, and finally fly out to collect [[nectar|a sweet liquid made by flowers]] and pollen. A forager may visit hundreds of flowers on one trip.

**The Drones**

Male bees are called drones. Drones do not collect food or guard the hive. Their only job is to mate with a queen from another colony. When winter comes and food is [[scarce|hard to find; not enough]], the workers push the drones out of the hive.

**Talking Without Words**

How does a forager tell her sisters where the best flowers are? She dances! Back in the hive, she performs a "waggle dance," wiggling her body while she walks in a figure-eight pattern. The direction of the dance points toward the flowers, and the length of the waggle shows how far away they are. Scientists were amazed when they first [[decoded|figured out the meaning of a secret message or code]] this dance.

**Why Bees Matter**

As bees move from flower to flower, pollen sticks to their fuzzy bodies and rubs off on the next flower. This is called [[pollination|moving pollen from one flower to another so the plant can make seeds and fruit]]. About one out of every three bites of food people eat, like apples, almonds, and blueberries, depends on pollinators like bees. In a food chain, bees are primary consumers: they get their energy from plants, and then birds, spiders, and other animals eat them.

Sadly, bee populations have been shrinking because of disease, loss of wildflowers, and chemicals that kill insects. You can help by planting flowers, leaving some clover in the grass, and never swatting a bee that is just doing its job. A world without bees would be a much hungrier place.`
  },
  questions: [
    mc('L03-1', 'main_idea', 'What is the main idea of the passage?',
      ['A beehive is an organized community where every bee has a job, and bees are important to people', 'Bees are dangerous insects that people should avoid', 'Drones are the most important bees in a hive', 'Honey is the healthiest food in the world'],
      'The passage explains each bee\'s job and why bees matter.'),
    mc('L03-2', 'evidence', 'Which sentence best supports the idea that bees are important to people?',
      ['"About one out of every three bites of food people eat… depends on pollinators like bees."', '"Male bees are called drones."', '"She dances!"', '"A forager may visit hundreds of flowers on one trip."'],
      'This sentence shows that much of our food depends on bees.'),
    mc('L03-3', 'science', 'In a food chain, what role do bees play?',
      ['Primary consumer', 'Producer', 'Tertiary consumer', 'Decomposer'],
      'Bees get their energy from plants (nectar and pollen), so they are primary consumers.'),
    txt('L03-4', 'inference', 'Why do you think the worker bees push the drones out of the hive in winter? Use details from the text.',
      'Food is scarce in winter, and drones do not collect food or guard the hive, so the workers save food for the queen and workers. Score 2 = mentions scarce/limited food AND that drones don\'t help/work; 1 = only one of these; 0 = neither.'),
    mc('L03-5', 'fractions', 'A beekeeper shares 3 jars of honey equally among 4 friends. How much honey does each friend get?',
      ['3/4 of a jar', '4/3 of a jar', '1/3 of a jar', '1/4 of a jar'],
      '3 ÷ 4 = 3/4. The number being shared goes on top.')
  ]
},
{
  id: 'L04', week: 1, day: 4, icon: '🔢', title: 'Order of Operations Challenge',
  questions: [
    num('L04-1', 'expressions', 'What is the value of **30 ÷ (2 + 4)**?', '5',
      'Parentheses first: 2 + 4 = 6. Then 30 ÷ 6 = 5.'),
    num('L04-2', 'expressions', 'What is the value of **7 + 3 × (10 − 6)**?', '19',
      'Parentheses: 10 − 6 = 4. Multiply: 3 × 4 = 12. Add: 7 + 12 = 19.'),
    mc('L04-3', 'expressions', 'Which expression means **"5 more than the product of 4 and 6"**?',
      ['(4 × 6) + 5', '4 × (6 + 5)', '(4 + 6) × 5', '5 − (4 × 6)'],
      '"Product of 4 and 6" is 4 × 6. "5 more than" means add 5.'),
    mc('L04-4', 'expressions', 'Which expression means **"3 times the difference of 20 and 8"**?',
      ['3 × (20 − 8)', '3 × 20 − 8', '(20 + 8) × 3', '20 − (8 × 3)'],
      '"Difference of 20 and 8" is (20 − 8). We need parentheses so we subtract first.'),
    num('L04-5', 'expressions', 'What is the value of **2 × [3 + (8 − 2)]**?', '18',
      'Inside out: 8 − 2 = 6. Then 3 + 6 = 9. Then 2 × 9 = 18.'),
    mc('L04-6', 'expressions', 'Without calculating: how does **4 × (25 + 9)** compare to **(25 + 9)**?',
      ['It is 4 times as large', 'It is 4 more', 'It is the same', 'It is 4 times smaller'],
      'Multiplying by 4 makes something 4 times as large.'),
    num('L04-7', 'expressions', 'Sam reads 15 pages each day for 4 days. Then he reads 12 pages on Saturday. How many pages did he read in all?', '72',
      '(15 × 4) + 12 = 60 + 12 = 72 pages.'),
    txt('L04-8', 'expressions', 'Lia says **20 − 4 × 3 = 48**. Explain her mistake and find the correct answer.',
      'She subtracted first (20 − 4 = 16, then × 3 = 48). You must multiply first: 4 × 3 = 12, then 20 − 12 = 8. Correct answer: 8. Score 2 = explains multiply-first AND gets 8; 1 = only one; 0 = neither.')
  ]
},
{
  id: 'L05', week: 1, day: 5, icon: '🍂', title: 'Figurative Friday + Fractions',
  passage: {
    title: 'Autumn Wakes Up',
    text: `The wind woke up grumpy on the first day of October. It [[rattled|shook and made quick knocking sounds]] the windows and whistled through the cracks like a teakettle that would not stop. Outside, the old oak tree shook its arms and dropped its leaves, one by one, onto the sidewalk.

Nadia's backyard was a carpet of red and gold. "Time to rake," said Dad. Nadia [[groaned|made a long, low sound to show she was unhappy]]. Raking leaves was not exactly her cup of tea.

But once she started, the leaf pile grew as tall as a mountain. Her little brother Theo ran full speed and jumped right into the middle. Leaves exploded into the air like fireworks. Nadia laughed so hard her stomach hurt.

"Okay," she [[admitted|agreed that something is true, even if you didn't want to]], "maybe raking is a piece of cake when you have a helper."

By sunset, the sky was a giant orange painting, and the wind had finally gone to sleep.`
  },
  questions: [
    mc('L05-1', 'figurative', '"The wind woke up grumpy" is an example of…',
      ['Personification', 'Simile', 'Metaphor', 'Idiom'],
      'The wind can\'t really wake up or feel grumpy. Giving human actions to things is personification.'),
    mc('L05-2', 'figurative', '"Leaves exploded into the air like fireworks" is an example of…',
      ['Simile', 'Metaphor', 'Personification', 'Idiom'],
      'It compares two things using "like," so it is a simile.'),
    mc('L05-3', 'figurative', '"Nadia\'s backyard was a carpet of red and gold" is an example of…',
      ['Metaphor', 'Simile', 'Idiom', 'Personification'],
      'It says the yard WAS a carpet, without "like" or "as." That is a metaphor.'),
    mc('L05-4', 'figurative', 'What does the idiom **"not exactly her cup of tea"** mean?',
      ['Something she doesn\'t enjoy', 'Something she drinks every day', 'Something very hot', 'Something she is good at'],
      '"Not my cup of tea" means "not something I like."'),
    txt('L05-5', 'figurative', 'Write your own **simile** to describe the leaf pile. Remember: a simile uses "like" or "as."',
      'Must compare the leaf pile to something else using "like" or "as," and make sense (e.g., "The leaf pile was as soft as a pillow"). Score 2 = correct simile about the leaf pile; 1 = simile but not about the pile, or comparison without like/as; 0 = not a simile.'),
    mc('L05-6', 'fractions', '3 friends share **1/6** of a pizza equally. What fraction of the whole pizza does each friend get?',
      ['1/18', '1/2', '3/6', '1/9'],
      '1/6 ÷ 3 = 1/18. Splitting a small piece into 3 makes even smaller pieces.'),
    num('L05-7', 'fractions', '5 sandwiches are shared equally by 2 people. How many sandwiches does each person get? (Write a mixed number like 1 3/4.)', ['2 1/2', '5/2', '2.5'],
      '5 ÷ 2 = 2 with 1 left over. The leftover is split in half: 2 1/2.'),
    num('L05-8', 'fractions', 'What is **1/4 ÷ 2**?', ['1/8', '0.125'],
      'Half of one fourth is one eighth: 1/4 ÷ 2 = 1/8.')
  ]
},
/* ======================= WEEK 2 ======================= */
{
  id: 'L06', week: 2, day: 1, icon: '👑', title: 'Word Quest: MAGNANIMOUS',
  passage: {
    title: 'The Prince and the Baker\'s Daughter',
    wordParts: [
      ['magn-', 'from the Latin "magnus," meaning "great" or "large"'],
      ['anim', 'from the Latin "animus," meaning "mind" or "spirit"'],
      ['-ous', 'a suffix meaning "full of"']
    ],
    text: `Prince Felix of Montaria was the best chess player in the whole kingdom, or so he believed. Every year he won the Royal Chess Tournament, and every year he [[strutted|walked in a proud, showy way]] around the palace like a peacock.

One spring, a baker's daughter named Lena entered the tournament. The nobles laughed. "A baker's girl? She should be making bread, not playing chess!"

But Lena won her first game, then her second, then her third. At last, only Lena and Prince Felix were left. The game lasted three hours. The room was so quiet you could hear a pin drop. Finally, Lena moved her knight and said softly, "Checkmate."

Everyone held their breath. Would the prince be [[furious|extremely angry]]? Would he throw the chessboard?

Prince Felix stood up slowly. Then he smiled, shook Lena's hand, and announced, "This young woman is the finest player I have ever faced. From today, she will teach chess at the palace, and I will be her first student."

The nobles were [[astonished|extremely surprised]]. The prince had lost, yet he was generous and kind instead of jealous.

His grandmother, the old queen, nodded proudly. "My grandson has a great spirit," she said. "*Magnus* means great, and *animus* means spirit. Today he was truly **MAGNANIMOUS**."

So whenever someone is generous and forgiving, especially toward a rival or someone who beat them, think of Prince Felix's great spirit, and you will remember the word **MAGNANIMOUS**.`
  },
  questions: [
    mc('L06-1', 'vocab', 'What does **magnanimous** mean?',
      ['Generous and kind, especially to a rival', 'Very good at chess', 'Angry after losing', 'Proud and showy'],
      'Magn (great) + anim (spirit): having a great, generous spirit.'),
    mc('L06-2', 'vocab', 'The root **magn-** means "great" or "large." Which word uses this root?',
      ['magnify', 'mango', 'manage', 'march'],
      'To magnify something is to make it look larger, like with a magnifying glass.'),
    mc('L06-3', 'context', 'The nobles were **astonished**. Which word could replace astonished?',
      ['Amazed', 'Bored', 'Sleepy', 'Hungry'],
      'They didn\'t expect the prince to be kind after losing, so they were amazed.'),
    mc('L06-4', 'figurative', '"The room was so quiet you could hear a pin drop." What does this mean?',
      ['It was extremely quiet (an idiom)', 'Someone dropped a pin', 'It was very loud', 'The room was empty'],
      'This idiom means it was so quiet that even a tiny sound could be heard.'),
    mc('L06-5', 'main_idea', 'What is a theme of this story?',
      ['Losing with grace and kindness shows a great spirit', 'Chess is the hardest game', 'Princes always win', 'Bakers should stay in the kitchen'],
      'The prince lost but was kind and generous. That is the lesson.'),
    txt('L06-6', 'vocab', 'Describe a real situation at school where someone could be **magnanimous**.',
      'Any situation where someone is generous or forgiving, especially toward a rival or after losing: congratulating the winner, sharing with someone who was mean, forgiving a classmate, helping the team that beat you. Score 2 = clear generous/forgiving example; 1 = kind act but not really generous/forgiving or vague; 0 = unrelated.'),
    num('L06-7', 'expressions', 'What is the value of **(9 × 5) − 3**?', '42',
      '9 × 5 = 45. Then 45 − 3 = 42.'),
    mc('L06-8', 'volume', 'A box is 3 m long, 3 m wide, and 3 m tall. What is its volume?',
      ['27 cubic meters', '9 cubic meters', '18 cubic meters', '12 cubic meters'],
      '3 × 3 × 3 = 27 cubic meters.')
  ]
},
{
  id: 'L07', week: 2, day: 2, icon: '🍕', title: 'Fraction Fair',
  questions: [
    mc('L07-1', 'fractions', '4 friends share 3 brownies equally. How much does each friend get?',
      ['3/4 of a brownie', '4/3 of a brownie', '1/3 of a brownie', '1 1/3 brownies'],
      '3 ÷ 4 = 3/4.'),
    num('L07-2', 'fractions', 'What is **9 ÷ 4**? Write it as a mixed number.', ['2 1/4', '9/4', '2.25'],
      '4 goes into 9 two times with 1 left over. 1 left over out of 4 = 1/4. So 2 1/4.'),
    num('L07-3', 'fractions', 'What is **1/3 ÷ 4**?', '1/12',
      'Splitting one third into 4 equal parts gives twelfths: 1/12.'),
    num('L07-4', 'fractions', 'What is **6 ÷ 1/2**? (How many halves are in 6?)', '12',
      'Each whole has 2 halves. 6 wholes × 2 = 12 halves.'),
    mc('L07-5', 'fractions', 'Which story matches **1/2 ÷ 3**?',
      ['Half of a pie is shared equally by 3 people', '3 pies are shared by 2 people', 'Half a pie plus 3 more pies', '3 halves of a pie'],
      '1/2 ÷ 3 means splitting one half into 3 equal parts.'),
    num('L07-6', 'fractions', 'A ribbon is 5 feet long. Mia cuts it into 3 equal pieces. How long is each piece, in feet? (mixed number)', ['1 2/3', '5/3'],
      '5 ÷ 3 = 1 with 2 left over, so 1 2/3 feet.'),
    num('L07-7', 'fractions', 'How many **1/4-cup** servings are in **3 cups** of juice?', '12',
      'Each cup has 4 quarter-cups. 3 × 4 = 12 servings.'),
    txt('L07-8', 'fractions', 'Explain why **2 ÷ 1/3** gives an answer that is BIGGER than 2. Use an example or describe a picture.',
      '2 ÷ 1/3 asks "how many thirds fit in 2?" Each whole has 3 thirds, so 2 wholes have 6 thirds. 6 > 2. Score 2 = explains how-many-thirds idea and/or gets 6; 1 = partially correct reasoning; 0 = incorrect.')
  ]
},
{
  id: 'L08', week: 2, day: 3, icon: '🌲', title: 'Reading: The Night Hike', long: true,
  passage: {
    title: 'The Night Hike',
    text: `Maya had never been in the woods after dark. Her scout troop's night hike was supposed to be an adventure, but as the last bit of sunlight slipped behind the hills, her stomach twisted into a knot.

"Stay close and keep your flashlights pointed at the trail," said Ms. Okafor, their leader. "And remember: if you ever get separated, stop, stay where you are, and blow your whistle three times."

The trail [[wound|twisted and turned]] between tall pines. Owls hooted somewhere above, and dry leaves crunched under twelve pairs of sneakers. Maya kept her eyes glued to the circle of light in front of her feet.

Then she saw it: a firefly, blinking green near a fallen log. Then another. Then dozens! They floated like tiny lanterns. Maya stepped off the trail to get a closer look. *Just a few steps*, she told herself.

When she turned around, the troop was gone.

The voices had [[faded|slowly become quieter until they disappeared]]. Every direction looked the same: black trunks, black shadows. Maya's heart pounded like a drum. She wanted to run and find the path, but Ms. Okafor's words [[echoed|repeated, like a sound bouncing back]] in her head. *Stop. Stay where you are.*

She took a deep breath and sat on the log. She pulled out her whistle with shaking fingers and blew three long blasts.

Silence. Only the crickets answered.

Maya counted to one hundred, the way her mom taught her when she felt nervous. Then she blew again.

This time, far away, a whistle answered. Three short blasts! Soon she saw flashlight beams bouncing through the trees, and Ms. Okafor's voice called, "Maya! Keep blowing!"

Maya blew until her cheeks hurt. A minute later the troop surrounded her. Her friend Jordan threw his arms around her. "We thought a bear ate you!" he said, and everyone laughed, even Maya, though her knees were still [[wobbly|shaky and unsteady]].

Ms. Okafor knelt beside her. "You did exactly the right thing," she said. "If you had run, you might have gone even deeper into the forest. Staying put made you easy to find."

On the walk back, Maya stayed so close to the group that she bumped into Jordan's backpack twice. But she also noticed things she had been too scared to see before: the silver moon peeking through the branches, the cool smell of pine, the fireflies still glowing along the trail.

That night, curled in her sleeping bag, Maya wrote in her journal: *Being brave doesn't mean you aren't scared. It means you remember what to do even when you are.*`
  },
  questions: [
    mc('L08-1', 'main_idea', 'Which sentence best states the theme of the story?',
      ['Being brave means remembering what to do, even when you are scared', 'Fireflies are the most beautiful insects', 'Night hikes are too dangerous for kids', 'You should always walk in front of the group'],
      'Maya writes the theme in her journal at the end.'),
    mc('L08-2', 'evidence', 'Which detail best supports that theme?',
      ['"She took a deep breath and sat on the log."', '"Owls hooted somewhere above."', '"Her friend Jordan threw his arms around her."', '"The trail wound between tall pines."'],
      'Even though she was scared, she remembered the rule: stop and stay where you are.'),
    mc('L08-3', 'figurative', '"Maya\'s heart pounded like a drum." What does this simile tell the reader?',
      ['Maya was very scared and her heart was beating hard', 'Maya was playing music', 'Maya was tired', 'Maya was happy'],
      'A heart pounding like a drum means it is beating hard, often from fear.'),
    txt('L08-4', 'inference', 'How does Maya change from the beginning of the story to the end? Use one detail from the beginning and one detail from the end.',
      'Beginning: nervous/scared (stomach twisted into a knot, eyes glued to the trail). End: calmer and braver; notices the moon, the pine smell, the fireflies; writes about bravery. Score 2 = describes the change with a detail from both parts; 1 = describes change with only one detail or vague; 0 = no change described.'),
    num('L08-5', 'volume', 'The troop\'s supply box is 4 ft long, 2 ft wide, and 3 ft tall. What is its volume in cubic feet?', '24',
      '4 × 2 × 3 = 24 cubic feet.', { figure: box(4, 2, 3, 'ft') })
  ]
},
{
  id: 'L09', week: 2, day: 4, icon: '🏗️', title: 'Builders\' Challenge',
  questions: [
    num('L09-1', 'volume', 'Figure A and Figure B are joined. What is the total volume?', '80',
      'A: 5 × 2 × 2 = 20. B: 5 × 4 × 3 = 60. Total: 20 + 60 = 80 cubic units.',
      { figure: two(box(5, 2, 2), box(5, 4, 3)) }),
    num('L09-2', 'volume', 'A prism has a volume of 72 cubic inches. Its length is 6 in and its width is 3 in. What is its height, in inches?', '4',
      '6 × 3 = 18. Then 72 ÷ 18 = 4 inches.'),
    mc('L09-3', 'volume', 'Which two prisms have the SAME volume? A: 2 × 6 × 5   B: 3 × 4 × 5   C: 10 × 2 × 2',
      ['A and B', 'B and C', 'A and C', 'All three'],
      'A = 60, B = 60, C = 40. So A and B match.'),
    num('L09-4', 'volume', 'A box holds 4 layers of cubes. Each layer has 3 rows of 5 cubes. How many cubes are in the box?', '60',
      'One layer: 3 × 5 = 15. Four layers: 15 × 4 = 60.'),
    num('L09-5', 'expressions', 'What is the value of **48 ÷ (3 × 2) + 5**?', '13',
      'Parentheses: 3 × 2 = 6. Divide: 48 ÷ 6 = 8. Add: 8 + 5 = 13.'),
    mc('L09-6', 'expressions', 'Leo is 9 years old. His sister\'s age is **4 more than twice** Leo\'s age. Which expression shows her age?',
      ['(2 × 9) + 4', '2 × (9 + 4)', '9 + 2 + 4', '(9 + 4) × 2'],
      '"Twice Leo\'s age" is 2 × 9. "4 more than" means add 4.'),
    num('L09-7', 'expressions', 'Using the expression from the question before: how old is Leo\'s sister? (Leo is 9; she is 4 more than twice his age.)', '22',
      '(2 × 9) + 4 = 18 + 4 = 22.'),
    txt('L09-8', 'volume', 'Pool 1 is 10 m long, 5 m wide, and 2 m deep. Pool 2 is 5 m long, 5 m wide, and 4 m deep. Which pool holds more water? Show your work.',
      'Pool 1: 10 × 5 × 2 = 100 cubic meters. Pool 2: 5 × 5 × 4 = 100 cubic meters. They hold the SAME amount. Score 2 = both volumes correct + says same; 1 = one volume correct or right conclusion without work; 0 = wrong.')
  ]
},
{
  id: 'L10', week: 2, day: 5, icon: '🎭', title: 'Word Detective Friday',
  questions: [
    mc('L10-1', 'context', '"The puppy was so **lethargic** after the long walk that it slept all afternoon." Lethargic means…',
      ['Very tired', 'Very excited', 'Hungry', 'Angry'],
      'The clue is "slept all afternoon."'),
    mc('L10-2', 'context', '"The desert was **arid**; it had not rained in months." Arid means…',
      ['Very dry', 'Very cold', 'Crowded', 'Colorful'],
      'The clue is "had not rained in months."'),
    mc('L10-3', 'figurative', '"The classroom was a zoo after the fire drill." This metaphor means…',
      ['The classroom was noisy and wild', 'There were animals in the classroom', 'The class went to the zoo', 'The classroom was very quiet'],
      'Zoos can be loud and busy, so the class was loud and busy.'),
    mc('L10-4', 'figurative', 'Which sentence uses **personification**?',
      ['The sun smiled down on the beach.', 'The sun was as hot as an oven.', 'It\'s raining cats and dogs.', 'The sun is a star.'],
      'The sun can\'t really smile. That is a human action.'),
    mc('L10-5', 'figurative', '"Spiders really **pull their weight** around the house." This idiom means spiders…',
      ['Do their share of helpful work', 'Are very heavy', 'Lift heavy things', 'Hang from the ceiling'],
      'To "pull your weight" means to do your fair share of work. Spiders help by eating pests.'),
    txt('L10-6', 'figurative', 'Write one sentence using **personification** about your iPad or your backpack.',
      'The object must do a human action or have a human feeling (e.g., "My backpack groaned under all my books"). Score 2 = clear personification of the iPad/backpack; 1 = personification of another object, or unclear; 0 = no personification.'),
    num('L10-7', 'expressions', 'What is the value of **2 × (6 + 4) − 5**?', '15',
      'Parentheses: 6 + 4 = 10. Multiply: 2 × 10 = 20. Subtract: 20 − 5 = 15.'),
    num('L10-8', 'fractions', 'What is **2 ÷ 5**? Write it as a fraction.', ['2/5', '0.4'],
      'Dividing 2 by 5 gives 2/5.')
  ]
},
/* ======================= WEEK 3 ======================= */
{
  id: 'L11', week: 3, day: 1, icon: '🕳️', title: 'Word Quest: SUBTERRANEAN',
  passage: {
    title: 'The Secret World Under Our Feet',
    wordParts: [
      ['sub-', 'a prefix meaning "under" or "below"'],
      ['terra', 'a Latin root meaning "earth" or "land"'],
      ['-anean', 'a suffix meaning "belonging to"']
    ],
    text: `Oliver's family moved to a small town in New Mexico, and on his first day of exploring, he found something strange in the backyard: a round hole, about as wide as a dinner plate, with cool air flowing out of it.

"Probably a gopher," said his sister, Ava, who was thirteen and believed she knew everything.

But gophers don't breathe out cold air. Oliver went to the town library, where a librarian named Mr. Begay pulled out an old map. "Your street sits right above the Moon River Caverns," he explained. "Miles of tunnels and rooms, all underground. Most people forget they're even there."

That weekend, Mr. Begay took Oliver and Ava on a guided tour through the official cave entrance. They climbed down a long metal staircase into the darkness. The air was cool and [[damp|slightly wet]]. Their flashlights lit up [[stalactites|icicle-shaped rocks that hang from a cave's ceiling]] dripping from the ceiling and an underground lake so still it looked like black glass.

"Look!" whispered Ava. Tiny white fish swam in the lake. They had no eyes at all.

"Animals that live their whole lives down here don't need eyes," said Mr. Begay. "There's no light to see."

Even Ava, who knew everything, was [[speechless|so surprised that you can't talk]].

When they climbed back up into the sunshine, Oliver looked at the ground beneath his sneakers in a whole new way. "There's a secret world under our feet," he said.

"*Sub* means under," said Mr. Begay, "and *terra* means earth. Anything that lives or exists under the ground is **SUBTERRANEAN**."

So whenever you think of something hidden beneath the earth, like tunnels, caves, roots, or eyeless fish, think of Oliver's secret world under his feet, and you will remember the word **SUBTERRANEAN**.`
  },
  questions: [
    mc('L11-1', 'vocab', 'What does **subterranean** mean?',
      ['Existing or living under the ground', 'Very old', 'Full of water', 'Dark and scary'],
      'Sub (under) + terra (earth) = under the earth.'),
    mc('L11-2', 'vocab', 'Which word uses the root **terra** (earth, land)?',
      ['territory', 'turtle', 'travel', 'tower'],
      'A territory is an area of land.'),
    mc('L11-3', 'vocab', 'The prefix **sub-** means "under." Which word names a ship that travels under the water?',
      ['submarine', 'supermarket', 'sunrise', 'seaplane'],
      'Sub (under) + marine (sea) = under the sea.'),
    mc('L11-4', 'inference', 'Why are the fish in the cave lake blind?',
      ['They live in total darkness, so they don\'t need eyes', 'The flashlights hurt their eyes', 'They were baby fish', 'They were sleeping'],
      'Mr. Begay says there is no light to see down there.'),
    mc('L11-5', 'inference', 'Ava "believed she knew everything," but at the end she was speechless. What does this show?',
      ['She was so amazed that even she learned something new', 'She lost her voice', 'She was bored', 'She was angry at Oliver'],
      'Being speechless shows she was surprised. She didn\'t know everything after all!'),
    txt('L11-6', 'vocab', 'Name **two** things in nature that are subterranean, and explain why each one belongs underground.',
      'Any two underground things with a reasonable reason: roots (take in water), worms/moles/gophers/ants (live in tunnels), caves, groundwater, cave fish, seeds sprouting. Score 2 = two correct examples with reasons; 1 = one correct example, or two without reasons; 0 = none correct.'),
    num('L11-7', 'volume', 'A cave room is shaped like a box: 20 m long, 10 m wide, and 5 m high. What is its volume in cubic meters?', '1000',
      '20 × 10 = 200. Then 200 × 5 = 1,000 cubic meters.'),
    num('L11-8', 'expressions', 'What is the value of **100 − (6 × 8) + 2**?', '54',
      'Parentheses: 6 × 8 = 48. Then 100 − 48 = 52. Then 52 + 2 = 54.')
  ]
},
{
  id: 'L12', week: 3, day: 2, icon: '🧮', title: 'Expression Explorers',
  questions: [
    mc('L12-1', 'expressions', 'Ana practiced piano 2 hours each weekday (Monday to Friday) and 4 hours on Sunday. Which expression shows her total hours?',
      ['(2 × 5) + 4', '2 × (5 + 4)', '(2 + 5) × 4', '2 × 5 × 4'],
      '5 weekdays × 2 hours, then add the 4 hours on Sunday.'),
    num('L12-2', 'expressions', 'How many hours did Ana practice in all? (2 hours each weekday, 4 hours on Sunday)', '14',
      '(2 × 5) + 4 = 10 + 4 = 14 hours.'),
    mc('L12-3', 'expressions', 'Which expression is **9 less than the product of 7 and 4**?',
      ['(7 × 4) − 9', '9 − (7 × 4)', '7 × (4 − 9)', '(7 − 4) × 9'],
      'Product of 7 and 4 = 7 × 4. "9 less than" means subtract 9 from it.'),
    num('L12-4', 'expressions', 'Pencils come in packs of 10. Mr. Reyes buys 6 packs and gives away 13 pencils. How many pencils does he have left?', '47',
      '(6 × 10) − 13 = 60 − 13 = 47.'),
    num('L12-5', 'expressions', 'What is the value of **2 × [10 − (3 + 4)]**?', '6',
      'Inside out: 3 + 4 = 7. Then 10 − 7 = 3. Then 2 × 3 = 6.'),
    mc('L12-6', 'expressions', 'What is the FIRST step to solve **40 − 8 × (2 + 3)**?',
      ['Add 2 + 3', 'Subtract 40 − 8', 'Multiply 8 × 2', 'Multiply 8 × 3'],
      'Always start with what\'s inside the parentheses.'),
    num('L12-7', 'expressions', 'What is the value of **40 − 8 × (2 + 3)**?', '0',
      '2 + 3 = 5. Then 8 × 5 = 40. Then 40 − 40 = 0.'),
    txt('L12-8', 'expressions', 'Write a short story problem that matches the expression **(4 × 3) + 5**. Then solve it.',
      'Story must show 4 groups of 3 (or 3 groups of 4) and then 5 more added; answer 17. Score 2 = matching story + answer 17; 1 = story matches but no/wrong answer, or answer right but story doesn\'t match; 0 = neither.')
  ]
},
{
  id: 'L13', week: 3, day: 3, icon: '🐙', title: 'Reading: The Clever Octopus', long: true,
  passage: {
    title: 'The Clever Octopus',
    text: `Imagine an animal with three hearts, blue blood, and a brain that stretches all the way into its arms. It sounds like a creature from a science-fiction movie, but it's real. It's the octopus, and scientists think it may be one of the smartest animals in the ocean.

**Eight Arms, Many Brains**

An octopus has a central brain, but about two-thirds of its [[neurons|nerve cells that carry messages in the brain and body]] are in its eight arms. This means each arm can taste, touch, and even make simple decisions on its own. An arm can explore a crack in a rock while the octopus is busy looking somewhere else!

**Masters of Disguise**

Octopuses are famous for [[camouflage|colors or patterns that help an animal blend in with its surroundings]]. Their skin is covered with thousands of special cells that can change color in less than a second. Some octopuses can also change the texture of their skin to look bumpy like coral or smooth like sand. The mimic octopus goes even further: it can pretend to be a poisonous lionfish or a sea snake to scare away [[predators|animals that hunt and eat other animals]].

**Escape Artists**

In aquariums, octopuses are known for causing trouble. Because they have no bones, they can squeeze through any opening bigger than their beak, the only hard part of their body. One octopus in New Zealand, named Inky, slipped out of his tank at night, slid across the floor, and escaped down a drainpipe that led to the ocean. Other octopuses have learned to unscrew jar lids to get the crab inside.

**Problem Solvers**

Scientists have tested octopuses with puzzles and mazes. Many octopuses learn to solve them quickly and remember the answers. Some even use tools. The veined octopus collects coconut shells from the sea floor, carries them around, and hides inside them when danger comes near.

**A Short Life**

Surprisingly, most octopuses live only one to two years. A mother octopus guards her eggs for weeks or even months, blowing fresh water over them and [[fending off|fighting to keep something away]] hungry fish. She does not leave to eat, and she usually dies soon after the babies hatch. Her [[sacrifice|giving up something important to help someone else]] gives the next generation a chance to survive.

The more we learn about octopuses, the more questions we have. How can an animal so different from us be so clever? Scientists are still searching for answers, and the octopus, as always, is keeping a few secrets.`
  },
  questions: [
    mc('L13-1', 'main_idea', 'What is the main idea of the passage?',
      ['Octopuses are intelligent animals with amazing abilities', 'Octopuses are dangerous to people', 'All octopuses live in aquariums', 'Octopuses have very long lives'],
      'Every section shows a different clever ability of the octopus.'),
    mc('L13-2', 'evidence', 'Which detail best shows that octopuses can solve problems?',
      ['"Other octopuses have learned to unscrew jar lids to get the crab inside."', '"Most octopuses live only one to two years."', '"Imagine an animal with three hearts, blue blood…"', '"Their skin is covered with thousands of special cells."'],
      'Opening a jar to get food is solving a problem.'),
    mc('L13-3', 'context', 'The text calls octopuses **"escape artists."** What does this mean?',
      ['They are very good at getting out of places', 'They paint pictures', 'They hide inside paintings', 'They are afraid of people'],
      'Inky escaped from his tank. Octopuses are skilled at escaping.'),
    txt('L13-4', 'evidence', 'How does the mother octopus show **sacrifice**? Use details from the text.',
      'She guards her eggs for weeks/months, blows fresh water over them, fends off hungry fish, does not leave to eat, and usually dies after they hatch, giving up her life so the babies survive. Score 2 = explains sacrifice with at least two details; 1 = one detail; 0 = no relevant detail.'),
    mc('L13-5', 'fractions', 'About **2/3** of an octopus\'s neurons are in its arms. If a pretend octopus had 300 neurons, how many would be in its arms?',
      ['200', '100', '150', '30'],
      '1/3 of 300 is 100, so 2/3 is 200.')
  ]
},
{
  id: 'L14', week: 3, day: 4, icon: '🎁', title: 'Gift Box Factory',
  questions: [
    num('L14-1', 'volume', 'What is the volume of this gift box, in cubic inches?', '42',
      '7 × 2 × 3 = 42 cubic inches.', { figure: box(7, 2, 3, 'in') }),
    mc('L14-2', 'volume', 'A cube has a volume of **64 cubic inches**. How long is each side?',
      ['4 inches', '8 inches', '16 inches', '32 inches'],
      '4 × 4 × 4 = 64.'),
    num('L14-3', 'volume', 'Figure A and Figure B are joined. What is the total volume?', '108',
      'A: 2 × 3 × 6 = 36. B: 6 × 3 × 4 = 72. Total: 36 + 72 = 108 cubic units.',
      { figure: two(box(2, 3, 6), box(6, 3, 4)) }),
    num('L14-4', 'volume', 'Tony fills a box with 1-inch cubes: 8 cubes long, 4 cubes wide, and 2 cubes tall. How many cubes fit?', '64',
      '8 × 4 × 2 = 64 cubes.'),
    num('L14-5', 'fractions', 'What is **2/3 of 9**?', '6',
      '1/3 of 9 = 3. So 2/3 of 9 = 6.'),
    num('L14-6', 'fractions', 'Write **3 ÷ 4** as a fraction.', ['3/4', '0.75'],
      '3 ÷ 4 = 3/4.'),
    mc('L14-7', 'fractions', '8 kids share 2 pizzas equally. How much does each kid get?',
      ['1/4 of a pizza', '4 pizzas', '1/8 of a pizza', '1/2 of a pizza'],
      '2 ÷ 8 = 2/8 = 1/4.'),
    txt('L14-8', 'volume', 'A box has a volume of **60 cubic units**. Give **two** different sets of dimensions (length × width × height) it could have. Show the multiplication.',
      'Any two sets where l × w × h = 60, e.g., 5 × 4 × 3, 10 × 3 × 2, 6 × 5 × 2, 10 × 6 × 1. Score 2 = two correct sets; 1 = one correct set; 0 = none.')
  ]
},
{
  id: 'L15', week: 3, day: 5, icon: '🛶', title: 'Reading: The Race at Willow Lake', long: true,
  passage: {
    title: 'The Race at Willow Lake',
    text: `The morning of the canoe race, Willow Lake was as smooth as a mirror. Priya and her grandfather, Nana-ji, carried their old green canoe down to the dock. The other teams had shiny new boats that [[gleamed|shined brightly]] in the sun.

"Our canoe is older than your mother," Nana-ji joked. "But she still knows how to dance on water."

When the horn blew, the shiny boats shot ahead like arrows. Priya paddled as hard as she could, but they fell further and further behind. Her arms burned. "We're going to lose," she said.

"Paddle together, not harder," Nana-ji said calmly. "Listen. In… and pull. In… and pull."

Priya matched his [[rhythm|a steady, repeated pattern of movement or sound]]. Slowly, the old canoe began to glide. Ahead, two of the shiny boats were zigzagging because their paddlers were splashing out of time. One team argued so loudly that they [[drifted|moved slowly without control, carried by water or wind]] toward the reeds.

The green canoe passed one boat, then another. The finish line flags flapped and cheered in the wind. Priya and Nana-ji crossed in second place, just a few feet behind the winners.

Priya was [[exhausted|extremely tired]] but grinning from ear to ear. "We didn't win," she said.

Nana-ji patted the canoe's side. "Today, second place tastes like first."

That evening, Priya wrote one sentence on the first page of her notebook: *Teamwork beats rushing.*`
  },
  questions: [
    mc('L15-1', 'figurative', '"Willow Lake was as smooth as a mirror" is a…',
      ['Simile', 'Metaphor', 'Idiom', 'Personification'],
      'It compares the lake to a mirror using "as."'),
    mc('L15-2', 'figurative', 'Which phrase from the story is **personification**?',
      ['"The finish line flags flapped and cheered in the wind."', '"shot ahead like arrows"', '"grinning from ear to ear"', '"as smooth as a mirror"'],
      'Flags can\'t really cheer. That\'s a human action.'),
    mc('L15-3', 'main_idea', 'What is the theme of the story?',
      ['Working together in rhythm can be better than rushing', 'New boats are always faster', 'Grandparents should not race', 'Winning is the only thing that matters'],
      'Priya writes it herself: "Teamwork beats rushing."'),
    txt('L15-4', 'inference', 'What does Nana-ji mean when he says, **"Today, second place tastes like first"**?',
      'They feel as proud/happy as if they had won, because they worked together, came from far behind, and did their best. Score 2 = explains feeling like winners + a reason; 1 = says they were happy without a reason; 0 = literal/incorrect (about taste or food).'),
    num('L15-5', 'expressions', 'What is the value of **(12 + 8) ÷ 4 × 3**?', '15',
      'Parentheses: 12 + 8 = 20. Then left to right: 20 ÷ 4 = 5, then 5 × 3 = 15.'),
    num('L15-6', 'volume', 'A canoe storage box is 9 ft long, 2 ft wide, and 2 ft tall. What is its volume in cubic feet?', '36',
      '9 × 2 × 2 = 36 cubic feet.', { figure: box(9, 2, 2, 'ft') })
  ]
}
];

/* ========== NEW LESSONS from school worksheets (Nov 2026) ========== */
window.LESSONS.push(
{
  id: 'L16', week: 0, day: 0, icon: '✍️', title: 'Word Quest: Words That Write and Speak',
  passage: {
    title: 'The Old Writing Desk',
    wordParts: [
      ['graph / script / scrib', 'Latin and Greek roots meaning "write"'],
      ['dict', 'a Latin root meaning "say" or "speak"'],
      ['auto-', 'a prefix meaning "self"'],
      ['bio', 'a root meaning "life"'],
      ['contra-', 'a prefix meaning "against"']
    ],
    text: `When Grandpa Joe moved in with Lily's family, he brought an old wooden writing desk. Lily loved it. It had tiny drawers, a secret compartment, and the smell of ink and old paper.

On the lid, there was an [[inscription|words carved or written on something]]: *Write what is true.* The letters were swirly and beautiful.

"Who wrote that?" Lily asked.

"My mother," said Grandpa Joe. "She was famous in our town for her **calligraphy**. People paid her to write wedding invitations by hand."

Inside the secret compartment, Lily found a thick notebook. On the first page it said: *The Story of My Life, by Joe Parker.* It was Grandpa's [[autobiography|the story of a person's life, written by that same person]]!

"I never finished it," Grandpa said. "My hands shake too much to write now."

Lily had an idea. "You could **dictate** it to me! You talk, and I'll write down every word."

So every evening, Grandpa told stories and Lily wrote them down. Sometimes her little brother tried to [[contradict|say the opposite of what someone else said]] Grandpa: "That's not how it happened!" But Grandpa just laughed.

At the end of the month, Lily typed the whole notebook into the computer. Now the family had a perfect **transcript** of Grandpa's stories.

So whenever you see **graph**, **script**, or **scrib**, think of Lily writing at the old desk. And whenever you see **dict**, think of Grandpa saying his stories out loud.`
  },
  questions: [
    mc('L16-1', 'vocab', 'The root **graph** means "write." Which word means "beautiful, artistic handwriting"?', ['calligraphy', 'contradict', 'inscription', 'prescription'], 'Calli (beautiful) + graph (write) = calligraphy.'),
    mc('L16-2', 'vocab', 'The root **dict** means "say." To **contradict** someone means to…', ['say the opposite of what they said', 'write them a letter', 'agree with them', 'whisper a secret'], 'Contra (against) + dict (say) = to say against.'),
    mc('L16-3', 'vocab', 'Which of these could you **dictate**?', ['a speech', 'a painting', 'a weapon', 'a friend'], 'You dictate words by saying them aloud for someone to write.'),
    mc('L16-4', 'vocab', 'An **edict** is an official order. Choose its **antonym** (opposite).', ['plea', 'demand', 'ruling', 'command'], 'An edict ORDERS; a plea ASKS. Demand, ruling, and command are synonyms (similar), not opposites.'),
    mc('L16-5', 'vocab', 'You might be written a **prescription** if…', ['you catch the flu from a classmate', 'you are tired and need to go to bed', 'you get lost in a new city', 'the waiter brings the wrong order'], 'A doctor writes (script) a prescription for medicine when you are sick.'),
    mc('L16-6', 'vocab', 'Finish the analogy. **autobiography : yourself :: biography : ___**', ['someone else', 'a pencil', 'a library', 'a dream'], 'An autobiography is about yourself; a biography is about someone else.'),
    txt('L16-7', 'vocab', 'Write a sentence using the word **inscription** that shows you know what it means.', 'The sentence must show inscription = words carved or written on something (a ring, a trophy, a statue, a building, a book cover). Score 2 = correct meaning clear from context; 1 = word used but meaning unclear; 0 = wrong meaning.'),
    num('L16-8', 'fractions', 'Sarah went on 12 rides in the morning. In the afternoon she went on **2/3** as many rides. How many rides did she go on in the afternoon?', '8', '1/3 of 12 = 4, so 2/3 of 12 = 8.')
  ]
},
{
  id: 'L17', week: 0, day: 0, icon: '🧊', title: 'Science: States of Matter', long: true,
  passage: {
    title: 'Solid, Liquid, Gas: The Secret Dance of Molecules',
    text: `Look around you. Your desk, the water in your bottle, and the air you breathe are all made of [[matter|anything that has mass and takes up space]]. Matter comes in three main states: solid, liquid, and gas. What makes them different? The answer is too small to see: tiny particles called [[molecules|the tiny building blocks that matter is made of]].

**Solids: Packed Tight**

In a solid, the molecules are packed very close together, like students squeezed shoulder to shoulder in a crowded elevator. They can't move around. They can only [[vibrate|shake back and forth very quickly in one place]]. Because the molecules stay locked in their places, a solid keeps its own shape. A rock, an apple, and an ice cube keep their shapes unless something changes them, like cutting, breaking, or melting.

**Liquids: Sliding Past Each Other**

In a liquid, the molecules are still close, but they are not locked in place. They can slide and roll past each other, like marbles in a bag. That is why a liquid can flow and pour. A liquid has no shape of its own. It takes the shape of whatever container it is in. Pour juice into a tall glass, and it becomes tall. Pour it into a bowl, and it becomes round and flat.

**Gases: Spreading Out**

In a gas, the molecules are far apart, and they zoom around in every direction. A gas has no shape of its own, and it spreads out to fill any container completely. When you blow up a balloon, the gas molecules from your breath spread out and push on the inside of the rubber in all directions. The more gas you blow in, the more molecules push, and the bigger the balloon gets.

**Changing States**

Matter can change from one state to another when it is heated or cooled. When you heat ice, its molecules get more energy and start to slide: the ice [[melts|changes from a solid to a liquid]] into water. Heat the water even more, and the molecules move so fast that they escape into the air as steam. This is called [[evaporation|when a liquid changes into a gas]].

It works the other way, too. When you cool water in the freezer, its molecules slow down and lock together, and the water freezes into solid ice. When steam touches a cold mirror, it cools and turns back into tiny drops of liquid. That is called condensation.

So the next time you drink a cold glass of water with ice, remember: you are holding all three states of matter at once, the solid ice, the liquid water, and the water vapor floating in the air above it.`
  },
  questions: [
    mc('L17-1', 'science', 'Why can\'t a solid change its shape on its own?', ['Its molecules are packed tightly and can only vibrate in place', 'It is too heavy', 'It has no molecules', 'It is always cold'], 'Locked-in molecules keep the solid\'s shape.'),
    mc('L17-2', 'science', 'How does the shape of a liquid change?', ['It takes the shape of its container', 'It never changes', 'It always becomes round', 'It turns into a gas right away'], 'Liquid molecules slide past each other, so the liquid fills the shape of its container.'),
    mc('L17-3', 'science', 'How can liquid water become a solid?', ['By cooling it until it freezes', 'By heating it', 'By stirring it', 'By letting it dry'], 'Cooling slows the molecules down until they lock together as ice.'),
    mc('L17-4', 'science', 'Why does a balloon get bigger when you blow into it?', ['Gas molecules spread out and push on the inside of the balloon', 'The rubber grows by itself', 'The balloon gets hot', 'Liquid fills the balloon'], 'More gas molecules = more pushing on the rubber.'),
    txt('L17-5', 'science', 'How is the shape of a **solid** different from the shape of a **liquid** and a **gas**? Use the word **molecules** in your answer.', 'Solids keep their own shape because their molecules are packed tightly/locked in place; liquids and gases have no shape of their own (liquids take the container\'s shape; gases spread to fill it) because their molecules can move. Score 2 = both parts + uses "molecules" correctly; 1 = shape difference without molecules (or vice versa); 0 = incorrect.'),
    num('L17-6', 'fractions', '3 pizzas are shared equally by 8 friends. What fraction of a pizza does each friend get?', ['3/8', '0.375'], '3 ÷ 8 = 3/8.')
  ]
},
{
  id: 'L18', week: 0, day: 0, icon: '🎡', title: 'Fraction Action: Fair Day',
  questions: [
    num('L18-1', 'fractions', 'At the fair, Mia rode 15 rides. Her brother rode **2/3** as many. How many rides did her brother ride?', '10', '1/3 of 15 = 5, so 2/3 of 15 = 10.'),
    num('L18-2', 'fractions', '12 students share 5 packs of crayons equally. How much of a pack does each student get? (Write a fraction)', ['5/12'], '5 ÷ 12 = 5/12.'),
    num('L18-3', 'fractions', 'A rectangle is **8 units** long and **1/2 unit** wide. What is its area, in square units?', '4', 'Area = 8 × 1/2 = 4 square units.'),
    num('L18-4', 'fractions', 'A garden is **3/4 yard** wide and **2 yards** long. What is its area, in square yards? (Write a fraction or mixed number)', ['1 1/2', '3/2', '6/4', '1.5'], '3/4 × 2 = 6/4 = 1 1/2 square yards.'),
    num('L18-5', 'fractions', 'What is **3/4 of 20**?', '15', '1/4 of 20 = 5, so 3/4 of 20 = 15.'),
    mc('L18-6', 'volume', 'Which expression also shows the volume of a prism that is **2 × 3 × 4**?', ['6 × 4', '2 + 3 + 4', '5 × 4', '2 × 7'], '2 × 3 = 6, and 6 × 4 = 24. The others don\'t equal 24.'),
    num('L18-7', 'volume', 'Figure A and Figure B are joined. What is the total volume?', '48', 'A: 3 × 3 × 4 = 36. B: 3 × 2 × 2 = 12. Total: 36 + 12 = 48 cubic units.', { figure: two(box(3, 3, 4), box(3, 2, 2)) }),
    txt('L18-8', 'volume', 'Write **two different** multiplication expressions for the volume of a prism that is 2 × 3 × 4. Then find the volume.', 'Any two different expressions equal to 24, such as 6 × 4, 2 × 12, 8 × 3, (2 × 3) × 4; volume = 24 cubic units. Score 2 = two correct expressions + 24; 1 = one correct expression or missing the volume; 0 = incorrect.')
  ]
}
);

/* ========== NEW LESSONS from school worksheets (Nov 17, 2026) ========== */
window.LESSONS.push(
{
  id: 'L19', week: 0, day: 0, icon: '🛟', title: 'Reading: Rapids Ahead', long: true,
  passage: {
    title: 'Rapids Ahead',
    text: `Maya had been waiting all summer for the rafting trip. Now she sat on the edge of the yellow raft with her cousins, her life vest buckled tight, while the river carried them deeper into the canyon.

Before they climbed in, their guide, Rosa, had given a safety talk. "If you fall in, don't try to stand up," she said. "Lie on your back, point your feet downstream, and keep your head up. Your feet will bump the rocks so your head doesn't." Maya's cousin Leo had rolled his eyes. "It's just a big water slide," he whispered. Maya laughed, but she listened anyway.

The river was calm at first. Then the water began to roar. Ahead, white foam churned around huge rocks. These were the [[rapids|places where a river runs fast and rough over rocks]], and they looked [[monstrous|huge and frightening, like a monster]].

"Forward paddle!" Rosa shouted. "Hard!"

The raft dipped, bounced, and slammed against a wave. The [[momentum|the force something has while it is moving]] of the bump tossed Maya right over the side.

Cold water swallowed her. The river grabbed her, spun her, and [[pummeled|hit again and again]] her with waves. For a moment she couldn't tell which way was up. Her heart pounded. She wanted to thrash and grab at anything, but she remembered the safety talk.

*On your back. Feet first. Head up.*

Maya rolled onto her back and pointed her toes downstream. She thought about the last soccer game of the season, when she had taken a deep breath before the penalty kick and blocked out the noise of the crowd. *Breathe,* she told herself. *Stay calm.*

The canyon walls rose on both sides like the sides of a giant's bathtub, tall and steep, with nothing to hold on to. But around the bend, the water slowed. Maya spotted a calm spot near a sandy bank and kicked toward it with all her strength.

A second raft was waiting there. Its crew waved their paddles [[frantically|in a wild, worried, hurried way]]. "Swim to us! You can do it!"

Maya swam, reached out, and felt strong hands pull her aboard by her life vest. She lay in the bottom of the raft, shivering and breathing hard.

A few minutes later, her own raft pulled alongside. Leo's face was pale. "You okay?" he asked quietly.

"I'm okay," Maya said. "I did what Rosa told us."

Rosa smiled. "You kept your head. The river is powerful, but you were smart."

For the rest of the trip, Leo sat up straight and listened to every word Rosa said. And Maya looked at the rushing water a little differently. It was beautiful, but now she knew it deserved respect.`
  },
  questions: [
    mc('L19-1', 'main_idea', 'Which sentence best describes the **theme** of the story?',
      ['Nature is powerful, so it is important to stay calm and follow safety rules', 'Rafting is too dangerous for kids', 'Cousins should never laugh at each other', 'Rivers are always calm around the bend'],
      'Maya survives because she stays calm and follows Rosa\'s safety rules, and she learns to respect the river.'),
    mc('L19-2', 'evidence', 'Which detail from the story **best supports** that theme?',
      ['"You kept your head. The river is powerful, but you were smart."', '"Maya had been waiting all summer for the rafting trip."', '"It\'s just a big water slide," he whispered.', 'Maya sat on the edge of the yellow raft with her cousins.'],
      'Rosa\'s words connect both parts of the theme: the river is powerful, and Maya stayed calm and smart.'),
    mc('L19-3', 'figurative', 'What does the author mean by **"The canyon walls rose on both sides like the sides of a giant\'s bathtub"**?',
      ['The walls were very tall and steep', 'The walls were full of water', 'The walls were smooth and white', 'The walls were small and low'],
      'It is a simile: like a bathtub\'s sides, the walls were tall and steep, with nothing to grab.'),
    mc('L19-4', 'inference', 'How does Maya respond when she falls into the water?',
      ['She remembers the safety rules and follows them', 'She panics and forgets everything', 'She tries to stand up on the rocks', 'She waits for someone to rescue her without moving'],
      'She rolls onto her back, points her feet downstream, and stays calm, just like Rosa taught.'),
    mc('L19-5', 'context', '"The **momentum** of the bump tossed Maya right over the side." Momentum means…',
      ['the force something has while it is moving', 'a feeling of fear', 'a kind of paddle', 'a calm part of the river'],
      'The raft was moving fast, and that moving force threw Maya out.'),
    mc('L19-6', 'context', 'The crew waved their paddles **frantically**. This means they waved them…',
      ['in a wild, worried, hurried way', 'slowly and calmly', 'quietly and sadly', 'one time only'],
      'They were worried about Maya and wanted her to see them quickly.'),
    orderQ('L19-7', 'main_idea', 'Put the events in order.',
      ['Rosa gives a safety talk', 'The raft hits the rapids and Maya falls in', 'Maya rolls onto her back with her feet downstream', 'Maya swims to the second raft', 'Leo starts listening carefully to Rosa'],
      'Safety talk → falls in → follows the rules → swims to safety → Leo learns too.'),
    txt('L19-8', 'inference', 'Why does Maya think about her soccer game when she is in the river? How does it help her?',
      'She remembers how she stayed calm and blocked out the noise before a penalty kick; thinking of it helps her stay calm, breathe and not panic so she can follow the safety rules. Score 2 = connects the memory to staying calm + how it helped; 1 = mentions calm OR the memory only; 0 = incorrect.')
  ]
},
{
  id: 'L20', week: 0, day: 0, icon: '🕷️', title: 'Reading: Spooky or Sweet Spiders?', long: true,
  passage: {
    title: 'Don\'t Fear Your Eight-Legged Neighbors',
    text: `Every October, fake spiders creep across windows, porches, and classroom doors. Because so many people are scared of spiders, they became a favorite Halloween decoration. But if you look closer, spiders are not monsters. They are some of the most amazing animals on Earth.

**Masters of Disguise**

Some spiders are **masters of disguise**. One kind curls up on a leaf and looks just like a bird dropping, so hungry birds fly right past. Other spiders hold up their front legs like [[antennae|feelers on an insect's head]] so they look like ants. They play hide-and-seek with every predator in the garden.

**Loving Moms**

A mother wolf spider carries her babies on her back **like a living backpack** until they are big enough to survive on their own.

**Helpful Housemates**

Spiders really **pull their weight** around the house. They quietly catch flies, mosquitoes, and other pests, and they never ask for a snack in return.

**Artists and Dancers**

For some spiders, a web is **a canvas**. The garden spider weaves a bright zigzag pattern into its web. Tiny peacock spiders have dancing **down to an art**: the males lift their colorful tails, wave their legs, and dance to impress a female.

**Team Players**

Most spiders live alone, but a few kinds are **social butterflies**. In Australia, some huntsman spiders live together in big family groups under tree bark and help raise the young ones.

**Fishing Experts**

Fishing spiders live near ponds. They rest their legs on the water, feel the tiny ripples, and catch small fish and tadpoles. Their legs **listen** to the water for their next meal.

**Not So Dangerous**

Only a very small number of spider species can seriously hurt people. Most spiders would much rather run away from you than bite you.

So this Halloween, when you see a spider, don't scream. Say hello to one of nature's most talented neighbors.`
  },
  questions: [
    mc('L20-1', 'main_idea', 'What is the **central idea** of the article?',
      ['Spiders are amazing animals with special skills, so people shouldn\'t fear them', 'Spiders are the scariest animals on Earth', 'Spiders only live in Australia', 'Halloween is the best holiday of the year'],
      'Every section shows a special skill, and the ending says not to scream but to appreciate them.'),
    mc('L20-2', 'evidence', 'Which detail **best supports** the central idea?',
      ['Only a very small number of spider species can seriously hurt people.', 'Fake spiders creep across windows every October.', 'Most spiders live alone.', 'Fishing spiders live near ponds.'],
      'Showing that spiders are not very dangerous supports "don\'t fear them."'),
    mc('L20-3', 'main_idea', 'How does the author show her **point of view** about spiders?',
      ['By giving lots of interesting facts about what spiders can do', 'By saying no spider has ever bitten anyone', 'By telling scary stories about spiders', 'By listing different Halloween costumes'],
      'Fact after fact about disguises, moms, art and fishing shows that the author admires spiders.'),
    mc('L20-4', 'inference', 'What is the relationship between **spiders and Halloween** in the article?',
      ['Spiders are used as Halloween decorations because many people fear them', 'Spiders only come out on Halloween night', 'Children dress up as spiders because spiders are cute', 'Halloween is when spiders build their webs'],
      'The first paragraph says it: because so many people are scared of spiders, they became a favorite decoration.'),
    sortQ('L20-5', 'figurative', 'Sort each phrase into the right kind of **figurative language**.',
      ['Simile', 'Metaphor', 'Personification', 'Idiom'],
      [['carries her babies like a living backpack', 0], ['a web is a canvas', 1], ['some spiders are masters of disguise', 1], ['their legs listen to the water', 2], ['they play hide-and-seek with every predator', 2], ['spiders pull their weight', 3], ['they have dancing down to an art', 3]],
      'Simile uses like/as. Metaphor says something IS something else. Personification gives human actions to non-humans. An idiom is an expression with a hidden meaning.'),
    mc('L20-6', 'figurative', 'Peacock spiders **have dancing down to an art**. This idiom means they…',
      ['are very skilled at dancing', 'paint pictures while they dance', 'dance only in art class', 'are bad at dancing'],
      'To have something "down to an art" means you do it with great skill.'),
    mc('L20-7', 'figurative', '"A web is **a canvas**." What does this metaphor mean?',
      ['Spiders make patterns and designs in their webs, like art', 'Webs are made of cloth', 'Spiders paint with brushes', 'Webs are always white'],
      'A canvas is what an artist paints on. The spider "decorates" its web.'),
    txt('L20-8', 'figurative', 'Write your **own simile** about a spider. Remember: a simile uses **like** or **as**.',
      'A sentence that compares a spider (or its web, legs, speed…) to something else using "like" or "as", e.g. "The web sparkled like a necklace." Score 2 = correct simile with like/as and a clear comparison; 1 = uses like/as but comparison unclear OR is a metaphor; 0 = no comparison.')
  ]
},
{
  id: 'L21', week: 0, day: 0, icon: '🎁', title: 'Math Mix: Sharing and Building',
  questions: [
    num('L21-1', 'fractions', '7 snack packs are shared equally by **4** friends. How much does each friend get? (Write a fraction or mixed number)', ['1 3/4', '7/4', '1.75'],
      '7 ÷ 4 = 7/4 = 1 3/4. Each friend gets one whole pack and 3/4 of another.'),
    num('L21-2', 'fractions', '5 pies are shared equally by **6** people. What fraction of a pie does each person get?', ['5/6'],
      '5 ÷ 6 = 5/6.'),
    mc('L21-3', 'fractions', '2 friends share **1/4** of a pizza equally. What fraction of the **whole** pizza does each friend get?',
      ['1/8', '1/2', '2/4', '1/6'],
      '1/4 ÷ 2 = 1/8. Splitting a piece into 2 makes each part smaller.'),
    num('L21-4', 'expressions', 'What is the value of **24 ÷ (12 − 6)**?', '4',
      'Parentheses first: 12 − 6 = 6. Then 24 ÷ 6 = 4.'),
    num('L21-5', 'expressions', 'What is the value of **30 − (4 + 2) × 3**?', '12',
      'Parentheses: 4 + 2 = 6. Multiply: 6 × 3 = 18. Subtract: 30 − 18 = 12.'),
    num('L21-6', 'volume', 'A gift box is 6 inches long, 3 inches wide, and 2 inches tall. What is its volume in cubic inches?', '36',
      '6 × 3 × 2 = 36 cubic inches.', { figure: box(6, 3, 2, 'in') }),
    num('L21-7', 'volume', 'Figure A and Figure B are joined. What is the **total** volume in cubic inches?', '280',
      'A: 4 × 4 × 5 = 80. B: 10 × 4 × 5 = 200. Total: 80 + 200 = 280 cubic inches.', { figure: two(box(4, 4, 5), box(10, 4, 5), 'in') }),
    txt('L21-8', 'fractions', 'Explain why **1/6 ÷ 3** gives a **smaller** number than 1/6.',
      'Dividing 1/6 into 3 equal parts makes each part smaller (1/18): you are splitting a piece that is already small among more people. Score 2 = says the piece is split into 3 smaller parts + gives 1/18 or a clear example; 1 = says it gets smaller without explaining; 0 = incorrect.')
  ]
},
{
  id: 'L22', week: 0, day: 0, icon: '💧', title: 'Science Review: Matter Mission',
  questions: [
    sortQ('L22-1', 'science', 'Sort each thing into its **state of matter**.', ['🧊 Solid', '💧 Liquid', '💨 Gas'],
      [['apple', 0], ['window', 0], ['ice cube', 0], ['milk', 1], ['juice', 1], ['glue', 1], ['steam', 2], ['oxygen', 2], ['helium in a balloon', 2]],
      'Solids keep their shape. Liquids take the shape of their container. Gases spread out to fill it.'),
    orderQ('L22-2', 'science', 'Put the changes in order, from **coldest** to **hottest**.',
      ['Solid ice', 'Ice melts into liquid water', 'Water is heated and evaporates', 'Steam (a gas) rises into the air'],
      'Adding heat gives the molecules more energy: solid → liquid → gas.'),
    mc('L22-3', 'science', 'Which state of matter is **most similar to a liquid**, and why?',
      ['A gas, because both can change shape and take the shape of their container', 'A solid, because both keep their own shape', 'A solid, because both are hard', 'A gas, because both are heavy'],
      'Liquids and gases both flow and have no shape of their own.'),
    mc('L22-4', 'science', 'How can matter change from a **liquid** to a **solid**?',
      ['By cooling it until it freezes', 'By letting it dry in the sun', 'By heating it', 'By shaking it'],
      'Cooling slows the molecules down until they lock in place, like water freezing into ice.'),
    mc('L22-5', 'science', 'How can matter change from a **liquid** to a **gas**?',
      ['By heating it so it evaporates', 'By freezing it', 'By pouring it into a cup', 'By cutting it'],
      'Heat makes the molecules move so fast that they escape into the air.'),
    mc('L22-6', 'science', 'Where can you find **matter**?',
      ['Everywhere: anything you can touch, taste, smell or see is matter', 'Only in science labs', 'Only in solids', 'Only in the ocean'],
      'Matter is all around us, even the air.'),
    txt('L22-7', 'science', 'Explain why a **solid keeps its own shape** but a **liquid does not**. Use the word **molecules**.',
      'Solid molecules are packed tightly and only vibrate in place, so the shape stays the same unless something (like cutting or melting) changes it; liquid molecules are a bit farther apart and slide past each other, so the liquid flows and takes the shape of its container. Score 2 = both parts with molecules; 1 = only one part or no molecules; 0 = incorrect.')
  ]
}
);

/* ========== PRACTICE POOL (extra practice when she misses a skill) ========== */
window.POOL = {
  vocab: [
    mc('P-vocab-10', 'vocab', 'The root **script** means "write." A **transcript** is…', ['a written copy of spoken words', 'a kind of map', 'a loud speech', 'a painting'], 'Trans (across) + script (write): spoken words written down.'),
    mc('P-vocab-11', 'vocab', 'The root **dict** means "say." Which word means "a book that tells what words mean"?', ['dictionary', 'diary', 'directory', 'dinosaur'], 'A dictionary tells (says) what words mean.'),
    mc('P-vocab-12', 'vocab', 'Choose a **synonym** (same meaning) for **graphic**.', ['clear and detailed', 'confusing', 'distant', 'expected'], 'A graphic description is clear and vivid.'),
    mc('P-vocab-1', 'vocab', 'The prefix **bi-** means "two." Which word means "having two wheels"?', ['bicycle', 'tricycle', 'unicycle', 'motorcycle'], 'Bi (two) + cycle (wheel) = bicycle.'),
    mc('P-vocab-2', 'vocab', 'The prefix **ab-** means "away from." Which word also uses ab- meaning "away"?', ['absent', 'apple', 'angry', 'around'], 'Absent means away from a place.'),
    mc('P-vocab-3', 'vocab', 'The root **bas** means "low." Which word names the lowest part of a house?', ['basement', 'attic', 'balcony', 'roof'], 'The basement is the low part, under the ground floor.'),
    mc('P-vocab-4', 'vocab', 'The root **port** means "carry." Which word means "easy to carry"?', ['portable', 'potato', 'polite', 'purple'], 'Port (carry) + able = able to be carried.'),
    mc('P-vocab-5', 'vocab', 'The prefix **pre-** means "before." What does **preview** mean?', ['To see something before', 'To see it again', 'To not see it', 'To see far away'], 'Pre (before) + view (see).'),
    mc('P-vocab-6', 'vocab', 'The root **aqua** means "water." Which word fits: "We saw sharks at the ___."', ['aquarium', 'auditorium', 'library', 'gym'], 'An aquarium is a place with water tanks for fish.'),
    mc('P-vocab-7', 'vocab', '**Coruscate** means to sparkle and flash. Which sentence uses it correctly?', ['The diamonds coruscated under the bright lights.', 'The dog coruscated its food.', 'We coruscated to school.', 'The soup coruscated cold.'], 'Diamonds sparkle and flash.'),
    mc('P-vocab-8', 'vocab', '**Bifurcate** means to split into two parts. Which is an example?', ['A road splits into two paths', 'A road is very long', 'A road has potholes', 'A road is paved'], 'Bi (two) + furca (fork): splitting into two like a fork.'),
    mc('P-vocab-9', 'vocab', '**Abasement** means being lowered in rank or position. Which is an example?', ['A team captain is moved back to a regular player', 'A student wins a prize', 'A girl climbs a tall tree', 'A boy moves to a new house'], 'Being moved to a lower position is an abasement.')
  ],
  context: [
    mc('P-context-1', 'context', '"Leo was **baffled** by the tricky riddle; he had no idea what the answer could be." Baffled means…', ['Confused', 'Excited', 'Sleepy', 'Proud'], 'Clue: "he had no idea." That means confused.'),
    mc('P-context-2', 'context', '"The **voracious** shark gobbled up fish after fish." Voracious means…', ['Extremely hungry', 'Very small', 'Gentle', 'Slow'], 'Clue: "gobbled up fish after fish."'),
    mc('P-context-3', 'context', '"After the long race, Sam was **famished** and ate three sandwiches." Famished means…', ['Very hungry', 'Very cold', 'Very happy', 'Very lost'], 'Clue: "ate three sandwiches."'),
    mc('P-context-4', 'context', '"The **fragile** vase broke when it was barely touched." Fragile means…', ['Easily broken', 'Very heavy', 'Expensive', 'Colorful'], 'Clue: "broke when barely touched."'),
    mc('P-context-5', 'context', '"Mia was **reluctant** to jump into the cold pool, so she stood at the edge for ten minutes." Reluctant means…', ['Not wanting to do something', 'Eager', 'Angry', 'Tired'], 'Clue: she waited at the edge for ten minutes.'),
    mc('P-context-6', 'context', '"The **relentless** rain fell for five days without stopping." Relentless means…', ['Never stopping', 'Gentle', 'Warm', 'Quick'], 'Clue: "without stopping."')
  ],
  figurative: [
    mc('P-fig-1', 'figurative', '"Her smile was as bright as the sun." This is a…', ['Simile', 'Metaphor', 'Personification', 'Idiom'], 'It uses "as" to compare. Simile!'),
    mc('P-fig-2', 'figurative', '"Time is a thief." This is a…', ['Metaphor', 'Simile', 'Personification', 'Idiom'], 'It says time IS a thief, with no "like" or "as." Metaphor!'),
    mc('P-fig-3', 'figurative', '"The stars winked at us." This is…', ['Personification', 'Simile', 'Metaphor', 'Idiom'], 'Stars can\'t wink. That\'s a human action.'),
    mc('P-fig-4', 'figurative', '"It\'s raining cats and dogs" means…', ['It\'s raining very hard', 'Animals are falling', 'It\'s a light drizzle', 'It\'s sunny'], 'This idiom means heavy rain.'),
    mc('P-fig-5', 'figurative', 'Saying **"Break a leg!"** before a show means…', ['Good luck', 'Get hurt', 'Run fast', 'Go home'], 'Actors say it to wish good luck.'),
    mc('P-fig-6', 'figurative', 'Which sentence is a **simile**?', ['He ran like the wind.', 'He is a rock.', 'The wind howled.', 'Hold your horses.'], '"Like the wind" compares using "like."'),
    mc('P-fig-7', 'figurative', '"Some spiders are **social butterflies**." What does "social butterfly" mean?', ['Someone who likes being with others', 'A real butterfly', 'Someone who is lonely', 'A colorful insect'], 'A social butterfly is friendly and likes groups.')
  ],
  main_idea: [
    mc('P-main-1', 'main_idea', 'Koalas sleep up to 20 hours a day. Their food, eucalyptus leaves, gives them very little energy, so they rest to save it.\n\nWhat is the main idea?', ['Koalas sleep a lot because their food gives them little energy', 'Koalas live in Australia', 'Eucalyptus is tasty', 'Koalas are lazy pets'], 'Everything in the paragraph explains why koalas sleep so much.'),
    mc('P-main-2', 'main_idea', 'Before GPS, sailors used lighthouses to stay safe at night. The bright lights warned ships about rocks near the shore. Many lighthouses still shine today.\n\nWhat is the main idea?', ['Lighthouses help keep ships safe near the shore', 'GPS is new', 'Sailors like the night', 'Rocks are dangerous'], 'The paragraph is about how lighthouses keep ships safe.'),
    mc('P-main-3', 'main_idea', 'Tom practiced his free throws every day for a month. At first he missed most shots, but by the end he made eight out of ten.\n\nWhat is the theme?', ['Practice helps you improve', 'Basketball is easy', 'Tom is very tall', 'Free throws are boring'], 'He got better because he practiced.'),
    mc('P-main-4', 'main_idea', 'Earthworms dig tunnels that let air and water into soil. They also eat dead leaves and turn them into nutrients for plants.\n\nWhat is the main idea?', ['Earthworms help keep soil healthy', 'Worms are slimy', 'Gardeners dig tunnels', 'Leaves fall in autumn'], 'Both sentences show how worms help soil.'),
    mc('P-main-5', 'main_idea', 'Ana didn\'t want to share her crayons with the new girl, Bea. Later, Ana forgot her lunch, and Bea shared her sandwich. The next day, Ana shared her crayons.\n\nWhat is the theme?', ['Kindness is often returned', 'Sandwiches are better than crayons', 'New students should bring lunch', 'Never forget your lunch'], 'Bea was kind, and Ana learned to be kind back.')
  ],
  evidence: [
    mc('P-evid-1', 'evidence', 'Claim: **Octopuses are clever.** Which detail supports this best?', ['They can open jars to get food', 'They live in the ocean', 'They have eight arms', 'They are soft'], 'Opening jars shows problem-solving.'),
    mc('P-evid-2', 'evidence', 'Claim: **Bees are important to farmers.** Which detail supports this best?', ['Bees pollinate crops like apples and almonds', 'Bees can sting', 'Bees are yellow and black', 'Bees live in hives'], 'Pollination helps crops grow.'),
    mc('P-evid-3', 'evidence', 'Claim: **Mangrove roots protect young fish.** Which detail supports this best?', ['Big fish can\'t fit between the tangled roots', 'Mangroves grow in salty water', 'Mangroves are trees', 'Some fish are silver'], 'If big fish can\'t get in, small fish are safe.'),
    mc('P-evid-4', 'evidence', 'Claim: **Making candy canes is hard work.** Which detail supports this best?', ['A cook needs about two years to learn the whole process', 'Candy canes are striped', 'People eat them in December', 'They come in many flavors'], 'Needing two years to learn shows it is hard.'),
    mc('P-evid-5', 'evidence', 'Claim: **Spiders are not very dangerous to people.** Which detail supports this best?', ['Less than 1 out of 100 kinds of spiders is a threat to people', 'Spiders have eight legs', 'Spiders spin webs', 'Some spiders dance'], 'This fact shows very few spiders can hurt people.')
  ],
  inference: [
    mc('P-inf-1', 'inference', 'Jake grabbed his umbrella and rain boots before leaving. What can you infer?', ['It is raining or might rain', 'It is sunny', 'He is going swimming', 'He lost his shoes'], 'Umbrella + rain boots = rain.'),
    mc('P-inf-2', 'inference', 'Ms. Lee\'s eyes were red, and she kept yawning during class. What can you infer?', ['She is tired', 'She is excited', 'She is hungry', 'She is angry'], 'Yawning is a clue for tired.'),
    mc('P-inf-3', 'inference', 'The crowd jumped to its feet and roared as the ball flew over the fence. What happened?', ['Someone hit a home run', 'The game was canceled', 'It started raining', 'The crowd was bored'], 'A ball over the fence + cheering = home run.'),
    mc('P-inf-4', 'inference', 'Lily\'s hands shook as she walked onto the stage holding her violin. How does Lily feel?', ['Nervous', 'Cold', 'Sleepy', 'Bored'], 'Shaking hands before a performance shows nerves.'),
    mc('P-inf-5', 'inference', 'The plant on the windowsill was brown and droopy, and the soil was cracked. What can you infer?', ['It hasn\'t been watered', 'It gets too much water', 'It is brand new', 'It is a fake plant'], 'Cracked, dry soil means no water.')
  ],
  science: [
    mc('P-sci-7', 'science', 'In which state of matter are the molecules packed the most tightly?', ['Solid', 'Liquid', 'Gas', 'They are all the same'], 'Solid molecules are packed tight and only vibrate.'),
    mc('P-sci-8', 'science', 'What happens when liquid water is heated a lot?', ['It evaporates into a gas (steam)', 'It freezes into ice', 'It becomes a solid rock', 'Nothing happens'], 'Heat gives molecules energy to escape as gas.'),
    mc('P-sci-9', 'science', 'Which one takes the shape of its container but does NOT fill it completely?', ['A liquid', 'A solid', 'A gas', 'Ice'], 'Gases fill the whole container; liquids take its shape at the bottom.'),
    mc('P-sci-1', 'science', 'Which of these is a **producer**?', ['Grass', 'Deer', 'Lion', 'Mushroom'], 'Producers make their own food from sunlight.'),
    mc('P-sci-2', 'science', 'A deer eats only plants. In a food chain it is a…', ['Primary consumer', 'Producer', 'Decomposer', 'Tertiary consumer'], 'Plant-eaters are primary consumers.'),
    mc('P-sci-3', 'science', 'What is the main source of energy for almost every ecosystem?', ['The sun', 'The soil', 'Water', 'Wind'], 'Plants use sunlight to make food, and energy flows from there.'),
    mc('P-sci-4', 'science', 'What do **decomposers** do?', ['Break down dead things and return nutrients to the soil', 'Make food from sunlight', 'Hunt other animals', 'Eat only plants'], 'Bacteria and fungi are decomposers.'),
    mc('P-sci-5', 'science', 'In the chain grass → grasshopper → frog → snake, the frog is a…', ['Secondary consumer', 'Producer', 'Primary consumer', 'Decomposer'], 'The frog eats a primary consumer (the grasshopper).'),
    mc('P-sci-6', 'science', 'Is sunlight **biotic** or **abiotic**?', ['Abiotic (non-living)', 'Biotic (living)'], 'Sunlight is not alive, so it is abiotic.')
  ],
  volume: [
    num('P-vol-1', 'volume', 'How many unit cubes make this prism?', '12', '3 × 2 × 2 = 12.', { figure: box(3, 2, 2, 'units', true, false) }),
    num('P-vol-2', 'volume', 'A cube has sides of 5 inches. What is its volume in cubic inches?', '125', '5 × 5 × 5 = 125.'),
    num('P-vol-3', 'volume', 'A prism has a base area of 20 square cm and a height of 4 cm. What is its volume in cubic cm?', '80', 'Base area × height = 20 × 4 = 80.'),
    num('P-vol-4', 'volume', 'What is the volume of this box?', '48', '6 × 2 × 4 = 48 cubic units.', { figure: box(6, 2, 4) }),
    num('P-vol-5', 'volume', 'Figure A and Figure B are joined. What is the total volume?', '36', 'A: 2 × 2 × 3 = 12. B: 4 × 2 × 3 = 24. Total 36.', { figure: two(box(2, 2, 3), box(4, 2, 3)) }),
    num('P-vol-6', 'volume', 'A box has a volume of 40 cubic units. It is 5 units long and 2 units wide. How tall is it?', '4', '5 × 2 = 10. Then 40 ÷ 10 = 4.'),
    num('P-vol-7', 'volume', 'Each layer of a box holds 8 cubes. There are 6 layers. How many cubes in all?', '48', '8 × 6 = 48.')
  ],
  expressions: [
    num('P-exp-1', 'expressions', 'What is the value of **5 + 4 × 3**?', '17', 'Multiply first: 4 × 3 = 12. Then 5 + 12 = 17.'),
    num('P-exp-2', 'expressions', 'What is the value of **(5 + 4) × 3**?', '27', 'Parentheses first: 5 + 4 = 9. Then 9 × 3 = 27.'),
    num('P-exp-3', 'expressions', 'What is the value of **36 ÷ (2 + 4)**?', '6', '2 + 4 = 6. Then 36 ÷ 6 = 6.'),
    num('P-exp-4', 'expressions', 'What is the value of **20 − 2 × 5 + 1**?', '11', 'Multiply: 2 × 5 = 10. Then left to right: 20 − 10 = 10, 10 + 1 = 11.'),
    mc('P-exp-5', 'expressions', 'Which expression means **"double the sum of 7 and 3"**?', ['2 × (7 + 3)', '2 × 7 + 3', '7 + 3 × 2', '(7 × 3) + 2'], '"Sum of 7 and 3" needs parentheses, then multiply by 2.'),
    num('P-exp-6', 'expressions', 'What is the value of **3 × [12 − (4 + 2)]**?', '18', '4 + 2 = 6. 12 − 6 = 6. 3 × 6 = 18.'),
    num('P-exp-7', 'expressions', 'What is the value of **(10 − 5 + 7) × 3 + 4**?', '40', 'Parentheses: 10 − 5 + 7 = 12. Then 12 × 3 = 36. Then 36 + 4 = 40.')
  ],
  fractions: [
    num('P-frac-1', 'fractions', 'Write **3 ÷ 5** as a fraction.', ['3/5', '0.6'], '3 ÷ 5 = 3/5.'),
    num('P-frac-2', 'fractions', 'What is **1/2 ÷ 4**?', ['1/8', '0.125'], 'Splitting a half into 4 parts gives eighths.'),
    num('P-frac-3', 'fractions', 'What is **4 ÷ 1/3**? (How many thirds are in 4?)', '12', 'Each whole has 3 thirds: 4 × 3 = 12.'),
    num('P-frac-4', 'fractions', 'What is **7 ÷ 2**? Write a mixed number.', ['3 1/2', '7/2', '3.5'], '7 ÷ 2 = 3 with 1 left over: 3 1/2.'),
    num('P-frac-5', 'fractions', 'What is **1/3 of 12**?', '4', '12 ÷ 3 = 4.'),
    mc('P-frac-6', 'fractions', '5 friends share 2 cakes equally. How much does each friend get?', ['2/5 of a cake', '5/2 of a cake', '1/5 of a cake', '1/2 of a cake'], '2 ÷ 5 = 2/5.'),
    num('P-frac-7', 'fractions', 'What is **1/5 ÷ 2**?', ['1/10', '0.1'], 'Half of one fifth is one tenth.')
  ]
};

/* "Why?" extras: why a wrong choice is wrong, and notes when school teaches it a certain way */
window.WHY = Object.assign(window.WHY || {}, {
  'P-sci-3': { school: 'At school (5th grade) the answer is: the Sun ☀️.', wrong: {
    'Water': 'Every living thing NEEDS water — you\'re right about that! But water doesn\'t GIVE energy. Plants use sunlight to make food, and that energy moves up the food web.',
    'The soil': 'Soil gives plants nutrients and a place to grow, but the ENERGY to make food comes from sunlight.',
    'Wind': 'Wind can spread seeds and move air, but living things don\'t get their food energy from wind.' },
    fun: 'Fun fact for later: deep in the ocean, a few ecosystems get energy from chemicals instead of the Sun — that\'s why it says "almost". You\'ll meet them in the Deep Sea lesson! 🌊' },
  'FW2-6': { wrong: {}, school: 'Order: the leaf falls → decomposers break it down → nutrients go into the soil → a plant uses them.' }
});
