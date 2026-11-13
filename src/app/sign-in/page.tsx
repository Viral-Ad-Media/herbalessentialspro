"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    const res =
      mode === "in"
        ? await signIn.email({ email, password })
        : await signUp.email({ email, password, name: String(f.get("name") || email.split("@")[0]) });
    setBusy(false);
    if (res.error) return setError(res.error.message ?? "Something went wrong");
    router.push("/admin");
    router.refresh();
  }

  const input = "w-full rounded-xl border border-mist bg-white px-4 py-3 outline-none focus:border-leaf-bright";
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold">{mode === "in" ? "Sign in" : "Create admin account"}</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {mode === "up" && <input name="name" placeholder="Name" className={input} />}
        <input name="email" type="email" required placeholder="Email" className={input} autoComplete="email" />
        <input name="password" type="password" required minLength={8} placeholder="Password" className={input}
          autoComplete={mode === "in" ? "current-password" : "new-password"} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={busy} className="w-full rounded-full bg-leaf px-6 py-3 font-medium text-white hover:bg-leaf-bright disabled:opacity-60">
          {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
        </button>
      </form>
      <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 text-sm text-leaf hover:underline">
        {mode === "in" ? "First time? Create the admin account" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
