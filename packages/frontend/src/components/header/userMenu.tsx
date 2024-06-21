import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { CircleUser, LogOut, Settings } from "lucide-react";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";

const UserMenu: FunctionComponent = () => {
  const onDisconnect = () => {
    localStorage.removeItem("onyxyaToken");
    window.location.href = "/";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mr-2">
        <Avatar>
          <AvatarImage
            className="rounded-full w-10"
            src="https://github.com/shadcn.png"
          />
          <AvatarFallback>CN</AvatarFallback>
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
        <DropdownMenuItem onClick={onDisconnect}>
          <LogOut className="mr-1 h-5" /> Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
