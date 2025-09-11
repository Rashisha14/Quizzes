import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Plus, Trash2, Save, CheckCircle, FileText, Hash, HelpCircle } from "lucide-react";

function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", options: [{ text: "", isCorrect: false }] }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);

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
    
    // Validate that each question has exactly one correct answer
    const hasErrors = questions.some(q => {
      const correctCount = q.options.filter(opt => opt.isCorrect).length;
      return correctCount !== 1;
    });
    
    if (hasErrors) {
      alert("Each question must have exactly one correct answer.");
      setIsSubmitting(false);
      return;
    }
    
    try {
      await axios.post(
        "http://localhost:3000/admin/quiz",
        { title, code, questions },
        { headers: { token } }
      );
      alert("Quiz created successfully!");
      navigate("/admin/quiz");
    } catch (err) {
      console.error("Create quiz error:", err);
      alert("Failed to create quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <button
            onClick={() => navigate("/admin/quiz")}
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition p-2 rounded-lg hover:bg-amber-900/30"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-2 bg-amber-900/20 px-3 py-1.5 rounded-lg border border-amber-700/30">
            <HelpCircle size={16} className="text-amber-400" />
            <span className="text-amber-300 text-sm">{questions.length} Question{questions.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-amber-700/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-900/50 rounded-lg border border-amber-700/30">
              <FileText className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-amber-400">Create New Quiz</h1>
              <p className="text-gray-400 text-sm mt-1">Build engaging quizzes with multiple questions and options</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-amber-300 mb-2">Quiz Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-amber-700/30 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white transition placeholder-gray-500"
                  placeholder="Enter quiz title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-300 mb-2 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Quiz Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-amber-700/30 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white transition placeholder-gray-500 font-mono"
                  placeholder="Enter unique code"
                />
                <p className="text-xs text-amber-500/70 mt-1">Participants will use this code to join</p>
              </div>
            </div>

            {/* Questions Navigation */}
            {questions.length > 1 && (
              <div className="bg-gray-700/50 rounded-lg p-3 border border-amber-700/20">
                <h3 className="text-sm font-medium text-amber-300 mb-2">Questions</h3>
                <div className="flex flex-wrap gap-2">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveQuestion(index)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition ${
                        activeQuestion === index
                          ? 'bg-amber-600 text-gray-900'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Questions */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-amber-400">Questions</h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-gray-900 rounded-lg hover:bg-amber-500 transition font-medium"
                >
                  <Plus size={18} />
                  Add Question
                </button>
              </div>

              {questions.map((q, qIndex) => (
                <div 
                  key={qIndex} 
                  className={`p-5 rounded-xl border space-y-4 transition-all ${
                    activeQuestion === qIndex
                      ? 'bg-amber-900/20 border-amber-700/50'
                      : 'bg-gray-700/50 border-amber-700/20'
                  }`}
                >
                  {/* Question header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-amber-300 bg-amber-900/30 px-2 py-1 rounded border border-amber-700/30">
                          Question {qIndex + 1}
                        </span>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            className="p-1 text-red-400 hover:text-red-300 transition"
                            title="Remove question"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={q.text}
                        onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                        placeholder="Enter your question here"
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-amber-700/30 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white transition placeholder-gray-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-amber-300">Options</span>
                      <span className="text-xs text-amber-500/70">
                        {q.options.filter(opt => opt.isCorrect).length === 1 
                          ? "✓ Correct answer selected" 
                          : "Select one correct answer"}
                      </span>
                    </div>
                    
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-amber-700/30 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white transition placeholder-gray-500 pr-10"
                            required
                          />
                          {opt.isCorrect && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle size={12} className="text-gray-900" />
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => markCorrect(qIndex, oIndex)}
                          className={`p-2 rounded-full border transition ${
                            opt.isCorrect 
                              ? "bg-green-900/50 text-green-400 border-green-600/50" 
                              : "bg-gray-600 text-gray-400 border-gray-500 hover:bg-gray-500"
                          }`}
                          title={opt.isCorrect ? "Correct answer" : "Mark as correct"}
                        >
                          <CheckCircle size={18} />
                        </button>
                        {q.options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOption(qIndex, oIndex)}
                            className="p-2 text-red-400 hover:text-red-300 transition"
                            title="Remove option"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium mt-2"
                    >
                      <Plus size={16} /> Add Option
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-amber-700/30">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-gray-900 font-semibold shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                    Creating Quiz...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Quiz
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateQuiz;