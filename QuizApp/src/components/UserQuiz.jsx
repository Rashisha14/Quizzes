import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, PlayCircle, Trophy, User, LogOut, Menu, X, Award, CheckSquare, XCircle, CheckCircle, Sparkles, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper function to handle notifications
const showNotification = (message, type, setNotification) => {
  setNotification({ visible: true, message, type });
  setTimeout(() => {
    setNotification(prev => ({ ...prev, visible: false }));
  }, 5000);
};

// Component for displaying notifications
const Notification = ({ message, type, onClose }) => {
  let bgColor, Icon;
  switch (type) {
    case 'success':
      bgColor = 'bg-emerald-600/90';
      Icon = CheckCircle;
      break;
    case 'error':
      bgColor = 'bg-red-600/90';
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

// Main UserQuiz component
function App() {
  const [quizzes, setQuizzes] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [attemptedIds, setAttemptedIds] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notification, setNotification] = useState({ visible: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Retrieve user data from localStorage
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const name = localStorage.getItem("name");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch quiz data and user's attempted quizzes
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [quizRes, attemptedRes] = await Promise.all([
          axios.get("http://localhost:3000/user/quiz", { headers: { token } }),
          axios.get("http://localhost:3000/user/attempted", { headers: { token } }),
        ]);
        setQuizzes(quizRes.data);
        setAttemptedIds(new Set(attemptedRes.data.quizIds || []));
      } catch (err) {
        console.error(err);
        showNotification("Failed to fetch quizzes.", "error", setNotification);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Real-time filtering logic
  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.code?.toLowerCase().includes(searchCode.toLowerCase())
  );

  const gotoQuiz = (quizId) => navigate(`/user/quiz/${quizId}`);
  const gotoLeaderboard = (quizId) => navigate(`/user/results/${quizId}`);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/user/signin");
  };

  // Component for an individual quiz card
  const QuizCard = ({ quiz }) => {
    const attempted = attemptedIds.has(quiz.id);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          y: -8,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
          scale: 1.02
        }}
        whileTap={{ scale: 0.98 }}
        className={`relative cursor-pointer w-full rounded-2xl p-6 border transition duration-300 overflow-hidden group
        ${attempted
          ? "border-emerald-500/30 bg-gradient-to-br from-slate-900/60 to-slate-950/80"
          : "border-slate-700/40 bg-gradient-to-br from-slate-800/40 to-slate-900/40"}`}
      >
        {/* Subtle radial glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl transition duration-500 group-hover:bg-emerald-500/10"></div>
        {/* Background pattern for visual interest */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:16px_16px] opacity-70 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

        {/* Status badge */}
        <div className="absolute top-4 right-4 z-10">
          {attempted ? (
            <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-medium">
              <CheckCircle size={14} />
              Completed
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
              <Sparkles size={14} />
              New
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-white relative z-10 group-hover:text-emerald-300 transition-colors">
          {quiz.title}
        </h2>
        <p className="mt-2 text-slate-300 text-sm relative z-10">
          Code: <span className="font-mono text-emerald-400">{quiz.code || "N/A"}</span>
        </p>
        <p className="text-slate-300 text-sm mt-1 relative z-10">
          Created By: <span className="text-emerald-400">{quiz.admin?.name || "Unknown"}</span>
        </p>

        <div className="mt-6 flex gap-3 flex-wrap relative z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              attempted ? gotoLeaderboard(quiz.id) : gotoQuiz(quiz.id);
            }}
            className={`flex items-center gap-2 font-medium py-2 px-5 rounded-xl transition duration-200 backdrop-blur-sm
            ${attempted
              ? "bg-emerald-500/90 hover:bg-emerald-500 text-white"
              : "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white"
            }`}
          >
            <PlayCircle size={18} />
            {attempted ? "View Result" : "Start Quiz"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              gotoLeaderboard(quiz.id);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-2 px-5 rounded-xl transition duration-200 backdrop-blur-sm"
          >
            <Trophy size={18} />
            Leaderboard
          </motion.button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-white font-sans relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-950/70 to-slate-950/90"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-500/5 to-transparent"></div>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow-delay"></div>
      </div>

      {/* Custom Notification */}
      <AnimatePresence>
        {notification.visible && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ ...notification, visible: false })}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: 0 }}
        animate={{ width: sidebarOpen ? '16rem' : '5rem' }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="z-20 bg-slate-900/80 border-r border-slate-700/30 flex flex-col items-center p-6 min-h-screen sticky top-0 backdrop-blur-lg"
      >
        <div className="flex flex-col items-center w-full h-full">
          {/* Sidebar toggle button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-8 text-emerald-400 hover:text-emerald-100 self-end transition p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>

          {/* Profile Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-500 text-white font-bold transition-all duration-300 mb-4 shadow-lg
            ${sidebarOpen ? "w-24 h-24 text-4xl" : "w-12 h-12 text-xl"}`}
          >
            {name?.charAt(0).toUpperCase() || username?.charAt(0).toUpperCase()}
          </motion.div>

          {/* Profile Info */}
          <div className={`transition-all duration-300 w-full overflow-hidden flex flex-col h-full ${sidebarOpen ? 'max-h-96' : 'max-h-0'}`}>
            <div className="text-center mb-6 space-y-2">
              <div className="flex items-center justify-center gap-2 text-slate-300 font-medium text-lg">
                <Award size={20} className="text-emerald-400" />
                {name}
              </div>
              <div className="flex items-center justify-center gap-2 text-white font-bold text-lg">
                <User size={20} className="text-emerald-400" />
                <span className="truncate">{username}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-slate-400 font-medium text-sm mt-2">
                <CheckSquare size={20} className="text-emerald-400" />
                Quizzes Attempted: {attemptedIds.size}
              </div>
            </div>

            <div className="mt-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 w-full justify-center px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium transition-colors"
              >
                <LogOut size={18} />
                {sidebarOpen && "Logout"}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 px-6 md:px-8 py-8 overflow-auto z-10">
        {/* Header with search */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center flex-wrap mb-10 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Quiz Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              Welcome back, {name || username}!
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <motion.div
              className="flex items-center gap-3 flex-1 bg-white/5 backdrop-blur-md px-4 py-3 rounded-xl shadow border border-slate-700/40 hover:border-slate-600/60 transition-colors focus-within:ring-2 focus-within:ring-emerald-500/50"
            >
              <Search className="text-slate-400" size={18} />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Search by quiz code..."
                className="bg-transparent text-sm w-full md:w-52 placeholder-slate-400 text-white outline-none"
              />
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl transition duration-200 backdrop-blur-sm"
              onClick={() => showNotification("You can join quizzes from the dashboard.", "info", setNotification)}
            >
              <PlusCircle size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Quiz list */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800/50 rounded-full mb-4">
              <Search size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-medium text-slate-300 mb-2">
              {searchCode ? "No quizzes found" : "No quizzes available"}
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {searchCode
                ? "Try a different quiz code or check if you've entered it correctly."
                : "Check back later for new quizzes or contact your administrator."
              }
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default App;
