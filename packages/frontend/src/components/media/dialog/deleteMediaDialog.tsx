import FrontUtilService from "@/utils/frontUtilService";
import { AxiosResponse, HttpStatusCode } from "axios";
import { useTranslation } from "react-i18next";
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
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";
import { toast } from "../../ui/use-toast";

type DeleteMediaDialogProps = {
  mediaId: number;
  onMediaDeleted?: () => void;
  disabled?: boolean;
};

const DeleteMediaDialog = ({
  mediaId,
  onMediaDeleted,
  disabled,
}: DeleteMediaDialogProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const confirmDeleteMedia = async (): Promise<void> => {
    try {
      const endpoint = `/media/${mediaId}`;
      const res: AxiosResponse = await FrontUtilService.deleteApi(endpoint);

      if (res.status === HttpStatusCode.Ok) {
        navigate("/media");
        toast({
          title: "Delete media",
          description: "Media removed successfully",
          variant: "default",
        });

        if (onMediaDeleted) onMediaDeleted();
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
      {!disabled ? (
        <AlertDialogTrigger>
          <Button
            size="sm"
            variant="destructive"
            className="m-1 bg-white text-red-600 border-2 border-red-600 hover:text-white"
          >
            {t("media.table.action.delete")}
          </Button>
        </AlertDialogTrigger>
      ) : (
        <Button
          size="sm"
          variant="destructive"
          className="m-1 bg-white text-red-600 border-2 border-red-600 hover:text-white"
          disabled
        >
          {t("media.table.action.delete")}
        </Button>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Are you sure to delete media #{mediaId}
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
