import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { AlertCircle, ChevronDown, CirclePlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUser, createUserSchema } from "@common/validation/auth/createUser.schema";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { api_url } from "../../../config.json";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { SelectTrigger } from "@radix-ui/react-select";

const CreateUserPopup = () => {
  const [error, setError] = useState("");

  const form = useForm<CreateUser>({
    resolver: zodResolver(createUserSchema),
    mode: "onSubmit",
    defaultValues: {
      username: "",
      password: "",
      role: "user"
    }
  });

  const handleCreateUser = async (values: CreateUser) => {
    try {
      console.log(values);
      const res: AxiosResponse<any, any> = await axios.post(api_url + "/users/new", values, { withCredentials: true });
      console.log(res.status);
    } catch (error) {
      setError("User creation failed. Please try again.");
    }
  }

  return (
    <Dialog>
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
                            <FormControl>
                              <div>
                                <Select>
                                  <SelectTrigger className="p-2 rounded-md border-slate-200 border-2 bg-slate-100">
                                    <div className="flex flex-row items-center justify-center">
                                      <SelectValue placeholder="Choose" {...field} />
                                      <ChevronDown className="ml-4 bg-slate-100 text-slate-500" />
                                    </div>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-3 flex flex-row justify-around">
                      <Button type="reset" variant="destructive">Cancel</Button>
                      <Button variant="outline" className="bg-green-300 hover:bg-green-500">Confirm</Button>
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