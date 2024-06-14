import useGetUsers from "@/hooks/useGetUsers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { UsersDataTable } from "./users/userDataTable";
import { userColumns } from "./users/userColumns";
import CreateUserPopup from "./users/createUserPopup";
import { User } from "@/components/models/user";

const UserAdminSettings = () => {
  const usersList: Array<User> = useGetUsers();

  return (
    <section>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>
            Onyxya Administration Panel
          </CardTitle>
          <CardDescription>
            This section allows you to manage users and their permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateUserPopup />
          <div className="mt-2 border-2 border-gray-200 rounded-md">
            <UsersDataTable columns={userColumns} data={usersList} />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default UserAdminSettings;