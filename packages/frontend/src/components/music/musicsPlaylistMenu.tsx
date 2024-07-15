import { useContext, useEffect, useState } from "react";
import useGetPlaylistsBy from "@/hooks/useGetPlaylistsBy";
import NewPlaylistPopup from "../playlists/newPlaylist";
import AuthContext from "@/utils/AuthContext";
import { useNavigate } from "react-router-dom";

const MusicsPlaylistMenu = () => {
  const authUser: any = useContext(AuthContext)?.authUser?.id;
  const userId: number = (authUser) ? authUser.id : 0;
  const [needReload, setNeedReload] = useState(false);
  const [playlists, setPlaylists] = useGetPlaylistsBy({
    userId: userId,
    name: "",
    withMedias: false,
  });
  const navigate = useNavigate();

  const selectPlaylist = (playlistId: number): void => {
    if (!isNaN(playlistId) && playlistId !== 0) {
      navigate('/music/playlist/' + playlistId);
    }
  }

  useEffect(() => {
    if (needReload) {
      setPlaylists();
      setNeedReload(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needReload]);

  return (
    <div id="MusicsPlaylistMenu"
      className="w-1/6 items-center border-r-4 mr-2 h-[80vh] border-gray-500 flex flex-col p-2">
      <NewPlaylistPopup reloadPlaylists={() => setNeedReload(true)} playlistType="music" />
      <p className="text-xs mt-2">You have {playlists ? playlists.length : 0} playlist(s)</p>
      {
        (playlists !== undefined &&
          playlists.length > 0) &&
        <section
          className="mt-2 p-2 space-y-2 border-t-2 w-full border-gray-300 flex flex-col items-center">
          {
            playlists.map((playlist) => {
              return (
                <div key={`playlist-${playlist.name}`} onClick={() => selectPlaylist(playlist.id)}
                  className="flex justify-between w-full flex-row hover:cursor-pointer hover:bg-gray-300 p-2 rounded-sm">
                  <h5>{playlist.name}</h5>
                  <p className="text-xs">{playlist.description}</p>
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