import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Welcome
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
          Manage your tasks efficiently and stay organized
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="/register" 
            className="w-full sm:w-auto px-8 py-3 bg-blue-200 hover:bg-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-blue-800 dark:text-white font-medium rounded-md transition-colors duration-200 shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-xl"
          >
            Register
          </a>
          <a 
            href="/login" 
            className="w-full sm:w-auto px-8 py-3 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-600 font-medium rounded-md transition-colors duration-200 shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-xl"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
