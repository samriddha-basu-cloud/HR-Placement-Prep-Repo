import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { MODULES, search, topicKey } from './data/index.js';
import { useStore } from './store.jsx';
import { Icon } from './components/ui.jsx';
import Home from './pages/Home.jsx';
import ModulePage from './pages/ModulePage.jsx';
import TopicPage from './pages/TopicPage.jsx';
import Flashcards from './pages/Flashcards.jsx';
import Quiz from './pages/Quiz.jsx';
import Tools from './pages/Tools.jsx';
import Plan from './pages/Plan.jsx';
import Questions from './pages/Questions.jsx';
import Bookmarks from './pages/Bookmarks.jsx';
import SearchPage from './pages/SearchPage.jsx';
import About from './pages/About.jsx';

const NAV = [
  { to: '/', label: 'Dashboard', icon: 'home', end: true },
  { to: '/plan', label: '8-week plan', icon: 'plan' },
  { to: '/questions', label: 'Question bank', icon: 'chat' },
  { to: '/flashcards', label: 'Flashcards', icon: 'cards' },
  { to: '/quiz', label: 'Quiz', icon: 'quiz' },
  { to: '/tools', label: 'Calculators', icon: 'calc' },
  { to: '/bookmarks', label: 'Bookmarks', icon: 'bookmark' },
  { to: '/about', label: 'About & sources', icon: 'info' },
];

function Sidebar({ open, onClose }) {
  const store = useStore();
  return (
    <>
      <div className={`scrim ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <Link to="/" className="brand" onClick={onClose}>
          <span className="brand-mark">HR</span>
          <span>
            <strong>Placement Prep</strong>
            <small>PGDM / MBA 2027</small>
          </span>
        </Link>
        <nav className="nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className="nav-link" onClick={onClose}>
              <Icon name={n.icon} size={17} />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-heading">Modules</div>
        <nav className="nav nav-modules">
          {MODULES.map((m) => {
            const done = m.topics.filter((t) => store.isDone(topicKey(m, t))).length;
            const complete = done === m.topics.length;
            return (
              <NavLink key={m.id} to={`/m/${m.id}`} className="nav-link nav-module" onClick={onClose}>
                <span className={`num ${complete ? 'complete' : ''}`}>{complete ? <Icon name="check" size={12} /> : m.num}</span>
                <span className="nav-module-title">{m.short || m.title}</span>
                <span className="nav-count">
                  {done}/{m.topics.length}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

function SearchBox() {
  const [q, setQ] = useState('');
  const [focus, setFocus] = useState(false);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const ref = useRef(null);
  const results = q.trim().length > 1 ? search(q, 8) : [];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (path) => {
    setQ('');
    setFocus(false);
    ref.current?.blur();
    navigate(path);
  };

  return (
    <div className="searchbox">
      <Icon name="search" size={16} />
      <input
        ref={ref}
        value={q}
        placeholder="Search topics, formulas, questions…  ( / )"
        onChange={(e) => {
          setQ(e.target.value);
          setActive(0);
        }}
        onFocus={() => setFocus(true)}
        onBlur={() => setTimeout(() => setFocus(false), 150)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, results.length));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (e.key === 'Enter') {
            if (results[active] && active < results.length) go(results[active].path);
            else if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`);
          } else if (e.key === 'Escape') {
            setQ('');
            ref.current?.blur();
          }
        }}
        aria-label="Search"
      />
      {focus && results.length > 0 && (
        <div className="search-pop">
          {results.map((r, i) => (
            <button key={i} className={`search-item ${i === active ? 'active' : ''}`} onMouseDown={() => go(r.path)}>
              <span className={`tag tag-${r.type.toLowerCase()}`}>{r.type}</span>
              <span className="search-item-text">
                <span className="search-title">{r.title}</span>
                <span className="search-where">{r.where}</span>
              </span>
            </button>
          ))}
          <button
            className={`search-item all ${active === results.length ? 'active' : ''}`}
            onMouseDown={() => go(`/search?q=${encodeURIComponent(q.trim())}`)}
          >
            See all results for “{q.trim()}”
          </button>
        </div>
      )}
    </div>
  );
}

function NotFound() {
  return (
    <div className="page narrow">
      <h1>Page not found</h1>
      <p className="muted">That page doesn’t exist. Try the dashboard or search.</p>
      <Link className="btn" to="/">
        Go to dashboard
      </Link>
    </div>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const store = useStore();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    if (!location.hash) window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="main">
        <header className="topbar">
          <button className="icon-btn only-mobile" onClick={() => setOpen(true)} aria-label="Open menu">
            <Icon name="menu" />
          </button>
          <SearchBox />
          <button className="icon-btn" onClick={store.toggleTheme} aria-label="Toggle dark mode" title="Toggle theme">
            <Icon name={store.theme === 'dark' ? 'sun' : 'moon'} />
          </button>
        </header>
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/m/:moduleId" element={<ModulePage />} />
            <Route path="/m/:moduleId/:topicId" element={<TopicPage />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="footer">
          Built for PGDM / MBA HR 2027 placements · Laws and rates checked 5 Nov 2026 — always confirm on official portals ·{' '}
          <Link to="/about">Sources</Link>
        </footer>
      </div>
    </div>
  );
}
