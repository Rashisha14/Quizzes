import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, Users, Trophy, Brain, Star, CheckCircle, 
  Award, Clock, ChevronDown, BookOpen, TrendingUp, Shield,
  Globe, Zap, Heart
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const handleStart = () => navigate("/user/signup");
  const handleLearnMore = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  // Animated counters
  const [stats, setStats] = useState({ users: 0, quizzes: 0, questions: 0 });
  useEffect(() => {
    const targets = { users: 10000, quizzes: 500, questions: 25000 };
    const duration = 2000;
    const steps = 60;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setStats({
        users: Math.floor((targets.users / steps) * count),
        quizzes: Math.floor((targets.quizzes / steps) * count),
        questions: Math.floor((targets.questions / steps) * count),
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
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-600 to-cyan-500 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              QuizMaster
            </span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition">Testimonials</a>
            <a href="#stats" className="text-gray-300 hover:text-white transition">Stats</a>
          </div>
          
          <div>
            <button 
              onClick={handleStart}
              className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-medium py-2 px-6 rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 py-20 max-w-7xl mx-auto">
        {/* Background Elements */}
        <div className="absolute -top-20 -left-10 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 opacity-20 blur-3xl animate-blob" />
        <div className="absolute -top-24 -right-8 w-[26rem] h-[26rem] rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 opacity-20 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-6rem] left-1/3 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 opacity-20 blur-3xl animate-blob animation-delay-4000" />

        {/* Content */}
        <div className="relative z-10 text-center space-y-8 fade-up opacity-0 translate-y-10 transition duration-700 max-w-3xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Challenge Your Mind
            </span>
            <br />
            <span className="text-white">Master Any Subject</span>
          </h1>
          
          <p className="text-xl opacity-80 max-w-2xl mx-auto text-gray-300">
            Join thousands of learners worldwide who use QuizMaster to test their knowledge, 
            compete with friends, and track their progress.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-full shadow-lg hover:scale-105 hover:shadow-purple-500/40 transition-all duration-300"
            >
              🚀 Start Learning Now <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleLearnMore}
              className="bg-white/10 text-white font-bold py-4 px-8 rounded-full shadow-lg border border-gray-700 hover:bg-white/20 transition"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 fade-up opacity-0 translate-y-10 transition duration-700 delay-1000">
          <div className="animate-bounce">
            <ChevronDown className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section id="stats" className="py-20 bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-800/30 p-8 rounded-2xl backdrop-blur-md border border-gray-700/50 hover:border-cyan-500/30 transition-all fade-up opacity-0 translate-y-10">
              <div className="flex justify-center mb-4">
                <div className="bg-cyan-500/10 p-4 rounded-full">
                  <Users className="w-8 h-8 text-cyan-400" />
                </div>
              </div>
              <p className="text-5xl font-bold text-cyan-400">{stats.users}+</p>
              <p className="text-gray-400 mt-2">Active Learners</p>
            </div>
            
            <div className="bg-gray-800/30 p-8 rounded-2xl backdrop-blur-md border border-gray-700/50 hover:border-purple-500/30 transition-all fade-up opacity-0 translate-y-10 delay-200">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-500/10 p-4 rounded-full">
                  <BookOpen className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <p className="text-5xl font-bold text-purple-400">{stats.quizzes}+</p>
              <p className="text-gray-400 mt-2">Expert Quizzes</p>
            </div>
            
            <div className="bg-gray-800/30 p-8 rounded-2xl backdrop-blur-md border border-gray-700/50 hover:border-pink-500/30 transition-all fade-up opacity-0 translate-y-10 delay-400">
              <div className="flex justify-center mb-4">
                <div className="bg-pink-500/10 p-4 rounded-full">
                  <Zap className="w-8 h-8 text-pink-400" />
                </div>
              </div>
              <p className="text-5xl font-bold text-pink-400">{stats.questions}+</p>
              <p className="text-gray-400 mt-2">Questions Answered</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-black text-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="fade-up opacity-0 translate-y-10 transition duration-700 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Powerful Learning Features</h2>
            <p className="text-xl text-gray-400 mb-16">
              Everything you need to master new topics and track your progress
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[
              { 
                icon: <TrendingUp className="w-10 h-10 text-cyan-400 mx-auto" />, 
                title: "Progress Tracking", 
                desc: "Visualize your learning journey with detailed analytics and progress reports." 
              },
              { 
                icon: <Users className="w-10 h-10 text-purple-400 mx-auto" />, 
                title: "Compete with Friends", 
                desc: "Challenge friends, join tournaments, and climb the global leaderboards." 
              },
              { 
                icon: <Brain className="w-10 h-10 text-pink-400 mx-auto" />, 
                title: "Adaptive Learning", 
                desc: "AI-powered quizzes that adapt to your skill level for optimal learning." 
              },
              { 
                icon: <Award className="w-10 h-10 text-yellow-400 mx-auto" />, 
                title: "Earn Achievements", 
                desc: "Unlock badges, trophies, and certificates as you master new subjects." 
              },
              { 
                icon: <Clock className="w-10 h-10 text-green-400 mx-auto" />, 
                title: "Time Challenges", 
                desc: "Test your knowledge under pressure with timed quiz modes." 
              },
              { 
                icon: <Shield className="w-10 h-10 text-blue-400 mx-auto" />, 
                title: "Secure Environment", 
                desc: "Your data is always protected with enterprise-grade security." 
              }
            ].map((f, idx) => (
              <div key={idx} className="group p-8 bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl shadow-lg border border-gray-800 hover:border-cyan-500/30 transition-all duration-300 fade-up opacity-0 translate-y-10">
                <div className="bg-gray-800/50 p-4 rounded-full w-max mx-auto group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-xl mb-4 mt-6">{f.title}</h3>
                <p className="text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 fade-up opacity-0 translate-y-10 transition duration-700">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Trusted by Learners Worldwide</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join thousands of satisfied users who have transformed their learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                text: "QuizMaster completely changed how I prepare for exams. The adaptive learning feature is genius!", 
                name: "Sarah Johnson", 
                role: "Medical Student",
                color: "from-cyan-500/10 to-cyan-600/10",
                border: "border-cyan-500/20"
              },
              { 
                text: "I've tried countless quiz apps, but none come close to the user experience and content quality of QuizMaster.", 
                name: "Michael Chen", 
                role: "Software Engineer",
                color: "from-purple-500/10 to-purple-600/10",
                border: "border-purple-500/20"
              },
              { 
                text: "As a teacher, I recommend QuizMaster to all my students. The progress tracking helps me identify areas where they need help.", 
                name: "Dr. Emma Rodriguez", 
                role: "High School Teacher",
                color: "from-pink-500/10 to-pink-600/10",
                border: "border-pink-500/20"
              }
            ].map((t, idx) => (
              <div 
                key={idx} 
                className={`bg-gradient-to-br ${t.color} p-6 rounded-2xl shadow-lg border ${t.border} backdrop-blur-sm fade-up opacity-0 translate-y-10 transition duration-700`}
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="italic text-gray-200 mb-6">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-cyan-300">{t.name}</p>
                  <p className="text-sm text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-black">
        <div className="max-w-5xl mx-auto px-6 text-center fade-up opacity-0 translate-y-10 transition duration-700">
          <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-3xl p-12 border border-gray-800/50 backdrop-blur-md">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Challenge Yourself?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join our community of knowledge seekers and start your learning journey today
            </p>
            <button
              onClick={handleStart}
              className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:scale-105 hover:shadow-purple-500/30 transition-all duration-300 text-lg"
            >
              Get Started For Free
            </button>
            <p className="text-gray-500 mt-6 text-sm">No credit card required • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-cyan-500 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">QuizMaster</span>
            </div>
            <p className="text-sm mb-4">
              The modern platform for effective and engaging learning through quizzes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-white transition">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition">
                <Heart className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Features</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">Templates</a></li>
              <li><a href="#" className="hover:text-white transition">Examples</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Tutorials</a></li>
              <li><a href="#" className="hover:text-white transition">Support</a></li>
              <li><a href="#" className="hover:text-white transition">Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Partners</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800/50 text-center text-sm">
          <p>© {new Date().getFullYear()} QuizMaster. All rights reserved.</p>
        </div>
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