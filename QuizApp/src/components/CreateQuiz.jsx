import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Plus, Trash2, Save, CheckCircle } from "lucide-react";

function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", options: [{ text: "", isCorrect: false }] }
  ]);

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  // Add new question
  const addQuestion = () => {
    setQuestions([...questions, { text: "", options: [{ text: "", isCorrect: false }] }]);
  };

  // Remove question
  const removeQuestion = (qIndex) => {
    setQuestions(questions.filter((_, i) => i !== qIndex));
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
    updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== oIndex);
    setQuestions(updated);
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-amber-950 text-white px-4">
      <div className="bg-zinc-900 w-full max-w-3xl p-8 rounded-2xl shadow-lg border border-amber-700">
        {/* Back */}
        <button
          onClick={() => navigate("/admin/quiz")}
          className="flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-amber-400 mb-6">Create New Quiz</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-sm mb-2 text-amber-300">Quiz Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-amber-700 focus:border-amber-400 text-white"
              placeholder="Enter quiz title"
            />
          </div>

          {/* Code */}
          <div>
            <label className="block text-sm mb-2 text-amber-300">Quiz Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-amber-700 focus:border-amber-400 text-white"
              placeholder="Enter unique quiz code"
            />
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-amber-400">Questions</h2>
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="p-4 rounded-xl bg-zinc-800 border border-amber-700 space-y-4">
                {/* Question header */}
                <div className="flex justify-between items-center">
                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                    placeholder={`Question ${qIndex + 1}`}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-amber-700 focus:border-amber-400 text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="ml-3 text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-amber-700 focus:border-amber-400 text-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => markCorrect(qIndex, oIndex)}
                        className={`p-2 rounded-full ${opt.isCorrect ? "bg-amber-500 text-black" : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"}`}
                        title="Mark as correct"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeOption(qIndex, oIndex)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="mt-2 flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm"
                  >
                    <Plus size={16} /> Add Option
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium"
            >
              <Plus size={18} /> Add Question
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-semibold shadow-lg transition"
          >
            <Save size={20} />
            Save Quiz
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateQuiz;
