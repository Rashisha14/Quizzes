import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Users, Star } from "lucide-react";

function LeaderboardPage() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxScore, setMaxScore] = useState(null); // NEW

  useEffect(() => {
    axios
      .get(`http://localhost:3000/user/results/${id}`, { headers: { token } })
      .then((res) => {
        const lb = res.data?.leaderboard || [];

        // Prefer explicit value from API if available
        const apiOutOfCandidates = [
          res.data?.maxScore,
          res.data?.totalScore,
          res.data?.total,
          res.data?.outOf,
          res.data?.meta?.maxScore,
        ];
        const fromApi = apiOutOfCandidates
          .map((n) => Number(n))
          .find((n) => Number.isFinite(n) && n > 0);

        // Otherwise infer from leaderboard entries
        const fromEntries = Math.max(
          0,
          ...lb.map((e) =>
            Number(
              e?.totalScore ??
                e?.maxScore ??
                e?.outOf ??
                e?.max ??
                e?.score
            ) || 0
          )
        );

        setLeaderboard(lb);
        setMaxScore(fromApi || (Number.isFinite(fromEntries) && fromEntries > 0 ? fromEntries : null));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load leaderboard");
        setLoading(false);
      });
  }, [id, token]);

  const toNum = (v, fallback = Number.POSITIVE_INFINITY) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const sorted = [...leaderboard].sort((a, b) => toNum(a.rank) - toNum(b.rank));
  const top = sorted[0];

  // average score (number only)
  const avgScore =
    leaderboard.length > 0
      ? (
          leaderboard.reduce((sum, p) => sum + (p.score ?? 0), 0) /
          leaderboard.length
        ).toFixed(1)
      : 0;

  const outOf = Number.isFinite(maxScore) && maxScore > 0 ? maxScore : null; // denominator to show

  const medal = (rank) => (rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-gray-100 font-sans flex flex-col items-center py-6 px-4 overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col items-center relative">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-lg text-center">
          Leaderboard
        </h1>
        <br />

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
              {/* show /outOf if we know it */}
              Avg: {avgScore}{outOf ? ` / ${outOf}` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="w-full max-w-6xl flex justify-start mt-6 mb-4">
        <button
          className="px-4 py-2 rounded-lg bg-emerald-800/80 hover:bg-black/90 hover:text-emerald-700 text-base font-semibold shadow-md transition hover:scale-105"
          onClick={() => navigate("/user/quiz")}
        >
          Back to Quiz
        </button>
      </div>
      <br />

      {loading ? (
        <p className="text-center text-gray-400 animate-pulse">Loading...</p>
      ) : (
        <div className="flex flex-col lg:flex-row w-400 max-w-6xl gap-6 flex-grow h-150">
          {/* Winner */}
          {top ? (
            <div className="flex-1 max-h-[420px] bg-gradient-to-br from-emerald-600/30 to-teal-600/20 backdrop-blur-lg rounded-2xl shadow-2xl flex flex-col items-center justify-center p-6 border border-emerald-500/30">
              <div className="text-5xl mb-3">🏆</div>
              <h2 className="text-xl font-bold text-emerald-400 mb-1">1st</h2>
              <p className="text-xl font-semibold">{top.name || "-"}</p>
              <p className="text-sm text-gray-400 mb-3">@{top.username || "unknown"}</p>
              <p className="text-md font-bold text-emerald-300">
                Score : {top.score ?? 0}{outOf ? `/${outOf}` : ""}
              </p>
            </div>
          ) : null}

          {/* List */}
          <div className="flex-[2] max-h-[420px] bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-5 border border-white/10 flex flex-col">
            <div className="flex-grow overflow-y-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-gray-900/100 backdrop-blur-sm">
                  <tr className="text-emerald-300 border-b border-white/10">
                    <th className="px-4 py-2 w-20 text-center">Rank</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Username</th>
                    <th className="px-4 py-2 text-center">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((entry, index) => {
                    if (index === 0) return null;
                    const rank = toNum(entry.rank);
                    return (
                      <tr
                        key={entry.username || index}
                        className={`${index % 2 === 0 ? "bg-white/10" : "bg-transparent"} hover:bg-emerald-700/20 transition`}
                      >
                        <td className="px-4 py-2 text-center font-bold text-lg">{medal(rank)}</td>
                        <td className="px-4 py-2">{entry.name || "-"}</td>
                        <td className="px-4 py-2 text-gray-300">@{entry.username || "-"}</td>
                        <td className="px-4 py-2 text-center font-semibold text-emerald-300">
                          {entry.score ?? 0}{outOf ? ` / ${outOf}` : ""}
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

/* Keep your no-scrollbar CSS */
<style>{`
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`}</style>

export default LeaderboardPage;
