import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';

const ViewTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/task/view/${taskId}`);
        setTask(response.data.data);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || 'Unable to load task');
      }
    };

    fetchTask();
  }, [taskId]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      await api.delete(`/task/${taskId}`);
      alert('Task deleted successfully!');
      navigate('/tasks');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to delete the task.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Task Details</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Name</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{task.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Description</p>
            <p className="text-gray-700 dark:text-gray-300">{task.description}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Status</p>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                task.status === 'completed'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                  : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
              }`}
            >
              {task.status}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => navigate(`/edit/${task._id}`)}
            className="px-4 py-2 rounded-md bg-blue-200 hover:bg-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-blue-800 dark:text-white text-sm font-medium transition-colors duration-200"
          >
            Edit Task
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete Task'}
          </button>
          <button
            onClick={() => navigate('/tasks')}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTask;