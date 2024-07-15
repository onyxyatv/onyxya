import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import FrontUtilService from "@/utils/frontUtilService";
import { AxiosResponse, HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";

interface DeletePlaylistProps {
  playlistId: number;
  playlistName: string;
}

const DeletePlaylistDialog = (props: DeletePlaylistProps) => {
  const navigate = useNavigate();

  const confirmDeletePlaylist = async (): Promise<void> => {
    try {
      const endpoint = FrontUtilService.playlistById.replace(':id', props.playlistId.toString());
      const res: AxiosResponse = await FrontUtilService.deleteApi(endpoint);
      if (res.status === HttpStatusCode.Ok) navigate('/music');
    } catch (error) {
      alert('ee');
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive" className="bg-white text-red-600 border-2 border-red-600 hover:text-white">
          Delete Playlist
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Are you sure to delete : {props.playlistName} ?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This action cannot be undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-row justify-between">
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => confirmDeletePlaylist()} className="bg-red-500 hover:bg-red-700">
            Remove
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeletePlaylistDialog;