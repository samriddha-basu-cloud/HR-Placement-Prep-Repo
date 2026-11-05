import React from 'react';
import { Link } from 'react-router-dom';
import { ALL_TOPICS } from '../data/index.js';
import { useStore } from '../store.jsx';
import { Empty, Icon } from '../components/ui.jsx';

export default function Bookmarks() {
  const store = useStore();
  const items = ALL_TOPICS.filter((x) => store.isBookmarked(x.key));
  return (
    <div className="page">
      <h1>Bookmarks</h1>
      {!items.length ? (
        <Empty title="No bookmarks yet">
          <p className="muted">Use the bookmark button on any topic to save it here for quick revision.</p>
        </Empty>
      ) : (
        <div className="grid topics-grid">
          {items.map(({ module: m, topic: t, key }) => (
            <div key={key} className="card topic-card">
              <div className="topic-card-top">
                <span className="topic-index">{m.short || m.title}</span>
                <button className="icon-btn" onClick={() => store.toggleBookmark(key)} aria-label="Remove bookmark">
                  <Icon name="x" size={15} />
                </button>
              </div>
              <Link to={`/m/${m.id}/${t.id}`}>
                <h3>{t.title}</h3>
              </Link>
              <p className="muted small clamp-3">{t.def}</p>
            </div>
          ))}
        </div>
      )}
      <div className="danger-zone">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => {
            if (window.confirm('Reset all progress, bookmarks, flashcards and plan ticks in this browser?')) store.reset();
          }}
        >
          Reset all saved progress
        </button>
      </div>
    </div>
  );
}
