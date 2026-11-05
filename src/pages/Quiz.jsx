import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { cardPool, MODULES } from '../data/index.js';
import { useStore } from '../store.jsx';
import { Icon } from '../components/ui.jsx';

const N = 10;

function shuffle(a) {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

function buildQuiz(mid) {
  const pool = cardPool(mid);
  const picks = shuffle(pool).slice(0, Math.min(N, pool.length));
  return picks.map((c) => {
    const sameModule = pool.filter((p) => p.mid === c.mid && p.term !== c.term);
    const others = shuffle(sameModule.length >= 3 ? sameModule : pool.filter((p) => p.term !== c.term))
      .filter((p, i, arr) => arr.findIndex((q) => q.term === p.term) === i)
      .slice(0, 3);
    return { card: c, options: shuffle([c.term, ...others.map((o) => o.term)]) };
  });
}

export default function Quiz() {
  const [params, setParams] = useSearchParams();
  const mid = params.get('m') || 'all';
  const store = useStore();
  const [round, setRound] = useState(0);
  const quiz = useMemo(() => buildQuiz(mid), [mid, round]);
  const [answers, setAnswers] = useState({});
  const [i, setI] = useState(0);
  const finished = i >= quiz.length;
  const score = quiz.filter((q, k) => answers[k] === q.card.term).length;

  const restart = () => {
    setAnswers({});
    setI(0);
    setRound((r) => r + 1);
  };

  const q = quiz[i];
  const chosen = answers[i];

  return (
    <div className="page narrow">
      <h1>Quiz</h1>
      <p className="muted">Read the definition and pick the matching term. {N} questions per round, new set every time.</p>
      <div className="toolbar">
        <select
          value={mid}
          onChange={(e) => {
            setParams(e.target.value === 'all' ? {} : { m: e.target.value });
            setAnswers({});
            setI(0);
          }}
        >
          <option value="all">All modules</option>
          {MODULES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.num} · {m.title} {store.quizBest[m.id] != null ? `(best ${store.quizBest[m.id]}/${N})` : ''}
            </option>
          ))}
        </select>
        <button className="btn btn-ghost btn-sm" onClick={restart}>
          New round
        </button>
      </div>

      {!finished && q && (
        <div className="card quiz-card">
          <div className="row-between small muted">
            <span>
              Question {i + 1} of {quiz.length}
            </span>
            <span>{q.card.module}</span>
          </div>
          <div className="quiz-progress">
            <div style={{ width: `${(i / quiz.length) * 100}%` }} />
          </div>
          <p className="quiz-def">“{q.card.def}”</p>
          <div className="options">
            {q.options.map((o) => {
              const state = chosen ? (o === q.card.term ? 'right' : o === chosen ? 'wrong' : 'dim') : '';
              return (
                <button
                  key={o}
                  className={`option ${state}`}
                  disabled={!!chosen}
                  onClick={() => setAnswers((a) => ({ ...a, [i]: o }))}
                >
                  {o}
                  {state === 'right' && <Icon name="check" size={16} />}
                  {state === 'wrong' && <Icon name="x" size={16} />}
                </button>
              );
            })}
          </div>
          {chosen && (
            <div className="row-between">
              <Link className="small" to={q.card.path}>
                Review this topic →
              </Link>
              <button
                className="btn"
                onClick={() => {
                  if (i + 1 >= quiz.length) store.saveQuiz(mid, quiz.filter((x, k) => (k === i ? chosen : answers[k]) === x.card.term).length);
                  setI(i + 1);
                }}
              >
                {i + 1 >= quiz.length ? 'See score' : 'Next question'}
              </button>
            </div>
          )}
        </div>
      )}

      {finished && (
        <div className="card quiz-card">
          <h2>
            You scored {score}/{quiz.length}
          </h2>
          <p className="muted">
            {score === quiz.length ? 'Perfect round.' : score >= 7 ? 'Strong — review the misses below.' : 'Review these topics, then try another round.'}
          </p>
          <ul className="review-list">
            {quiz.map((x, k) => (
              <li key={k} className={answers[k] === x.card.term ? 'ok' : 'miss'}>
                <Icon name={answers[k] === x.card.term ? 'check' : 'x'} size={15} />
                <span>
                  <strong>{x.card.term}</strong>
                  {answers[k] !== x.card.term && <span className="muted"> — you chose “{answers[k]}”</span>}
                  <br />
                  <Link className="small" to={x.card.path}>
                    Open topic
                  </Link>
                </span>
              </li>
            ))}
          </ul>
          <button className="btn" onClick={restart}>
            Play another round
          </button>
        </div>
      )}
    </div>
  );
}
