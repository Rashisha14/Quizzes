import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ArrowRight, Users, Trophy, Brain, Star, CheckCircle } from "lucide-react";

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
  const [redirectCountdown, setRedirectCountdown] = useState(120);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);

  // helper to format time
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };


  // Fetch quiz
  useEffect(() => {
    axios
      .get(`http://localhost:3000/user/quiz/${id}`, { headers: { token } })
      .then((res) => {
        setQuiz(res.data);
        // total time = 1 min per question
        setTimeLeft(res.data.questions.length * 60);
      })
      .catch((err) => {
        console.error("Error fetching quiz:", err);
        alert("Failed to fetch quiz");
      });
  }, [id, token]);
  useEffect(() => {
    if (timeLeft === null || result) return;
    if (timeLeft <= 0) {
      handleSubmit(); // auto-submit
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, result]);

  //: warning at 30s
  useEffect(() => {
    if (timeLeft === 30) {
      alert("⚠ Only 30 seconds left!");
    }
  }, [timeLeft]);
  // countdown to redirect after result
  useEffect(() => {
    if (result) {
      const timer = setInterval(() => {
        setRedirectCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            navigate("/user/dashboard");
            return 0;
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [result, navigate]);


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

  // Calculate time taken
  const totalTime = quiz.questions.length * 60; // total quiz time in seconds
  const timeTaken = totalTime - (timeLeft || 0); // seconds spent

  try {
    const res = await axios.post(
      `http://localhost:3000/user/quiz/${id}`,
      { 
        responses: formattedResponses,
        timeTaken, // 🆕 send timeTaken
      },
      { headers: { token } }
    );

    setResult(res.data);

    // countdown redirect
    let countdown = 180;
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
      totalAttended > 0 ? ((totalCorrect / totalAttended) * 100).toFixed(2) : 0;

    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center 
      bg-gradient-to-br from-gray-950 via-emerald-950 to-indigo-950 text-white p-4 relative overflow-hidden">

        {/* Glowing blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="w-[350px] h-[350px] bg-emerald-600/30 blur-3xl rounded-full absolute top-10 left-10 animate-pulse" />
          <div className="w-[280px] h-[280px] bg-indigo-600/30 blur-3xl rounded-full absolute bottom-10 right-10 animate-pulse" />
        </div>

        {/* Container */}
        <div className="flex flex-col justify-between items-center h-full w-full max-w-5xl">

          {/* Completion icon + title */}
          <div className="flex flex-col items-center">
            <LightningIcon className="animate-ping" />
            <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-300 drop-shadow-lg">
              Quiz Completed!
            </h3>
            <p className="mt-2 text-[13px] text-gray-300">
              Redirecting to main page in{" "}
              <span className="font-semibold text-emerald-400">{redirectCountdown} sec</span>...
            </p>
            <br></br>
          </div>

          {/* Stats + review block */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl 
          w-full max-w-4xl flex-1 flex flex-col text-center p-6 border border-emerald-500/30 overflow-hidden">

            {/* Score summary */}
            <div className="space-y-1">
              <p className="text-base">Total Questions: {quiz.questions.length}</p>
              <p className="text-base">Attempted: {totalAttended}</p>
              <p className="text-base">Correct: {totalCorrect}</p>
              <div className="flex justify-center">
                <CheckCircle className="w-5 h-5 text-green-400 animate-ping" />
              </div>
              <p className="text-2xl font-bold text-emerald-300 mt-2">Score: {totalCorrect}</p>
              <p className="text-2xl font-bold text-emerald-300">Accuracy: {accuracy}%</p>
            </div>

            {/* Review Questions - scrollable inside box */}
            <div className="flex-1 overflow-y-auto px-2 py-2">
              {quiz.questions.map((q, idx) => {
                if (idx !== reviewIndex) return null;
                const userAns = responses[q.id];
                const correctAns = q.options.find((o) => o.isCorrect)?.id;

                return (
                  <div key={q.id} className="p-4 rounded-xl bg-gray-900/60 border border-gray-700">
                    <p className="font-semibold text-emerald-300 text-base">
                      Q{idx + 1}: {q.text}
                    </p>

                    <div className="mt-3 space-y-1">
                      {q.options.map((opt) => {
                        const isUser = opt.id === userAns;
                        const isCorrect = opt.id === correctAns;

                        return (
                          <div
                            key={opt.id}
                            className={`px-3 py-2 rounded-md text-sm
            ${isCorrect ? "bg-green-600/35 border border-green-500" : ""}
            ${isUser && !isCorrect ? "bg-red-600/25 border border-red-500" : ""}
            ${!isUser && !isCorrect ? "bg-gray-800/100" : ""}`}
                          >
                            {opt.text}
                          </div>
                        );
                      })}
                    </div>

                    {/* Show not answered label if skipped the question */}
                    {!userAns && (
                      <p className="mt-3 text-sm text-yellow-400 font-medium">
                        ⚠ Not Answered
                      </p>
                    )}
                  </div>


                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-1">
              <button
                onClick={() => setReviewIndex((prev) => Math.max(prev - 1, 0))}
                disabled={reviewIndex === 0}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-black text-sm"
              >
                Previous
              </button>
              <button
                onClick={() => setReviewIndex((prev) => Math.min(prev + 1, quiz.questions.length - 1))}
                disabled={reviewIndex === quiz.questions.length - 1}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-black text-sm"
              >
                Next
              </button>
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={() => navigate("/user/quiz")}
            className="mt-4 bg-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-400 
          text-black px-6 py-2 rounded-xl font-semibold shadow-md text-sm"
          >
            ← Back to Quizzes
          </button>
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
      {/*  Timer UI */}
      <div className="fixed top-5 right-5 bg-yellow-500/20 border-2 border-yellow-500 px-4 py-2 rounded-xl text-lg font-bold shadow-md flex items-center gap-2">
        <CountdownIcon/> {formatTime(timeLeft)}
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
              className={`flex items-center gap-3 px-5 py-3 rounded-xl cursor-pointer border transition-all duration-300 text-base ${responses[q.id] === opt.id
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
            className="flex items-center gap-2 bg-white/10 hover:bg-amber-400 px-10 py-3 rounded-xl transition font-bold shadow-md "
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        )}
      </div>
    </div>
  );
}

function CountdownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Circle clock outline */}
      <circle cx="12" cy="13" r="8" />
      {/* Clock hands */}
      <path d="M12 13V9" />   {/* hour hand */}
      <path d="M12 13h4" />   {/* minute hand */}
      {/* Small top button (like stopwatch) */}
      <path d="M9 3h6" />
    </svg>
  );
}


export default QuizDetails;
