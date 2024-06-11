import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { AlertCircle, CirclePlus } from "lucide-react";
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

const CreateUserPopup = () => {
  const [error, setError] = useState("");

  const form = useForm<CreateUser>({
    resolver: zodResolver(createUserSchema),
    mode: "onSubmit",
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const handleCreateUser = async (values: CreateUser) => {
    try {
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Créer un utilisateur</DialogTitle>
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
                            <Input placeholder="john" {...field} />
                          </FormControl>
                          <FormDescription>Used to identify</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="**********" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="mt-2 flex flex-row justify-around">
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