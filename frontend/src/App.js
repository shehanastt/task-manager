import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import ListAllTasks from './components/ListAllTasks';
import ViewTask from './components/ViewTask';
import AddTask from './components/AddTask';
import UpdateTask from './components/UpdateTask';
import Register from './components/Register';
import Home from './pages/HomePage';
import Login from './components/Login';

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const isAuthenticated = () => {
    return localStorage.getItem('token') && localStorage.getItem('user');
  };

  const isAuthPage = () => {
    return location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';
  };
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 text-slate-900 dark:text-gray-100 transition-colors duration-200">
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        {isAuthenticated() && !isAuthPage() && (
          <button
            onClick={handleLogout}
            className="p-2 rounded-md bg-red-200 dark:bg-red-800 hover:bg-red-300 dark:hover:bg-red-700 text-red-800 dark:text-red-200 transition-colors duration-200 shadow-md"
            aria-label="Logout"
            title="Logout"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        )}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md bg-blue-200 dark:bg-gray-800 hover:bg-blue-300 dark:hover:bg-gray-700 text-blue-800 dark:text-gray-200 transition-colors duration-200 shadow-md"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add" element={<AddTask />} />
          <Route path="/tasks" element={<ListAllTasks />} />
          <Route path="/view/:taskId" element={<ViewTask />} />
          <Route path="/edit/:taskId" element={<UpdateTask />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
