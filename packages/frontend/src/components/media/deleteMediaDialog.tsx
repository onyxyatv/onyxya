import { useGetPerms } from "@/hooks/useGetPerms";
import FrontUtilService from "@/utils/frontUtilService";
import { AxiosResponse, HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

const DeleteMediaDialog = (props: { mediaId: number }) => {
  const navigate = useNavigate();
  const perms = useGetPerms();

  const confirmDeleteMedia = async (): Promise<void> => {
    try {
      if (!perms?.includes("delete_media")) {
        toast({
          title: "Delete media",
          description: "You don't have the permission to delete media",
          variant: "destructive",
        });
        return;
      }

      const endpoint = `/media/${props.mediaId}`;
      const res: AxiosResponse = await FrontUtilService.deleteApi(endpoint);

      if (res.status === HttpStatusCode.Ok) {
        navigate("/media");
        toast({
          title: "Delete media",
          description: "Media removed successfully",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Delete media",
        description: "An error occurred while deleting the media",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          variant="destructive"
          className="bg-white text-red-600 border-2 border-red-600 hover:text-white"
        >
          Delete media
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Are you sure to delete media #{props.mediaId}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This action cannot be undone. This will permanently delete the
            media.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-row justify-between">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => confirmDeleteMedia()}
            className="bg-red-500 hover:bg-red-500"
          >
            Confirm deletion
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMediaDialog;
