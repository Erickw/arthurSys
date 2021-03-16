import React, { createContext, useState, useContext, useCallback, useEffect, useMemo } from 'react';

interface AuthContextData {
  user: User;
  setUser: (data: User) => void;
  refreshToken: string;
  register: (data: {email: string; password: string; }) => void;
  login: (data: {email: string; password: string; }) => void;
  logout: (user_id: string) => void;
  isLogged: Boolean;
}

interface User {
  email: string;
  password: string;
  admin: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>({ admin: true } as User)
  const [refreshToken, setRefreshToken] = useState('')

  useEffect(() => {
   
    
  }, [])

  const isLogged = true;
  // useMemo(() => !!Object.keys(user).length, [user])

  const register = useCallback(({ fullname, email, password }) => {
    console.log({fullname,email,password})
  }, [])
  
  const login = useCallback(({ email, password }) => {
   
    setUser({ ...user, email, password })

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