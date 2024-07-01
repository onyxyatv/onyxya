import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FrontUtilService from "@/utils/frontUtilService";
import {
  MediaCard,
  MediaType,
  MediaCategory,
  mediaCardSchema,
} from "@common/validation/media/mediaCard.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosResponse, HttpStatusCode } from "axios";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type EditMediaPopupProps = {
  mediaCard: MediaCard;
  reloadMediaCards: () => void;
  isOpen: boolean;
  onClose: () => void;
};

const EditMediaPopup = ({
  mediaCard,
  reloadMediaCards,
  isOpen,
  onClose,
}: EditMediaPopupProps) => {
  const [error, setError] = useState("");
  const [errorText, setErrorText] = useState("No more details");

  const form = useForm<MediaCard>({
    resolver: zodResolver(mediaCardSchema),
    mode: "onSubmit",
    defaultValues: mediaCard,
  });

  const handleEditMedia = async (values: MediaCard) => {
    try {
      const res: AxiosResponse = await FrontUtilService.patchApi(
        `/media/${values.id}`,
        values
      );
      if (res.status === HttpStatusCode.Ok) {
        form.reset();
        reloadMediaCards();
        onClose();
      }
    } catch (error: any) {
      const errorMessage: string =
        error.response !== undefined
          ? error.response.statusText
          : "No More details";
      setError("Media update failed. Please try again");
      setErrorText(`Error status : ${errorMessage}`);
    }
  };

  useEffect(() => {
    form.reset(mediaCard);
    console.log("Media Card", mediaCard);
  }, [form, mediaCard]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-100">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Edit Media</DialogTitle>
          <DialogDescription>
            <Card>
              <CardHeader>
                <CardDescription className="text-center">
                  Edit the information below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleEditMedia)}>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              className="border-slate-200 border-2 bg-slate-100"
                              placeholder="Media Name"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Name of the media</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="mt-2">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input
                                className="border-slate-200 border-2 bg-slate-100"
                                placeholder="Description"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Brief description of the media
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-2">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="p-2 rounded-md w-full border-slate-200 border-2 bg-slate-100">
                                  <SelectValue placeholder="Choose Type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.keys(MediaType).map((key) => (
                                  <SelectItem
                                    key={key}
                                    value={
                                      MediaType[key as keyof typeof MediaType]
                                    }
                                  >
                                    {MediaType[key as keyof typeof MediaType]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Select the type of media
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-2">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="p-2 rounded-md w-full border-slate-200 border-2 bg-slate-100">
                                  <SelectValue placeholder="Choose Category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.keys(MediaCategory).map((key) => (
                                  <SelectItem
                                    key={key}
                                    value={
                                      MediaCategory[
                                        key as keyof typeof MediaCategory
                                      ]
                                    }
                                  >
                                    {MediaCategory[
                                      key as keyof typeof MediaCategory
                                    ]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Select the category of media
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-4">
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Save Changes
                      </Button>
                    </div>

                    {error && (
                      <div className="mt-4">
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>{error}</AlertTitle>
                          <AlertDescription>{errorText}</AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditMediaPopup;
