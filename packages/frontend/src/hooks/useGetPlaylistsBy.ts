import axios, { HttpStatusCode } from "axios";
import { api_url } from "../../config.json";
import { useEffect, useState } from "react";
import { Playlist } from "@/components/models/playlist";

interface GetPlaylistsByProps {
  userId: number | undefined;
  name: string | undefined;
  withMedias: boolean;
  isPublic: boolean | undefined;
  type: "music" | "serie" | "movies";
}

function useGetPlaylistsBy(props: GetPlaylistsByProps): [playlists: Array<Playlist>, getPlaylists: () => Promise<void>, error: any] {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);

  let endpoint = `${api_url}/playlists`;

  if (props) {
    const query = [];
    endpoint += '/by?';
    if (props.userId && props.userId !== 0) query.push('userId=' + props.userId);
    if (props.name && props.name.length > 0) query.push('name=' + props.name);
    if (props.withMedias) query.push('withMedias=true'); 
    if (props.isPublic) query.push('isPublic=true');
    endpoint += query.join('&');
  }

  const getPlaylists = async () => {
    try {
      const token: string | null = localStorage.getItem("onyxyaToken");
      if (token !== null) {
        const res = await axios.get(endpoint, {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [playlists, getPlaylists, error];
}

export default useGetPlaylistsBy;