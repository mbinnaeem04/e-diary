import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { backdropVariants, sheetVariants } from '../animations';
import useEscape from '../hooks/useEscape';

const topBtn =
  'rounded-2xl border-2 border-ink px-5 py-2 font-body font-semibold shadow-hard-sm transition-all ' +
  'hover:-translate-y-0.5 hover:shadow-hard active:translate-y-0 active:shadow-none ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

export default function NoteModal({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note?.title ?? '');
  const [body, setBody] = useState(note?.body ?? '');
  const titleRef = useRef(null);
  const canSave = title.trim() !== '' || body.trim() !== '';

  useEscape(onCancel);

  // Focus the title once the sheet has slid into place
  useEffect(() => {
    const t = setTimeout(() => titleRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onCancel}
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/40 sm:px-6"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={note ? 'Edit note' : 'New note'}
        variants={sheetVariants}
        onClick={(e) => e.stopPropagation()}
        className="flex h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border-2 border-b-0 border-ink bg-paper shadow-hard-lg"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 border-b-2 border-ink px-4 py-3 sm:px-6">
          <button onClick={onCancel} className={`${topBtn} bg-paper`}>
            Cancel
          </button>
          <span className="font-heading text-3xl font-bold">{note ? 'Edit page' : 'New page'}</span>
          <button
            onClick={() => canSave && onSave({ id: note?.id, title, body })}
            disabled={!canSave}
            className={`${topBtn} bg-tertiary disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0`}
          >
            Save
          </button>
        </div>

        {/* Blank lined page */}
        <div className="relative min-h-0 flex-1">
          <span aria-hidden className="absolute inset-y-0 left-10 w-0.5 bg-secondary sm:left-16" />
          <div className="flex h-full flex-col pl-14 pr-5 pt-6 sm:pl-24 sm:pr-10">
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              aria-label="Note title"
              className="w-full bg-transparent font-heading text-5xl font-bold leading-tight placeholder:text-ink/30 focus:outline-none sm:text-7xl"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Start writing…"
              aria-label="Note body"
              className="ruled mt-3 min-h-0 flex-1 resize-none bg-transparent pb-8 font-body text-[18px] placeholder:text-ink/30 focus:outline-none"
              style={{
                '--lh': '32px',
                '--line': '#E5E5E5',
                paddingTop: 0,
                backgroundAttachment: 'local', // rules scroll with the text
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
