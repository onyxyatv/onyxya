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
import FrontUtilService from "@/utils/frontUtilService";
import { AxiosResponse, HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";

const DeleteUserDialog = (props: { userId: number }) => {
  const navigate = useNavigate();

  const confirmDeleteUser = async (): Promise<void> => {
    try {
      const endpoint = `/users/user/${props.userId}`;
      const res: AxiosResponse = await FrontUtilService.deleteApi(endpoint);
      if (res.status === HttpStatusCode.Ok) navigate('/settings/users-administration');
    } catch (error) {
      alert('ee');
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive" className="bg-white text-red-600 border-2 border-red-600 hover:text-white">
          Delete user
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Are you sure to delete user #{props.userId}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This action cannot be undone. This will permanently delete the user's account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-row justify-between">
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => confirmDeleteUser()} className="bg-red-300 hover:bg-red-500">
            Confirm deletion
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteUserDialog;