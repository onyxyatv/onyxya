import { useContext } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import AdminRoleSettings from "./roles/adminRoleSettings";
import UserRoleSettings from "./roles/userRoleSettings";
import AuthContext from "@/utils/AuthContext";
import { Alert } from "../ui/alert";


const RolesAdminSettings = () => {

  const perms = useContext(AuthContext)?.authUser?.permissions;
  
  if (!perms?.includes("admin_roles")) {
    return (
      <Alert variant={"destructive"}>You don't have access to this ressource</Alert>
    )
  }

  return (
    <section>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>
            Onyxya Role's Administration Panel
          </CardTitle>
          <CardDescription>
            This section allows you to manage roles and their permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-2 border-2 border-gray-200 rounded-md">
            <AdminRoleSettings />
            <UserRoleSettings />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default RolesAdminSettings;