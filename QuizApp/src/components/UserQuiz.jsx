import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, PlayCircle, Trophy, User, LogOut, Award, CheckCircle, XCircle, Zap, Target, Clock, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
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
      bgColor = 'bg-rose-600/90';
      Icon = XCircle;
      break;
    case 'info':
      bgColor = 'bg-blue-600/90';
      Icon = CheckCircle;
      break;
    default:
      bgColor = 'bg-emerald-600/90';
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

// Main UserQuizDashboard component
function UserQuizDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [attemptedIds, setAttemptedIds] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notification, setNotification] = useState({ visible: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'completed', 'pending'

  // State for user session data
  const [sessionToken, setSessionToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [name, setName] = useState(localStorage.getItem("name"));

  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionToken) {
      navigate("/user/signin");
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [quizRes, attemptedRes] = await Promise.all([
          axios.get("https://quizzes-backend-16wj.onrender.com/user/quiz", { headers: { token: sessionToken } }),
          axios.get("https://quizzes-backend-16wj.onrender.com/user/attempted", { headers: { token: sessionToken } }),
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
  }, [sessionToken, navigate]);

  // Filter quizzes based on search and active filter
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.code?.toLowerCase().includes(searchCode.toLowerCase());
    const isCompleted = attemptedIds.has(quiz.id);
    
    if (activeFilter === 'completed') return matchesSearch && isCompleted;
    if (activeFilter === 'pending') return matchesSearch && !isCompleted;
    return matchesSearch;
  });

  const completedCount = quizzes.filter(quiz => attemptedIds.has(quiz.id)).length;
  const pendingCount = quizzes.length - completedCount;

  const gotoQuiz = (quizId) => navigate(`/user/quiz/${quizId}`);
  const gotoLeaderboard = (quizId) => navigate(`/user/results/${quizId}`);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("name");
    setSessionToken(null);
    setUsername(null);
    setName(null);
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
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.98 }}
        className={`relative w-full rounded-2xl p-4 border-2 transition-all duration-300 overflow-hidden group backdrop-blur-md cursor-pointer 
        ${attempted 
          ? "border-emerald-500/60 bg-gradient-to-br from-gray-900/80 to-gray-800/80 shadow-2xl shadow-emerald-500/20" 
          : "border-blue-500/60 bg-gradient-to-br from-gray-900/80 to-gray-800/80 shadow-2xl shadow-amber-500/20"}`}
      >
        {/* Gradient overlay based on status */}
        <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${attempted ? 'from-emerald-500 to-teal-500' : 'from-blue-600 to-blue-700'} transition-opacity duration-300`}></div>
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className={`absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,${attempted ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}_1px,transparent_0)] bg-[length:20px_20px]`}></div>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 right-3 z-10">
          {attempted ? (
            <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/40 shadow-lg shadow-emerald-500/10">
              <CheckCircle size={14} />
              Completed
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-blue-500/20 text-blue-500 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-800/80 shadow-lg shadow-amber-500/10">
              <Zap size={14} />
              Available
            </div>
          )}
        </div>

        {/* Quiz icon */}
        <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${attempted ? 'bg-emerald-500/20' : 'bg-blue-500/20'} border ${attempted ? 'border-emerald-500/30' : 'border-blue-500/30'}`}>
          <Target size={20} className={attempted ? 'text-emerald-400' : 'text-blue-600'} />
        </div>

        <h2 className="text-xl font-bold text-white relative z-10 mb-1 group-hover:translate-x-1 transition-transform">
          {quiz.title}
        </h2>
        
        <div className="space-y-1 relative z-10">
          <p className="text-slate-300 text-sm flex items-center gap-2">
            <span className="text-slate-400">Code:</span>
            <span className="font-mono bg-gray-800/50 px-2 py-1 rounded text-emerald-400 border border-gray-700/50">
              {quiz.code || "N/A"}
            </span>
          </p>
          <p className="text-slate-300 text-sm flex items-center gap-2">
            <User size={14} className="text-slate-400" />
            <span className="text-slate-400">By:</span>
            <span className="text-amber-300">{quiz.admin?.name || "Unknown"}</span>
          </p>
        </div>

        {/* Quiz metadata */}
        <div className="mt-3 flex items-center gap-4 text-sm text-slate-400 relative z-10">
          <div className="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded border border-gray-700/50">
            <Clock size={12} />
            <span>{quiz.time} mins</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded border border-gray-700/50">
            <BarChart3 size={12} />
            <span>{quiz.questions?.length} Qs</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex gap-3 flex-wrap relative z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              attempted ? gotoLeaderboard(quiz.id) : gotoQuiz(quiz.id);
            }}
            className={`flex items-center gap-2 font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 backdrop-blur-sm border
            ${attempted
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 border-emerald-500/50"
                : "bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/30 border-blue-500/50"
              }`}
          >
            <PlayCircle size={18} />
            {attempted ? "View Results" : "Start Quiz"}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              gotoLeaderboard(quiz.id);
            }}
            className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700/80 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 backdrop-blur-sm border border-gray-600/50 shadow-lg shadow-gray-800/20"
          >
            <Trophy size={18} />
            Leaderboard
          </motion.button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-950 text-white font-sans relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(245,158,11,0.1),transparent)]"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
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

      {/* Enhanced Sidebar */}
      <motion.aside
        initial={{ width: '16rem' }}
        animate={{ width: sidebarOpen ? '16rem' : '5rem' }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="z-20 bg-gray-900/80 border-r border-gray-700/50 flex flex-col p-6 min-h-screen sticky top-0 backdrop-blur-xl"
      >
        <div className="flex flex-col items-center w-full h-full">
          {/* Sidebar toggle button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-8 text-emerald-400 hover:text-emerald-300 self-end transition p-2 rounded-xl bg-gray-800/60 hover:bg-gray-700/60 border border-gray-600/50 shadow-lg"
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </motion.button>

          {/* Profile Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white font-bold transition-all duration-300 mb-4 shadow-2xl border-2 border-emerald-400/30 
            ${sidebarOpen ? "w-20 h-20 text-3xl" : "w-12 h-12 text-lg"}`}
          >
            {name?.charAt(0).toUpperCase() || username?.charAt(0).toUpperCase()}
          </motion.div>

          {/* Profile Info */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full space-y-6 overflow-hidden"
              >
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-white font-semibold text-lg">
                    <Award size={20} className="text-emerald-400" />
                    {name}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
                    <User size={16} className="text-blue-400" />
                    <span className="truncate">{username}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <span className="text-gray-400 text-sm">Completed</span>
                    <span className="text-emerald-400 font-bold">{completedCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <span className="text-gray-400 text-sm">Pending</span>
                    <span className="text-blue-400 font-bold">{pendingCount}</span>
                  </div>
                </div>

                {/* Logout button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full justify-center px-4 py-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-semibold transition-all duration-200 border border-rose-500/30 shadow-lg"
                >
                  <LogOut size={18} />
                  Logout
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 px-6 md:px-8 py-8 overflow-auto z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6"
        >
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Quiz <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Dashboard</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Welcome back, <span className="font-semibold text-emerald-400">{name || username}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Filter buttons */}
            <div className="flex gap-2 bg-gray-800/50 p-1 rounded-xl border border-gray-700/50">
              {[
                { key: 'all', label: 'All', count: quizzes.length },
                { key: 'completed', label: 'Completed', count: completedCount },
                { key: 'pending', label: 'Pending', count: pendingCount }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeFilter === filter.key
                      ? filter.key === 'completed'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                        : filter.key === 'pending'
                        ? 'bg-blue-900 text-white shadow-lg shadow-amber-600/20'
                        : 'bg-gray-700 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {filter.label}
                  <span className={`px-1.5 py-0.5 rounded text-xs ${
                    activeFilter === filter.key ? 'bg-white/20' : 'bg-gray-700'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search bar */}
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-3 rounded-xl shadow border border-gray-700/40 hover:border-gray-600/60 transition-colors focus-within:ring-2 focus-within:ring-emerald-500/50 min-w-[280px]">
              <Search className="text-gray-400" size={18} />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Search by quiz code..."
                className="bg-transparent text-sm w-full placeholder-gray-400 text-white outline-none"
              />
            </div>
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
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800/50 rounded-2xl mb-4 border border-gray-700/50 shadow-lg">
              <Search size={36} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {searchCode || activeFilter !== 'all' ? "No quizzes found" : "No quizzes available"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchCode
                ? "Try a different quiz code or check your spelling."
                : activeFilter !== 'all'
                ? `No ${activeFilter} quizzes match your criteria.`
                : "Check back later for new quizzes or contact your administrator."
              }
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
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

export default UserQuizDashboard;
