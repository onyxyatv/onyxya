import useGetUsers from "@/hooks/useGetUsers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { UsersDataTable } from "./users/userDataTable";
import { userColumns } from "./users/userColumns";
import CreateUserPopup from "./users/createUserPopup";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/utils/AuthContext";
import { Alert } from "../ui/alert";

const UserAdminSettings = () => {
  const [usersList, setUsers] = useGetUsers();
  const [needReload, reloadUsers] = useState(false);
  const perms = useContext(AuthContext)?.authUser?.permissions;

  useEffect(() => {
    setUsers();
    if (needReload) reloadUsers(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needReload]);

  if (!perms?.includes("admin_users")) {
    return (
      <Alert variant={"destructive"}>You don't have access to this ressource</Alert>
    )
  }

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
          <CreateUserPopup reloadUsers={() => reloadUsers(true)} />
          <div className="mt-2 border-2 border-gray-200 rounded-md">
            <UsersDataTable columns={userColumns} data={usersList} />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default UserAdminSettings;