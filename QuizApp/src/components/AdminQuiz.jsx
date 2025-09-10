import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, X, Award } from "lucide-react";
import '../App.css';

function AdminQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  const goToQuiz = (id) => navigate(`/admin/quiz/${id}`);
  const goToLeaderboard = (id) => navigate(`/admin/quiz/${id}/leaderboard`);
  
  const toggleQuizVisibility = async (id, hidden) => {
    try {
      await axios.patch(`http://localhost:3000/admin/quiz/${id}/toggle`, {}, { headers: { token } });
      setQuizzes(prev => prev.map(q => q.id === id ? { ...q, hidden: !hidden } : q));
    } catch (err) {
      console.error("Failed to toggle quiz:", err);
      alert("Failed to update quiz status");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/signin");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-fuchsia-50 to-purple-100 text-slate-800 relative">

      {/* Sidebar */}
      <aside className={`transition-all duration-300 ${sidebarOpen ? "w-64 p-6" : "w-16 p-4"} bg-purple-700/80 flex flex-col justify-between`}>
        <div className="flex flex-col items-center w-full">
          {/* Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-6 text-white self-end"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Profile Avatar */}
          <div className={`flex items-center justify-center rounded-full bg-purple-500 text-white font-bold transition-all duration-300 ${sidebarOpen ? "w-24 h-24 text-4xl mb-4" : "w-12 h-12 text-xl mb-2"}`}>
            {adminName?.charAt(0).toUpperCase()}
          </div>

          {/* Profile Info */}
          {sidebarOpen && (
            <div className="text-center mb-6 space-y-2 w-full">
              <div className="flex items-center justify-center gap-2 text-white font-bold text-lg">
                <User size={25} className="text-emerald-400" />
                {adminName}
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-300 font-medium text-sm mt-2">
                <Award size={20} className="text-emerald-400" />
                Total Quizzes Created: {quizzes.length}
              </div>
            </div>
          )}

          {/* Logout */}
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full justify-center px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 py-10">
        <h2 className="text-3xl font-extrabold text-purple-700 mb-6">
          Welcome, <span className="text-purple-500 animate-pulse">{adminName}</span>
        </h2>

        <h1 className="text-4xl font-bold text-center text-purple-800 mb-8">
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
                <h2 className="text-2xl font-bold text-purple-700">{quiz.title}</h2>
                <p className="mt-2 text-slate-600 text-sm">
                  Code: <span className="font-mono">{quiz.code || "N/A"}</span>
                </p>
                <p className="mt-1 text-sm">
                  Status:{" "}
                  <span className={quiz.hidden ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
                    {quiz.hidden ? "Hidden" : "Published"}
                  </span>
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); goToLeaderboard(quiz.id); }}
                    className="px-4 py-2 rounded-xl cursor-pointer bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    View Leaderboard
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleQuizVisibility(quiz.id, quiz.hidden); }}
                    className={`px-4 py-2 rounded-xl cursor-pointer text-white transition ${quiz.hidden ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                  >
                    {quiz.hidden ? "Publish Quiz" : "Hide Quiz"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminQuiz;
