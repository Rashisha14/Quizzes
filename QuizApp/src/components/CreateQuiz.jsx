import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft, Plus, Trash2, Save, CheckCircle, FileText,
  Hash, HelpCircle, X, CheckCircle as CheckCircleIcon, XCircle
} from "lucide-react";
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
      Icon = CheckCircleIcon;
      break;
    case 'error':
      bgColor = 'bg-red-600/90';
      Icon = XCircle;
      break;
    default:
      bgColor = 'bg-blue-600/90';
      Icon = CheckCircleIcon;
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

function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", options: [{ text: "", isCorrect: false }] }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [notification, setNotification] = useState({ visible: false, message: '', type: '' });

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  // Add new question
  const addQuestion = () => {
    setQuestions([...questions, { text: "", options: [{ text: "", isCorrect: false }] }]);
    setActiveQuestion(questions.length);
  };

  // Remove question
  const removeQuestion = (qIndex) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== qIndex));
      setActiveQuestion(Math.max(0, qIndex - 1));
    }
  };

  // Update question text
  const updateQuestionText = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].text = value;
    setQuestions(updated);
  };

  // Add option to a question
  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push({ text: "", isCorrect: false });
    setQuestions(updated);
  };

  // Remove option
  const removeOption = (qIndex, oIndex) => {
    const updated = [...questions];
    if (updated[qIndex].options.length > 1) {
      updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== oIndex);
      setQuestions(updated);
    }
  };

  // Update option text
  const updateOptionText = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex].text = value;
    setQuestions(updated);
  };

  // Mark correct answer
  const markCorrect = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.map((opt, i) => ({
      ...opt,
      isCorrect: i === oIndex
    }));
    setQuestions(updated);
  };

  // Submit quiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const hasErrors = questions.some(q => {
      const correctCount = q.options.filter(opt => opt.isCorrect).length;
      return correctCount !== 1;
    });

    if (hasErrors) {
      showNotification("Each question must have exactly one correct answer.", "error", setNotification);
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(
        "https://quizzes-backend-16wj.onrender.com/admin/quiz",
        { title, code, questions },
        { headers: { token } }
      );
      showNotification("Quiz created successfully!", "success", setNotification);
      navigate("/admin/quiz");
    } catch (err) {
      console.error("Create quiz error:", err);
      showNotification("Failed to create quiz.", "error", setNotification);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white font-sans relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-slate-950"></div>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full mx-auto px-4 py-12 z-10"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin/quiz")}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition p-2 rounded-lg"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </motion.button>
          <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
            <HelpCircle size={16} className="text-slate-400" />
            <span className="text-slate-300 text-sm">{questions.length} Question{questions.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-slate-900/50 rounded-2xl shadow-2xl p-6 md:p-10 border border-slate-700/30 backdrop-blur-xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-cyan-600/10 rounded-xl border border-cyan-700/30">
              <FileText className="h-8 w-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Create New Quiz</h1>
              <p className="text-slate-400 text-base mt-1">Build engaging quizzes with multiple questions and options</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Quiz Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white transition placeholder-slate-500"
                  placeholder="Enter quiz title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Hash className="h-4 w-4 text-cyan-400" />
                  Quiz Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white transition placeholder-slate-500 font-mono"
                  placeholder="Enter unique code"
                />
                <p className="text-xs text-slate-500 mt-1">Participants will use this code to join</p>
              </div>
            </div>

            {/* Questions Navigation */}
            {questions.length > 1 && (
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <h3 className="text-sm font-medium text-slate-300 mb-3">Question Navigation</h3>
                <div className="flex flex-wrap gap-2">
                  {questions.map((_, index) => (
                    <motion.button
                      key={index}
                      type="button"
                      onClick={() => setActiveQuestion(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-base font-semibold transition ${
                        activeQuestion === index
                          ? 'bg-cyan-600 text-slate-950 shadow-md'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                      }`}
                    >
                      {index + 1}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Questions Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Questions</h2>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addQuestion}
                  className="flex items-center gap-2 px-5 py-2 bg-cyan-600 text-slate-950 rounded-lg hover:bg-cyan-500 transition font-medium shadow-md"
                >
                  <Plus size={18} />
                  Add Question
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeQuestion}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 rounded-xl border border-slate-700/50 space-y-5 bg-slate-800/30 backdrop-blur-md"
                >
                  {/* Question header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-slate-300 bg-slate-700/50 px-2 py-1 rounded border border-slate-600/50">
                          Question {activeQuestion + 1}
                        </span>
                        {questions.length > 1 && (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeQuestion(activeQuestion)}
                            className="p-1 text-red-400 hover:text-red-300 transition"
                            title="Remove question"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={questions[activeQuestion].text}
                        onChange={(e) => updateQuestionText(activeQuestion, e.target.value)}
                        placeholder="Enter your question here"
                        className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white transition placeholder-slate-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-300">Options</span>
                      <span className="text-xs text-slate-500">
                        {questions[activeQuestion].options.filter(opt => opt.isCorrect).length === 1
                          ? "✓ One correct answer selected"
                          : "Select one correct answer"}
                      </span>
                    </div>

                    {questions[activeQuestion].options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => updateOptionText(activeQuestion, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                            className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white transition placeholder-slate-500 pr-10"
                            required
                          />
                          {opt.isCorrect && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle size={12} className="text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => markCorrect(activeQuestion, oIndex)}
                          className={`p-2 rounded-full border transition ${
                            opt.isCorrect
                              ? "bg-green-900/50 text-green-400 border-green-600/50"
                              : "bg-slate-700/50 text-slate-400 border-slate-600/50 hover:bg-slate-600/50"
                          }`}
                          title={opt.isCorrect ? "Correct answer" : "Mark as correct"}
                        >
                          <CheckCircle size={18} />
                        </motion.button>
                        {questions[activeQuestion].options.length > 1 && (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeOption(activeQuestion, oIndex)}
                            className="p-2 text-red-400 hover:text-red-300 transition"
                            title="Remove option"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        )}
                      </div>
                    ))}

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addOption(activeQuestion)}
                      className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium mt-2"
                    >
                      <Plus size={16} /> Add Option
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-slate-700/50">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-slate-950 font-semibold shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-950"></div>
                    Creating Quiz...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Quiz
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default CreateQuiz;
