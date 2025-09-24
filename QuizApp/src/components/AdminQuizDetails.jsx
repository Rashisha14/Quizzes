import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader, AlertTriangle, ArrowLeft, Check, FileQuestion, Calendar, ListChecks } from "lucide-react";

// --- Notification Component ---
const Notification = ({ message, type, show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg text-white font-semibold shadow-lg ${
          type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        }`}
      >
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);

// --- Loading & Error States ---
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-300">
    <Loader className="w-12 h-12 animate-spin text-indigo-400 mb-4" />
    <p className="text-xl">Loading Quiz Details...</p>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-300 p-4">
    <div className="text-center p-8 bg-slate-800/50 rounded-2xl shadow-2xl max-w-md border border-slate-700">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">An Error Occurred</h2>
      <p className="text-slate-400 mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-500 transition-colors"
      >
        Go Back
      </button>
    </div>
  </div>
);


const AdminQuizDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  const showTempNotification = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3000/admin/quiz/${id}`, { headers: { token } })
      .then((res) => {
        setQuiz(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch quiz details:", err);
        setError("Could not load quiz details. The quiz may not exist or there was a network issue.");
        showTempNotification("Failed to fetch quiz details.", "error");
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) return <LoadingState />;
  if (error || !quiz) return <ErrorState message={error || "The requested quiz was not found."} onRetry={() => navigate(-1)} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 font-sans text-slate-200 p-6 sm:p-10">
      <Notification message={notificationMessage} type={notificationType} show={showNotification} />

      <div className="container mx-auto max-w-4xl">
        {/* Header and Back Button */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 shadow-sm hover:bg-slate-700 transition text-slate-300 font-medium group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Quizzes
          </button>
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quiz Code</p>
            <p className="font-mono text-xl font-bold text-cyan-300 bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-md inline-block mt-1">
              {quiz.code}
            </p>
          </div>
        </div>

        {/* Quiz Details Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">{quiz.title}</h1>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                quiz.hidden ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"
              }`}
            >
              <span className={`h-2 w-2 rounded-full mr-2 ${quiz.hidden ? 'bg-red-400' : 'bg-green-400'}`}></span>
              {quiz.hidden ? "Hidden" : "Published"}
            </span>
          </div>
          <div className="flex items-center text-sm text-slate-400 mt-2">
            <Calendar className="h-4 w-4 mr-2" />
            Created on {new Date(quiz.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Questions Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <ListChecks />
                Questions
            </h2>
            <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm font-medium">
              {quiz.questions?.length || 0} {quiz.questions?.length === 1 ? 'Question' : 'Questions'}
            </span>
          </div>

          <div className="space-y-6">
            {quiz.questions?.length > 0 ? (
              quiz.questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 transition hover:border-indigo-500/50"
                >
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-500/20 text-indigo-300 rounded-full flex items-center justify-center font-bold mr-4">
                      {idx + 1}
                    </div>
                    <h3 className="text-lg font-medium text-slate-100 pt-1">{q.text}</h3>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 ml-12">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`p-4 rounded-xl border flex items-center justify-between transition-colors duration-200 ${
                          opt.isCorrect
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                            : "bg-slate-700/50 border-slate-600 text-slate-300"
                        }`}
                      >
                        <span className={opt.isCorrect ? "font-semibold" : ""}>{opt.text}</span>
                        {opt.isCorrect && (
                           <div className="flex-shrink-0 ml-2 flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs px-2 py-1 rounded-full font-medium">
                            <Check size={14}/> Correct
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl">
                <FileQuestion className="h-16 w-16 mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">This quiz doesn't have any questions yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQuizDetail;

