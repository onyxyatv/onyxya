import FrontUtilService from "@/utils/frontUtilService";
import { useContext, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, Play } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import AddMusicPlaylistPopup from "./addMusicPlaylist";
import AuthContext from "@/utils/AuthContext";
import MusicPlayerContext from "@/utils/MusicPlayerContext";
import useGetPlaylistsBy from "@/hooks/useGetPlaylistsBy";
import EditMediaDialog from "../media/dialog/editMediaDialog";
import { MediaCard } from "../models/media";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

interface MusicsListsProps {
  setPlaylistsReload: (v: boolean) => void;
  needPlaylistsReload: boolean;
}

interface Music {
  id: number;
  mediaCard: MediaCard;
}

type MusicCategories = Record<string, Array<Music>>;

const MusicsLists = (props: MusicsListsProps) => {
  const userId: number | undefined = useContext(AuthContext)?.authUser?.id;
  const [musicsByCategories, setMusics] = useState<MusicCategories>({});
  const [error, setError] = useState('');
  const musicContext = useContext(MusicPlayerContext);
  const [playlists, getPlaylists] = useGetPlaylistsBy({
    userId: (userId) ? userId : 0,
    name: "",
    withMedias: true,
    isPublic: undefined,
  });
  const [needLocalReload, setLocalReload] = useState<boolean>(false);

  const playMusic = (musicId: number) => {
    if (musicContext?.fetchMusic) {
      musicContext.setMusicMode();
      musicContext?.fetchMusic(musicId);
    }
  }

  const fetchAllMusics = async () => {
    try {
      const endpoint: string = FrontUtilService.getMediaByTypeCategories.replace(':mediaType', 'music');
      const data: any | null = await FrontUtilService.getDataFromApi(endpoint);
      if (data !== null) {
        setMusics(data.categories);
        setError('');
      }
    } catch (error) {
      setMusics({});
      setError('Error during fetching musics list');
    }
  }

  useEffect(() => {
    fetchAllMusics();
    if (needLocalReload || props.needPlaylistsReload) {
      getPlaylists();
      setLocalReload(false);
      props.setPlaylistsReload(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needLocalReload, props.needPlaylistsReload]);

  return (
    <div id="musicsListContainer" className="w-5/6">
      <ScrollArea className="h-[80vh] p-2 pr-6 border-b-2 border-b-gray-600 rounded-sm">
        {
          musicsByCategories !== null &&
          Object.keys(musicsByCategories).map((musicCategoryName: string) => {
            return (
              <div className={`musics-list-${musicCategoryName}-category border-2 mb-2 border-gray-300 p-2`}>
                <h2 className="text-lg font-bold">
                  {
                    FrontUtilService.capitalizeString(musicCategoryName)
                  }
                </h2>
                <p>
                  {musicsByCategories[musicCategoryName].length} {
                    (musicsByCategories[musicCategoryName].length > 1) ? 'musics' : 'music'
                  }
                </p>
                <div id={`${musicCategoryName}MusicContainer`} key={musicCategoryName} className="flex flex-row align-middle">
                  <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                    <div className="flex w-max space-x-4 p-4">
                      {
                        musicsByCategories[musicCategoryName].map((music: Music) => {
                          return (
                            <Card className="m-2">
                              <CardHeader className="h-24">
                                <CardTitle className="text-sm">
                                  {music.mediaCard.name}
                                </CardTitle>
                                <CardDescription>
                                  {
                                    (music.mediaCard.description !== null &&
                                      music.mediaCard.description.length > 0) ?
                                      music.mediaCard.description : 'No description'
                                  }
                                </CardDescription>
                              </CardHeader>
                              <CardFooter className="space-x-2">
                                <Button className="bg-green-700 hover:bg-green-600" onClick={() => playMusic(music.id)}>
                                  <Play />
                                </Button>
                                <AddMusicPlaylistPopup
                                  playlists={playlists}
                                  musicName={music.mediaCard.name}
                                  reloadPlaylists={() => setLocalReload(true)}
                                  musicId={music.id}
                                />
                                <EditMediaDialog mediaId={music.id} onUpdate={() => setLocalReload(true)} />
                              </CardFooter>
                            </Card>
                          );
                        })
                      }
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>

                </div>
              </div>
            );
          })
        }
      </ScrollArea>
      {
        error.length > 0 &&
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      }
    </div>
  );
}

export default MusicsLists;