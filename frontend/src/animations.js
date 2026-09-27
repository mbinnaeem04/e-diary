// Central place for all Framer Motion variants.

const slideEase = [0.76, 0, 0.24, 1];

/* ---------- Page transitions (cover <-> dashboard) ---------- */
export const coverVariants = {
  initial: { y: 0 },
  exit: { y: '-100vh', transition: { duration: 0.4, ease: slideEase } },
};

export const dashboardVariants = {
  initial: { y: '100%' },
  animate: { y: 0, transition: { duration: 0.35, ease: slideEase } },
  exit: { y: '100%', transition: { duration: 0.25, ease: slideEase } },
};

/* ---------- Cover call-to-action ---------- */
export const bounceArrow = {
  animate: {
    y: [0, -12, 0],
    transition: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' },
  },
};

/* ---------- Modals ---------- */
export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

// Sticky note pops in with a little tilt
export const stickyModalVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -6, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: -1.5,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  exit: { opacity: 0, scale: 0.9, rotate: 4, y: 30, transition: { duration: 0.15 } },
};

// Notebook page slides up from the bottom
export const sheetVariants = {
  hidden: { y: 0, opacity: 1 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 30, stiffness: 320 } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } },
};

/* ---------- Note grid ---------- */
export const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
};

// `custom` = the note's resting tilt in degrees
export const cardVariants = {
  hidden: { opacity: 0, y: 30, rotate: 0 },
  show: (tilt = 0) => ({
    opacity: 1,
    y: 0,
    rotate: tilt,
    transition: { type: 'spring', stiffness: 220, damping: 20 },
  }),
  exit: { opacity: 0, scale: 0.8, rotate: 6, transition: { duration: 0.2 } },
};
