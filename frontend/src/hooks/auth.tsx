import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { message } from 'antd';

import { auth, db } from '../config/firebase';
import api from '../clients/api';

interface AuthContextData {
  user: User;
  setUser: (data: User) => void;
  refreshToken: string;
  register: (data: RegisterProps) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  isLogged: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  admin: boolean;
}

interface RegisterProps {
  name: string;
  email: string;
  password: string;
  admin: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>({} as User);
  const [refreshToken, setRefreshToken] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    const userFromLocalStorage = Cookies.getJSON('user');

    if (token && userFromLocalStorage) {
      setUser(userFromLocalStorage);
      setRefreshToken(token);
      setIsLogged(true);
      api.defaults.headers.authorization = `Bearer ${token}`;
    }
  }, []);

  // const isLogged = true;
  // useMemo(() => !!Object.keys(user).length, [user])

  const register = useCallback(
    async ({ name, email, password, admin }: RegisterProps) => {
      try {
        const userToRegister = { name, email, password, admin };
        const response = await api.post('/users', userToRegister);
      } catch (err) {
        message.error('Erro ao fazer registro, por favor tente novamente.');
      }
    },
    [],
  );

  const login = useCallback(
    async ({ email, password }) => {
      try {
        const response = await api.post('sessions', {
          email,
          password,
        });

        const { token } = response.data;
        const userFromResponse = response.data.user;
        setIsLogged(true);
        setRefreshToken(token);
        setUser(userFromResponse);
        Cookies.set('token', token);
        Cookies.set('user', JSON.stringify(userFromResponse));
        api.defaults.headers.authorization = `Bearer ${token}`;
        push('/');
      } catch (err) {
        message.error('Credenciais invalidas!');
      }
    },
    [push],
  );

  const logout = useCallback(() => {
    setIsLogged(false);
    setRefreshToken('');
    setUser({} as User);
    Cookies.remove('token');
    Cookies.remove('user');
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, refreshToken, register, login, logout, isLogged }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider!');
  }

  return context;
}

export { AuthProvider, useAuth };
