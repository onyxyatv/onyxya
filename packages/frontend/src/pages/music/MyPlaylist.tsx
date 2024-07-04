import Header from "@/components/header/header";
import { Playlist } from "@/components/models/playlist";
import MusicsPlaylistMenu from "@/components/music/musicsPlaylistMenu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import MusicPlayerContext from "@/utils/MusicPlayerContext";
import FrontUtilService from "@/utils/frontUtilService";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import 'react-h5-audio-player/lib/styles.css';
import { useNavigate, useParams } from "react-router-dom";

const MyPlaylist = () => {
  const { id }: any = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const fetchMusic = useContext(MusicPlayerContext)?.fetchMusic;
  const setPlaylistsMusics = useContext(MusicPlayerContext)?.setPlaylistsMusics;
  const setPlaylistMode = useContext(MusicPlayerContext)?.setPlaylistMode;

  const playMusic = (musicId: number): void => {
    if (fetchMusic) fetchMusic(musicId);
  }

  const playPlaylist = async (): Promise<void> => {
    const musicsToPlay: Array<string> = [];
    if (playlist && playlist.mediasPlaylist) {
      for (const mediaPlaylist of playlist.mediasPlaylist) {
        const musicSrc: string | null = await FrontUtilService.fetchMusic(mediaPlaylist.media.id);
        if (musicSrc) musicsToPlay.push(musicSrc);
      }
    }
    if (setPlaylistsMusics && setPlaylistMode) {
      setPlaylistMode();
      setPlaylistsMusics(musicsToPlay);
    }
  }

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
              <h2 className="text-2xl font-bold">
                {FrontUtilService.capitalizeString(playlist.name)}
              </h2>
              <p>
                {playlist.mediasPlaylist.length} music(s)
              </p>
              <div className="flex flex-row mt-2 space-x-2">
                {
                  playlist.mediasPlaylist.length > 0 &&
                  <Button onClick={() => playPlaylist()}>
                    Play
                  </Button>
                }
                <Button variant="destructive">
                  Delete Playlist
                </Button>
              </div>
              <div id="MyPlaylistMusicsContainer">
                <ol className="border-t-2 border-gray-500 mt-4 pt-2 space-y-2">
                  {
                    playlist.mediasPlaylist.map((mediaPlaylist) => {
                      return (
                        <li className="space-x-2 border-2 border-green-500 p-2 flex flex-row items-center">
                          <p>
                            {mediaPlaylist.media.name}
                          </p>
                          <Button onClick={() => playMusic(mediaPlaylist.media.id)}>
                            Play
                          </Button>
                          <Button variant="destructive" onClick={() => playMusic(mediaPlaylist.media.id)}>
                            Remove
                          </Button>
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