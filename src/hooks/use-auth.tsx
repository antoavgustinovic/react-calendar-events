import { createContext, ReactNode, useCallback, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import useLocalStorage from './use-local-storage';

const ACCESS_TOKEN = 'accessToken';

interface AuthContextType {
  token?: string | null;
  handleLogin: (accessToken: string) => void;
  handleLogout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  handleLogin: () => {},
  handleLogout: () => {},
});

type AuthContextProviderProps = {
  children: ReactNode;
  tokenState: ReturnType<typeof useGetToken>;
};

export function AuthContextProvider({ children, tokenState }: AuthContextProviderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setToken, removeToken } = tokenState;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const from: string = (location.state?.from?.pathname as string) || '/';

  const handleLogin = useCallback(
    (_token: string) => {
      setToken(_token);
      navigate(from, { replace: true });
    },
    [from, navigate, setToken],
  );

  const handleLogout = useCallback(() => {
    removeToken();
    navigate('/login');
  }, [navigate, removeToken]);

  const value = useMemo(
    () => ({
      token,
      handleLogin,
      handleLogout,
    }),
    [token, handleLogin, handleLogout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export const useGetToken = () => {
  const [token, setToken, removeToken] = useLocalStorage<string | null>({
    key: ACCESS_TOKEN,
    initialValue: null,
  });
  return { token, setToken, removeToken };
};
