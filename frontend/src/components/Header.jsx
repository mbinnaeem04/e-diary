import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, SearchIcon, LogOutIcon, ArrowUpIcon } from './icons';

export default function Header({ user, initial, query, onQuery, onNew, onCloseDiary, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const userName = user?.name || 'My Diary';
  const userEmail = user?.email || '';

  return (
    <header className="sticky top-0 z-20 border-b-2 border-ink bg-canvas">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:gap-6 sm:px-6">
        {/* User Profile Avatar with Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="User profile menu"
            title={userName}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-secondary font-heading text-3xl font-bold shadow-hard transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink cursor-pointer"
          >
            {initial}
          </button>

          {/* User Dropdown Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-14 z-50 w-64 rounded-2xl border-2 border-ink bg-paper p-3 shadow-hard-lg"
              >
                {/* User info */}
                <div className="border-b-2 border-ink/20 px-3 pb-3 pt-1">
                  <p className="font-heading text-xl font-bold leading-tight text-ink">
                    {userName}
                  </p>
                  {userEmail && (
                    <p className="font-body text-xs text-ink/70 truncate mt-0.5" title={userEmail}>
                      {userEmail}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onCloseDiary();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left font-body text-sm font-semibold text-ink transition-colors hover:bg-secondary/40 focus:outline-none cursor-pointer"
                  >
                    <span className="rotate-180 flex items-center justify-center">
                      <ArrowUpIcon width={16} height={16} />
                    </span>
                    <span>Close Diary (Cover)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      if (onLogout) onLogout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left font-body text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 focus:outline-none cursor-pointer"
                  >
                    <LogOutIcon width={16} height={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Masking-tape search bar */}
        <label className="relative mx-auto block w-full max-w-md -rotate-1">
          <span className="sr-only">Search notes</span>
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
            <SearchIcon width={20} height={20} />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search your notes"
            className="w-full rounded-lg border-2 border-ink bg-tape py-2.5 pl-11 pr-4 font-body font-medium shadow-hard transition-all placeholder:text-ink/60 focus:-translate-y-0.5 focus:shadow-hard-lg focus:outline-none"
          />
        </label>

        {/* Floating action button */}
        <motion.button
          onClick={onNew}
          whileHover={{ rotate: -4, scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          aria-label="New note"
          className="flex h-12 shrink-0 items-center gap-2 rounded-2xl border-2 border-ink bg-primary px-3 font-body font-semibold shadow-hard focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:px-5 cursor-pointer"
        >
          <PlusIcon />
          <span className="hidden sm:inline">New Note</span>
        </motion.button>
      </div>
    </header>
  );
}
