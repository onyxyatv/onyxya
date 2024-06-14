import axios, { HttpStatusCode } from "axios";
import { api_url } from "../../config.json";
import { useEffect, useState } from "react";
import { User } from "@/components/models/user";

function useGetUsers(): Array<User> {
  const [users, setUsers] = useState([]);
  try {
    useEffect(() => {
      const getUsers = async () => {
        const token: string | null = localStorage.getItem("onyxyaToken");
        if (token !== null) {
          const res = await axios.get(`${api_url}/users`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (res.status === HttpStatusCode.Ok) setUsers(res.data.users);
        }
      }

      getUsers();
    }, []);

    return users;
  } catch (error) {
    return [];
  }
}

export default useGetUsers;