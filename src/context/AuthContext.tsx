import React, { createContext, useContext, useState, useEffect } from 'react';

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
   * INSCRIPTION FRONTEND (Prêt à être connecté au backend par votre développeur)
   */
  const signup = async (
    name: string,
    email: string,
    password: string,
    role: string = 'traveler',
    phone: string = ''
  ): Promise<AuthResult> => {
    if (!name || name.trim().length < 2) {
      return { success: false, error: 'Le nom doit comporter au moins 2 caractères.' };
    }
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Veuillez saisir une adresse e-mail valide.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Le mot de passe doit comporter au moins 6 caractères.' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: (role as any) || 'traveler',
      phone: phone.trim(),
    };

    const mockToken = `mock_jwt_token_${Date.now()}`;

    // On stocke en local pour que la maquette frontend réagisse
    setUser(newUser);
    setToken(mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(TOKEN_KEY, mockToken);

    return { success: true, user: newUser };
  };

  /**
   * CONNEXION FRONTEND (Prêt à être connecté au backend)
   */
  const login = async (email: string, password: string): Promise<AuthResult> => {
    if (!email || !password) {
      return { success: false, error: 'Veuillez remplir tous les champs.' };
    }

    // Récupère l'utilisateur stocké ou en crée un fictif pour la démo frontend
    const savedUser = localStorage.getItem(USER_KEY);
    let currentUser: User;

    if (savedUser) {
      currentUser = JSON.parse(savedUser);
    } else {
      currentUser = {
        id: `usr_demo`,
        name: email.split('@')[0],
        email: email.trim().toLowerCase(),
        role: 'traveler',
      };
    }

    const mockToken = `mock_jwt_token_${Date.now()}`;

    setUser(currentUser);
    setToken(mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    localStorage.setItem(TOKEN_KEY, mockToken);

    return { success: true, user: currentUser };
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
