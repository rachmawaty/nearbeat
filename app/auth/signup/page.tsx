"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Registration failed");
      setLoading(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--nb-bg)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold" style={{ color: "var(--nb-blue)" }}>nearbeat</span>
          <p className="text-sm mt-1" style={{ color: "var(--nb-muted)" }}>your city pulse</p>
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: "var(--nb-surface)", border: "1px solid var(--nb-border)" }}>
          <h1 className="text-lg font-bold mb-5" style={{ color: "var(--nb-text)" }}>Create account</h1>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text" placeholder="Your name" value={name}
              onChange={(e) => setName(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: "var(--nb-bg)", border: "1px solid var(--nb-border)", color: "var(--nb-text)" }}
            />
            <input
              type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: "var(--nb-bg)", border: "1px solid var(--nb-border)", color: "var(--nb-text)" }}
            />
            <input
              type="password" placeholder="Password (min 8 chars)" value={password}
              onChange={(e) => setPassword(e.target.value)} required minLength={8}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: "var(--nb-bg)", border: "1px solid var(--nb-border)", color: "var(--nb-text)" }}
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: loading ? "var(--nb-muted)" : "var(--nb-blue)" }}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-xs mt-4" style={{ color: "var(--nb-muted)" }}>
            Have an account?{" "}
            <Link href="/auth/signin" className="font-semibold" style={{ color: "var(--nb-blue)" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
