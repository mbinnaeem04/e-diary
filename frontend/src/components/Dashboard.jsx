import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './Header';
import NoteCard from './NoteCard';
import NoteModal from './NoteModal';
import { dashboardVariants, gridVariants } from '../animations';
import { TILTS } from '../lib/notes';
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote as apiDeleteNote,
  getCachedNotes,
  clearAuthSession,
  getAuthUser,
} from '../lib/api';

export default function Dashboard({ initial, onCloseDiary, user, onLogout }) {
  // Instant load from cache (0ms) if available
  const [notes, setNotes] = useState(() => getCachedNotes());
  const [loading, setLoading] = useState(() => getCachedNotes().length === 0);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [editor, setEditor] = useState(null); // null = closed, { note: null } = new, { note } = editing

  // Fetch fresh notes from backend
  const loadNotes = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      setError(null);
      const data = await fetchNotes();
      setNotes(data);
    } catch (err) {
      setError(err.message || 'Failed to load notes from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If we had cached notes, fetch in background silently; otherwise show loader
    const hasCache = getCachedNotes().length > 0;
    loadNotes(hasCache);
  }, []);

  // Search, then pinned notes first, then newest first
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes
      .filter((n) => !q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q))
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.date) - new Date(a.date));
  }, [notes, query]);

  const saveNote = async ({ id, title, body }) => {
    const cleanTitle = title.trim() || 'Untitled';
    setError(null);
    setEditor(null);

    if (id) {
      // Optimistic update
      const previousNotes = [...notes];
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, title: cleanTitle, body } : n))
      );
      try {
        const updated = await updateNote(id, { title: cleanTitle, body });
        setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      } catch (err) {
        setNotes(previousNotes);
        setError(err.message || 'Failed to save note');
      }
    } else {
      // Optimistic create with temporary ID
      const tempId = `temp_${Date.now()}`;
      const nextColor = notes.length ? (notes[0].color + 1) % 3 : 0;
      const nextTilt = TILTS[Math.floor(Math.random() * TILTS.length)];
      const tempNote = {
        id: tempId,
        title: cleanTitle,
        body,
        date: new Date().toISOString(),
        pinned: false,
        color: nextColor,
        tilt: nextTilt,
      };

      setNotes((prev) => [tempNote, ...prev]);

      try {
        const created = await createNote({
          title: cleanTitle,
          body,
          color: nextColor,
          tilt: nextTilt,
          pinned: false,
        });
        setNotes((prev) => prev.map((n) => (n.id === tempId ? created : n)));
      } catch (err) {
        setNotes((prev) => prev.filter((n) => n.id !== tempId));
        setError(err.message || 'Failed to save note');
      }
    }
  };

  const togglePin = async (id) => {
    const target = notes.find((n) => n.id === id);
    if (!target) return;
    const previousNotes = [...notes];
    setError(null);

    // Optimistic toggle
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );

    try {
      const updated = await updateNote(id, { pinned: !target.pinned });
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    } catch (err) {
      setNotes(previousNotes);
      setError(err.message || 'Failed to update pin status');
    }
  };

  const deleteNote = async (id) => {
    const previousNotes = [...notes];
    setError(null);

    // Optimistic delete
    setNotes((prev) => prev.filter((n) => n.id !== id));

    try {
      await apiDeleteNote(id);
    } catch (err) {
      setNotes(previousNotes);
      setError(err.message || 'Failed to delete note');
    }
  };

  const searching = query.trim() !== '';

  return (
    <motion.main
      variants={dashboardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-20 overflow-y-auto bg-canvas"
    >
      <Header
        user={user}
        initial={initial}
        query={query}
        onQuery={setQuery}
        onNew={() => setEditor({ note: null })}
        onCloseDiary={onCloseDiary}
        onLogout={onLogout}
      />

      <section className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6">
        {/* Error notification banner */}
        {error && (
          <div className="relative mb-6 rounded-2xl border-2 border-ink bg-[#FFE4E6] p-4 font-body shadow-hard">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-heading text-2xl font-bold text-ink">Notice:</span>
                <p className="text-sm font-medium text-ink">{error}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadNotes}
                  className="rounded-xl border-2 border-ink bg-paper px-3 py-1 text-xs font-semibold shadow-hard-sm hover:-translate-y-0.5"
                >
                  Retry
                </button>
                <button
                  onClick={() => setError(null)}
                  className="rounded-xl border-2 border-ink bg-paper px-2.5 py-1 text-xs font-bold hover:bg-ink hover:text-paper"
                  aria-label="Dismiss error"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="mx-auto mt-16 max-w-sm rounded-3xl border-2 border-ink bg-paper p-8 text-center shadow-hard">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-ink border-t-transparent" />
            <p className="font-heading text-3xl font-bold leading-tight">Opening your diary…</p>
            <p className="mt-2 font-body text-sm text-ink/70">Connecting with your backend</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="mx-auto mt-12 max-w-sm rounded-3xl border-2 border-ink bg-paper p-8 text-center shadow-hard">
            <p className="font-heading text-4xl font-bold leading-tight">
              {searching ? `Nothing matches “${query.trim()}”.` : 'Your first page is blank.'}
            </p>
            <p className="mt-2 font-body">
              {searching ? 'Try a shorter word or clear the search.' : 'Write a note to fill it.'}
            </p>
            {!searching && (
              <button
                onClick={() => setEditor({ note: null })}
                className="mt-5 rounded-2xl border-2 border-ink bg-primary px-5 py-2.5 font-body font-semibold shadow-hard transition-all hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-y-0 active:shadow-none"
              >
                New Note
              </button>
            )}
          </div>
        ) : (
          // CSS-columns masonry
          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="show"
            className="columns-1 gap-6 sm:columns-2 lg:columns-3"
          >
            <AnimatePresence>
              {visible.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={(n) => setEditor({ note: n })}
                  onPin={togglePin}
                  onDelete={deleteNote}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {editor && (
          <NoteModal
            key={editor.note?.id ?? 'new'}
            note={editor.note}
            onSave={saveNote}
            onCancel={() => setEditor(null)}
          />
        )}
      </AnimatePresence>
    </motion.main>
  );
}
