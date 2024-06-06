import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FunctionComponent } from "react";
import { CircleUser, LogOut, Settings } from "lucide-react";

const UserMenu: FunctionComponent = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mr-2">
        <Avatar>
          <AvatarImage className="rounded-full w-10" src="https://github.com/shadcn.png" />
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
          <Settings className="mr-1 h-5" /> Parameters
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogOut className="mr-1 h-5" /> Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;