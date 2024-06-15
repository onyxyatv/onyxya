import Header from "@/components/header/header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import UserCardDetails from "@/components/settings/editUser/userCard";
import FrontUserService from "@/utils/frontUserService";
import { User } from "@/components/models/user";


const EditUser = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { id }: any = useParams();
  const [userId, setUserId] = useState(id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser]: any = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkId = Number.parseInt(id);
    if (isNaN(checkId)) {
      setUserId(null);
    } else {
      setUserId(checkId);
      const fetchUser = async () => {
        const user: User = await FrontUserService.getUserById(checkId);
        setUser(user);
      }
      fetchUser();
    }
  }, [id]);

  return (
    <div>
      <Header />
      <section className="mt-2 m-auto max-w-7xl">
        <ArrowLeft className="w-5 hover:cursor-pointer" onClick={() => navigate("/settings/users-administration")} />
        <h2 className="text-2xl font-bold">Edit user #{id}</h2>
        {
          userId !== null && user !== null &&
          <Card>
            <CardHeader>
              <CardDescription className="text-center text-2xl font-bold">
                  {user.username[0].toUpperCase() + user.username.slice(1)}'s card
              </CardDescription>
            </CardHeader>
            <CardContent>
              {
                user !== null &&
                <UserCardDetails user={user} />
              }
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
        }
        {
          userId === null &&
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-2xl">Error</AlertTitle>
            <AlertDescription className="text-lg">
              User with that id not found!
            </AlertDescription>
          </Alert>
        }
      </section>
    </div>
  );
};

export default EditUser;