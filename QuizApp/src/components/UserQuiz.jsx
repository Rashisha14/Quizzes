import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, PlayCircle, Trophy } from "lucide-react"; // icons
import "../App.css";

function UserQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [searchedQuiz, setSearchedQuiz] = useState(null);
  const [attemptedIds, setAttemptedIds] = useState(new Set());

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, attemptedRes] = await Promise.all([
          axios.get("http://localhost:3000/user/quiz", { headers: { token } }),
          axios.get("http://localhost:3000/user/attempted", { headers: { token } }),
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

  const handleSearch = () => {
    if (!searchCode.trim()) return alert("Please enter a quiz code");

    axios
      .get(`http://localhost:3000/user/quiz/viacode/${searchCode}`, {
        headers: { token },
      })
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

  const QuizCard = ({ quiz }) => {
    const attempted = attemptedIds.has(quiz.id);

    return (
      <div
    onClick={() => (attempted ? gotoLeaderboard(quiz.id) : gotoQuiz(quiz.id))}
    className={`cursor-pointer max-w-md w-full rounded-2xl p-6
      border backdrop-blur-md shadow-lg transition duration-300 transform
      hover:-translate-y-2 hover:scale-[1.02]
      ${
        attempted
          ? "border-emerald-500/60 bg-emerald-900/40 hover:shadow-emerald-400/40"
          : "border-emerald-500/40 bg-white/5 hover:shadow-emerald-500/30"
      }`}
  >
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          {quiz.title}
          {attempted && (
            <span className="text-xs bg-emerald-300 text-black px-2 py-0.5 rounded-full">
              Completed
            </span>
          )}
        </h2>
        <p className="mt-2 text-emerald-400 text-sm">
          Code: <span className="font-mono">{quiz.code || "N/A"}</span>
        </p>
        <p className="text-emerald-400 text-sm mt-1">
          Created By: <span className="italic">{quiz.admin?.name || "Unknown"}</span>
        </p>

        <div className="mt-5 flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              attempted ? gotoLeaderboard(quiz.id) : gotoQuiz(quiz.id);
            }}
            className={`flex items-center gap-2 font-medium py-2 px-5 rounded-xl transition duration-200 ${
              attempted
                ? "bg-emerald-500 hover:bg-emerald-600 text-black"
                : "bg-gradient-to-r from-emerald-800 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white"
            }`}
          >
            <PlayCircle size={18} />
            {attempted ? "View Result" : "Start Quiz"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              gotoLeaderboard(quiz.id);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-2 px-5 rounded-xl transition duration-200"
          >
            <Trophy size={18} />
            Leaderboard
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen px-6 py-10 
      bg-gradient-to-br from-black via-zinc-900 to-emerald-950 
      font-sans text-white relative overflow-hidden">

      {/* Subtle glowing background effect */}
      <div className="absolute inset-0 -z-10">
        <div className="w-[600px] h-[600px] bg-emerald-600/30 blur-3xl rounded-full absolute top-20 left-10 animate-pulse" />
        <div className="w-[500px] h-[500px] bg-purple-600/30 blur-3xl rounded-full absolute bottom-10 right-10 animate-pulse" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap mb-12">
        <h2 className="text-3xl font-extrabold drop-shadow-md">
          Hello, <span className="text-emerald-400">{username}</span>
        </h2>

        {/* Search */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl shadow border border-emerald-500/40">
          <Search className="text-emerald-400" size={18} />
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Enter Quiz Code"
            className="bg-transparent text-sm w-44 placeholder-gray-400 text-white outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-medium py-1.5 px-4 rounded-lg transition duration-200"
          >
            Search
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-600 mb-10 drop-shadow-lg">
        Available Quizzes
      </h1>

      {/* List */}
      <div className="flex flex-wrap justify-center gap-10">
        {searchedQuiz ? (
          <div className="max-w-md w-full rounded-3xl p-6 flex flex-col gap-10">
            <QuizCard quiz={searchedQuiz} />
            <button
              className="self-start bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-medium py-2 px-5 rounded-xl transition duration-200"
              onClick={() => window.location.reload()}
            >
              Back To Quizzes
            </button>
          </div>
        ) : quizzes.length === 0 ? (
          <p className="text-center text-lg text-gray-400 mt-10">
            No quizzes available
          </p>
        ) : (
          quizzes.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)
        )}
      </div>
    </div>
  );
}

export default UserQuiz;
