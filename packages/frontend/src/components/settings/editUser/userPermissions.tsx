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
import { AxiosResponse, HttpStatusCode } from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BookmarkCheck } from "lucide-react";

const UserPermissionsList = (props: { userId: number, userName: string, reloadStatus: boolean }) => {
  const userId: number = props.userId;
  const userName: string = props.userName;
  const [permData, setPermissions] = useState([]);
  const [permissionsError, setPermissionsError] = useState('');
  const [error, setError] = useState('');
  const [errorText, setErrorText] = useState('No more details');
  const [successMessage, setSuccessMessage] = useState('');
  const [reloadPermsStatus, setReloadPermsStatus] = useState(false);

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

  const saveUserPermissions = (): void => {
    const permissionsList: Array<number> = [];
    const permissionsBoxes: NodeListOf<Element> = document.querySelectorAll('.permission-status-box');
    permissionsBoxes.forEach((permissionBox) => {
      if (permissionBox.getAttribute('data-state') === 'checked') {
        const permId: string | null = permissionBox.getAttribute('itemid');
        if (permId !== null) permissionsList.push(Number.parseInt(permId));
      }
    });

    setNewUserPermissions(permissionsList);
  }

  const setNewUserPermissions = async (permissionsList: Array<number>): Promise<void> => {
    try {
      const data = { userId: props.userId, permissions: permissionsList };
      const endpoint = FrontUtilService.setUserPermissionsEndpoint;
      const resApi: AxiosResponse = await FrontUtilService.postApi(endpoint, data);
      if (resApi.status === HttpStatusCode.Ok) {
        setSuccessMessage("User's permissions updated!");
        setReloadPermsStatus(true);
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (error: any) {
      const errorMessage: string = (error.response !== undefined) ? error.response.statusText : "No More details";
      setError('User edition failed. Please try again');
      setErrorText(`Error status : ${errorMessage}`);
    }
  }

  useEffect(() => {
    fetchUserPermissionsList();
    if (reloadPermsStatus) setReloadPermsStatus(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, props.reloadStatus, reloadPermsStatus]);

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
                        <Checkbox itemID={permission.id}
                          // Permission is not owned
                          {...(!permission.owned ? { onCheckedChange: setPermStatus } : {})}
                          // Permission owned by user
                          {...(permission.owned && permission.isUser ?
                            {
                              defaultChecked: true,
                              'aria-checked': true,
                              onCheckedChange: setPermStatus
                            } : {})
                          }
                          // Permission owned by user role
                          {...(permission.owned && !permission.isUser ?
                            {
                              className: 'hover:cursor-not-allowed',
                              checked: true
                            }
                            : {})
                          }
                          {...
                          (!permission.owned || permission.isUser) &&
                          { className: 'permission-status-box' }
                          }
                        />
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
        <Button onClick={() => saveUserPermissions()}
          variant="outline" className="bg-green-300 hover:bg-green-500">
          Save Permissions
        </Button>
      </div>
      {
        error.length > 0 &&
        <Alert variant="destructive" className="mt-2 mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <br />
            {errorText}
          </AlertDescription>
        </Alert>
      }
      {
        successMessage.length > 0 &&
        <Alert variant="default" className="mb-4 mt-2 border-green-500 text-green-500">
          <BookmarkCheck color="#22c55e" className="h-4 w-4" />
          <AlertTitle>Edition Result</AlertTitle>
          <AlertDescription>
            {successMessage}
          </AlertDescription>
        </Alert>
      }
    </section>
  );
}

export default UserPermissionsList;