import { jwtDecode } from "jwt-decode";
import { FC, ReactNode, createContext, useEffect, useState } from "react";

interface AuthContextType {
  authUser: AuthUser | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

interface AuthUser {
  id: number;
  username: string;
  role: {
    id: number;
    name: string;
    isActive: boolean,
  };
  exp: number;
  iat: number;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("onyxyaToken");
    if (token) {
      const user = parseJwt(token);
      if (user && user.exp * 1000 > Date.now()) {
        setAuthUser(user);
      } else {
        localStorage.removeItem("onyxyaToken");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("onyxyaToken", token);
    const user = parseJwt(token);
    if (user && user.exp * 1000 > Date.now()) {
      setAuthUser(user);
    } else {
      localStorage.removeItem("onyxyaToken");
    }
  };

  const logout = () => {
    localStorage.removeItem("onyxyaToken");
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

const parseJwt = (token: string): AuthUser | null => {
  try {
    const decoded = jwtDecode<AuthUser>(token);
    return decoded;
  } catch (e) {
    console.error("Invalid token");
    return null;
  }
};

export default AuthContext;
