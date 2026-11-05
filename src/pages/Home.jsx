import React from 'react';
import { Link } from 'react-router-dom';
import { ALL_TOPICS, MODULES, STATS, topicKey } from '../data/index.js';
import { useStore } from '../store.jsx';
import { Icon, Progress } from '../components/ui.jsx';

const TRACKS = [
  { title: 'HR Generalist / Operations', ids: ['foundations', 'onboarding-lifecycle', 'hr-operations', 'file-audit', 'employee-relations'] },
  { title: 'Talent Acquisition', ids: ['talent-acquisition', 'onboarding-lifecycle', 'analytics-metrics'] },
  { title: 'Payroll & Compliance', ids: ['payroll', 'labour-law', 'file-audit'] },
  { title: 'HR Analytics', ids: ['analytics-metrics', 'analytics-tools', 'hr-tech'] },
];

export default function Home() {
  const store = useStore();
  const doneCount = ALL_TOPICS.filter((x) => store.isDone(x.key)).length;
  const last = store.last ? ALL_TOPICS.find((x) => x.key === store.last) : null;
  const nextUp = ALL_TOPICS.find((x) => !store.isDone(x.key));

  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">HR placement preparation · 2027</p>
          <h1>Learn HR in small, clear pieces.</h1>
          <p className="lead">
            {STATS.modules} modules, {STATS.topics} topics and {STATS.subtopics} sub-topics. Each topic has a definition, an
            example, a case to solve and interview questions, from HR Operations through to HR Analytics.
          </p>
          <div className="hero-actions">
            {last ? (
              <Link className="btn" to={`/m/${last.module.id}/${last.topic.id}`}>
                Continue: {last.topic.title}
              </Link>
            ) : (
              nextUp && (
                <Link className="btn" to={`/m/${nextUp.module.id}/${nextUp.topic.id}`}>
                  Start with {nextUp.topic.title}
                </Link>
              )
            )}
            <Link className="btn btn-ghost" to="/plan">
              See the 8-week plan
            </Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">{doneCount}</span>
            <span className="stat-label">of {STATS.topics} topics done</span>
          </div>
          <Progress value={doneCount} total={STATS.topics} label={false} />
          <div className="stat-grid">
            <div>
              <strong>{STATS.cases}</strong>
              <span>cases</span>
            </div>
            <div>
              <strong>{STATS.questions}</strong>
              <span>interview Qs</span>
            </div>
            <div>
              <strong>{STATS.formulas}</strong>
              <span>formulas</span>
            </div>
            <div>
              <strong>{store.bookmarks.length}</strong>
              <span>bookmarks</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Modules</h2>
          <span className="muted">Pick any order — the numbers follow the recommended path.</span>
        </div>
        <div className="grid modules-grid">
          {MODULES.map((m) => {
            const done = m.topics.filter((t) => store.isDone(topicKey(m, t))).length;
            return (
              <Link key={m.id} to={`/m/${m.id}`} className="card module-card">
                <div className="module-card-top">
                  <span className="num-badge">{m.num}</span>
                  <span className={`pill pill-${m.priority === 1 ? 'p1' : m.priority === 2 ? 'p2' : 'p3'}`}>
                    {m.priority === 1 ? 'Must master' : m.priority === 2 ? 'Working knowledge' : 'Differentiator'}
                  </span>
                </div>
                <h3>{m.title}</h3>
                <p className="muted small clamp-2">{m.tagline}</p>
                <div className="module-card-foot">
                  <span className="small muted">{m.topics.length} topics</span>
                  <Progress value={done} total={m.topics.length} label={false} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Study by target role</h2>
        </div>
        <div className="grid tracks-grid">
          {TRACKS.map((tr) => (
            <div key={tr.title} className="card track">
              <h3>{tr.title}</h3>
              <ol className="track-list">
                {tr.ids.map((id) => {
                  const m = MODULES.find((x) => x.id === id);
                  return m ? (
                    <li key={id}>
                      <Link to={`/m/${m.id}`}>
                        <span className="num-badge sm">{m.num}</span> {m.short || m.title}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Practice tools</h2>
        </div>
        <div className="grid tools-grid">
          <Link to="/flashcards" className="card tool">
            <Icon name="cards" />
            <h3>Flashcards</h3>
            <p className="muted small">Flip through every definition, module by module.</p>
          </Link>
          <Link to="/quiz" className="card tool">
            <Icon name="quiz" />
            <h3>Quiz</h3>
            <p className="muted small">10-question rounds: match the definition to the term.</p>
          </Link>
          <Link to="/questions" className="card tool">
            <Icon name="chat" />
            <h3>Question bank</h3>
            <p className="muted small">Every interview question with a model answer.</p>
          </Link>
          <Link to="/tools" className="card tool">
            <Icon name="calc" />
            <h3>Calculators</h3>
            <p className="muted small">HR metrics and CTC → take-home, with formulas shown.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
