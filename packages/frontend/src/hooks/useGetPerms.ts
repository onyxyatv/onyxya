import AuthContext from "@/utils/AuthContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { api_url } from "../../config.json";

export function useGetPerms(): string[] | null | undefined {
  const { authUser } = useContext(AuthContext) ?? {};
  const [permissions, setPermissions] = useState<string[] | null | undefined>(undefined);
  const token = localStorage.getItem("onyxyaToken");

  useEffect(() => {
    if (authUser?.id && token) {
      getPermissions(authUser.id, token);
    } else {
      setPermissions(null);
    }
  }, [authUser, token]);

  const getPermissions = async (id: number, token: string) => {
    try {
      const res = await axios.get(
        `${api_url}/users/user/${id}/permissions/owned`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const activePermissions = res.data.permissions
        .filter((perm: any) => perm.isActive)
        .map((perm: any) => perm.name);

      setPermissions(activePermissions);
    } catch (error: any) {
      console.error(error);
      setPermissions(null);
    }
  };

  return permissions;
}
