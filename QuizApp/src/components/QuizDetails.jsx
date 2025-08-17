import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

// Custom icon for completion
function LightningIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-12 w-12 text-amber-500">
      <path
        fill="currentColor"
        d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
      />
    </svg>
  );
}

function QuizDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [responses, setResponses] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [redirectCountdown, setRedirectCountdown] = useState(6);

  // Fetch quiz
  useEffect(() => {
    axios
      .get(`http://localhost:3000/user/quiz/${id}`, { headers: { token } })
      .then((res) => setQuiz(res.data))
      .catch((err) => {
        console.error("Error fetching quiz:", err);
        alert("Failed to fetch quiz");
      });
  }, [id, token]);

  const handleOptionSelect = (questionId, optionId) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    const formattedResponses = Object.entries(responses).map(
      ([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      })
    );

    if (formattedResponses.length === 0) {
      alert("Please attempt at least one question.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/user/quiz/${id}`,
        { responses: formattedResponses },
        { headers: { token } }
      );

      setResult(res.data);

      // countdown redirect
      let countdown = 6;
      const interval = setInterval(() => {
        countdown--;
        setRedirectCountdown(countdown);
        if (countdown === 0) {
          clearInterval(interval);
          navigate("/user/quiz");
        }
      }, 1000);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit responses");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading
  if (!quiz)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-emerald-950 to-indigo-950 text-emerald-100">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading quiz...
      </div>
    );

    
  // After submission → result screen
  if (result) {
    const totalAttended = parseInt(result.totalAttended.replace(/\D/g, ""), 10) || 0;
const totalCorrect = parseInt(result.totalCorrect.replace(/\D/g, ""), 10) || 0;

const accuracy =
  totalAttended > 0
    ? ((totalCorrect / totalAttended) * 100).toFixed(2)
    : 0;


    return (
      <div className="min-h-screen flex flex-col items-center justify-center 
        bg-gradient-to-br from-gray-950 via-emerald-950 to-indigo-950 text-white p-8 relative overflow-hidden">
        
        {/* Glowing blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="w-[500px] h-[500px] bg-emerald-600/30 blur-3xl rounded-full absolute top-20 left-10 animate-pulse" />
          <div className="w-[400px] h-[400px] bg-indigo-600/30 blur-3xl rounded-full absolute bottom-20 right-10 animate-pulse" />
        </div>

        {/* Completion icon */}
        <LightningIcon />

        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-300 mb-6 drop-shadow-lg">
          Quiz Completed!
        </h2>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl w-full max-w-lg text-center space-y-4 border border-emerald-500/30">
          <p className="text-lg">Total Questions: {quiz.questions.length}</p>
          <p className="text-lg">Attempted: {totalAttended}</p>
          <p className="text-lg">Correct: {totalCorrect}</p>
          <br></br>
          <p className="text-2xl font-bold text-emerald-300 mt-4">Score: {totalCorrect}</p>
          <p className="text-2xl font-bold text-emerald-300 mt-4">Accuracy: {accuracy}%</p>
          <p className="mt-5 text-sm text-gray-300">
            Redirecting to quiz list in{" "}
            <span className="font-semibold text-emerald-400">
              {redirectCountdown}s
            </span>
            ...
          </p>
        </div>
      </div>
    );
  }

  // Main quiz UI
  const q = quiz.questions[currentQ];
  const attemptedCount = Object.keys(responses).length;
  const totalQ = quiz.questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-indigo-950 text-white font-sans flex flex-col items-center px-4 py-10 relative overflow-hidden">
      
      {/* Glowing blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="w-[600px] h-[600px] bg-emerald-600/20 blur-3xl rounded-full absolute top-20 left-10 animate-pulse" />
        <div className="w-[500px] h-[500px] bg-indigo-600/20 blur-3xl rounded-full absolute bottom-20 right-10 animate-pulse" />
      </div>

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-emerald-400 mb-10 drop-shadow-lg text-center">
        {quiz.title}
      </h1>

      {/* Progress bar */}
      <div className="w-full max-w-3xl mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Attempted: {attemptedCount}</span>
          <span>
            Question {currentQ + 1} / {totalQ}
          </span>
          <span>Remaining: {totalQ - attemptedCount}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-emerald-200 to-emerald-800 h-3 rounded-full shadow-lg transition-all duration-500"
            style={{
              width: `${(attemptedCount / totalQ) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-emerald-500/30 transition-all duration-500">
        <div className="flex items-start gap-3 mb-6">
          <span className="text-2xl font-bold text-emerald-300">
            Q{currentQ + 1}.
          </span>
          <p className="text-xl font-semibold">{q.text}</p>
        </div>

        <div className="space-y-4">
          {q.options.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl cursor-pointer border transition-all duration-300 text-base ${
                responses[q.id] === opt.id
                  ? "bg-gradient-to-r from-emerald-600/80 to-emerald-800/10 border-emerald-400 text-white shadow-md scale-[1.02]"
                  : "border-gray-600 hover:bg-white/10 hover:scale-[1.01]"
              }`}
            >
              <input
                type="radio"
                name={`question-${q.id}`}
                value={opt.id}
                checked={responses[q.id] === opt.id}
                onChange={() => handleOptionSelect(q.id, opt.id)}
                className="accent-emerald-500 w-4 h-4"
              />
              <span>{opt.text}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-6 mt-10">
        <button
          onClick={() => setCurrentQ((prev) => Math.max(prev - 1, 0))}
          disabled={currentQ === 0}
          className="flex items-center gap-2 bg-white/10 hover:bg-emerald-500 hover:text-black disabled:opacity-40 px-8 py-3 rounded-xl transition font-medium shadow-md"
        >
          <ChevronLeft /> Previous
        </button>

        {currentQ < totalQ - 1 ? (
          <button
            onClick={() =>
              setCurrentQ((prev) => Math.min(prev + 1, totalQ - 1))
            }
            className="flex items-center gap-2 bg-white/10 hover:bg-emerald-500 hover:text-black disabled:opacity-40 px-8 py-3 rounded-xl transition font-medium shadow-md"
          >
            Next <ChevronRight />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 bg-emerald-200 hover:bg-emerald-400 px-10 py-3 rounded-xl transition font-bold shadow-md text-black"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizDetails;
