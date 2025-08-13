import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function UserSignin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.username || !form.password) {
      setErr("Please fill all fields.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/user/signin", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", form.username);
      navigate("/user/quiz");
    } catch (error) {
      setErr("Login failed. Please check your credentials.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-stone-50">
      {/* Animated, subtle background */}
      <div className="pointer-events-none absolute -top-28 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 opacity-30 blur-3xl float-blob" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-indigo-300 to-sky-400 opacity-30 blur-3xl float-blob-delay" />
      <div className="pointer-events-none absolute inset-0 dots-mask opacity-[0.07]" />

      <main className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-2">
        {/* Left: brand + value prop */}
        <section className="order-2 md:order-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-medium text-amber-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Secure & Fast Sign-in
          </div>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Welcome back to <span className="text-amber-600">QuizArrow</span>
          </h1>
          <p className="mt-4 max-w-md text-slate-600">
            Sign in to continue your learning streak, compete on leaderboards,
            and track your progress across quizzes.
          </p>

          <ul className="mt-8 grid max-w-lg grid-cols-1 gap-4 text-sm text-slate-700 sm:grid-cols-2">
            <li className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <TrophyIcon />
              <div>
                <p className="font-semibold">Compete & win</p>
                <p className="text-slate-500">Climb the global leaderboard</p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <LightningIcon />
              <div>
                <p className="font-semibold">Quick access</p>
                <p className="text-slate-500">One tap to your quizzes</p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <ShieldIcon />
              <div>
                <p className="font-semibold">Privacy first</p>
                <p className="text-slate-500">Your data stays protected</p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <SparklesIcon />
              <div>
                <p className="font-semibold">Beautiful UI</p>
                <p className="text-slate-500">Clean, distraction-free design</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Right: sign-in card */}
        <section className="order-1 md:order-2">
          <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-xl backdrop-blur-md">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <LogoIcon />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Sign in</h2>
              <p className="mt-1 text-sm text-slate-500">
                Access your QuizArrow account
              </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-700">
                  Username
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <UserIcon className="h-4 w-4 text-slate-400" />
                  </span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={onChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-10 py-2 text-slate-900 outline-none ring-amber-300 placeholder:text-slate-400 focus:border-amber-400 focus:ring-2"
                    placeholder="Enter your username"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <LockIcon className="h-4 w-4 text-slate-400" />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPwd ? "text" : "password"}
                    value={form.password}
                    onChange={onChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-10 py-2 text-slate-900 outline-none ring-amber-300 placeholder:text-slate-400 focus:border-amber-400 focus:ring-2"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-slate-500 hover:text-slate-700"
                    aria-label="Toggle password visibility"
                  >
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {err && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {err}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2 font-semibold text-black shadow-sm transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/60 border-t-transparent" />
                    Signing in…
                  </>
                ) : (
                  <>
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    Sign in
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-between text-sm">
                <Link to="/user/signup" className="font-medium text-amber-700 hover:text-amber-800">
                  Create account
                </Link>
                <Link to="/admin/signup" className="text-slate-500 hover:text-slate-700">
                  Sign up as Admin
                </Link>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Local CSS for subtle animations & dots */}
      <style>{`
        .float-blob {
          animation: float 12s ease-in-out infinite;
        }
        .float-blob-delay {
          animation: float 14s ease-in-out infinite reverse;
        }
        @keyframes float {
          0%   { transform: translateY(0px) translateX(0px) scale(1); }
          50%  { transform: translateY(-18px) translateX(8px) scale(1.03); }
          100% { transform: translateY(0px) translateX(0px) scale(1); }
        }
        .dots-mask {
          background-image:
            radial-gradient(currentColor 1px, transparent 1px);
          background-size: 18px 18px;
          color: #0f172a; /* slate-900 for dots */
          mask-image: radial-gradient(circle at center, black 55%, transparent 72%);
        }
      `}</style>
    </div>
  );
}

/* ── Small inline SVG icons (no external assets) ─────────────────────────── */

function LogoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-amber-600">
      <path
        d="M12 3l3.09 6.26L22 10.27l-5 4.9 1.18 7.06L12 18.9 5.82 22.23 7 15.17l-5-4.9 6.91-1.01L12 3z"
        fill="currentColor"
      />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 text-amber-600">
      <path
        fill="currentColor"
        d="M18 2h-2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1H6a1 1 0 0 0-1 1v2a5 5 0 0 0 4 4.9V12H7a1 1 0 0 0-1 1v1h12v-1a1 1 0 0 0-1-1h-2V9.9A5 5 0 0 0 19 5V3a1 1 0 0 0-1-1Zm-1 3a3 3 0 0 1-2 2.816V4h2v1ZM7 4h2v3.816A3 3 0 0 1 7 5V4Zm-2 17h14v2H5v-2Z"
      />
    </svg>
  );
}

function LightningIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 text-indigo-600">
      <path
        fill="currentColor"
        d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 text-emerald-600">
      <path
        fill="currentColor"
        d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"
      />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 text-pink-600">
      <path
        fill="currentColor"
        d="M5 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4zm14 6l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2zm-6 5l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z"
      />
    </svg>
  );
}

function UserIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14Z"
      />
    </svg>
  );
}

function LockIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="M17 9h-1V7a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Zm-6 7.73V18h2v-1.27a2 2 0 1 0-2 0ZM9 7a3 3 0 1 1 6 0v2H9Z"
      />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="M13 5l7 7-7 7v-4H4v-6h9V5z"
      />
    </svg>
  );
}
