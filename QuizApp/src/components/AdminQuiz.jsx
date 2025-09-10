import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function AdminQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const token = localStorage.getItem("adminToken");
  const adminName = localStorage.getItem("adminUsername");
  const navigate = useNavigate();

  // Fetch quizzes
  useEffect(() => {
    axios.get("http://localhost:3000/admin/quiz", {
      headers: { token }
    })
      .then((res) => setQuizzes(res.data))
      .catch(err => {
        console.error(err);
        alert("Failed to fetch your quizzes");
      });
  }, [token]);

  // Navigate to quiz detail
  const goToQuiz = (id) => {
    navigate(`/admin/quiz/${id}`);
  };

  // Navigate to leaderboard
  const goToLeaderboard = (id) => {
    navigate(`/admin/quiz/${id}/leaderboard`);
  };

  // Toggle quiz visibility change 
  const toggleQuizVisibility = async (id, hidden) => {
    try {
      await axios.patch(
        `http://localhost:3000/admin/quiz/${id}/toggle`,
        {},
        { headers: { token } }
      );

      // Optimistic update: update quizzes in state
      setQuizzes(prev =>
        prev.map(q =>
          q.id === id ? { ...q, hidden: !hidden } : q
        )
      );
    } catch (err) {
      console.error("Failed to toggle quiz:", err);
      alert("Failed to update quiz status");
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-fuchsia-50 to-purple-100 font-sans text-slate-800">
      <h2 className="text-3xl font-extrabold text-purple-700  mb-10">
        Welcome, <span className="text-purple-500 animate-pulse">{adminName}</span>
      </h2>

      <h1 className="text-4xl font-bold text-center text-purple-800 mb-8 decoration-wavy">
        Your Created Quizzes
      </h1>

      <div className="flex flex-wrap justify-center gap-10">
        {quizzes.length === 0 ? (
          <p className="text-center text-lg text-slate-500 mt-10">
            No quizzes created yet
          </p>
        ) : (
          quizzes.map((quiz, index) => (
            <div
              key={index}
              onClick={() => goToQuiz(quiz.id)}
              className="bg-white max-w-md w-full rounded-3xl p-6 shadow-lg border border-purple-200 cursor-pointer hover:scale-105 hover:border-purple-400 transition duration-300"
            >
              <h2
                className="text-2xl font-bold text-purple-700 "

              >
                {quiz.title}
              </h2>
              <p className="mt-2 text-slate-600 text-sm">
                Code: <span className="font-mono">{quiz.code || "N/A"}</span>
              </p>
              <p className="mt-1 text-sm">
                Status:{" "}
                <span
                  className={
                    quiz.hidden ? "text-red-500 font-semibold" : "text-green-600 font-semibold"
                  }
                >
                  {quiz.hidden ? "Hidden" : "Published"}
                </span>
              </p>

              {/* Action buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent parent div click
                    goToLeaderboard(quiz.id);
                  }}
                  className="px-4 py-2 rounded-xl cursor-pointer bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  View Leaderboard
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent parent div click
                    toggleQuizVisibility(quiz.id, quiz.hidden);
                  }}
                  className={`px-4 py-2 rounded-xl cursor-pointer text-white transition ${quiz.hidden
                      ? "bg-green-500 hover:bg-green-600 "
                      : "bg-red-500 hover:bg-red-600"
                    }`}
                >
                  {quiz.hidden ? "Publish Quiz" : "Hide Quiz"}
                </button>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminQuiz;
