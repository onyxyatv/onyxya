import { useEffect, useState } from "react";
import useGetPlaylistsBy from "@/hooks/useGetPlaylistsBy";
import NewPlaylistPopup from "./newPlaylist";
import { useGetAuthUser } from "@/hooks/useGetAuthUser";
import { Button } from "../ui/button";
import { Play } from "lucide-react";

interface PlaylistMenuProps {
  selectPlaylist: (playlistId: number) => Promise<void>;
}

const MusicsPlaylistMenu = (props: PlaylistMenuProps) => {
  const authUser: any = useGetAuthUser();
  const userId: number = (authUser) ? authUser.id : 0;
  const [needReload, setNeedReload] = useState(false);
  const [playlists, setPlaylists] = useGetPlaylistsBy({
    userId: userId,
    name: ""
  });

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
        <NewPlaylistPopup reloadPlaylists={() => setNeedReload(true)} />
      {
        (playlists !== undefined &&
        playlists.length > 0) && 
        <section 
        className="mt-2 p-2 space-y-2 border-t-2 w-full border-gray-300 flex flex-col items-center">
          {
            playlists.map((playlist) => {
              return (
                <div 
                className="flex justify-between w-full flex-row hover:cursor-pointer hover:bg-gray-300 p-2 rounded-sm">
                  <h5>{playlist.name}</h5>
                  <Button variant="default">
                    <Play />
                  </Button>
                </div>
              );
            })
          }
        </section>
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