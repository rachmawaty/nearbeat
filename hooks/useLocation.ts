"use client";

import { useState, useEffect } from "react";

export interface LocationState {
  lat: number | null;
  lon: number | null;
  loading: boolean;
  error: string | null;
}

export function useLocation(): LocationState {
  const [state, setState] = useState<LocationState>({
    lat: null,
    lon: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ lat: null, lon: null, loading: false, error: "Geolocation not supported" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setState({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          loading: false,
          error: null,
        }),
      (err) =>
        setState({ lat: null, lon: null, loading: false, error: err.message }),
      { timeout: 10_000 }
    );
  }, []);

  return state;
}
