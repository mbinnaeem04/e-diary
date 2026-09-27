import { useEffect } from 'react';

// Calls `handler` when the Escape key is pressed.
export default function useEscape(handler) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') handler();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handler]);
}
