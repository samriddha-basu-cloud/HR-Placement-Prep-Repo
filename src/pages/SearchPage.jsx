import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { search } from '../data/index.js';
import { Empty } from '../components/ui.jsx';

const TYPES = ['All', 'Topic', 'Subtopic', 'Formula', 'Question', 'Module'];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [type, setType] = useState('All');
  const results = search(q, 300).filter((r) => type === 'All' || r.type === type);

  return (
    <div className="page">
      <h1>Search</h1>
      <div className="toolbar">
        <input
          className="input grow"
          autoFocus
          value={q}
          placeholder="Try ‘gratuity’, ‘time to hire’, ‘POSH’, ‘XLOOKUP’…"
          onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {})}
        />
      </div>
      <div className="chips">
        {TYPES.map((t) => (
          <button key={t} className={`chip ${t === type ? 'active' : ''}`} onClick={() => setType(t)}>
            {t}
          </button>
        ))}
      </div>
      {q && <p className="small muted">{results.length} results</p>}
      {q && !results.length && (
        <Empty title="Nothing found">
          <p className="muted">Try a shorter word or a synonym.</p>
        </Empty>
      )}
      <div className="results">
        {results.map((r, i) => (
          <Link key={i} to={r.path} className="card result">
            <span className={`tag tag-${r.type.toLowerCase()}`}>{r.type}</span>
            <div>
              <strong>{r.title}</strong>
              <p className="small muted">{r.where}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
