import { AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditUser, editUserSchema } from '@common/validation/auth/editUser.schema';
import axios, { AxiosResponse, HttpStatusCode } from 'axios';
import { useEffect, useState } from 'react';
import { api_url } from '../../../../config.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import DeleteUserDialog from './deleteUserDialog';

const UserCardDetails = (props: { user: any }) => {
  const [error, setError] = useState("");
  const [errorText, setErrorText] = useState("No more details");

  const form = useForm<EditUser>({
    resolver: zodResolver(editUserSchema),
    mode: "onSubmit",
    defaultValues: {
      username: props.user.username,
      password: "",
      role: 'user',
      isActive: props.user.isActive.toString()
    }
  });

  const handleEditUser = async (values: EditUser) => {
    try {
      const res: AxiosResponse<any, any> = await axios.patch(api_url + `/users/user/${props.user.id}`, 
        values,
        { withCredentials: true }
      );
      if (res.status === HttpStatusCode.Ok) {
        console.log("ee");
      }
    } catch (error: any) {
      const errorMessage: string = (error.response !== undefined) ? error.response.statusText : "No More details";
      setError('User edition failed. Please try again');
      setErrorText(`Error status : ${errorMessage}`);
    }
  }

  useEffect(() => {
    console.log(props.user);
  }, [props.user]);

  return (
    <Card>
      <CardHeader>
        <CardDescription className="text-center">
          User's informations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEditUser)}>
            <div className="flex flex-row justify-around">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input className="border-slate-200 border-2 w-72 bg-slate-100" placeholder={props.user.username} {...field} />
                    </FormControl>
                    <FormDescription>Public username</FormDescription>
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
                      <Input className="border-slate-200 border-2 w-72 bg-slate-100" placeholder="**********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <div>
                        <Select defaultValue={props.user.role.name}>
                          <SelectTrigger className="p-2 rounded-md border-slate-200 border-2 bg-slate-100">
                            <div className="flex flex-row items-center justify-center">
                              <SelectValue {...field} />
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

            <div className="flex flex-row justify-around">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <div>
                        <Select defaultValue={props.user.isActive.toString()}>
                          <SelectTrigger className="p-2 rounded-md border-slate-200 border-2 bg-slate-100">
                            <div className="flex flex-row items-center justify-center">
                              <SelectValue {...field} />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Not Active</SelectItem>
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
              <DeleteUserDialog userId={props.user.id} />
              <Button variant="outline" className="bg-green-300 hover:bg-green-500">Save changes</Button>
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
  );
};

export default UserCardDetails;