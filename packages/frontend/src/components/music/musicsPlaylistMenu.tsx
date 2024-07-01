import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import useGetPlaylists from "@/hooks/useGetPlaylists";

interface PlaylistMenuProps {
  selectPlaylist: (playlistId: number) => Promise<void>;
}

const MusicsPlaylistMenu = (props: PlaylistMenuProps) => {
  const [needReload, setNeedReload] = useState(false);
  const [playlists, setPlaylists] = useGetPlaylists();

  useEffect(() => {
    if (needReload) {
      setPlaylists();
      setNeedReload(false);
    }
    props.selectPlaylist(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needReload]);

  return (
    <div id="MusicsPlaylistMenu" 
    className="w-1/6 items-center border-r-4 mr-2 h-[80vh] border-gray-500 flex flex-col p-2">
      <Button variant="outline" className="w-52 border-2 border-gray-500 hover:border-transparent">
        <Plus /> New Playlist
      </Button>
      {
        playlists !== undefined &&
        playlists.length > 0
      }
      {
        (playlists === undefined || playlists.length === 0) &&
        <p className="mt-auto mb-auto text-gray-500">
          No playlists found
        </p>
      }
    </div>
  );
}

export default MusicsPlaylistMenu;