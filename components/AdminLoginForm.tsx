"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAdmin, sanitizeAdminNextPath } from "@/lib/adminAuth";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = useMemo(
    () => sanitizeAdminNextPath(searchParams.get("next")),
    [searchParams],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() && !password.trim()) {
      setErrorMessage("اكتب اسم المستخدم وكلمة المرور.");
      return;
    }

    if (!username.trim()) {
      setErrorMessage("اسم المستخدم مطلوب.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("كلمة المرور مطلوبة.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const success = loginAdmin(username, password);

    if (!success) {
      setErrorMessage("اسم المستخدم أو كلمة المرور غير صحيحة.");
      setIsSubmitting(false);
      return;
    }

    router.replace(nextPath);
    router.refresh();
  };

  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grain opacity-80" />
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-accent/20 via-accent/5 to-transparent" />

      <div className="container-shell relative flex min-h-screen items-center justify-center py-10">
        <div className="w-full max-w-md rounded-[2.25rem] border border-white/10 bg-black/70 p-6 shadow-glow backdrop-blur-2xl sm:p-8">
          <div className="mb-8 text-center">
            <p className="headline text-3xl text-white">DealSpot</p>
            <h1 className="headline mt-4 text-4xl text-white">Admin Login</h1>
            <p className="mt-3 text-sm uppercase tracking-[0.24em] text-white/55">
              Admin Control Panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="mb-2 block text-sm text-white/65">Username</label>
              <input
                className="field"
                placeholder="dealspot"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm text-white/65">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="text-xs text-white/55 transition hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <input
                className="field"
                type={showPassword ? "text" : "password"}
                placeholder="••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {errorMessage ? (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errorMessage}
              </div>
            ) : null}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-4 text-base">
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xs uppercase tracking-[0.24em] text-white/45">
            Protected internal dashboard
          </div>
        </div>
      </div>
    </div>
  );
}
