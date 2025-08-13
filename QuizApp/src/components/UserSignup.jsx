import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function UserSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", name: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.username || !form.name || !form.password) {
      setErr("Please fill all fields.");
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://localhost:3000/user/signup", form);
      navigate("/user/signin");
    } catch (error) {
      setErr("Signup failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-stone-50">
      {/* Animated background */}
      <div className="pointer-events-none absolute -top-28 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-green-300 to-emerald-500 opacity-30 blur-3xl float-blob" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-purple-300 to-pink-400 opacity-30 blur-3xl float-blob-delay" />
      <div className="pointer-events-none absolute inset-0 dots-mask opacity-[0.07]" />

      <main className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-2">
        {/* Left side text */}
        <section className="order-2 md:order-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-3 py-1 text-xs font-medium text-emerald-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Create Your Account
          </div>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Join <span className="text-emerald-600">QuizArrow</span> Today
          </h1>
          <p className="mt-4 max-w-md text-slate-600">
            Start competing, learning, and climbing the leaderboard by creating your free account.
          </p>
        </section>

        {/* Right side signup form */}
        <section className="order-1 md:order-2">
          <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-xl backdrop-blur-md">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <LogoIcon />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Sign up</h2>
              <p className="mt-1 text-sm text-slate-500">
                Create your QuizArrow account
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
                    className="w-full rounded-lg border border-slate-300 bg-white px-10 py-2 text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <UserIcon className="h-4 w-4 text-slate-400" />
                  </span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={onChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-10 py-2 text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
                    placeholder="Enter your full name"
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
                    className="w-full rounded-lg border border-slate-300 bg-white px-10 py-2 text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-slate-500 hover:text-slate-700"
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
                className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-black shadow-sm transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/60 border-t-transparent" />
                    Signing up…
                  </>
                ) : (
                  
                  <>
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  Sign up</>
                )}
              </button>

              <div className="mt-3 flex items-center justify-between text-sm">
                <Link to="/user/signin" className="font-medium text-green-700 hover:text-green-900">
                  Already have account?
                </Link>
                <Link to="/admin/signup" className="text-slate-500 hover:text-slate-700">
                  Sign up as Admin
                </Link>
              </div>
            </form>
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
          background-image:
            radial-gradient(currentColor 1px, transparent 1px);
          background-size: 18px 18px;
          color: #0f172a;
          mask-image: radial-gradient(circle at center, black 55%, transparent 72%);
        }
      `}</style>
    </div>
  );
}

function LogoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-emerald-650">
      <path
        d="M12 3l3.09 6.26L22 10.27l-5 4.9 1.18 7.06L12 18.9 5.82 22.23 7 15.17l-5-4.9 6.91-1.01L12 3z"
        fill="currentColor"
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