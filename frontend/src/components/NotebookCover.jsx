import { motion } from 'framer-motion';
import { coverVariants, bounceArrow } from '../animations';
import { ArrowUpIcon } from './icons';

const RINGS = Array.from({ length: 9 });

export default function NotebookCover({ onOpen }) {
  // Open on a firm upward swipe/flick
  const handleDragEnd = (_, info) => {
    if (info.offset.y < -100 || info.velocity.y < -500) onOpen();
  };

  return (
    <motion.section
      variants={coverVariants}
      initial="initial"
      exit="exit"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.5}
      onDragEnd={handleDragEnd}
      onWheel={(e) => e.deltaY > 30 && onOpen()} // desktop: scroll down = swipe up
      className="fixed inset-0 z-10 flex cursor-grab items-center justify-center bg-canvas px-6 py-12 active:cursor-grabbing"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: -2 }}
        animate={{
          opacity: 1,
          y: 0,
          rotate: 0,
          transition: { type: 'spring', stiffness: 140, damping: 16, delay: 0.1 },
        }}
        className="relative flex h-auto min-h-[500px] w-full max-w-[460px] flex-col items-center justify-between gap-8 rounded-3xl border-2 border-ink bg-paper py-10 pl-20 pr-6 shadow-hard-xl sm:pl-24 sm:pr-8"
      >
        {/* Notebook margin line */}
        <span aria-hidden className="absolute inset-y-0 left-16 w-0.5 bg-secondary sm:left-20" />

        {/* Spiral binder rings */}
        <div aria-hidden className="absolute left-0 top-0 bottom-0 w-20 flex-none sm:w-24">
          <div className="absolute inset-y-0 left-3 flex flex-col justify-evenly py-10 sm:left-5">
            {RINGS.map((_, i) => (
              <div key={i} className="relative h-4">
                <span className="absolute left-5 top-[3px] h-2.5 w-2.5 rounded-full bg-ink" />
                <span className="absolute -left-5 top-0 h-4 w-12 rounded-full border-2 border-ink bg-paper" />
              </div>
            ))}
          </div>
        </div>

        {/* Label sticker */}
        <div className="-rotate-3 rounded-lg border-2 border-ink bg-primary px-4 py-1 font-heading text-3xl font-bold shadow-hard-sm">
          E-Diary
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="font-heading text-6xl font-bold leading-[1.02] sm:text-7xl">
            Your Thoughts, Neat &amp; Personal.
          </h1>
          <svg viewBox="0 0 200 12" className="mx-auto mt-4 w-40 text-secondary" aria-hidden>
            <path
              d="M2 8 Q 14 0 26 8 T 50 8 T 74 8 T 98 8 T 122 8 T 146 8 T 170 8 T 198 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Swipe cue */}
        <button
          onClick={onOpen}
          className="flex flex-col items-center gap-2 rounded-2xl px-4 py-1 font-body font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          <motion.span
            variants={bounceArrow}
            animate="animate"
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-primary shadow-hard-sm"
          >
            <ArrowUpIcon />
          </motion.span>
          Swipe up to open
        </button>
      </motion.div>
    </motion.section>
  );
}
