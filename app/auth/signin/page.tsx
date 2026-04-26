"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email, password, redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  const handleGoogle = () => signIn("google", { callbackUrl: "/" });

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--nb-bg)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold" style={{ color: "var(--nb-blue)" }}>nearbeat</span>
          <p className="text-sm mt-1" style={{ color: "var(--nb-muted)" }}>your city pulse</p>
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: "var(--nb-surface)", border: "1px solid var(--nb-border)" }}>
          <h1 className="text-lg font-bold mb-5" style={{ color: "var(--nb-text)" }}>Sign in</h1>

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full py-3 rounded-full text-sm font-semibold mb-4 flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--nb-bg)", border: "1px solid var(--nb-border)", color: "var(--nb-text)" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/></svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--nb-border)" }} />
            <span className="text-xs" style={{ color: "var(--nb-muted)" }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--nb-border)" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: "var(--nb-bg)", border: "1px solid var(--nb-border)", color: "var(--nb-text)" }}
            />
            <input
              type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: "var(--nb-bg)", border: "1px solid var(--nb-border)", color: "var(--nb-text)" }}
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: loading ? "var(--nb-muted)" : "var(--nb-blue)" }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-xs mt-4" style={{ color: "var(--nb-muted)" }}>
            No account?{" "}
            <Link href="/auth/signup" className="font-semibold" style={{ color: "var(--nb-blue)" }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
