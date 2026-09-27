import { useState } from 'react';
import { motion } from 'framer-motion';
import { backdropVariants, stickyModalVariants } from '../animations';
import useEscape from '../hooks/useEscape';
import { CloseIcon } from './icons';
import { signupUser, loginUser } from '../lib/api';

const inputCls =
  'w-full rounded-2xl border-2 border-ink bg-paper px-4 py-3 font-body text-base shadow-hard placeholder:text-ink/40 ' +
  'transition-all focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-hard-lg focus:outline-none';

const COPY = {
  login: {
    title: 'Welcome Back!',
    sub: 'Log in to pick up where you left off.',
    button: 'Open My Diary',
    switchText: 'New here? Create an account',
  },
  signup: {
    title: 'Join the Diary!',
    sub: 'Create an account to start your first page.',
    button: 'Start My Diary',
    switchText: 'Have an account? Log in',
  },
};

export default function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const copy = COPY[mode];

  useEscape(onClose);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address.');
    if (password.length < 6) return setError('Use a password with at least 6 characters.');
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await loginUser({ email, password });
        onSuccess(res.user);
      } else {
        const res = await signupUser({ email, password, name });
        onSuccess(res.user);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 p-4"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        variants={stickyModalVariants}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border-2 border-ink bg-secondary p-6 pt-9 shadow-hard-xl sm:p-8 sm:pt-10"
      >
        {/* Piece of tape holding the sticky note */}
        <span
          aria-hidden
          className="absolute -top-4 left-1/2 h-8 w-28 -translate-x-1/2 rotate-2 rounded-sm border-2 border-ink bg-primary"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink bg-paper transition-all hover:-translate-y-0.5 hover:shadow-hard-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <CloseIcon width={18} height={18} />
        </button>

        <h2 id="auth-title" className="font-heading text-5xl font-bold leading-none">
          {copy.title}
        </h2>
        <p className="mt-2 font-body">{copy.sub}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          {mode === 'signup' && (
            <label className="block">
              <span className="mb-1.5 block font-body font-medium">Name (optional)</span>
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className={inputCls}
              />
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block font-body font-medium">Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputCls}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block font-body font-medium">Password</span>
            <input
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className={inputCls}
            />
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-xl border-2 border-ink bg-paper px-3 py-2 font-body text-sm font-medium"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl border-2 border-ink bg-ink px-5 py-3.5 font-body text-lg font-semibold text-paper shadow-hard transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-50"
          >
            {loading ? 'Processing…' : copy.button}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setError('');
          }}
          className="mt-5 block w-full text-center font-body font-medium underline decoration-2 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {copy.switchText}
        </button>
      </motion.div>
    </motion.div>
  );
}
