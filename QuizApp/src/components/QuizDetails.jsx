import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Clock,
  Check,
  X,
  HelpCircle,
  BarChart2,
  Target,
  Timer,
  BookOpen,
  Send,
} from "lucide-react";

// --- Custom Modal Component ---
const CustomModal = ({ isOpen, message, onConfirm, onCancel, showCancel = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 max-w-sm w-full text-center"
      >
        <p className="text-lg font-semibold text-white mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          {showCancel && (
            <button
              onClick={onCancel}
              className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`px-6 py-2 rounded-lg transition font-medium ${
              showCancel ? "bg-emerald-600 hover:bg-emerald-500" : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {showCancel ? 'Confirm' : 'OK'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};


// --- Helper & Static Components ---

const useInterval = (callback, delay) => {
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(callback, delay);
      return () => clearInterval(id);
    }
  }, [callback, delay]);
};

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-slate-900 text-slate-200">
    <Loader2 className="animate-spin w-8 h-8 mr-3 text-emerald-400" />
    <span className="text-xl">Loading Quiz...</span>
  </div>
);

const GlowingBlobs = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute w-[500px] h-[500px] bg-emerald-600/20 blur-3xl rounded-full -top-20 -left-40 animate-pulse-slow" />
    <div className="absolute w-[400px] h-[400px] bg-indigo-600/20 blur-3xl rounded-full -bottom-20 -right-40 animate-pulse-slow-delay" />
  </div>
);


// --- Quiz View Components ---

const ProgressCircle = ({ attempted, total }) => {
  const percentage = total > 0 ? (attempted / total) * 100 : 0;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle className="text-slate-700" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx="50" cy="50" />
        <motion.circle
          className="text-emerald-400"
          strokeWidth="8"
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          transform="rotate(-90 50 50)"
          strokeDasharray={circumference}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-white">{attempted}</span>
        <span className="text-xs text-slate-400">/{total}</span>
      </div>
    </div>
  );
};

const QuizSidebar = ({ quiz, responses, currentQ, setCurrentQ, onSubmit, submitting }) => {
  const attemptedCount = Object.keys(responses).length;
  const totalQ = quiz.questions.length;

  return (
    <aside className="w-full lg:w-1/3 lg:max-w-sm flex-shrink-0 bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-6 lg:h-[calc(100vh-5rem)]">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
          {quiz.title}
        </h1>
        <p className="text-sm text-slate-400 mt-1">Answer all questions to complete the quiz.</p>
      </div>
      <div className="flex items-center justify-around bg-slate-800/50 p-4 rounded-xl">
        <ProgressCircle attempted={attemptedCount} total={totalQ} />
        <div className="text-sm text-slate-300 space-y-2">
          <p><strong className="font-semibold text-white">{attemptedCount}</strong> Answered</p>
          <p><strong className="font-semibold text-white">{totalQ - attemptedCount}</strong> Remaining</p>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Question Navigator</h3>
        <div className="grid grid-cols-5 gap-2">
          {quiz.questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQ(index)}
              className={`w-10 h-10 rounded-md text-sm font-bold flex items-center justify-center transition-all duration-200 ${
                index === currentQ
                  ? "bg-emerald-500 text-slate-900 ring-2 ring-emerald-300 scale-110"
                  : responses[q.id]
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={onSubmit}
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-700 disabled:cursor-not-allowed text-slate-900 px-6 py-4 rounded-lg transition-all duration-200 font-bold shadow-lg hover:shadow-amber-500/30"
      >
        {submitting ? <Loader2 className="animate-spin" /> : <Send />}
        {submitting ? "Submitting..." : "Submit Quiz"}
      </button>
    </aside>
  );
};

const MainContent = ({ question, currentQ, totalQ, responses, onSelect, setCurrentQ }) => (
  <main className="w-full lg:w-2/3 flex flex-col">
    <AnimatePresence mode="wait">
      <motion.div
        key={currentQ}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-800/50 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl border border-emerald-500/30 flex-grow"
      >
        <p className="text-sm text-emerald-400 font-semibold mb-4 flex items-center gap-2">
          <BookOpen size={16} /> Question {currentQ + 1} of {totalQ}
        </p>
        <p className="text-xl md:text-2xl font-semibold mb-6 text-slate-100">{question.text}</p>
        <div className="space-y-4">
          {question.options.map((opt) => (
            <label
              key={opt.id}
              className={`group flex items-center gap-4 p-4 rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                responses[question.id] === opt.id
                  ? "bg-emerald-500/30 border-emerald-400 scale-[1.02]"
                  : "border-slate-600 hover:border-emerald-500 hover:bg-slate-700/50"
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={opt.id}
                checked={responses[question.id] === opt.id}
                onChange={() => onSelect(question.id, opt.id)}
                className="form-radio h-5 w-5 text-emerald-500 bg-slate-700 border-slate-500 focus:ring-emerald-500"
              />
              <span className="text-base text-slate-200 group-hover:text-white">{opt.text}</span>
            </label>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
    <div className="flex justify-between w-full mt-6">
      <button onClick={() => setCurrentQ((prev) => Math.max(prev - 1, 0))} disabled={currentQ === 0} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 px-6 py-3 rounded-lg transition font-medium shadow-md">
        <ChevronLeft size={20} /> Previous
      </button>
      <button onClick={() => setCurrentQ((prev) => Math.min(prev + 1, totalQ - 1))} disabled={currentQ === totalQ - 1} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 px-6 py-3 rounded-lg transition font-medium shadow-md">
        Next <ChevronRight size={20} />
      </button>
    </div>
  </main>
);


// --- Result View Components (FIXED) ---

const ScoreDonut = ({ score, total }) => {
  const percentage = total > 0 ? (score / total) * 100 : 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 140 140">
        <circle className="text-slate-700" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="70" cy="70" />
        <motion.circle
          className="text-emerald-400" strokeWidth="10" stroke="currentColor" fill="transparent"
          r={radius} cx="70" cy="70" strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "circOut" }}
          transform="rotate(-90 70 70)"
        />
      </svg>
      {/* FIX: Display only the score number and an 'out of' label */}
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-white">{score}</span>
        <span className="text-sm text-slate-400">out of {total}</span>
      </div>
    </div>
  );
};

const ResultSummary = ({ result, quiz }) => {
  // FIX: Re-introduce robust parsing for string-based server responses (e.g., "Correct: 8").
  // This safely handles strings, numbers, or even undefined values from the API.
  const totalCorrect = parseInt(String(result.totalCorrect || '').replace(/\D/g, ""), 10) || 0;
  const totalAttended = parseInt(String(result.totalAttended || '').replace(/\D/g, ""), 10) || 0;
  const totalQuestions = quiz.questions.length;
  
  const accuracy = totalAttended > 0 ? ((totalCorrect / totalAttended) * 100).toFixed(1) : 0;

  return (
    <div className="w-full lg:w-1/3 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col items-center gap-6">
      <h3 className="text-2xl font-bold text-white">Your Performance</h3>
      <ScoreDonut score={totalCorrect} total={totalQuestions} />
      <div className="w-full space-y-3 text-center">
        <div className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg"><div className="flex items-center gap-2 text-slate-300"><Target size={18} /> Accuracy</div><span className="font-bold text-lg text-white">{accuracy}%</span></div>
        <div className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg"><div className="flex items-center gap-2 text-slate-300"><BarChart2 size={18} /> Attempted</div><span className="font-bold text-lg text-white">{totalAttended} / {totalQuestions}</span></div>
        <div className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg"><div className="flex items-center gap-2 text-slate-300"><Timer size={18} /> Time Taken</div><span className="font-bold text-lg text-white">{formatTime(result.timeTaken)}</span></div>
      </div>
    </div>
  );
};

const ReviewQuestions = ({ questions, responses }) => {
  const [reviewIndex, setReviewIndex] = useState(0);
  const q = questions[reviewIndex];
  const userAns = responses[q.id];
  const correctAns = q.options.find((o) => o.isCorrect)?.id;

  return (
    <div className="w-full lg:w-2/3 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col">
      <h3 className="text-2xl font-bold text-white mb-4 shrink-0">Review Answers</h3>
      <div className="flex-grow p-4 rounded-lg bg-slate-900/70 overflow-y-auto min-h-0">
        <p className="font-semibold text-emerald-300 text-lg mb-4">Q{reviewIndex + 1}: {q.text}</p>
        <div className="space-y-2">
          {q.options.map((opt) => {
            const isUser = opt.id === userAns;
            const isCorrect = opt.id === correctAns;
            let styles = "bg-slate-700";
            if (isCorrect) styles = "bg-green-600/40 border border-green-500";
            if (isUser && !isCorrect) styles = "bg-red-600/40 border border-red-500";
            return (
              <div key={opt.id} className={`p-3 rounded-md text-sm flex justify-between items-center ${styles}`}>
                <span>{opt.text}</span>
                <div className="flex items-center gap-2">
                  {isCorrect && <Check size={18} className="text-green-400" />}
                  {isUser && !isCorrect && <X size={18} className="text-red-400" />}
                  {isUser && <span className="text-xs font-semibold text-slate-300">(Your Answer)</span>}
                </div>
              </div>
            );
          })}
        </div>
        {!userAns && (<p className="mt-4 text-sm text-yellow-400 font-medium flex items-center gap-2"><HelpCircle size={16} /> You did not answer this question.</p>)}
      </div>
      <div className="flex justify-between mt-4 shrink-0">
        <button onClick={() => setReviewIndex((prev) => Math.max(prev - 1, 0))} disabled={reviewIndex === 0} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40">Previous</button>
        <span className="text-slate-400">{reviewIndex + 1} / {questions.length}</span>
        <button onClick={() => setReviewIndex((prev) => Math.min(prev + 1, questions.length - 1))} disabled={reviewIndex === questions.length - 1} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40">Next</button>
      </div>
    </div>
  );
};


// --- Parent Component ---

function QuizPlayPage() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [redirectCountdown, setRedirectCountdown] = useState(120);
  const [timeLeft, setTimeLeft] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [onModalConfirm, setOnModalConfirm] = useState(() => () => {});
  const [onModalCancel, setOnModalCancel] = useState(() => () => {});

  // Fetch quiz data
  useEffect(() => {
    axios.get(`https://quizzes-backend-16wj.onrender.com/user/quiz/${id}`, { headers: { token } })
      .then((res) => {
        setQuiz(res.data);
        setTimeLeft(res.data.questions.length * 60);
      })
      .catch((err) => {
        console.error("Error fetching quiz:", err);
        setError("Failed to fetch the quiz. Please try again later.");
      });
  }, [id, token]);

  const triggerAlert = (message) => {
    setModalMessage(message);
    setShowCancelButton(false);
    setOnModalConfirm(() => () => setIsModalOpen(false));
    setIsModalOpen(true);
  };

  const internalSubmit = useCallback(async () => {
    setSubmitting(true);
    const totalTime = quiz.questions.length * 60;
    const timeTaken = totalTime - (timeLeft || 0);
    const formattedResponses = Object.entries(responses).map(
      ([questionId, selectedOptionId]) => ({ questionId, selectedOptionId })
    );

    try {
      const res = await axios.post(`https://quizzes-backend-16wj.onrender.com/user/quiz/${id}`,
        { responses: formattedResponses, timeTaken }, { headers: { token } });
      setResult(res.data);
    } catch (err) {
      console.error("Submission error:", err);
      triggerAlert("Failed to submit responses. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [responses, quiz, timeLeft, id, token]);

  const handleSubmit = useCallback(() => {
    if (Object.keys(responses).length === 0) {
      triggerAlert("Please attempt at least one question before submitting.");
      return;
    }

    setModalMessage("Are you sure you want to submit your quiz?");
    setShowCancelButton(true);
    setOnModalConfirm(() => () => {
      setIsModalOpen(false);
      internalSubmit();
    });
    setOnModalCancel(() => () => setIsModalOpen(false));
    setIsModalOpen(true);
  }, [responses, internalSubmit]);

  // Quiz countdown timer (auto-submit on timeout)
  useInterval(() => {
    if (timeLeft > 0 && !result) {
      setTimeLeft((prev) => prev - 1);
    } else if (timeLeft === 0 && !result) {
      internalSubmit();
    }
  }, 1000);

  // Redirect countdown after completion
  useInterval(() => {
    if (redirectCountdown > 0) setRedirectCountdown((c) => c - 1);
    else navigate("/user/dashboard");
  }, result ? 1000 : null);

  const handleOptionSelect = (questionId, optionId) => {
    setResponses((prev) => ({ ...prev, [questionId]: optionId }));
  };

  if (error) return <div className="min-h-screen flex items-center justify-center bg-red-900 text-white">{error}</div>;
  if (!quiz) return <LoadingSpinner />;

  // --- Render Logic ---

  if (result) {
    return (
      <div className="min-h-screen w-screen flex flex-col bg-gradient-to-br from-gray-900 to-slate-900 text-white p-4 sm:p-6 lg:p-8 relative">
        <GlowingBlobs />
        <div className="text-center mb-8 shrink-0">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Quiz Completed!</h1>
          <p className="mt-2 text-slate-400">Redirecting to dashboard in {redirectCountdown}s...</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto flex-grow min-h-0"
        >
          <ResultSummary result={result} quiz={quiz} />
          <ReviewQuestions questions={quiz.questions} responses={responses} />
        </motion.div>
        <div className="text-center mt-8 shrink-0">
          <button onClick={() => navigate("/user/quiz")} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg font-semibold transition">
            ← Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const isLowTime = timeLeft <= 30 && timeLeft !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900 text-white font-sans p-4 sm:p-6 lg:p-10 relative">
      <GlowingBlobs />
      {timeLeft !== null && (
        <div className={`fixed top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors duration-300 z-50 ${isLowTime ? "bg-red-500/20 border-red-500 text-red-300" : "bg-slate-800/50 border-slate-700 text-slate-200"}`}>
          <Clock className="w-5 h-5" />
          <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
        </div>
      )}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
        <QuizSidebar quiz={quiz} responses={responses} currentQ={currentQ} setCurrentQ={setCurrentQ} onSubmit={handleSubmit} submitting={submitting} />
        <MainContent question={quiz.questions[currentQ]} currentQ={currentQ} totalQ={quiz.questions.length} responses={responses} onSelect={handleOptionSelect} setCurrentQ={setCurrentQ} />
      </div>
      <CustomModal isOpen={isModalOpen} message={modalMessage} onConfirm={onModalConfirm} onCancel={onModalCancel} showCancel={showCancelButton} />
    </div>
  );
}

export default QuizPlayPage;

