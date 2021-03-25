import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import { useRouter } from 'next/router';

import { message } from 'antd';
import api from '../clients/api';

interface AuthContextData {
  user: User;
  setUser: (data: User) => void;
  refreshToken: string;
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  isLogged: boolean;
}

interface User {
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
  const [user, setUser] = useState<User>({ admin: true } as User);
  const [refreshToken, setRefreshToken] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('@OrtoSetup:token');

    if (token) {
      setIsLogged(true);
    }
  }, []);

  // const isLogged = true;
  // useMemo(() => !!Object.keys(user).length, [user])

  const register = useCallback(async ({ name, email, password }) => {
    try {
      const userToRegister = { name, email, password };
      await api.post('/users', userToRegister);
    } catch (err) {
      message.error('Erro ao fazer registro, por favor tente novamente.');
    }
  }, []);

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
        localStorage.setItem('@OrtoSetup:token', token);
        localStorage.setItem(
          '@OrtoSetup:user',
          JSON.stringify(userFromResponse),
        );
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
    localStorage.removeItem('@OrtoSetup:token');
    localStorage.removeItem('@OrtoSetup:user');
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
