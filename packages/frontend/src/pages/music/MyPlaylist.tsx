import Header from "@/components/header/header";
import { Playlist } from "@/components/models/playlist";
import MusicsPlaylistMenu from "@/components/music/musicsPlaylistMenu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import FrontUtilService from "@/utils/frontUtilService";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import 'react-h5-audio-player/lib/styles.css';
import { useNavigate, useParams } from "react-router-dom";

const MyPlaylist = () => {
  const { id }: any = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  const fetchPlaylist = async (playlistId: number) => {
    try {
      const endpoint = FrontUtilService.playlistById.replace(':id', playlistId.toString());
      const data = await FrontUtilService.getDataFromApi(endpoint);
      setPlaylist(data);
    } catch (error) {
      // TODO: error displayed
      return;
    }
  }

  useEffect(() => {
    fetchPlaylist(id);
  }, [id]);

  return (
    <div>
      <Header />

      <section className="flex justify-start p-2">
        <MusicsPlaylistMenu />
        <div>
          <ArrowLeft
            className="w-5 hover:cursor-pointer"
            onClick={() => navigate("/music")}
          />
          {
            playlist !== null &&
            <div id="MyPlaylistContainer">
              <h2 className="text-xl font-bold">
                { FrontUtilService.capitalizeString(playlist.name) }
              </h2>
              <div className="flex flex-row mt-2 space-x-2">
                <Button>
                  Play
                </Button>
                <Button variant="destructive">
                  Delete Playlist
                </Button>
              </div>
              <div id="MyPlaylistMusicsContainer">
                <ol>
                  {
                    playlist.medias.map((music) => {
                      return (
                        <li>
                          {music.name}
                        </li>
                      );
                    })
                  }
                </ol>
              </div>
            </div>
          }
        </div>
        {
          id === null &&
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-2xl">Error</AlertTitle>
            <AlertDescription className="text-lg">
              Playlist not found!
            </AlertDescription>
          </Alert>
        }
      </section>
    </div>
  );
};

export default MyPlaylist;