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
import { FunctionComponent, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../utils/AuthContext";
import { useTranslation } from "react-i18next";

const UserMenu: FunctionComponent = () => {
  const { logout } = useContext(AuthContext) || {};
  const { t } = useTranslation();

  const handleLogout = () => {
    if (logout) {
      logout();
    }
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
        <DropdownMenuLabel>{t("userMenu.myAccount")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <CircleUser className="mr-1 h-5" /> {t("userMenu.profile")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-1 h-5" href="/settings" to="/settings" />{" "}
          <Link to="/settings">{t("userMenu.parameters")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-1 h-5" /> {t("userMenu.disconnect")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
