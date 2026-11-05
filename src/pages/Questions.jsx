import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MODULES } from '../data/index.js';
import { Reveal } from '../components/ui.jsx';

export default function Questions() {
  const [mid, setMid] = useState('all');
  const [q, setQ] = useState('');
  const [showAll, setShowAll] = useState(false);

  const list = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return MODULES.filter((m) => mid === 'all' || m.id === mid).flatMap((m) =>
      m.topics.flatMap((t) =>
        t.qa
          .filter((x) => terms.every((term) => `${x.q} ${x.a}`.toLowerCase().includes(term)))
          .map((x, i) => ({ ...x, m, t, k: `${m.id}/${t.id}/${i}` }))
      )
    );
  }, [mid, q]);

  return (
    <div className="page">
      <h1>Question bank</h1>
      <p className="muted">Every interview question in the app, with a model answer. Answer aloud first, then reveal.</p>
      <div className="toolbar">
        <select value={mid} onChange={(e) => setMid(e.target.value)}>
          <option value="all">All modules</option>
          {MODULES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.num} · {m.title}
            </option>
          ))}
        </select>
        <input className="input" placeholder="Filter questions…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn btn-ghost btn-sm" onClick={() => setShowAll((s) => !s)}>
          {showAll ? 'Hide answers' : 'Show answers'}
        </button>
      </div>
      <p className="small muted">{list.length} questions</p>
      <div className="qa-list">
        {list.map((x) => (
          <div key={`${x.k}-${showAll}`} className="card qa">
            <Link className="qa-where small" to={`/m/${x.m.id}/${x.t.id}?tab=interview`}>
              {x.m.num} · {x.t.title}
            </Link>
            <p className="qa-q">{x.q}</p>
            <Reveal defaultOpen={showAll}>
              <p>{x.a}</p>
            </Reveal>
          </div>
        ))}
      </div>
    </div>
  );
}
