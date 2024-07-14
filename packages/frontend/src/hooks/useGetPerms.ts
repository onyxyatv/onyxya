import AuthContext from "@/utils/AuthContext";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { api_url } from "../../config.json";

// TODO : Fix the multiple requests
export function useGetPerms(): string[] | null | undefined {
  const { authUser } = useContext(AuthContext) ?? {};
  const [permissions, setPermissions] = useState<string[] | null | undefined>(
    undefined
  );
  const token = localStorage.getItem("onyxyaToken");
  const hasFetchedPermissions = useRef(false);

  useEffect(() => {
    if (authUser?.id && token && !hasFetchedPermissions.current) {
      getPermissions(authUser.id, token);
    } else if (!authUser?.id || !token) {
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
      hasFetchedPermissions.current = true;
    } catch (error: any) {
      console.error(error);
      setPermissions(null);
    }
  };

  return permissions;
}
