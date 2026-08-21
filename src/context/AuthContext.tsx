import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser } from '../services/authService';

export interface User {
  id?: string;
  name: string;
  email: string;
  role?: 'tourist' | 'guide' | 'artisan' | 'admin' | 'traveler' | 'partner';
  accreditationStatus?: 'pending' | 'verified' | 'rejected' | 'info_requested';
  phone?: string;
  avatarUrl?: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  setUserSession: (user: User) => void;
  signup: (name: string, email: string, password: string, role?: string, phone?: string) => Promise<AuthResult>;
  logout: () => void;
}

const USER_KEY = 'afroku_frontend_user';
const TOKEN_KEY = 'afroku_frontend_token';

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: false,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  setUserSession: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Restore session from localStorage for frontend state persistence
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch (e) {
      console.error('Erreur de restauration de la session locale:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * INSCRIPTION — appelle le vrai backend (POST /api/auth/register).
   * Le mot de passe est haché côté serveur, jamais stocké en clair.
   */
  const signup = async (
    name: string,
    email: string,
    password: string,
    role: string = 'tourist',
    phone: string = ''
  ): Promise<AuthResult> => {
    try {
      const { token: realToken, user: realUser } = await registerUser(name, email, password, role, phone);

      setUser(realUser);
      setToken(realToken);
      localStorage.setItem(USER_KEY, JSON.stringify(realUser));
      localStorage.setItem(TOKEN_KEY, realToken);

      return { success: true, user: realUser };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erreur lors de la création du compte.' };
    }
  };

  /**
   * CONNEXION — appelle le vrai backend (POST /api/auth/login).
   */
  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { token: realToken, user: realUser } = await loginUser(email, password);

      setUser(realUser);
      setToken(realToken);
      localStorage.setItem(USER_KEY, JSON.stringify(realUser));
      localStorage.setItem(TOKEN_KEY, realToken);

      return { success: true, user: realUser };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erreur lors de la connexion.' };
    }
  };

  const setUserSession = (newUser: User) => {
    const mockToken = `mock_jwt_token_${Date.now()}`;
    setUser(newUser);
    setToken(mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(TOKEN_KEY, mockToken);
  };

  /**
   * DÉCONNEXION FRONTEND
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, setUserSession, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
