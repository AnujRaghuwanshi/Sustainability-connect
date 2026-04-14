import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as api from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    if (typeof window === 'undefined') return null;
    const saved = window.localStorage.getItem('adminSession');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (session) {
      window.localStorage.setItem('adminSession', JSON.stringify(session));
    } else {
      window.localStorage.removeItem('adminSession');
    }
  }, [session]);

  const value = useMemo(
    () => ({
      session,
      loading,
      login: async (email, password) => {
        setLoading(true);
        try {
          const result = await api.login(email, password);
          setSession(result);
          return result;
        } finally {
          setLoading(false);
        }
      },
      logout: () => setSession(null),
    }),
    [loading, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
