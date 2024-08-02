import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import AuthContext from "@/utils/AuthContext";
import FrontUtilService from "@/utils/frontUtilService";
import { AxiosResponse, HttpStatusCode } from "axios";
import { useContext } from "react";

const DeleteMyAccountDialog = (props: { userId: number }) => {
  const logout = useContext(AuthContext)?.logout;

  const confirmDeleteMyAccount = async (): Promise<void> => {
    try {
      const endpoint = FrontUtilService.userEndpoint.replace(':id', props.userId.toString());
      const res: AxiosResponse = await FrontUtilService.deleteApi(endpoint);
      if (res.status === HttpStatusCode.Ok) {
        if (logout) logout();
      }
    } catch (error) {
      // TODO handle error plz
      alert('ee');
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive" className="bg-white text-red-600 border-2 border-red-600 hover:text-white">
          Delete my account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Are you sure to delete you'r account?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This action cannot be undone. This will permanently delete your user's account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-row justify-between">
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => confirmDeleteMyAccount()} className="bg-red-400 hover:bg-red-600">
            Confirm deletion
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteMyAccountDialog;