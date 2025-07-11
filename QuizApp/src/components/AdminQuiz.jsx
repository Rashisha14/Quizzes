import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function AdminQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const token = localStorage.getItem("token");
  const adminName = localStorage.getItem("username"); 
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/admin/quiz", {
      headers: { token }
    })
      .then((res) => setQuizzes(res.data))
      .catch(err => {
        console.error(err);
        alert("Failed to fetch your quizzes");
      });
  }, [token]);

  const goToQuiz = (id) => {
    navigate(`/admin/quiz/${id}`);
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-fuchsia-50 to-purple-100 font-sans text-slate-800">
      <h2 className="text-3xl font-extrabold text-purple-700 animate-pulse mb-10">
        Welcome Admin, <span className="text-purple-500 animate-pulse">{adminName}</span>
      </h2>

      <h1 className="text-4xl font-bold text-center text-purple-800 mb-8 decoration-wavy">
        Your Created Quizzes
      </h1>

      <div className="flex flex-wrap justify-center gap-10">
        {quizzes.length === 0 ? (
          <p className="text-center text-lg text-slate-500 mt-10">No quizzes created yet</p>
        ) : (
          quizzes.map((quiz, index) => (
            <div
              key={index}
              onClick={() => goToQuiz(quiz.id)}
              className="cursor-pointer bg-white max-w-md w-full rounded-3xl p-6 shadow-lg hover:shadow-xl border border-purple-200 hover:border-purple-400 transition duration-300 transform hover:-translate-y-1"
            >
              <h2 className="text-2xl font-bold text-purple-700">{quiz.title}</h2>
              <p className="mt-2 text-slate-600 text-sm">
                Code: <span className="font-mono">{quiz.code || "N/A"}</span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminQuiz;
