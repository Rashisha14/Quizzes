import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

function UserQuiz() {

  const [quizzes, setQuizzes] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [searchedQuiz, setSearchedQuiz] = useState(null);
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();


  useEffect(() => {
    axios
      .get("http://localhost:3000/user/quiz", { headers: { token } })
      .then((res) => setQuizzes(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch quizzes");
      });
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

  const QuizCard = ({ quiz }) => (
    <div
      onClick={() => gotoQuiz(quiz.id)}
      className="cursor-pointer bg-white max-w-md w-full rounded-3xl p-6 shadow-lg hover:shadow-xl border border-sky-200 hover:border-sky-400 transition duration-300 transform hover:-translate-y-1"
    >
      <h2 className="text-2xl font-bold text-sky-700">{quiz.title}</h2>
      <p className="mt-2 text-slate-600 text-sm">
        Code: <span className="font-mono">{quiz.code || "N/A"}</span>
      </p>
      <p className="text-slate-600 text-sm mt-1">
        Created By: <span className="italic">{quiz.admin?.name || "Unknown"}</span>
      </p>

      {/* Card action buttons */}
      <div className="mt-4 flex gap-3">
        {/* Attempt quiz */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            gotoQuiz(quiz.id);
          }}
          className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-1.5 px-4 rounded-lg transition duration-200"
        >
          Start Quiz
        </button>

        {/* Leaderboard */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            gotoLeaderboard(quiz.id);
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-1.5 px-4 rounded-lg transition duration-200"
        >
          Leaderboard
        </button>
      </div>
    </div>
  );

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

      {/* Quiz list */}
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
          <p className="text-center text-lg text-slate-500 mt-10">
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
