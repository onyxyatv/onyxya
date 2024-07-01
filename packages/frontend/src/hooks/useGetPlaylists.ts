import axios, { HttpStatusCode } from "axios";
import { api_url } from "../../config.json";
import { useEffect, useState } from "react";
import { User } from "@/components/models/user";

function useGetPlaylists(): [ playlists: Array<User>, getPlaylists: () => Promise<void>, error: any ] {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);

  const getPlaylists = async () => {
    try {
      const token: string | null = localStorage.getItem("onyxyaToken");
      if (token !== null) {
        const res = await axios.get(`${api_url}/playlists`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.status === HttpStatusCode.Ok) setPlaylists(res.data.playlists);
      }
    } catch (error: any) {
      setError(error);
    }
  }

  useEffect(() => {
    getPlaylists();
  }, []);

  return [ playlists, getPlaylists, error ];
}

export default useGetPlaylists;