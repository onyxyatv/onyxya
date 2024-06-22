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
import { BadgeCheck, X } from "lucide-react";

const PermissionsList = (props: { role: any; }) => {
  const roleName = props.role;
  const [permData, setPermissions] = useState({ owned: [], missing: [] });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchPermissionsList = async () => {
    const endpoint: string = `/permissions/roles?role=${roleName}`;
    const data: any = await FrontUtilService.getDataFromApi(endpoint);
    if (data !== null) setPermissions({
      owned: data.owned.permissions,
      missing: data.missing.permissions
    });
  }

  useEffect(() => {
    fetchPermissionsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleName]);

  return (
    <Table>
      <TableCaption>
        Permissions list of this role
        {
          roleName === 'admin' && <p>Admin role own all permissions</p>
        }
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          permData.owned.length > 0 &&
          permData.owned.map((permission: any) => {
            return (
              <TableRow>
                <TableCell className="font-medium">{permission.name}</TableCell>
                <TableCell>{permission.description}</TableCell>
                <TableCell>{(permission.isActive) ?
                  <BadgeCheck className="ml-2" color="#2ec27e" /> : <X />}</TableCell>
              </TableRow>
            );
          })
        }
        {/* We'll need a small refactoring */}
        {
          permData.missing.length > 0 &&
          permData.missing.map((permission: any) => {
            return (
              <TableRow>
                <TableCell className="font-medium">{permission.name}</TableCell>
                <TableCell>{permission.description}</TableCell>
                <TableCell><X className="ml-2" color="#dc143c" /></TableCell>
              </TableRow>
            );
          })
        }
      </TableBody>
    </Table>
  );
}

export default PermissionsList;