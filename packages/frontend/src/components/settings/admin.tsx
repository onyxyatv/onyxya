import useGetUsers from "@/hooks/useGetUsers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { UsersDataTable } from "./userDataTable";
import { userColumns } from "./userColumns";
import CreateUserPopup from "./createUserPopup";

const AdminSettings = () => {
  const usersList: Array<any> = useGetUsers();

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

export default AdminSettings;