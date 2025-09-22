import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Users, Star, Award, Clock, ChevronLeft, Crown, X, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

// Helper function to handle notifications
const showNotification = (message, type, setNotification) => {
  setNotification({ visible: true, message, type });
  setTimeout(() => {
    setNotification(prev => ({ ...prev, visible: false }));
  }, 5000);
};

function LeaderboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 🔑 Determine if this is an admin page
  const isAdmin = location.pathname.startsWith("/admin");

  // Pick correct token and endpoint
  const token = localStorage.getItem(isAdmin ? "adminToken" : "token");
  const endpoint = isAdmin
    ? `http://localhost:3000/admin/results/${id}`
    : `http://localhost:3000/user/results/${id}`;

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalQuestions, setTotalQuestions] = useState(null);
  const [notification, setNotification] = useState({ visible: false, message: '', type: '' });

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(endpoint, { headers: { token } });
        const lb = res.data?.leaderboard || [];

        // Ensure numeric fields
        const parsedLeaderboard = lb.map((entry) => ({
          ...entry,
          score: Number(entry.score ?? 0),
          timeTaken: Number(entry.timeTaken ?? 0),
        }));

        setLeaderboard(parsedLeaderboard);
        setTotalQuestions(Number(res.data?.totalQuestions ?? 0));
        setLoading(false);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
        showNotification("Failed to load leaderboard.", "error", setNotification);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [endpoint, token]);

  // Sort: score desc, then time asc
  const sorted = [...leaderboard].sort((a, b) =>
    a.score === b.score
      ? (a.timeTaken ?? Infinity) - (b.timeTaken ?? Infinity)
      : b.score - a.score
  );

  const avgScore =
    leaderboard.length > 0
      ? (
          leaderboard.reduce((sum, p) => sum + Number(p.score ?? 0), 0) /
          leaderboard.length
        ).toFixed(1)
      : 0;

  // Convert seconds → mm:ss
  const formatTime = (time) => {
    const seconds = Number(time);
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100 font-sans relative overflow-hidden">
      <AnimatePresence>
        {notification.visible && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ ...notification, visible: false })}
          />
        )}
      </AnimatePresence>

      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/80 via-gray-900/70 to-gray-950/90"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-500/5 to-transparent"></div>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse-slow-delay"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 max-w-6xl relative z-10"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <button
              onClick={() => navigate(isAdmin ? "/admin/quiz" : "/user/quiz")}
              className="flex items-center text-gray-400 hover:text-emerald-400 transition-colors mr-4"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
              {isAdmin ? "Admin Leaderboard" : "Quiz Leaderboard"}
            </h1>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700/50">
              <Users className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium">
                {leaderboard.length} Participants
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700/50">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">
                Avg: {avgScore}
                {totalQuestions ? ` / ${totalQuestions}` : ""}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            {/* Podium Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* 2nd Place */}
              {sorted[1] && (
                <div className="order-2 md:order-1 flex flex-col items-center bg-gray-800/30 backdrop-blur-md p-6 rounded-xl border border-gray-700/50 transform transition-transform hover:scale-[1.02]">
                  <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
                    <span className="text-3xl">🥈</span>
                  </div>
                  <div className="text-center mb-2">
                    <div className="text-xs font-semibold text-gray-400 mb-1">2ND PLACE</div>
                    <h3 className="font-bold text-lg">{sorted[1].name || "-"}</h3>
                    <p className="text-sm text-gray-400">@{sorted[1].username || "unknown"}</p>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-2">
                    <div className="flex items-center">
                      <Award className="w-4 h-4 text-emerald-400 mr-1" />
                      <span className="text-sm font-semibold">
                        {sorted[1].score}
                        {totalQuestions ? ` / ${totalQuestions}` : ""}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-blue-400 mr-1" />
                      <span className="text-sm">{formatTime(sorted[1].timeTaken)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {sorted[0] && (
                <div className="order-1 md:order-2 flex flex-col items-center bg-gradient-to-b from-emerald-900/30 to-gray-900/70 backdrop-blur-md p-8 rounded-xl border border-emerald-700/50 relative transform transition-transform hover:scale-[1.02]">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Crown className="w-8 h-8 text-yellow-400 fill-current" />
                  </div>
                  <div className="w-20 h-20 rounded-full bg-emerald-900/30 flex items-center justify-center mb-4 ring-4 ring-emerald-700/30">
                    <span className="text-4xl">🏆</span>
                  </div>
                  <div className="text-center mb-3">
                    <div className="text-xs font-semibold text-yellow-400 mb-1">1ST PLACE</div>
                    <h3 className="font-bold text-xl">{sorted[0].name || "-"}</h3>
                    <p className="text-sm text-gray-400">@{sorted[0].username || "unknown"}</p>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-2">
                    <div className="flex items-center">
                      <Award className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-semibold">
                        {sorted[0].score}
                        {totalQuestions ? ` / ${totalQuestions}` : ""}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-blue-400 mr-1" />
                      <span className="text-sm">{formatTime(sorted[0].timeTaken)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {sorted[2] && (
                <div className="order-3 md:order-3 flex flex-col items-center bg-gray-800/30 backdrop-blur-md p-6 rounded-xl border border-gray-700/50 transform transition-transform hover:scale-[1.02]">
                  <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
                    <span className="text-3xl">🥉</span>
                  </div>
                  <div className="text-center mb-2">
                    <div className="text-xs font-semibold text-amber-600 mb-1">3RD PLACE</div>
                    <h3 className="font-bold text-lg">{sorted[2].name || "-"}</h3>
                    <p className="text-sm text-gray-400">@{sorted[2].username || "unknown"}</p>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-2">
                    <div className="flex items-center">
                      <Award className="w-4 h-4 text-amber-500 mr-1" />
                      <span className="text-sm font-semibold">
                        {sorted[2].score}
                        {totalQuestions ? ` / ${totalQuestions}` : ""}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-blue-400 mr-1" />
                      <span className="text-sm">{formatTime(sorted[2].timeTaken)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Participants Table */}
            <div className="bg-gray-800/30 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700/50">
              <div className="px-6 py-4 border-b border-gray-700/50">
                <h2 className="text-lg font-semibold flex items-center">
                  <Users className="w-5 h-5 mr-2 text-emerald-400" />
                  All Participants
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Participant</th>
                      <th className="py-3 px-6 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
                      <th className="py-3 px-6 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {sorted.slice(3).map((entry, index) => {
                      const rank = index + 4;
                      return (
                        <tr key={entry.username || index} className="hover:bg-gray-700/20 transition-colors">
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-300">#{rank}</div>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium">{entry.name || "-"}</div>
                              <div className="text-xs text-gray-400">@{entry.username || "-"}</div>
                            </div>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap text-center">
                            <div className="text-sm font-semibold text-emerald-400">
                              {entry.score}
                              {totalQuestions ? <span className="text-gray-400">/{totalQuestions}</span> : ""}
                            </div>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-300 font-medium">
                              {formatTime(entry.timeTaken)}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {sorted.length <= 3 && (
                <div className="py-12 text-center text-gray-500">
                  No other participants to display
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default LeaderboardPage;
