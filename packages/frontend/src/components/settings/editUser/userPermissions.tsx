import FrontUserService from "@/utils/frontUserService";
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

const UserPermissionsList = (props: { userId: number, userName: string }) => {
  const userId: number = props.userId;
  const userName: string = props.userName;
  const [permData, setPermissions] = useState([]);
  const [permissionsError, setPermissionsError] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchUserPermissionsList = async () => {
    const endpoint: string = `/users/user/${userId}/permissions`;
    const data: any = await FrontUserService.getDataFromApi(endpoint);
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
              <TableRow className={!permission.isUser ? 'bg-gray-200' : ''}>
                <TableCell>
                  {
                    permission.isUser &&
                    <Checkbox onCheckedChange={setPermStatus} />
                  }
                  {
                    !permission.isUser &&
                    <Checkbox checked={true} />
                  }
                </TableCell>
                <TableCell className="font-medium">{permission.name}</TableCell>
                <TableCell>{permission.description}</TableCell>
                <TableCell>
                  {
                    (permission.isUser) ?
                      'Permission is owned by the user' : 'Permission is owned by the role'
                  }
                </TableCell>
              </TableRow>
            );
          })
        }
      </TableBody>
    </Table>
  );
}

export default UserPermissionsList;