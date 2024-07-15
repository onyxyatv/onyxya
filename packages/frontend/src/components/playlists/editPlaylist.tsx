import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosResponse, HttpStatusCode } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/ui/select';
import FrontUtilService from '@/utils/frontUtilService';
import { Playlist } from '../models/playlist';
import { EditPlaylist, editPlaylistSchema } from '@common/validation/playlist/editPlaylist.schema';

interface EditPlaylistProps {
  playlist: Playlist;
  reloadPlaylist: (v: boolean) => void;
}

const EditPlaylistPopup = (props: EditPlaylistProps) => {
  const [popupOpened, setPopupOpened] = useState(false);
  const [error, setError] = useState("");
  const [errorText, setErrorText] = useState("No more details");
  
  const initialForm = useMemo(() => ({
    name: props.playlist.name,
    description: props.playlist.description,
    visibility: (props.playlist.visibility) ? props.playlist.visibility : 'private',
  }), [props.playlist.description, props.playlist.name, props.playlist.visibility]);

  const form = useForm<EditPlaylist>({
    resolver: zodResolver(editPlaylistSchema),
    mode: "onSubmit",
    defaultValues: initialForm,
  });

  const handleEditPlaylist = async (values: EditPlaylist) => {
    try {
      const finalEndpoint: string = 
        FrontUtilService.playlistById.replace(':id', props.playlist.id.toString());
      const res: AxiosResponse = await FrontUtilService.patchApi(finalEndpoint, values);
      if (res.status === HttpStatusCode.Created) {
        if (form !== undefined) {
          form.reset();
          setPopupOpened(false);
          props.reloadPlaylist(true);
        }
      }

    } catch (error: any) {
      const errorMessage: string = (error.response !== undefined) ? error.response.statusText : "No More details";
      setError('User creation failed. Please try again');
      setErrorText(`Error status : ${errorMessage}`);
    }
  }

  useEffect(() => {
    if (!popupOpened) form.reset();
    if (popupOpened) form.reset(initialForm);
  }, [props.playlist, form, popupOpened, initialForm]);

  return (
    <Dialog open={popupOpened} onOpenChange={setPopupOpened}>
      <DialogTrigger>
        <Button variant="secondary">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-100">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Edit Playlist #{props.playlist.id}</DialogTitle>
          <DialogDescription>
            <Card>
              <CardHeader>
                <CardDescription className="text-center">
                  You can edit all informations bellow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleEditPlaylist)}>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input className="border-slate-200 border-2 bg-slate-100" placeholder={props.playlist.name} {...field} />
                          </FormControl>
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
                              <Input className="border-slate-200 border-2 bg-slate-100" placeholder={props.playlist.description} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-2 flex justify-between">
                      <FormField
                        control={form.control}
                        name="visibility"
                        render={({ field }) => (
                          <FormItem className='w-full'>
                            <FormLabel>Visibility</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="p-2 rounded-md w-1/3 border-slate-200 border-2 bg-slate-100">
                                  <SelectValue placeholder="Choose" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="private">Private</SelectItem>
                                <SelectItem value="public">Public</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-3 -mb-4 flex flex-row justify-around">
                      <DialogClose>
                        <Button type="reset" variant="secondary">Close</Button>
                      </DialogClose>
                      <Button type="submit" variant="outline" className="bg-green-300 hover:bg-green-500">Save changes</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
              <CardFooter>
                {
                  error.length > 0 &&
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {error}
                      <br />
                      {errorText}
                    </AlertDescription>
                  </Alert>
                }
              </CardFooter>
            </Card>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlaylistPopup;