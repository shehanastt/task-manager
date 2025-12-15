import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const ListAllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [status, setStatus] = useState("all"); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingTasks, setUpdatingTasks] = useState(new Set());

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/task/list?status=${status}`);
        const fetchedTasks = response.data.data || [];
        setTasks(fetchedTasks);
        
        // Sync allTasks when status is "all" to keep progress accurate
        if (status === "all") {
          setAllTasks(fetchedTasks);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError(err?.response?.data?.message || "Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [status]);

  // Fetch all tasks separately for progress calculation
  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const response = await api.get(`/task/list?status=all`);
        setAllTasks(response.data.data || []);
      } catch (err) {
        console.error("Error fetching all tasks for progress:", err);
      }
    };

    fetchAllTasks();
  }, []);

  //completion percentage
  const completedPercentage = useMemo(() => {
    if (allTasks.length === 0) return 0;
    const completedCount = allTasks.filter(task => task.status === "completed").length;
    return Math.round((completedCount / allTasks.length) * 100);
  }, [allTasks]);

  const handleToggleStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    
    try {
      setUpdatingTasks(prev => new Set(prev).add(taskId));
      await api.patch(`/task/edit/${taskId}`, { status: newStatus });
      
      //Update local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
      
      // Update allTasks for progress calculation
      setAllTasks(prevAllTasks =>
        prevAllTasks.map(task =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error("Error updating task status:", err);
      alert(err?.response?.data?.message || "Failed to update task status");
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400 text-lg">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100">My Tasks</h2>
        <div className="flex gap-2">
          <Link
            to="/add"
            className="inline-flex items-center px-5 py-2.5 bg-blue-200 hover:bg-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-blue-800 dark:text-white font-medium rounded-md transition-colors duration-200"
          >
            + Add New Task
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "pending", "completed"].map((type) => (
          <button
            key={type}
            onClick={() => setStatus(type)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors duration-200 ${
              status === type
                ? "bg-blue-200 dark:bg-blue-600 text-blue-800 dark:text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      {allTasks.length > 0 && (
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Overall Progress
            </span>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {completedPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completedPercentage}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {allTasks.filter(task => task.status === "completed").length} of {allTasks.length} tasks completed
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No tasks found.</p>
          <Link
            to="/add"
            className="inline-block mt-4 px-4 py-2 bg-blue-200 hover:bg-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-blue-800 dark:text-white font-medium rounded-md transition-colors duration-200"
          >
            Create your first task
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 p-5 transition-all duration-200 hover:shadow-md dark:hover:shadow-lg ${
                task.status === "completed"
                  ? "border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() => handleToggleStatus(task._id, task.status)}
                    disabled={updatingTasks.has(task._id)}
                    className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-200 dark:focus:ring-blue-800 bg-white dark:bg-gray-700 cursor-pointer disabled:opacity-50"
                  />
                  <h3
                    className={`font-semibold text-gray-800 dark:text-gray-100 flex-1 ${
                      task.status === "completed" ? "line-through text-gray-500 dark:text-gray-500" : ""
                    }`}
                  >
                    {task.name}
                  </h3>
                </div>
              </div>

              <p
                className={`text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 ${
                  task.status === "completed" ? "line-through text-gray-400 dark:text-gray-500" : ""
                }`}
              >
                {task.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    task.status === "completed"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                  }`}
                >
                  {task.status}
                </span>
                <div className="flex gap-2">
                  <Link
                    to={`/view/${task._id}`}
                    className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    to={`/edit/${task._id}`}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListAllTasks;
