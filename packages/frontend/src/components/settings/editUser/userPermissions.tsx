import FrontUtilService from "@/utils/frontUtilService";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const UserPermissionsList = (props: { userId: number, userName: string }) => {
  const userId: number = props.userId;
  const userName: string = props.userName;
  const [permData, setPermissions] = useState([]);
  const [permissionsError, setPermissionsError] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchUserPermissionsList = async () => {
    const endpoint: string = `/users/user/${userId}/permissions`;
    const data: any = await FrontUtilService.getDataFromApi(endpoint);
    if (data !== null) {
      setPermissions(data.permissions);
    } else {
      setPermissionsError("User's permissions cannot be found!");
    }
  }

  const setPermStatus = async (status: any) => {
    console.log(status);
  }

  useEffect(() => {
    fetchUserPermissionsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <section className="w-full">
      <ScrollArea className="h-[280px] w-full pr-3 fill-slate-700">
        <Table className="mt-2 border-2 border-gray-300">
          <TableCaption>
            {
              permissionsError.length === 0 &&
              <p>Permissions list of {userName}</p>
            }
            {
              permissionsError.length > 1 &&
              <p>{permissionsError}</p>
            }
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Is Owned</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Nb</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              permData.length > 0 &&
              permData.map((permission: any) => {
                return (
                  <TableRow className={(permission.isUser === false) ? 'bg-gray-400 hover:bg-gray-500' : ''}>
                    <TableCell>
                      {
                        permission.owned && permission.isUser &&
                        <Checkbox defaultChecked={true} aria-checked={true} onCheckedChange={setPermStatus} />
                      }
                      {
                        permission.owned && !permission.isUser &&
                        <Checkbox className="hover:cursor-not-allowed" checked={true} />
                      }
                      {
                        !permission.owned && <Checkbox onCheckedChange={setPermStatus} />
                      }
                    </TableCell>
                    <TableCell className="font-medium">{permission.name}</TableCell>
                    <TableCell>{permission.description}</TableCell>
                    <TableCell>
                      {
                        permission.owned && ((permission.isUser) ?
                          'Permission is owned by the user' : 'Permission is owned by the role')
                      }
                    </TableCell>
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="mt-2 flex flex-row justify-end align-middle">
        <Button variant="outline" className="bg-green-300 hover:bg-green-500">Save Permissions</Button>
      </div>
    </section>
  );
}

export default UserPermissionsList;