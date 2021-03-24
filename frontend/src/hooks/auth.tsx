import React, { createContext, useState, useContext, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

import api from '../clients/api';

interface AuthContextData {
  user: User;
  setUser: (data: User) => void;
  refreshToken: string;
  register: (data: {name: string; email: string; password: string; }) => Promise<void>;
  login: (data: {email: string; password: string; }) => Promise<void>;
  logout: (user_id: string) => void;
  isLogged: Boolean;
}

interface User {
  name: string;
  email: string;
  password: string;
  admin: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>({ admin: true } as User)
  const [refreshToken, setRefreshToken] = useState('');
  const [isLogged, setIsLogged] = useState(true);
  const { push } = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('@OrtoSetup:token');
    const token = localStorage.getItem('@OrtoSetup:token');
    if (user) {
      console.log(user);
      //setUser(JSON.parse(user));
    }
    
    if (token) {
      setRefreshToken(token);
    }
  }, [])

  //const isLogged = true;
  // useMemo(() => !!Object.keys(user).length, [user])

  const register = useCallback(async ({ name, email, password }) => {
    console.log({ name,email,password })
    const userToRegister = { name, email, password };
    await api.post('/users', userToRegister);
  }, [])
  
  const login = useCallback(async ({ email, password }) => {
    try {
      const response = await api.post('sessions', {
        email,
        password
      });
  
      const { token } = response.data;
      const userName = response.data.user.name;
      setIsLogged(true);
      setRefreshToken(token);
      setUser({ ...user, email, password, name: userName });
      localStorage.setItem('@OrtoSetup:token', token);
      localStorage.setItem('@OrtoSetup:user', JSON.stringify(user));
      push('/');
      
    } catch (err) {
      console.log(err);
    }
  }, [])
  
  const logout = useCallback((user_id: string) => {
  
  }, [])
  
  return (
    <AuthContext.Provider value={{ user, setUser, refreshToken, register, login, logout, isLogged }}>
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