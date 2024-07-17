import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Globe, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Playlist } from "../models/playlist";
import useGetPlaylistsBy from "@/hooks/useGetPlaylistsBy";

interface PlaylistsMenuListProps {
  myPlaylists: Array<Playlist>;
}

const PlaylistsMenuList = (props: PlaylistsMenuListProps) => {
  const [publicPlaylists] = useGetPlaylistsBy({ 
    withMedias: false,
    isPublic: true,
    userId: undefined,
    name: undefined,
  });
  const playlistsByVisibility = [
    { tabName: 'myPlaylists', playlists: props.myPlaylists },
    { tabName: 'publicPlaylists', playlists: publicPlaylists },
  ];
  const navigate = useNavigate();

  const selectPlaylist = (playlistId: number): void => {
    if (!isNaN(playlistId) && playlistId !== 0) {
      navigate('/music/playlist/' + playlistId);
    }
  }

  return (
    <Tabs defaultValue="myPlaylists" className="w-full">
      <TabsList className="justify-arround flex mt-2">
        <TabsTrigger className="bg-muted" value="myPlaylists">My Playlists</TabsTrigger>
        <TabsTrigger className="bg-muted" value="publicPlaylists">Public Playlists</TabsTrigger>
      </TabsList>
      {
        playlistsByVisibility.map((playlistContainer) => {
          return (
            <TabsContent value={playlistContainer.tabName}>
              {
                (playlistContainer.playlists !== undefined &&
                  playlistContainer.playlists.length > 0) &&
                <section
                  className="mt-2 p-2 space-y-2 border-t-2 w-full border-gray-300 flex flex-col items-center">
                  {
                    playlistContainer.playlists.map((playlist) => {
                      return (
                        <div key={`playlist-${playlist.name}`} onClick={() => selectPlaylist(playlist.id)}
                          className="w-full hover:cursor-pointer hover:bg-gray-300 p-2 rounded-sm">
                          <div className="flex w-full justify-between">
                            <h5>{playlist.name}</h5>
                            {
                              playlist.visibility === 'private' ?
                                <Lock className="text-gray-500" /> : <Globe className="text-gray-500" />
                            }
                          </div>
                          <p className="text-xs">
                            {playlist.description.length < 30 && playlist.description}
                            {playlist.description.length > 30 && playlist.description.slice(0, 30) + '...'}
                          </p>
                        </div>
                      );
                    })
                  }
                </section>
              }
              {
                (playlistContainer.playlists === undefined || playlistContainer.playlists.length === 0) &&
                <p className="mt-auto mb-auto text-gray-500">
                  No playlists found
                </p>
              }
            </TabsContent>
          );
        })
      }
    </Tabs>
  );
}

export default PlaylistsMenuList;