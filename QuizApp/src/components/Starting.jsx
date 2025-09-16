import React, { useEffect, useState } from "react";
import {
  ArrowRight, Users, Trophy, Brain, Star, CheckCircle,
  Sparkles, Layers, Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  // Animated counters
  const [stats, setStats] = useState({ users: 0, quizzes: 0, countries: 0 });
  
  useEffect(() => {
    const targets = { users: 500, quizzes: 30, countries: 5 };
    const duration = 1500;
    const steps = 60;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setStats({
        users: Math.min(targets.users, Math.floor((targets.users / steps) * count)),
        quizzes: Math.min(targets.quizzes, Math.floor((targets.quizzes / steps) * count)),
        countries: Math.min(targets.countries, Math.floor((targets.countries / steps) * count)),
      });
      if (count >= steps) clearInterval(interval);
    }, duration / steps);

    return () => clearInterval(interval);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const featureCards = [
    { icon: <Users className="w-10 h-10 text-cyan-400 mx-auto" />, title: "Compete with Friends", desc: "Invite friends & battle it out on leaderboards." },
    { icon: <Brain className="w-10 h-10 text-purple-400 mx-auto" />, title: "Boost Your Skills", desc: "Grow with tailored quizzes for your level." },
    { icon: <Trophy className="w-10 h-10 text-pink-400 mx-auto" />, title: "Earn Rewards", desc: "Unlock badges and celebrate milestones." }
  ];

  const howItWorks = [
    { number: 1, title: "Sign Up", desc: "Create your free account in seconds.", icon: <Sparkles className="h-6 w-6 text-yellow-400" /> },
    { number: 2, title: "Choose a Quiz", desc: "Pick a topic you love from our library.", icon: <Layers className="h-6 w-6 text-purple-400" /> },
    { number: 3, title: "Play & Learn", desc: "Answer questions and climb the ranks.", icon: <Award className="h-6 w-6 text-pink-400" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-950/70 to-slate-950/90"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-500/5 to-transparent"></div>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse-slow-delay"></div>
      </div>

      {/* Hero Section with Integrated Stats */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 py-20 max-w-7xl mx-auto z-10">
        <div className="relative z-10 space-y-6 text-center">
          <motion.h1
            {...fadeIn}
            className="text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Level Up Your Mind <br /> One Quiz at a Time
          </motion.h1>
          <motion.p
            {...fadeIn}
            transition={{ delay: 0.2 }}
            className="text-lg opacity-80 max-w-lg mx-auto text-slate-300"
          >
            Challenge yourself with interactive quizzes, live competitions, and progress tracking. Join our global community of learners.
          </motion.p>

          <motion.div
            {...fadeIn}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="user/signin"
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:shadow-purple-500/40 transition-all duration-300"
            >
              🚀 Start Now <ArrowRight className="w-5 h-5" />
            </motion.a>
            <a
              href="#features"
              className="bg-white/10 text-white font-bold py-4 px-8 rounded-full shadow-lg border border-slate-700 hover:bg-white/20 transition"
            >
              Learn More
            </a>
          </motion.div>
        </div>

        {/* Stats Section Integrated */}
        <motion.div 
          {...fadeIn} 
          transition={{ delay: 0.6 }} 
          className="mt-16 w-full"
        >
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-15 text-center">
            <motion.div {...fadeIn} transition={{ delay: 0.7 }}>
              <p className="text-5xl font-extrabold text-cyan-400">{stats.users}+</p>
              <p className="text-slate-400 mt-1">Active Users</p>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.8 }}>
              <p className="text-5xl font-extrabold text-purple-400">{stats.quizzes}+</p>
              <p className="text-slate-400 mt-1">Quizzes</p>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.9 }}>
              <p className="text-5xl font-extrabold text-pink-400">{stats.countries}+</p>
              <p className="text-slate-400 mt-1">Countries</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 text-slate-100 z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            {...fadeIn}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Why Choose QuizMaster?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {featureCards.map((f, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.2, duration: 0.5 }}
                className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-slate-800 hover:scale-[1.03] transition-transform duration-300"
              >
                {f.icon}
                <h3 className="font-semibold text-xl mb-2 mt-4">{f.title}</h3>
                <p className="text-slate-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 text-slate-100 z-10 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            {...fadeIn}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {howItWorks.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.2, duration: 0.5 }}
                className="relative p-8 rounded-2xl shadow-xl border border-slate-700 bg-slate-800/60"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 rounded-full p-4 border border-purple-500 shadow-lg">
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{step.number}</span>
                </div>
                <div className="mt-8 flex flex-col items-center">
                  {step.icon}
                  <h3 className="font-semibold text-xl mb-2 mt-4">{step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-slate-900/50 overflow-hidden z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Our Players Say
        </h2>
        <div className="relative w-full">
          <div className="flex gap-8 animate-marquee">
            {[
              { icon: <Star className="w-6 h-6 text-yellow-400" />, text: "This is my go-to app for fun and learning!", name: "Aarav Mehta" },
              { icon: <CheckCircle className="w-6 h-6 text-emerald-400" />, text: "The UI is stunning and the quizzes are addictive!", name: "Priya Sharma" },
              { icon: <Star className="w-6 h-6 text-yellow-400" />, text: "Helped me improve my knowledge while having fun.", name: "Rahul Verma" },
              { icon: <CheckCircle className="w-6 h-6 text-emerald-400" />, text: "Quizzes are challenging and fun at the same time!", name: "Sara Ali" },
              { icon: <Star className="w-6 h-6 text-yellow-400" />, text: "I love competing with my friends!", name: "David Lee" },
              { icon: <CheckCircle className="w-6 h-6 text-emerald-400" />, text: "Amazing rewards system, keeps me motivated.", name: "Nina Kapoor" }
            ].concat([
              // duplicate for seamless loop
              { icon: <Star className="w-6 h-6 text-yellow-400" />, text: "This is my go-to app for fun and learning!", name: "Aarav Mehta" },
              { icon: <CheckCircle className="w-6 h-6 text-emerald-400" />, text: "The UI is stunning and the quizzes are addictive!", name: "Priya Sharma" },
              { icon: <Star className="w-6 h-6 text-yellow-400" />, text: "Helped me improve my knowledge while having fun.", name: "Rahul Verma" },
              { icon: <CheckCircle className="w-6 h-6 text-emerald-400" />, text: "Quizzes are challenging and fun at the same time!", name: "Sara Ali" },
              { icon: <Star className="w-6 h-6 text-yellow-400" />, text: "I love competing with my friends!", name: "David Lee" },
              { icon: <CheckCircle className="w-6 h-6 text-emerald-400" />, text: "Amazing rewards system, keeps me motivated.", name: "Nina Kapoor" }
            ]).map((t, idx) => (
              <div
                key={idx}
                className="bg-white/5 p-6 rounded-2xl shadow-lg border border-slate-700 min-w-[280px] max-w-[280px] flex-shrink-0"
              >
                {t.icon}
                <p className="mt-4 italic text-slate-300">"{t.text}"</p>
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
      <footer className="bg-black/50 text-slate-400 py-6 text-center mt-auto border-t border-slate-800 z-10">
        <p className="text-sm">
          © {new Date().getFullYear()} QuizMaster. All Rights Reserved.
        </p>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.2; }
        }
        .animate-pulse-slow { animation: pulse-slow 6s infinite ease-in-out; }
        .animate-pulse-slow-delay { animation: pulse-slow 6s infinite ease-in-out 3s; }
        
        @keyframes spin-slow-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow-reverse { animation: spin-slow-reverse 10s linear infinite; }
      `}</style>
    </div>
  );
}

export default App;
