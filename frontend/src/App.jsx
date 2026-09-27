import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import NotebookCover from './components/NotebookCover';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import { fetchNotes, getAuthUser, clearAuthSession } from './lib/api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getAuthUser());
  const [user, setUser] = useState(() => getAuthUser());
  const [view, setView] = useState('cover'); // 'cover' | 'dashboard'
  const [authOpen, setAuthOpen] = useState(false);

  // Pre-fetch notes in background while user views cover page
  useEffect(() => {
    if (isLoggedIn) {
      fetchNotes().catch(() => {});
    }
  }, [isLoggedIn]);

  // Swipe up / click arrow: dashboard if logged in, otherwise the auth modal
  const handleOpen = () => (isLoggedIn ? setView('dashboard') : setAuthOpen(true));

  const handleAuthSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setAuthOpen(false);
    setView('dashboard');
  };

  const handleLogout = () => {
    clearAuthSession();
    setIsLoggedIn(false);
    setUser(null);
    setView('cover');
  };

  return (
    // reducedMotion="user" respects the OS "reduce motion" setting
    <MotionConfig reducedMotion="user">
      <div className="fixed inset-0 overflow-hidden bg-canvas">
        <AnimatePresence>
          {view === 'cover' && <NotebookCover key="cover" onOpen={handleOpen} />}
          {view === 'dashboard' && (
            <Dashboard
              key="dashboard"
              user={user}
              initial={user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'D'}
              onCloseDiary={() => setView('cover')}
              onLogout={handleLogout}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {authOpen && (
            <AuthModal key="auth" onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
