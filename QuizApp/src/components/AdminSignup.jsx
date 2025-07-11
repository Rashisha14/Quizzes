import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css'

function UserSignup() {
    const navigate = useNavigate();

    function sup() {
        const username = document.getElementById("Username").value;
        const password = document.getElementById("Password").value;
        const name = document.getElementById("Name").value;

        if (!username || !password || !name) {
            alert("Please fill all fields");
            return;
        }

        axios.post("http://localhost:3000/admin/signup", { username, password, name })
            .then(res => {
                navigate("/admin/signin");
            })
            .catch(err => {
                console.error(err);
                alert("Signup failed");
            });
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-800 to-green-400 ">
            <h2 className="text-white text-4xl font-bold mb-5 text-center text-shadow-2xs text-shadow-black ">QuizArrow</h2>
            <div className="bg-white p-8 rounded-xl shadow-green-200 shadow-2xl w-full max-w-md">
                <h3 className="text-amber-700 text-lg font-medium mb-1 text-center">Admin</h3>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Signup</h2>

                <div className="space-y-4">
                    <input
                        id="Name"
                        placeholder="Name"
                        type="text"
                        className="w-full px-4 py-2 border border-gray-500 rounded-md  focus:ring-2 focus:ring-amber-400"
                    />
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

                    <button
                        onClick={sup}
                        className="w-full bg-amber-300 hover:bg-amber-400 text-black py-2 rounded-md font-medium transition duration-200"
                    >
                        Signup
                    </button>


                    <p className="mt-4 text-sm text-gray-600 text-center">
                        Already have an account?{" "}
                        <a href="/admin/signin" className="text-amber-600 hover:underline">
                            Go to Signin
                        </a>
                    </p>
                    <p className="text-sm text-gray-600 text-center mt-1">
                        Do You want to Participate a Quiz? {" "}
                        <a href="/user/signup" className="text-amber-600 hover:underline">
                            Signup as User
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}


export default UserSignup;
