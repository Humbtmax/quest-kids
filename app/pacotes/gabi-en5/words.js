/* =========================================================
   Learning Quest — WORD HUNT word bank
   level 1 = easier ... level 4 = hardest
   root: [word part, meaning] (used by the "Root Detective" format)
   sent: a sentence with ___ where the word goes
   ========================================================= */
function W(w, level, def, syn, sent, root) { return { w, level, def, syn, sent, root }; }

window.WORDS = [
  /* ---- Level 1 ---- */
  W('baffled', 1, 'confused; unable to understand', 'puzzled', 'Leo was ___ by the tricky riddle and had no idea what the answer was.'),
  W('arid', 1, 'very dry, with little or no rain', 'parched', 'Cactuses grow well in ___ deserts where it hardly ever rains.'),
  W('fragile', 1, 'easily broken or damaged', 'delicate', 'Be careful with that glass ornament; it is very ___.'),
  W('famished', 1, 'extremely hungry', 'starving', 'After soccer practice, Ava was so ___ that she ate two sandwiches.'),
  W('lethargic', 1, 'very tired and slow, without energy', 'sluggish', 'The puppy felt ___ after the long hike and slept all afternoon.'),
  W('reluctant', 1, 'not wanting to do something', 'unwilling', 'Max was ___ to jump into the cold pool.'),
  W('voracious', 1, 'very hungry or very eager', 'ravenous', 'The ___ shark gobbled up fish after fish.'),
  W('timid', 1, 'shy and easily frightened', 'shy', 'The ___ kitten hid under the bed when the guests arrived.'),
  W('vivid', 1, 'very bright and clear', 'brilliant', 'The sunset painted the sky in ___ orange and pink.'),
  W('cautious', 1, 'careful to avoid danger or mistakes', 'careful', 'Be ___ when you cross a busy street.'),
  W('drowsy', 1, 'sleepy', 'sleepy', 'The warm car ride made Max feel ___.'),
  W('gleeful', 1, 'full of joy; very happy', 'joyful', 'The kids gave a ___ shout when it started to snow.'),
  W('enormous', 1, 'very, very large', 'huge', 'The blue whale is an ___ animal, bigger than a school bus.'),
  W('ancient', 1, 'very, very old', 'old', 'We saw ___ pottery that was thousands of years old.'),
  W('grumble', 1, 'to complain in a low, unhappy voice', 'complain', 'The old fisherman began to ___ about the rain.'),

  /* ---- Level 2 (school roots) ---- */
  W('calligraphy', 2, 'beautiful, artistic handwriting', 'penmanship', 'The wedding invitations were written in elegant ___.', ['graph', 'write']),
  W('contradict', 2, 'to say the opposite of what someone else said', 'deny', 'Sophie always tries to ___ me, even when I am right.', ['dict', 'say']),
  W('transcript', 2, 'a written copy of words that were spoken', 'record', 'The reporter read the ___ of the president\'s speech.', ['script', 'write']),
  W('autobiography', 2, 'the story of a person\'s life, written by that same person', 'memoir', 'The famous artist wrote an ___ about growing up on a farm.', ['auto', 'self']),
  W('inscription', 2, 'words carved or written on something', 'engraving', 'The ___ on the old ring said, "To love, always."', ['script', 'write']),
  W('dictate', 2, 'to say words out loud for someone else to write down', 'recite', 'Grandpa will ___ his stories, and I will write them down.', ['dict', 'say']),
  W('prescription', 2, 'a doctor\'s written order for medicine', 'remedy', 'The doctor wrote a ___ for medicine to help my flu.', ['script', 'write']),
  W('graphic', 2, 'very clear and detailed', 'vivid', 'The book gave a ___ description of the storm.', ['graph', 'write']),
  W('edict', 2, 'an official order from someone in power', 'decree', 'The king issued an ___ that no one could fish in the royal lake.', ['dict', 'say']),
  W('abasement', 2, 'being lowered in rank or position', 'demotion', 'Moving from the 40th floor to the basement was a real ___ for Benjamin.', ['bas', 'low']),
  W('bifurcate', 2, 'to split or divide into two parts', 'fork', 'The trail will ___ at the big oak tree, so choose left or right.', ['bi', 'two']),
  W('circumnavigate', 2, 'to travel all the way around something', 'circle', 'The sailor wanted to ___ the whole island in one day.', ['circum', 'around']),
  W('subterranean', 2, 'existing or living under the ground', 'underground', 'Moles live in ___ tunnels.', ['terra', 'earth']),
  W('magnanimous', 2, 'generous and forgiving, especially to a rival', 'gracious', 'The ___ champion helped the losing player up and shook her hand.', ['magn', 'great']),
  W('coruscate', 2, 'to sparkle and flash', 'sparkle', 'The diamonds seemed to ___ under the bright lights.'),

  /* ---- Level 3 ---- */
  W('meticulous', 3, 'very careful about every small detail', 'precise', 'Ava was ___ when she measured each ingredient for her experiment.'),
  W('benevolent', 3, 'kind and wanting to do good for others', 'charitable', 'The ___ neighbor shoveled snow for everyone on the street.', ['bene', 'good']),
  W('diligent', 3, 'hard-working and careful', 'industrious', 'A ___ student does her homework carefully every night.'),
  W('resilient', 3, 'able to recover quickly after something hard', 'tough', 'The ___ little plant grew back after the storm.'),
  W('tranquil', 3, 'calm and peaceful', 'serene', 'The lake was ___ early in the morning, with no wind at all.'),
  W('ominous', 3, 'seeming like something bad is about to happen', 'threatening', 'Dark, ___ clouds rolled in over the ocean.'),
  W('frugal', 3, 'careful with money; not wasteful', 'thrifty', 'Being ___, Ava saved most of the money she earned.'),
  W('candid', 3, 'honest and direct', 'frank', 'Please be ___ and tell me what you really think of my drawing.'),
  W('elated', 3, 'extremely happy and excited', 'thrilled', 'Ava was ___ when Sparky finally lit up.'),
  W('exasperated', 3, 'very annoyed and frustrated', 'irritated', 'The teacher was ___ when the class kept talking during the test.'),
  W('feeble', 3, 'very weak', 'frail', 'The ___ baby bird could not fly yet.'),
  W('gregarious', 3, 'liking to be with other people; social', 'sociable', 'Zoe is ___ and makes friends wherever she goes.'),
  W('impartial', 3, 'fair; not taking sides', 'neutral', 'A good referee must be ___ to both teams.'),
  W('novice', 3, 'a beginner; someone new at something', 'beginner', 'As a ___ skater, Cora fell a lot at first.'),
  W('persevere', 3, 'to keep trying even when it is hard', 'persist', 'If you ___, you will finish the puzzle.'),

  /* ---- Level 4 ---- */
  W('ambiguous', 4, 'having more than one possible meaning; unclear', 'unclear', 'The riddle was ___, so everyone guessed something different.'),
  W('cacophony', 4, 'a harsh, loud mix of unpleasant sounds', 'racket', 'The ___ of car horns made it hard to think.', ['phon', 'sound']),
  W('ephemeral', 4, 'lasting a very short time', 'fleeting', 'A soap bubble is ___; it pops in seconds.'),
  W('eloquent', 4, 'speaking or writing in a clear, powerful way', 'articulate', 'Her ___ speech made the whole audience cheer.', ['loqu', 'speak']),
  W('inevitable', 4, 'certain to happen; impossible to avoid', 'unavoidable', 'With those dark clouds, rain seemed ___.'),
  W('lucid', 4, 'clear and easy to understand', 'clear', 'Mr. Hayes gave a ___ explanation of how tides work.', ['luc', 'light']),
  W('meander', 4, 'to wander slowly along a winding path', 'wander', 'The river seems to ___ back and forth across the valley.'),
  W('obsolete', 4, 'no longer used; out of date', 'outdated', 'The telegram is now ___ because we have email.'),
  W('pragmatic', 4, 'practical and realistic', 'practical', 'Buying the rope instead of candy was a ___ choice.'),
  W('scrutinize', 4, 'to examine something very closely', 'inspect', 'The detective began to ___ every clue on the map.'),
  W('tenacious', 4, 'very determined; not giving up easily', 'determined', 'The ___ climber kept going until she reached the top.'),
  W('ubiquitous', 4, 'found everywhere', 'everywhere', 'Phones are ___ today; almost everyone has one.'),
  W('venerable', 4, 'respected because of age, wisdom, or history', 'honored', 'The ___ old lighthouse had guided sailors for 200 years.'),
  W('zealous', 4, 'very enthusiastic and eager', 'eager', 'Noah was a ___ collector of facts about everything.'),
  W('juxtapose', 4, 'to place two things side by side to compare them', 'contrast', 'The artist likes to ___ bright colors with dark ones.', ['pos', 'place']),
  /* ---- from school worksheets (Nov 17) ---- */
  W('monstrous', 2, 'huge and frightening', 'enormous', 'The ___ waves crashed over the rocks and made the raft shake.'),
  W('momentum', 3, 'the force something has while it is moving', 'force', 'The sled picked up ___ as it raced down the steep hill.'),
  W('pummel', 3, 'to hit again and again', 'pound', 'The storm began to ___ the roof with heavy hail.'),
  W('frantic', 2, 'wild with worry or fear; very hurried', 'panicked', 'Dad made a ___ search for his keys when we were already late.'),
  W('disguise', 1, 'something that hides who or what you really are', 'costume', 'The spider\'s ___ made it look just like a bird dropping on a leaf.'),
  W('antennae', 2, 'the two thin feelers on an insect\'s head', 'feelers', 'The ant touched the crumb with its ___ before picking it up.')
];
