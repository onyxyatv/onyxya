import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const RolesAdminSettings = () => {
  return (
    <section>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>
            Onyxya Administration Panel
          </CardTitle>
          <CardDescription>
            This section allows you to manage roles and their permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-2 border-2 border-gray-200 rounded-md">
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default RolesAdminSettings;