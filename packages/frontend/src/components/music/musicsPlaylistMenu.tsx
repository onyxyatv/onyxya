import { useContext, useEffect, useState } from "react";
import useGetPlaylistsBy from "@/hooks/useGetPlaylistsBy";
import NewPlaylistPopup from "../playlists/newPlaylist";
import AuthContext from "@/utils/AuthContext";
import PlaylistsMenuList from "./playlistsList";

const MusicsPlaylistMenu = () => {
  const authUser: any = useContext(AuthContext)?.authUser?.id;
  const userId: number = (authUser) ? authUser.id : 0;
  const [needReload, setNeedReload] = useState(false);
  const [playlists, setPlaylists] = useGetPlaylistsBy({
    userId: userId,
    name: "",
    withMedias: false,
    isPublic: undefined,
  });

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
      <PlaylistsMenuList myPlaylists={playlists} />
    </div>
  );
}

export default MusicsPlaylistMenu;