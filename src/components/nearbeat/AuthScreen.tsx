"use client";

import { useState } from "react";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

interface Props {
  onAuth: (name: string, email: string, password: string, mode: "login" | "signup") => Promise<boolean>;
  error: string | null;
  loading: boolean;
}

export function AuthScreen({ onAuth, error, loading }: Props) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAuth(name, email, password, mode);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-10">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm fade-up">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "var(--gradient-brand)" }}>
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold">Nearbeat</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your city pulse</p>
        </div>

        {/* Tab toggle */}
        <div className="flex items-center gap-1 rounded-full border border-border/60 bg-card/60 p-1 backdrop-blur-md mb-5">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "flex-1 rounded-full py-2 text-sm font-semibold transition-all",
                mode === m ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m === "login" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-md shadow-[var(--shadow-card)] space-y-3">
          {mode === "signup" && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="mt-1 w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
            <div className="relative mt-1">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Min. 6 characters"
                className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 pr-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-3 text-sm font-bold text-white disabled:opacity-60 transition-opacity mt-1"
            style={{ background: "var(--gradient-brand)" }}
          >
            {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-border/60" />
            <span className="text-[11px] text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          <a
            href="/api/auth/google"
            className="flex items-center justify-center gap-2.5 w-full rounded-full py-2.5 text-sm font-semibold border border-border/60 bg-background/60 hover:bg-background transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </a>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-primary font-semibold hover:underline">
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
