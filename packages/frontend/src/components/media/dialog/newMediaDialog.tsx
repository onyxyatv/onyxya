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
import { Input } from "@/components/ui/input";

type NewMediaDialogProps = {
  onMediaAdded?: () => void;
  disabled?: boolean;
};

const NewMediaDialog = ({ onMediaAdded, disabled }: NewMediaDialogProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files?.[0];
    if (files) {
      setFile(files);
    }
  };

  const handleSubmit = async () => {
    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await FrontUtilService.postApi("/media", formData);
        console.log("res", res);
        
        if (res.statusCode === 200) {
          toast({
            title: "Media uploaded",
            description: "Media uploaded successfully",
            variant: "default",
          });
          if (onMediaAdded) {
            onMediaAdded();
          }
        } else {
          console.error("Failed to upload media");
          toast({
            title: "Media upload failed",
            description: res.message,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error while uploading media", error);
      toast({
        title: "Media upload failed",
        description: `Failed to upload media ${error}`,
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      {
        !disabled ? (
          <AlertDialogTrigger>
            <Button size="sm" variant="default" className="m-1">
              Add media
            </Button>
          </AlertDialogTrigger>
        ) : (
          <Button size="sm" variant="default" className="m-1" disabled>
            Add media
          </Button>
        )
      }
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add media</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          <div>
            <Input type="file" onChange={handleFileChange}/>
          </div>
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
