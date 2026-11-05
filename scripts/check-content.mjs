// Validates every module/topic has the fields the UI expects.
import { MODULES, STATS } from '../src/data/index.js';
let problems = 0;
const ids = new Set();
for (const m of MODULES) {
  if (!m.id || !m.title || !m.tagline || !m.overview) { console.log('Module missing fields:', m.id); problems++; }
  for (const t of m.topics) {
    const key = `${m.id}/${t.id}`;
    if (ids.has(key)) { console.log('Duplicate topic id:', key); problems++; }
    ids.add(key);
    const miss = [];
    if (!t.def) miss.push('def');
    if (!t.why) miss.push('why');
    if (t.bits.length < 3) miss.push('bits');
    if (t.subs.length < 3) miss.push('subs');
    if (t.subs.some((s) => !s.def || !s.ex)) miss.push('sub def/ex');
    if (!t.example) miss.push('example');
    if (!t.case || !t.case.approach?.length) miss.push('case');
    if (t.qa.length < 3) miss.push('qa');
    if (miss.length) { console.log(key, 'missing:', miss.join(', ')); problems++; }
  }
}
console.log(JSON.stringify(STATS));
if (problems) { console.log(problems, 'problem(s)'); process.exit(1); } else console.log('Content OK');
