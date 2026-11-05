import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { findTopic, neighbours, topicKey } from '../data/index.js';
import { useStore } from '../store.jsx';
import { Icon, Paras, Reveal } from '../components/ui.jsx';

function Overview({ t }) {
  return (
    <div className="stack">
      <div className="callout callout-def">
        <span className="callout-label">Definition</span>
        <p className="def-text">{t.def}</p>
      </div>
      {t.why && (
        <div className="callout callout-why">
          <span className="callout-label">Why it matters</span>
          <p>{t.why}</p>
        </div>
      )}
      {t.bits.length > 0 && (
        <div>
          <h3 className="block-title">Key points</h3>
          <div className="bits">
            {t.bits.map((b, i) => (
              <div key={i} className="bit">
                <span className="bit-num">{i + 1}</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {t.note && (
        <div className="callout callout-note">
          <span className="callout-label">Current position (checked 5 Nov 2026)</span>
          <p>{t.note}</p>
        </div>
      )}
    </div>
  );
}

function Breakdown({ t }) {
  const location = useLocation();
  const hashId = decodeURIComponent(location.hash.replace('#', ''));
  const [openIds, setOpenIds] = useState(() => new Set(hashId ? [hashId] : t.subs.slice(0, 1).map((s) => s.id)));

  useEffect(() => {
    if (hashId) {
      setOpenIds((s) => new Set([...s, hashId]));
      setTimeout(() => document.getElementById(hashId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    }
  }, [hashId]);

  const all = openIds.size === t.subs.length;
  const toggle = (id) =>
    setOpenIds((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <div>
      <div className="row-between">
        <p className="muted small">{t.subs.length} parts · open one at a time, or expand all</p>
        <button className="btn btn-ghost btn-sm" onClick={() => setOpenIds(all ? new Set() : new Set(t.subs.map((s) => s.id)))}>
          {all ? 'Collapse all' : 'Expand all'}
        </button>
      </div>
      <div className="accordion">
        {t.subs.map((s, i) => {
          const open = openIds.has(s.id);
          return (
            <div key={s.id} id={s.id} className={`acc-item ${open ? 'open' : ''}`}>
              <button className="acc-head" onClick={() => toggle(s.id)} aria-expanded={open}>
                <span className="acc-num">{i + 1}</span>
                <span className="acc-title">{s.title}</span>
                <Icon name="chevron" size={16} className="acc-chev" />
              </button>
              {open && (
                <div className="acc-body">
                  <div className="mini">
                    <span className="mini-label">Definition</span>
                    <p>{s.def}</p>
                  </div>
                  {s.ex && (
                    <div className="mini mini-ex">
                      <span className="mini-label">Example</span>
                      <p>{s.ex}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Example({ t }) {
  if (!t.example) return <p className="muted">No worked example for this topic.</p>;
  return (
    <div className="card example">
      <span className="callout-label">Worked example</span>
      <h3>{t.example.title}</h3>
      <Paras text={t.example.text} />
    </div>
  );
}

function CaseStudy({ t }) {
  const c = t.case;
  if (!c) return <p className="muted">No case for this topic.</p>;
  return (
    <div className="stack">
      <div className="card case-situation">
        <span className="callout-label">Case · {c.title}</span>
        <Paras text={c.situation} />
        {c.ask && (
          <p className="case-ask">
            <Icon name="flag" size={15} /> {c.ask}
          </p>
        )}
      </div>
      <div className="think">
        <Icon name="bulb" size={16} /> Think it through first: write down your 3–4 steps, then compare with the model approach.
      </div>
      <Reveal label="Show model approach" hideLabel="Hide model approach">
        <ol className="steps">
          {c.approach.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
        {c.takeaway && (
          <div className="callout callout-why">
            <span className="callout-label">Takeaway</span>
            <p>{c.takeaway}</p>
          </div>
        )}
      </Reveal>
    </div>
  );
}

function Formulas({ t }) {
  return (
    <div className="grid formulas-grid">
      {t.formulas.map((f, i) => (
        <div key={i} className="card formula">
          <h4>{f.name}</h4>
          <code className="formula-text">{f.formula}</code>
          {f.ex && (
            <p className="small">
              <span className="mini-label">Example</span> {f.ex}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function Interview({ t }) {
  const [all, setAll] = useState(false);
  return (
    <div>
      <div className="row-between">
        <p className="muted small">Say your answer aloud first, then reveal the model answer.</p>
        <button className="btn btn-ghost btn-sm" onClick={() => setAll((a) => !a)}>
          {all ? 'Hide all answers' : 'Show all answers'}
        </button>
      </div>
      <div className="qa-list">
        {t.qa.map((q, i) => (
          <div key={`${i}-${all}`} className="card qa">
            <p className="qa-q">
              <span className="qa-mark">Q{i + 1}</span> {q.q}
            </p>
            <Reveal defaultOpen={all}>
              <p>{q.a}</p>
            </Reveal>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TopicPage() {
  const { moduleId, topicId } = useParams();
  const { module: m, topic: t } = findTopic(moduleId, topicId);
  const [params, setParams] = useSearchParams();
  const store = useStore();

  const key = m && t ? topicKey(m, t) : null;
  useEffect(() => {
    if (key) store.setLast(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    const el = document.querySelector('.tabs .tab.active');
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [params, topicId]);

  if (!m || !t)
    return (
      <div className="page narrow">
        <h1>Topic not found</h1>
        <Link to="/">Back to dashboard</Link>
      </div>
    );

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'breakdown', label: `Breakdown`, count: t.subs.length, show: t.subs.length > 0 },
    { id: 'example', label: 'Example', show: !!t.example },
    { id: 'case', label: 'Case', show: !!t.case },
    { id: 'formulas', label: 'Formulas', count: t.formulas.length, show: t.formulas.length > 0 },
    { id: 'interview', label: 'Interview', count: t.qa.length, show: t.qa.length > 0 },
  ].filter((x) => x.show !== false);
  const tab = tabs.find((x) => x.id === params.get('tab'))?.id || 'overview';
  const tabIdx = tabs.findIndex((x) => x.id === tab);
  const setTab = (id) => setParams(id === 'overview' ? {} : { tab: id }, { replace: true });

  const { prev, next } = neighbours(key);
  const idx = m.topics.findIndex((x) => x.id === t.id);
  const done = store.isDone(key);

  return (
    <div className="page topic-page">
      <nav className="crumbs">
        <Link to="/">Dashboard</Link>
        <Icon name="chevron" size={14} />
        <Link to={`/m/${m.id}`}>
          {m.num} · {m.short || m.title}
        </Link>
        <Icon name="chevron" size={14} />
        <span>
          Topic {idx + 1} of {m.topics.length}
        </span>
      </nav>

      <header className="topic-head">
        <div>
          <span className="eyebrow">
            {m.num}.{idx + 1} · {m.title}
          </span>
          <h1>{t.title}</h1>
          <p className="muted small">
            {t.subs.length} parts · {t.qa.length} interview questions{t.case ? ' · 1 case' : ''}
            {t.formulas.length ? ` · ${t.formulas.length} formulas` : ''}
          </p>
        </div>
        <div className="topic-actions">
          <button className={`btn ${done ? 'btn-done' : 'btn-ghost'}`} onClick={() => store.toggleDone(key)}>
            <Icon name="check" size={16} /> {done ? 'Completed' : 'Mark complete'}
          </button>
          <button
            className={`icon-btn bordered ${store.isBookmarked(key) ? 'active' : ''}`}
            onClick={() => store.toggleBookmark(key)}
            aria-label="Bookmark"
            title="Bookmark"
          >
            <Icon name="bookmark" />
          </button>
        </div>
      </header>

      <div className="tabs" role="tablist">
        {tabs.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={tab === x.id}
            className={`tab ${tab === x.id ? 'active' : ''}`}
            onClick={() => setTab(x.id)}
          >
            {x.label}
            {x.count ? <span className="tab-count">{x.count}</span> : null}
          </button>
        ))}
      </div>

      <section className="tab-panel">
        {tab === 'overview' && <Overview t={t} />}
        {tab === 'breakdown' && <Breakdown t={t} />}
        {tab === 'example' && <Example t={t} />}
        {tab === 'case' && <CaseStudy t={t} />}
        {tab === 'formulas' && <Formulas t={t} />}
        {tab === 'interview' && <Interview t={t} />}
      </section>

      <div className="tab-step">
        {tabIdx > 0 ? (
          <button className="btn btn-ghost btn-sm" onClick={() => setTab(tabs[tabIdx - 1].id)}>
            <Icon name="left" size={14} /> {tabs[tabIdx - 1].label}
          </button>
        ) : (
          <span />
        )}
        {tabIdx < tabs.length - 1 ? (
          <button className="btn btn-sm" onClick={() => setTab(tabs[tabIdx + 1].id)}>
            Next: {tabs[tabIdx + 1].label} <Icon name="chevron" size={14} />
          </button>
        ) : (
          !done && (
            <button className="btn btn-sm" onClick={() => store.setDone(key, true)}>
              <Icon name="check" size={14} /> Mark topic complete
            </button>
          )
        )}
      </div>

      <nav className="pager">
        {prev ? (
          <Link className="card pager-link" to={`/m/${prev.module.id}/${prev.topic.id}`}>
            <span className="muted small">← Previous</span>
            <strong>{prev.topic.title}</strong>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="card pager-link right" to={`/m/${next.module.id}/${next.topic.id}`}>
            <span className="muted small">Next →</span>
            <strong>{next.topic.title}</strong>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
