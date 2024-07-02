import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, Plus } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AxiosResponse, HttpStatusCode } from 'axios';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import FrontUtilService from '@/utils/frontUtilService';
import useGetPlaylistsBy from '@/hooks/useGetPlaylistsBy';

interface AddMusicPlaylistProps {
  reloadPlaylists: any;
  musicId: number;
  userId: number;
}

const AddMusicPlaylistPopup = (props: AddMusicPlaylistProps) => {
  const [popupOpened, setPopupOpened] = useState(false);
  const [error, setError] = useState("");
  const [errorText, setErrorText] = useState("No more details");
  const [playlists] = useGetPlaylistsBy({
    userId: props.userId,
    name: ""
  });

  const addToPlaylist = async (playlistId: number) => {
    try {
      if (playlistId === 0 || isNaN(playlistId)) return;
      const values = {
        mediaId: props.musicId,
        playlistId: playlistId
      };
      const res: AxiosResponse = await FrontUtilService.postApi(FrontUtilService.newPlaylistEndpoint, values);
      if (res.status === HttpStatusCode.Ok) {
        props.reloadPlaylists();
      }

    } catch (error: any) {
      const errorMessage: string = (error.response !== undefined) ? error.response.statusText : "No More details";
      setError('User creation failed. Please try again');
      setErrorText(`Error status : ${errorMessage}`);
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
          <DialogDescription>
            <Card>
              <CardContent>
                {
                  playlists.map((playlist) => {
                    return (
                      playlist.name + ' ' + playlist.id
                    );
                  })
                }
              </CardContent>
              <CardFooter>
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
              </CardFooter>
            </Card>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddMusicPlaylistPopup;