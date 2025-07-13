import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css'

function UserSignin() {

  const Navigate = useNavigate();
  function sin() {
    const username = document.getElementById("Username").value;
    const password = document.getElementById("Password").value;

    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }

    axios.post("http://localhost:3000/user/signin", { username, password })
      .then(res => {
        alert(res.data.message);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", username);
        Navigate("/user/quiz");
      })
      .catch(err => {
        alert("Login failed. Try again.");
        console.error(err);
      });
  }

  return (


    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-blue-950">
      <h2 className="text-white text-4xl font-bold mb-5 text-center text-shadow-2xs text-shadow-black ">QuizArrow</h2>
      <div className="bg-white p-8 rounded-xl shadow-blue-200 shadow-2xl w-full max-w-md">
        <h3 className="text-amber-700 text-lg font-medium mb-1 text-center">User</h3>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Signin</h2>
        <div className="space-y-4">
        <input
            id="Username"
            placeholder="Username"
            type="text"
            className="w-full px-4 py-2 border border-gray-500 rounded-md  focus:ring-2 focus:ring-amber-400"
          />
          <input
            id="Password"
            placeholder="Password"
            type="password"
            className="w-full px-4 py-2 border border-gray-500 rounded-md  focus:ring-2 focus:ring-amber-400"
          />
        <button onClick={sin} className="w-full bg-amber-300 hover:bg-amber-400 text-black py-2 rounded-md font-medium transition duration-200">Signin</button>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Don't have an account? <a href="/user/signup" className="text-amber-600 hover:underline">Go to signup</a>
        </p>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Do You want to Create a Quiz? <a href="/admin/signup" className="text-amber-600 hover:underline">Signup as Admin</a>
        </p>
        </div>
      </div>
    </div>
  );
}

export default UserSignin;
