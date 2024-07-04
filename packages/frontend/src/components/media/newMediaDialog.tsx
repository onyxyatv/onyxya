import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

/*
This dialog should display a button to open the dialog, and the dialog should contain :
- The list of file that the user uploaded + a button to remove the file
- A button to upload a file
- A button to close the dialog
- A button to submit the dialog

When the user click on the button to upload a file, it should open the file picker dialog
When the user click on the button to remove a file, it should remove the file from the list
When the user click on the button to close the dialog, it should close the dialog
When the user click on the button to submit the dialog, it should submit the dialog

We will use AlertDialog component from Shadcn UI for the dialog
*/
const NewMediaDialog = () => {

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFile(file);
    }
    console.log(file);

  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          variant="destructive"
          className="bg-white text-red-600 border-2 border-red-600 hover:text-white"
        >
          Add media
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add media</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          <input type="file" onChange={handleFileChange} />
          <Button onClick={() => setFile(null)} size={"sm"} variant="destructive" className="bg-white text-red-600 border-2 border-red-600 hover:text-white">
            Remove file
          </Button>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Submit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NewMediaDialog;
