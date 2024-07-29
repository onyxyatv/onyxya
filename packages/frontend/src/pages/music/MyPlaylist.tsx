import Header from "@/components/header/header";
import { Playlist } from "@/components/models/playlist";
import MusicsPlaylistMenu from "@/components/music/musicsPlaylistMenu";
import DeletePlaylistDialog from "@/components/playlists/deletePlaylistDialog";
import EditPlaylistPopup from "@/components/playlists/editPlaylist";
import playlistMusicsCols from "@/components/playlists/playlistMusicsCols";
import { PlaylistMusicsTable } from "@/components/playlists/playlistMusicsTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import AuthContext from "@/utils/AuthContext";
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
  const setPlaylistsMusics = useContext(MusicPlayerContext)?.setPlaylistsMusics;
  const setPlaylistMode = useContext(MusicPlayerContext)?.setPlaylistMode;
  const setPlaylistRandom = useContext(MusicPlayerContext)?.setRandomMode;
  const fetchMusic = useContext(MusicPlayerContext)?.fetchMusic;
  const [needReload, setReload] = useState<boolean>(false);
  const userId: number | undefined = useContext(AuthContext)?.authUser?.id;

  const playMusic = (musicId: number): void => {
    if (fetchMusic) fetchMusic(musicId);
  }

  const playPlaylist = async (random: boolean): Promise<void> => {
    const musicsToPlay: Array<string> = [];
    if (playlist && playlist.mediasPlaylist) {
      for (const mediaPlaylist of playlist.mediasPlaylist) {
        const musicSrc: string | null = await FrontUtilService.fetchMusic(mediaPlaylist.media.id);
        if (musicSrc) musicsToPlay.push(musicSrc);
      }
    }
    if (setPlaylistsMusics && setPlaylistMode) {
      setPlaylistMode();
      if (random && setPlaylistRandom) setPlaylistRandom(true);
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
    if (needReload) setReload(false);
  }, [id, needReload]);

  return (
    <div>
      <Header />

      <section className="flex justify-start p-2">
        <MusicsPlaylistMenu needPlaylistsReload={needReload} setPlaylistsReload={setReload} />
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
              {
                playlist.user.id !== userId &&
                <h3>The playlist is managed by {playlist.user.username}</h3>
              }
              <p>
                {playlist.mediasPlaylist.length} music(s)
              </p>
              {
                playlist.description !== undefined &&
                <p className="font-thin">
                  {playlist.description}
                </p>
              }
              <div className="flex flex-row mt-2 space-x-2">
                {
                  playlist.mediasPlaylist.length > 0 &&
                  <Button onClick={() => playPlaylist(false)}>
                    Play
                  </Button>
                }
                {
                  playlist.mediasPlaylist.length > 1 &&
                  <Button 
                    className="bg-indigo-900 hover:bg-indigo-700" 
                    onClick={() => playPlaylist(true)}
                  >
                    Random play
                  </Button>
                }
                <EditPlaylistPopup playlist={playlist} reloadPlaylist={(v: boolean) => setReload(v)} />
                <DeletePlaylistDialog
                  playlistId={playlist.id}
                  playlistName={playlist.name}
                />
              </div>
              <div id="MyPlaylistMusicsContainer">
                <PlaylistMusicsTable
                  columns={playlistMusicsCols({
                    playMusic: playMusic, playlistId: playlist.id,
                    setReload: setReload
                  })}
                  data={playlist.mediasPlaylist}
                />
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