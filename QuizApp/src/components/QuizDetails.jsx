import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function QuizDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [quiz, setQuiz] = useState(null);
  const [responses, setResponses] = useState({}); 

  useEffect(() => {
    axios.get(`http://localhost:3000/user/quiz/${id}`, {
      headers: { token }
    })
      .then(res => {
        console.log(" Full Quiz Response:", res.data);
        setQuiz(res.data);
      })
      .catch(err => {
        console.error("Error fetching quiz:", err);
        alert("Failed to fetch quiz");
      });
  }, [id, token]);

  const handleOptionSelect = (questionId, optionId) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  if (!quiz) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-sky-100">
      <p className="text-lg font-medium text-slate-600 animate-pulse"> Loading quiz...</p>
    </div>
  );

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 bg-gradient-to-br from-sky-50 to-sky-100 font-sans text-slate-800">
      
      <h1 className="text-4xl font-extrabold text-center text-sky-800 mb-10 ">
         {quiz.title}
      </h1>
      

     
      <div className="flex flex-col gap-10 items-center">
        {quiz.questions?.map((q, index) => (
          <div
            key={q.id}
            className=" w-2/5 bg-white p-6 rounded-3xl border border-sky-200 shadow-md hover:shadow-lg transition duration-300"
          >
           
            <div className="flex items-start gap-2 mb-4">
              <span className="text-xl font-bold text-sky-700">{index + 1}.</span>
              <p className="text-lg font-semibold text-sky-800">{q.text}</p>
            </div>

            
            <div className="space-y-3">
              {q.options.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border transition duration-200 ${
                    responses[q.id] === opt.id
                      ? 'bg-sky-100 border-sky-400 text-sky-800'
                      : 'border-gray-300 hover:bg-sky-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={opt.id}
                    checked={responses[q.id] === opt.id}
                    onChange={() => handleOptionSelect(q.id, opt.id)}
                    className="accent-sky-500"
                  />
                  <span className="text-sm sm:text-base">{opt.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      
      <div className="flex justify-center mt-12">
        <button
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition"
          onClick={() => alert("Submitting coming soon...")}
        >
           Submit Answers
        </button>
      </div>
    </div>
  );
}

export default QuizDetails;
