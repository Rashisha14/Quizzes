import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function LeaderboardPage() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard on mount / id change
  useEffect(() => {
    axios
      .get(`http://localhost:3000/user/results/${id}`, { headers: { token } })
      .then((res) => {
        setLeaderboard(res.data.leaderboard || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load leaderboard");
        setLoading(false);
      });
  }, [id, token]);

  // Medal helper
  const medal = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 py-10 bg-sky-50 font-sans">
      <h1 className="text-4xl font-bold text-center text-sky-800 mb-10">
        Leaderboard
      </h1>

      {loading ? (
        <p className="text-center text-slate-500">Loading...</p>
      ) : (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-sm sm:text-base">
              <thead>
                <tr className="text-sky-700 border-b">
                  <th className="px-4 py-2 text-center w-20">Rank</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2 text-center w-24">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard
                  .sort((a, b) => a.rank - b.rank)
                  .map((entry, index) => (
                    <tr
                      key={index}
                      className={`border-t ${index % 2 === 0 ? "bg-sky-50/40" : "bg-white"}`}
                    >
                      <td className="px-4 py-2 text-center font-semibold">
                        {medal(entry.rank)}
                      </td>
                      <td className="px-4 py-2">{entry.name}</td>
                      <td className="px-4 py-2">{entry.username}</td>
                      <td className="px-4 py-2 text-center font-medium text-sky-700">
                        {entry.score}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <button
            className="mt-8 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg transition-colors"
            onClick={() => navigate("/user/quiz")}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}

export default LeaderboardPage;
