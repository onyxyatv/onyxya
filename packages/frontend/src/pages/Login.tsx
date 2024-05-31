import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useForm } from "react-hook-form";
import { LoginSchema, LoginSchemaDto } from "@common/validation/auth/login.schema.ts";
import { zodResolver } from "@hookform/resolvers/zod";

const Login = () => {

  const form = useForm<LoginSchemaDto>({
    resolver: zodResolver(LoginSchema),
    mode: "onSubmit",
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const handleSubmit = (values: LoginSchemaDto) => {
    console.log(values);
  }


  return (
    <Form {...form}>
      <form onSubmit={ form.handleSubmit(handleSubmit) }>
        <Card>

          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Please login to access your account.</CardDescription>
          </CardHeader>

          <CardContent>
            <FormField control={ form.control } name={"username"} render={ ({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={"Username"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
            } />

            <FormField control={ form.control } name={"password"} render={ ({ field }) => (
              <FormItem className="pt-3">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type={"password"} {...field} placeholder={"Password"}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )
            }/>
          </CardContent>

          <CardFooter>
            <Button type={"submit"} variant={"default"}>Login</Button>
          </CardFooter>

        </Card>
      </form>
    </Form>
  );
}

export default Login;