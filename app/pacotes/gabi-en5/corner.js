/* =========================================================
   Learning Quest — 📚 READING CORNER
   One short extra reading per lesson day (in order), with 3 questions.
   Original texts written for Gabi (5th grade). Facts checked.
   ========================================================= */
window.CORNERS = [];
function corner(id, icon, genre, title, text, questions) {
  window.CORNERS.push({ id, icon, genre, title, kind: 'corner', passage: { title, text }, questions });
}

corner('RC01', '🐝', 'Science', 'How Honeybees Give Directions', `Imagine you found the best snack in the world, but you couldn't talk. How would you tell your friends where it is? Honeybees solve this problem every day — with a **dance**.

When a worker bee finds a field full of flowers, she flies back to the hive and performs the [[waggle dance|a dance honeybees do to show other bees where food is]]. She runs in a straight line while wiggling her body, then loops around and does it again, over and over.

The dance is a map. The **direction** of the straight run tells the other bees which way to fly, compared to the position of the sun. The **length** of the waggle tells them how far away the flowers are: the longer she waggles, the farther they must fly.

The other bees crowd around her in the dark hive, feeling her movements with their [[antennae|the two feelers on an insect's head]]. They also smell the flowers on her body, so they know what to look for. Then they zoom off — and they usually find the right spot!

A scientist named **Karl von Frisch** spent years studying this dance. In 1973 he won a Nobel Prize for discovering how bees communicate.

So next time you see a bee on a flower, remember: she might be a dancer with a secret map to share.`, [
  mc('RC01-1', 'main_idea', 'What is this text mostly about?', ['How honeybees use a dance to show where food is', 'How to make honey at home', 'Why bees sting people', 'How flowers grow'], 'The whole text explains the waggle dance as a "map".'),
  mc('RC01-2', 'evidence', 'What does the LENGTH of the waggle tell the other bees?', ['How far away the flowers are', 'What color the flowers are', 'How many bees should go', 'What time it is'], '"The longer she waggles, the farther they must fly."'),
  mc('RC01-3', 'inference', 'Why do the other bees need to FEEL the dance instead of watching it?', ['It is dark inside the hive', 'Bees have no eyes', 'The dance is too fast', 'They are sleeping'], 'The text says they crowd around her "in the dark hive".')
]);

corner('RC02', '✈️', 'History · North Carolina', 'Twelve Seconds at Kitty Hawk', `On a cold, windy morning — **December 17, 1903** — two brothers from Ohio stood on the sand dunes near **Kitty Hawk, North Carolina**. Their names were **Orville and Wilbur Wright**, and they owned a bicycle shop.

Why North Carolina? The brothers had studied weather reports. The Outer Banks had **steady, strong winds** to help lift a glider, and **soft sand** for safer landings. It was also quiet, far from curious crowds.

For years they had tested kites and gliders. They learned that a flying machine needed three things: wings to lift it, an engine to push it, and a way to **control** it in the air. Their big idea was "wing warping" — twisting the wings to turn and balance, the way birds tilt their wings.

At 10:35 a.m., Orville lay on the lower wing of the *Flyer*. The engine rattled, the machine slid along a wooden rail, and then it lifted off the ground. The flight lasted only **12 seconds** and went about **120 feet** — a little longer than a basketball court! But it was the first powered, controlled airplane flight in history.

They flew three more times that day. On the last flight, Wilbur stayed in the air for 59 seconds and traveled 852 feet.

Today, North Carolina license plates say **"First in Flight."** Not bad for two bicycle makers who never gave up.`, [
  mc('RC02-1', 'evidence', 'Why did the Wright brothers choose Kitty Hawk?', ['It had strong steady winds and soft sand', 'It was near their bicycle shop', 'It had a big airport', 'It never had wind'], 'Wind helped lift the plane, and sand made landings safer.'),
  mc('RC02-2', 'inference', 'What does "First in Flight" on NC license plates mean?', ['The first powered airplane flight happened in North Carolina', 'North Carolina has the most airplanes', 'Birds were born in NC', 'NC built the first rocket'], 'The 1903 flight at Kitty Hawk was the first powered, controlled flight.'),
  mc('RC02-3', 'context', 'The brothers needed a way to **control** the plane. Here, "control" means…', ['to steer and balance it', 'to paint it', 'to sell it', 'to make it heavier'], 'Wing warping let them turn and balance — that\'s control.')
]);

corner('RC03', '🍁', 'Science', 'The Secret Colors in a Leaf', `Every fall, the trees in Charlotte change from green to bright red, orange and yellow. It looks like someone painted them overnight. But here's a surprise: many of those colors were **hiding in the leaves all summer long**.

Leaves are green because of [[chlorophyll|the green material plants use to make food from sunlight]]. During spring and summer, leaves make lots of chlorophyll to capture sunlight and make food for the tree. There is so much green that it covers up other colors.

When fall arrives, the days get shorter and cooler. The tree starts getting ready for winter, so it **stops making chlorophyll**. As the green fades away, the yellow and orange colors that were there all along finally show up.

Reds and purples are different. Some trees, like many maples, actually **make** new red colors in the fall, especially when the days are sunny and the nights are cool. That's why some autumns are brighter than others!

Finally, the tree seals off each leaf where it attaches to the branch. The leaf dries out and falls. Without leaves, the tree loses less water in winter and rests until spring, when new green leaves grow again.

So when you crunch through a pile of leaves, you're walking on a little science magic trick.`, [
  mc('RC03-1', 'evidence', 'Why do yellow and orange colors appear in the fall?', ['The green chlorophyll fades and uncovers them', 'Rain paints the leaves', 'Leaves get sick', 'Squirrels eat the green part'], 'The yellows and oranges were hiding under the green.'),
  mc('RC03-2', 'inference', 'Why might one autumn be MORE colorful than another?', ['Sunny days and cool nights help trees make more red', 'There are more squirrels', 'Leaves are bigger', 'It snows earlier'], 'Reds are made in the fall, especially with sunny days and cool nights.'),
  mc('RC03-3', 'main_idea', 'Which sentence best states the main idea?', ['Leaves change color because trees stop making green chlorophyll in the fall', 'Maple trees are the best trees', 'Leaves fall because of wind', 'Trees sleep all year'], 'That\'s the big idea; the rest are details.')
]);

corner('RC04', '🚀', 'Biography', 'The Woman Who Counted to the Moon', `When **Katherine Johnson** was a little girl in West Virginia, she counted everything: the steps to church, the dishes she washed, the stars in the sky. She loved numbers so much that she finished high school at just **14 years old**.

In 1953, Katherine got a job at the agency that later became **NASA**. Back then, the word "computer" meant a **person** who did hard math by hand. Katherine was one of these human computers. At that time she faced unfair rules: as a Black woman, she was often kept separate from other workers. But her math was so accurate that the engineers kept asking for her help.

Katherine calculated the [[trajectory|the curved path an object follows as it moves through the air or space]] for **Alan Shepard**, the first American in space, in 1961. When **John Glenn** prepared to orbit Earth in 1962, NASA used new electronic computers — but Glenn didn't fully trust them yet. He asked for Katherine to check the numbers by hand. "If she says they're good," he said, "then I'm ready to go."

Her work also helped the **Apollo 11** mission land on the Moon in 1969.

In 2015, Katherine Johnson received the **Presidential Medal of Freedom**, one of the highest honors in the United States. Her story shows that curiosity, hard work and courage can help someone reach the stars — even when others try to hold them back.`, [
  mc('RC04-1', 'context', 'Back then, a "computer" was…', ['a person who did hard math by hand', 'a machine with a screen', 'a type of rocket', 'a calculator app'], 'The text says the word meant a person.'),
  mc('RC04-2', 'evidence', 'Why did John Glenn ask for Katherine to check the numbers?', ['He trusted her math more than the new machines', 'She was the pilot', 'The machines were broken forever', 'She built the rocket'], '"If she says they\'re good, then I\'m ready to go."'),
  mc('RC04-3', 'inference', 'Which word best describes Katherine Johnson?', ['determined', 'lazy', 'careless', 'afraid of numbers'], 'She kept working with great accuracy even when rules were unfair.')
]);

corner('RC05', '🍋', 'Realistic Fiction', 'The Lemonade Stand Lesson', `Mia and her cousin Leo set up a lemonade stand on a hot Saturday. They spent **$12** at the store: lemons, sugar, cups and ice. They decided to sell each cup for **$1**.

By noon, they had sold 10 cups. Leo counted the money and jumped up. "We made ten dollars! We're rich!"

Mia frowned and pulled out her notebook. "Wait. We spent twelve dollars. If we only made ten, we actually **lost** two dollars."

Leo stopped jumping. "So we're… poor?"

"Not yet," Mia said. "Money you make is called **revenue**. But [[profit|the money left over after you pay your costs]] is what's left after paying for everything. Right now our profit is negative two dollars."

They thought hard. Leo had an idea: "What if we sell cookies too? Grandma's recipe!" Mia had another: "And let's move to the park. More people walk by there."

That afternoon, they sold 18 more cups of lemonade and 10 cookies for 50 cents each. Their supplies were already paid for, so almost all of the new money was profit.

At the end of the day, Mia did the math again: $10 + $18 + $5 = **$33** in revenue. Minus the $12 they spent… "**$21 profit!**" she announced.

Leo grinned. "Okay, NOW we're rich."

"Now," said Mia, "we're **smart**."`, [
  mc('RC05-1', 'context', 'What is **profit**?', ['The money left after paying your costs', 'All the money you collect', 'The price of one cup', 'Money you borrow'], 'Profit = revenue − costs.'),
  num('RC05-2', 'money', 'They made $33 and spent $12. How many dollars of profit did they make?', ['21', '$21', '21 dollars'], '$33 − $12 = $21.'),
  mc('RC05-3', 'inference', 'What lesson does Mia learn — and teach Leo?', ['Making money is not the same as making a profit', 'Lemonade is always expensive', 'Cookies are better than lemonade', 'Never sell anything'], 'At first they collected $10 but had spent $12.')
]);

corner('RC06', '🪴', 'Science · North Carolina', 'The Plant That Eats Bugs', `Most plants get what they need from sunlight, air, water and soil. But one famous plant also eats **insects** — and it grows wild in only one small part of the world: around **Wilmington, North Carolina**, and nearby South Carolina.

It's the **Venus flytrap**. Each trap looks like a little green mouth with "teeth" along the edges. Inside are tiny trigger hairs. If an insect touches **two hairs** quickly, or the same hair twice, the trap snaps shut in less than a second!

Why two touches? It's a clever trick. A raindrop or a falling leaf might touch one hair, but a moving bug will touch more. By waiting for a second touch, the plant doesn't waste energy closing on things that aren't food.

Once the trap closes, it seals tight and makes juices that slowly [[digest|break food down so a living thing can use it]] the insect. This takes about **a week or more**. Then the trap opens again, ready for the next meal.

Why eat bugs at all? Venus flytraps grow in wet, sandy soil that has very few [[nutrients|things living things need to grow and stay healthy]]. Insects give them the extra nutrients the soil is missing. They still use sunlight to make food, like other plants.

Today, Venus flytraps are protected by law in North Carolina. Taking them from the wild is a crime, so the only place to "hunt" one is at a plant store!`, [
  mc('RC06-1', 'evidence', 'Why does the trap wait for TWO touches before closing?', ['So it doesn\'t waste energy on raindrops or leaves', 'Because it is slow', 'To scare birds', 'Because it is sleeping'], 'A moving bug touches more than once; a raindrop usually doesn\'t.'),
  mc('RC06-2', 'inference', 'Why do Venus flytraps need to eat insects?', ['Their soil has very few nutrients', 'They have no leaves', 'They can\'t use sunlight', 'Insects give them water'], 'The sandy soil is missing nutrients that insects provide.'),
  mc('RC06-3', 'evidence', 'Where do Venus flytraps grow in the wild?', ['Only in a small area around Wilmington, NC and nearby SC', 'All over the world', 'In deserts', 'Only in rainforests'], 'They grow wild only in that small area.')
]);

corner('RC07', '🌽', 'History', 'The Harvest of 1621', `Many families celebrate Thanksgiving with turkey and pie. But what really happened at the famous harvest feast in **1621**?

In 1620, a ship called the **Mayflower** carried about 100 English passengers to a place they named **Plymouth**, in what is now Massachusetts. Their first winter was terrible. They arrived in cold weather with little food, and about half of them died.

The land already belonged to the **Wampanoag** people, who had lived there for thousands of years. In the spring, a Patuxet man named **Tisquantum (Squanto)**, who had learned English, helped the colonists. He showed them how to plant corn using fish to [[fertilize|add things to soil to help plants grow]] the soil, and where to fish and gather food.

In the fall of 1621, the colonists had a good harvest and held a celebration. About **90 Wampanoag men**, led by their leader **Massasoit**, joined about **50 colonists**. The celebration lasted **three days**. Historians know they ate **deer** (the Wampanoag brought five), and probably wild birds, corn, and seafood. There were probably no pies — the colonists had no ovens for baking them yet!

The colonists didn't call it "Thanksgiving." It became a national holiday much later, in **1863**, when President Abraham Lincoln declared it.

Historians remind us to remember both sides of this story: the help the Wampanoag gave, and the hard times their people faced in the years that followed.`, [
  mc('RC07-1', 'evidence', 'How do historians know deer was eaten at the 1621 feast?', ['The Wampanoag brought five deer, as written in records', 'There were turkey bones only', 'The Mayflower carried deer', 'It is just a guess'], 'The text says the Wampanoag brought five deer.'),
  mc('RC07-2', 'inference', 'Why were there probably NO pies at the feast?', ['The colonists had no ovens for baking yet', 'Pies were not invented in England', 'Nobody liked pie', 'Corn can\'t be baked'], 'No ovens = no baked pies.'),
  mc('RC07-3', 'evidence', 'When did Thanksgiving become a national holiday?', ['1863, declared by Abraham Lincoln', '1621', '1620', '1776'], 'Much later than the feast!')
]);

corner('RC08', '🏛️', 'Civics', 'How an Idea Becomes a Law', `Have you ever had an idea that could make life better for lots of people? In the United States, ideas can become **laws** — rules everyone must follow. Here's the journey.

**Step 1: The idea.** Anyone can have an idea for a law: a student, a parent, a teacher. But only a member of **Congress** can officially introduce it. A written idea for a law is called a [[bill|a written idea for a new law]].

**Step 2: Committee.** The bill goes to a small group of members called a **committee**. They study it, ask experts questions and make changes. Many bills stop here!

**Step 3: Vote in one house.** Congress has two parts: the **House of Representatives** and the **Senate**. If the committee approves the bill, the whole House (or Senate) debates it and votes. More than half must vote "yes."

**Step 4: Vote in the other house.** Then the bill goes to the other part of Congress and goes through the same steps. Both houses must agree on the exact same words.

**Step 5: The President.** Finally, the bill goes to the **President**. If the President signs it, it becomes a law! If the President says no — a [[veto|when the President refuses to sign a bill]] — Congress can still make it a law if **two-thirds** of both houses vote for it again.

It's a long road. That's on purpose: the people who wrote the Constitution wanted laws to be checked carefully by many people before everyone has to follow them.`, [
  orderQ('RC08-1', 'main_idea', 'Put the steps of a bill in order.', ['A member of Congress introduces the bill', 'A committee studies it', 'One house votes', 'The other house votes', 'The President signs it'], 'Idea → committee → House/Senate → other house → President.'),
  mc('RC08-2', 'context', 'What is a **veto**?', ['When the President refuses to sign a bill', 'A kind of committee', 'The first step of a bill', 'A vote of the Senate'], 'Congress can override it with a two-thirds vote.'),
  mc('RC08-3', 'inference', 'Why did the writers of the Constitution make the road so long?', ['So laws are checked carefully by many people', 'To make Congress tired', 'Because they didn\'t like laws', 'So the President decides everything alone'], 'The last paragraph explains this.')
]);

corner('RC09', '🦋', 'Science', 'The Great Monarch Mystery', `Every fall, millions of **monarch butterflies** do something amazing. Monarchs from the eastern United States and Canada fly south — some as far as **3,000 miles** — to the same mountain forests in **central Mexico**.

Here's the mystery: **none of these butterflies has ever made the trip before**. The monarchs that fly south are the great-great-grandchildren of the ones that flew north in the spring. So how do they know where to go?

Scientists have found some clues. Monarchs use the **sun like a compass**. Inside their antennae is a kind of internal clock that helps them keep track of where the sun should be at different times of day. On cloudy days, they may also sense Earth's [[magnetic field|an invisible force around Earth that makes compasses point north]].

The fall monarchs are special in another way. Summer monarchs live only about two to six weeks. But the ones born at the end of summer can live **up to eight or nine months**! They need that long life to fly to Mexico, rest all winter, and start the trip back in spring.

In Mexico, they cluster on fir trees by the thousands, so many that the branches bend. In spring, they head north, lay eggs on **milkweed** — the only plant monarch caterpillars eat — and a new generation continues the journey.

Monarch numbers have dropped in recent years, partly because there's less milkweed. Planting milkweed in a garden is a small way to help these tiny travelers.`, [
  mc('RC09-1', 'evidence', 'What is the "mystery" of the monarch migration?', ['The butterflies have never made the trip before, yet they find the way', 'Nobody knows what they eat', 'They only fly at night', 'They are too heavy to fly'], 'They are the great-great-grandchildren of the spring travelers.'),
  mc('RC09-2', 'evidence', 'Why can monarch caterpillars only grow where there is milkweed?', ['Milkweed is the only plant they eat', 'Milkweed is warm', 'Milkweed points to Mexico', 'Milkweed hides them from snow'], '"Milkweed — the only plant monarch caterpillars eat."'),
  mc('RC09-3', 'inference', 'Why do the fall monarchs need to live much longer than summer monarchs?', ['They must fly to Mexico, rest all winter and start back in spring', 'They are bigger', 'They eat more', 'They don\'t lay eggs'], 'Their long trip and winter rest take months.')
]);

corner('RC10', '🕯️', 'Realistic Fiction', 'The Night the Lights Went Out', `The thunder boomed so loud that the windows rattled. Then — **click** — every light in the house went dark.

"Mom!" called Sofia. Her little brother Theo grabbed her arm. "Is it a monster?"

"It's just a power outage," Mom said calmly, turning on a flashlight. "The storm knocked out the electricity. Let's make an outage plan."

Sofia liked plans. She grabbed a notebook and wrote, by flashlight:
1. Keep the fridge **closed** so the food stays cold.
2. Use flashlights, **not candles**, so nothing catches fire.
3. Unplug the TV and computer.

"Why unplug things if there's no power?" Theo asked.

"When the power comes back, there can be a [[surge|a sudden burst of extra electricity]]," Mom explained. "It can damage electronics."

Then Mom said, "Now for the best part of an outage." She spread blankets on the living room floor and set up the flashlights to make a "campfire." Sofia invented a game: each person told one sentence of a story, and the next person continued it. Theo's sentences were all about a dragon who was afraid of the dark. By the end, the dragon had built himself a night-light out of fireflies.

When the lights flickered back on two hours later, Theo groaned. "Can we turn them off again? Just for the story?"

Sofia smiled. The storm had taken the electricity, but it had given them something better.`, [
  mc('RC10-1', 'context', 'A power **surge** is…', ['a sudden burst of extra electricity', 'a storm cloud', 'a kind of flashlight', 'a dragon story'], 'Mom explains it when they unplug the TV.'),
  mc('RC10-2', 'inference', 'Why does the story say the storm "had given them something better"?', ['The family had fun spending time together telling a story', 'They got new electronics', 'The storm made the house bigger', 'They found real fireflies'], 'The outage became family time.'),
  mc('RC10-3', 'evidence', 'Why should you keep the fridge closed during an outage?', ['So the food stays cold longer', 'So the monster can\'t get in', 'To save the flashlight', 'Because it is locked'], 'It\'s step 1 of their plan.')
]);

corner('RC11', '🌋', 'Earth Science', 'Islands Made of Fire', `The **Hawaiian Islands** are some of the most beautiful places on Earth. But millions of years ago, they didn't exist at all. Every one of them was built by **volcanoes**.

Deep under the Pacific Ocean, there is a [[hot spot|a place where melted rock from deep inside Earth rises up]]. Melted rock, called **magma**, pushes up through the ocean floor and erupts. When it comes out, it's called **lava**. The lava cools in the water and hardens into rock. Eruption after eruption, layer after layer, the pile grows taller — until finally, after a very long time, it rises above the ocean as an island!

Here's the clever part. The hot spot stays in one place, but the ocean floor above it slowly moves — only a few inches a year, about as fast as your fingernails grow. Over millions of years, each new island is carried away from the hot spot, and a new volcano starts to form. That's why the Hawaiian Islands sit in a **line**.

The oldest big islands are in the northwest, like Kauai. The youngest is the **Big Island** of Hawaii, where volcanoes like **Kilauea** still erupt today. And under the sea to the southeast, a new underwater volcano named **Kamaʻehuakanaloa** (once called Loihi) is growing. Scientists think it might rise above the ocean someday — but not for thousands of years.

So when people say Hawaii is "still under construction," they're right!`, [
  mc('RC11-1', 'evidence', 'What is the difference between magma and lava?', ['Magma is melted rock underground; lava is melted rock that comes out', 'They are two kinds of islands', 'Lava is cold; magma is hot', 'Magma is water'], 'The text explains it in the second paragraph.'),
  mc('RC11-2', 'inference', 'Why are the Hawaiian Islands in a line?', ['The ocean floor slowly moves over a hot spot that stays still', 'People built them that way', 'Waves pushed them into a line', 'Volcanoes walk'], 'Each island is carried away as a new one forms.'),
  mc('RC11-3', 'evidence', 'Which island is the youngest?', ['The Big Island of Hawaii', 'Kauai', 'Kamaʻehuakanaloa is already the biggest island', 'They are all the same age'], 'The underwater volcano is not an island yet.')
]);

corner('RC12', '✍️', 'History · Biography', 'Sequoyah\'s Gift of Writing', `In the early 1800s, the **Cherokee** people lived in the mountains of what is now North Carolina, Georgia, Tennessee and nearby states. They spoke the Cherokee language, but there was no way to **write** it.

A Cherokee man named **Sequoyah** noticed something. White settlers made marks on paper — "talking leaves," some people called them — and those marks could carry words across miles and years. Sequoyah thought: *Why can't the Cherokee do that too?*

Sequoyah could not read or write English. Still, he spent about **twelve years** working on his idea. At first he tried making one picture for every word, but there were far too many words. Then he had a better idea: make one symbol for each **syllable** — each small sound unit in a word. He finished a writing system of **86 symbols** (today 85 are used), called a [[syllabary|a set of written symbols where each one stands for a syllable]].

Many people doubted him. So Sequoyah taught his young daughter, **Ayoka**, to read it. In a famous test, he wrote messages that she read aloud correctly while he was out of the room.

Around **1821**, the Cherokee Nation accepted the syllabary. Because each symbol matched a sound people already knew, many Cherokee learned to read in just weeks! Soon there was even a Cherokee newspaper, the *Cherokee Phoenix*, first printed in 1828.

Today, the Cherokee syllabary is still taught and used — a gift that keeps a language alive.`, [
  mc('RC12-1', 'context', 'A **syllabary** is a writing system where each symbol stands for…', ['a syllable (a small sound unit)', 'a whole sentence', 'a number', 'a picture of an animal'], 'Sequoyah made one symbol for each syllable.'),
  mc('RC12-2', 'inference', 'Why could many Cherokee learn to read in just weeks?', ['Each symbol matched a sound they already knew', 'They already read English', 'The newspaper taught them', 'There were only 5 symbols'], 'Sounds they already spoke = fast learning.'),
  mc('RC12-3', 'evidence', 'How did Sequoyah prove his system worked?', ['His daughter Ayoka read his messages aloud correctly', 'He wrote a song', 'He drew a map', 'He printed a book first'], 'The famous test with Ayoka.')
]);

corner('RC13', '♻️', 'Science', 'The Journey of a Plastic Bottle', `You finish a bottle of water and toss it in the blue recycling bin. Then what? Let's follow its journey.

First, a truck takes the bottle to a [[recycling center|a place where used materials are sorted so they can be made into new things]]. There, machines and workers sort everything: paper here, cans there, plastic over there. Magnets pull out steel cans. Some machines even use special light to tell different plastics apart!

Next, the plastic bottles are washed and chopped into tiny flakes. The flakes are melted and turned into little pellets. Those pellets can become brand-new things: new bottles, carpet, park benches, and even **fleece jackets**. It takes about two dozen bottles to make one fleece jacket!

But recycling only works if people do it right. If a bottle still has juice in it, or if trash is mixed in, it can mess up a whole batch. That's why it's important to **empty and rinse** containers before recycling them.

And here's an important fact: recycling is good, but it's not the best choice. Scientists like to say **"Reduce, Reuse, Recycle"** — in that order. **Reducing** means using less in the first place, like carrying a refillable water bottle. **Reusing** means using something again, like turning a jar into a pencil holder. Recycling comes last because it still takes energy and water to do.

Plastic that ends up in nature can last for hundreds of years. So every bottle you don't use is a small win for the planet.`, [
  orderQ('RC13-1', 'main_idea', 'Put the bottle\'s recycling journey in order.', ['Toss it in the recycling bin', 'It is sorted at the recycling center', 'It is washed and chopped into flakes', 'Flakes are melted into pellets', 'Pellets become new things'], 'Bin → sorting → flakes → pellets → new products.'),
  mc('RC13-2', 'inference', 'Why is "reduce" listed BEFORE "recycle"?', ['Using less in the first place saves the most energy and water', 'Recycling is against the rules', 'Reduce is easier to spell', 'Recycling makes more plastic'], 'Recycling still uses energy and water.'),
  mc('RC13-3', 'evidence', 'Why should you rinse a bottle before recycling it?', ['Leftover juice or trash can mess up a whole batch', 'So it looks nice', 'So it weighs more', 'Because the truck is clean'], 'The text says leftovers can ruin a batch.')
]);

corner('RC14', '😴', 'Health Science', 'Your Brain\'s Night Shift', `When you fall asleep, it might seem like your body just switches off. But your brain is actually working hard all night — like a night crew cleaning and organizing a school after everyone goes home.

One of the brain's biggest night jobs is saving **memories**. During the day, you learn new things: spelling words, math tricks, the name of a new friend. While you sleep, your brain replays and stores the important ones, so you remember them later. That's why studying and then sleeping well helps you do better on a test than staying up late.

Sleep also helps your body **grow** and **heal**. Your body releases a growth [[hormone|a chemical messenger that tells parts of your body what to do]] mostly during deep sleep. Muscles repair, and your immune system gets stronger to fight germs.

Sleep happens in **cycles** that repeat several times a night. One stage is called **REM sleep** (rapid eye movement), when your eyes dart around under your eyelids. Most dreams happen during REM!

How much sleep do kids need? Doctors recommend about **9 to 12 hours** a night for children ages 6 to 12. Without enough sleep, it's harder to pay attention, remember things and stay in a good mood.

Want better sleep? Try going to bed at the same time each night, turning off screens about an hour before bed (their light can trick your brain into thinking it's daytime), and keeping your room dark and cool.

So tonight, when you go to bed, remember: you're not wasting time. You're letting your brain do its night shift!`, [
  mc('RC14-1', 'evidence', 'What does the brain do with memories during sleep?', ['It replays and stores the important ones', 'It deletes all of them', 'It turns them into dreams only', 'Nothing at all'], 'Sleep helps save what you learned.'),
  mc('RC14-2', 'evidence', 'How much sleep do doctors recommend for kids ages 6 to 12?', ['About 9 to 12 hours', 'About 4 hours', 'About 6 hours', 'About 15 hours'], 'The text gives 9–12 hours.'),
  mc('RC14-3', 'inference', 'Why can screens before bed make it harder to sleep?', ['Their light can trick the brain into thinking it is daytime', 'Screens are too loud', 'They make the room colder', 'They use up your memories'], 'Light signals "daytime" to the brain.')
]);

corner('RC15', '⭐', 'Biography', 'Harriet Tubman: Following the North Star', `**Harriet Tubman** was born into slavery in Maryland around **1822**. As a child, she was forced to work long, hard days. But she grew up strong, brave and determined to be free.

In **1849**, Harriet escaped. She traveled at night, walking about 90 miles north to Pennsylvania, where slavery was not allowed. She followed the **North Star** to know which way was north. Along the way, people who were part of the [[Underground Railroad|a secret network of people and safe houses that helped enslaved people escape to freedom]] helped her hide. It wasn't a real railroad — it was a network of brave people, both Black and white, who risked their safety to help.

Harriet could have stayed safe. Instead, she went back — again and again. Over about ten years, she made about **13 trips** and guided around **70 people** to freedom, including members of her own family. She also gave instructions that helped many others escape. People called her **"Moses."** She later said she "never lost a passenger."

During the **Civil War**, Harriet worked as a nurse, a cook and even a scout and spy for the Union Army. In 1863, she helped lead a raid on the Combahee River in South Carolina that freed more than **700** enslaved people.

Harriet Tubman lived until 1913, helping others her whole life. Her courage reminds us that one determined person can change many lives.`, [
  mc('RC15-1', 'context', 'The **Underground Railroad** was…', ['a secret network of people and safe houses helping enslaved people escape', 'a real train under the ground', 'a subway in New York', 'a game for children'], 'It was a network, not a real railroad.'),
  mc('RC15-2', 'inference', 'Why did people call Harriet Tubman "Moses"?', ['She led many people to freedom, like Moses in the old story', 'Moses was her real name', 'She built boats', 'She was a famous singer'], 'She guided people to freedom again and again.'),
  mc('RC15-3', 'evidence', 'How did Harriet know which way was north at night?', ['She followed the North Star', 'She used a phone', 'She asked strangers', 'She followed the river south'], 'The North Star pointed the way.')
]);

corner('RC16', '🐙', 'Science', 'The Ocean\'s Escape Artist', `If there were an award for the cleverest animal in the ocean, the **octopus** might win it.

An octopus has **eight arms** and no bones at all. That means it can squeeze through any hole bigger than its **beak** — the only hard part of its body. Octopuses have escaped from aquarium tanks by sliding through tiny gaps!

Each arm is covered in suckers that can **taste and feel**. In fact, about two-thirds of an octopus's [[neurons|nerve cells that carry messages in the brain and body]] are in its arms, not its head. Each arm can explore on its own while the brain decides the big plan.

Octopuses are masters of **camouflage**. Special skin cells let them change color in less than a second. Some can even change the **texture** of their skin to look bumpy like a rock or wavy like seaweed. The **mimic octopus** can pretend to be other animals, like a lionfish or a sea snake!

If camouflage doesn't work, an octopus can squirt a cloud of **ink** to confuse a predator and jet away by shooting water out of its body.

Scientists have seen octopuses **solve puzzles**, open jars to get food, and even carry coconut shells to use as a portable shelter — a kind of tool use!

Here's one more surprise: an octopus has **three hearts** and **blue blood**. Two hearts pump blood to the gills, and one pumps it to the rest of the body.

Smart, sneaky and strange — the octopus is truly one of a kind.`, [
  mc('RC16-1', 'evidence', 'Why can an octopus squeeze through tiny holes?', ['It has no bones; only its beak is hard', 'It can shrink its brain', 'It is made of water', 'It folds its arms into a box'], 'Any hole bigger than its beak works!'),
  mc('RC16-2', 'main_idea', 'What is the main idea of this text?', ['Octopuses are clever animals with amazing abilities', 'Octopuses are dangerous to people', 'Octopuses live only in aquariums', 'Octopuses eat coconuts'], 'Every paragraph shows a clever ability.'),
  mc('RC16-3', 'evidence', 'How many hearts does an octopus have?', ['Three', 'One', 'Two', 'Eight'], 'Three hearts and blue blood!')
]);

corner('RC17', '🧊', 'History · Inventions', 'The Accidental Popsicle', `Some great inventions happen by accident — and one of the most delicious was invented by an **11-year-old**.

The story goes like this: on a cold night in **1905**, in San Francisco, a boy named **Frank Epperson** mixed powdered soda flavor with water to make a drink. He stirred it with a wooden stick and then… forgot about it. He left the cup outside on the porch overnight.

The temperature dropped very low that night. In the morning, Frank found his drink **frozen solid**, with the stick standing straight up in the middle. He pulled it out, licked it, and realized he had made something great: a frozen treat on a stick!

Frank called it the "Epsicle." For years he made them for friends and neighbors. Then, in **1923**, as a grown-up, he started selling them at an amusement park, and in **1924** he received a [[patent|an official paper from the government that says an invention belongs to the person who created it]] for his "frozen confection." His own kids called it "Pop's 'sicle," and the name **Popsicle** stuck!

Some people wonder if every detail of the story is exactly true, since it was told many years later. But Frank Epperson really did patent the Popsicle.

What can we learn? Curious minds notice surprises. A forgotten cup could have just been a mess. Frank saw an idea. So next time something goes "wrong," look closely — you might be holding the start of a great invention.`, [
  mc('RC17-1', 'context', 'A **patent** is…', ['an official paper saying an invention belongs to its creator', 'a frozen treat', 'a type of stick', 'a store that sells inventions'], 'Frank got a patent in 1924.'),
  mc('RC17-2', 'inference', 'Why does the text say "Some people wonder if every detail is exactly true"?', ['The story was told many years after it happened', 'Frank was lying about the patent', 'Popsicles don\'t freeze', 'There were no sticks in 1905'], 'Old stories can change over time — a good reader notices that.'),
  mc('RC17-3', 'evidence', 'Where did the name "Popsicle" come from?', ['His kids called it "Pop\'s \'sicle"', 'A soda company', 'The sound it makes', 'A popular song'], 'Pop = Dad!')
]);

corner('RC18', '💧', 'Science Story', 'The Incredible Journey of Drip', `Hi! My name is **Drip**, and I'm a drop of water. I'm much older than I look — the water on Earth has been around for billions of years. Let me tell you about my latest trip.

I was floating in the ocean, warm under the sun, when I started to feel light… lighter… until I rose into the air as invisible water vapor. That's called [[evaporation|when water heats up and turns into a gas]].

Up, up I went. The air got colder, and I huddled together with billions of other tiny drops around specks of dust. We turned back into tiny liquid droplets and formed a **cloud**. That's called **condensation**.

We drifted over land for days. More and more drops joined us, until we grew too heavy to float. Then — whoosh! — we fell as rain. That's **precipitation**. (If it's cold enough, we fall as snow, sleet or hail.)

I splashed onto a mountain and rolled downhill into a stream. Some of my friends soaked into the ground to become **groundwater**, and some were sipped up by tree roots. A few even evaporated right off the leaves! But I kept flowing: stream to river, river to lake, lake to river again… until I reached the ocean.

This never-ending trip is called the **water cycle**. It's powered by the **sun**, which heats the water, and by **gravity**, which pulls it back down.

Who knows? The water in your glass today might have once been in a dinosaur's drink. Cheers!`, [
  orderQ('RC18-1', 'science', 'Put Drip\'s trip in order.', ['Evaporation: water turns into vapor', 'Condensation: vapor forms a cloud', 'Precipitation: rain falls', 'Water flows back to the ocean'], 'Evaporation → condensation → precipitation → collection.'),
  mc('RC18-2', 'evidence', 'What two things power the water cycle?', ['The sun and gravity', 'Wind and fish', 'The moon and clouds', 'Trees and rocks'], 'The sun heats; gravity pulls water down.'),
  mc('RC18-3', 'inference', 'Why might the water in your glass have been in a dinosaur\'s drink?', ['Earth\'s water keeps cycling for billions of years', 'Dinosaurs still live in lakes', 'Water is made in factories', 'Glasses are very old'], 'The same water keeps going around and around.')
]);

corner('RC19', '❄️', 'Realistic Fiction', 'The Snow Day Detective', `Snow days in Charlotte are rare, so when Nora woke up and saw white everywhere, she squealed. School was canceled!

But by lunchtime, something strange happened. Her little brother Ben ran in, upset. "Someone stole my snowman's carrot nose!"

Nora grabbed her magnifying glass — the one from her science kit — and put on her detective hat. "Show me the scene of the crime."

Outside, the snowman stood with a sad, noseless face. Nora studied the snow carefully. "Look at these **clues**," she said. Around the snowman were small tracks with four toes in front and little marks like tiny hands. "These aren't human footprints."

The tracks led across the yard to the big oak tree. At the bottom of the tree, Nora found bits of orange. She looked up. On a high branch, a **squirrel** sat munching happily on something crunchy.

"There's our thief!" Nora laughed.

Ben crossed his arms. "That squirrel owes me a carrot."

"Well," said Nora, "in winter, food is hard for animals to find. Squirrels store nuts in the fall, but a fresh carrot is a special treat. I'd call it a [[clue|a piece of information that helps solve a mystery]] to how hungry animals get when it snows."

They gave the snowman a new nose — a pinecone this time — and left a little pile of birdseed and an apple slice by the oak tree.

"Case closed," said Nora. "Detective rule number one: **follow the evidence**."`, [
  mc('RC19-1', 'evidence', 'Which clue showed that the thief was not a person?', ['Small tracks with four toes and tiny hand-like marks', 'A missing hat', 'A broken window', 'Footprints with shoes'], 'Those tracks belong to a small animal.'),
  mc('RC19-2', 'inference', 'Why did they make the new nose out of a pinecone?', ['So the squirrel wouldn\'t eat it', 'Pinecones are orange', 'Carrots are too expensive', 'Ben doesn\'t like carrots'], 'A pinecone isn\'t a tasty snack for a squirrel.'),
  mc('RC19-3', 'main_idea', 'What is Nora\'s "detective rule number one"?', ['Follow the evidence', 'Always blame your brother', 'Never go outside', 'Snowmen need hats'], 'She solved the mystery by following clues.')
]);

corner('RC20', '📅', 'Math · Science', 'Why Do We Have Leap Years?', `Every four years or so, February gets an extra day: **February 29**. This is called a **leap year**. But why does the calendar need an extra day?

It's all about how long Earth takes to travel around the Sun. We say a year has **365 days**, but a trip around the Sun actually takes about **365 and ¼ days** (365.2422 days, to be exact).

That extra quarter of a day doesn't seem like much. But it adds up! After 4 years, ¼ + ¼ + ¼ + ¼ = **1 whole day**. If we ignored it, the calendar would slowly drift away from the seasons. After about 100 years, it would be off by almost a month — and after several hundred years, July could end up feeling like winter in North Carolina!

So, to fix the drift, we add **one extra day every four years**. Years that can be divided evenly by 4 — like 2024 and 2028 — are leap years.

But wait: a year is actually a tiny bit **less** than 365¼ days. Adding a day every 4 years adds slightly too much. So there's a special [[exception|a case where a rule does not apply]]: years ending in **00** (like 1900 or 2100) are **not** leap years — **unless** they can be divided evenly by **400**. That's why the year **2000** was a leap year, but 1900 was not.

People born on February 29 are sometimes called "leaplings." They only get their real birthday every four years — so a leapling who turns 12 has celebrated on February 29 only 3 times!`, [
  mc('RC20-1', 'evidence', 'Why do we need leap years?', ['A trip around the Sun takes about 365¼ days, so the calendar would drift', 'February is too short', 'To give kids a day off', 'Because the Moon changes shape'], 'The extra ¼ day adds up.'),
  num('RC20-2', 'fractions', 'How many quarter days (¼) make 1 whole day?', ['4', 'four'], '¼ + ¼ + ¼ + ¼ = 1.'),
  mc('RC20-3', 'inference', 'Will the year 2100 be a leap year?', ['No — it ends in 00 and can\'t be divided evenly by 400', 'Yes — every 4 years is always a leap year', 'Yes — it ends in 00', 'Nobody knows'], '2100 ÷ 400 is not a whole number, so it is NOT a leap year.')
]);

corner('RC21', '💻', 'Technology', 'Talking to Computers', `Computers are amazing, but here's a secret: they're not actually smart on their own. A computer only does **exactly** what it's told. The instructions we give computers are called **code**, and writing them is called **coding** or **programming**.

Imagine you want a robot to make a peanut butter sandwich. You might say, "Make a sandwich." But the robot won't know what to do! You'd have to give it every step: *Pick up two slices of bread. Open the jar. Pick up the knife. Scoop the peanut butter…* If you forget "open the jar," the robot might stab the lid forever!

A list of exact steps to solve a problem is called an [[algorithm|a set of step-by-step instructions to solve a problem]]. You already use algorithms every day: brushing your teeth, following a recipe or solving a long division problem.

Coders also use **loops** — instructions that repeat. Instead of writing "take a step" 100 times, you can write: *Repeat 100 times: take a step.* And they use **conditionals** — "if this, then that" instructions. For example: *If it's raining, take an umbrella.*

When code doesn't work, coders look for the mistake, called a **bug**. Finding and fixing bugs is called **debugging**. Even expert programmers make lots of bugs — the trick is being patient and checking each step.

Video games, apps, traffic lights and even this Learning Quest app all run on code. Maybe someday, you'll write the code for something amazing!`, [
  mc('RC21-1', 'context', 'An **algorithm** is…', ['a set of step-by-step instructions to solve a problem', 'a kind of robot', 'a computer screen', 'a mistake in code'], 'Recipes and math steps are algorithms too.'),
  mc('RC21-2', 'evidence', '"If it\'s raining, take an umbrella" is an example of a…', ['conditional', 'loop', 'bug', 'robot'], 'If this, then that = conditional.'),
  mc('RC21-3', 'inference', 'Why would the robot "stab the lid forever"?', ['It only does exactly what it\'s told, and "open the jar" was missing', 'It is angry', 'The knife is broken', 'Robots don\'t like peanut butter'], 'Computers follow instructions exactly.')
]);

corner('RC22', '⚾', 'Biography', 'Jackie Robinson Breaks the Barrier', `For many years, Major League Baseball had an unfair, unwritten rule: Black players were not allowed to play. Talented Black athletes played in the **Negro Leagues** instead. That changed on **April 15, 1947**.

On that day, **Jackie Robinson** stepped onto the field for the **Brooklyn Dodgers**. He became the first Black player in the modern major leagues.

Jackie was an amazing athlete. In college at UCLA, he starred in **four sports**: baseball, football, basketball and track. He also served in the U.S. Army during World War II.

The Dodgers' president, **Branch Rickey**, chose Jackie because of his talent — and his strength of character. Rickey warned him that people would insult him and treat him badly. He asked Jackie to have the courage **not** to fight back, at least at first, so no one could use it as an excuse to keep Black players out.

Jackie faced terrible insults, threats and unfair treatment. But he kept his [[composure|calm control of your feelings]] and let his playing do the talking. That first season, he won the **Rookie of the Year** award. In 1949, he was named the league's Most Valuable Player, and in 1962, he entered the **Baseball Hall of Fame**.

Jackie Robinson opened the door for many other players. Today, every year on April 15, **every player in Major League Baseball wears number 42** — Jackie's number — to honor him.`, [
  mc('RC22-1', 'context', 'Jackie kept his **composure**. That means he…', ['stayed calm and in control of his feelings', 'quit the team', 'yelled at everyone', 'changed his number'], 'He let his playing do the talking.'),
  mc('RC22-2', 'inference', 'Why did Branch Rickey ask Jackie not to fight back at first?', ['So no one could use it as an excuse to keep Black players out', 'Because Jackie was weak', 'Because fighting was allowed', 'So he could rest'], 'The text explains Rickey\'s reason.'),
  mc('RC22-3', 'evidence', 'How do MLB players honor Jackie every April 15?', ['Every player wears number 42', 'They don\'t play', 'They wear blue hats', 'They sing a song'], 'Number 42 was Jackie\'s number.')
]);

corner('RC23', '🪸', 'Science', 'The Biggest Thing Built by Tiny Animals', `Off the coast of Australia lies the **Great Barrier Reef**, the largest coral reef system on Earth. It stretches about **1,400 miles** — longer than the drive from Charlotte to Miami and back! It's so big that astronauts can see parts of it from space.

But here's the surprise: the reef was built by tiny animals called **coral polyps**. Each polyp is soft and often smaller than your fingernail. It builds a hard skeleton of limestone around itself. When polyps die, their skeletons stay, and new polyps grow on top. Over thousands of years, billions of polyps built the reef.

Coral polyps have special partners: tiny [[algae|simple plant-like living things that make food from sunlight]] living inside them. The algae use sunlight to make food and share it with the coral. In return, the coral gives the algae a safe home. The algae also give coral many of its beautiful colors.

The reef is home to an incredible number of living things: about **1,500 kinds of fish**, sea turtles, sharks, dolphins and thousands of other species.

But coral reefs are in trouble. When the ocean gets too warm, the stressed coral pushes out its algae. Without them, the coral turns white — this is called **coral bleaching**. If the water stays too warm for too long, the coral can starve and die.

Scientists around the world are working to protect reefs, and people can help by learning about the ocean and reducing pollution.`, [
  mc('RC23-1', 'evidence', 'What built the Great Barrier Reef?', ['Tiny animals called coral polyps', 'Ocean waves', 'Volcanoes', 'People'], 'Billions of polyps over thousands of years.'),
  mc('RC23-2', 'inference', 'Why does coral turn white during bleaching?', ['It pushes out the colorful algae that live inside it', 'It gets covered in snow', 'Fish paint it', 'It grows too old'], 'The algae give coral its color.'),
  mc('RC23-3', 'context', 'The coral and the algae are **partners**. This means they…', ['help each other', 'fight each other', 'never meet', 'eat each other'], 'Food for a home — both win.')
]);

corner('RC24', '🌽', 'Realistic Fiction', 'Lost in the Corn Maze', `"Let's split up!" said Jaden. "Whoever finds the exit first wins!"

Before Maya could answer, he had disappeared into the tall corn. Maya sighed. The corn maze at the fall festival was huge — the map said it covered **five acres**. The stalks were taller than her dad.

She walked left, then right, then left again. Every path looked the same: green walls, dirt floor, blue sky. After ten minutes, she realized she was back at the same scarecrow she'd passed before. She was **lost**.

Maya felt her heart beat faster. Then she took a deep breath and remembered what her grandpa always said: *"When you're lost, stop and think."*

She pulled out the paper map from her pocket. She looked for **landmarks** — things she could see from the map. The scarecrow was marked with a little star. And there, above the corn, she could see the top of the red barn. On the map, the barn was next to the **exit**.

"If the barn is that way," she said, pointing, "then I need to go **east**."

She used another trick her grandpa taught her: keep one hand touching the wall of corn on the same side and keep walking. It's slower, but it stops you from walking in circles.

Fifteen minutes later, Maya stepped out of the maze — right next to the red barn.

Jaden was nowhere in sight. Twenty minutes later, a staff member walked him out, his shoes covered in mud.

"How did you get out so fast?" he asked.

Maya smiled. "I stopped and thought."`, [
  mc('RC24-1', 'context', 'A **landmark** is…', ['something easy to see that helps you know where you are', 'a kind of map', 'a scarecrow costume', 'a corn plant'], 'The barn was Maya\'s landmark.'),
  mc('RC24-2', 'inference', 'What is the theme (lesson) of the story?', ['Staying calm and thinking helps you solve problems', 'Corn mazes are dangerous', 'Always go alone', 'Running is the fastest way'], '"I stopped and thought."'),
  mc('RC24-3', 'evidence', 'How did Maya know which way to go?', ['She matched the barn she could see to the barn on the map', 'She asked Jaden', 'She followed the scarecrow', 'She guessed'], 'The barn was next to the exit on the map.')
]);
