import axios, { HttpStatusCode } from "axios";
import { api_url } from "../../config.json";
import { useEffect, useState } from "react";
import { User } from "@/components/models/user";

function useGetUsers(): [ users: Array<User>, getUsers: () => Promise<void>, error: any ] {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const getUsers = async () => {
    try {
      const token: string | null = localStorage.getItem("onyxyaToken");
      if (token !== null) {
        const res = await axios.get(`${api_url}/users`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.status === HttpStatusCode.Ok) setUsers(res.data.users);
      }
    } catch (error: any) {
      setError(error);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  return [ users, getUsers, error ];
}

export default useGetUsers;