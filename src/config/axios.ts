import axios, { AxiosError, AxiosResponse } from 'axios';
import { useEffect } from 'react';

import { useAuth } from '../hooks/use-auth';

const axiosInstance = axios.create();

const AxiosInterceptor = ({ children }: { children: JSX.Element }) => {
  const { handleLogout } = useAuth();

  useEffect(() => {
    const resInterceptor = (response: AxiosResponse) => response;
    const errInterceptor = (error: AxiosError) => {
      if (error.response?.status === 401) {
        handleLogout();
      }

      return Promise.reject(error);
    };

    const interceptor = axiosInstance.interceptors.response.use(resInterceptor, errInterceptor);

    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, [handleLogout]);

  return children;
};

export default axiosInstance;
export { AxiosInterceptor };
