import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { HttpStatusCode } from 'axios';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import FrontUtilService from '@/utils/frontUtilService';
import { Playlist } from '../models/playlist';
import RemoveMusicFromPlaylist from '../playlists/removeMusic';

interface AddMusicPlaylistProps {
  reloadPlaylists: () => void;
  musicId: number;
  musicName: string;
  playlists: Array<Playlist>;
}

const AddMusicPlaylistPopup = (props: AddMusicPlaylistProps): JSX.Element => {
  const [popupOpened, setPopupOpened] = useState(false);
  const [error, setError] = useState("");
  const [errorText, setErrorText] = useState("No more details");
  const playlists: Array<Playlist> = props.playlists;

  const resetError = (): void => {
    setError('');
    setErrorText('');
  }

  const addToPlaylist = async (playlistId: number): Promise<void> => {
    try {
      // TODO: Change returned value
      if (playlistId === 0 || isNaN(playlistId)) return;
      const values = {
        mediaId: props.musicId,
        playlistId: playlistId,
      };
      const res: any = await FrontUtilService.postApi(FrontUtilService.addMusicPlaylistEndpoint, values);

      if (res.status !== HttpStatusCode.Ok) throw new Error(res.message);
      if (res.status === HttpStatusCode.Ok) props.reloadPlaylists();
    } catch (error: any) {
      setError('Adding music to playlist failed');
      setErrorText(`${error.message ? error.message : 'No more details'}`);
      setTimeout(() => { resetError() }, 4000);
    }
  }

  return (
    <Dialog open={popupOpened} onOpenChange={setPopupOpened}>
      <DialogTrigger>
        <Button variant="outline">
          <Plus /> Add to Playlist
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-100">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Add music to a playlist</DialogTitle>
        </DialogHeader>
        {
          playlists.length === 0 &&
          <p className='text-center'>
            No playlists found
          </p>
        }
        {
          playlists.map((playlist) => {
            const mediasPlaylistIds = playlist.mediasPlaylist.map((mediaPlst) => mediaPlst.media.id);
            return (
              <Card key={playlist.name + '-' + playlist.id}>
                <CardContent className='flex flex-row align-middle justify-between p-2 items-center'>
                  <div className='flex flex-row items-center'>
                    <h5 className='font-medium ml-2'>
                      {playlist.name}
                    </h5>
                    <p className='ml-4 text-sm'>
                      {
                        mediasPlaylistIds.length > 0 && 
                        `${mediasPlaylistIds.length} music(s)`
                      }
                      {
                        !mediasPlaylistIds.length && 'Empty'
                      }
                    </p>
                  </div>
                  {
                    !mediasPlaylistIds.includes(props.musicId) &&
                    <Button variant="default" onClick={() => addToPlaylist(playlist.id)}>
                      Add To Playlist
                    </Button>
                  }
                  {
                    mediasPlaylistIds.includes(props.musicId) &&
                    <RemoveMusicFromPlaylist 
                      musicName={props.musicName}
                      musicId={props.musicId} 
                      playlistId={playlist.id} 
                      setReload={props.reloadPlaylists} 
                    />
                  }
                </CardContent>
              </Card>
            );
          })
        }
        <DialogFooter>
          {
            error.length > 0 &&
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
                <br />
                {errorText}
              </AlertDescription>
            </Alert>
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMusicPlaylistPopup;