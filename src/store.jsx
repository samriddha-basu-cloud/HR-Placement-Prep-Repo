import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'hrprep.v1';
const DEFAULTS = { done: [], bookmarks: [], plan: [], known: [], last: null, theme: null, quizBest: {} };

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

function toggleIn(list, key) {
  return list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable – keep working in memory */
    }
  }, [state]);

  const systemDark =
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = state.theme || (systemDark ? 'dark' : 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const api = useMemo(
    () => ({
      ...state,
      theme,
      isDone: (k) => state.done.includes(k),
      toggleDone: (k) => setState((s) => ({ ...s, done: toggleIn(s.done, k) })),
      setDone: (k, v) =>
        setState((s) => ({ ...s, done: v ? Array.from(new Set([...s.done, k])) : s.done.filter((x) => x !== k) })),
      isBookmarked: (k) => state.bookmarks.includes(k),
      toggleBookmark: (k) => setState((s) => ({ ...s, bookmarks: toggleIn(s.bookmarks, k) })),
      isPlanDone: (k) => state.plan.includes(k),
      togglePlan: (k) => setState((s) => ({ ...s, plan: toggleIn(s.plan, k) })),
      isKnown: (k) => state.known.includes(k),
      setKnown: (k, v) =>
        setState((s) => ({ ...s, known: v ? Array.from(new Set([...s.known, k])) : s.known.filter((x) => x !== k) })),
      setLast: (k) => setState((s) => (s.last === k ? s : { ...s, last: k })),
      toggleTheme: () => setState((s) => ({ ...s, theme: theme === 'dark' ? 'light' : 'dark' })),
      saveQuiz: (id, score) =>
        setState((s) => ({ ...s, quizBest: { ...s.quizBest, [id]: Math.max(score, s.quizBest[id] || 0) } })),
      reset: () => setState({ ...DEFAULTS, theme: state.theme }),
    }),
    [state, theme]
  );

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
