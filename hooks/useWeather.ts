"use client";

import { useState, useEffect, useRef } from "react";

export interface WeatherData {
  temp: number;
  label: string;
  emoji: string;
  city: string;
}

interface CachedWeather {
  data: WeatherData;
  fetchedAt: number;
}

const TTL_MS = 30 * 60 * 1000;

export interface UseWeatherReturn {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
}

export function useWeather(lat: number | null, lon: number | null): UseWeatherReturn {
  const [state, setState] = useState<UseWeatherReturn>({
    weather: null,
    loading: false,
    error: null,
    lastFetchedAt: null,
  });
  const cacheRef = useRef<CachedWeather | null>(null);

  useEffect(() => {
    if (lat === null || lon === null) return;

    const now = Date.now();
    if (cacheRef.current && now - cacheRef.current.fetchedAt < TTL_MS) {
      setState({
        weather: cacheRef.current.data,
        loading: false,
        error: null,
        lastFetchedAt: cacheRef.current.fetchedAt,
      });
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Weather fetch failed (${res.status})`);
        return res.json() as Promise<WeatherData>;
      })
      .then((data) => {
        const fetchedAt = Date.now();
        cacheRef.current = { data, fetchedAt };
        setState({ weather: data, loading: false, error: null, lastFetchedAt: fetchedAt });
      })
      .catch((err) => {
        setState((s) => ({ ...s, loading: false, error: err.message }));
      });
  }, [lat, lon]);

  return state;
}
