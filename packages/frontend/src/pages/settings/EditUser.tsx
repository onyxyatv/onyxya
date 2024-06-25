import Header from "@/components/header/header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import UserCardDetails from "@/components/settings/editUser/userCard";
import FrontUtilService from "@/utils/frontUtilService";
import { User } from "@/components/models/user";
import UserPermissionsList from "@/components/settings/editUser/userPermissions";

const EditUser = () => {
  const { id }: any = useParams();
  const [userId, setUserId] = useState(id);
  const [user, setUser]: any = useState(null);
  const navigate = useNavigate();
  const [reloadStatus, setReloadStatus] = useState(false);

  useEffect(() => {
    const checkId = Number.parseInt(id);
    if (isNaN(checkId)) {
      setUserId(null);
    } else {
      setUserId(checkId);
      const fetchUser = async () => {
        const user: User = await FrontUtilService.getUserById(checkId);
        setUser(user);
      };
      fetchUser();
    }
    if (reloadStatus) setReloadStatus(false);
  }, [id, reloadStatus]);

  return (
    <div className="mb-3">
      <Header />
      <section className="mt-2 m-auto max-w-7xl">
        <ArrowLeft
          className="w-5 hover:cursor-pointer"
          onClick={() => navigate("/settings/users-administration")}
        />
        <h2 className="text-2xl font-bold">Edit user #{id}</h2>
        {userId !== null && user !== null && (
          <Card>
            <CardHeader>
              <CardDescription className="text-center text-2xl font-bold">
                {user.username[0].toUpperCase() + user.username.slice(1)}'s card
              </CardDescription>
            </CardHeader>
            <CardContent>
              {
                user !== null &&
                <UserCardDetails setReloadStatus={setReloadStatus} user={user} />
              }
            </CardContent>
            <CardFooter className="min-w-max flex flex-col">
              <h3 className="text-xl font-bold text-gray-700">Permissions</h3>
              <p>
                Permissions obtained via the role are not removable.
              </p>
              <UserPermissionsList userId={user.id} reloadStatus={reloadStatus} userName={user.username} />
            </CardFooter>
          </Card>
        )}
        {userId === null && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-2xl">Error</AlertTitle>
            <AlertDescription className="text-lg">
              User with that id not found!
            </AlertDescription>
          </Alert>
        )}
      </section>
    </div>
  );
};

export default EditUser;
