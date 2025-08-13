import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/user/signup");
  };

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] text-gray-800 overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute -top-20 -left-10 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-indigo-300 to-purple-300 opacity-60 blur-3xl animate-blob" />
      <div className="absolute -top-24 -right-8 w-[26rem] h-[26rem] rounded-full bg-gradient-to-tr from-pink-300 to-rose-300 opacity-60 blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-6rem] left-1/3 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-amber-300 to-yellow-300 opacity-60 blur-3xl animate-blob animation-delay-4000" />

      {/* Main Container */}
      <div className="relative max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 items-center gap-12">
        {/* Text Section */}
        <div className="space-y-6 animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
            Your Knowledge Journey Starts Here
          </h1>
          <p className="text-lg text-gray-600">
            Join thousands of learners. Take fun and challenging quizzes,
            compete with friends, and unlock your next level of knowledge.
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-6 pt-4">
            <div className="flex flex-col items-center text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3502/3502458.png"
                alt="Interactive"
                className="w-12 h-12 mb-2 floating"
              />
              <span className="text-sm font-semibold">Interactive</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1828/1828961.png"
                alt="Compete"
                className="w-12 h-12 mb-2 floating delay-1"
              />
              <span className="text-sm font-semibold">Compete</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Learn"
                className="w-12 h-12 mb-2 floating delay-2"
              />
              <span className="text-sm font-semibold">Learn</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleStart}
            className="mt-6 bg-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-500 transform hover:scale-105 transition"
          >
            🚀 Get Started
          </button>
        </div>

        {/* Hero Illustration */}
        <div className="flex justify-center animate-slideIn">
          <img
            src="https://quizizz.com/media/resource/gs/quizizz-media/quizzes/69faf064-9624-4634-9401-a5572734f7a0"
            alt="Quiz App Preview"
            className="rounded-2xl shadow-2xl max-w-full border border-gray-200"
          />
        </div>
      </div>

      {/* Inline animation CSS so it works without Tailwind config */}
      <style>{`
        /* Smooth blob movement */
        @keyframes blob {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(30px, -40px) scale(1.07); }
          66%  { transform: translate(-20px, 20px) scale(0.96); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 12s ease-in-out infinite;
          will-change: transform;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        /* Fade-in for left column */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 800ms ease-out both;
        }

        /* Slide-in for image on the right */
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 700ms ease-out 120ms both;
        }

        /* Gentle floating for icons */
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        .floating { animation: float 4s ease-in-out infinite; }
        .floating.delay-1 { animation-delay: .5s; }
        .floating.delay-2 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}
