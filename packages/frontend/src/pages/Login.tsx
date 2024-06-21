import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  LoginUser,
  loginSchema,
} from "@common/validation/auth/login.schema.ts";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosResponse } from "axios";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api_url } from "../../config.json";
import { useGetAuthUser } from "../hooks/useGetAuthUser.ts";

/**
 * This component is used to render the login page.
 * */
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authUser = useGetAuthUser();

  useEffect(() => {
    if (authUser) {
      window.location.href = "/home";
    }
  }, [authUser]);

  const form = useForm<LoginUser>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (values: LoginUser) => {
    setIsSubmitting(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: AxiosResponse<any> = await axios.post(
        api_url + "/login",
        values,
        { withCredentials: true }
      );
      if (res.status === 200) {
        localStorage.setItem("onyxyaToken", res.data.jwt);
        window.location.href = "/home";
      }
      setIsSubmitting(false);
    } catch (e) {
      setError("Login or password is incorrect. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={"h-screen w-screen flex items-center justify-center"}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className={"w-1/5"}>
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Please login to access your account.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <Alert variant="destructive" className={"mb-4"}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <FormField
                control={form.control}
                name={"username"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={"Username"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={"password"}
                render={({ field }) => (
                  <FormItem className="pt-3">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                          placeholder={"Password"}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <FontAwesomeIcon
                            icon={showPassword ? faEye : faEyeSlash}
                          />
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter>
              {isSubmitting ? (
                <Button type={"submit"} variant={"default"} disabled>
                  Loading...
                </Button>
              ) : (
                <Button type={"submit"} variant={"default"}>
                  Login
                </Button>
              )}
            </CardFooter>
            {authUser && (
              <p className="text-center text-sm text-gray-500 mt-4">
                You are already logged in as {authUser.username}.{" "}
              </p>
            )}
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default Login;
