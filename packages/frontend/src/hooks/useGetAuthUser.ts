import { JwtPayload, jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export function useGetAuthUser(): JwtPayload | null {
  const [token] = useState<string | null>(localStorage.getItem("onyxyaToken"));
  const [decodedToken, setDecodedToken] = useState<JwtPayload | null>(null);

  useEffect(() => {
    if (token) {
      setDecodedToken(jwtDecode(token));
    }
  }, [token]);

  return decodedToken;
}
