import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correction : import sans accolades
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { api_url } from "../../config.json";

interface AuthContextType {
  authUser: AuthUser | null;
  login: (token: string) => Promise<void>;
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

  const parseJwt = useCallback((token: string): AuthUser | null => {
    try {
      const decoded = jwtDecode<AuthUser>(token);
      return decoded;
    } catch (e) {
      console.error("Invalid token", e);
      return null;
    }
  }, []);

  const getPermissions = useCallback(async (id: number, token: string) => {
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
  }, []);

  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem("onyxyaToken");
    if (!localStorage.getItem("onyxyaLang")) {
      localStorage.setItem("onyxyaLang", "en");
    }
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
  }, [parseJwt, getPermissions]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(
    async (token: string) => {
      localStorage.setItem("onyxyaToken", token);
      if (!localStorage.getItem("onyxyaLang")) {
        localStorage.setItem("onyxyaLang", "en");
      }
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
    },
    [parseJwt, getPermissions]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("onyxyaToken");
    setAuthUser(null);
    window.location.pathname = "/";
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
