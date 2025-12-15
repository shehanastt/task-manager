import axios from "axios";

const api = axios.create({
    baseURL:'https://task-manager-r93o.onrender.com/api',
    timeout:5000,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization =`Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export default api;