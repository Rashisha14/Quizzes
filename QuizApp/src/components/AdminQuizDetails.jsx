import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// Tailwind CSS is assumed to be available.

const AdminQuizDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Custom states for the notification message
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  // Function to show a temporary notification
  const showTempNotification = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000); // Hide after 3 seconds
  };

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3000/admin/quiz/${id}`, {
      headers: { token },
    })
    .then((res) => {
      setQuiz(res.data);
      setLoading(false);
      setError(null);
    })
    .catch((err) => {
      console.error("Failed to fetch quiz details:", err);
      setLoading(false);
      setError("Failed to fetch quiz details. Please try again later.");
      showTempNotification("Failed to fetch quiz details.", "error");
    });
  }, [id, token]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-l-purple-600 border-r-purple-300 border-b-purple-300 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Loading quiz details...</p>
        </div>
      </div>
    );
  }

  // Error/Not Found state
  if (error || !quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md border border-gray-200">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{error ? "Error" : "Quiz Not Found"}</h2>
          <p className="text-gray-600 mb-6">{error || "The requested quiz could not be loaded."}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 p-6 sm:p-10">

      {/* Dynamic Notification Message */}
      {showNotification && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 p-4 rounded-xl shadow-lg z-50 text-white transition-opacity duration-300 ${
          notificationType === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {notificationMessage}
        </div>
      )}

      <div className="container mx-auto max-w-4xl">
        {/* Header and Back Button */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition text-gray-700 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Quizzes
          </button>
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quiz Code</p>
            <p className="font-mono text-xl font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-md inline-block mt-1">
              {quiz.code}
            </p>
          </div>
        </div>

        {/* Quiz Details Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{quiz.title}</h1>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                quiz.hidden ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
              }`}
            >
              <span className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: quiz.hidden ? '#ef4444' : '#22c55e' }}></span>
              {quiz.hidden ? "Hidden" : "Published"}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Created on {new Date(quiz.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Questions Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
              {quiz.questions?.length || 0} {quiz.questions?.length === 1 ? 'Question' : 'Questions'}
            </span>
          </div>

          <div className="space-y-6">
            {quiz.questions?.length > 0 ? (
              quiz.questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-gray-50 p-6 rounded-2xl border border-gray-200 transition"
                >
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold mr-3">
                      {idx + 1}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 pt-1">{q.text}</h3>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 ml-11">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`p-4 rounded-xl border flex items-center justify-between transition-colors duration-200 ${
                          opt.isCorrect
                            ? "bg-green-50 border-green-200 text-green-800"
                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <span className={opt.isCorrect ? "font-semibold" : ""}>{opt.text}</span>
                        {opt.isCorrect && (
                          <span className="flex-shrink-0 ml-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                            Correct
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">This quiz doesn't have any questions yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQuizDetail;
