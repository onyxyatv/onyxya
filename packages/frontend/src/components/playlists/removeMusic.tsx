import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import FrontUtilService from "@/utils/frontUtilService";
import { AxiosResponse, HttpStatusCode } from "axios";
import { Trash } from "lucide-react";

interface RemoveMusicProps {
  musicId: number;
  playlistId: number;
  musicName: string;
  setReload: (v: boolean) => void;
}

const RemoveMusicFromPlaylist = (props: RemoveMusicProps) => {

  const confirmDeleteUser = async (): Promise<void> => {
    try {
      const endpoint = `/playlists/playlist/${props.playlistId}/removeMedia/${props.musicId}`;
      const res: AxiosResponse = await FrontUtilService.deleteApi(endpoint);
      if (res.status === HttpStatusCode.Ok) props.setReload(true);
    } catch (error) {
      alert('ee');
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive" className="bg-white text-red-600 border-2 border-red-600 hover:text-white">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Are you sure to remove {props.musicName} ?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex flex-row justify-between">
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => confirmDeleteUser()} className="bg-red-300 hover:bg-red-500">
            Remove
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default RemoveMusicFromPlaylist;