import axios, { AxiosError, AxiosResponse } from 'axios';
import { useEffect } from 'react';

import { useAuth } from '../hooks/use-auth';
import { API_BASE_URL } from '../utils/helpers';

const axiosInstance = axios.create();

const AxiosInterceptor = ({ children }: { children: JSX.Element }) => {
  const { token, handleLogout } = useAuth();

  useEffect(() => {
    const resInterceptor = (response: AxiosResponse) => response;
    const errInterceptor = (error: AxiosError) => {
      if (error.response?.status === 401) {
        handleLogout();
      }

      return Promise.reject(error);
    };

    const interceptor = axiosInstance.interceptors.response.use(resInterceptor, errInterceptor);

    if (token) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common.Authorization;
    }

    axiosInstance.defaults.baseURL = API_BASE_URL;

    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, [token, handleLogout]);

  return children;
};

export default axiosInstance;
export { AxiosInterceptor };
