import { AlertDialog, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const DeleteUserDialog = (props: { userId: number }) => {
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
          <AlertDialogAction className="bg-red-300 hover:bg-red-500">
            Confirm deletion
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteUserDialog;