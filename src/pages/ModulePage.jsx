import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { findModule, MODULES, topicKey } from '../data/index.js';
import { useStore } from '../store.jsx';
import { Icon, Progress } from '../components/ui.jsx';

export default function ModulePage() {
  const { moduleId } = useParams();
  const m = findModule(moduleId);
  const store = useStore();
  if (!m)
    return (
      <div className="page narrow">
        <h1>Module not found</h1>
        <Link to="/">Back to dashboard</Link>
      </div>
    );

  const done = m.topics.filter((t) => store.isDone(topicKey(m, t))).length;
  const firstOpen = m.topics.find((t) => !store.isDone(topicKey(m, t))) || m.topics[0];
  const idx = MODULES.findIndex((x) => x.id === m.id);
  const nextModule = MODULES[idx + 1];

  return (
    <div className="page">
      <nav className="crumbs">
        <Link to="/">Dashboard</Link>
        <Icon name="chevron" size={14} />
        <span>Module {m.num}</span>
      </nav>
      <header className="module-head">
        <span className="num-badge lg">{m.num}</span>
        <div>
          <h1>{m.title}</h1>
          <p className="lead">{m.tagline}</p>
        </div>
      </header>

      <div className="module-meta card">
        <p>{m.overview}</p>
        <div className="module-meta-row">
          <Progress value={done} total={m.topics.length} />
          <div className="row-gap">
            <Link className="btn" to={`/m/${m.id}/${firstOpen.id}`}>
              {done ? 'Continue' : 'Start module'}
            </Link>
            <Link className="btn btn-ghost" to={`/flashcards?m=${m.id}`}>
              Flashcards
            </Link>
            <Link className="btn btn-ghost" to={`/quiz?m=${m.id}`}>
              Quiz
            </Link>
          </div>
        </div>
      </div>

      <div className="grid topics-grid">
        {m.topics.map((t, i) => {
          const k = topicKey(m, t);
          const isDone = store.isDone(k);
          return (
            <Link key={t.id} to={`/m/${m.id}/${t.id}`} className={`card topic-card ${isDone ? 'is-done' : ''}`}>
              <div className="topic-card-top">
                <span className="topic-index">
                  {m.num}.{i + 1}
                </span>
                {isDone && (
                  <span className="done-chip">
                    <Icon name="check" size={13} /> Done
                  </span>
                )}
                {store.isBookmarked(k) && <Icon name="bookmark" size={15} className="accent" />}
              </div>
              <h3>{t.title}</h3>
              <p className="muted small clamp-3">{t.def}</p>
              <div className="topic-card-foot small muted">
                <span>{t.subs.length} parts</span>
                {t.case && <span>· case</span>}
                {t.formulas.length > 0 && <span>· {t.formulas.length} formulas</span>}
                <span>· {t.qa.length} Qs</span>
              </div>
            </Link>
          );
        })}
      </div>

      {nextModule && (
        <Link className="next-module card" to={`/m/${nextModule.id}`}>
          <span className="muted small">Next module</span>
          <strong>
            {nextModule.num} · {nextModule.title}
          </strong>
          <Icon name="chevron" />
        </Link>
      )}
    </div>
  );
}
