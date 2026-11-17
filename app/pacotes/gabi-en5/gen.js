/* =========================================================
   Learning Quest — GENERATED QUESTIONS
   New problems with new numbers, rebuilt from their id (so they work in reviews and in the Parents page too):
     G:fractions:<add|sub|mulwhole|mulfrac|div>:<seed>
     G:volume:<box|missing|composite>:<seed>
     G:expressions:<any>:<seed>
     G:word:<word>               (📖 dictionary challenge)
   ========================================================= */
(function () {
  'use strict';
  function rng(str) { let h = 1779033703 ^ str.length; for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    return () => { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; }; }
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const lcm = (a, b) => a / gcd(a, b) * b;
  const fr = (n, d) => { const g = gcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : `${n}/${d}`; };
  const mixed = (n, d) => { const g = gcd(n, d); n /= g; d /= g; return n > d && d !== 1 ? `${Math.floor(n / d)} ${n % d}/${d}` : null; };

  function fractions(sub, R) {
    const pick = a => a[Math.floor(R() * a.length)];
    const D = [2, 3, 4, 5, 6, 8, 10, 12];
    if (sub === 'add' || sub === 'sub') {
      let d1, d2, n1, n2;
      do { d1 = pick(D); d2 = pick(D); n1 = 1 + Math.floor(R() * (d1 - 1)); n2 = 1 + Math.floor(R() * (d2 - 1)); } while (d1 === d2 || (sub === 'sub' && n1 / d1 <= n2 / d2) || gcd(n1, d1) !== 1 || gcd(n2, d2) !== 1);
      const L = lcm(d1, d2), a = n1 * L / d1, b = n2 * L / d2, top = sub === 'add' ? a + b : a - b;
      const ans = fr(top, L), mx = mixed(top, L);
      return { type: 'num', prompt: `What is **${n1}/${d1} ${sub === 'add' ? '+' : '−'} ${n2}/${d2}**? Write your answer as a fraction (like 5/6).`, answers: [ans].concat(mx ? [mx] : []),
        explain: `Find a common denominator: **${L}**. ${n1}/${d1} = ${a}/${L} and ${n2}/${d2} = ${b}/${L}. Then ${a}/${L} ${sub === 'add' ? '+' : '−'} ${b}/${L} = ${top}/${L}${ans !== `${top}/${L}` ? ` = **${ans}**` : ''}${mx ? ` (or ${mx})` : ''}.` };
    }
    if (sub === 'mulwhole') {
      const d = pick([2, 3, 4, 5, 6, 8]), n = 1 + Math.floor(R() * (d - 1)), k = 2 + Math.floor(R() * 5), w = d * k;
      const thing = pick(['stickers', 'marbles', 'cookies', 'pages', 'minutes', 'seashells']);
      return { type: 'num', prompt: `Gabi has **${w} ${thing}**. She uses **${n}/${d}** of them. How many ${thing} does she use?`, answers: [String(w * n / d)],
        explain: `${n}/${d} of ${w}: divide by the bottom number (${w} ÷ ${d} = ${k}), then multiply by the top (${k} × ${n} = **${k * n}**).` };
    }
    if (sub === 'mulfrac') {
      const a = pick([1, 2, 3]), b = pick([2, 3, 4, 5]), c = pick([1, 2, 3, 4]), d = pick([3, 4, 5, 6]);
      const n1 = Math.min(a, b - 1), n2 = Math.min(c, d - 1);
      return { type: 'num', prompt: `What is **${n1}/${b} × ${n2}/${d}**? Write a fraction.`, answers: [fr(n1 * n2, b * d)],
        explain: `Multiply the tops (${n1} × ${n2} = ${n1 * n2}) and the bottoms (${b} × ${d} = ${b * d}): ${n1 * n2}/${b * d}${fr(n1 * n2, b * d) !== `${n1 * n2}/${b * d}` ? ` = **${fr(n1 * n2, b * d)}**` : ''}.` };
    }
    if (sub === 'hard') {
      const d1 = pick([3, 4, 5, 6, 8]), n1 = 1 + Math.floor(R() * (d1 - 1)), w = d1 * (2 + Math.floor(R() * 4)), d2 = pick([2, 3, 4]);
      const first = w * n1 / d1; if (first % d2 === 0) return { type: 'num', prompt: `A class has **${w}** students. **${n1}/${d1}** of them like science. Of those, **1/${d2}** want to be astronauts. How many want to be astronauts?`, answers: [String(first / d2)],
        explain: `Step 1: ${n1}/${d1} of ${w} = ${w} ÷ ${d1} × ${n1} = ${first}. Step 2: 1/${d2} of ${first} = ${first} ÷ ${d2} = **${first / d2}**.` };
    }
    // div: whole ÷ unit fraction, or unit fraction ÷ whole
    const d = pick([2, 3, 4, 5, 6, 8]), w = 2 + Math.floor(R() * 5);
    if (R() < 0.6) return { type: 'num', prompt: `How many **1/${d}-cup** scoops are in **${w} cups** of flour? (${w} ÷ 1/${d})`, answers: [String(w * d)],
      explain: `Each cup has ${d} scoops of 1/${d}. ${w} cups × ${d} = **${w * d}** scoops. Dividing by 1/${d} is the same as multiplying by ${d}.` };
    return { type: 'num', prompt: `**1/${d}** of a pizza is shared equally by **${w}** friends. What fraction of the whole pizza does each friend get? (1/${d} ÷ ${w})`, answers: [`1/${d * w}`],
      explain: `Splitting 1/${d} into ${w} equal parts makes each part ${w} times smaller: 1/(${d} × ${w}) = **1/${d * w}**.` };
  }

  function volume(sub, R) {
    const pick = a => a[Math.floor(R() * a.length)];
    const u = pick(['cm', 'in', 'ft', 'm']); const r = (a, b) => a + Math.floor(R() * (b - a + 1));
    if (sub === 'missing') {
      const l = r(2, 9), w = r(2, 8), h = r(2, 10), V = l * w * h;
      return { type: 'num', prompt: `A box has a volume of **${V} cubic ${u}**. It is **${l} ${u}** long and **${w} ${u}** wide. How tall is it?`, answers: [String(h)],
        explain: `V = l × w × h, so ${V} = ${l} × ${w} × h = ${l * w} × h. Then h = ${V} ÷ ${l * w} = **${h} ${u}**.` };
    }
    if (sub === 'composite') {
      const a = [r(2, 6), r(2, 5), r(2, 5)], b = [r(2, 6), r(2, 5), r(2, 5)];
      const va = a[0] * a[1] * a[2], vb = b[0] * b[1] * b[2];
      return { type: 'num', prompt: `A shape is made of two boxes stuck together. Box A is **${a.join(' × ')} ${u}** and box B is **${b.join(' × ')} ${u}**. What is the total volume (cubic ${u})?`, answers: [String(va + vb)],
        explain: `Find each volume, then add: A = ${a.join(' × ')} = ${va}; B = ${b.join(' × ')} = ${vb}; total = ${va} + ${vb} = **${va + vb} cubic ${u}**.` };
    }
    const l = r(2, 10), w = r(2, 8), h = r(2, 9);
    return { type: 'num', prompt: `What is the volume of a rectangular prism that is **${l} ${u}** long, **${w} ${u}** wide and **${h} ${u}** tall? (cubic ${u})`, answers: [String(l * w * h)],
      figure: { kind: 'box', l, w, h, unit: u, cubes: false, labels: true },
      explain: `V = length × width × height = ${l} × ${w} × ${h} = ${l * w} × ${h} = **${l * w * h} cubic ${u}**.` };
  }

  function expressions(sub, R) {
    const r = (a, b) => a + Math.floor(R() * (b - a + 1));
    if (sub === 'hard') {   // two-step with brackets and bigger numbers
      const a = r(3, 12), b = r(2, 9), c = r(2, 6), e = r(2, 6), k = r(2, 9), d = e * k;
      const v = (a + b) * c - d / e; if (v > 0) return { type: 'num', prompt: `Evaluate: **[(${a} + ${b}) × ${c}] − ${d} ÷ ${e}**`, answers: [String(v)],
        explain: `Inside first: ${a} + ${b} = ${a + b}, × ${c} = ${(a + b) * c}. Then ÷ before −: ${d} ÷ ${e} = ${k}. Finally ${(a + b) * c} − ${k} = **${v}**.` };
    }
    const t = Math.floor(R() * 6);
    let e, steps, v;
    if (t === 0) { const a = r(2, 20), b = r(2, 9), c = r(2, 9); v = a + b * c; e = `${a} + ${b} × ${c}`; steps = `Multiply first: ${b} × ${c} = ${b * c}. Then add: ${a} + ${b * c} = **${v}**.`; }
    else if (t === 1) { const a = r(2, 15), b = r(2, 15), c = r(2, 6); v = (a + b) * c; e = `(${a} + ${b}) × ${c}`; steps = `Parentheses first: ${a} + ${b} = ${a + b}. Then ${a + b} × ${c} = **${v}**.`; }
    else if (t === 2) { const a = r(2, 9), c = r(1, 9), b = c + r(1, 9); v = a * (b - c); e = `${a} × (${b} − ${c})`; steps = `Parentheses first: ${b} − ${c} = ${b - c}. Then ${a} × ${b - c} = **${v}**.`; }
    else if (t === 3) { const b = r(2, 9), k = r(2, 9), c = r(1, 20); v = k + c; e = `${b * k} ÷ ${b} + ${c}`; steps = `Divide first: ${b * k} ÷ ${b} = ${k}. Then ${k} + ${c} = **${v}**.`; }
    else if (t === 4) { const a = r(2, 8), b = r(2, 8), c = r(2, 5), d = r(1, (a + b) * c - 1); v = (a + b) * c - d; e = `[(${a} + ${b}) × ${c}] − ${d}`; steps = `Inside first: ${a} + ${b} = ${a + b}, then × ${c} = ${(a + b) * c}. Then ${(a + b) * c} − ${d} = **${v}**.`; }
    else { const c = r(2, 6), d = r(2, 6), a = r(2, 9), b = Math.ceil((c * d + 1) / a) + r(0, 5); v = a * b - c * d; e = `${a} × ${b} − ${c} × ${d}`; steps = `Multiply first: ${a} × ${b} = ${a * b} and ${c} × ${d} = ${c * d}. Then ${a * b} − ${c * d} = **${v}**.`; }
    return { type: 'num', prompt: `Evaluate: **${e}**`, answers: [String(v)], explain: `Order of operations: ( ) and [ ] first, then × and ÷, then + and −. ${steps}` };
  }

  function word(w) {
    const W = (window.WORDS || []).find(x => x.w === w); if (!W) return null;
    const R = rng('word' + w); const others = (window.WORDS || []).filter(x => x.w !== w && x.def !== W.def);
    const opts = [W.def]; while (opts.length < 4 && others.length) { const o = others.splice(Math.floor(R() * others.length), 1)[0]; if (!opts.includes(o.def)) opts.push(o.def); }
    return { type: 'mc', prompt: `📖 **Dictionary challenge!** Look up **${W.w}** in your dictionary. What does it mean?`, options: opts, answer: 0, dict: true,
      explain: `**${W.w}** means *${W.def}*.${W.sent ? ' Example: "' + W.sent.replace('___', W.w) + '"' : ''}` };
  }

  const MATH = { fractions, volume, expressions };
  const SUBS = { fractions: ['add', 'sub', 'mulwhole', 'mulfrac', 'div'], volume: ['box', 'missing', 'composite'], expressions: ['any'] };
  const HARD = { fractions: ['hard', 'add', 'sub', 'mulfrac'], volume: ['missing', 'composite'], expressions: ['hard', 'any'] };
  /** rebuild a generated question from its id */
  function genFromId(id) {
    const p = String(id).split(':'); if (p[0] !== 'G') return null;
    let q = null;
    if (p[1] === 'word') q = word(p.slice(2).join(':'));
    else if (MATH[p[1]]) q = MATH[p[1]](p[2], rng(id));
    if (!q) return null;
    return Object.assign({ id, skill: p[1] === 'word' ? 'vocab' : p[1], gen: true }, q);
  }
  /** a sub-type that looks like the question she missed */
  function subLike(q) {
    const t = String(q.prompt || '').toLowerCase();
    if (q.skill === 'fractions') return /÷|divide|scoop|shared|split/.test(t) ? 'div' : /×|times|\bof\b/.test(t) ? (/\d+\/\d+\s*×\s*\d+\/\d+/.test(t) ? 'mulfrac' : 'mulwhole') : /−|subtract|minus|left|more than|less/.test(t) ? 'sub' : /\+|add|sum|total|together|altogether/.test(t) ? 'add' : null;
    if (q.skill === 'volume') return /missing|how tall|height|how long|how wide|what is the (length|width)/.test(t) ? 'missing' : /two|combined|composite|together|l-shaped|attached|stuck/.test(t) ? 'composite' : 'box';
    return 'any';
  }
  const seed = () => Math.random().toString(36).slice(2, 8);
  /** a brand-new math question of the same kind (null if this skill has no generator) */
  function similarMath(q) {
    if (!MATH[q.skill]) return null;
    const subs = SUBS[q.skill]; const s = subLike(q) || subs[Math.floor(Math.random() * subs.length)];
    return `G:${q.skill}:${s}:${seed()}`;
  }
  function mathFor(skill, key, hard) { const subs = (hard ? HARD : SUBS)[skill]; const R = rng(key); return `G:${skill}:${subs[Math.floor(R() * subs.length)]}:${key.replace(/[^a-z0-9]/gi, '').slice(-10)}`; }
  function dictFor(key, n, avoid) {
    const W = (window.WORDS || []).filter(x => !(avoid || []).includes(x.w)); const R = rng('dict' + key); const out = [];
    while (out.length < n && W.length) out.push(W.splice(Math.floor(R() * W.length), 1)[0].w);
    return out.map(w => 'G:word:' + w);
  }
  window.QGEN = { genFromId, similarMath, mathFor, dictFor, MATH_SKILLS: Object.keys(MATH) };
})();
