import axios, { HttpStatusCode } from "axios";
import { api_url } from "../../config.json";
import { useEffect, useState } from "react";

function useGetUsers(): Array<any> {
  try {
    const [users, setUsers] = useState([]);

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
    alert("Error");
    return [];
  }
}

export default useGetUsers;