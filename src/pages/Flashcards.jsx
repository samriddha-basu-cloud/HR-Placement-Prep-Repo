import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { cardPool, MODULES } from '../data/index.js';
import { useStore } from '../store.jsx';
import { Icon } from '../components/ui.jsx';

function shuffle(a) {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

export default function Flashcards() {
  const [params, setParams] = useSearchParams();
  const mid = params.get('m') || 'all';
  const [onlyUnknown, setOnlyUnknown] = useState(false);
  const store = useStore();
  const [seed, setSeed] = useState(0);
  const deck = useMemo(() => {
    const pool = cardPool(mid);
    return seed ? shuffle(pool) : pool;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mid, seed]);
  const cards = onlyUnknown ? deck.filter((c) => !store.isKnown(c.key)) : deck;
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setI(0);
    setFlipped(false);
  }, [mid, seed, onlyUnknown]);

  const card = cards[Math.min(i, cards.length - 1)];
  const go = (d) => {
    setFlipped(false);
    setI((x) => (cards.length ? (x + d + cards.length) % cards.length : 0));
  };

  useEffect(() => {
    const onKey = (e) => {
      if (document.activeElement?.tagName === 'SELECT') return;
      if (e.key === ' ') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const knownCount = deck.filter((c) => store.isKnown(c.key)).length;

  return (
    <div className="page narrow">
      <h1>Flashcards</h1>
      <p className="muted">
        Tap the card (or press Space) to flip. Use ← → to move. Mark what you know so the deck shrinks to what's left.
      </p>
      <div className="toolbar">
        <select value={mid} onChange={(e) => setParams(e.target.value === 'all' ? {} : { m: e.target.value })}>
          <option value="all">All modules</option>
          {MODULES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.num} · {m.title}
            </option>
          ))}
        </select>
        <button className="btn btn-ghost btn-sm" onClick={() => setSeed(Date.now())}>
          <Icon name="shuffle" size={15} /> Shuffle
        </button>
        <label className="check-label">
          <input type="checkbox" checked={onlyUnknown} onChange={(e) => setOnlyUnknown(e.target.checked)} /> Only cards I don't
          know yet
        </label>
      </div>
      <p className="small muted">
        Known: {knownCount}/{deck.length}
      </p>

      {!card ? (
        <div className="card empty">
          <h3>All done here</h3>
          <p className="muted">You've marked every card in this deck as known.</p>
        </div>
      ) : (
        <>
          <button className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped((f) => !f)}>
            <span className="fc-meta">
              {card.module} · {Math.min(i, cards.length - 1) + 1}/{cards.length}
            </span>
            {!flipped ? (
              <span className="fc-term">{card.term}</span>
            ) : (
              <span className="fc-def">{card.def}</span>
            )}
            <span className="fc-hint">{flipped ? 'Definition' : 'Tap to see the definition'}</span>
          </button>
          <div className="fc-actions">
            <button className="btn btn-ghost" onClick={() => go(-1)}>
              <Icon name="left" size={15} /> Prev
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                store.setKnown(card.key, false);
                go(1);
              }}
            >
              Still learning
            </button>
            <button
              className="btn"
              onClick={() => {
                store.setKnown(card.key, true);
                if (!onlyUnknown) go(1);
                else setFlipped(false);
              }}
            >
              <Icon name="check" size={15} /> I know this
            </button>
            <button className="btn btn-ghost" onClick={() => go(1)}>
              Next <Icon name="chevron" size={15} />
            </button>
          </div>
          <p className="center small">
            <Link to={card.path}>Open the full topic →</Link>
          </p>
        </>
      )}
    </div>
  );
}
