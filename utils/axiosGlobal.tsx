import axios from 'axios';
import { getCookie } from 'cookies-next';

const axiosInterceptorInstance = axios.create({
  baseURL: 'http://localhost:3001/api/',
});


// Request interceptor
axiosInterceptorInstance.interceptors.request.use(
  (config) => {
    // Modify the request config here (add headers, authentication tokens)
        const accessToken = getCookie("token");

    // If token is present add it to request's Authorization Header
    if (accessToken) {
      if (config.headers) config.headers.authorization = 'Bearer ' + accessToken;
    }
    return config;
  },
  (error) => {
    // Handle request errors here

    return Promise.reject(error);
  }
);
// End of Request interceptor



// Response interceptor
axiosInterceptorInstance.interceptors.response.use(
  (response) => {
    // Modify the response data here

    return response;
  },
  (error) => {
    // Handle response errors here

    return Promise.reject(error);
  }
);
// End of Response interceptor

export default axiosInterceptorInstance;