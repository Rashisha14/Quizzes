import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Users, Star } from "lucide-react";

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
        alert("Failed to load leaderboard");
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
    <div className="max-w-screen h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-gray-100 font-sans flex flex-col items-center py-6 px-4 overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col items-center relative">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-lg text-center">
          {isAdmin ? "Admin Leaderboard" : "Leaderboard"}
        </h1>

        {/* Stats */}
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
            <Users className="w-5 h-5 text-emerald-300" />
            <span className="font-semibold text-emerald-300">
              {leaderboard.length} Participants
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-yellow-400">
              Avg: {avgScore}
              {totalQuestions ? ` / ${totalQuestions}` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="w-full max-w-6xl flex justify-start mt-6 ">
        <button
          className="px-4 py-2 rounded-lg bg-emerald-800/80 hover:bg-black/90 hover:text-emerald-700 text-base font-semibold shadow-md transition hover:scale-105"
          onClick={() =>
            navigate(isAdmin ? "/admin/quiz" : "/user/quiz")
          }
        >
          {isAdmin ? "Back to Admin" : "Back to Quiz"}
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 animate-pulse">Loading...</p>
      ) : (
        <div className="flex flex-col w-full max-w-6xl flex-grow h-[calc(100vh-200px)]">
          {/* Podium Section */}
          <div className="flex justify-center items-end gap-6 h-[250px]">
            {/* 2nd */}
            {sorted[1] && (
              <div className="flex-1 max-w-[220px] h-[165px] bg-gradient-to-br from-gray-400/30 to-gray-600/20 backdrop-blur-lg rounded-2xl shadow-xl flex flex-col items-center justify-center p-4 border border-gray-400/30">
                <div className="text-3xl mb-1">🥈</div>
                <h2 className="text-md font-bold text-gray-300">2nd</h2>
                <p className="font-semibold">{sorted[1].name || "-"}</p>
                <p className="text-xs text-gray-400">
                  @{sorted[1].username || "unknown"}
                </p>
                <p className="text-sm font-bold text-gray-200 mt-1">
                  {sorted[1].score}
                  {totalQuestions ? ` / ${totalQuestions}` : ""}
                </p>
                <p className="text-xs text-gray-300">
                  Time : {formatTime(sorted[1].timeTaken)}
                </p>
              </div>
            )}

            {/* 1st */}
            {sorted[0] && (
              <div className="flex-1 max-w-[260px] h-[180px] bg-gradient-to-br from-emerald-600/30 to-teal-600/20 backdrop-blur-lg rounded-2xl shadow-2xl flex flex-col items-center justify-center p-6 border border-emerald-500/30 relative">
                <div className="absolute top-4 w-24 h-24 bg-emerald-400/20 rounded-full blur-3xl"></div>
                <div className="relative z-10 text-center">
                  <div className="text-5xl mb-2">🏆</div>
                  <h2 className="text-lg font-extrabold text-yellow-400">1st</h2>
                  <p className="font-semibold">{sorted[0].name || "-"}</p>
                  <p className="text-xs text-gray-400">
                    @{sorted[0].username || "unknown"}
                  </p>
                  <p className="text-md font-bold text-emerald-300 mt-1">
                    {sorted[0].score}
                    {totalQuestions ? ` / ${totalQuestions}` : ""}
                  </p>
                  <p className="text-xs text-gray-300">
                    Time : {formatTime(sorted[0].timeTaken)}
                  </p>
                </div>
              </div>
            )}

            {/* 3rd */}
            {sorted[2] && (
              <div className="flex-1 max-w-[220px] h-[150px] bg-gradient-to-br from-amber-600/30 to-yellow-700/20 backdrop-blur-lg rounded-2xl shadow-xl flex flex-col items-center justify-center p-4 border border-amber-500/30">
                <div className="text-3xl mb-1">🥉</div>
                <h2 className="text-md font-bold text-amber-400">3rd</h2>
                <p className="font-semibold">{sorted[2].name || "-"}</p>
                <p className="text-xs text-gray-400">
                  @{sorted[2].username || "unknown"}
                </p>
                <p className="text-sm font-bold text-amber-300 mt-1">
                  {sorted[2].score}
                  {totalQuestions ? ` / ${totalQuestions}` : ""}
                </p>
                <p className="text-xs text-gray-300">
                  Time : {formatTime(sorted[2].timeTaken)}
                </p>
              </div>
            )}
          </div>

          <br />

          {/* Participants Table */}
          <div className="flex-grow w-full bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-4 border border-white/10">
            <div className="h-full max-h-[300px] overflow-y-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-gray-900/100 backdrop-blur-sm z-10">
                  <tr className="text-emerald-300 border-b border-white/10">
                    <th className="px-4 py-2 w-20 text-center">Rank</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Username</th>
                    <th className="px-4 py-2 text-center">Score</th>
                    <th className="px-4 py-2 text-center">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.slice(3).map((entry, index) => {
                    const rank = index + 4;
                    return (
                      <tr
                        key={entry.username || index}
                        className={`${
                          index % 2 === 0 ? "bg-white/10" : "bg-transparent"
                        } hover:bg-emerald-700/20 transition`}
                      >
                        <td className="px-4 py-2 text-center font-bold text-lg">
                          {rank}
                        </td>
                        <td className="px-4 py-2">{entry.name || "-"}</td>
                        <td className="px-4 py-2 text-gray-300">
                          @{entry.username || "-"}
                        </td>
                        <td className="px-4 py-2 text-center font-semibold text-emerald-300">
                          {entry.score}
                          {totalQuestions ? ` / ${totalQuestions}` : ""}
                        </td>
                        <td className="px-4 py-2 text-center text-gray-200 font-medium">
                          {formatTime(entry.timeTaken)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Hide scrollbars for the leaderboard table */
<style>{`
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`}</style>

export default LeaderboardPage;
