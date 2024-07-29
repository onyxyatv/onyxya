import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { CircleUser, LogOut, Settings } from "lucide-react";
import { FunctionComponent, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "@/utils/AuthContext";

const UserMenu: FunctionComponent = () => {
  const { logout } = useContext(AuthContext) || {};
  const authUserName: string | undefined = useContext(AuthContext)?.authUser?.username;

  const handleLogout = () => {
    if (logout) {
      logout();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mr-2">
        <Avatar className="bg-blue-950 rounded-full p-2">
          <AvatarFallback className="rounded-full text-white font-bold">
            {authUserName && authUserName[0].toUpperCase()}
            {!authUserName && "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-8">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <CircleUser className="mr-1 h-5" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-1 h-5" href="/settings" to="/settings" />{" "}
          <Link to="/settings">Parameters</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-1 h-5" /> Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
