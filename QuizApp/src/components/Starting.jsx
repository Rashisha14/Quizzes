import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Users, Trophy, Brain, Star, CheckCircle } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const handleStart = () => navigate("/user/signup");

  // Animated counters
  const [stats, setStats] = useState({ users: 0, quizzes: 0, countries: 0 });
  useEffect(() => {
    const targets = { users: 500, quizzes: 30, countries: 5 };
    const duration = 2000;
    const steps = 60;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setStats({
        users: Math.floor((targets.users / steps) * count),
        quizzes: Math.floor((targets.quizzes / steps) * count),
        countries: Math.floor((targets.countries / steps) * count),
      });
      if (count >= steps) clearInterval(interval);
    }, duration / steps);
  }, []);

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("opacity-100", "translate-y-0");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-x-hidden">
      {/* HERO */}
      <section className="relative flex flex-col md:flex-row items-center justify-between flex-grow px-6 py-20 max-w-7xl mx-auto">
        {/* Background Blobs */}
        <div className="absolute -top-20 -left-10 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 opacity-25 blur-3xl animate-blob" />
        <div className="absolute -top-24 -right-8 w-[26rem] h-[26rem] rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 opacity-25 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-6rem] left-1/3 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 opacity-25 blur-3xl animate-blob animation-delay-4000" />

        {/* Content */}
        <div className="relative z-10 space-y-6 fade-up opacity-0 translate-y-10 transition duration-700 md:w-1/2">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
            Level Up Your Mind <br /> One Quiz at a Time
          </h1>
          <p className="text-lg opacity-80 max-w-lg text-gray-300">
            Challenge yourself with interactive quizzes, live competitions, and progress tracking. Join {stats.users}+ learners worldwide.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:scale-105 hover:shadow-purple-500/40 transition-all duration-300"
            >
              🚀 Start Now <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#features"
              className="bg-white/10 text-white font-bold py-4 px-8 rounded-full shadow-lg border border-gray-700 hover:bg-white/20 transition"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="flex justify-center fade-up opacity-0 translate-y-10 transition duration-700 delay-200 md:w-1/2">
          <img
            src="https://quizizz.com/media/resource/gs/quizizz-media/quizzes/69faf064-9624-4634-9401-a5572734f7a0"
            alt="Quiz App Preview"
            className="rounded-2xl shadow-2xl max-w-full border border-gray-800"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-black/90 text-white text-center">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-15">
          <div>
            <p className="text-4xl font-bold text-cyan-400">{stats.users}+</p>
            <p className="text-gray-400">Active Users</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-purple-400">{stats.quizzes}+</p>
            <p className="text-gray-400">Quizzes</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-pink-400">{stats.countries}+</p>
            <p className="text-gray-400">Countries</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-900 text-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center fade-up opacity-0 translate-y-10 transition duration-700">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose QuizApp?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: <Users className="w-10 h-10 text-cyan-400 mx-auto" />, title: "Compete with Friends", desc: "Invite friends & battle it out on leaderboards." },
              { icon: <Brain className="w-10 h-10 text-purple-400 mx-auto" />, title: "Boost Your Skills", desc: "Grow with tailored quizzes for your level." },
              { icon: <Trophy className="w-10 h-10 text-pink-400 mx-auto" />, title: "Earn Rewards", desc: "Unlock badges and celebrate milestones." }
            ].map((f, idx) => (
              <div key={idx} className="p-6 bg-white/5 backdrop-blur-lg rounded-xl shadow-lg border border-gray-800 hover:scale-105 transition">
                {f.icon}
                <h3 className="font-semibold text-lg mb-2 mt-4">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
<section className="px-6 py-16 bg-gradient-to-br from-gray-800 via-gray-900 to-black overflow-hidden">
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
    What Our Players Say
  </h2>

  <div className="relative w-full">
    <div className="flex gap-8 animate-marquee">
      {[
        { icon: <Star className="w-6 h-6 text-yellow-400" />, text: "This is my go-to app for fun and learning!", name: "Aarav Mehta" },
        { icon: <CheckCircle className="w-6 h-6 text-green-400" />, text: "The UI is stunning and the quizzes are addictive!", name: "Priya Sharma" },
        { icon: <Star className="w-6 h-6 text-yellow-400" />, text: "Helped me improve my knowledge while having fun.", name: "Rahul Verma" },
        { icon: <CheckCircle className="w-6 h-6 text-green-400" />, text: "Quizzes are challenging and fun at the same time!", name: "Sara Ali" },
        { icon: <Star className="w-6 h-6 text-yellow-400" />, text: "I love competing with my friends!", name: "David Lee" },
        { icon: <CheckCircle className="w-6 h-6 text-green-400" />, text: "Amazing rewards system, keeps me motivated.", name: "Nina Kapoor" }
      ].concat([
        // duplicate for seamless loop
        { icon: <Star className="w-6 h-6 text-yellow-400" />, text: "This is my go-to app for fun and learning!", name: "Aarav Mehta" },
        { icon: <CheckCircle className="w-6 h-6 text-green-400" />, text: "The UI is stunning and the quizzes are addictive!", name: "Priya Sharma" },
        { icon: <Star className="w-6 h-6 text-yellow-400" />, text: "Helped me improve my knowledge while having fun.", name: "Rahul Verma" },
        { icon: <CheckCircle className="w-6 h-6 text-green-400" />, text: "Quizzes are challenging and fun at the same time!", name: "Sara Ali" },
        { icon: <Star className="w-6 h-6 text-yellow-400" />, text: "I love competing with my friends!", name: "David Lee" },
        { icon: <CheckCircle className="w-6 h-6 text-green-400" />, text: "Amazing rewards system, keeps me motivated.", name: "Nina Kapoor" }
      ]).map((t, idx) => (
        <div
          key={idx}
          className="bg-white/5 p-6 rounded-2xl shadow-lg border border-gray-700 min-w-[280px] max-w-[280px] flex-shrink-0"
        >
          {t.icon}
          <p className="mt-4 italic text-gray-300">"{t.text}"</p>
          <p className="mt-3 font-semibold text-cyan-300">{t.name}</p>
        </div>
      ))}
    </div>
  </div>

  <style>{`
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee {
      display: flex;
      width: max-content;
      animation: marquee 50s linear infinite;
    }
  `}</style>
</section>


      {/* Footer */}
      <footer className="bg-black text-gray-400 py-6 text-center mt-auto border-t border-gray-800">
        <p className="text-sm">
          © {new Date().getFullYear()} QuizMaster. All Rights Reserved.
        </p>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.07); }
          66% { transform: translate(-20px, 20px) scale(0.96); }
        }
        .animate-blob { animation: blob 12s ease-in-out infinite; will-change: transform; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradient 6s ease infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
