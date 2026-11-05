import m01 from './modules/01-foundations.js';
import m02 from './modules/02-ob.js';
import m03 from './modules/03-talent-acquisition.js';
import m04 from './modules/04-onboarding-lifecycle.js';
import m05 from './modules/05-hr-operations.js';
import m06 from './modules/06-file-audit.js';
import m07 from './modules/07-payroll.js';
import m08 from './modules/08-labour-law.js';
import m09 from './modules/09-employee-relations.js';
import m10 from './modules/10-performance-ld.js';
import m11 from './modules/11-analytics-metrics.js';
import m12 from './modules/12-analytics-tools.js';
import m13 from './modules/13-hr-tech.js';
import m14 from './modules/14-interview.js';

export const slug = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

function normTopic(t) {
  return {
    id: t.id || slug(t.title),
    title: t.title,
    def: t.def,
    why: t.why || '',
    bits: t.bits || [],
    subs: (t.subs || []).map(([title, def, ex]) => ({ id: slug(title), title, def, ex })),
    example: t.example || null,
    case: t.case || null,
    formulas: (t.formulas || []).map(([name, formula, ex]) => ({ name, formula, ex })),
    qa: (t.qa || []).map(([q, a]) => ({ q, a })),
    note: t.note || '',
  };
}

export const MODULES = [m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11, m12, m13, m14].map((m, i) => ({
  ...m,
  num: String(i + 1).padStart(2, '0'),
  topics: m.topics.map(normTopic),
}));

export const topicKey = (m, t) => `${m.id}/${t.id}`;

export const ALL_TOPICS = MODULES.flatMap((m) => m.topics.map((t) => ({ module: m, topic: t, key: topicKey(m, t) })));

export function findModule(id) {
  return MODULES.find((m) => m.id === id);
}

export function findTopic(mid, tid) {
  const m = findModule(mid);
  if (!m) return {};
  return { module: m, topic: m.topics.find((t) => t.id === tid) };
}

export function neighbours(key) {
  const i = ALL_TOPICS.findIndex((x) => x.key === key);
  return { prev: i > 0 ? ALL_TOPICS[i - 1] : null, next: i >= 0 && i < ALL_TOPICS.length - 1 ? ALL_TOPICS[i + 1] : null };
}

/* Search index: modules, topics, subtopics, formulas, questions */
export const SEARCH_INDEX = MODULES.flatMap((m) => [
  { type: 'Module', title: m.title, text: `${m.title} ${m.tagline} ${m.overview}`, path: `/m/${m.id}`, where: `Module ${m.num}` },
  ...m.topics.flatMap((t) => {
    const base = `/m/${m.id}/${t.id}`;
    return [
      {
        type: 'Topic',
        title: t.title,
        text: `${t.title} ${t.def} ${t.why} ${t.bits.join(' ')}`,
        path: base,
        where: m.title,
      },
      ...t.subs.map((s) => ({
        type: 'Subtopic',
        title: s.title,
        text: `${s.title} ${s.def} ${s.ex}`,
        path: `${base}?tab=breakdown#${s.id}`,
        where: `${m.title} › ${t.title}`,
      })),
      ...t.formulas.map((f) => ({
        type: 'Formula',
        title: f.name,
        text: `${f.name} ${f.formula} ${f.ex}`,
        path: `${base}?tab=formulas`,
        where: `${m.title} › ${t.title}`,
      })),
      ...t.qa.map((q) => ({
        type: 'Question',
        title: q.q,
        text: `${q.q} ${q.a}`,
        path: `${base}?tab=interview`,
        where: `${m.title} › ${t.title}`,
      })),
    ];
  }),
]).map((e) => ({ ...e, hay: e.text.toLowerCase(), titleLc: e.title.toLowerCase() }));

export function search(q, limit = 60) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const typeRank = { Module: 0, Topic: 1, Subtopic: 2, Formula: 3, Question: 4 };
  return SEARCH_INDEX.filter((e) => terms.every((t) => e.hay.includes(t)))
    .map((e) => ({
      ...e,
      score: (terms.every((t) => e.titleLc.includes(t)) ? 0 : 10) + typeRank[e.type] + (e.titleLc.startsWith(terms[0]) ? -1 : 0),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, limit);
}

/* Flashcard / quiz pool per module: topics + subtopics with definitions */
export function cardPool(moduleId) {
  const mods = moduleId && moduleId !== 'all' ? MODULES.filter((m) => m.id === moduleId) : MODULES;
  return mods.flatMap((m) =>
    m.topics.flatMap((t) => [
      { key: `${m.id}/${t.id}`, term: t.title, def: t.def, module: m.title, path: `/m/${m.id}/${t.id}`, mid: m.id },
      ...t.subs.map((s) => ({
        key: `${m.id}/${t.id}#${s.id}`,
        term: s.title,
        def: s.def,
        module: m.title,
        path: `/m/${m.id}/${t.id}?tab=breakdown#${s.id}`,
        mid: m.id,
      })),
    ])
  );
}

export const STATS = {
  modules: MODULES.length,
  topics: ALL_TOPICS.length,
  subtopics: ALL_TOPICS.reduce((n, x) => n + x.topic.subs.length, 0),
  questions: ALL_TOPICS.reduce((n, x) => n + x.topic.qa.length, 0),
  cases: ALL_TOPICS.filter((x) => x.topic.case).length,
  formulas: ALL_TOPICS.reduce((n, x) => n + x.topic.formulas.length, 0),
};
