import { createContext, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import useLocalStorage from '../hooks/use-local-storage';
import { UserType } from '../types/user-types';

const USER_KEY = 'user';

interface AuthContextType {
  user?: UserType | null;
  handleLogin: (accessToken: string) => void;
  handleLogout: () => void;
  setUserProfile: (user: UserType) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  handleLogin: () => {},
  handleLogout: () => {},
  setUserProfile: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser, removeKey] = useLocalStorage<UserType | null>({
    key: USER_KEY,
    initialValue: null,
  });
  const navigate = useNavigate();
  const location = useLocation();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const from: string = (location.state?.from?.pathname as string) || '/';

  const handleLogin = useCallback(
    (_token: string) => {
      setUser((prevUser) => ({ ...prevUser, accessToken: _token }));
      navigate(from, { replace: true });
    },
    [from, navigate, setUser],
  );

  const handleLogout = useCallback(() => {
    removeKey();
    navigate('/login');
  }, [navigate, removeKey]);

  const setUserProfile = useCallback(
    (user: UserType) => {
      setUser((prevUser) => ({ ...prevUser, ...user }));
    },
    [setUser],
  );

  const value = useMemo(
    () => ({
      user,
      handleLogin,
      handleLogout,
      setUserProfile,
    }),
    [handleLogin, handleLogout, setUserProfile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
