import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FrontUtilService from "@/utils/frontUtilService";
import {
  MediaCard,
  MediaCategory,
  MediaType,
  mediaCardSchema,
  MediaVisibility,
} from "@common/validation/media/mediaCard.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosResponse, HttpStatusCode } from "axios";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "../../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Switch } from "../../ui/switch";
import { toast } from "../../ui/use-toast";

type EditMediaPopupProps = {
  mediaId: number;
  onUpdate?: () => void;
  disabled?: boolean;
};

/*const formatDate = (date: Date) => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};*/

const EditMediaDialog = ({
  mediaId,
  onUpdate,
  disabled,
}: EditMediaPopupProps) => {
  const [error, setError] = useState("");
  const [errorText, setErrorText] = useState("No more details");
  const { t } = useTranslation();
  //const perms = useContext(AuthContext)?.authUser?.permissions;
  const [popupOpened, setPopupOpened] = useState(false);

  const form = useForm<MediaCard>({
    resolver: zodResolver(mediaCardSchema),
    mode: "onSubmit",
    defaultValues: {},
  });

  const handleEditMedia = async (values: MediaCard) => {
    try {
      const res: AxiosResponse = await FrontUtilService.patchApi(
        `/mediacard/${values.id}`,
        values
      );
      if (res.status === HttpStatusCode.Ok) {
        if (form) {
          //form.reset();
          if (onUpdate) {
            onUpdate();
            setPopupOpened(false);
          }
        }

        toast({
          title: "Media updated",
          description: "Media has been updated successfully",
          variant: "default",
        });
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage: string =
        error.response !== undefined
          ? error.response.statusText
          : "No More details";
      setError("Media update failed. Please try again");
      setErrorText(`Error status : ${errorMessage}`);
    }
  };

  const fetchMediaCard = async () => {
    const card: MediaCard = await FrontUtilService.getDataFromApi(
      `/mediacard/media/${mediaId}`
    );
    if (card) {
      form.reset(card);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      fetchMediaCard();
    }
    setPopupOpened(isOpen);
  };

  return (
    <Dialog open={popupOpened} onOpenChange={handleOpenChange}>
      {!disabled ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="m-1">
            {t("media.table.action.edit")}
          </Button>
        </DialogTrigger>
      ) : (
        <Button variant="outline" size="sm" className="m-1" disabled>
          {t("media.table.action.edit")}
        </Button>
      )}
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
                              value={field.value ?? ""}
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
                                value={field.value ?? ""}
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

                    <div className="mt-2 flex justify-between">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select
                              value={field.value ?? ""}
                              onValueChange={field.onChange}
                            >
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

                      <FormField
                        control={form.control}
                        name="visibility"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Visibility</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className="p-2 rounded-md w-full border-slate-200 border-2 bg-slate-100">
                                  <SelectValue placeholder="Choose visibility" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.keys(MediaVisibility).map((key) => (
                                  <SelectItem
                                    key={key}
                                    value={
                                      MediaVisibility[key as keyof typeof MediaVisibility]
                                    }
                                  >
                                    {MediaVisibility[key as keyof typeof MediaVisibility]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Select media visibility
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
                            <Select
                              value={field.value ?? ""}
                              onValueChange={field.onChange}
                            >
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
                                    {
                                      MediaCategory[
                                      key as keyof typeof MediaCategory
                                      ]
                                    }
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

                    <div className="mt-2">
                      <FormField
                        control={form.control}
                        name="releaseDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Release Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                className="border-slate-200 border-2 bg-slate-100"
                                value={
                                  field.value ? FrontUtilService.formatDate(field.value) : ""
                                }
                                onChange={(e) =>
                                  field.onChange(new Date(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Select the release date of the media
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="mt-2">
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Active</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value ?? false}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormDescription>
                              Toggle to activate or deactivate media
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

export default EditMediaDialog;
