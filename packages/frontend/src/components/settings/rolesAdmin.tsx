import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import AdminRoleSettings from "./roles/adminRoleSettings";
import UserRoleSettings from "./roles/userRoleSettings";

const RolesAdminSettings = () => {
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