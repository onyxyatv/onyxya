import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import { AlertCircle, CirclePlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "../../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUser, createUserSchema } from "@common/validation/auth/createUser.schema";
import axios, { AxiosResponse, HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { api_url } from "../../../../config.json";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "../../ui/select";

const CreateUserPopup = () => {
  const [popupOpened, setPopupOpened] = useState(false);
  const [error, setError] = useState("");
  const [errorText, setErrorText] = useState("No more details");

  const form = useForm<CreateUser>({
    resolver: zodResolver(createUserSchema),
    mode: "onSubmit",
    defaultValues: {
      username: "",
      password: "",
      role: undefined,
    }
  });

  const handleCreateUser = async (values: CreateUser) => {
    try {
      console.log(values);
      const res: AxiosResponse = await axios.post(api_url + "/users/new", values, { withCredentials: true });
      if (res.status === HttpStatusCode.Created) {
        if (form !== undefined) {
          form.reset();
          setPopupOpened(false);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage: string = (error.response !== undefined) ? error.response.statusText : "No More details";
      setError('User creation failed. Please try again');
      setErrorText(`Error status : ${errorMessage}`);
    }
  }

  useEffect(() => {
    if (!popupOpened) form.reset();
  }, [form, popupOpened]);

  return (
    <Dialog open={popupOpened} onOpenChange={setPopupOpened}>
      <DialogTrigger>
        <Button>
          <CirclePlus className="mr-2" /> Add a user
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-100">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Créer un utilisateur</DialogTitle>
          <DialogDescription>
            <Card>
              <CardHeader>
                <CardDescription className="text-center">
                  Informations à remplir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCreateUser)}>
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input className="border-slate-200 border-2 bg-slate-100" placeholder="john" {...field} />
                          </FormControl>
                          <FormDescription>Used to identify</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="mt-2">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input className="border-slate-200 border-2 bg-slate-100" placeholder="**********" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-2">
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="p-2 rounded-md w-1/3 border-slate-200 border-2 bg-slate-100">
                                  <SelectValue placeholder="Choose" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-3 flex flex-row justify-around">
                      <DialogClose>
                        <Button type="reset" variant="destructive">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" variant="outline" className="bg-green-300 hover:bg-green-500">Confirm</Button>
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

export default CreateUserPopup;