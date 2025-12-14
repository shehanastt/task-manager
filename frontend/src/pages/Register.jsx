import React from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import api from '../api';

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Register = () => {

  const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (formValues) => {
    try {
      const res = await api.post('/auth/register', formValues);
      alert(res.data.message);

      const { token, data: user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100 text-center">Create an Account</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Name</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" 
              {...register('name')} 
            />
            <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" 
              {...register('email')} 
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" 
              {...register('password')} 
            />
            <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full py-2 px-4 bg-blue-200 hover:bg-blue-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-blue-300 dark:border-blue-600 border-2 border-blue-200 text-blue-800 font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-gray-600 mt-4 text-center text-sm">
          Already have an account? <a href="/login" className="text-blue-600 hover:text-blue-700 underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
