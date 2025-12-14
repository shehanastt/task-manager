import * as yup from 'yup'
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  email: yup.string().required("Email is required").email("Invalid email format"),
  password: yup.string().min(6,"must be at least 6 characters").required("password is required")
}) 

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: {errors, isSubmitting}} = useForm({
    resolver: yupResolver(schema)
  })
  
  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/login', data);
      const token = res.data.token;
      const user = res.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      alert('Login successful!');
      navigate('/tasks');
  
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Login failed');
    } 
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Welcome Back</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              {...register('email')}
            />
            <p className='text-red-500 text-sm mt-1'>{errors.email?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              {...register('password')}
            />
            <p className='text-red-500 text-sm mt-1'>{errors.password?.message}</p>
          </div>

          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-blue-200 hover:bg-blue-300 text-blue-800 font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-gray-600 mt-4 text-center text-sm">
          Don't have an account? <a href="/register" className="text-blue-600 hover:text-blue-700 underline">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
