import { useState, useCallback, useEffect } from "react";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  persona_key: string;
  occupation: string | null;
  age_bracket: string | null;
  neighborhood: string | null;
  city: string;
  time_of_day_label: string;
  spend_categories: string[];
  avg_transaction: string;
  location_granted: boolean;
  google_connected: boolean;
  onboarding_completed: boolean;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const TOKEN_KEY = "nb_token";

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem(TOKEN_KEY),
    loading: !!localStorage.getItem(TOKEN_KEY),
    error: null,
  });

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(({ user, error }) => {
        if (error) { localStorage.removeItem(TOKEN_KEY); setState({ user: null, token: null, loading: false, error: null }); }
        else setState({ user, token, loading: false, error: null });
      })
      .catch(() => setState({ user: null, token: null, loading: false, error: null }));
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, persona_key: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, persona_key }),
    });
    const data = await res.json();
    if (!res.ok) { setState((s) => ({ ...s, loading: false, error: data.error })); return false; }
    localStorage.setItem(TOKEN_KEY, data.token);
    setState({ user: data.user, token: data.token, loading: false, error: null });
    return true;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) { setState((s) => ({ ...s, loading: false, error: data.error })); return false; }
    localStorage.setItem(TOKEN_KEY, data.token);
    setState({ user: data.user, token: data.token, loading: false, error: null });
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setState({ user: null, token: null, loading: false, error: null });
  }, []);

  const updatePersona = useCallback(async (persona_key: string) => {
    const token = localStorage.getItem(TOKEN_KEY);
    await fetch("/api/auth/persona", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ persona_key }),
    });
    setState((s) => s.user ? { ...s, user: { ...s.user, persona_key } } : s);
  }, []);

  const saveProfile = useCallback(async (profile: Partial<AuthUser> & { location_granted?: boolean }) => {
    const token = localStorage.getItem(TOKEN_KEY);
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(profile),
    });
    const updated = await res.json();
    setState((s) => s.user ? { ...s, user: { ...s.user, ...updated } } : s);
    return res.ok;
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    const res = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
    const { user } = await res.json();
    if (user) setState((s) => ({ ...s, user }));
  }, []);

  return { ...state, signup, login, logout, updatePersona, saveProfile, refreshUser };
}
