import useGetUsers from "@/hooks/useGetUsers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, 
  TableCaption, TableCell, TableHead, 
  TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { CirclePlus } from "lucide-react";

const AdminSettings: React.FC = () => {
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
          <Button>
            <CirclePlus className="mr-2" /> Add a user
          </Button>
          <Table className="mt-1 border-2 border-gray-200">
            <TableCaption>Users's list</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Id</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">See more / Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                usersList.map((user) => {
                  return (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                    </TableRow>
                  );
                })
              }
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}

export default AdminSettings;