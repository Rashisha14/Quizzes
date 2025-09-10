import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminQuizDetail() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/admin/quiz/${id}`, {
        headers: { token },
      })
      .then((res) => setQuiz(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch quiz details");
      });
  }, [id, token]);

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <p className="text-xl font-semibold text-purple-600 animate-pulse">
          Loading quiz details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-purple-50 to-indigo-100 font-sans text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 shadow hover:bg-slate-100 transition"
        >
          ← Back
        </button>
        <div className="text-right">
          <p className="text-sm text-slate-500">Quiz Code</p>
          <p className="font-mono text-lg font-semibold text-purple-700">
            {quiz.code}
          </p>
        </div>
      </div>

      {/* Title Section */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-purple-200 mb-10">
        <h1 className="text-4xl font-extrabold text-purple-800 mb-4">
          {quiz.title}
        </h1>
        <p className="text-slate-600 text-sm">
          Created on{" "}
          <span className="font-medium">
            {new Date(quiz.createdAt).toLocaleDateString()}
          </span>
        </p>
        <span
          className={`mt-4 inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${
            quiz.hidden
              ? "bg-red-100 text-red-600 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {quiz.hidden ? "Hidden" : "Published"}
        </span>
      </div>

      {/* Questions */}
      <h2 className="text-2xl font-bold text-purple-700 mb-6">
        Questions ({quiz.questions?.length || 0})
      </h2>
      <div className="space-y-8">
        {quiz.questions?.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white p-6 rounded-2xl shadow-md border border-purple-100 hover:shadow-xl transition"
          >
            {/* Question */}
            <h3 className="text-lg font-semibold text-purple-800 mb-4">
              <span className="text-slate-500 mr-2">Q{idx + 1}.</span> {q.text}
            </h3>

            {/* Options */}
            <div className="grid gap-3 sm:grid-cols-2">
              {q.options.map((opt) => (
                <div
                  key={opt.id}
                  className={`p-3 rounded-xl border text-sm sm:text-base flex items-center justify-between ${
                    opt.isCorrect
                      ? "bg-green-50 border-green-400 text-green-700 font-medium"
                      : "bg-gray-50 border-gray-200 text-slate-700"
                  }`}
                >
                  <span>{opt.text}</span>
                  {opt.isCorrect && (
                    <span className="ml-3 text-xs px-3 py-1 bg-green-200 text-green-800 rounded-full">
                      ✅ Correct
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminQuizDetail;
