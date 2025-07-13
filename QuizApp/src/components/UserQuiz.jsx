import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

/**
 * UserQuiz — landing page for students
 * -------------------------------------------------
 * • Shows all public quizzes
 * • Highlights quizzes the user has already completed (green)
 * • Provides search‑by‑code
 * • Buttons adapt:
 *    - "Start Quiz" if not attempted
 *    - "View Result" if attempted
 */
function UserQuiz() {
  // ────────────────────────────────────────────────
  // State
  // ────────────────────────────────────────────────
  const [quizzes, setQuizzes] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [searchedQuiz, setSearchedQuiz] = useState(null);
  const [attemptedIds, setAttemptedIds] = useState(new Set());

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  // ────────────────────────────────────────────────
  // Fetch quizzes + attempted list on mount
  // ────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, attemptedRes] = await Promise.all([
          axios.get("http://localhost:3000/user/quiz", { headers: { token } }),
          axios.get("http://localhost:3000/user/attempted", { headers: { token } }) // { quizIds: [] }
        ]);
        setQuizzes(quizRes.data);
        setAttemptedIds(new Set(attemptedRes.data.quizIds || []));
      } catch (err) {
        console.error(err);
        alert("Failed to fetch quizzes");
      }
    };
    fetchData();
  }, [token]);

  // ────────────────────────────────────────────────
  // Handlers
  // ────────────────────────────────────────────────
  const handleSearch = () => {
    if (!searchCode.trim()) return alert("Please enter a quiz code");

    axios
      .get(`http://localhost:3000/user/quiz/viacode/${searchCode}`, { headers: { token } })
      .then((res) => {
        res.data ? setSearchedQuiz(res.data) : alert("Quiz not found");
      })
      .catch((err) => {
        console.error(err);
        alert("Invalid or expired code");
      });
  };

  const gotoQuiz = (quizId) => navigate(`/user/quiz/${quizId}`);
  const gotoLeaderboard = (quizId) => navigate(`/user/results/${quizId}`);

  // ────────────────────────────────────────────────
  // Quiz Card
  // ────────────────────────────────────────────────
  const QuizCard = ({ quiz }) => {
    const attempted = attemptedIds.has(quiz.id);

    const cardStyle = attempted
      ? "bg-emerald-50 border-emerald-300 hover:border-emerald-400"
      : "bg-white border-sky-200 hover:border-sky-400";

    return (
      <div
        onClick={() => (attempted ? gotoLeaderboard(quiz.id) : gotoQuiz(quiz.id))}
        className={`cursor-pointer max-w-md w-full rounded-3xl p-6 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 border ${cardStyle}`}
      >
        <h2 className="text-2xl font-bold text-sky-700 flex items-center gap-2">
          {quiz.title}
          {attempted && (
            <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">Completed</span>
          )}
        </h2>
        <p className="mt-2 text-slate-600 text-sm">
          Code: <span className="font-mono">{quiz.code || "N/A"}</span>
        </p>
        <p className="text-slate-600 text-sm mt-1">
          Created By: <span className="italic">{quiz.admin?.name || "Unknown"}</span>
        </p>

        <div className="mt-4 flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              attempted ? gotoLeaderboard(quiz.id) : gotoQuiz(quiz.id);
            }}
            className={`font-medium py-1.5 px-4 rounded-lg transition duration-200 ${
              attempted
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "bg-sky-500 hover:bg-sky-600 text-white"
            }`}
          >
            {attempted ? "View Result" : "Start Quiz"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              gotoLeaderboard(quiz.id);
            }}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-1.5 px-4 rounded-lg transition duration-200"
          >
            Leaderboard
          </button>
        </div>
      </div>
    );
  };

  // ────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────
  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-sky-50 to-sky-100 font-sans text-slate-800">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap mb-10">
        <h2 className="text-3xl font-extrabold text-sky-700 animate-pulse">
          Hello, <span className="text-sky-500 animate-pulse">{username}</span>
        </h2>

        {/* Search */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow border border-sky-200 animate-pulse">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Enter Quiz Code"
            className="outline-none border-none text-sm w-44 placeholder-slate-400"
          />
          <button
            onClick={handleSearch}
            className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-1.5 px-4 rounded-lg transition duration-200"
          >
            Search
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-sky-800 mb-8 decoration-wavy">
        Available Quizzes
      </h1>

      {/* List */}
      <div className="flex flex-wrap justify-center gap-10">
        {searchedQuiz ? (
          <div className="max-w-md w-full rounded-3xl p-6 flex flex-col gap-10">
            <QuizCard quiz={searchedQuiz} />
            <button
              className="self-start bg-sky-500 hover:bg-sky-600 text-white font-medium py-1.5 px-4 rounded-lg transition duration-200"
              onClick={() => window.location.reload()}
            >
              Back To Quizzes
            </button>
          </div>
        ) : quizzes.length === 0 ? (
          <p className="text-center text-lg text-slate-500 mt-10">No quizzes available</p>
        ) : (
          quizzes.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)
        )}
      </div>
    </div>
  );
}

export default UserQuiz;
