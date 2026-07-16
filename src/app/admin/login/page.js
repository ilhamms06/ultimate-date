"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import Button from "@/components/Button";
import { IconBadge } from "@/components/GradientIcon";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace("/admin");
        router.refresh();
      } else {
        const j = await res.json().catch(() => ({}));
        setError(
          j.error === "not_configured"
            ? "Server belum dikonfigurasi (cek env)."
            : "Password salah."
        );
      }
    } catch {
      setError("Gagal terhubung.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh w-full items-center justify-center p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-[1.75rem] border border-white/60 bg-white/40 p-6 shadow-[0_18px_40px_-16px_rgba(255,91,160,0.35)] backdrop-blur-xl"
      >
        <div className="mb-4 flex flex-col items-center text-center">
          <IconBadge icon={Lock} gradient="purple" className="h-12 w-12" iconClassName="h-6 w-6" />
          <h1 className="mt-3 font-serif text-2xl font-semibold text-ink">
            Admin
          </h1>
          <p className="mt-1 text-sm font-semibold text-ink-soft">
            Masukkan password untuk lanjut.
          </p>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 font-display text-base font-bold text-ink placeholder:font-semibold placeholder:text-ink-soft/60 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300/50"
        />

        {error && (
          <p className="mt-2 text-center text-xs font-bold text-pink-500">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading || !password}
          className="mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Masuk…" : "Masuk"}
        </Button>
      </form>
    </main>
  );
}
