import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import FrontUtilService from "../../../utils/frontUtilService";
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
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";

type NewMediaDialogProps = {
  onMediaAdded?: () => void;
};

const NewMediaDialog = ({ onMediaAdded }: NewMediaDialogProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files?.[0];
    if (files) {
      setFile(files);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log(file);
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await FrontUtilService.postApi("/media", formData);
        if (res) {
          toast({
            title: "Media uploaded",
            description: "Media uploaded successfully",
            variant: "default",
          });
          if (onMediaAdded) {
            onMediaAdded();
          }
        } else {
          console.error("Error while uploading media");
        }
      }
    } catch (error) {
      console.error("Error while uploading media", error);
    }
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
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NewMediaDialog;
