import { createContext, useContext, useState, useCallback } from 'react';
import * as api from '../data/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [studentUser, setStudentUser] = useState(null);
  const [onboarded, setOnboarded] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | error
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setStatus('loading');
    setError(null);
    try {
      const res = await api.login({ email, password });
      setStudentUser(res.student);
      setOnboarded(true); // returning students have already completed onboarding
      setStatus('idle');
      return true;
    } catch (e) {
      setError(e.message);
      setStatus('error');
      return false;
    }
  }, []);

  const signup = useCallback(async (payload) => {
    setStatus('loading');
    setError(null);
    try {
      const res = await api.signup(payload);
      setStudentUser(res.student);
      setOnboarded(false); // new students go through resume + readiness onboarding
      setStatus('idle');
      return true;
    } catch (e) {
      setError(e.message);
      setStatus('error');
      return false;
    }
  }, []);

  const completeOnboarding = useCallback((patch) => {
    if (patch) setStudentUser((u) => (u ? { ...u, ...patch } : u));
    setOnboarded(true);
  }, []);

  const logout = useCallback(() => {
    setStudentUser(null);
    setOnboarded(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        studentUser,
        isAuthenticated: !!studentUser,
        onboarded,
        status,
        error,
        login,
        signup,
        logout,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
