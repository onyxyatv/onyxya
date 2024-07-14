import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FC, ReactNode, createContext, useEffect, useState } from "react";
import { api_url } from "../../config.json";

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
    isActive: boolean;
  };
  exp: number;
  iat: number;
  permissions: string[];
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("onyxyaToken");
      if (token) {
        const user = parseJwt(token);
        if (user && user.exp * 1000 > Date.now()) {
          const permissions = await getPermissions(user.id, token);
          if (permissions) {
            setAuthUser({ ...user, permissions });
          } else {
            localStorage.removeItem("onyxyaToken");
          }
        } else {
          localStorage.removeItem("onyxyaToken");
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("onyxyaToken", token);
    const user = parseJwt(token);
    if (user && user.exp * 1000 > Date.now()) {
      const permissions = await getPermissions(user.id, token);
      if (permissions) {
        setAuthUser({ ...user, permissions });
      } else {
        localStorage.removeItem("onyxyaToken");
      }
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

const getPermissions = async (id: number, token: string) => {
  try {
    const res = await axios.get(
      `${api_url}/users/user/${id}/permissions/owned`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.data) {
      return null;
    }

    const permissions = res.data.permissions.map((p: any) => p.name);

    return permissions;
  } catch (error: any) {
    console.error("Error while getting permissions", error);
    return null;
  }
};

export default AuthContext;
