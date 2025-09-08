
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserSignup from './components/UserSignup';
import UserSignin from './components/UserSignin';
import AdminSignup from './components/AdminSignup';
import AdminSignin from './components/AdminSignin';
import UserQuiz from './components/UserQuiz';
import AdminQuiz from './components/AdminQuiz';
import QuizDetails from './components/QuizDetails';
import LeaderboardPage from './components/LeaderboardPage'
import Starting from './components/Starting'
import './index.css';


function 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Starting />} />
        <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/user/signin" element={<UserSignin />} />
        <Route path="/user/quiz" element={<UserQuiz />} />
        <Route path="/admin/signin" element={<AdminSignin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/quiz" element={<AdminQuiz />} />
        <Route path="/user/quiz/:id" element={<QuizDetails />} />
        <Route path="/user/results/:id" element={<LeaderboardPage />} />


        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
