import { useState, useEffect, useRef } from "react";

export interface CalendarEvent {
  time: string;
  event: string;
  location?: string;
}

interface CachedCalendar {
  events: CalendarEvent[];
  fetchedAt: number;
}

const TTL_MS = 60 * 60 * 1000; // 1 hour

export interface UseCalendarReturn {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
}

export function useCalendar(token: string | null): UseCalendarReturn {
  const [state, setState] = useState<UseCalendarReturn>({
    events: [],
    loading: false,
    error: null,
    lastFetchedAt: null,
  });
  const cacheRef = useRef<CachedCalendar | null>(null);

  useEffect(() => {
    if (!token) return;

    const now = Date.now();
    if (cacheRef.current && now - cacheRef.current.fetchedAt < TTL_MS) {
      setState({
        events: cacheRef.current.events,
        loading: false,
        error: null,
        lastFetchedAt: cacheRef.current.fetchedAt,
      });
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    fetch("/api/calendar", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 403) throw new Error("Google not connected");
        if (!res.ok) throw new Error(`Calendar fetch failed (${res.status})`);
        return res.json() as Promise<{ events: CalendarEvent[] }>;
      })
      .then(({ events }) => {
        const fetchedAt = Date.now();
        cacheRef.current = { events, fetchedAt };
        setState({ events, loading: false, error: null, lastFetchedAt: fetchedAt });
      })
      .catch((err) => {
        setState((s) => ({ ...s, loading: false, error: err.message }));
      });
  }, [token]);

  return state;
}
