"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("nb_theme");
    const dark = saved !== "light";
    setIsDark(dark);
    document.documentElement.classList.toggle("light", !dark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("light", !next);
    localStorage.setItem("nb_theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
      style={{
        backgroundColor: "var(--nb-surface)",
        color: "var(--nb-muted)",
        border: "1px solid var(--nb-border)",
      }}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? "☀︎" : "☽"}
    </button>
  );
}
