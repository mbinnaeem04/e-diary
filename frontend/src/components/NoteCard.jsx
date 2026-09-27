import { motion } from 'framer-motion';
import { cardVariants } from '../animations';
import { formatDate } from '../lib/notes';
import { PinIcon, TrashIcon } from './icons';

// Ruled-line colour is a translucent ink so it stays visible on every pastel.
const COLORS = [
  { bg: 'bg-primary', line: 'rgba(43,45,66,0.2)' },
  { bg: 'bg-secondary', line: 'rgba(43,45,66,0.2)' },
  { bg: 'bg-tertiary', line: 'rgba(43,45,66,0.2)' },
];

const iconBtn =
  'flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink transition-all ' +
  'hover:-translate-y-0.5 hover:shadow-hard-sm active:translate-y-0 active:shadow-none ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

export default function NoteCard({ note, onEdit, onPin, onDelete }) {
  const color = COLORS[note.color % COLORS.length];

  return (
    <motion.article
      custom={note.tilt}
      variants={cardVariants}
      exit="exit"
      whileHover={{ rotate: 0, y: -4 }}
      onClick={() => onEdit(note)}
      className={`mb-6 cursor-pointer break-inside-avoid rounded-2xl border-2 border-ink p-4 shadow-hard ${color.bg}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-3xl font-bold leading-none">
          {/* Keyboard-accessible way to open the note */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            className="text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {note.title}
          </button>
        </h3>
        <time
          dateTime={note.date}
          className="shrink-0 rounded-full border-2 border-ink bg-paper px-2.5 py-0.5 font-body text-xs font-medium"
        >
          {formatDate(note.date)}
        </time>
      </div>

      {/* Body text sits exactly on the ruled lines (28px line-height = 28px rule spacing) */}
      <p
        className="ruled mt-3 line-clamp-6 min-h-[84px] whitespace-pre-line font-body text-[15px]"
        style={{ '--lh': '28px', '--line': color.line }}
      >
        {note.body}
      </p>

      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPin(note.id);
          }}
          aria-pressed={note.pinned}
          aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
          className={`${iconBtn} ${note.pinned ? 'bg-ink text-paper' : 'bg-paper'}`}
        >
          <PinIcon filled={note.pinned} width={18} height={18} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          aria-label="Delete note"
          className={`${iconBtn} bg-paper`}
        >
          <TrashIcon width={18} height={18} />
        </button>
      </div>
    </motion.article>
  );
}
