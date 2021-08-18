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
  type: 'admin' | 'cadista' | 'cliente';
}

interface RegisterProps {
  name: string;
  email: string;
  password: string;
  type: 'admin' | 'cadista' | 'cliente';
  state?: string;
  city?: string;
  zipCode?: string;
  neighborhood?: string;
  street?: string;
  number?: string;
  contactNumber?: string;
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
    const token = Cookies.get('ortoSetup.token');
    const userFromLocalStorage = Cookies.getJSON('ortoSetup.user');

    if (token && userFromLocalStorage) {
      setUser(userFromLocalStorage);
      setRefreshToken(token);
      setIsLogged(true);
      api.defaults.headers.authorization = `Bearer ${token}`;
    }
  }, []);

  const register = useCallback(
    async ({
      name,
      email,
      password,
      type,
      state,
      city,
      zipCode,
      neighborhood,
      street,
      number,
      contactNumber,
    }: RegisterProps) => {
      try {
        const userToRegister = {
          name,
          email,
          password,
          type,
          state,
          city,
          zipCode,
          neighborhood,
          street,
          number,
          contactNumber,
        };

        await api.post('/users', userToRegister);
        message.success('Usuário criado com sucesso', 4);
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

        Cookies.set('ortoSetup.token', token, {
          expires: 7, // one week to expire token
        });
        Cookies.set('ortoSetup.user', JSON.stringify(userFromResponse), {
          expires: 7,
        });

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
    Cookies.remove('ortoSetup.token');
    Cookies.remove('ortoSetup.user');
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
