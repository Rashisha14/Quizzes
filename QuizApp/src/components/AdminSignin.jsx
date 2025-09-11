import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function AdminSignin() {
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
      const res = await axios.post("http://localhost:3000/admin/signin", form);
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUsername", res.data.admin.username);
      localStorage.setItem("adminName", res.data.admin.name);




      navigate("/admin/quiz");
    } catch (error) {
      setErr("Login failed. Please check your credentials.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-200">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-28 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-500/40 to-green-700/40 blur-3xl float-blob" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-emerald-400/30 to-green-700/30 blur-3xl float-blob-delay" />
      <div className="pointer-events-none absolute inset-0 dots-mask opacity-[0.04]" />

      <main className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-2">
        {/* Left info section */}
        <section className="order-2 md:order-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500 bg-emerald-900/30 px-3 py-1 text-xs font-medium text-emerald-300 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Secure & Fast Admin Access
          </div>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Welcome back, <span className="text-emerald-400">Admin</span>
          </h1>
          <p className="mt-4 max-w-md text-slate-400">
            Manage quizzes, users, and results securely from your admin dashboard.
          </p>

          <ul className="mt-8 grid max-w-lg grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <li className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-800/50 p-3 shadow-sm hover:scale-105 transition">
              <ShieldIcon />
              <div>
                <p className="font-semibold text-white">Full Control</p>
                <p className="text-slate-400">Manage the platform with ease</p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-800/50 p-3 shadow-sm hover:scale-105 transition">
              <DashboardSparklesIcon />
              <div>
                <p className="font-semibold text-white">Clean Dashboard</p>
                <p className="text-slate-400">Easy to navigate tools</p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-800/50 p-3 shadow-sm hover:scale-105">
              <LightningIcon />
              <div>
                <p className="font-semibold text-white">Privacy first</p>
                <p className="text-slate-400">Your data stays protected</p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-800/50 p-3 shadow-sm hover:scale-105">
              <SparklesIcon />
              <div>
                <p className="font-semibold text-white">Beautiful UI</p>
                <p className="text-slate-400">Clean, distraction-free design</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Right sign-in form */}
        <section className="order-1 md:order-2">
          <div className="flex min-h-140 items-center justify-center">
            <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-md">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-900/40">
                  <LogoIcon />
                </div>
                <h2 className="text-2xl font-bold text-white">Admin Sign in</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Access your admin account
                </p>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-300">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center">
                      <UserIcon />
                    </span>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={form.username}
                      onChange={onChange}
                      className="w-full rounded-lg border border-slate-600 bg-slate-800 px-10 py-2 text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center">
                      <LockIcon />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPwd ? "text" : "password"}
                      value={form.password}
                      onChange={onChange}
                      className="w-full rounded-lg border border-slate-600 bg-slate-800 px-10 py-2 text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-slate-400 hover:text-slate-200"
                    >
                      {showPwd ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {err && (
                  <div className="rounded-lg border border-red-500/50 bg-red-900/30 px-3 py-2 text-sm text-red-400">
                    {err}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-black shadow-sm transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/50 border-t-transparent" />
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
                  <Link to="/admin/signup" className="font-medium text-emerald-400 hover:text-emerald-300">
                    Create Admin account
                  </Link>
                  <Link to="/user/signin" className="text-slate-400 hover:text-slate-200">
                    Sign in as User
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

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
          background-image: radial-gradient(currentColor 1px, transparent 1px);
          background-size: 18px 18px;
          color: #fff;
          mask-image: radial-gradient(circle at center, black 55%, transparent 72%);
        }
      `}</style>
    </div>
  );
}

/* ICONS */
function LogoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-emerald-400">
      <path
        d="M12 3l3.09 6.26L22 10.27l-5 4.9 1.18 7.06L12 18.9 5.82 22.23 7 15.17l-5-4.9 6.91-1.01L12 3z"
        fill="currentColor"
      />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400">
      <path
        fill="currentColor"
        d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14Z"
      />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400">
      <path
        fill="currentColor"
        d="M17 9h-1V7a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Zm-6 7.73V18h2v-1.27a2 2 0 1 0-2 0ZM9 7a3 3 0 1 1 6 0v2H9Z"
      />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-400">
      <path
        fill="currentColor"
        d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"
      />
    </svg>
  );
}
function SparklesIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-pink-400">
      <path
        fill="currentColor"
        d="M5 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4zm14 6l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2zm-6 5l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z"
      />
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="currentColor" d="M13 5l7 7-7 7v-4H4v-6h9V5z" />
    </svg>
  );
}
function LightningIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 text-indigo-400">
      <path fill="currentColor" d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
}
function DashboardSparklesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 text-slate-300"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 6h13M8 12h13M8 18h13" />
      <circle cx="3" cy="6" r="1.5" />
      <circle cx="3" cy="12" r="1.5" />
      <circle cx="3" cy="18" r="1.5" />
    </svg>
  );
}
