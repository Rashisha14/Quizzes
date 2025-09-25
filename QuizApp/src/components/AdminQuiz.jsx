import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  User, LogOut, Menu, X, Award, PlusCircle,
  BarChart3, Eye, EyeOff, Trophy, Calendar, User as UserIcon, CheckCircle, XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// New reusable Notification component
const Notification = ({ message, type, onClose }) => {
  let bgColor, Icon;
  switch (type) {
    case 'success':
      bgColor = 'bg-emerald-600/90';
      Icon = CheckCircle;
      break;
    case 'error':
      bgColor = 'bg-rose-600/90';
      Icon = XCircle;
      break;
    default:
      bgColor = 'bg-blue-600/90';
      Icon = CheckCircle;
  }
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 p-4 rounded-xl shadow-xl text-white ${bgColor} border border-white/10 backdrop-blur-md`}
    >
      <Icon size={24} />
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="text-white/80 hover:text-white transition">
        <X size={20} />
      </button>
    </motion.div>
  );
};

// New helper function to show a notification
const showNotification = (message, type, setNotification) => {
  setNotification({ visible: true, message, type });
  setTimeout(() => {
    setNotification(prev => ({ ...prev, visible: false }));
  }, 5000);
};


function AdminQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ visible: false, message: '', type: '' });

  const token = localStorage.getItem("adminToken");
  const adminName = localStorage.getItem("adminName");
  const adminUsername = localStorage.getItem("adminUsername");

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    // UPDATED URL HERE
    axios.get("https://quizzes-backend-16wj.onrender.com/admin/quiz", { headers: { token } })
      .then((res) => {
        setQuizzes(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
        showNotification("Failed to fetch your quizzes.", "error", setNotification);
      });
  }, [token]);

  const goToQuiz = (id) => navigate(`/admin/quiz/${id}`);
  const goToLeaderboard = (id, e) => {
    e.stopPropagation();
    navigate(`/admin/results/${id}`);
  };

  const toggleQuizVisibility = async (id, hidden, e) => {
    e.stopPropagation();
    try {
      // UPDATED URL HERE
      await axios.patch(`https://quizzes-backend-16wj.onrender.com/admin/quiz/${id}/toggle`, {}, { headers: { token } });
      setQuizzes(prev => prev.map(q => q.id === id ? { ...q, hidden: !hidden } : q));
      showNotification(`Quiz is now ${!hidden ? 'hidden' : 'published'}.`, "success", setNotification);
    } catch (err) {
      console.error("Failed to toggle quiz:", err);
      showNotification("Failed to update quiz status.", "error", setNotification);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminUsername");
    navigate("/admin/signin");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-gray-950 text-white relative">
      <AnimatePresence>
        {notification.visible && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ ...notification, visible: false })}
          />
        )}
      </AnimatePresence>

      <aside className={`transition-all duration-300 ease-in-out ${sidebarOpen ? "w-64" : "w-20"} bg-gray-800 flex flex-col justify-between overflow-hidden`}>
        <div className="p-5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-6 text-amber-400 hover:text-amber-300 transition p-2 rounded-lg hover:bg-gray-700"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-2xl mb-3">
              {adminName?.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <>
                <h3 className="text-lg font-semibold text-white text-center">{adminName}</h3>
                <p className="text-gray-400 text-sm flex items-center mt-1">
                  <UserIcon size={14} className="mr-1 text-amber-400" />
                  @{adminUsername}
                </p>
                <p className="text-gray-400 text-sm flex items-center mt-3">
                  <Award size={14} className="mr-1 text-amber-400" />
                  {quizzes.length} {quizzes.length === 1 ? 'Quiz' : 'Quizzes'}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-gray-700">
          {sidebarOpen ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Quiz Dashboard</h1>
            <p className="text-gray-400">
              Welcome back, <span className="text-amber-400 font-medium">{adminName}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400 text-sm">Total Quizzes</h3>
                <BarChart3 className="h-5 w-5 text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-white mt-2">{quizzes.length}</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400 text-sm">Published</h3>
                <Eye className="h-5 w-5 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-white mt-2">
                {quizzes.filter(q => !q.hidden).length}
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400 text-sm">Hidden</h3>
                <EyeOff className="h-5 w-5 text-red-400" />
              </div>
              <p className="text-2xl font-bold text-white mt-2">
                {quizzes.filter(q => q.hidden).length}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-white">Your Quizzes</h2>
            <button
              onClick={() => navigate("/admin/create")}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-medium px-4 py-2.5 rounded-lg transition"
            >
              <PlusCircle size={18} />
              Create New Quiz
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="bg-gray-800/50 rounded-2xl p-10 text-center border border-dashed border-gray-700">
              <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-400 mb-2">No quizzes yet</h3>
              <p className="text-gray-500 mb-6">Create your first quiz to get started</p>
              <button
                onClick={() => navigate("/admin/create")}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition"
              >
                Create Your First Quiz
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  onClick={() => goToQuiz(quiz.id)}
                  className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-amber-500/30 cursor-pointer transition group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition line-clamp-2">
                      {quiz.title}
                    </h3>
                    <span
                      className={`flex-shrink-0 ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${quiz.hidden
                          ? "bg-red-400/10 text-red-400"
                          : "bg-green-400/10 text-green-400"
                        }`}
                    >
                      {quiz.hidden ? "Hidden" : "Published"}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <div className="flex items-center mr-4">
                      <div className="w-3 h-3 rounded-full bg-amber-400 mr-1"></div>
                      <span className="font-mono">{quiz.code || "N/A"}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {formatDate(quiz.createdAt)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-6">
                    <button
                      onClick={(e) => goToLeaderboard(quiz.id, e)}
                      className="flex items-center px-3 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg text-sm font-medium transition"
                    >
                      <Trophy size={16} className="mr-1.5" />
                      Leaderboard
                    </button>
                    <button
                      onClick={(e) => toggleQuizVisibility(quiz.id, quiz.hidden, e)}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${quiz.hidden
                          ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                          : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        }`}
                    >
                      {quiz.hidden ? (
                        <>
                          <Eye size={16} className="mr-1.5" />
                          Publish
                        </>
                      ) : (
                        <>
                          <EyeOff size={16} className="mr-1.5" />
                          Hide
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminQuiz;