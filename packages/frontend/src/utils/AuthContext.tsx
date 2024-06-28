import { jwtDecode } from "jwt-decode";
import { FC, ReactNode, createContext, useEffect, useState } from "react";

interface AuthContextType {
  authUser: AuthUser | null;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthUser {
  id: number;
  username: string;
  role: string;
  exp: number;
  iat: number;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("onyxyaToken");
    if (token) {
      const user = parseJwt(token);
      setAuthUser(user);
      console.log("User logged in : ", user);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("onyxyaToken", token);
    const user = parseJwt(token);
    setAuthUser(user);
  };

  const logout = () => {
    localStorage.removeItem("onyxyaToken");
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const parseJwt = (token: string): AuthUser | null => {
  try {
    return jwtDecode<AuthUser>(token);
  } catch (e) {
    console.error("Invalid token");
    return null;
  }
};

export default AuthContext;
